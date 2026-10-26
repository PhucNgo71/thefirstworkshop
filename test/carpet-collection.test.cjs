const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {entries,context,translations}=require('../scripts/audit-product-english.cjs');
const catalog=require('../server/catalog.json');
const first=['retrofit','building-blocks','natural-supply','airborn'];
const carpets=entries.filter(p=>p[2]==='Flooring Solutions');
test('Carpets are quotation-only and retain budget group order',()=>{
  assert.equal(carpets.length,11);
  assert.deepEqual(Array.from(carpets.slice(0,4),p=>p[0]),first);
  for(const [id] of carpets){
    const display=context.window.carpetCollection.priceText(id);
    assert.equal(translations[display],'Contact for quotation');
    assert.equal(catalog[id].price,0,`${id}: range must not become a purchasable fixed price`);
  }
});
test('Removed carpets are absent and all four additions have local photos and bilingual details',()=>{
  for(const id of ['on-the-track','ripple-effect','cornerstone']){
    assert.ok(!entries.some(p=>p[0]===id));
    assert.equal(context.window.productDetails[id],undefined);
    assert.equal(catalog[id],undefined);
  }
  for(const id of ['moments-in-time','pattern-play','coastline','passage']){
    const p=context.window.productDetails[id];
    assert.ok(carpets.some(row=>row[0]===id));
    assert.equal(p.brand,'Milliken');
    assert.ok(translations[p.description]);assert.ok(translations[p.specifications]);
    for(const image of p.images)assert.ok(fs.statSync(path.join(__dirname,'../dist',image)).size>10000);
  }
});
