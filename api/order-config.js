module.exports = function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).end();
  const ready=process.env.ORDER_CHECKOUT_ENABLED==='true' && process.env.ORDER_ABUSE_PROTECTION_VERIFIED==='true';
  return res.status(200).json({enabled:ready,testMode:Boolean(process.env.ORDER_TEST_EMAIL)});
};
