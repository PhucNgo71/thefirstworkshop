(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const state = {orders: [], cursor: null, hasMore: false, loading: false, unreadable: 0};
  const money = value => new Intl.NumberFormat('vi-VN').format(Number(value) || 0) + ' ₫';
  const date = value => {const d = new Date(value); return Number.isNaN(d.valueOf()) ? '—' : d.toLocaleString('vi-VN', {timeZone:'Asia/Ho_Chi_Minh'});};
  const emailLabels = {Accepted:'Dịch vụ gửi đã tiếp nhận',NeedsReview:'Cần kiểm tra',Sending:'Chưa xác định kết quả',Pending:'Chờ gửi'};
  function node(tag, text, className) {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  function locked(message) {
    state.orders=[];state.cursor=null;state.hasMore=false;
    $('rows').replaceChildren();$('detailContent').replaceChildren();$('detail').close();
    $('dashboard').hidden=true;$('login').hidden=false;$('logout').hidden=true;$('accountName').textContent='';$('loginMessage').textContent=message;
  }
  async function api(query='') {
    const response=await fetch('/api/admin-orders'+query,{credentials:'same-origin',cache:'no-store'});
    if(response.status===401){locked('Vui lòng đăng nhập để xem đơn hàng.');throw Error('Phiên đăng nhập đã hết hạn.');}
    if(!response.ok)throw Error('Không tải được đơn hàng. Vui lòng thử lại.');
    return response.json();
  }
  function filtered() {
    const q=$('search').value.trim().toLocaleLowerCase('vi'), kind=$('testFilter').value, mail=$('emailFilter').value;
    return state.orders.filter(o=>(!q||[o.orderNumber,o.customerName,o.email,o.phone].some(v=>String(v||'').toLocaleLowerCase('vi').includes(q)))&&(kind==='all'||o.isTest===(kind==='test'))&&(mail==='all'||(mail==='review'?o.emailStatus!=='Accepted':o.emailStatus===mail))).sort((a,b)=>String(b.orderDate).localeCompare(String(a.orderDate)));
  }
  function render() {
    const items=filtered();$('total').textContent=state.orders.length;$('needsReview').textContent=state.orders.filter(o=>o.emailStatus!=='Accepted').length;
    $('value').textContent=new Intl.NumberFormat('vi-VN').format(state.orders.filter(o=>!o.isTest).reduce((n,o)=>n+o.subtotal,0));
    $('rows').replaceChildren();
    for(const o of items){
      const tr=node('tr'), order=node('td'), customer=node('td');
      order.append(node('strong',o.orderNumber,'order-code'),node('small',date(o.orderDate)));
      if(o.isTest)order.append(node('span','ĐƠN KIỂM TRA','badge test'));
      customer.append(node('strong',o.customerName),node('small',o.email),node('small',o.phone));
      const amount=node('td',money(o.subtotal));amount.append(node('small',`${o.totalQuantity} sản phẩm`));
      const mail=node('td');mail.append(node('span',emailLabels[o.emailStatus]||'Chưa xác định','badge'+(o.emailStatus==='Accepted'?'':' warning')));
      const payment=node('td',o.paymentStatus==='Unpaid'?'Chưa thanh toán':o.paymentStatus||'Chưa xác nhận');
      const action=node('td'), button=node('button','Xem đơn');button.addEventListener('click',()=>detail(o.id));action.append(button);
      tr.append(order,customer,amount,mail,payment,action);$('rows').append(tr);
    }
    if(!items.length){const tr=node('tr'),td=node('td',state.orders.length?'Không có đơn phù hợp bộ lọc.':'Chưa có đơn trong dữ liệu đã tải.','empty');td.colSpan=6;tr.append(td);$('rows').append(tr);}
    $('count').textContent=`Hiển thị ${items.length} / ${state.orders.length} đơn đã tải${state.hasMore?' · Còn dữ liệu chưa tải':''}`;
    $('loadMore').hidden=!state.hasMore;$('loadMore').disabled=state.loading;$('refresh').disabled=state.loading;$('export').disabled=!items.length||state.loading;
  }
  async function load(reset=false) {
    if(state.loading)return;state.loading=true;render();$('status').textContent='Đang tải đơn hàng…';
    try {
      const result=await api(reset?'':state.cursor?'?cursor='+encodeURIComponent(state.cursor):'');
      if(reset){state.orders=[];state.unreadable=0;}
      const map=new Map(state.orders.map(o=>[o.id,o]));result.orders.forEach(o=>map.set(o.id,o));state.orders=[...map.values()];
      state.cursor=result.cursor;state.hasMore=result.hasMore;state.unreadable+=result.unreadableCount||0;
      $('status').textContent=state.unreadable?`${state.unreadable} bản ghi không đọc được. Danh sách có thể chưa đầy đủ; vui lòng liên hệ quản trị kỹ thuật.`:'';
      $('updated').textContent='Cập nhật '+date(new Date())+' · Giờ Việt Nam';
    }catch(error){$('status').textContent=error.message;}finally{state.loading=false;render();}
  }
  async function detail(id) {
    $('detailContent').replaceChildren(node('p','Đang tải chi tiết…'));$('detail').showModal();
    try {
      const data=await api('?id='+encodeURIComponent(id)),o=data.order,c=o.customer;
      const content=$('detailContent');content.replaceChildren(node('h2',o.orderNumber),node('p',date(o.orderDate),'muted'));
      const grid=node('div',undefined,'customer-grid');
      for(const [label,value] of [['Khách hàng',c.name],['Email',c.email],['Điện thoại',c.phone],['Công ty',c.company],['Mã số thuế',c.taxCode],['Địa chỉ giao hàng',c.address]]){const item=node('div');item.append(node('span',label),node('strong',value||'—'));grid.append(item);}
      content.append(grid,node('h3','Sản phẩm'));
      const wrap=node('div',undefined,'table-wrap'),table=node('table'),thead=node('thead'),head=node('tr');['Sản phẩm / Cấu hình','SL','Đơn giá','Thành tiền'].forEach(s=>head.append(node('th',s)));thead.append(head);table.append(thead);
      const tbody=node('tbody');for(const i of o.items){const row=node('tr'),name=node('td',i.name);name.append(node('small',i.options||''));row.append(name,node('td',i.quantity),node('td',money(i.unitPrice)),node('td',money(i.lineTotal)));tbody.append(row);}table.append(tbody);wrap.append(table);content.append(wrap);
      const totals=node('div',undefined,'totals');totals.append(node('strong','Giá trị sản phẩm: '+money(o.subtotal)),node('div','Phí giao hàng: '+(o.deliveryFee===null?'Chờ xác nhận':money(o.deliveryFee))),node('div','Thanh toán: '+(o.paymentStatus==='Unpaid'?'Chưa thanh toán':o.paymentStatus||'Chưa xác nhận')),node('div','Hình thức: '+(o.paymentMethod==='bank'?'Chuyển khoản':'Thanh toán khi giao hàng')));
      if(o.vatIncluded!==undefined)totals.append(node('div','VAT đã bao gồm: '+money(o.vatIncluded)));
      content.append(totals,node('h3','Ghi chú khách hàng'),node('p',c.notes||'Không có ghi chú.','notes'),node('h3','Trạng thái'),node('p','Đơn hàng: '+(o.orderStatus==='Received'?'Đã tiếp nhận':o.orderStatus||'Chưa xác nhận')),node('p','Email: '+(emailLabels[data.emailStatus]||'Chưa xác định')),node('p','Trạng thái email không xác nhận giao hàng, thanh toán hoặc đã ghi vào Excel.','notice'));
    }catch(error){$('detailContent').replaceChildren(node('p',error.message));}
  }
  async function authAction(action) {
    const response=await fetch('/api/auth/csrf',{cache:'no-store',credentials:'same-origin'});
    if(!response.ok)throw Error('Đăng nhập chưa sẵn sàng. Vui lòng liên hệ quản trị website.');
    const {csrfToken}=await response.json();if(!csrfToken)throw Error('Không tạo được phiên đăng nhập.');
    const form=node('form');form.method='POST';form.action='/api/auth/'+action;
    for(const [name,value] of Object.entries({csrfToken,callbackUrl:location.origin+'/admin'})){const input=node('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
    document.body.append(form);form.submit();
  }
  $('signin').addEventListener('click',async()=>{try{$('signin').disabled=true;await authAction('signin/github');}catch(e){$('loginMessage').textContent=e.message;$('signin').disabled=false;}});
  $('logout').addEventListener('click',async()=>{try{await authAction('signout');locked('Đang đăng xuất…');}catch(e){$('status').textContent=e.message;}});
  $('refresh').addEventListener('click',()=>load(true));$('loadMore').addEventListener('click',()=>load());
  ['search','emailFilter','testFilter'].forEach(id=>$(id).addEventListener('input',render));
  $('closeDetail').addEventListener('click',()=>{$('detail').close();$('detailContent').replaceChildren();});
  $('export').addEventListener('click',()=>{const rows=filtered();if(!rows.length)return;const url=URL.createObjectURL(new Blob([window.orderCSV(rows)],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=url;a.download='TFW-orders-'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  // Do not retain order data in localStorage/sessionStorage or the browser back/forward cache.
  window.addEventListener('pagehide',()=>locked('Vui lòng đăng nhập để xem đơn hàng.'));
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  (async()=>{if(new URLSearchParams(location.search).has('error'))$('loginMessage').textContent='Đăng nhập chưa thành công hoặc tài khoản không được cấp quyền.';try{const {user}=await api('?session=1');$('login').hidden=true;$('dashboard').hidden=false;$('logout').hidden=false;$('accountName').textContent=user.name;await load(true);}catch{}})();
})();
