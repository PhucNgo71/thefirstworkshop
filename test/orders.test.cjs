const test=require('node:test');
const assert=require('node:assert/strict');
const {normalize,makeOrder,excelRow,mail,submit}=require('../server/orders.cjs');
const catalog={anchor:{name:'Anchor Staff Chair',price:4700000},quote:{name:'Quote only',price:0}};
const input=()=>({requestId:'12345678-1234-4234-8234-123456789abc',customer:{name:'Test Customer',email:'test@example.com',phone:'0909000000',address:'Test address',notes:''},items:[{id:'anchor',quantity:2}],expectedSubtotal:9400000,paymentMethod:'bank'});
function memory() {
  const rows=new Map(); let sends=0;
  return {rows,get sends(){return sends;},catalog,
    store:{async createOrGet(order,fingerprint,row){if(!rows.has(order.requestId))rows.set(order.requestId,{order,fingerprint,row,emailStatus:'Pending',excelStatus:'Pending'});return rows.get(order.requestId);},async claimEmail(r){if(r.emailStatus!=='Pending')return false;r.emailStatus='Sending';return true;},async emailResult(r,s){r.emailStatus=s;}},
    async sendMail(){sends++;}
  };
}
test('authoritative totals ignore submitted unit price',()=>{const i=input();i.items[0].unitPrice=1;assert.equal(normalize(i,catalog).subtotal,9400000);});
test('tampered totals fail',()=>{const i=input();i.expectedSubtotal=1;assert.throws(()=>normalize(i,catalog),/PRICE_CHANGED/);});
test('invalid product, quote-only and invalid quantities fail',()=>{for(const item of [{id:'bad',quantity:1},{id:'quote',quantity:1},{id:'anchor',quantity:-1},{id:'anchor',quantity:1.5},{id:'anchor',quantity:101}]){const i=input();i.items=[item];assert.throws(()=>normalize(i,catalog),/INVALID_ITEMS/);}});
test('card payments rejected',()=>{const i=input();i.paymentMethod='card';assert.throws(()=>normalize(i,catalog),/INVALID_PAYMENT/);});
test('invalid email, missing address, large input rejected',()=>{for(const changes of [{email:'bad'},{address:''},{name:'x'.repeat(121)}]){const i=input();Object.assign(i.customer,changes);assert.throws(()=>normalize(i,catalog),/INVALID_DETAILS/);}});
test('honeypot rejected',()=>assert.throws(()=>normalize({...input(),website:'bot'},catalog),/INVALID_ORDER/));
test('sequential retries create one record and send once',async()=>{const d=memory();const a=await submit(input(),d);const b=await submit(input(),d);assert.equal(a.orderNumber,b.orderNumber);assert.equal(d.rows.size,1);assert.equal(d.sends,1);});
test('concurrent retries send once',async()=>{const d=memory();await Promise.all(Array.from({length:10},()=>submit(input(),d)));assert.equal(d.sends,1);assert.equal(d.rows.size,1);});
test('same key with different order fails',async()=>{const d=memory();await submit(input(),d);const i=input();i.customer.name='Other';await assert.rejects(submit(i,d),/REQUEST_CONFLICT/);assert.equal(d.sends,1);});
test('storage failure never sends email',async()=>{const d=memory();d.store.createOrGet=async()=>{throw Error('down');};await assert.rejects(submit(input(),d));assert.equal(d.sends,0);});
test('ambiguous email failure retains order without resending',async()=>{const d=memory();let calls=0;d.sendMail=async()=>{calls++;throw Error('timeout');};assert.equal((await submit(input(),d)).emailStatus,'NeedsReview');await submit(input(),d);assert.equal(calls,1);assert.equal(d.rows.size,1);});
test('email content escaped and latest CC recipient fixed',()=>{const i=input();i.customer.name='<script>alert(1)</script>';const order=makeOrder(normalize(i,catalog));const m=mail(order);assert.ok(!m.message.body.content.includes('<script>'));assert.equal(m.message.toRecipients[0].emailAddress.address,'test@example.com');assert.equal(m.message.ccRecipients[0].emailAddress.address,'phuc.ngo@tfw.space');assert.equal(m.message.bccRecipients,undefined);assert.ok(m.message.body.content.includes('UNPAID'));assert.ok(m.message.attachments[0].contentBytes);assert.ok(!JSON.stringify(m).includes('phuc.ngo@ergovn.com'));});
test('order-copy attachment includes all Excel fields and stable request ID',()=>{const order=makeOrder(normalize(input(),catalog));const attachment=mail(order).message.attachments.find(a=>a.name==='tfw-order.json');const data=JSON.parse(Buffer.from(attachment.contentBytes,'base64').toString('utf8'));assert.equal(data.schemaVersion,1);assert.equal(data.source,'tfw.space');assert.equal(Object.keys(data.row).length,24);assert.equal(data.row.RequestId,order.requestId);assert.equal(data.row.OrderNumber,order.orderNumber);assert.equal(data.row.EmailStatus,'Order copy received');assert.equal(data.row.PaymentStatus,'Unpaid');});
test('Excel row protects formulas and includes all 24 fields',()=>{const i=input();i.customer.name='=HYPERLINK("bad")';const row=excelRow(makeOrder(normalize(i,catalog)));assert.equal(Object.keys(row).length,24);assert.ok(row.CustomerName.startsWith("'="));assert.equal(row.TotalVND,9400000);assert.equal(row.PaymentStatus,'Unpaid');});
