const test=require('node:test'); const assert=require('node:assert/strict');
const handler=require('../api/orders.js');
function res(){return {headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.code=s;return this;},json(b){this.body=b;return this;}};}
test('route rejects GET',async()=>{const r=res();await handler({method:'GET',headers:{}},r);assert.equal(r.code,405);});
test('route rejects cross-origin submission',async()=>{const r=res();await handler({method:'POST',headers:{origin:'https://evil.example'}},r);assert.equal(r.code,403);});
test('route remains disabled until verified; does not report success',async()=>{delete process.env.ORDER_CHECKOUT_ENABLED;const r=res();await handler({method:'POST',headers:{origin:'https://tfw.space'}},r);assert.equal(r.code,503);assert.equal(r.body.error,'CHECKOUT_NOT_READY');assert.equal(r.headers['Cache-Control'],'no-store');});
test('test gate blocks other recipients and non-test customer names',async()=>{
  process.env.ORDER_CHECKOUT_ENABLED='true';process.env.ORDER_TEST_EMAIL='phuc.ngovh@gmail.com';
  try{for(const customer of [{email:'someone@example.com',name:'TEST order'},{email:'phuc.ngovh@gmail.com',name:'Ordinary order'}]){
    const r=res();await handler({method:'POST',headers:{origin:'https://tfw.space','content-type':'application/json'},body:{customer}},r);
    assert.equal(r.code,503);assert.equal(r.body.error,'CHECKOUT_TEST_ONLY');
  }}finally{delete process.env.ORDER_CHECKOUT_ENABLED;delete process.env.ORDER_TEST_EMAIL;}
});
