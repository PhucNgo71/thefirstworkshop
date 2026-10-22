const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),app=fs.readFileSync(path.join(root,'dist/app.js'),'utf8');
test('Bench card and gallery use the same original Actiforce photo, with a distinct side view',()=>{
  const context=vm.createContext({window:{},wpodExperience:{experience:{}}});
  const entries=vm.runInContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1],context);
  const overrides=vm.runInContext('('+app.match(/const manufacturerOverrides=({[\s\S]*?\n});/)[1]+')',context);
  const entry=entries.find(row=>row[0]==='sls470bench');
  assert.equal(entry[3],32000000);
  assert.equal(entry[4],overrides.sls470bench.images[0]);
  assert.equal(new Set(overrides.sls470bench.images).size,2);
  for(const image of overrides.sls470bench.images)assert.ok(fs.statSync(path.join(root,'dist',image)).size>10000);
  assert.ok(!overrides.sls470bench.galleryLabels.flat().some(value=>/Screen|monitor arm/.test(value)));
});
test('Single and Bench configurator modes load original standalone images without a composite offset',()=>{
  const states=vm.runInNewContext('('+app.match(/const renderStates=({[\s\S]*?\n });/)[1]+')');
  for(const name of ['Single Desk','Bench']){assert.equal(states[name].mode,'direct');assert.equal(states[name].transform,'none');assert.match(states[name].src,/actiforce\.jpg$/);assert.ok(fs.existsSync(path.join(root,'dist',states[name].src)));}
  const html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
  assert.ok(html.includes('class="direct" id="configuratorImage" src="'+states['Single Desk'].src+'"'));
  assert.equal(states['Single Desk + Screen'].mode,'composite');
  assert.equal(states['Bench + Screen'].mode,'direct');
});
