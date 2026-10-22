const {createHash} = require('node:crypto');
const ORDER_COPY_EMAIL = 'phuc.ngo@tfw.space';
class OrderError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function text(value, max, required = true) {
  if (value == null && !required) return '';
  if (typeof value !== 'string' || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) throw new OrderError('INVALID_DETAILS');
  value = value.trim();
  if (required && !value) throw new OrderError('INVALID_DETAILS');
  return value;
}
function normalize(input, catalog) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new OrderError('INVALID_ORDER');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) throw new OrderError('INVALID_REQUEST_ID');
  if (input.website) throw new OrderError('INVALID_ORDER');
  const customer = input.customer || {};
  const details = {
    name: text(customer.name, 120), email: text(customer.email, 254).toLowerCase(),
    phone: text(customer.phone, 40), address: text(customer.address, 600),
    company: text(customer.company, 160, false), taxCode: text(customer.taxCode, 40, false),
    notes: text(customer.notes, 1500, false)
  };
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(details.email) || !/^[+\d ()-]{7,40}$/.test(details.phone)) throw new OrderError('INVALID_DETAILS');
  if (!['bank', 'cod'].includes(input.paymentMethod)) throw new OrderError('INVALID_PAYMENT_METHOD');
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 50) throw new OrderError('INVALID_ITEMS');
  const seen = new Set();
  const items = input.items.map(item => {
    const product = Object.hasOwn(catalog, item.id) && catalog[item.id];
    if (!product || !product.price || seen.has(item.id) || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 100) throw new OrderError('INVALID_ITEMS');
    seen.add(item.id);
    const tax = product.vatRate === 10 ? {vatRate:10, netUnitPrice:product.basePrice, vatUnitAmount:product.vatAmount, netLineTotal:product.basePrice * item.quantity, vatLineTotal:product.vatAmount * item.quantity} : {};
    if (product.vatRate === 10 && (!Number.isSafeInteger(product.basePrice) || product.basePrice < 0 || product.vatAmount !== Math.round(product.basePrice / 10) || product.price !== product.basePrice + product.vatAmount)) throw new OrderError('INVALID_CATALOG', 503);
    const requestedOptions = text(item.options, 1000, false);
    // Priced configurations are fixed by the server SKU, never by free-form client text.
    const options = product.canonicalOptions || requestedOptions;
    return {id: item.id, name: product.name, quantity: item.quantity, unitPrice: product.price, lineTotal: product.price * item.quantity, ...tax, options};
  }).sort((a,b) => a.id.localeCompare(b.id));
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  if (!Number.isSafeInteger(subtotal) || subtotal > 10000000000) throw new OrderError('ORDER_TOO_LARGE');
  if (input.expectedSubtotal !== subtotal) throw new OrderError('PRICE_CHANGED', 409);
  const tax = items.every(item=>item.vatRate===10) ? {vatRate:10, netSubtotal:items.reduce((sum,item)=>sum+item.netLineTotal,0), vatIncluded:items.reduce((sum,item)=>sum+item.vatLineTotal,0)} : {};
  return {requestId: input.requestId.toLowerCase(), customer: details, items, subtotal, ...tax, currency: 'VND', paymentMethod: input.paymentMethod};
}
function makeOrder(normalized, now = new Date()) {
  return {...normalized, orderNumber: 'TFW-' + normalized.requestId.replaceAll('-', '').toUpperCase(), orderDate: now.toISOString(), paymentStatus: 'Unpaid', orderStatus: 'Received', deliveryFee: null, discount: 0};
}
function excelRow(order) {
  // Prefix formula-like strings before a connector writes them into Excel.
  const cell = value => /^[=+@\-\t\r\n]/.test(String(value)) ? "'" + value : value;
  // Preserve the existing 24-column Excel contract. Totals and unit prices are
  // gross; VAT details travel in OrderItems and Notes, never as a second charge.
  const notes = order.vatRate===10 ? [order.customer.notes, `Prices include 10% VAT. Net products: ${order.netSubtotal} VND; VAT included: ${order.vatIncluded} VND; gross products: ${order.subtotal} VND. Delivery to be confirmed.`].filter(Boolean).join('\n') : order.customer.notes;
  return {
    OrderNumber: order.orderNumber, OrderDate: order.orderDate, CustomerName: cell(order.customer.name),
    Email: cell(order.customer.email), Phone: cell(order.customer.phone), Company: cell(order.customer.company),
    TaxCode: cell(order.customer.taxCode), DeliveryAddress: cell(order.customer.address), City: '', District: '', Ward: '',
    OrderItems: JSON.stringify(order.items), TotalQuantity: order.items.reduce((sum,i) => sum+i.quantity,0),
    SubtotalVND: order.subtotal, DiscountVND: 0, DeliveryFeeVND: 'To be confirmed', TotalVND: order.subtotal,
    PaymentMethod: order.paymentMethod, PaymentStatus: 'Unpaid', OrderStatus: 'Received - delivery to be confirmed',
    Notes: cell(notes), Source: 'tfw.space', RequestId: order.requestId, EmailStatus: 'Pending'
  };
}
function mail(order) {
  const money = amount => new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  const testLabel = order.customer.name.startsWith('TEST ') ? 'TEST — DO NOT FULFIL — ' : '';
  const content = `<h1>thefirstworkshop — Order request / Đơn đặt hàng</h1><p>${escape(order.orderNumber)}</p><p>Thank you, ${escape(order.customer.name)}.</p><p>${escape(order.customer.address)}</p><table><tr><th>Product</th><th>Quantity</th><th>Unit price</th><th>Subtotal</th></tr>${order.items.map(i=>`<tr><td>${escape(i.name)}<br>${escape(i.options)}</td><td>${i.quantity}</td><td>${money(i.unitPrice)}</td><td>${money(i.lineTotal)}</td></tr>`).join('')}</table><p>Product subtotal: ${money(order.subtotal)}</p><p>Payment: ${escape(order.paymentMethod)} — UNPAID / CHƯA THANH TOÁN.</p><p>Delivery charges, availability and final configuration require confirmation. This is an order acknowledgement, not a payment receipt or tax invoice. Please wait for our team before transferring payment.</p><p>Phí giao hàng và cấu hình sẽ được xác nhận. Vui lòng chờ đội ngũ của chúng tôi xác nhận trước khi thanh toán.</p><p>Contact: hi@tfw.space</p>`;
  const customerDetails = `<h2>Customer details / Thông tin khách hàng</h2><p>Email: ${escape(order.customer.email)}<br>Phone: ${escape(order.customer.phone)}<br>Company: ${escape(order.customer.company)}<br>Tax code: ${escape(order.customer.taxCode)}</p><p>Notes: ${escape(order.customer.notes)}</p>`;
  const vatSummary = order.vatRate===10 ? `<p><strong>Prices include 10% VAT / Giá đã bao gồm 10% VAT.</strong></p><p>Net products / Trước VAT: ${money(order.netSubtotal)}<br>VAT included / VAT đã gồm: ${money(order.vatIncluded)}<br>Products including VAT / Sản phẩm gồm VAT: ${money(order.subtotal)}</p>` : '';
  const completeContent = (testLabel ? '<p><strong>TEST ONLY — DO NOT FULFIL / ĐƠN KIỂM TRA — KHÔNG GIAO HÀNG</strong></p>' : '') + vatSummary + content + customerDetails;
  return {message: {subject: `TFW Order / PO request — ${testLabel}${order.orderNumber}`, body: {contentType: 'HTML', content:completeContent},
    toRecipients: [{emailAddress: {address: order.customer.email}}],
    ccRecipients: [{emailAddress: {address: ORDER_COPY_EMAIL}}],
    attachments: [
      {'@odata.type':'#microsoft.graph.fileAttachment', name: `${order.orderNumber}.html`, contentType:'text/html', contentBytes:Buffer.from('<!doctype html><meta charset="utf-8">'+completeContent).toString('base64')},
      // A fixed, versioned attachment lets the email-to-Excel flow read exact
      // fields without guessing from customer-facing HTML or prose.
      {'@odata.type':'#microsoft.graph.fileAttachment', name:'tfw-order.json', contentType:'application/json', contentBytes:Buffer.from(JSON.stringify({schemaVersion:1, source:'tfw.space', row:{...excelRow(order), EmailStatus:'Order copy received'}})).toString('base64')}
    ]
  }, saveToSentItems: true};
}
async function submit(input, {catalog, store, sendMail}) {
  const normalized = normalize(input, catalog);
  const fingerprint = hash(normalized);
  const fresh = makeOrder(normalized);
  const record = await store.createOrGet(fresh, fingerprint, excelRow(fresh));
  if (record.fingerprint !== fingerprint) throw new OrderError('REQUEST_CONFLICT', 409);
  // Only the winner of an atomic storage lease may send. Ambiguous sends are
  // retained for manual reconciliation, never automatically sent twice.
  if (record.emailStatus === 'Pending' && await store.claimEmail(record)) {
    try {
      const sent = await sendMail(mail(record.order));
      await store.emailResult(record, 'Accepted', sent?.providerId);
      record.emailStatus = 'Accepted';
    } catch {
      await store.emailResult(record, 'NeedsReview').catch(() => {});
      record.emailStatus = 'NeedsReview';
    }
  }
  return {orderNumber: record.order.orderNumber, status: 'received', emailStatus: record.emailStatus, excelStatus: record.excelStatus || 'Pending'};
}
module.exports = {ORDER_COPY_EMAIL, OrderError, normalize, makeOrder, excelRow, mail, submit};
