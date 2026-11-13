(function(root) {
  function csv(records) {
    const columns = ['OrderNumber','OrderDate','CustomerName','Email','Phone','Quantity','ProductSubtotalVND','OrderStatus','PaymentStatus','EmailStatus'];
    const safe = value => '"' + String(value ?? '').replace(/^[\s\uFEFF]*[=+@-]/, match => "'" + match).replaceAll('"', '""') + '"';
    return '\uFEFF' + [columns,...records.map(o=>[o.orderNumber,o.orderDate,o.customerName,o.email,o.phone,o.totalQuantity,o.subtotal,o.orderStatus,o.paymentStatus,o.emailStatus])].map(row=>row.map(safe).join(',')).join('\r\n');
  }
  if (typeof module === 'object') module.exports = {csv};
  else root.orderCSV = csv;
})(typeof window === 'undefined' ? {} : window);
