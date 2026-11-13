const {ORIGIN, configured, authConfig, privateHeaders} = require('../server/admin-auth.cjs');
module.exports = async function handler(req, res) {
  privateHeaders(res);
  if (!configured()) return res.status(503).json({error: 'ADMIN_NOT_CONFIGURED'});
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({error: 'METHOD_NOT_ALLOWED'});
  if (req.method === 'POST' && req.headers.origin !== ORIGIN) return res.status(403).json({error: 'INVALID_ORIGIN'});
  try {
    const incoming = new URL(req.url, ORIGIN);
    const action = req.query?.authAction || incoming.searchParams.get('authAction') || incoming.pathname.replace(/^\/api\/auth\//, '');
    if (typeof action !== 'string' || !/^(csrf|session|providers|signin|signout|error|signin\/github|callback\/github)$/.test(action)) return res.status(404).end();
    incoming.searchParams.delete('authAction');
    const url = new URL('/api/auth/' + action, ORIGIN);
    url.search = incoming.searchParams.toString();
    const headers = new Headers();
    for (const key of ['cookie', 'content-type', 'origin', 'x-auth-return-redirect']) if (typeof req.headers[key] === 'string') headers.set(key, req.headers[key]);
    let body;
    if (req.method === 'POST') {
      if (!String(req.headers['content-type']).startsWith('application/x-www-form-urlencoded')) return res.status(415).end();
      body = typeof req.body === 'string' ? req.body : new URLSearchParams(req.body || {}).toString();
      if (Buffer.byteLength(body) > 8192) return res.status(413).end();
    }
    const {Auth} = await import('@auth/core');
    const result = await Auth(new Request(url, {method: req.method, headers, body}), await authConfig());
    for (const [key, value] of result.headers) if (!['set-cookie', 'cache-control'].includes(key)) res.setHeader(key, value);
    const cookies = result.headers.getSetCookie();
    if (cookies.length) res.setHeader('Set-Cookie', cookies);
    res.status(result.status).send(await result.text());
  } catch { res.status(503).json({error: 'SIGN_IN_UNAVAILABLE'}); }
};
