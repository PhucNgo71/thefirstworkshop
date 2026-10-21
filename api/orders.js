const {submit, OrderError} = require('../server/orders.cjs');
const {blobStore} = require('../server/blob-store.cjs');
const {resend} = require('../server/resend.cjs');
const catalog = require('../server/catalog.json');
const service = {store:blobStore(), ...resend()};
module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method !== 'POST') {res.setHeader('Allow','POST'); return res.status(405).json({error:'METHOD_NOT_ALLOWED'});}
  if(!['https://tfw.space','https://www.tfw.space'].includes(req.headers.origin)) return res.status(403).json({error:'INVALID_ORIGIN'});
  // Keep disabled until the store, Excel bridge, mail scope, and abuse controls
  // have been verified. Credentials alone must never enable a live checkout.
  if(process.env.ORDER_CHECKOUT_ENABLED !== 'true') return res.status(503).json({error:'CHECKOUT_NOT_READY'});
  try {
    if(!String(req.headers['content-type']||'').startsWith('application/json')) throw new OrderError('JSON_REQUIRED',415);
    const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);
    if(!raw || Buffer.byteLength(raw)>24000) throw new OrderError('REQUEST_TOO_LARGE',413);
    let input;
    try {input=typeof req.body==='string'?JSON.parse(req.body):req.body;} catch {throw new OrderError('INVALID_ORDER');}
    // Before customer launch, production tests can send only to the explicitly
    // approved test recipient. The server, not browser input, enforces this.
    if(process.env.ORDER_TEST_EMAIL && (input?.customer?.email?.trim().toLowerCase()!==process.env.ORDER_TEST_EMAIL.toLowerCase() || !input?.customer?.name?.startsWith('TEST '))) throw new OrderError('CHECKOUT_TEST_ONLY',503);
    // A Vercel WAF rate-limit/bot rule must protect /api/orders before enablement.
    if(process.env.ORDER_ABUSE_PROTECTION_VERIFIED !== 'true') throw new OrderError('ABUSE_PROTECTION_NOT_CONFIGURED',503);
    const result=await submit(input,{catalog,...service});
    return res.status(201).json(result);
  } catch(error) {
    // Never log request bodies, email addresses, token responses or secrets.
    const code=error instanceof OrderError?error.code:'SERVICE_UNAVAILABLE';
    console.warn('order_submit',code);
    return res.status(error instanceof OrderError?error.status:503).json({error:code});
  }
};
