const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'dist/app.js'), 'utf8');
const i18n = fs.readFileSync(path.join(root, 'dist/i18n.js'), 'utf8');
const counts = {'Single Desk':1, 'Bench':2, 'Single Desk + Screen':1, 'Bench + Screen':2};

test('All four workstation cards include the standard 1400 × 700 mm top with correct quantities', () => {
  const cards = [...html.matchAll(/<label class="configurator-card[^>]*>([\s\S]*?)<\/label>/g)].map(match => match[1]);
  assert.equal(cards.length, 4);
  for (const [name, count] of Object.entries(counts)) {
    const card = cards.find(value => value.includes(`value="${name}"`));
    assert.ok(card, name);
    const tabletop = card.match(/class="configurator-tabletop">([^<]+)</)[1];
    assert.ok(tabletop.startsWith(`0${count} mặt bàn tiêu chuẩn`));
    assert.match(tabletop, /1400 × 700 mm/);
    if (count === 2) assert.match(tabletop, /Mỗi mặt/);
    assert.ok(i18n.includes(`'${tabletop}':`));
  }
  const standard = html.match(/<div class="configurator-standard">([\s\S]*?)<\/div>/)[1];
  assert.match(standard, /Mặt bàn 1400 × 700 mm cho mỗi vị trí làm việc/);
  assert.match(standard, /01 cable tray \+ 01 cable riser/);
  assert.match(html, /Mỗi mặt bàn tiêu chuẩn có kích thước 1400 × 700 mm/);
});

test('Configuration advice carries the standard size and counts for every selected option', () => {
  const update = app.match(/function updateWorkstationConfiguration\(input\)\{[\s\S]*?\n\}/)[0];
  const elements = new Map();
  const context = vm.createContext({
    window: {},
    $: selector => {
      if (!elements.has(selector)) elements.set(selector, {style: {}});
      return elements.get(selector);
    },
    $$: () => []
  });
  vm.runInContext(update, context);
  for (const [name, count] of Object.entries(counts)) {
    context.updateWorkstationConfiguration({value: name});
    const request = new URL(elements.get('#configuratorCta').href);
    assert.equal(request.protocol, 'mailto:');
    assert.equal(request.pathname, 'hi@tfw.space');
    assert.equal(request.searchParams.get('subject'), `Tư vấn cấu hình workstation · ${name}`);
    const body = request.searchParams.get('body');
    assert.ok(body.includes(`Standard tabletops: ${count} × 1400 × 700 mm (each)`));
    assert.ok(body.includes(`Included cable trays: ${count}`));
    assert.ok(body.includes(`Included cable risers: ${count}`));
    assert.equal(elements.get('#configuratorSelected').textContent, name);
  }
  assert.ok(app.includes('updateWorkstationConfiguration($(\'[name="workstationConfiguration"]:checked\'));'));
});
