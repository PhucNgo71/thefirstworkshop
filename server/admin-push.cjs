const {createHash, createECDH, ECDH} = require('node:crypto');
const {APPROVED_STORE} = require('./blob-store.cjs');
const {AdminError, orderReader} = require('./admin-orders.cjs');
const REGISTRY = 'admin-push/v1/devices.json';
const digest = s => createHash('sha256').update(s).digest('hex');
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
function subscription(input) {
  if (!input || typeof input.endpoint !== 'string' || input.endpoint.length > 2048) throw new AdminError('INVALID_SUBSCRIPTION');
  let url; try { url = new URL(input.endpoint); } catch { throw new AdminError('INVALID_SUBSCRIPTION'); }
  const hosts = ['web.push.apple.com','fcm.googleapis.com','updates.push.services.mozilla.com'];
  if (url.protocol !== 'https:' || url.port || url.username || url.password || url.hash || !hosts.includes(url.hostname)) throw new AdminError('INVALID_PUSH_HOST');
  const keys = input.keys;
  if (!keys || !/^[A-Za-z0-9_-]{87}$/.test(keys.p256dh) || !/^[A-Za-z0-9_-]{22}$/.test(keys.auth)) throw new AdminError('INVALID_SUBSCRIPTION');
  try { ECDH.convertKey(Buffer.from(keys.p256dh,'base64url'),'prime256v1'); } catch { throw new AdminError('INVALID_SUBSCRIPTION'); }
  return {endpoint: url.href, keys: {p256dh: keys.p256dh, auth: keys.auth}};
}
function pushService(env=process.env, sdk=require('@vercel/blob'), sender=require('web-push'), clock=()=>Date.now()) {
  function configured() {
    try {
      if(env.VERCEL_ENV!=='production'||env.BLOB_STORE_ID!==APPROVED_STORE||!env.ADMIN_PUSH_PUBLIC_KEY||!env.ADMIN_PUSH_PRIVATE_KEY)return false;
      const key=createECDH('prime256v1'); key.setPrivateKey(Buffer.from(env.ADMIN_PUSH_PRIVATE_KEY,'base64url'));
      return key.getPublicKey().toString('base64url')===env.ADMIN_PUSH_PUBLIC_KEY;
    } catch {return false;}
  }
  function ready(){if(!configured())throw new AdminError('PUSH_NOT_CONFIGURED',503);}
  const options=()=>({access:'private',storeId:APPROVED_STORE,abortSignal:AbortSignal.timeout(8000)});
  async function read(path){const r=await sdk.get(path,{...options(),useCache:false});if(!r)return null;if(r.statusCode!==200||r.blob.size>60000||!r.blob.etag)throw new AdminError('PUSH_STORAGE_UNAVAILABLE',503);const raw=await new Response(r.stream).text();if(Buffer.byteLength(raw)>60000)throw new AdminError('PUSH_STORAGE_UNAVAILABLE',503);return {data:JSON.parse(raw),etag:r.blob.etag};}
  async function write(path,data,etag){return sdk.put(path,JSON.stringify(data),{...options(),contentType:'application/json',addRandomSuffix:false,cacheControlMaxAge:60,allowOverwrite:!!etag,...(etag?{ifMatch:etag}:{})});}
  async function devices(){const r=await read(REGISTRY);if(r&&(!Array.isArray(r.data.devices)||r.data.devices.length>10))throw new AdminError('PUSH_STORAGE_UNAVAILABLE',503);return r;}
  async function change(fn){ready();for(let n=0;n<4;n++){const r=await devices(),next=fn(r?.data.devices||[]);try{await write(REGISTRY,{schemaVersion:1,devices:next},r?.etag);return;}catch{if(n===3)throw new AdminError('PUSH_SAVE_FAILED',503);}}}
  async function set(input,active){const sub=subscription(input),id=digest(sub.endpoint);await change(list=>{
    const old=list.find(d=>d.id===id);if(!active)return list.map(d=>d.id===id?{...d,active:false}:d);
    const next=list.filter(d=>d.id!==id&&d.active);if(next.length>=10)throw new AdminError('PUSH_DEVICE_LIMIT');
    next.push({id,subscription:sub,active:true,since:old?.active?old.since:clock(),updatedAt:clock()});return next;
  });return {active};}
  async function send(device,tag,test=false){
    const payload=JSON.stringify({title:'thefirstworkshop',body:test?'Thông báo thử thành công. Thiết bị này đã kết nối.':'Có đơn online mới. Mở trang quản lý để xem.',tag});
    await sender.sendNotification(subscription(device.subscription),payload,{TTL:3600,urgency:'high',timeout:5000,topic:digest(tag).slice(0,32),vapidDetails:{subject:'https://tfw.space',publicKey:env.ADMIN_PUSH_PUBLIC_KEY,privateKey:env.ADMIN_PUSH_PRIVATE_KEY}});
  }
  async function notify(order){
    if(!configured())return {disabled:true};
    if(!uuid.test(order.requestId)||/^TEST\b/i.test(order.customer?.name||'')||!Number.isFinite(Date.parse(order.orderDate)))return {skipped:true};
    const at=Date.parse(order.orderDate);if(at<clock()-86400000)return {skipped:true};
    const list=(await devices())?.data.devices.filter(d=>d.active&&d.since<=at)||[];
    const outcomes=await Promise.all(list.map(async device=>{
      const path=`admin-push/v1/delivery/${order.requestId}-${device.id}.json`,prev=await read(path),data=prev?.data;
      if(data&&(data.state==='Accepted'||data.state==='Expired'||data.attempts>=6||data.nextAttempt>clock()))return 'skipped';
      // CAS lease prevents checkout retries and the scheduled recovery from sending concurrently.
      const claim={state:'Sending',attempts:(data?.attempts||0)+1,nextAttempt:clock()+120000,updatedAt:clock()};let saved;
      try{saved=await write(path,claim,prev?.etag);}catch{return 'busy';}
      try{await send(device,'order-'+order.requestId);claim.state='Accepted';}
      catch(e){claim.state=[404,410].includes(e.statusCode)?'Expired':'Retry';claim.nextAttempt=clock()+Math.min(3600000,300000*2**(claim.attempts-1));if(claim.state==='Expired')await set(device.subscription,false);}
      claim.updatedAt=clock();await write(path,claim,saved.etag);return claim.state;
    }));return {accepted:outcomes.filter(s=>s==='Accepted').length,retry:outcomes.filter(s=>s==='Retry').length};
  }
  return {
    configured,notify,
    async status(input){ready();const list=(await devices())?.data.devices||[];const id=input?digest(subscription(input).endpoint):null;return {configured:true,publicKey:env.ADMIN_PUSH_PUBLIC_KEY,active:!!list.find(d=>d.id===id&&d.active),deviceCount:list.filter(d=>d.active).length};},
    subscribe: input=>set(input,true),unsubscribe:input=>set(input,false),
    async test(input){ready();const id=digest(subscription(input).endpoint),device=(await devices())?.data.devices.find(d=>d.id===id&&d.active);if(!device)throw new AdminError('PUSH_DEVICE_NOT_FOUND',404);try{await send(device,'test-'+clock(),true);}catch(e){if([404,410].includes(e.statusCode))await set(device.subscription,false);throw new AdminError('PUSH_SEND_FAILED',503);}return {accepted:true};},
    async recover(reader=orderReader(env,sdk)){
      ready();if(!(await devices())?.data.devices.some(d=>d.active))return {checked:0};
      let cursor,checked=0,failed=0;const seen=new Set();
      for(let page=0;page<100;page++){
        const result=await reader.list(cursor);failed+=result.unreadableCount||0;
        for(const o of result.orders){if(o.isTest||Date.parse(o.orderDate)<clock()-86400000)continue;await notify({requestId:o.id,orderDate:o.orderDate});checked++;}
        if(!result.hasMore){if(failed)throw new AdminError('PUSH_RECOVERY_INCOMPLETE',503);return {checked};}
        if(!result.cursor||seen.has(result.cursor))throw new AdminError('PUSH_RECOVERY_INCOMPLETE',503);seen.add(result.cursor);cursor=result.cursor;
      }throw new AdminError('PUSH_RECOVERY_LIMIT',503);
    }
  };
}
module.exports={pushService,subscription};
