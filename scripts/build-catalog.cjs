// Only evaluates the repository-owned catalog literal, never customer input.
const fs = require('node:fs');
const vm = require('node:vm');
const {productPrice} = require('../dist/pricing.js');
const source = fs.readFileSync('dist/app.js', 'utf8');
const literal = source.match(/const catalogEntries=(\[[\s\S]*?\n\]);/);
if (!literal) throw new Error('Catalog layout changed; review price extraction before deploying.');
const entries = vm.runInNewContext(literal[1], Object.create(null), {timeout: 1000});
const catalog = Object.create(null);
for (const [id, name, , price] of entries) {
  if (catalog[id] || !Number.isSafeInteger(price) || price < 0) throw new Error('Invalid catalog');
  catalog[id] = {name, ...productPrice(price)};
}
fs.mkdirSync('server', {recursive: true});
fs.writeFileSync('server/catalog.json', JSON.stringify(catalog, null, 2) + '\n');
console.log(`Validated ${entries.length} server-side catalog prices.`);
