(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let config=null,registration=null,busy=false;
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  function message(text){$('pushMessage').textContent=text;}
  async function api(action,sub){
    const response=await fetch('/api/admin-push',{credentials:'same-origin',cache:'no-store',...(action?{method:'POST',headers:{'Content-Type':'application/json','X-Admin-Action':'push-settings'},body:JSON.stringify({action,subscription:sub?.toJSON()})}:{})});
    if(response.status===401)throw Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
    if(!response.ok)throw Error('Chưa hoàn tất kết nối thông báo. Vui lòng thử lại.');
    return response.json();
  }
  function buttons(active=false){const needsInstall=ios&&!standalone();$('enablePush').textContent=needsInstall?'Cách bật trên iPhone':'Bật thông báo';$('enablePush').disabled=busy||(!needsInstall&&!config?.configured);$('testPush').disabled=busy||!active;$('disablePush').disabled=busy||!active;}
  function supported(){return 'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;}
  async function init(){
    $('pushInstall').hidden=!ios||standalone();
    if(ios&&!standalone()){$('pushInstall').hidden=false;message('Bạn đang mở trong Safari. Hãy thêm trang vào Màn hình chính, rồi mở biểu tượng TFW Đơn hàng để bật thông báo.');buttons();return;}
    try{
      config=await api();
      if(!config.configured){message('Kênh thông báo đang được thiết lập. Chưa có thông báo đẩy.');buttons();return;}
      if(ios&&!standalone()){message('Trên iPhone, mở trang từ biểu tượng Màn hình chính để bật thông báo.');buttons();return;}
      if(!supported()){message('Trình duyệt này chưa hỗ trợ thông báo. iPhone cần iOS 16.4 trở lên và mở từ Màn hình chính.');buttons();$('enablePush').disabled=true;return;}
      registration=await navigator.serviceWorker.register('/admin-sw.js',{scope:'/admin'});
      // Ready refers to this page's scope; no fetch handler or private data cache.
      registration=await navigator.serviceWorker.ready;
      const sub=await registration.pushManager.getSubscription();
      const status=sub?await api('status',sub):{active:false};buttons(status.active&&Notification.permission==='granted');
      message(status.active&&Notification.permission==='granted'?'Đã bật trên thiết bị này. Bấm “Gửi thử” để kiểm tra thông báo trên điện thoại.':Notification.permission==='denied'?'Thông báo đang bị chặn. Mở Cài đặt iPhone → Thông báo → TFW Đơn hàng để cho phép.':'Chưa bật thông báo trên thiết bị này.');
    }catch(e){message(e.message);buttons();}
  }
  async function enable(){
    if(ios&&!standalone()){$('pushInstall').hidden=false;$('pushInstall').scrollIntoView({behavior:'smooth',block:'center'});$('pushInstall').focus({preventScroll:true});message('Safari → Chia sẻ (ô vuông có mũi tên lên) → Thêm vào Màn hình chính → Thêm. Sau đó mở biểu tượng TFW Đơn hàng trên Màn hình chính và đăng nhập lại.');return;}
    if(busy||!registration||!supported())return;
    // Call the permission prompt directly in the user's click, before network awaits.
    const permissionPromise=Notification.requestPermission();busy=true;buttons();
    try{
      if(await permissionPromise!=='granted'){message('Bạn chưa cho phép thông báo. Chưa bật nhận tin trên thiết bị này.');return;}
      let sub=await registration.pushManager.getSubscription();
      if(sub&&sub.options.applicationServerKey){const key=btoa(String.fromCharCode(...new Uint8Array(sub.options.applicationServerKey))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');if(key!==config.publicKey){await sub.unsubscribe();sub=null;}}
      if(!sub){const base64=config.publicKey.replace(/-/g,'+').replace(/_/g,'/');const bytes=Uint8Array.from(atob(base64+'='.repeat((4-base64.length%4)%4)),c=>c.charCodeAt(0));sub=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:bytes});}
      await api('subscribe',sub);message('Đã bật. Bấm “Gửi thử”, rồi kiểm tra thông báo trên iPhone.');
    }catch(e){message(e.message);}finally{busy=false;const sub=await registration.pushManager.getSubscription().catch(()=>null);const s=sub?await api('status',sub).catch(()=>({active:false})):{active:false};buttons(s.active);}
  }
  async function action(kind){if(busy||!registration)return;busy=true;buttons();try{const sub=await registration.pushManager.getSubscription();if(!sub)throw Error('Thiết bị chưa đăng ký. Vui lòng bật thông báo trước.');await api(kind,sub);if(kind==='unsubscribe'){await sub.unsubscribe();message('Đã tắt thông báo trên thiết bị này.');}else message('Dịch vụ đã nhận tin thử. Hãy kiểm tra trên điện thoại; bước này chưa xác nhận bạn đã nhận tin.');}catch(e){message(e.message);}finally{busy=false;const sub=await registration.pushManager.getSubscription().catch(()=>null);const s=sub?await api('status',sub).catch(()=>({active:false})):{active:false};buttons(s.active);}}
  $('enablePush').addEventListener('click',enable);$('testPush').addEventListener('click',()=>action('test'));$('disablePush').addEventListener('click',()=>action('unsubscribe'));
  document.addEventListener('admin-ready',init);
})();
