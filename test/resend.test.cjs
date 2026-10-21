const test = require('node:test');
const assert = require('node:assert/strict');
const {resend} = require('../server/resend.cjs');
const {normalize, makeOrder, mail} = require('../server/orders.cjs');
const env = {RESEND_API_KEY:'test-only-placeholder', RESEND_FROM:'orders@notify.tfw.space'};
const payload = () => mail(makeOrder(normalize({requestId:'12345678-1234-4234-8234-123456789abc',
  customer:{name:'Test Customer', email:'customer@example.com', phone:'0909000000',address:'Test address'},
  items:[{id:'anchor',quantity:1}],expectedSubtotal:4700000,paymentMethod:'bank'},
  {anchor:{name:'Anchor Staff Chair',price:4700000}}),new Date('2026-10-19T00:00:00Z')));
test('Resend maps the customer, latest CC, reply address and both attachments',async()=>{
  let sent;const service=resend(env,async(url,options)=>{sent={url,options};return Response.json({id:'provider-test-id'});});
  assert.deepEqual(await service.sendMail(payload()),{providerId:'provider-test-id',accepted:true});
  assert.equal(sent.url,'https://api.resend.com/emails');
  const body=JSON.parse(sent.options.body);
  assert.equal(body.from,'thefirstworkshop <orders@notify.tfw.space>');
  assert.deepEqual(body.to,['customer@example.com']);assert.deepEqual(body.cc,['phuc.ngo@tfw.space']);
  assert.equal(body.bcc,undefined);assert.equal(body.reply_to,'phuc.ngo@tfw.space');
  assert.deepEqual(body.attachments.map(a=>a.filename),['TFW-12345678123442348234123456789ABC.html','tfw-order.json']);
  assert.equal(sent.options.headers['Idempotency-Key'],'order-request/12345678-1234-4234-8234-123456789abc');
});
test('Resend is unavailable without secure credentials and the explicitly approved sender',async()=>{
  for(const config of [{},{...env,RESEND_FROM:'onboarding@resend.dev'},{...env,RESEND_FROM:'evil@tfw.space.invalid'},{...env,RESEND_FROM:'hi@tfw.space'},{...env,RESEND_FROM:'other@notify.tfw.space'}])
    await assert.rejects(resend(config,async()=>{throw Error('must not call');}).sendMail(payload()),/THIRD_PARTY_EMAIL_NOT_CONFIGURED/);
});
test('Resend rejects changed copy recipients and malformed order attachments',async()=>{
  for(const modify of [p=>p.message.ccRecipients[0].emailAddress.address='other@example.com',p=>p.message.attachments=[]]){
    const p=payload();modify(p);await assert.rejects(resend(env,async()=>{throw Error('must not call');}).sendMail(p),/INVALID_EMAIL_PAYLOAD/);
  }
});
test('Resend failures expose no private provider details',async()=>{
  await assert.rejects(resend(env,async()=>new Response('private provider response',{status:422})).sendMail(payload()),e=>e.code==='EMAIL_NOT_ACCEPTED'&&!e.message.includes('private'));
  await assert.rejects(resend(env,async()=>{throw Error('secret transport error');}).sendMail(payload()),/EMAIL_SEND_UNCERTAIN/);
});
