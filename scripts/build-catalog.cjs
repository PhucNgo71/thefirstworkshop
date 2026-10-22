// Only evaluates the repository-owned catalog literal, never customer input.
const fs = require('node:fs');
const vm = require('node:vm');
const {productPrice} = require('../dist/pricing.js');
const {cartProducts} = require('../dist/product-options.js');
const source = fs.readFileSync('dist/app.js', 'utf8');
const literal = source.match(/const catalogEntries=(\[[\s\S]*?\n\]);/);
if (!literal) throw new Error('Catalog layout changed; review price extraction before deploying.');
const entries = vm.runInNewContext(literal[1], Object.create(null), {timeout: 1000});
const catalog = Object.create(null);
const orderProducts = cartProducts(entries.map(([id, name, , price]) => ({id, name, ...productPrice(price)})));
for (const product of orderProducts) {
  const {id, name, basePrice, canonicalOptions} = product;
  if (catalog[id]) throw new Error('Duplicate catalog ID');
  catalog[id] = {name, ...productPrice(basePrice), ...(canonicalOptions ? {canonicalOptions} : {})};
}
fs.mkdirSync('server', {recursive: true});
fs.writeFileSync('server/catalog.json', JSON.stringify(catalog, null, 2) + '\n');
console.log(`Validated ${orderProducts.length} server-side configuration prices for ${entries.length} products.`);
