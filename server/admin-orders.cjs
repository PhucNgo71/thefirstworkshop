const {APPROVED_STORE} = require('./blob-store.cjs');
const {allowed} = require('./admin-auth.cjs');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const ORDER_STATUSES = ['Received', 'Processing', 'Delivering', 'Completed', 'Cancelled'];
const PAYMENT_STATUSES = ['Unpaid', 'Paid'];
class AdminError extends Error { constructor(code, status = 400) {super(code); this.status = status;} }
function orderReader(env = process.env, sdk = require('@vercel/blob')) {
  function ready() {
    if (env.VERCEL_ENV !== 'production' || env.BLOB_STORE_ID !== APPROVED_STORE) throw new AdminError('ORDER_STORAGE_NOT_CONFIGURED', 503);
  }
  const options = () => ({storeId: APPROVED_STORE, abortSignal: AbortSignal.timeout(12000)});
  // Keep operational updates separate from the original order/email record.
  // Conditional writes prevent two admin tabs from silently overwriting each other.
  async function readStatus(id) {
    const result = await sdk.get(`order-status/v1/${id}.json`, {...options(), access: 'private', useCache: false});
    if (!result) return null;
    if (result.statusCode !== 200 || result.blob.size > 300000 || !result.blob.etag) throw new AdminError('INVALID_STATUS_RECORD', 503);
    const raw = await new Response(result.stream).text();
    if (Buffer.byteLength(raw) > 300000) throw new AdminError('INVALID_STATUS_RECORD', 503);
    const data = JSON.parse(raw);
    if (data.schemaVersion !== 1 || data.orderId !== id || !Number.isSafeInteger(data.version) || data.version < 1 || !ORDER_STATUSES.includes(data.orderStatus) || !PAYMENT_STATUSES.includes(data.paymentStatus) || !Array.isArray(data.history)) throw new AdminError('INVALID_STATUS_RECORD', 503);
    return {data, etag: result.blob.etag};
  }
  function withStatus(record, status) {
    if (!status) return record;
    return {...record, order: {...record.order, orderStatus: status.data.orderStatus, paymentStatus: status.data.paymentStatus}};
  }
  async function detail(id) {
    const original = await read(id), status = await readStatus(id), r = withStatus(original, status);
    return {order: r.order, emailStatus: r.emailStatus, updatedAt: r.updatedAt,
      statusVersion: status?.data.version || 0, statusHistory: status?.data.history || []};
  }
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
        const batch = await Promise.allSettled(ids.slice(i, i + 5).map(async id => withStatus(await read(id), await readStatus(id))));
        batch.forEach((item, j) => item.status === 'fulfilled' ? orders.push(summary(item.value)) : failed.push(ids[i + j]));
      }
      if (result.hasMore && !result.cursor) throw new AdminError('INVALID_STORAGE_PAGE', 503);
      return {orders, hasMore: !!result.hasMore, cursor: result.hasMore ? result.cursor : null, unreadableCount: failed.length};
    },
    detail,
    async updateStatus(input, actor) {
      ready();
      if (!allowed(actor?.id)) throw new AdminError('UNAUTHORIZED', 401);
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k => !['id','expectedVersion','updateId','orderStatus','paymentStatus','note'].includes(k)) ||
        typeof input.id !== 'string' || !UUID.test(input.id) || typeof input.updateId !== 'string' || !UUID.test(input.updateId) ||
        !Number.isSafeInteger(input.expectedVersion) || input.expectedVersion < 0 || !ORDER_STATUSES.includes(input.orderStatus) || !PAYMENT_STATUSES.includes(input.paymentStatus) ||
        typeof input.note !== 'string' || input.note.length > 300) throw new AdminError('INVALID_STATUS_UPDATE');
      const original = await read(input.id), current = await readStatus(input.id);
      const history = current?.data.history || [], version = current?.data.version || 0;
      const sameUpdate = entry => entry?.updateId === input.updateId && entry.orderStatus === input.orderStatus && entry.paymentStatus === input.paymentStatus && entry.note === input.note.trim() && entry.by === String(actor.id);
      const previous = history.find(e => e.updateId === input.updateId);
      if (previous) {
        if (!sameUpdate(previous)) throw new AdminError('UPDATE_ID_REUSED', 409);
        return detail(input.id);
      }
      if (version !== input.expectedVersion) throw new AdminError('STATUS_CONFLICT', 409);
      const before = withStatus(original, current).order;
      if (before.orderStatus === input.orderStatus && before.paymentStatus === input.paymentStatus && !input.note.trim()) return detail(input.id);
      if (history.length >= 200) throw new AdminError('STATUS_HISTORY_LIMIT', 409);
      const entry = {updateId: input.updateId, at: new Date().toISOString(), by: String(actor.id),
        previousOrderStatus: before.orderStatus, previousPaymentStatus: before.paymentStatus,
        orderStatus: input.orderStatus, paymentStatus: input.paymentStatus, note: input.note.trim()};
      const next = {schemaVersion: 1, orderId: input.id, version: version + 1, orderStatus: input.orderStatus,
        paymentStatus: input.paymentStatus, history: [...history, entry]};
      try {
        await sdk.put(`order-status/v1/${input.id}.json`, JSON.stringify(next), {...options(), access: 'private',
          contentType: 'application/json', addRandomSuffix: false, cacheControlMaxAge: 60,
          allowOverwrite: !!current, ...(current ? {ifMatch: current.etag} : {})});
      } catch {
        // Reconcile lost responses, but never retry a conflicting write blindly.
        const latest = await readStatus(input.id);
        if (latest?.data.history.some(sameUpdate)) return detail(input.id);
        if ((latest?.data.version || 0) !== version) throw new AdminError('STATUS_CONFLICT', 409);
        throw new AdminError('STATUS_SAVE_UNCERTAIN', 503);
      }
      return detail(input.id);
    }
  };
}
module.exports = {orderReader, AdminError};
