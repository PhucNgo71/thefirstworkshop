const {OrderError} = require('./orders.cjs');
const APPROVED_STORE = 'store_flQpNhtTqKKBBTIw';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

// No public upload/read route. Only the production server's automatically
// rotated Vercel identity can access this private store.
function blobStore(env = process.env, sdk = require('@vercel/blob')) {
  function ready() {
    if (env.BLOB_STORE_ID !== APPROVED_STORE || env.VERCEL_ENV !== 'production') {
      throw new OrderError('ORDER_STORAGE_NOT_CONFIGURED', 503);
    }
  }
  function path(id) {
    if (!UUID.test(id)) throw new OrderError('INVALID_REQUEST_ID');
    return `orders/v1/${id}.json`;
  }
  const options = () => ({access:'private', storeId:APPROVED_STORE, abortSignal:AbortSignal.timeout(12000)});
  function tagged(data, etag) {
    if (!etag || !data.order || !UUID.test(data.order.requestId) || !/^[a-f0-9]{64}$/.test(data.fingerprint)) throw new OrderError('ORDER_STORAGE_INVALID',503);
    Object.defineProperty(data, '_etag', {value:etag, writable:true, enumerable:false});
    return data;
  }
  async function read(id) {
    const result = await sdk.get(path(id), {...options(), useCache:false});
    if (!result) return null;
    if (result.statusCode !== 200 || result.blob.size > 100000) throw new OrderError('ORDER_STORAGE_INVALID',503);
    const raw = await new Response(result.stream).text();
    if (Buffer.byteLength(raw) > 100000) throw new OrderError('ORDER_STORAGE_INVALID',503);
    const data = JSON.parse(raw);
    if (data.order?.requestId !== id || data.schemaVersion !== 1) throw new OrderError('ORDER_STORAGE_INVALID',503);
    return tagged(data, result.blob.etag);
  }
  async function write(record, extra = {}) {
    return sdk.put(path(record.order.requestId), JSON.stringify(record), {
      ...options(), contentType:'application/json', addRandomSuffix:false,
      cacheControlMaxAge:60, allowOverwrite:false, ...extra
    });
  }
  return {
    async createOrGet(order, fingerprint, row) {
      ready();
      const fresh = {schemaVersion:1, order, fingerprint, row, emailStatus:'Pending', excelStatus:'Pending', updatedAt:order.orderDate};
      try {
        const saved = await write(fresh);
        return tagged(fresh, saved.etag);
      } catch (error) {
        // An existing pathname or a lost write response can both be reconciled
        // by reading the durable record. Never overwrite to resolve a conflict.
        const existing = await read(order.requestId);
        if (existing) return existing;
        throw new OrderError('ORDER_STORAGE_UNAVAILABLE',503);
      }
    },
    async claimEmail(record) {
      ready();
      if (record.emailStatus !== 'Pending' || !record._etag) return false;
      const next = {...record, emailStatus:'Sending', updatedAt:new Date().toISOString()};
      try {
        const saved = await write(next, {allowOverwrite:true, ifMatch:record._etag});
        Object.assign(record,next); record._etag=saved.etag;
        return true;
      } catch (error) {
        // A competing or ambiguous claim must never send. A fresh read exposes
        // the actual status; a stranded Sending record needs manual review.
        const current = await read(record.order.requestId);
        if (current) {Object.assign(record,current); record._etag=current._etag;}
        if (error instanceof sdk.BlobPreconditionFailedError) return false;
        throw new OrderError('ORDER_CLAIM_UNCERTAIN',503);
      }
    },
    async emailResult(record, status, providerId) {
      ready();
      if (!['Accepted','NeedsReview'].includes(status) || !record._etag) throw new OrderError('INVALID_EMAIL_STATUS',503);
      const next = {...record, emailStatus:status, updatedAt:new Date().toISOString()};
      if (providerId) next.emailProviderId=providerId;
      const saved = await write(next, {allowOverwrite:true, ifMatch:record._etag});
      Object.assign(record,next); record._etag=saved.etag;
    }
  };
}
module.exports={blobStore, APPROVED_STORE};
