const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {normalize,makeOrder,excelRow,mail} = require('../server/orders.cjs');
const {productPrice} = require('../dist/pricing.js');
const root = path.resolve(__dirname,'..');
const app = fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
const sandbox = vm.createContext({window:{},wpodExperience:{experience:{}}});
vm.runInContext(fs.readFileSync(path.join(root,'dist/sls-collection.js'),'utf8'),sandbox);
const entries = vm.runInContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1],sandbox);
const overrides = vm.runInContext('('+app.match(/const manufacturerOverrides=({[\s\S]*?\n});/)[1]+')',sandbox);
sandbox.window.applySlsDetails(overrides);
const catalog = require('../server/catalog.json');
const expected = {'sls1050':14000000,'sls770':15000000,'sls-470-pro':16000000,'sls470':17000000,'sls470bench':32000000};

test('SLS470 is separate from legacy SLS670 IDs with 16M base price including top, plus VAT once',()=>{
  assert.equal(new Set(entries.map(row=>row[0])).size,entries.length);
  assert.equal(catalog['sls-470-pro'].name,'SLS 470 PRO');
  assert.equal(catalog.sls1050.name,'SLS 1050');
  assert.equal(catalog.sls470.name,'SLS 670 PRO');
  assert.equal(catalog.sls470bench.name,'SLS 670 BENCH PRO');
  assert.equal(entries.find(row=>row[0]==='sls470')[5],'sls-670-pro');
  for(const [id,price] of Object.entries(expected)){
    assert.equal(catalog[id].basePrice,price);
    assert.equal(catalog[id].price,productPrice(price).price);
    assert.equal(entries.find(row=>row[0]===id)[3],price);
  }
});
test('SLS family shares standard tabletop format without copying model-specific features',()=>{
  for(const id of Object.keys(expected)){
    const model=overrides[id];
    assert.equal(model.optionGroups.length,3);
    assert.deepEqual(Array.from(model.optionGroups[0].values),['1400 × 700 mm']);
    assert.match(model.specifications.split('\n')[0],/1400 × 700 mm/);
    assert.match(model.description,/1400 × 700 mm/);
    assert.match(model.highlights[0],/1400 × 700 mm/);
    assert.equal(model.bundleItems[0].included,true);
    assert.match(sandbox.window.slsListingDetails[id],/1400 × 700 mm/);
    assert.match(sandbox.window.slsDefaultOrderOptions[id],/1400 x 700 mm/);
    assert.ok(sandbox.window.slsTranslations[model.description]);
    assert.ok(sandbox.window.slsTranslations[model.specifications]);
  }
  assert.equal(overrides.sls1050.optionGroups[2].values.length,4);
  assert.equal(overrides['sls-470-pro'].optionGroups[2].values.length,3);
  assert.match(overrides['sls-470-pro'].specifications,/70 × 70 mm/);
  assert.match(overrides.sls470.specifications,/6 × 9 cm/);
  assert.match(overrides.sls470bench.bundleItems[0].detail,/02 ×/);
  assert.match(overrides.sls470bench.gallerySpecs.find(row=>row[0]==='Mặt bàn')[1],/02 × 1400 × 700 mm/);
  assert.ok(overrides.sls470.bundleItems.find(item=>item.id==='cabletray').included);
  assert.ok(!overrides['sls-470-pro'].bundleItems.find(item=>item.id==='cabletray').included);
});
test('SLS checkout totals, PO and Excel use the updated server prices and tabletop package',()=>{
  const items=Object.keys(expected).map(id=>({id,quantity:1,options:sandbox.window.slsDefaultOrderOptions[id]}));
  const order=makeOrder(normalize({requestId:'12345678-1234-4234-8234-123456789abc',customer:{name:'TEST SLS validation',email:'test@example.com',phone:'0000000000',address:'TEST ONLY'},items,expectedSubtotal:103400000,paymentMethod:'bank'},catalog));
  const row=excelRow(order);
  assert.equal(row.TotalVND,103400000);
  assert.equal(order.netSubtotal,94000000);
  assert.equal(order.vatIncluded,9400000);
  const orderItems=JSON.parse(row.OrderItems);
  assert.equal(orderItems.length,5);
  for(const item of orderItems){assert.equal(item.unitPrice,productPrice(expected[item.id]).price);assert.match(item.options,/1400 x 700 mm/);}
  const attachment=mail(order).message.attachments.find(item=>item.name==='tfw-order.json');
  assert.equal(JSON.parse(Buffer.from(attachment.contentBytes,'base64')).row.TotalVND,103400000);
});
test('SLS assets and initialisation are wired before rendering and pricing is rebuilt',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  assert.ok(html.indexOf('sls-collection.js')<html.indexOf('src="app.js"'));
  assert.match(app,/window\.applySlsDetails\?\.\(manufacturerOverrides\)/);
  assert.match(fs.readFileSync(path.join(root,'dist/i18n.js'),'utf8'),/window.slsTranslations/);
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/assets/products/system-furniture/sls/catalog.json'),'utf8'));
  assert.equal(manifest.standardTabletop,'1400 × 700 mm');
  for(const entry of Object.values(manifest.products))assert.ok(expected[entry.catalogId]);
});
