const {authenticate,privateHeaders,ORIGIN}=require('../server/admin-auth.cjs');
const {AdminError}=require('../server/admin-orders.cjs');
const {pushService}=require('../server/admin-push.cjs');
function createHandler({auth=authenticate,push=pushService(),origin=ORIGIN}={}){return async(req,res)=>{
  privateHeaders(res);
  if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
  try{
    if(!await auth(req))return res.status(401).json({error:'UNAUTHORIZED'});
    if(req.method==='GET')return res.status(200).json(push.configured()?await push.status():{configured:false});
    if(req.headers.origin!==origin||req.headers['x-admin-action']!=='push-settings')return res.status(403).json({error:'INVALID_ORIGIN'});
    if(!String(req.headers['content-type']||'').startsWith('application/json'))throw new AdminError('JSON_REQUIRED',415);
    const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(!raw||Buffer.byteLength(raw)>5000)throw new AdminError('INVALID_REQUEST');
    let data;try{data=JSON.parse(raw);}catch{throw new AdminError('INVALID_REQUEST');}
    if(!['status','subscribe','unsubscribe','test'].includes(data?.action))throw new AdminError('INVALID_ACTION');
    return res.status(200).json(await push[data.action](data.subscription));
  }catch(e){return res.status(e instanceof AdminError?e.status:503).json({error:e instanceof AdminError?e.message:'PUSH_UNAVAILABLE'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
