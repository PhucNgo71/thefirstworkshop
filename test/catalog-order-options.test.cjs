const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {productPrice}=require('../dist/pricing.js');
const {variantsFor,cartProducts}=require('../dist/product-options.js');
const {normalize,makeOrder,excelRow,mail}=require('../server/orders.cjs');
const catalog=require('../server/catalog.json');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const app=read('dist/app.js');
const ctx=vm.createContext({window:{}});
for(const file of ['product-details.js','product-gallery.js','dress-collection.js','sls-collection.js','pricing.js','product-options.js'])vm.runInContext(read('dist/'+file),ctx);
vm.runInContext(app.split('let cart=')[0],ctx);
vm.runInContext(app.slice(app.indexOf('function featuredBrandPriority('),app.indexOf('function renderPricedOptions(')),ctx);
const evaluate=source=>JSON.parse(JSON.stringify(vm.runInContext(source,ctx)));
const anchor={id:'anchor',name:'Anchor Staff Chair',...productPrice(4700000)};
const request=(items=[{id:'anchor-headrest',quantity:1}],expectedSubtotal=5775000)=>({
  requestId:'12345678-1234-4234-8234-123456789abc',
  customer:{name:'TEST Headrest',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},
  items,expectedSubtotal,paymentMethod:'bank'
});

test('Removed generic endorsement is absent from all shipped page text and templates',()=>{
  for(const file of fs.readdirSync(path.join(__dirname,'..','dist'))){
    if(/\.(js|html|css)$/.test(file))assert.doesNotMatch(read('dist/'+file),/TFW\s+SELECTED/i,file);
  }
  assert.match(read('dist/index.html'),/<span id="detailOrigin" hidden><\/span>/);
});

test('Product details hide empty origin badges and retain real origins without leaking between products',()=>{
  const originCode=app.match(/const origin=source\.specifications[^\n]+/)[0];
  const sources=evaluate('products.map(product=>({...window.productDetails?.[product.id],...manufacturerOverrides[product.id],...window.productGalleryOverrides?.[product.id]}))');
  const label={textContent:'',hidden:true};
  for(const source of [{specifications:'Xuất xứ thương hiệu: Germany'},...sources,{}]){
    vm.runInNewContext(originCode,{source,$:selector=>{assert.equal(selector,'#detailOrigin');return label;}});
    const expected=source.specifications?.match(/Xuất xứ thương hiệu:\s*([^\n]+)/i)?.[1]?.trim()||'';
    assert.equal(label.textContent,expected);
    assert.equal(label.hidden,!expected);
  }
});

test('Featured order groups Zenith then TFW, stably, across every category without changing the source catalog',()=>{
  const original=evaluate('products.map(p=>p.id)');
  const categories=evaluate("['all',...new Set(products.map(p=>p.scope))]");
  for(const category of categories){
    const featured=evaluate(`catalogViewProducts(${JSON.stringify(category)}).map(p=>({id:p.id,rank:featuredBrandPriority(p)}))`);
    for(let i=1;i<featured.length;i++)assert.ok(featured[i-1].rank<=featured[i].rank,category);
    for(const rank of [0,1,2]){
      const expected=evaluate(`products.filter(p=>(${JSON.stringify(category)}==='all'||p.scope===${JSON.stringify(category)})&&featuredBrandPriority(p)===${rank}).map(p=>p.id)`);
      assert.deepEqual(featured.filter(p=>p.rank===rank).map(p=>p.id),expected);
    }
  }
  const ranked=evaluate('Object.fromEntries(products.map(p=>[p.id,featuredBrandPriority(p)]))');
  for(const id of ['niro','vox','khyn','jac-chairs','precinct-focus-workpod'])assert.equal(ranked[id],0);
  for(const id of ['anchor','parco','shirly','ck06','dress04'])assert.equal(ranked[id],1);
  assert.equal(ranked['sls-470-pro'],2);
  const seating=evaluate("catalogViewProducts('Seatings').map(p=>p.id)");
  assert.equal(seating.indexOf('khyn'),seating.indexOf('vox')+1);
  assert.deepEqual(evaluate('products.map(p=>p.id)'),original);
});

