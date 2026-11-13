// Local-only UI fixture; no production authentication, orders or storage.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {createHandler}=require('../api/admin-orders.js');
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
const sdk={async get(key){const f=files.get(key);return f?{statusCode:200,blob:{size:Buffer.byteLength(f.raw),etag:f.etag},stream:new Response(f.raw).body}:null},async list({cursor}){const keys=[...files.keys()].filter(k=>k.startsWith('orders/v1/'));return {blobs:(cursor?keys.slice(2):keys.slice(0,2)).map(pathname=>({pathname})),hasMore:!cursor,cursor:cursor?null:'page-2'}},async put(key,raw,options){const previous=files.get(key);if(previous&&(!options.allowOverwrite||options.ifMatch!==previous.etag))throw Error('CONFLICT');files.set(key,{raw,etag:'revision-'+(++revision)});return {etag:'revision-'+revision}}};
const reader=orderReader({VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE},sdk);
const handler=createHandler({origin:`http://127.0.0.1:${port}`,auth:async req=>req.headers.cookie?.includes('admin-preview=1')?{id:ADMIN_ID,name:'BẢN XEM TRƯỚC · DỮ LIỆU MẪU'}:null,reader});
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
 if(url.pathname==='/demo-login'){res.writeHead(302,{'Set-Cookie':'admin-preview=1; HttpOnly; SameSite=Strict; Path=/',Location:'/admin'}).end();return;}
 if(url.pathname==='/api/admin-orders'){
  req.query=Object.fromEntries(url.searchParams);if(req.method==='PATCH'){const chunks=[];for await(const chunk of req)chunks.push(chunk);req.body=Buffer.concat(chunks).toString();}
  res.status=function(n){this.statusCode=n;return this};res.json=function(x){this.setHeader('Content-Type','application/json');this.end(JSON.stringify(x));return this};return handler(req,res);
 }
 const allowed={'/admin':'admin.html','/admin.css':'admin.css','/admin.js':'admin.js','/admin-csv.js':'admin-csv.js'};
 if(!allowed[url.pathname]){res.writeHead(404).end();return;}const file=allowed[url.pathname];res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');res.end(fs.readFileSync(path.join(root,file)));
}).listen(port,'127.0.0.1',()=>console.log(`Admin fixture: http://127.0.0.1:${port}/demo-login`));
