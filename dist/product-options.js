// Priced configurations share one definition between the browser and catalog build.
// Each configuration has a distinct order SKU; the headrest is not a standalone item.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./pricing.js'));
  else root.tfwProductOptions = factory(root.tfwPricing);
})(typeof window === 'object' ? window : this, function(pricing) {
  const choices = Object.freeze({anchor: Object.freeze([
    Object.freeze({id:'anchor', label:'Không tựa đầu', surcharge:0, canonicalOptions:'Tựa đầu / Headrest: Không / Not included'}),
    Object.freeze({id:'anchor-headrest', label:'Có tựa đầu', surcharge:550000, canonicalOptions:'Tựa đầu / Headrest: Có / Included'})
  ]), worldone: Object.freeze([
    Object.freeze({id:'worldone', label:'Không tựa đầu', surcharge:0, canonicalOptions:'Tựa đầu / Headrest: Không / Not included'}),
    // Whole-VND net amount rounds to exactly 2,000,000 VND including 10% VAT.
    Object.freeze({id:'worldone-headrest', label:'Có tựa đầu', surcharge:1818182, canonicalOptions:'Tựa đầu / Headrest: Có / Included'})
  ])});
  function variantsFor(product) {
    return (choices[product.id] || []).map(choice => ({
      ...product, ...pricing.productPrice(product.basePrice + choice.surcharge),
      id:choice.id, parentId:product.id, configurationLabel:choice.label,
      name:choice.surcharge ? `${product.name} — With headrest` : product.name,
      surcharge:choice.surcharge, canonicalOptions:choice.canonicalOptions
    }));
  }
  function cartProducts(products) {
    return products.flatMap(product => {
      const variants = variantsFor(product);
      return variants.length ? variants : [product];
    });
  }
  return Object.freeze({variantsFor, cartProducts});
});