test('Explicit price sorting still works and JAC Chair is only in Loose Furniture',()=>{
  const low=evaluate("catalogViewProducts('all','low').map(p=>p.contactOnly?Number.MAX_SAFE_INTEGER:p.price)");
  assert.deepEqual(low,[...low].sort((a,b)=>a-b));
  const high=evaluate("catalogViewProducts('all','high').map(p=>p.price)");
  assert.deepEqual(high,[...high].sort((a,b)=>b-a));
  assert.equal(evaluate("products.find(p=>p.id==='jac-chairs').scope"),'Loose Furniture');
  assert.ok(evaluate("catalogViewProducts('Loose Furniture').some(p=>p.id==='jac-chairs')"));
  assert.ok(!evaluate("catalogViewProducts('Seatings').some(p=>p.id==='jac-chairs')"));
  assert.equal(evaluate("products.filter(p=>p.id==='jac-chairs').length"),1);
  assert.equal(evaluate("products.find(p=>p.id==='jac').scope"),'Loose Furniture');
});

test('Anchor headrest is a separate complete-chair SKU with 550000 net / 605000 gross surcharge, not a shop duplicate',()=>{
  const [base,headrest]=variantsFor(anchor);
  assert.equal(base.id,'anchor');assert.equal(base.basePrice,4700000);assert.equal(base.price,5170000);
  assert.equal(headrest.id,'anchor-headrest');assert.equal(headrest.parentId,'anchor');
  assert.equal(headrest.basePrice,5250000);assert.equal(headrest.price,5775000);assert.equal(headrest.vatAmount,525000);
  assert.equal(headrest.basePrice-base.basePrice,550000);assert.equal(headrest.price-base.price,605000);
  assert.equal(evaluate("products.filter(p=>p.id==='anchor-headrest').length"),0);
  assert.equal(evaluate('orderProducts.length'),evaluate('products.length')+1);
  const standalone={id:'other',name:'Other',...productPrice(1000000)};
  assert.deepEqual(cartProducts([anchor,standalone]),[base,headrest,standalone]);
  assert.equal(catalog['anchor-headrest'].price,headrest.price);
  const html=read('dist/index.html');
  assert.ok(html.indexOf('src="pricing.js"')<html.indexOf('src="product-options.js"'));
  assert.ok(html.indexOf('src="product-options.js"')<html.indexOf('src="app.js"'));
});

test('Server enforces headrest pricing and options and keeps both configurations distinct',()=>{
  const input=request([{id:'anchor',quantity:1,options:'With headrest for free'},{id:'anchor-headrest',quantity:2,options:'No headrest',unitPrice:1,vatRate:0}],16720000);
  const normalized=normalize(input,catalog);
  assert.equal(normalized.items.length,2);
  assert.equal(normalized.subtotal,16720000);assert.equal(normalized.netSubtotal,15200000);assert.equal(normalized.vatIncluded,1520000);
  assert.equal(normalized.items[0].options,catalog.anchor.canonicalOptions);
  assert.equal(normalized.items[1].options,catalog['anchor-headrest'].canonicalOptions);
  assert.equal(normalized.items[1].unitPrice,5775000);assert.equal(normalized.items[1].lineTotal,11550000);
  assert.throws(()=>normalize(request(undefined,5170000),catalog),/PRICE_CHANGED/);
  assert.throws(()=>normalize(request([{id:'anchor-free-headrest',quantity:1}]),catalog),/INVALID_ITEMS/);
  assert.throws(()=>normalize(request([{id:'anchor-headrest',quantity:-1}]),catalog),/INVALID_ITEMS/);
  assert.throws(()=>normalize(request([{id:'anchor-headrest',quantity:1},{id:'anchor-headrest',quantity:1}],11550000),catalog),/INVALID_ITEMS/);
});

test('Headrest configuration and included VAT reach PO and the existing Excel payload without sending anything',()=>{
  const order=makeOrder(normalize(request(),catalog));
  const row=excelRow(order);
  assert.equal(Object.keys(row).length,24);
  assert.equal(row.TotalVND,5775000);assert.equal(row.TotalQuantity,1);
  assert.match(row.Notes,/VAT included: 525000 VND/);
  const [item]=JSON.parse(row.OrderItems);
  assert.equal(item.id,'anchor-headrest');assert.match(item.name,/With headrest/);
  assert.equal(item.options,catalog['anchor-headrest'].canonicalOptions);
  const message=mail(order).message;
  assert.match(message.body.content,/With headrest/);assert.match(message.body.content,/5\.775\.000 VND/);
  assert.match(message.body.content,/525\.000 VND/);
  const payload=JSON.parse(Buffer.from(message.attachments.find(a=>a.name==='tfw-order.json').contentBytes,'base64'));
  assert.equal(payload.schemaVersion,1);assert.equal(payload.row.TotalVND,5775000);
  assert.deepEqual(JSON.parse(payload.row.OrderItems),order.items);
});
