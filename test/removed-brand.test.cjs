const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
test('Removed Teknion ranges are absent from shop, detail data and order catalog',()=>{
 const app=fs.readFileSync('dist/app.js','utf8');
 const details=fs.readFileSync('dist/product-details.js','utf8');
 const entries=vm.runInNewContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
 const ctx={window:{}};vm.runInNewContext(details,ctx);
 const catalog=require('../server/catalog.json');
 for(const id of ['focus','teknion-pod','telescope','within']) {
   assert.ok(!entries.some(p=>p[0]===id));
   assert.equal(ctx.window.productDetails[id],undefined);
   assert.equal(catalog[id],undefined);
 }
 assert.doesNotMatch(app+details,/teknion/i);
 assert.ok(entries.some(p=>p[0]==='spiralis-e100'));
 assert.ok(entries.some(p=>p[0]==='precinct-focus-workpod'));
});
