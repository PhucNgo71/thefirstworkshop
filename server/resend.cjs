const {OrderError, ORDER_COPY_EMAIL} = require('./orders.cjs');
const APPROVED_SENDER = 'orders@notify.tfw.space';

// No mailbox password or Microsoft application token is used here.
// This adapter is not wired into the checkout until durable storage and the
// production sender are configured and tested.
function resend(env = process.env, fetcher = fetch) {
  async function sendMail(payload) {
    const from = env.RESEND_FROM?.trim().toLowerCase();
    if (!env.RESEND_API_KEY || from !== APPROVED_SENDER) {
      throw new OrderError('THIRD_PARTY_EMAIL_NOT_CONFIGURED', 503);
    }
    const message = payload?.message;
    const customer = message?.toRecipients?.[0]?.emailAddress?.address;
    if (message?.toRecipients?.length !== 1 || !customer ||
        message?.ccRecipients?.length !== 1 ||
        message.ccRecipients[0].emailAddress?.address !== ORDER_COPY_EMAIL ||
        message.bccRecipients?.length) throw new OrderError('INVALID_EMAIL_PAYLOAD', 503);
    let requestId;
    try {
      const dataFiles = message.attachments.filter(a => a.name === 'tfw-order.json');
      if (dataFiles.length !== 1) throw Error();
      requestId = JSON.parse(Buffer.from(dataFiles[0].contentBytes, 'base64').toString('utf8')).row.RequestId;
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(requestId)) throw Error();
    } catch { throw new OrderError('INVALID_EMAIL_PAYLOAD', 503); }
    const body = {
      from: `thefirstworkshop <${from}>`,
      to: [customer], cc: [ORDER_COPY_EMAIL], reply_to: ORDER_COPY_EMAIL,
      subject: message.subject, html: message.body.content,
      attachments: message.attachments.map(a => ({filename: a.name, content: a.contentBytes})),
      tags: [{name: 'order_request_id', value: requestId}]
    };
    let response;
    try {
      response = await fetcher('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(15000),
        headers: {Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json',
          'Idempotency-Key': `order-request/${requestId}`},
        body: JSON.stringify(body)
      });
    } catch { throw new OrderError('EMAIL_SEND_UNCERTAIN', 503); }
    // Never log or expose provider response bodies; they can contain PII.
    if (!response.ok) throw new OrderError('EMAIL_NOT_ACCEPTED', 503);
    let result;
    try { result = await response.json(); } catch { throw new OrderError('EMAIL_SEND_UNCERTAIN', 503); }
    if (typeof result.id !== 'string' || !result.id) throw new OrderError('EMAIL_SEND_UNCERTAIN', 503);
    // Accepted by provider is not proof of inbox delivery. Its 24-hour key
    // retention supplements, but never replaces, durable order idempotency.
    return {providerId: result.id, accepted: true};
  }
  return {sendMail};
}
module.exports = {resend};
