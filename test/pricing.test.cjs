const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {productPrice}=require('../dist/pricing.js');
const {normalize,makeOrder,excelRow,mail}=require('../server/orders.cjs');
const catalog=require('../server/catalog.json');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const app=read('dist/app.js');
const entries=vm.runInNewContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
const input=()=>({requestId:'12345678-1234-4234-8234-123456789abc',customer:{name:'VAT test',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},items:[{id:'sls-470-pro',quantity:2},{id:'anchor',quantity:1}],expectedSubtotal:40370000,paymentMethod:'bank'});

test('browser and server apply 10% VAT exactly once to every base catalog price',()=>{
  const context={window:{}};
  vm.runInNewContext(read('dist/pricing.js'),context);
  assert.equal(entries.length,Object.keys(catalog).length);
  for(const [id,name,,basePrice] of entries){
    const expected=productPrice(basePrice);
    assert.deepEqual(catalog[id],{name,...expected});
    assert.equal(context.window.tfwPricing.productPrice(basePrice).price,expected.price);
    assert.equal(expected.price,basePrice+Math.round(basePrice/10));
  }
  assert.equal(catalog['sls-470-pro'].price,17600000);
  assert.equal(catalog.anchor.price,5170000);
  assert.match(app,/\.\.\.window\.tfwPricing\.productPrice\(price\)/);
  const html=read('dist/index.html');
  assert.ok(html.indexOf('src="pricing.js"')<html.indexOf('src="app.js"'));
});
test('quote-only items stay unpriced and rounding is deterministic in whole VND',()=>{
  assert.deepEqual(productPrice(0),{basePrice:0,price:0,vatRate:0,vatAmount:0});
  assert.equal(productPrice(105).price,116);
  for(const value of [-1,1.5,NaN,Infinity,'100'])assert.throws(()=>productPrice(value),/Invalid/);
  assert.throws(()=>productPrice(Number.MAX_SAFE_INTEGER),/Invalid/);
});
test('VAT-inclusive orders retain exact quantities and cannot override tax or pay the old net total',()=>{
  const request=input(); request.items[0].unitPrice=1; request.items[0].vatRate=0;
  const order=makeOrder(normalize(request,catalog));
  assert.equal(order.subtotal,40370000);
  assert.equal(order.netSubtotal,36700000);
  assert.equal(order.vatIncluded,3670000);
  assert.equal(order.subtotal,order.netSubtotal+order.vatIncluded);
  for(const total of [36700000,44407000])assert.throws(()=>normalize({...input(),expectedSubtotal:total},catalog),/PRICE_CHANGED/);
  assert.throws(()=>normalize(input(),{...catalog,anchor:{...catalog.anchor,vatAmount:0}}),/INVALID_CATALOG/);
});
test('PO and the existing 24-field Excel payload share gross totals and explicit included VAT',()=>{
  const request=input();request.customer.notes='=HYPERLINK("bad")';
  const order=makeOrder(normalize(request,catalog));
  const row=excelRow(order);
  assert.equal(Object.keys(row).length,24);
  assert.equal(row.SubtotalVND,40370000);assert.equal(row.TotalVND,40370000);
  assert.match(row.Notes,/VAT included: 3670000 VND/);assert.ok(row.Notes.startsWith("'="));
  const rows=JSON.parse(row.OrderItems);
  assert.equal(rows.reduce((sum,item)=>sum+item.vatLineTotal,0),3670000);
  const message=mail(order).message;
  assert.match(message.body.content,/Prices include 10% VAT/);
  assert.match(message.body.content,/40\.370\.000 VND/);
  const attachment=message.attachments.find(item=>item.name==='tfw-order.json');
  const payload=JSON.parse(Buffer.from(attachment.contentBytes,'base64'));
  assert.equal(payload.row.TotalVND,row.TotalVND);assert.equal(payload.schemaVersion,1);
});
test('From is a display label only; cart and order values remain exact',()=>{
  assert.match(app,/const priceText=p=>p.contactOnly\?'Liên hệ':`Từ \$\{money\(p.price\)\} \(đã gồm 10% VAT\)`/);
  assert.match(read('dist/i18n.js'),/From \$1 \(including 10% VAT\)/);
  assert.ok(!read('server/orders.cjs').includes('From ${money'));
});
