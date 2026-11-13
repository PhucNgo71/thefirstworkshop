const {timingSafeEqual}=require('node:crypto');
const {privateHeaders}=require('../server/admin-auth.cjs');
const {pushService}=require('../server/admin-push.cjs');
function createHandler({env=process.env,push=pushService(env)}={}){return async(req,res)=>{
  privateHeaders(res);if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  const expected=Buffer.from('Bearer '+(env.CRON_SECRET||'')),provided=Buffer.from(String(req.headers.authorization||''));
  if(env.VERCEL_ENV!=='production'||!env.CRON_SECRET||env.CRON_SECRET.length<32||expected.length!==provided.length||!timingSafeEqual(expected,provided))return res.status(401).json({error:'UNAUTHORIZED'});
  try{return res.status(200).json(push.configured()?await push.recover():{disabled:true});}catch{console.warn('push_recovery_failed');return res.status(503).json({error:'PUSH_RECOVERY_FAILED'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
