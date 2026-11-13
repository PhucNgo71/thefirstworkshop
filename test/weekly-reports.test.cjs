const test=require('node:test'),assert=require('node:assert/strict'),ExcelJS=require('exceljs');
const {weekStart,validWeek,collect,buildWorkbook,reportService}=require('../server/weekly-reports.cjs');
const {createHandler:adminHandler}=require('../api/admin-reports.js');
const {createHandler:cronHandler}=require('../api/weekly-report.js');
const {APPROVED_STORE}=require('../server/blob-store.cjs');
const env={VERCEL_ENV:'production',BLOB_STORE_ID:APPROVED_STORE,CRON_SECRET:'test-only-cron-secret-with-32-characters'};
const now=new Date('2026-11-13T03:00:00Z');
const sample=(id)=>({order:{requestId:id,orderNumber:'TFW-'+id,orderDate:'2026-11-12T02:00:00Z',customer:{name:'=HYPERLINK("bad")',email:'test@example.com',phone:'0903017957',company:'Công ty Việt Nam',address:'Địa chỉ thử nghiệm',notes:'Ghi chú'},items:[{id:'niro',name:'Niro',options:'Màu đen',quantity:2,unitPrice:7700000,lineTotal:15400000}],subtotal:15400000,deliveryFee:null,paymentMethod:'bank',orderStatus:'Processing',paymentStatus:'Paid'},emailStatus:'Accepted',statusHistory:[{at:'2026-11-13T01:00:00Z'}]});
function fakeReader(){return {async list(cursor){return cursor?{orders:[{id:'second',isTest:false}],hasMore:false,unreadableCount:0}:{orders:[{id:'first',isTest:false},{id:'test',isTest:true}],hasMore:true,cursor:'page2',unreadableCount:0}},async detail(id){return sample(id)}};}
function memoryStore(){const files=new Map();let writes=0;return {files,get writes(){return writes},async get(path){const raw=files.get(path);return raw?{statusCode:200,blob:{size:Buffer.byteLength(raw)},stream:new Response(raw).body}:null},async put(path,raw,options){assert.equal(options.access,'private');assert.equal(options.allowOverwrite,false);assert.equal(options.addRandomSuffix,false);if(files.has(path))throw Error('exists');files.set(path,raw);writes++;return{}},async list({prefix}){return{blobs:[...files.keys()].filter(k=>k.startsWith(prefix)).map(pathname=>({pathname})),hasMore:false}}};}
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(body){this.body=body;return this},send(body){this.body=body;return this}};}
test('weekly report dates follow Monday in Vietnam across Sunday UTC and year boundaries',()=>{
 assert.equal(weekStart(now),'2026-11-09');assert.equal(weekStart(new Date('2026-11-15T16:59:59Z')),'2026-11-09');assert.equal(weekStart(new Date('2026-11-15T17:00:00Z')),'2026-11-16');assert.equal(weekStart(new Date('2027-01-01T00:00:00Z')),'2026-12-28');assert.equal(validWeek('2026-11-16'),true);assert.equal(validWeek('../2026-11-16'),false);assert.equal(validWeek('2026-11-17'),false);
});
test('report includes all paginated customer orders and latest statuses, excludes test orders',async()=>{
 const data=await collect(fakeReader(),now);assert.equal(data.orders.length,2);assert.equal(data.excludedTestCount,1);assert.equal(data.orders[1].order.paymentStatus,'Paid');assert.equal(data.orders[0].statusUpdatedAt,'2026-11-13T01:00:00Z');
 await assert.rejects(collect({async list(){return {orders:[],unreadableCount:1,hasMore:false}}},now),/REPORT_INCOMPLETE/);
});
test('XLSX round-trip preserves Vietnamese, numeric totals, phone zeros and inert user strings',async()=>{
 const data=await collect(fakeReader(),now),buffer=await buildWorkbook(data),wb=new ExcelJS.Workbook();await wb.xlsx.load(buffer);
 assert.equal(wb.worksheets.length,2);const main=wb.getWorksheet('Don hang'),items=wb.getWorksheet('San pham');assert.equal(main.getCell('C6').value,'=HYPERLINK("bad")');assert.equal(main.getCell('C6').type,ExcelJS.ValueType.String);assert.equal(main.getCell('E6').value,'0903017957');assert.equal(main.getCell('J6').value,15400000);assert.equal(main.getCell('N6').value,'Đã thanh toán');assert.equal(main.getCell('K6').value,null);assert.equal(items.getCell('D6').value,'Màu đen');assert.equal(items.getCell('G6').value,15400000);assert.equal(main.views[0].state,'frozen');assert.ok(main.autoFilter);assert.ok(buffer.length>1000);
});
test('weekly snapshot is private, immutable and idempotent while current export stays fresh',async()=>{
 const sdk=memoryStore(),reader=fakeReader(),service=reportService(env,sdk,reader);const first=await service.generate(now);assert.equal(first.existing,false);assert.equal(first.orderCount,2);const again=await service.generate(now);assert.equal(again.existing,true);assert.equal(sdk.writes,1);assert.equal((await service.list()).length,1);
 reader.detail=async id=>{const d=sample(id);d.order.paymentStatus='Unpaid';return d;};
 const saved=new ExcelJS.Workbook(),current=new ExcelJS.Workbook();await saved.xlsx.load((await service.download('2026-11-09')).buffer);await current.xlsx.load((await service.current()).buffer);assert.equal(saved.getWorksheet('Don hang').getCell('N6').value,'Đã thanh toán');assert.equal(current.getWorksheet('Don hang').getCell('N6').value,'Chưa thanh toán');
 await assert.rejects(service.download('../../secret'),/INVALID_REPORT_WEEK/);await assert.rejects(reportService({...env,VERCEL_ENV:'preview'},sdk,reader).generate(now),/NOT_CONFIGURED/);
});
test('incomplete source and failed save never claim a report exists; lost write response reconciles',async()=>{
 const sdk=memoryStore(),bad={async list(){return {orders:[],hasMore:false,unreadableCount:1}}};await assert.rejects(reportService(env,sdk,bad).generate(now),/REPORT_INCOMPLETE/);assert.equal(sdk.writes,0);
 const originalPut=sdk.put;sdk.put=async(...args)=>{await originalPut(...args);throw Error('lost response')};assert.equal((await reportService(env,sdk,fakeReader()).generate(now)).existing,true);assert.equal(sdk.writes,1);
});
test('admin report routes require login and creation requires same-origin intent',async()=>{
 let calls=0;const reports={async list(){calls++;return[]},async generate(){calls++;return{ok:true}}};const request={method:'POST',headers:{origin:'https://tfw.space','x-admin-action':'generate-weekly-report'}};
 const denied=response();await adminHandler({auth:async()=>null,reports})(request,denied);assert.equal(denied.statusCode,401);assert.equal(calls,0);
 const cross=response();await adminHandler({auth:async()=>({id:'owner'}),reports})({...request,headers:{origin:'https://evil.example'}},cross);assert.equal(cross.statusCode,403);assert.equal(calls,0);
 const ok=response();await adminHandler({auth:async()=>({id:'owner'}),reports})(request,ok);assert.equal(ok.statusCode,200);assert.equal(calls,1);assert.equal(ok.headers['Cache-Control'],'private, no-store, max-age=0');
});
test('cron rejects missing/wrong secret and preview environment before reading orders',async()=>{
 let calls=0;const reports={async generate(){calls++;return{week:'2026-11-16',orderCount:2}}};const handler=cronHandler({env,reports});for(const token of [undefined,'Bearer wrong']){const res=response();await handler({method:'GET',headers:{authorization:token}},res);assert.equal(res.statusCode,401);}assert.equal(calls,0);
 const ok=response();await handler({method:'GET',headers:{authorization:'Bearer '+env.CRON_SECRET}},ok);assert.equal(ok.statusCode,200);assert.equal(calls,1);
 const preview=response();await cronHandler({env:{...env,VERCEL_ENV:'preview'},reports})({method:'GET',headers:{authorization:'Bearer '+env.CRON_SECRET}},preview);assert.equal(preview.statusCode,401);
 const config=require('../vercel.json');assert.deepEqual(config.crons,[{path:'/api/weekly-report',schedule:'0 1 * * 1'}]);
});
