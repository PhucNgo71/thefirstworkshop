// The server owns prices, order numbers and acceptance. Never collect card data.
(() => {
  const form = document.getElementById('paymentForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const error = document.createElement('p');
  error.id = 'orderError'; error.setAttribute('role','alert'); error.hidden=true;
  form.append(error);
  const extra = document.createElement('div');
  extra.innerHTML='<label>Company / Công ty<input name="company" maxlength="160"></label><label>Tax code / Mã số thuế<input name="taxCode" maxlength="40"></label><label>Notes / Ghi chú<textarea name="notes" maxlength="1500"></textarea></label><label style="display:none" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>';
  form.insertBefore(extra,submitButton);
  let busy=false, pending=null;
  try { pending=JSON.parse(sessionStorage.getItem('tfw-pending-order')||'null'); } catch {}
  const en=()=>document.documentElement.lang==='en';
  const notify=(vi,english)=>{error.hidden=false;error.textContent=en()?english:vi;};
  let selectedOptions={};
  try {const stored=JSON.parse(localStorage.getItem('tfw-cart-options')||'{}');if(stored&&typeof stored==='object'&&!Array.isArray(stored))selectedOptions=Object.fromEntries(Object.entries(stored).filter(([id,value])=>products.some(p=>p.id===id)&&typeof value==='string'&&value.length<=1000));} catch {}
  const originalAddToCart=addToCart, originalRenderCart=renderCart;
  addToCart=function(id){
    const product=products.find(p=>p.id===id);if(!product||product.contactOnly)return;
    const chosen=activeProductId===id?[...document.querySelectorAll('#productOptions .config-group')].map(group=>`${group.querySelector('.config-heading span').textContent}: ${group.querySelector('[data-option-selection]').textContent}`).join('; '):(window.slsDefaultOrderOptions?.[id]||'');
    if(chosen&&cart[id]&&selectedOptions[id]&&selectedOptions[id]!==chosen){showToast(en()?'Remove this product from the cart before choosing a different configuration.':'Vui lòng xóa sản phẩm khỏi giỏ trước khi chọn cấu hình khác.');return;}
    if(chosen)selectedOptions[id]=chosen;
    originalAddToCart(id);
  };
  renderCart=function(){
    for(const id of Object.keys(selectedOptions))if(!cart[id])delete selectedOptions[id];
    try{localStorage.setItem('tfw-cart-options',JSON.stringify(selectedOptions));}catch{}
    originalRenderCart();
    for(const line of document.querySelectorAll('#cartItems .cart-line')){
      const id=line.querySelector('[data-minus]')?.dataset.minus;
      if(selectedOptions[id]){const details=document.createElement('p');details.textContent=selectedOptions[id];line.firstElementChild.append(details);}
    }
  };
  renderCart();
  function safePaymentUI() {
    form.querySelector('input[value="card"]')?.closest('label')?.remove();
    const cards=document.getElementById('cardFields');
    cards.replaceChildren(); cards.hidden=true;
    if(!form.querySelector('input[name="payment"]:checked')) form.querySelector('input[value="bank"]').checked=true;
    document.getElementById('bankDetails').hidden=form.elements.payment.value!=='bank';
    const note=form.querySelector('.demo-note');
    if(note) note.textContent=en()?'No online payment is collected. Delivery and final configuration will be confirmed by our team.':'Không thu tiền trực tuyến. Đội ngũ của chúng tôi sẽ xác nhận phí giao hàng và cấu hình cuối cùng.';
  }
  safePaymentUI();
  document.addEventListener('tfw:languagechange',safePaymentUI);
  form.onchange=event=>{if(event.target.name==='payment')safePaymentUI();};
  form.onsubmit=async event=>{
    event.preventDefault(); if(busy || !form.reportValidity()) return;
    error.hidden=true;
    const items=cartData().map(p=>({id:p.id,quantity:p.qty,options:selectedOptions[p.id]||window.slsDefaultOrderOptions?.[p.id]||'Standard configuration — final details to be confirmed'}));
    if(!items.length) return;
    const payload={customer:Object.fromEntries(['name','phone','email','address','company','taxCode','notes'].map(key=>[key,form.elements[key].value.trim()])),items,paymentMethod:form.elements.payment.value,expectedSubtotal:total(),website:form.elements.website.value};
    const signature=JSON.stringify(payload);
    // Preserve the same id across a timeout or reload. Changed customer/cart data
    // gets a new id, except ambiguous outcomes require reconciliation first.
    if(pending && pending.signature!==signature) {
      notify('Đơn trước chưa xác định kết quả. Vui lòng liên hệ hi@tfw.space trước khi thay đổi và gửi lại.','Your previous submission is unresolved. Contact hi@tfw.space before changing and submitting it again.');return;
    }
    if(!pending) {
      pending={signature,requestId:crypto.randomUUID()};
      try{sessionStorage.setItem('tfw-pending-order',JSON.stringify(pending));}catch{notify('Trình duyệt cần cho phép lưu phiên để đặt hàng.','Please enable browser session storage to submit an order.');pending=null;return;}
    }
    busy=true;submitButton.disabled=true;form.setAttribute('aria-busy','true');
    try {
      const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,requestId:pending.requestId}),signal:AbortSignal.timeout(45000)});
      const result=await response.json();
      if(!response.ok) {
        if([400,403,409,413,415].includes(response.status) && result.error!=='REQUEST_CONFLICT'){pending=null;sessionStorage.removeItem('tfw-pending-order');}
        throw new Error(result.error||'SERVICE_UNAVAILABLE');
      }
      if(result.status!=='received' || !/^TFW-[A-F0-9]{32}$/.test(result.orderNumber)) throw new Error('INVALID_RESPONSE');
      document.getElementById('orderNumber').textContent=result.orderNumber;
      const status=document.createElement('p');
      status.textContent=en()?'Your request has been saved. Email and Excel processing may still be pending. No payment has been collected.':'Yêu cầu đã được lưu. Email và cập nhật Excel có thể đang được xử lý. Chưa thu tiền thanh toán.';
      document.querySelector('#successState [data-order-status]')?.remove();status.dataset.orderStatus='true';document.getElementById('successState').append(status);
      form.hidden=true;document.getElementById('successState').hidden=false;
      // Remove only the quantities actually submitted; retain later cart additions.
      for(const item of items){cart[item.id]=Math.max(0,(cart[item.id]||0)-item.quantity);if(!cart[item.id])delete cart[item.id];}saveCart();
      pending=null;sessionStorage.removeItem('tfw-pending-order');
    } catch(err) {
      const notReady=['CHECKOUT_NOT_READY','CHECKOUT_TEST_ONLY','ABUSE_PROTECTION_NOT_CONFIGURED','ORDER_STORAGE_NOT_CONFIGURED'].includes(err.message);
      if(notReady){pending=null;sessionStorage.removeItem('tfw-pending-order');}
      notify(notReady?'Đặt hàng trực tuyến chưa sẵn sàng. Vui lòng liên hệ hi@tfw.space. Giỏ hàng được giữ nguyên.':'Chưa xác nhận được kết quả. Giỏ hàng được giữ nguyên. Thử lại với cùng thông tin hoặc liên hệ hi@tfw.space.',notReady?'Online ordering is not ready. Contact hi@tfw.space. Your cart is unchanged.':'We could not confirm the result. Your cart is unchanged. Retry with the same details or contact hi@tfw.space.');
    } finally {busy=false;submitButton.disabled=false;form.removeAttribute('aria-busy');}
  };
  document.getElementById('continueShopping').onclick=()=>{closeCheckout();form.reset();safePaymentUI();form.hidden=false;document.getElementById('successState').hidden=true;error.hidden=true;location.hash='shop';};
})();
