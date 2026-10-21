const test=require('node:test');
const assert=require('node:assert/strict');
const {blobStore,APPROVED_STORE}=require('../server/blob-store.cjs');
const {normalize,makeOrder,excelRow,submit}=require('../server/orders.cjs');
const catalog={anchor:{name:'Anchor Staff Chair',price:4700000}};
const input=()=>({requestId:'12345678-1234-4234-8234-123456789abc',customer:{name:'TEST Customer',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},items:[{id:'anchor',quantity:1}],expectedSubtotal:4700000,paymentMethod:'bank'});
function fixture(){
  const files=new Map(), calls=[];let sequence=0;
  class Conflict extends Error {}
  const sdk={BlobPreconditionFailedError:Conflict,
    async put(path,body,options){
      calls.push({op:'put',path,options});const old=files.get(path);
      if(old&&!options.allowOverwrite)throw Error('exists');
      if(options.ifMatch&&old?.etag!==options.ifMatch)throw new Conflict();
      const etag='etag-'+(++sequence);files.set(path,{body,etag});return {etag};
    },
    async get(path,options){calls.push({op:'get',path,options});const file=files.get(path);return file?{statusCode:200,blob:{etag:file.etag,size:file.body.length},stream:new Response(file.body).body}:null;}
  };
  const env={BLOB_STORE_ID:APPROVED_STORE,VERCEL_ENV:'production'};
  return {files,calls,sdk,env,store:blobStore(env,sdk)};
}
test('private store fails closed without the exact production connection',async()=>{
  const f=fixture();for(const env of [{},{BLOB_STORE_ID:'other',VERCEL_ENV:'production'},{BLOB_STORE_ID:APPROVED_STORE,VERCEL_ENV:'preview'}])await assert.rejects(blobStore(env,f.sdk).createOrGet({},'',{}),/NOT_CONFIGURED/);
  assert.equal(f.calls.length,0);
});
test('concurrent real-store adapter submissions save one record and send once',async()=>{
  const f=fixture();let sends=0;const deps={catalog,store:f.store,sendMail:async()=>{sends++;return {providerId:'provider-test-id'};}};
  await Promise.all(Array.from({length:20},()=>submit(input(),deps)));
  assert.equal(f.files.size,1);assert.equal(sends,1);
  const saved=JSON.parse([...f.files.values()][0].body);assert.equal(saved.emailStatus,'Accepted');assert.equal(saved.emailProviderId,'provider-test-id');assert.equal(saved._etag,undefined);
  for(const call of f.calls){assert.equal(call.options.access,'private');assert.equal(call.options.storeId,APPROVED_STORE);if(call.op==='get')assert.equal(call.options.useCache,false);}
});
test('same ID with changed details is never overwritten or sent twice',async()=>{
  const f=fixture();let sends=0;const deps={catalog,store:f.store,sendMail:async()=>{sends++;}};
  await submit(input(),deps);const changed=input();changed.customer.name='different';await assert.rejects(submit(changed,deps),/REQUEST_CONFLICT/);assert.equal(sends,1);
});
test('ambiguous claim remains durable but never sends automatically',async()=>{
  const f=fixture(),original=f.sdk.put;f.sdk.put=async(...args)=>{const result=await original(...args);if(args[2].ifMatch)throw Error('response lost');return result;};
  let sends=0;const deps={catalog,store:f.store,sendMail:async()=>{sends++;}};
  await assert.rejects(submit(input(),deps),/CLAIM_UNCERTAIN/);f.sdk.put=original;
  assert.equal((await submit(input(),deps)).emailStatus,'Sending');assert.equal(sends,0);
});
test('email failure retains complete order for reconciliation and does not resend',async()=>{
  const f=fixture();let sends=0;const deps={catalog,store:f.store,sendMail:async()=>{sends++;throw Error('timeout');}};
  assert.equal((await submit(input(),deps)).emailStatus,'NeedsReview');await submit(input(),deps);assert.equal(sends,1);
  const saved=JSON.parse([...f.files.values()][0].body);assert.equal(Object.keys(saved.row).length,24);assert.equal(saved.order.customer.name,'TEST Customer');
});
test('unavailable storage never sends and rejects invalid paths',async()=>{
  const f=fixture();f.sdk.put=async()=>{throw Error('offline');};let sends=0;await assert.rejects(submit(input(),{catalog,store:f.store,sendMail:async()=>{sends++;}}),/STORAGE_UNAVAILABLE/);assert.equal(sends,0);
  await assert.rejects(f.store.createOrGet({requestId:'../other'},'a'.repeat(64),{}),/INVALID_REQUEST_ID/);
});
