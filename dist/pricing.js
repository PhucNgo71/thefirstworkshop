// Catalog entries contain net/base VND prices. Apply the approved 10% VAT once,
// using this same calculation for the browser and generated server catalog.
(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.tfwPricing = factory();
})(typeof window === 'object' ? window : this, function() {
  function productPrice(basePrice) {
    if (!Number.isSafeInteger(basePrice) || basePrice < 0) throw new Error('Invalid base price');
    const vatAmount = Math.round(basePrice / 10);
    const price = basePrice + vatAmount;
    if (!Number.isSafeInteger(price)) throw new Error('Invalid VAT-inclusive price');
    return {basePrice, price, vatRate: basePrice ? 10 : 0, vatAmount};
  }
  return Object.freeze({productPrice});
});
