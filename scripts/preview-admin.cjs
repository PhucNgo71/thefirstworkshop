// Local UI fixture only. Never reads production orders or enables production authentication.
const http=require('node:http'), fs=require('node:fs'),path=require('node:path');
const {createHandler}=require('../api/admin-orders.js');
const root=path.resolve(__dirname,'../dist');
const summary=(n,status)=>({id:`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`,orderNumber:`TFW-DEMO-${1000+n}`,orderDate:`2026-11-13T0${n}:10:00Z`,customerName:['','Khách hàng mẫu A','Khách hàng mẫu B','TEST Đơn kiểm tra'][n],email:'demo@example.com',phone:'0900000000',subtotal:7700000*n,currency:'VND',totalQuantity:n,orderStatus:'Received',paymentStatus:'Unpaid',emailStatus:status,isTest:n===3});
const orders=[summary(1,'NeedsReview'),summary(2,'Accepted'),summary(3,'Pending')];
const reader={async list(cursor){return {orders:cursor?[orders[2]]:orders.slice(0,2),hasMore:!cursor,cursor:cursor?null:'demo-page-2',unreadableCount:0}},async detail(id){const s=orders.find(o=>o.id===id);return {emailStatus:s.emailStatus,order:{...s,requestId:s.id,customer:{name:s.customerName,email:s.email,phone:s.phone,address:'Địa chỉ minh họa — không phải đơn thật',company:'Công ty minh họa',taxCode:'',notes:'Dữ liệu kiểm tra giao diện.'},items:[{name:'Niro / thefirstworkshop',options:'Màu đen',quantity:s.totalQuantity,unitPrice:7700000,lineTotal:s.subtotal}],paymentMethod:'bank',deliveryFee:null}}}};
const handler=createHandler({auth:async req=>req.headers.cookie?.includes('admin-preview=1')?{id:'demo',name:'BẢN XEM TRƯỚC · DỮ LIỆU MẪU'}:null,reader});
http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  res.setHeader('Cache-Control','no-store');
  if(url.pathname==='/demo-login'){res.writeHead(302,{'Set-Cookie':'admin-preview=1; HttpOnly; SameSite=Strict; Path=/',Location:'/admin'}).end();return;}
  if(url.pathname==='/api/admin-orders'){
    req.query=Object.fromEntries(url.searchParams);res.status=function(n){this.statusCode=n;return this};res.json=function(x){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(x));return this};return handler(req,res);
  }
  const allowed={'/admin':'admin.html','/admin.css':'admin.css','/admin.js':'admin.js','/admin-csv.js':'admin-csv.js'};
  if(!allowed[url.pathname]){res.writeHead(404).end();return;}
  const file=allowed[url.pathname];res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');res.end(fs.readFileSync(path.join(root,file)));
}).listen(4186,'127.0.0.1',()=>console.log('Admin fixture: http://127.0.0.1:4186/admin (demo at /demo-login)'));
