const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const zlib = require('node:zlib');
const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'dist/app.js'), 'utf8');
const entries = vm.runInNewContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
const context = vm.createContext({window:{}});
for (const file of ['product-details.js', 'dress-collection.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, 'dist', file), 'utf8'), context);
}
const details = context.window.productDetails;
const views = ['green-front','green-rear','black-front','black-rear','blue-front','coral-front','ivory-front','ivory-rear'];

// Decode PNG alpha for validation only; never alter the source image.
function alphaStats(file) {
  const data = fs.readFileSync(file);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  const chunks = [];
  let width, height;
  for (let offset = 8; offset < data.length;) {
    const length = data.readUInt32BE(offset);
    const type = data.toString('ascii', offset + 4, offset + 8);
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0); height = chunk.readUInt32BE(4);
      assert.equal(chunk[8], 8, '8-bit PNG');
      assert.equal(chunk[9], 6, 'RGBA PNG');
      assert.equal(chunk[12], 0, 'non-interlaced PNG');
    }
    if (type === 'IDAT') chunks.push(chunk);
    offset += length + 12;
  }
  const raw = zlib.inflateSync(Buffer.concat(chunks));
  const stride = width * 4;
  let previous = Buffer.alloc(stride), transparent = 0, opaque = 0, border = 0;
  const paeth = (a,b,c) => {
    const p=a+b-c, pa=Math.abs(p-a), pb=Math.abs(p-b), pc=Math.abs(p-c);
    return pa<=pb && pa<=pc ? a : pb<=pc ? b : c;
  };
  for (let y = 0; y < height; y++) {
    const offset = y * (stride + 1), filter = raw[offset], row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a=x>=4?row[x-4]:0, b=previous[x], c=x>=4?previous[x-4]:0;
      assert.ok(filter >= 0 && filter <= 4);
      row[x]=(raw[offset+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter]) & 255;
    }
    for (let x = 0; x < width; x++) {
      const alpha=row[x*4+3];
      if (alpha <= 5) transparent++;
      if (alpha >= 240) opaque++;
      if (x===0 || y===0 || x===width-1 || y===height-1) border=Math.max(border,alpha);
    }
    previous=row;
  }
  return {width,height,transparent:transparent/(width*height),opaque:opaque/(width*height),border};
}

test('All Dress colour/view galleries and cards use matching transparent cutouts', () => {
  for (const [number, price] of [['01',3300000],['04',3500000],['05',4200000],['06',3500000]]) {
    const id='dress'+number, product=details[id], entry=entries.find(row=>row[0]===id);
    assert.deepEqual(Array.from(product.images), views.map(view=>`assets/cutouts/dress${number}-${view}.png`));
    assert.ok(product.galleryModes.every(mode=>mode==='cutout'));
    assert.equal(entry[4], product.images[0]);
    assert.equal(entry[2], 'Loose Furniture');
    assert.equal(entry[3], price);
    assert.equal(product.variants.length, 5);
  }
});

test('Activity Stool uses a transparent product image and retains its original lifestyle photo', () => {
  const product=details['activity-stool'];
  assert.deepEqual(Array.from(product.images), ['assets/cutouts/activity-stool-main.png','assets/products/activity-stool-in-use.jpg']);
  assert.deepEqual(Array.from(product.galleryModes), ['cutout','contain']);
  assert.equal(entries.find(row=>row[0]==='activity-stool')[4], product.images[0]);
});

test('All 33 cutouts have real transparent backgrounds with opaque products and unclipped margins', () => {
  const images = ['01','04','05','06'].flatMap(n=>details['dress'+n].images).concat(details['activity-stool'].images[0]);
  assert.equal(images.length, 33);
  for (const image of images) {
    const stats=alphaStats(path.join(root, 'dist', image));
    assert.equal(stats.width, stats.height, image);
    assert.ok(stats.width >= 1024, image);
    assert.ok(stats.transparent > .4, image+': background alpha');
    assert.ok(stats.opaque > .08, image+': opaque product');
    assert.ok(stats.border <= 5, image+': no clipped product');
  }
});

test('Transparent gallery mode removes the tile background without changing other galleries', () => {
  const css=fs.readFileSync(path.join(root, 'dist/collection.css'),'utf8');
  assert.ok(app.includes("const cutoutClass=requestedMode==='cutout'?' cutout':''"));
  assert.ok(app.includes('${photoClass}${cutoutClass}'));
  assert.match(css, /\.detail-image\.cutout,\.lean-detail \.detail-image\.cutout\{background:transparent\}/);
  assert.ok(css.includes('.detail-image:has(img[src$="/activity-stool-in-use.jpg"]){background:transparent}'));
  assert.match(css, /\.product-image-button img\[src\*="assets\/cutouts\/"\]\{mix-blend-mode:normal\}/);
});
