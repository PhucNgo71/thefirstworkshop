const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {normalize} = require('../server/orders.cjs');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'dist/app.js'), 'utf8');
const entries = vm.runInNewContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
const context = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root, 'dist/product-details.js'), 'utf8'), context);
const details = context.window.productDetails;
const translations = vm.runInNewContext('(' + fs.readFileSync(path.join(root, 'dist/i18n.js'), 'utf8').match(/const english = ({[\s\S]*?\n});/)[1] + ')');
const catalog = require('../server/catalog.json');
const additions = {
  'hag-capisco': {category:'Seatings', brand:'HÅG / Flokk', images:3},
  'wichair': {category:'Seatings', brand:'Wilkhahn', images:4},
  'precinct-focus-workpod': {category:'Loose Furniture', brand:'Zenith', images:6},
  'precinct-focus-lounge': {category:'Loose Furniture', brand:'Zenith', images:4},
  'precinct-meet-booth': {category:'Loose Furniture', brand:'Zenith', images:4},
  'activity-stool': {category:'Loose Furniture', brand:'Actiforce', images:2},
  'acticase-actihook': {category:'Accessories', brand:'Actiforce', images:4}
};

test('New manufacturer products have unique routes, requested categories and quotation-only pricing', () => {
  assert.equal(new Set(entries.map(entry => entry[0])).size, entries.length);
  for (const [id, expected] of Object.entries(additions)) {
    const entry = entries.find(entry => entry[0] === id);
    assert.equal(entry[2], expected.category);
    assert.equal(entry[3], 0);
    assert.equal(entry[5], id);
    assert.equal(catalog[id].name, entry[1]);
    assert.equal(catalog[id].price, 0);
    assert.equal(details[id].brand, expected.brand);
    assert.equal(entry[4], details[id].images[0]);
    assert.throws(() => normalize({
      requestId:'12345678-1234-4234-8234-123456789abc',
      customer:{name:'TEST Catalog',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},
      items:[{id,quantity:1}],expectedSubtotal:0,paymentMethod:'bank'
    }, catalog));
  }
});

test('New galleries use available distinct local manufacturer photographs and translated copy', () => {
  for (const [id, expected] of Object.entries(additions)) {
    const product = details[id];
    assert.equal(product.images.length, expected.images);
    assert.equal(new Set(product.images).size, expected.images);
    assert.equal(product.galleryModes.length, expected.images);
    assert.equal(product.galleryLabels.length, expected.images);
    for (const image of product.images) assert.ok(fs.statSync(path.join(root, 'dist', image)).size > 10000);
    assert.deepEqual(Array.from(product.galleryModes), Array.from({length:expected.images}, (_, index) => id === 'activity-stool' && index === 0 ? 'cutout' : 'contain'));
    for (const value of [product.productType, product.description, product.specifications, ...(product.highlights||[]), ...product.galleryLabels.map(label => label[1])]) {
      assert.ok(translations[value], id + ': missing English translation: ' + value);
    }
    assert.match(product.sourceUrl, /^https:\/\/(www\.zenithinteriors\.com|actiforce\.com|store\.flokk\.com|www\.wilkhahn\.com)\//);
  }
});

test('New specifications preserve product-specific dimensions and distinguish the hook from a case bundle', () => {
  assert.match(details['precinct-focus-workpod'].specifications, /920 × 840 mm/);
  assert.match(details['precinct-focus-workpod'].specifications, /800 \/ 1200 \/ 1375 mm/);
  assert.match(details['precinct-focus-workpod'].specifications, /430 × 810 × 695 mm/);
  assert.ok(!details['precinct-focus-workpod'].specifications.includes('1400'));
  assert.match(details['activity-stool'].specifications, /610–870 mm/);
  assert.match(details['activity-stool'].specifications, /Ø 339 mm/);
  assert.match(details['acticase-actihook'].specifications, /120 × 40 × 187 mm/);
  assert.match(details['acticase-actihook'].specifications, /không bao gồm ActiCase/);
  assert.ok(!details['acticase-actihook'].images.some(image => /3d-view/.test(image)));
  assert.match(details['precinct-focus-lounge'].specifications, /Trio 2070 × 685 mm/);
  assert.match(details['precinct-focus-lounge'].specifications, /1200 \/ 1375 mm/);
  assert.match(details['precinct-meet-booth'].specifications, /Large 2170 × 2035 mm/);
  assert.match(details['precinct-meet-booth'].specifications, /750 mm tại châu Á/);
  assert.ok(!details['precinct-meet-booth'].specifications.includes('1400'));
});
