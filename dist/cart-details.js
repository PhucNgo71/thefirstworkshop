// No promotion is active until the store supplies approved codes and rules.
// Payment and discount validation must be confirmed server-side before charging.
(() => {
  const delivery = document.getElementById('cartDelivery');
  const checkout = document.getElementById('paymentForm');
  const message = document.getElementById('discountMessage');
  const code = document.getElementById('discountCode');
  let discountState = '';
  function renderMessage() {
    const en = document.documentElement.lang === 'en';
    message.textContent = discountState === 'empty'
      ? (en ? 'Enter a discount code.' : 'Vui lòng nhập mã giảm giá.')
      : discountState === 'invalid'
        ? (en ? 'This code is not active. Your total has not changed.' : 'Mã chưa được kích hoạt. Tổng tiền không thay đổi.') : '';
    code.setAttribute('aria-invalid', String(Boolean(discountState)));
  }
  function applyCode() {
    code.value = code.value.trim().toUpperCase();
    discountState = code.value ? 'invalid' : 'empty';
    renderMessage();
  }
  document.getElementById('applyDiscount').onclick = applyCode;
  code.addEventListener('input', () => { discountState = ''; renderMessage(); });
  code.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); applyCode(); } });
  delivery.addEventListener('submit', event => event.preventDefault());
  for (const name of ['name', 'phone', 'address']) {
    delivery.elements[name].addEventListener('input', () => { checkout.elements[name].value = delivery.elements[name].value; });
    checkout.elements[name].addEventListener('input', () => { delivery.elements[name].value = checkout.elements[name].value; });
  }
  document.getElementById('checkoutButton').onclick = () => {
    if (!delivery.reportValidity()) return;
    for (const name of ['name', 'phone', 'address']) checkout.elements[name].value = delivery.elements[name].value;
    openCheckout();
  };
  document.addEventListener('tfw:languagechange', renderMessage);
})();
