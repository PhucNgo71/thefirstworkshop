const {authenticate,privateHeaders,ORIGIN}=require('../server/admin-auth.cjs');
const {reportService}=require('../server/weekly-reports.cjs');
const {AdminError}=require('../server/admin-orders.cjs');
function createHandler({auth=authenticate,reports=reportService(),origin=ORIGIN}={}){return async(req,res)=>{
 privateHeaders(res);
 if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
 try{
  if(!await auth(req))return res.status(401).json({error:'UNAUTHORIZED'});
  if(req.method==='POST'){
   if(req.headers.origin!==origin||req.headers['x-admin-action']!=='generate-weekly-report')return res.status(403).json({error:'INVALID_ORIGIN'});
   return res.status(200).json(await reports.generate());
  }
  const action=req.query?.action||'list';
  if(action==='list')return res.status(200).json({reports:await reports.list(),schedule:'Thứ Hai, 08:00 · giờ Việt Nam'});
  if(!['download','current'].includes(action))return res.status(400).json({error:'INVALID_ACTION'});
  const file=action==='current'?await reports.current():await reports.download(req.query?.week);
  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');res.setHeader('Content-Disposition',`attachment; filename="${file.filename}"`);return res.status(200).send(file.buffer);
 }catch(e){return res.status(e instanceof AdminError?e.status:503).json({error:e instanceof AdminError?e.message:'REPORTS_UNAVAILABLE'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
