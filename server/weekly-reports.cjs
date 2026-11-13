const ExcelJS = require('exceljs');
const {orderReader, AdminError} = require('./admin-orders.cjs');
const {APPROVED_STORE} = require('./blob-store.cjs');
const PREFIX = 'reports/weekly/v1/';
const WEEK = /^\d{4}-\d{2}-\d{2}$/;
const orderLabels = {Received:'Đã tiếp nhận',Processing:'Đang xử lý',Delivering:'Đang giao hàng',Completed:'Hoàn tất',Cancelled:'Đã hủy'};
const paymentLabels = {Unpaid:'Chưa thanh toán',Paid:'Đã thanh toán'};
function weekStart(now=new Date()) {
 const local=new Date(now.getTime()+7*3600000);local.setUTCHours(0,0,0,0);local.setUTCDate(local.getUTCDate()-((local.getUTCDay()+6)%7));return local.toISOString().slice(0,10);
}
function validWeek(week){if(typeof week!=='string'||!WEEK.test(week))return false;const d=new Date(week+'T00:00:00+07:00');return !Number.isNaN(d.valueOf())&&weekStart(d)===week;}
const localDate = value => new Date(value).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour12:false});
async function collect(reader, now=new Date()) {
 const summaries=new Map();let cursor,more=true,unreadable=0;const seen=new Set();
 for(let pages=0;more;pages++){
  if(pages>=100)throw new AdminError('REPORT_TOO_LARGE',503);
  const page=await reader.list(cursor);unreadable+=page.unreadableCount||0;for(const o of page.orders)summaries.set(o.id,o);
  more=page.hasMore;cursor=page.cursor;if(more&&(!cursor||seen.has(cursor)))throw new AdminError('INVALID_STORAGE_PAGE',503);seen.add(cursor);
 }
 if(unreadable)throw new AdminError('REPORT_INCOMPLETE',503);
 const ids=[...summaries.values()].filter(o=>!o.isTest).map(o=>o.id),orders=[];
 for(let i=0;i<ids.length;i+=5){const batch=await Promise.all(ids.slice(i,i+5).map(id=>reader.detail(id)));for(const d of batch){if(/^TEST\b/i.test(d.order.customer.name||''))continue;orders.push({order:d.order,emailStatus:d.emailStatus,statusUpdatedAt:d.statusHistory?.at(-1)?.at||d.order.orderDate});}}
 orders.sort((a,b)=>String(b.order.orderDate).localeCompare(String(a.order.orderDate)));
 return {schemaVersion:1,week:weekStart(now),createdAt:now.toISOString(),scope:'all-customer-orders',excludedTestCount:[...summaries.values()].filter(o=>o.isTest).length,orders};
}
function metadata(snapshot){return {week:snapshot.week,createdAt:snapshot.createdAt,orderCount:snapshot.orders.length,excludedTestCount:snapshot.excludedTestCount};}
function reportService(env=process.env,sdk=require('@vercel/blob'),reader=orderReader(env,sdk)){
 function ready(){if(env.VERCEL_ENV!=='production'||env.BLOB_STORE_ID!==APPROVED_STORE)throw new AdminError('REPORTS_NOT_CONFIGURED',503);}
 const options=()=>({storeId:APPROVED_STORE,access:'private',abortSignal:AbortSignal.timeout(12000)});
 async function read(week){ready();if(!validWeek(week))throw new AdminError('INVALID_REPORT_WEEK');const result=await sdk.get(PREFIX+week+'.json',{...options(),useCache:false});if(!result)return null;if(result.statusCode!==200||result.blob.size>8000000)throw new AdminError('INVALID_REPORT',503);const raw=await new Response(result.stream).text();if(Buffer.byteLength(raw)>8000000)throw new AdminError('INVALID_REPORT',503);const s=JSON.parse(raw);if(s.schemaVersion!==1||s.week!==week||!Array.isArray(s.orders))throw new AdminError('INVALID_REPORT',503);return s;}
 return {
  async generate(now=new Date()){
   ready();const week=weekStart(now),existing=await read(week);if(existing)return {...metadata(existing),existing:true};
   const snapshot=await collect(reader,now),raw=JSON.stringify(snapshot);if(Buffer.byteLength(raw)>8000000)throw new AdminError('REPORT_TOO_LARGE',503);
   try{await sdk.put(PREFIX+week+'.json',raw,{...options(),contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,cacheControlMaxAge:60});}
   catch{const saved=await read(week);if(saved)return {...metadata(saved),existing:true};throw new AdminError('REPORT_SAVE_FAILED',503);}
   return {...metadata(snapshot),existing:false};
  },
  async list(){ready();const weeks=new Set();let cursor,hasMore=true;for(let page=0;hasMore;page++){if(page>=20)throw new AdminError('REPORT_LIST_TOO_LARGE',503);const result=await sdk.list({storeId:APPROVED_STORE,prefix:PREFIX,limit:100,...(cursor?{cursor}:{}),abortSignal:AbortSignal.timeout(12000)});for(const b of result.blobs){const w=b.pathname.slice(PREFIX.length).replace(/\.json$/,'');if(b.pathname===PREFIX+w+'.json'&&validWeek(w))weeks.add(w);}hasMore=result.hasMore;if(hasMore&&(!result.cursor||result.cursor===cursor))throw new AdminError('INVALID_STORAGE_PAGE',503);cursor=result.cursor;}
   const selected=[...weeks].sort().reverse().slice(0,12);return Promise.all(selected.map(async week=>metadata(await read(week))));
  },
  async download(week){const snapshot=await read(week);if(!snapshot)throw new AdminError('REPORT_NOT_FOUND',404);return {buffer:await buildWorkbook(snapshot),filename:`TFW-Don-hang-tuan-${week}.xlsx`};},
  async current(){ready();const snapshot=await collect(reader);return {buffer:await buildWorkbook(snapshot),filename:`TFW-Don-hang-${new Date().toISOString().slice(0,10)}.xlsx`};}
 };
}
async function buildWorkbook(snapshot){
 const wb=new ExcelJS.Workbook();wb.creator='thefirstworkshop';wb.created=new Date(snapshot.createdAt);wb.modified=new Date(snapshot.createdAt);wb.calcProperties.fullCalcOnLoad=true;
 const main=wb.addWorksheet('Don hang',{views:[{state:'frozen',xSplit:2,ySplit:5}],properties:{defaultRowHeight:20}});
 const items=wb.addWorksheet('San pham',{views:[{state:'frozen',xSplit:1,ySplit:5}]});
 const headers=['Mã đơn','Ngày đặt (VN)','Khách hàng','Email','Điện thoại','Công ty','Mã số thuế','Địa chỉ giao hàng','Số lượng','Giá trị sản phẩm (VND, gồm VAT)','Phí giao hàng (VND)','Hình thức thanh toán','Trạng thái đơn','Thanh toán','Email','Ghi chú khách hàng','Cập nhật trạng thái (VN)'];
 const itemHeaders=['Mã đơn','Mã sản phẩm','Sản phẩm','Cấu hình','Số lượng','Đơn giá gồm VAT (VND)','Thành tiền gồm VAT (VND)'];
 function setup(sheet,title,columns,widths){sheet.columns=widths.map(width=>({width}));sheet.mergeCells(1,1,1,columns.length);sheet.getCell('A1').value=title;sheet.getCell('A1').font={bold:true,size:18,color:{argb:'FF123E2A'}};sheet.getRow(1).height=32;sheet.mergeCells(2,1,2,columns.length);sheet.getCell('A2').value=`Tuần bắt đầu ${snapshot.week} · Chốt dữ liệu: ${localDate(snapshot.createdAt)} (giờ Việt Nam)`;sheet.mergeCells(3,1,3,columns.length);sheet.getCell('A3').value=`Toàn bộ đơn khách tại thời điểm chốt; không gồm ${snapshot.excludedTestCount} đơn TEST. Thanh toán được ghi nhận thủ công; phí giao hàng chờ xác nhận nếu để trống.`;sheet.getRow(3).height=32;sheet.getCell('A3').alignment={wrapText:true,vertical:'middle'};sheet.getRow(5).values=columns;sheet.getRow(5).height=34;sheet.getRow(5).eachCell(cell=>{cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF123E2A'}};cell.font={bold:true,color:{argb:'FFFFFFFF'}};cell.alignment={wrapText:true,vertical:'middle'};});sheet.autoFilter={from:{row:5,column:1},to:{row:5,column:columns.length}};sheet.pageSetup={orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0,paperSize:9,printTitlesRow:'1:5'};}
 setup(main,'thefirstworkshop · Báo cáo đơn hàng',headers,[40,23,26,32,20,28,20,48,12,24,22,23,22,20,28,48,24]);
 setup(items,'thefirstworkshop · Chi tiết sản phẩm',itemHeaders,[40,25,40,48,12,24,26]);
 for(const data of snapshot.orders){const o=data.order,c=o.customer;const row=main.addRow([o.orderNumber,localDate(o.orderDate),c.name,c.email,c.phone,c.company||'',c.taxCode||'',c.address,o.items.reduce((n,i)=>n+i.quantity,0),o.subtotal,o.deliveryFee??null,o.paymentMethod==='bank'?'Chuyển khoản':'Thanh toán khi giao hàng',orderLabels[o.orderStatus]||o.orderStatus,paymentLabels[o.paymentStatus]||o.paymentStatus,data.emailStatus,c.notes||'',localDate(data.statusUpdatedAt)]);row.height=40;for(const i of o.items)items.addRow([o.orderNumber,i.id,i.name,i.options||'',i.quantity,i.unitPrice,i.lineTotal]);}
 for(const sheet of [main,items])sheet.eachRow((row,index)=>{if(index<6)return;row.eachCell(cell=>{cell.alignment={vertical:'top',wrapText:true};if(index%2===0)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:'FFF0F4ED'}};if(typeof cell.value==='string')cell.numFmt='@';});});
 for(const col of [9,10,11])main.getColumn(col).numFmt='#,##0';for(const col of [5,6,7])items.getColumn(col).numFmt='#,##0';
 const buffer=Buffer.from(await wb.xlsx.writeBuffer());if(buffer.length>4000000)throw new AdminError('REPORT_DOWNLOAD_TOO_LARGE',503);return buffer;
}
module.exports={weekStart,validWeek,collect,buildWorkbook,reportService};
