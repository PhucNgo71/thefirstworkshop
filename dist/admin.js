(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const state = {orders: [], cursor: null, hasMore: false, loading: false, unreadable: 0};
  const money = value => new Intl.NumberFormat('vi-VN').format(Number(value) || 0) + ' ₫';
  const date = value => {const d = new Date(value); return Number.isNaN(d.valueOf()) ? '—' : d.toLocaleString('vi-VN', {timeZone:'Asia/Ho_Chi_Minh'});};
  const emailLabels = {Accepted:'Dịch vụ gửi đã tiếp nhận',NeedsReview:'Cần kiểm tra',Sending:'Chưa xác định kết quả',Pending:'Chờ gửi'};
  const orderLabels = {Received:'Đã tiếp nhận',Processing:'Đang xử lý',Delivering:'Đang giao hàng',Completed:'Hoàn tất',Cancelled:'Đã hủy'};
  const paymentLabels = {Unpaid:'Chưa thanh toán',Paid:'Đã thanh toán'};
  function node(tag, text, className) {const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;}
  function locked(message) {
    state.orders=[];state.cursor=null;state.hasMore=false;
    $('rows').replaceChildren();$('detailContent').replaceChildren();$('detail').close();$('reportWeek').replaceChildren();$('reportMessage').textContent='';
    $('dashboard').hidden=true;$('login').hidden=false;$('logout').hidden=true;$('accountName').textContent='';$('loginMessage').textContent=message;
  }
  async function api(query='', options={}) {
    const response=await fetch('/api/admin-orders'+query,{credentials:'same-origin',cache:'no-store',...options});
    if(response.status===401){locked('Vui lòng đăng nhập để xem đơn hàng.');throw Error('Phiên đăng nhập đã hết hạn.');}
    if(!response.ok){const data=await response.json().catch(()=>({}));const messages={STATUS_CONFLICT:'Đơn đã được cập nhật ở nơi khác. Đóng và mở lại đơn để xem trạng thái mới.',STATUS_SAVE_UNCERTAIN:'Chưa xác nhận lưu thành công. Vui lòng thử lại hoặc mở lại đơn để kiểm tra.',STATUS_HISTORY_LIMIT:'Đơn đã đạt giới hạn lịch sử cập nhật. Vui lòng liên hệ quản trị kỹ thuật.'};throw Error(messages[data.error]||(options.method?'Chưa lưu được trạng thái. Vui lòng thử lại.':'Không tải được đơn hàng. Vui lòng thử lại.'));}
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
      const payment=node('td');payment.append(node('span',paymentLabels[o.paymentStatus]||o.paymentStatus||'Chưa xác nhận','badge'+(o.paymentStatus==='Paid'?' paid':'')),node('small',orderLabels[o.orderStatus]||o.orderStatus));
      const action=node('td'), button=node('button','Xem / cập nhật');button.addEventListener('click',()=>detail(o.id));action.append(button);
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
    try {const data=await api('?id='+encodeURIComponent(id));if($('detail').open)renderDetail(data);}
    catch(error){$('detailContent').replaceChildren(node('p',error.message));}
  }
  function renderDetail(data, saved=false) {
      const o=data.order,c=o.customer;
      const content=$('detailContent');content.replaceChildren(node('h2',o.orderNumber),node('p',date(o.orderDate),'muted'));
      const form=node('form',undefined,'status-editor'),controls=node('div',undefined,'status-controls');
      function selectStatus(label,id,labels,value){const labelNode=node('label',label),select=node('select');select.id=id;for(const [key,text]of Object.entries(labels)){const option=node('option',text);option.value=key;select.append(option);}select.value=value;labelNode.append(select);controls.append(labelNode);return select;}
      const orderSelect=selectStatus('Trạng thái đơn hàng','orderStatus',orderLabels,o.orderStatus),paymentSelect=selectStatus('Thanh toán','paymentStatus',paymentLabels,o.paymentStatus);
      const noteLabel=node('label','Ghi chú cập nhật (không bắt buộc)'),note=node('input');note.id='statusNote';note.maxLength=300;note.placeholder='Ví dụ: Đã đối chiếu chuyển khoản';noteLabel.append(note);
      const save=node('button','Cập nhật trạng thái','primary');save.type='submit';
      const message=node('p',saved?'Đã lưu trạng thái thành công.':'','save-message');message.setAttribute('role','status');
      form.append(node('h3','Cập nhật đơn hàng'),controls,noteLabel,node('p','Ghi nhận thanh toán thủ công sau khi đối chiếu. Thay đổi được lưu trên trang quản lý; không tự gửi email hoặc cập nhật Excel.','small'),save,message);content.append(form);
      let pending=null;
      form.addEventListener('submit',async event=>{event.preventDefault();const input={id:o.requestId,expectedVersion:data.statusVersion,orderStatus:orderSelect.value,paymentStatus:paymentSelect.value,note:note.value};const key=JSON.stringify(input);if(pending?.key!==key)pending={key,body:{...input,updateId:crypto.randomUUID()}};
        save.disabled=true;orderSelect.disabled=true;paymentSelect.disabled=true;note.disabled=true;message.textContent='Đang lưu…';
        try{const updated=await api('',{method:'PATCH',headers:{'Content-Type':'application/json','X-Admin-Action':'update-order-status'},body:JSON.stringify(pending.body)});const row=state.orders.find(item=>item.id===o.requestId);if(row){row.orderStatus=updated.order.orderStatus;row.paymentStatus=updated.order.paymentStatus;}render();if($('detail').open)renderDetail(updated,true);}
        catch(error){message.textContent=error.message;save.disabled=false;orderSelect.disabled=false;paymentSelect.disabled=false;note.disabled=false;}
      });
      const grid=node('div',undefined,'customer-grid');
      for(const [label,value] of [['Khách hàng',c.name],['Email',c.email],['Điện thoại',c.phone],['Công ty',c.company],['Mã số thuế',c.taxCode],['Địa chỉ giao hàng',c.address]]){const item=node('div');item.append(node('span',label),node('strong',value||'—'));grid.append(item);}
      content.append(grid,node('h3','Sản phẩm'));
      const wrap=node('div',undefined,'table-wrap'),table=node('table'),thead=node('thead'),head=node('tr');['Sản phẩm / Cấu hình','SL','Đơn giá','Thành tiền'].forEach(s=>head.append(node('th',s)));thead.append(head);table.append(thead);
      const tbody=node('tbody');for(const i of o.items){const row=node('tr'),name=node('td',i.name);name.append(node('small',i.options||''));row.append(name,node('td',i.quantity),node('td',money(i.unitPrice)),node('td',money(i.lineTotal)));tbody.append(row);}table.append(tbody);wrap.append(table);content.append(wrap);
      const totals=node('div',undefined,'totals');totals.append(node('strong','Giá trị sản phẩm: '+money(o.subtotal)),node('div','Phí giao hàng: '+(o.deliveryFee===null?'Chờ xác nhận':money(o.deliveryFee))),node('div','Thanh toán: '+(paymentLabels[o.paymentStatus]||o.paymentStatus||'Chưa xác nhận')),node('div','Hình thức: '+(o.paymentMethod==='bank'?'Chuyển khoản':'Thanh toán khi giao hàng')));
      if(o.vatIncluded!==undefined)totals.append(node('div','VAT đã bao gồm: '+money(o.vatIncluded)));
      content.append(totals,node('h3','Ghi chú khách hàng'),node('p',c.notes||'Không có ghi chú.','notes'),node('h3','Trạng thái'),node('p','Đơn hàng: '+(orderLabels[o.orderStatus]||o.orderStatus||'Chưa xác nhận')),node('p','Email: '+(emailLabels[data.emailStatus]||'Chưa xác định')),node('p','Trạng thái email không xác nhận giao hàng, thanh toán hoặc đã ghi vào Excel.','notice'));
      if(data.statusHistory?.length){const history=node('ol',undefined,'status-history');for(const entry of data.statusHistory.slice(-10).reverse()){const item=node('li');item.append(node('strong',`${orderLabels[entry.previousOrderStatus]||entry.previousOrderStatus} → ${orderLabels[entry.orderStatus]||entry.orderStatus} · ${paymentLabels[entry.previousPaymentStatus]||entry.previousPaymentStatus} → ${paymentLabels[entry.paymentStatus]||entry.paymentStatus}`),node('p',`${date(entry.at)} · PhucNgo71`,'muted'));if(entry.note)item.append(node('p',entry.note,'notes'));history.append(item);}content.append(node('h3','Lịch sử cập nhật gần nhất'),history);}
  }
  async function authAction(action) {
    const response=await fetch('/api/auth/csrf',{cache:'no-store',credentials:'same-origin'});
    if(!response.ok)throw Error('Đăng nhập chưa sẵn sàng. Vui lòng liên hệ quản trị website.');
    const {csrfToken}=await response.json();if(!csrfToken)throw Error('Không tạo được phiên đăng nhập.');
    const form=node('form');form.method='POST';form.action='/api/auth/'+action;
    for(const [name,value] of Object.entries({csrfToken,callbackUrl:location.origin+'/admin'})){const input=node('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
    document.body.append(form);form.submit();
  }
  let reporting=false;
  async function reportRequest(query='',options={}){
    const response=await fetch('/api/admin-reports'+query,{credentials:'same-origin',cache:'no-store',...options});
    if(response.status===401){locked('Vui lòng đăng nhập để xem báo cáo.');throw Error('Phiên đăng nhập đã hết hạn.');}
    if(!response.ok){const data=await response.json().catch(()=>({}));throw Error(data.error==='REPORT_INCOMPLETE'?'Có đơn chưa đọc được; chưa tạo báo cáo để tránh thiếu dữ liệu. Vui lòng thử lại.':'Không tạo hoặc tải được báo cáo. Vui lòng thử lại.');}
    return response;
  }
  async function loadReports(){
    try{const data=await(await reportRequest()).json();$('reportWeek').replaceChildren();for(const report of data.reports){const option=node('option',`Tuần ${report.week} · ${report.orderCount} đơn · chốt ${date(report.createdAt)}`);option.value=report.week;$('reportWeek').append(option);}if(!data.reports.length)$('reportWeek').append(node('option','Chưa có báo cáo đã chốt'));$('reportWeek').disabled=!data.reports.length;$('downloadWeekly').disabled=!data.reports.length;if(!data.reports.length)$('reportMessage').textContent='Báo cáo đầu tiên sẽ được chốt vào thứ Hai. Bạn cũng có thể chốt tuần này ngay.';}
    catch(e){$('reportMessage').textContent=e.message;}
  }
  async function reportAction(action){
    if(reporting)return;reporting=true;for(const id of ['currentExcel','createWeekly','downloadWeekly'])$(id).disabled=true;$('reportMessage').textContent='Đang chuẩn bị báo cáo…';
    try{
      if(action==='generate'){const data=await(await reportRequest('',{method:'POST',headers:{'X-Admin-Action':'generate-weekly-report'}})).json();await loadReports();$('reportMessage').textContent=data.existing?'Tuần này đã có báo cáo đã chốt. Dùng “Tải Excel hiện tại” để lấy trạng thái mới nhất.':'Đã chốt báo cáo tuần này. Bạn có thể tải file bên trên.';}
      else{const query=action==='current'?'?action=current':'?action=download&week='+encodeURIComponent($('reportWeek').value);const response=await reportRequest(query);const filename=response.headers.get('content-disposition')?.match(/filename="([A-Za-z0-9_.-]+)"/)?.[1]||'TFW-Don-hang.xlsx';const url=URL.createObjectURL(await response.blob()),a=node('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('reportMessage').textContent='Đã tải báo cáo Excel.';}
    }catch(e){$('reportMessage').textContent=e.message;}finally{reporting=false;$('currentExcel').disabled=false;$('createWeekly').disabled=false;$('downloadWeekly').disabled=$('reportWeek').disabled;}
  }
  $('currentExcel').addEventListener('click',()=>reportAction('current'));$('createWeekly').addEventListener('click',()=>reportAction('generate'));$('downloadWeekly').addEventListener('click',()=>reportAction('download'));
  $('signin').addEventListener('click',async()=>{try{$('signin').disabled=true;await authAction('signin/github');}catch(e){$('loginMessage').textContent=e.message;$('signin').disabled=false;}});
  $('logout').addEventListener('click',async()=>{try{await authAction('signout');locked('Đang đăng xuất…');}catch(e){$('status').textContent=e.message;}});
  $('refresh').addEventListener('click',()=>load(true));$('loadMore').addEventListener('click',()=>load());
  ['search','emailFilter','testFilter'].forEach(id=>$(id).addEventListener('input',render));
  $('closeDetail').addEventListener('click',()=>{$('detail').close();$('detailContent').replaceChildren();});
  $('export').addEventListener('click',()=>{const rows=filtered();if(!rows.length)return;const url=URL.createObjectURL(new Blob([window.orderCSV(rows)],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=url;a.download='TFW-orders-'+new Date().toISOString().slice(0,10)+'.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  // Do not retain order data in localStorage/sessionStorage or the browser back/forward cache.
  window.addEventListener('pagehide',()=>locked('Vui lòng đăng nhập để xem đơn hàng.'));
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
  (async()=>{if(new URLSearchParams(location.search).has('error'))$('loginMessage').textContent='Đăng nhập chưa thành công hoặc tài khoản không được cấp quyền.';try{const {user}=await api('?session=1');$('login').hidden=true;$('dashboard').hidden=false;$('logout').hidden=false;$('accountName').textContent=user.name;await Promise.all([load(true),loadReports()]);}catch{}})();
})();
