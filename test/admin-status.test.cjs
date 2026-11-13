const test=require('node:test'),assert=require('node:assert/strict');
const {orderReader}=require('../server/admin-orders.cjs');
const {createHandler}=require('../api/admin-orders.js');
const {ADMIN_ID,ORIGIN}=require('../server/admin-auth.cjs');
const {APPROVED_STORE}=require('../server/blob-store.cjs');
const id='12345678-1234-4234-8234-123456789abc',op='22345678-1234-4234-8234-123456789abc';
const actor={id:ADMIN_ID};
const env={VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE};
const input={id,expectedVersion:0,updateId:op,orderStatus:'Processing',paymentStatus:'Paid',note:'Đã đối chiếu chuyển khoản'};
function fixture(){
 const original={schemaVersion:1,fingerprint:'unchanged',row:['original Excel snapshot'],emailStatus:'Accepted',emailProviderId:'unchanged',order:{requestId:id,orderNumber:'TFW-TEST',customer:{name:'TEST Example'},items:[{name:'Chair',quantity:1}],subtotal:6600000,orderStatus:'Received',paymentStatus:'Unpaid'}};
 const files=new Map([[`orders/v1/${id}.json`,{raw:JSON.stringify(original),etag:'original'}]]);let serial=0;
 const sdk={async get(path,options){assert.equal(options.access,'private');assert.equal(options.useCache,false);const r=files.get(path);return r?{statusCode:200,blob:{size:Buffer.byteLength(r.raw),etag:r.etag},stream:new Response(r.raw).body}:null},async list(){return {blobs:[{pathname:`orders/v1/${id}.json`}],hasMore:false}},async put(path,raw,options){assert.ok(path.startsWith('order-status/v1/'));assert.equal(options.access,'private');assert.equal(options.addRandomSuffix,false);const existing=files.get(path);if(existing&&(!options.allowOverwrite||options.ifMatch!==existing.etag))throw Error('PRECONDITION_FAILED');files.set(path,{raw,etag:'revision-'+(++serial)});return {etag:'revision-'+serial}}};
 return {files,sdk,original,reader:orderReader(env,sdk)};
}
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(body){this.body=body;return this}};}
test('status updates persist across reads and CSV summaries without touching order, prices or mail record',async()=>{
 const f=fixture(),before=f.files.get(`orders/v1/${id}.json`).raw;
 const saved=await f.reader.updateStatus(input,actor);assert.equal(saved.order.paymentStatus,'Paid');assert.equal(saved.statusVersion,1);assert.equal(saved.statusHistory[0].by,ADMIN_ID);assert.equal(saved.statusHistory[0].previousPaymentStatus,'Unpaid');
 const fresh=orderReader(env,f.sdk);assert.equal((await fresh.detail(id)).order.orderStatus,'Processing');assert.equal((await fresh.list()).orders[0].paymentStatus,'Paid');assert.equal(f.files.get(`orders/v1/${id}.json`).raw,before);assert.equal(saved.order.subtotal,6600000);
});
test('duplicate save and lost response reconcile once; edits with a stale revision conflict',async()=>{
 const f=fixture(),put=f.sdk.put;let lose=true;f.sdk.put=async(...args)=>{const r=await put(...args);if(lose){lose=false;throw Error('response lost')}return r;};
 await f.reader.updateStatus(input,actor);const retry=await f.reader.updateStatus(input,actor);assert.equal(retry.statusHistory.length,1);
 await assert.rejects(f.reader.updateStatus({...input,updateId:'32345678-1234-4234-8234-123456789abc',orderStatus:'Completed'},actor),/STATUS_CONFLICT/);
 await assert.rejects(f.reader.updateStatus({...input,paymentStatus:'Unpaid'},actor),/UPDATE_ID_REUSED/);
});
test('two simultaneous initial writes cannot overwrite one another',async()=>{
 const f=fixture();const results=await Promise.allSettled([f.reader.updateStatus(input,actor),f.reader.updateStatus({...input,updateId:'32345678-1234-4234-8234-123456789abc',paymentStatus:'Unpaid'},actor)]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.message,'STATUS_CONFLICT');assert.equal((await f.reader.detail(id)).statusHistory.length,1);
});
test('a later correction requires the latest revision and records both old and new status',async()=>{
 const f=fixture();await f.reader.updateStatus(input,actor);const next=await f.reader.updateStatus({...input,expectedVersion:1,updateId:'42345678-1234-4234-8234-123456789abc',paymentStatus:'Unpaid',note:'Sửa ghi nhận'},actor);
 assert.equal(next.statusVersion,2);assert.equal(next.statusHistory[1].previousPaymentStatus,'Paid');assert.equal(next.order.paymentStatus,'Unpaid');
});
test('invalid fields, unauthorized identity, missing orders and bad storage never create records',async()=>{
 const f=fixture();for(const extra of [{subtotal:1},{paymentStatus:'made-up'},{id:'../other'},{note:'a'.repeat(301)},{expectedVersion:-1},{updateId:'invalid'}])await assert.rejects(f.reader.updateStatus({...input,...extra},actor),/INVALID_STATUS_UPDATE/);
 await assert.rejects(f.reader.updateStatus(input,{id:'other'}),/UNAUTHORIZED/);
 await assert.rejects(f.reader.updateStatus({...input,id:'52345678-1234-4234-8234-123456789abc'},actor),/ORDER_NOT_FOUND/);
 await assert.rejects(orderReader({...env,VERCEL_ENV:'preview'},f.sdk).updateStatus(input,actor),/NOT_CONFIGURED/);assert.equal(f.files.size,1);
});
test('PATCH requires authenticated owner, same-origin JSON and explicit action header',async()=>{
 let writes=0;const reader={async updateStatus(body,user){writes++;assert.equal(user.id,ADMIN_ID);return {saved:true}}};const handler=createHandler({auth:async()=>actor,reader});
 const headers={origin:ORIGIN,'content-type':'application/json','x-admin-action':'update-order-status'};
 for(const bad of [{...headers,origin:'https://evil.example'},{...headers,origin:undefined},{...headers,'x-admin-action':undefined},{...headers,'content-type':'text/plain'}]){const r=response();await handler({method:'PATCH',headers:bad,body:input},r);assert.ok([403,415].includes(r.statusCode));}
 const unauthorized=response();await createHandler({auth:async()=>null,reader})({method:'PATCH',headers,body:input},unauthorized);assert.equal(unauthorized.statusCode,401);assert.equal(writes,0);
 const malformed=response();await handler({method:'PATCH',headers,body:'{'},malformed);assert.equal(malformed.statusCode,400);
 const oversized=response();await handler({method:'PATCH',headers,body:' '.repeat(4097)},oversized);assert.equal(oversized.statusCode,413);
 const success=response();await handler({method:'PATCH',headers,body:input},success);assert.equal(success.statusCode,200);assert.equal(writes,1);assert.equal(success.headers['Cache-Control'],'private, no-store, max-age=0');
});
