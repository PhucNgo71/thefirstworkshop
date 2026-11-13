const test=require('node:test'),assert=require('node:assert/strict'),webpush=require('web-push');
const {pushService,subscription}=require('../server/admin-push.cjs');
const {APPROVED_STORE}=require('../server/blob-store.cjs');
const {createHandler}=require('../api/admin-push.js');
const {createHandler:cron}=require('../api/order-notifications.js');
const {submit}=require('../server/orders.cjs');
const key=webpush.generateVAPIDKeys();
const env={VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE,ADMIN_PUSH_PUBLIC_KEY:key.publicKey,ADMIN_PUSH_PRIVATE_KEY:key.privateKey,CRON_SECRET:'test-only-32-character-cron-secret'};
const sub={endpoint:'https://web.push.apple.com/test-device',keys:{p256dh:webpush.generateVAPIDKeys().publicKey,auth:Buffer.alloc(16,1).toString('base64url')}};
const id='00000000-0000-4000-8000-000000000001';
function memory(){const files=new Map();let seq=0;return {files,async get(path){const f=files.get(path);return f?{statusCode:200,blob:{size:Buffer.byteLength(f.raw),etag:f.etag},stream:new Response(f.raw).body}:null;},async put(path,raw,o){assert.equal(o.access,'private');assert.equal(o.storeId,APPROVED_STORE);const f=files.get(path);if(f&&(!o.allowOverwrite||o.ifMatch!==f.etag))throw Error('conflict');if(!f&&o.ifMatch)throw Error('conflict');const etag=String(++seq);files.set(path,{raw,etag});return {etag};}};}
function response(){return{headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.statusCode=n;return this;},json(body){this.body=body;return this;}};}
test('only vendor push endpoints and valid encryption keys are accepted',()=>{
 assert.equal(subscription(sub).endpoint,sub.endpoint);
 for(const endpoint of ['http://web.push.apple.com/a','https://127.0.0.1/a','https://web.push.apple.com.evil.test/a','https://user:pass@web.push.apple.com/a','https://web.push.apple.com:8443/a','https://evil.test/'])assert.throws(()=>subscription({...sub,endpoint}));
 assert.throws(()=>subscription({...sub,keys:{auth:sub.keys.auth,p256dh:'a'.repeat(87)}}));
 assert.equal(pushService({...env,VERCEL_ENV:'preview'},memory()).configured(),false);
 assert.equal(pushService({...env,ADMIN_PUSH_PUBLIC_KEY:'invalid'},memory()).configured(),false);
});
test('subscription is private, notifications contain no customer data, retries/concurrent checkout deduplicate',async()=>{
 let now=Date.now(),calls=0;const sdk=memory(),sent=[];
 const service=pushService(env,sdk,{async sendNotification(s,p,o){calls++;sent.push(JSON.parse(p));assert.equal(o.TTL,3600);assert.equal(o.timeout,5000);}},()=>now);
 await service.subscribe(sub);assert.equal((await service.status(sub)).active,true);now+=1000;
 const order={requestId:id,orderDate:new Date(now).toISOString(),customer:{name:'PRIVATE NAME',email:'private@example.com'}};
 await Promise.all([service.notify(order),service.notify(order),service.notify(order)]);assert.equal(calls,1);assert.equal(JSON.stringify(sent).includes('PRIVATE'),false);assert.equal(JSON.stringify(sent).includes('@'),false);
 await service.notify(order);assert.equal(calls,1);
 await service.test(sub);assert.equal(calls,2);assert.match(sent[1].tag,/^test-/);
 await service.unsubscribe(sub);assert.equal((await service.status(sub)).active,false);
 await assert.rejects(service.test(sub),/PUSH_DEVICE_NOT_FOUND/);
});
test('recovery retries provider failure, expires gone endpoints and avoids old/test orders',async()=>{
 let now=Date.now(),calls=0,status=503;const service=pushService(env,memory(),{async sendNotification(){calls++;if(status)throw Object.assign(Error('private provider response'),{statusCode:status});}},()=>now);
 await service.subscribe(sub);now+=1000;
 const order={requestId:id,orderDate:new Date(now).toISOString(),customer:{name:'Customer'}};
 await service.notify({...order,customer:{name:'TEST customer'}});await service.notify({...order,orderDate:new Date(now-2000).toISOString()});assert.equal(calls,0);
 assert.equal((await service.notify(order)).retry,1);await service.notify(order);assert.equal(calls,1);
 now+=300001;status=0;assert.equal((await service.notify(order)).accepted,1);assert.equal(calls,2);
 now+=1000;status=410;await service.notify({...order,requestId:'00000000-0000-4000-8000-000000000002',orderDate:new Date(now).toISOString()});assert.equal((await service.status(sub)).active,false);
});
test('recovery spans pages but does not send old backlog to newly registered phones',async()=>{
 let now=Date.now(),calls=0;const service=pushService(env,memory(),{async sendNotification(){calls++;}},()=>now);await service.subscribe(sub);now+=1000;
 const reader={async list(cursor){return cursor?{orders:[{id,orderDate:new Date(now).toISOString(),isTest:false}],hasMore:false}:{orders:[{id,orderDate:new Date(now-2000).toISOString(),isTest:false}],hasMore:true,cursor:'next'};}};
 await service.recover(reader);assert.equal(calls,1);await service.recover(reader);assert.equal(calls,1);
});
test('push API authenticates before storage and validates origin/body/action',async()=>{
 let calls=0;const push={configured:()=>true,status:async()=>{calls++;return{configured:true};},subscribe:async()=>{calls++;return{active:true};}};
 let handler=createHandler({auth:async()=>null,push}),res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.statusCode,401);assert.equal(calls,0);
 handler=createHandler({auth:async()=>({id:'277616242'}),push});res=response();await handler({method:'POST',headers:{origin:'https://evil.test'},body:{}},res);assert.equal(res.statusCode,403);assert.equal(calls,0);
 res=response();await handler({method:'POST',headers:{origin:'https://tfw.space','x-admin-action':'push-settings','content-type':'application/json'},body:{action:'subscribe',subscription:sub}},res);assert.equal(res.statusCode,200);assert.equal(calls,1);assert.match(res.headers['Cache-Control'],/no-store/);
});
test('scheduled recovery requires the existing cron secret',async()=>{
 let calls=0;const handler=cron({env,push:{configured:()=>true,recover:async()=>{calls++;return{checked:1};}}});let res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.statusCode,401);assert.equal(calls,0);res=response();await handler({method:'GET',headers:{authorization:'Bearer '+env.CRON_SECRET}},res);assert.equal(res.statusCode,200);assert.equal(calls,1);
});
test('push follows durable order save and failure does not reject checkout or prevent email',async()=>{
 const events=[];const input={requestId:id,privacyConsent:{accepted:true,noticeVersion:'2026-11-03-order-v1'},customer:{name:'Demo',email:'demo@example.com',phone:'0900000000',address:'Test address'},items:[{id:'sample',quantity:1}],paymentMethod:'bank',expectedSubtotal:100};
 const deps={catalog:{sample:{name:'Sample',price:100}},store:{async createOrGet(order,fingerprint){events.push('saved');return{order,fingerprint,emailStatus:'Pending'};},async claimEmail(){return true;},async emailResult(){}},notifyOrder:async()=>{events.push('push');throw Error('offline');},sendMail:async()=>{events.push('mail');}};
 const result=await submit(input,deps);assert.equal(result.status,'received');assert.deepEqual(events,['saved','push','mail']);events.length=0;deps.store.createOrGet=async()=>{throw Error('storage failed');};await assert.rejects(submit(input,deps));assert.deepEqual(events,[]);
});
test('service worker displays only generic text, never caches private data and opens only admin',async()=>{
 const vm=require('node:vm'),fs=require('node:fs'),handlers={},notices=[],opened=[];const self={location:{origin:'https://tfw.space'},addEventListener:(n,fn)=>handlers[n]=fn,skipWaiting(){},registration:{async showNotification(title,options){notices.push({title,options});}},clients:{async claim(){},async matchAll(){return[];},async openWindow(url){opened.push(url);}}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/admin-sw.js'),'utf8'),{self,URL});assert.equal(handlers.fetch,undefined);
 let job;handlers.push({data:{json:()=>({title:'private title',body:'private customer',tag:'order-test',url:'https://evil.test'})},waitUntil:p=>job=p});await job;assert.equal(notices.length,1);assert.equal(notices[0].options.body.includes('private'),false);
 handlers.notificationclick({notification:{close(){},data:{url:'https://evil.test'}},waitUntil:p=>job=p});await job;assert.deepEqual(opened,['/admin']);
 const config=require('../vercel.json');assert.equal(config.crons.find(c=>c.path==='/api/order-notifications').schedule,'*/5 * * * *');
});
