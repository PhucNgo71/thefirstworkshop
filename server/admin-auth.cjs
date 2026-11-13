const ADMIN_ID = '277616242'; // PhucNgo71: immutable GitHub user ID, not an email/login name.
const ORIGIN = 'https://tfw.space';
const COOKIE = '__Secure-authjs.session-token';
function configured(env = process.env) {
  return env.VERCEL_ENV === 'production' && env.ADMIN_DASHBOARD_ENABLED === 'true' &&
    typeof env.ADMIN_AUTH_SECRET === 'string' && env.ADMIN_AUTH_SECRET.length >= 32 &&
    !!env.ADMIN_GITHUB_CLIENT_ID && !!env.ADMIN_GITHUB_CLIENT_SECRET;
}
function allowed(id) { return String(id || '') === ADMIN_ID; }
async function authConfig(env = process.env) {
  if (!configured(env)) throw new Error('ADMIN_NOT_CONFIGURED');
  const {default: GitHub} = await import('@auth/core/providers/github');
  return {
    basePath: '/api/auth', secret: env.ADMIN_AUTH_SECRET, trustHost: true,
    useSecureCookies: true, session: {strategy: 'jwt', maxAge: 8 * 60 * 60},
    providers: [GitHub({clientId: env.ADMIN_GITHUB_CLIENT_ID, clientSecret: env.ADMIN_GITHUB_CLIENT_SECRET,
      authorization: {params: {scope: 'read:user'}},
      profile(profile) { return {id: String(profile.id), name: profile.login}; }
    })],
    pages: {error: '/admin'},
    callbacks: {
      signIn({account, profile}) { return account?.provider === 'github' && allowed(profile?.id); },
      jwt({token, account, profile}) {
        if (account) {
          if (account.provider !== 'github' || !allowed(profile?.id)) return null;
          // No GitHub access token or customer data in the browser session.
          return {sub: String(profile.id), adminId: String(profile.id), name: 'PhucNgo71'};
        }
        return allowed(token?.adminId) ? token : null;
      },
      session({session, token}) {
        return {expires: session.expires, user: allowed(token?.adminId) ? {id: token.adminId, name: 'PhucNgo71'} : null};
      },
      redirect() { return ORIGIN + '/admin'; }
    },
    logger: {error() { console.warn('admin_auth_failed'); }, warn() {}, debug() {}}
  };
}
async function authenticate(req, env = process.env) {
  if (!configured(env)) return null;
  const {getToken} = await import('@auth/core/jwt');
  try {
    const request = new Request(ORIGIN + '/api/admin-orders', {headers: {cookie: req.headers.cookie || ''}});
    const token = await getToken({req: request, secret: env.ADMIN_AUTH_SECRET, cookieName: COOKIE, salt: COOKIE, secureCookie: true});
    return allowed(token?.adminId) ? {id: token.adminId, name: 'PhucNgo71'} : null;
  } catch { return null; }
}
function privateHeaders(res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Referrer-Policy', 'no-referrer');
}
module.exports = {ADMIN_ID, ORIGIN, COOKIE, configured, allowed, authConfig, authenticate, privateHeaders};
