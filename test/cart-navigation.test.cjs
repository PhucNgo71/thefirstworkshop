const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {productPrice} = require('../dist/pricing.js');
const {cartProducts} = require('../dist/product-options.js');
const {normalize} = require('../server/orders.cjs');
const catalog = require('../server/catalog.json');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const app = read('dist/app.js');
const checkout = read('dist/order-checkout.js');
const entries = vm.runInNewContext(app.match(/const catalogEntries=(\[[\s\S]*?\n\]);/)[1]);
const products = cartProducts(entries.map(([id,name,,price]) => ({id,name,...productPrice(price),contactOnly:price===0})));

function harness() {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) {
      const classes = new Set();
      elements.set(selector, {hidden:true, innerHTML:'', textContent:'', attributes:{},
        classList:{add:value=>classes.add(value),remove:value=>classes.delete(value),contains:value=>classes.has(value)},
        setAttribute(name,value){this.attributes[name]=value;}, focus(){}});
    }
    return elements.get(selector);
  };
  const context = vm.createContext({
    cart:{}, orderProducts:products, activeProductId:null, selectedOptions:{},
    document:{body:{style:{}},querySelectorAll:()=>[],addEventListener:(name,handler)=>{context.keydown=handler;}},
    window:{}, $:element, setTimeout:fn=>fn(), en:()=>true,
    money:value=>String(value), saveCart:()=>{}, renderCart:()=>{}, showToast:text=>{context.toast=text;}
  });
  for (const name of ['addToCart','cartData','total','openCart','closeCart','openCheckout','closeCheckout']) {
    vm.runInContext(app.match(new RegExp('^function '+name+'\\([^\\n]+', 'm'))[0], context);
  }
  context.originalAddToCart = context.addToCart;
  vm.runInContext(checkout.slice(checkout.indexOf('  addToCart=function'),checkout.indexOf('  renderCart=function')),context);
  return {context,element};
}

test('Every purchasable product and headrest configuration adds once and immediately opens the cart', () => {
  const {context,element} = harness();
  let tested=0;
  for (const product of products.filter(p=>!p.contactOnly)) {
    context.cart={};context.selectedOptions={};
    context.addToCart(product.id);
    assert.equal(context.cart[product.id],1,product.id);
    assert.equal(element('#cartDrawer').attributes['aria-hidden'],'false',product.id);
    assert.ok(element('#cartDrawer').classList.contains('open'),product.id);
    assert.equal(element('#overlay').hidden,false,product.id);
    assert.equal(context.total(),catalog[product.id].price,product.id);
    context.closeCart();
    tested++;
  }
  assert.equal(tested,50);
});

test('Contact-only products and invalid IDs never become zero-price orders', () => {
  const {context,element}=harness();
  for (const product of products.filter(p=>p.contactOnly))context.addToCart(product.id);
  context.addToCart('not-a-product');
  assert.deepEqual(context.cart,{});
  assert.equal(element('#cartDrawer').classList.contains('open'),false);
});

test('SLS 1050, SLS 670 and accessory + controls can show cart and checkout over an open product page', () => {
  for (const id of ['sls1050','sls470','sls470bench','m2pro','freedom','cabletray','cableriser']) {
    const {context,element}=harness();
    element('#productDetail').classList.add('open');
    context.addToCart(id);
    assert.ok(element('#cartDrawer').classList.contains('open'));
    context.openCheckout();
    assert.equal(element('#cartDrawer').classList.contains('open'),false);
    assert.ok(element('#checkout').classList.contains('open'));
    assert.equal(element('#checkout').attributes['aria-hidden'],'false');
    assert.match(element('#checkoutItems').innerHTML,new RegExp(catalog[id].price));
    context.closeCheckout();
    assert.ok(element('#productDetail').classList.contains('open'));
    assert.equal(context.document.body.style.overflow,'hidden');
    context.openCart();context.closeCart();
    assert.equal(context.document.body.style.overflow,'hidden');
    element('#productDetail').classList.remove('open');
    context.openCart();context.closeCart();
    assert.equal(context.document.body.style.overflow,'');
  }
});

test('A conflicting configuration opens the existing cart with an explanation without changing the order', () => {
  const {context,element}=harness();
  context.cart.sls1050=1;
  context.selectedOptions.sls1050='Existing chosen finishes';
  context.window.slsDefaultOrderOptions={sls1050:'Default finishes'};
  context.addToCart('sls1050');
  assert.equal(context.cart.sls1050,1);
  assert.equal(context.selectedOptions.sls1050,'Existing chosen finishes');
  assert.ok(element('#cartDrawer').classList.contains('open'));
  assert.match(context.toast,/different configuration/);
});

test('Cart, checkout and feedback are layered above product details in the shipped stylesheet', () => {
  const css=read('dist/styles.css')+'\n'+read('dist/collection.css');
  const layer=selector=>[...css.matchAll(new RegExp('\\'+selector+'\\{[^}]*z-index:(\\d+)','g'))].at(-1)?.[1]*1;
  assert.ok(layer('.product-detail')<layer('.overlay'));
  assert.ok(layer('.overlay')<layer('.drawer'));
  assert.ok(layer('.drawer')<layer('.checkout'));
  assert.ok(layer('.checkout')<layer('.toast'));
  const html=read('dist/index.html');
  assert.ok(html.indexOf('href="styles.css"')<html.indexOf('href="collection.css"'));
});

test('Escape closes only the topmost purchase panel before returning to the product', () => {
  const {context,element}=harness();
  context.closeProductDetail=()=>element('#productDetail').classList.remove('open');
  vm.runInContext(app.split('\n').find(line=>line.startsWith("document.addEventListener('keydown'")),context);
  element('#productDetail').classList.add('open');
  context.addToCart('sls1050');
  context.keydown({key:'Escape'});
  assert.equal(element('#cartDrawer').classList.contains('open'),false);
  assert.ok(element('#productDetail').classList.contains('open'));
  context.openCheckout();context.keydown({key:'Escape'});
  assert.equal(element('#checkout').classList.contains('open'),false);
  assert.ok(element('#productDetail').classList.contains('open'));
  context.keydown({key:'Escape'});
  assert.equal(element('#productDetail').classList.contains('open'),false);
});

test('Every purchasable configuration passes server order validation at its displayed VAT-inclusive price', () => {
  for (const product of products.filter(p=>!p.contactOnly)) {
    const input={requestId:'12345678-1234-4234-8234-123456789abc',customer:{name:'TEST ONLY',email:'test@example.com',phone:'0909000000',address:'TEST ONLY'},items:[{id:product.id,quantity:1}],paymentMethod:'bank',expectedSubtotal:product.price};
    const order=normalize(input,catalog);
    assert.equal(order.subtotal,product.price,product.id);
    assert.equal(order.items[0].id,product.id);
  }
});
