const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {normalize,makeOrder,excelRow,submit,PRIVACY_NOTICE_VERSION}=require('../server/orders.cjs');
const catalog={chair:{name:'Chair',price:6600000}};
const input=()=>({requestId:'12345678-1234-4234-8234-123456789abc',privacyConsent:{accepted:true,noticeVersion:PRIVACY_NOTICE_VERSION},customer:{name:'TEST',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},items:[{id:'chair',quantity:1}],expectedSubtotal:6600000,paymentMethod:'bank'});
test('Missing, refused, forged and outdated consent cannot store an order or send email',async()=>{
 for(const consent of [undefined,null,false,{accepted:false,noticeVersion:PRIVACY_NOTICE_VERSION},{accepted:'true',noticeVersion:PRIVACY_NOTICE_VERSION},{accepted:true,noticeVersion:'old'}]){
 let writes=0,sends=0;await assert.rejects(submit({...input(),privacyConsent:consent},{catalog,store:{createOrGet(){writes++;}},sendMail(){sends++;}}),/PRIVACY_CONSENT_REQUIRED/);assert.equal(writes,0);assert.equal(sends,0);
 }
});
test('Receipt uses server time, preserves retry fingerprint and travels through existing Excel columns',()=>{
 const payload=input();payload.privacyConsent.recordedAt='forged';const a=normalize(payload,catalog),b=normalize(payload,catalog);assert.deepEqual(a,b);assert.equal(a.privacyConsent.recordedAt,undefined);
 const order=makeOrder(a,new Date('2026-11-03T01:02:03Z'));assert.equal(order.privacyConsent.recordedAt,'2026-11-03T01:02:03.000Z');assert.equal(order.privacyConsent.purpose,'order-processing-and-fulfilment');const row=excelRow(order);assert.equal(Object.keys(row).length,24);assert.match(row.Notes,/Order-data sharing: agreed/);assert.ok(row.Notes.includes(PRIVACY_NOTICE_VERSION));assert.ok(row.Notes.includes(order.privacyConsent.recordedAt));
});
test('Checkout has two unselected choices and enables submit only for agreement',async()=>{
 const html=fs.readFileSync('dist/index.html','utf8');const field=html.match(/<fieldset id="orderPrivacyConsent"[\s\S]*?<\/fieldset>/)[0];assert.equal((field.match(/name="privacyChoice"/g)||[]).length,2);assert.ok(!/\bchecked\b/.test(field));
 const source=fs.readFileSync('dist/order-checkout.js','utf8');assert.ok(source.includes(PRIVACY_NOTICE_VERSION));let validations=0,focus=0;const status={};const ctx={busy:false,submitButton:{},en:()=>true,form:{elements:{privacyChoice:{value:''}},reportValidity(){validations++;return false;}},document:{getElementById:()=>status,querySelector:()=>({focus(){focus++;}})}};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('  function updatePrivacyChoice()'),source.indexOf('  function safePaymentUI()')),ctx);vm.runInContext(source.slice(source.indexOf('  form.onsubmit=async'),source.indexOf("  document.getElementById('continueShopping')")),ctx);
 for(const choice of ['', 'decline']){ctx.form.elements.privacyChoice.value=choice;ctx.updatePrivacyChoice();assert.equal(ctx.submitButton.disabled,true);await ctx.form.onsubmit({preventDefault(){}});assert.equal(validations,0);}
 assert.equal(focus,2);ctx.form.elements.privacyChoice.value='agree';ctx.updatePrivacyChoice();assert.equal(ctx.submitButton.disabled,false);await ctx.form.onsubmit({preventDefault(){}});assert.equal(validations,1);ctx.busy=true;ctx.updatePrivacyChoice();assert.equal(ctx.submitButton.disabled,true);
});
