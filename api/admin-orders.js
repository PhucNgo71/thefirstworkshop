const {authenticate, privateHeaders, ORIGIN} = require('../server/admin-auth.cjs');
const {orderReader, AdminError} = require('../server/admin-orders.cjs');
function createHandler({auth = authenticate, reader = orderReader(), origin = ORIGIN} = {}) {
  return async function handler(req, res) {
    privateHeaders(res);
    if (!['GET', 'PATCH'].includes(req.method)) {res.setHeader('Allow', 'GET, PATCH'); return res.status(405).json({error: 'METHOD_NOT_ALLOWED'});}
    try {
      const user = await auth(req);
      if (!user) return res.status(401).json({error: 'UNAUTHORIZED'});
      if (req.method === 'PATCH') {
        if (req.headers.origin !== origin || req.headers['x-admin-action'] !== 'update-order-status') return res.status(403).json({error: 'INVALID_ORIGIN'});
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return res.status(415).json({error: 'JSON_REQUIRED'});
        const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        if (!raw || Buffer.byteLength(raw) > 4096) return res.status(413).json({error: 'REQUEST_TOO_LARGE'});
        let input; try {input = JSON.parse(raw);} catch {return res.status(400).json({error: 'INVALID_JSON'});}
        return res.status(200).json(await reader.updateStatus(input, user));
      }
      if (req.query?.session === '1') return res.status(200).json({user});
      if (req.query?.id !== undefined) return res.status(200).json(await reader.detail(req.query.id));
      return res.status(200).json(await reader.list(req.query?.cursor));
    } catch (error) {
      return res.status(error instanceof AdminError ? error.status : 503).json({error: error instanceof AdminError ? error.message : 'ORDERS_UNAVAILABLE'});
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
