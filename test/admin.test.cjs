const test=require('node:test'), assert=require('node:assert/strict');
const {authenticate,authConfig,ADMIN_ID,COOKIE,ORIGIN}=require('../server/admin-auth.cjs');
const {orderReader}=require('../server/admin-orders.cjs');
const {APPROVED_STORE}=require('../server/blob-store.cjs');
const {createHandler}=require('../api/admin-orders.js');
const {csv}=require('../dist/admin-csv.js');
const env={VERCEL_ENV:'production',ADMIN_DASHBOARD_ENABLED:'true',ADMIN_AUTH_SECRET:'unit-test-only-secret-with-at-least-32-characters',ADMIN_GITHUB_CLIENT_ID:'test-client',ADMIN_GITHUB_CLIENT_SECRET:'test-secret',BLOB_STORE_ID:APPROVED_STORE};
const id='12345678-1234-4234-8234-123456789abc';
const record={schemaVersion:1,fingerprint:'never-expose',emailStatus:'NeedsReview',order:{requestId:id,orderNumber:'TFW-TEST',orderDate:'2026-11-13T01:00:00Z',customer:{name:'TEST Example',email:'test@example.com',phone:'0900000000',address:'Test address'},items:[{name:'Chair',quantity:1}],subtotal:6600000,currency:'VND',paymentStatus:'Unpaid',orderStatus:'Received'}};
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.statusCode=code;return this},json(body){this.body=body;return this},end(){return this}};}
test('encrypted admin sessions require the exact GitHub ID and configured production',async()=>{
  const {encode}=await import('@auth/core/jwt');
  const jwt=async(adminId,maxAge=3600)=>encode({token:{adminId},secret:env.ADMIN_AUTH_SECRET,salt:COOKIE,maxAge});
  const request=token=>({headers:{cookie:COOKIE+'='+token}});
  const token=await jwt(ADMIN_ID);
  assert.equal((await authenticate(request(token),env)).id,ADMIN_ID);
  assert.equal(await authenticate(request(await jwt('999')),env),null);
  assert.equal(await authenticate(request(await jwt(ADMIN_ID,-3600)),env),null);
  assert.equal(await authenticate(request(token+'tamper'),env),null);
  assert.equal(await authenticate(request(token),{...env,ADMIN_DASHBOARD_ENABLED:'false'}),null);
  assert.equal(await authenticate(request(token),{...env,VERCEL_ENV:'preview'}),null);
  assert.equal(await authenticate({headers:{}},env),null);
});
test('OAuth callbacks deny other accounts and do not trust a renamed login or client session update',async()=>{
  const c=await authConfig(env);
  assert.equal(await c.callbacks.signIn({account:{provider:'github'},profile:{id:ADMIN_ID}}),true);
  assert.equal(await c.callbacks.signIn({account:{provider:'github'},profile:{id:999,login:'PhucNgo71'}}),false);
  assert.equal(await c.callbacks.jwt({token:{adminId:'999'},trigger:'update',session:{adminId:ADMIN_ID}}),null);
  assert.equal(await c.callbacks.redirect({url:'https://evil.example'}),ORIGIN+'/admin');
  const token=await c.callbacks.jwt({token:{},account:{provider:'github',access_token:'private'},profile:{id:ADMIN_ID}});
  assert.equal(token.access_token,undefined);
});
test('unauthenticated list, detail, session and export attempts never touch storage; APIs are read only',async()=>{
  let reads=0;const handler=createHandler({auth:async()=>null,reader:{list(){reads++},detail(){reads++}}});
  for(const query of [{},{id},{session:'1'},{export:'1'}]){const res=response();await handler({method:'GET',headers:{},query},res);assert.equal(res.statusCode,401);assert.equal(res.headers['Cache-Control'],'private, no-store, max-age=0');}
  const res=response();await handler({method:'POST',headers:{},query:{}},res);assert.equal(res.statusCode,405);assert.equal(reads,0);
});
test('list is paginated with private reads, hides internal fields, reports corrupt records',async()=>{
  const bad='22345678-1234-4234-8234-123456789abc';const calls=[];
  const sdk={async list(options){calls.push(options);return {blobs:[{pathname:`orders/v1/${id}.json`},{pathname:`orders/v1/${bad}.json`},{pathname:'orders/v1/../../secret'}],hasMore:true,cursor:'next'}},async get(path,options){calls.push(options);return {statusCode:200,blob:{size:1000},stream:new Response(path.includes(bad)?'bad json':JSON.stringify(record)).body}}};
  const reader=orderReader(env,sdk),result=await reader.list('previous');
  assert.equal(result.orders.length,1);assert.equal(result.unreadableCount,1);assert.equal(result.cursor,'next');
  assert.equal(calls[0].prefix,'orders/v1/');assert.equal(calls[0].cursor,'previous');assert.equal(calls[0].limit,50);
  assert.equal(calls[1].access,'private');assert.equal(calls[1].useCache,false);
  assert.equal(result.orders[0].customer,undefined);assert.equal(result.orders[0].fingerprint,undefined);
  const detail=await reader.detail(id);assert.equal(detail.order.customer.address,'Test address');assert.equal(detail.fingerprint,undefined);
  for(const value of ['../other',id+'.json',[id]])await assert.rejects(reader.detail(value),/INVALID_ORDER_ID/);
  await assert.rejects(orderReader({...env,VERCEL_ENV:'preview'},sdk).list(),/NOT_CONFIGURED/);
});
test('authenticated handler returns orders but masks internal service errors',async()=>{
  const handler=createHandler({auth:async()=>({id:ADMIN_ID}),reader:{async list(){throw Error('secret-token')},async detail(){return {order:record.order}}}});
  const res=response();await handler({method:'GET',query:{id}},res);assert.equal(res.statusCode,200);assert.equal(res.body.order.requestId,id);
  const err=response();await handler({method:'GET',query:{}},err);assert.equal(err.statusCode,503);assert.equal(JSON.stringify(err.body).includes('secret-token'),false);
});
test('CSV supports Vietnamese, escaping, and neutralizes spreadsheet formulas',()=>{
  const output=csv([{orderNumber:'TFW-TEST',customerName:'=HYPERLINK("evil")',email:'\t+cmd',phone:'+84900000000',orderStatus:'Đã nhận, chờ xác nhận'}]);
  assert.ok(output.startsWith('\uFEFF'));assert.ok(output.includes('"\'=HYPERLINK(""evil"")"'));assert.ok(output.includes('"\'\t+cmd"'));assert.ok(output.includes('"Đã nhận, chờ xác nhận"'));
});
test('Auth.js issues secure CSRF cookies, rejects missing CSRF and constrains OAuth scope',async()=>{
  const {Auth}=await import('@auth/core');const config=await authConfig(env);
  const csrfResponse=await Auth(new Request(ORIGIN+'/api/auth/csrf'),config);
  const cookies=csrfResponse.headers.getSetCookie();assert.ok(cookies.every(c=>c.includes('HttpOnly')&&c.includes('Secure')&&c.includes('SameSite=Lax')));
  const {csrfToken}=await csrfResponse.json();assert.ok(csrfToken);
  const rejected=await Auth(new Request(ORIGIN+'/api/auth/signin/github',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:'callbackUrl='+encodeURIComponent(ORIGIN+'/admin')}),config);
  assert.ok(!String(rejected.headers.get('location')).startsWith('https://github.com/'));
  const accepted=await Auth(new Request(ORIGIN+'/api/auth/signin/github',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',cookie:cookies.map(c=>c.split(';')[0]).join('; ')},body:new URLSearchParams({csrfToken,callbackUrl:ORIGIN+'/admin'})}),config);
  const redirect=new URL(accepted.headers.get('location'));assert.equal(redirect.origin,'https://github.com');assert.equal(redirect.searchParams.get('scope'),'read:user');assert.equal(redirect.searchParams.get('redirect_uri'),ORIGIN+'/api/auth/callback/github');assert.ok(redirect.searchParams.get('state')||redirect.searchParams.get('code_challenge'));
});
