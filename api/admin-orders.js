const {authenticate, privateHeaders} = require('../server/admin-auth.cjs');
const {orderReader, AdminError} = require('../server/admin-orders.cjs');
function createHandler({auth = authenticate, reader = orderReader()} = {}) {
  return async function handler(req, res) {
    privateHeaders(res);
    if (req.method !== 'GET') {res.setHeader('Allow', 'GET'); return res.status(405).json({error: 'METHOD_NOT_ALLOWED'});}
    try {
      const user = await auth(req);
      if (!user) return res.status(401).json({error: 'UNAUTHORIZED'});
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
