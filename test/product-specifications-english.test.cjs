const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {entries,context,overrides,translations}=require('../scripts/audit-product-english.cjs');
const edits=require('../scripts/product-specifications-en.json');
const root=path.resolve(__dirname,'..');
const i18n=fs.readFileSync(path.join(root,'dist/i18n.js'),'utf8');
const vietnamese=/[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉĩịọỏốồổỗộớờởỡợụủũứừửữựỳỵỷỹ]/i;
const fallback='Thông số chi tiết được xác nhận theo cấu hình và báo giá.';
test('Every product detail field has an English translation, beyond specifications',()=>{
  const {result}=require('../scripts/audit-product-english.cjs');
  assert.deepEqual(result,[],JSON.stringify(result.map(x=>x.uses)));
  const generated=fs.readFileSync(path.join(root,'dist/detail-translations.js'),'utf8');
  const c=vm.createContext({window:{}});vm.runInContext(generated,c);
  assert.deepEqual(JSON.parse(JSON.stringify(c.window.detailTranslations)),require('../scripts/product-details-en.json'));
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  assert.ok(html.indexOf('src="detail-translations.js"')<html.indexOf('src="i18n.js"'));
});
function source(id){return {...context.window.productDetails[id],...overrides[id],...context.window.productGalleryOverrides?.[id]};}
test('All product specification panels render English through the actual translator',()=>{
  const c=vm.createContext({english:translations});
  vm.runInContext(i18n.slice(i18n.indexOf('function translatedText('),i18n.indexOf('function applyLanguage(')),c);
  assert.equal(entries.length,100);
  for(const [id] of entries){
    c.input=source(id).specifications||fallback;
    const output=vm.runInContext('translatedText(input)',c);
    assert.ok(output.trim(),`${id}: empty English specifications`);
    assert.equal(vietnamese.test(output),false,`${id}: untranslated specifications`);
    assert.equal(/&(?:plusmn|ge|Prime);/.test(output),false,`${id}: visible HTML entity`);
    assert.equal(/^(?:Dimensions|Technical specifications|Features):?\s*$/i.test(output),false,`${id}: empty heading`);
  }
});
test('Edited translations match current product data, including runtime overrides',()=>{
  for(const [id,expected] of Object.entries(edits))assert.equal(translations[source(id).specifications],expected,`${id}: rebuild specification translations`);
  assert.match(translations[source('sls1050').specifications],/1400 × 700/);
  assert.match(translations[source('sls470bench').specifications],/1400 × 700/);
  assert.match(translations[source('niro').specifications],/Seat height: 445–540 mm/);
  assert.match(translations[source('framery-four').specifications],/232\.9 × 235\.2 × 129\.2 cm/);
  assert.match(translations[source('wpod3').specifications],/Current draw: 0\.18 A/);
});
test('Specification translations load before English rendering on the shipped page',()=>{
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  assert.ok(html.indexOf('src="specification-translations.js"')<html.indexOf('src="i18n.js"'));
  assert.match(i18n,/Object\.assign\(english, window\.specificationTranslations \|\| \{\}\)/);
});
