const {APPROVED_STORE} = require('./blob-store.cjs');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
class AdminError extends Error { constructor(code, status = 400) {super(code); this.status = status;} }
function orderReader(env = process.env, sdk = require('@vercel/blob')) {
  function ready() {
    if (env.VERCEL_ENV !== 'production' || env.BLOB_STORE_ID !== APPROVED_STORE) throw new AdminError('ORDER_STORAGE_NOT_CONFIGURED', 503);
  }
  const options = () => ({storeId: APPROVED_STORE, abortSignal: AbortSignal.timeout(12000)});
  async function read(id) {
    ready();
    if (typeof id !== 'string' || !UUID.test(id)) throw new AdminError('INVALID_ORDER_ID');
    const result = await sdk.get(`orders/v1/${id}.json`, {...options(), access: 'private', useCache: false});
    if (!result) throw new AdminError('ORDER_NOT_FOUND', 404);
    if (result.statusCode !== 200 || result.blob.size > 100000) throw new AdminError('INVALID_ORDER_RECORD', 503);
    const raw = await new Response(result.stream).text();
    if (Buffer.byteLength(raw) > 100000) throw new AdminError('INVALID_ORDER_RECORD', 503);
    const record = JSON.parse(raw);
    if (record.schemaVersion !== 1 || record.order?.requestId !== id || !record.order.customer || !Array.isArray(record.order.items)) throw new AdminError('INVALID_ORDER_RECORD', 503);
    return record;
  }
  function summary(record) {
    const o = record.order;
    return {id: o.requestId, orderNumber: o.orderNumber, orderDate: o.orderDate,
      customerName: o.customer.name, email: o.customer.email, phone: o.customer.phone,
      subtotal: o.subtotal, currency: o.currency, totalQuantity: o.items.reduce((n, item) => n + item.quantity, 0),
      orderStatus: o.orderStatus, paymentStatus: o.paymentStatus, emailStatus: record.emailStatus,
      isTest: /^TEST\b/i.test(o.customer.name || '')};
  }
  return {
    async list(cursor) {
      ready();
      if (cursor !== undefined && (typeof cursor !== 'string' || cursor.length > 4096 || /[\r\n]/.test(cursor))) throw new AdminError('INVALID_CURSOR');
      const result = await sdk.list({...options(), prefix: 'orders/v1/', limit: 50, ...(cursor ? {cursor} : {})});
      const ids = result.blobs.map(b => b.pathname.match(/^orders\/v1\/([0-9a-f-]+)\.json$/)?.[1]).filter(id => id && UUID.test(id));
      const orders = [], failed = [];
      // Bound concurrency; one corrupt record must not hide the remaining orders.
      for (let i = 0; i < ids.length; i += 5) {
        const batch = await Promise.allSettled(ids.slice(i, i + 5).map(read));
        batch.forEach((item, j) => item.status === 'fulfilled' ? orders.push(summary(item.value)) : failed.push(ids[i + j]));
      }
      if (result.hasMore && !result.cursor) throw new AdminError('INVALID_STORAGE_PAGE', 503);
      return {orders, hasMore: !!result.hasMore, cursor: result.hasMore ? result.cursor : null, unreadableCount: failed.length};
    },
    async detail(id) {
      const r = await read(id);
      // Do not expose storage URLs, fingerprints, provider tokens or internal leases.
      return {order: r.order, emailStatus: r.emailStatus, updatedAt: r.updatedAt};
    }
  };
}
module.exports = {orderReader, AdminError};
