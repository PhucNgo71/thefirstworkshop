const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('Niro exposes eight brochure colour schemes with local reference images',()=>{
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist/product-details.js'),'utf8'),context);
  const niro=context.window.productDetails.niro;
  assert.equal(niro.swatches.length,8);
  assert.equal(niro.optionGroups[0].values.length,8);
  for(const code of ['D01','D02','D34','D36','D37','D38','D39','D47'])assert.ok(niro.optionGroups[0].values.some(value=>value.startsWith(code)));
  assert.match(niro.specifications,/D38 Spicy Orange — WAFFLE-110 \/ FRIDAY-111/);
  assert.match(niro.specifications,/D47 Wine Red — WAFFLE-580 \/ FRIDAY-580/);
  assert.equal(niro.images.length,18);
  assert.equal(niro.galleryLabels.length,niro.images.length);
  assert.equal(niro.galleryModes.length,niro.images.length);
  for(const image of niro.images)assert.ok(fs.statSync(path.join(root,'dist',image)).size>1000);
});
