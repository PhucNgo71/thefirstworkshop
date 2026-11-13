'use strict';
// Deliberately no fetch handler: never cache orders, sessions or API responses.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};try{data=event.data?.json()||{};}catch{}
  const test=String(data.tag||'').startsWith('test-');
  event.waitUntil(self.registration.showNotification('thefirstworkshop',{
    body:test?'Thông báo thử thành công. Thiết bị này đã kết nối.':'Có đơn online mới. Mở trang quản lý để xem.',
    tag:typeof data.tag==='string'?data.tag.slice(0,80):'tfw-order',icon:'/admin-icon-192.png',badge:'/admin-icon-192.png',data:{url:'/admin'}
  }));
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const tabs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const existing=tabs.find(tab=>{const url=new URL(tab.url);return url.origin===self.location.origin&&url.pathname==='/admin';});
    if(existing){await existing.navigate('/admin');return existing.focus();}
    return self.clients.openWindow('/admin');
  })());
});
