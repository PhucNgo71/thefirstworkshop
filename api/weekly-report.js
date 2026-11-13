const {timingSafeEqual}=require('node:crypto');
const {privateHeaders}=require('../server/admin-auth.cjs');
const {reportService}=require('../server/weekly-reports.cjs');
function createHandler({env=process.env,reports=reportService()}={}){return async(req,res)=>{
 privateHeaders(res);
 if(req.method!=='GET')return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
 const expected=typeof env.CRON_SECRET==='string'&&env.CRON_SECRET.length>=32?'Bearer '+env.CRON_SECRET:'';
 const actual=req.headers.authorization||'';
 if(env.VERCEL_ENV!=='production'||!expected||typeof actual!=='string'||Buffer.byteLength(actual)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(actual),Buffer.from(expected)))return res.status(401).json({error:'UNAUTHORIZED'});
 try{return res.status(200).json({ok:true,...await reports.generate()});}catch{console.warn('weekly_report_failed');return res.status(503).json({error:'WEEKLY_REPORT_FAILED'});}
};}
module.exports=createHandler();module.exports.createHandler=createHandler;
