const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('Both Zenith screen ranges are separate contact-only Accessories with local photos',()=>{
  const source=fs.readFileSync('dist/app.js','utf8');
  const entries=vm.runInNewContext(source.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync('dist/product-details.js','utf8'),context);
  const catalog=require('../server/catalog.json');
  for(const id of ['simpl-screens','precinct-screens']) {
    assert.equal(entries.filter(p=>p[0]===id).length,1);
    assert.equal(entries.find(p=>p[0]===id)[2],'Accessories');
    assert.equal(catalog[id].price,0);
    const detail=context.window.productDetails[id];
    assert.equal(detail.brand,'Zenith');
    assert.equal(detail.images.length,2);
    for(const image of detail.images) assert.ok(fs.statSync('dist/'+image).size>1000);
  }
  assert.equal(catalog['screen-fabric-1400'].price,2750000);
  assert.equal(catalog['modesty-mfc-1400'].price,1500000);
});
