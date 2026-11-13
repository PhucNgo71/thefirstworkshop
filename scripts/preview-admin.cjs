// Local-only UI fixture; no production authentication, orders or storage.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {createHandler}=require('../api/admin-orders.js');
const {createHandler:createReportHandler}=require('../api/admin-reports.js');
const {createHandler:createPushHandler}=require('../api/admin-push.js');
const {pushService}=require('../server/admin-push.cjs');
const {reportService}=require('../server/weekly-reports.cjs');
const {orderReader}=require('../server/admin-orders.cjs');
const {ADMIN_ID}=require('../server/admin-auth.cjs');
const {APPROVED_STORE}=require('../server/blob-store.cjs');
const root=path.resolve(__dirname,'../dist'),port=Number(process.argv[2])||4186;
const files=new Map();let revision=0;
for(let n=1;n<=3;n++){
 const id=`00000000-0000-4000-8000-${String(n).padStart(12,'0')}`;
 const order={requestId:id,orderNumber:`TFW-DEMO-${1000+n}`,orderDate:`2026-11-13T0${n}:10:00Z`,customer:{name:['','Khách hàng mẫu A','Khách hàng mẫu B','TEST Đơn kiểm tra'][n],email:'demo@example.com',phone:'0900000000',address:'Địa chỉ minh họa — không phải đơn thật',company:'Công ty minh họa',taxCode:'',notes:'Dữ liệu kiểm tra giao diện.'},items:[{name:'Niro / thefirstworkshop',options:'Màu đen',quantity:n,unitPrice:7700000,lineTotal:7700000*n}],subtotal:7700000*n,currency:'VND',orderStatus:'Received',paymentStatus:'Unpaid',paymentMethod:'bank',deliveryFee:null};
 files.set(`orders/v1/${id}.json`,{raw:JSON.stringify({schemaVersion:1,order,emailStatus:['','NeedsReview','Accepted','Pending'][n]}),etag:`seed-${n}`});
}
const sdk={async get(key){const f=files.get(key);return f?{statusCode:200,blob:{size:Buffer.byteLength(f.raw),etag:f.etag},stream:new Response(f.raw).body}:null},async list({cursor,prefix='orders/v1/'}){const keys=[...files.keys()].filter(k=>k.startsWith(prefix));return {blobs:(cursor?keys.slice(2):keys.slice(0,2)).map(pathname=>({pathname})),hasMore:!cursor&&keys.length>2,cursor:cursor?null:'page-2'}},async put(key,raw,options){const previous=files.get(key);if(previous&&(!options.allowOverwrite||options.ifMatch!==previous.etag))throw Error('CONFLICT');files.set(key,{raw,etag:'revision-'+(++revision)});return {etag:'revision-'+revision}}};
const reader=orderReader({VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE},sdk);
const handler=createHandler({origin:`http://127.0.0.1:${port}`,auth:async req=>req.headers.cookie?.includes('admin-preview=1')?{id:ADMIN_ID,name:'BẢN XEM TRƯỚC · DỮ LIỆU MẪU'}:null,reader});
const reportsHandler=createReportHandler({origin:`http://127.0.0.1:${port}`,auth:async req=>req.headers.cookie?.includes('admin-preview=1')?{id:ADMIN_ID}:null,reports:reportService({VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE},sdk,reader)});
const demoKeys=require('web-push').generateVAPIDKeys();
const pushHandler=createPushHandler({origin:`http://127.0.0.1:${port}`,auth:async req=>req.headers.cookie?.includes('admin-preview=1')?{id:ADMIN_ID}:null,push:pushService({VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE,ADMIN_PUSH_PUBLIC_KEY:demoKeys.publicKey,ADMIN_PUSH_PRIVATE_KEY:demoKeys.privateKey},sdk,{async sendNotification(){throw Error('Preview never sends notifications');}})});
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
 if(url.pathname==='/demo-login'){res.writeHead(302,{'Set-Cookie':'admin-preview=1; HttpOnly; SameSite=Strict; Path=/',Location:'/admin'}).end();return;}
 if(['/api/admin-orders','/api/admin-reports','/api/admin-push'].includes(url.pathname)){
  req.query=Object.fromEntries(url.searchParams);if(['PATCH','POST'].includes(req.method)){const chunks=[];for await(const chunk of req)chunks.push(chunk);req.body=Buffer.concat(chunks).toString();}
  res.status=function(n){this.statusCode=n;return this};res.json=function(x){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(x));return this};res.send=function(x){this.end(x);return this};return (url.pathname==='/api/admin-orders'?handler:url.pathname==='/api/admin-push'?pushHandler:reportsHandler)(req,res);
 }
 const allowed={'/admin':'admin.html','/admin.css':'admin.css','/admin.js':'admin.js','/admin-csv.js':'admin-csv.js','/admin-push.js':'admin-push.js','/admin-sw.js':'admin-sw.js','/admin.webmanifest':'admin.webmanifest','/admin-icon-192.png':'admin-icon-192.png','/admin-icon-512.png':'admin-icon-512.png'};
 if(!allowed[url.pathname]){res.writeHead(404).end();return;}const file=allowed[url.pathname];res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.webmanifest')?'application/manifest+json':'text/javascript');res.end(fs.readFileSync(path.join(root,file)));
}).listen(port,'127.0.0.1',()=>console.log(`Admin fixture: http://127.0.0.1:${port}/demo-login`));
