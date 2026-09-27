// Enable Web Analytics in the Vercel project, then redeploy.
// Only load on production, never count local development as visitor traffic.
(() => {
  if (location.hostname !== 'thefirstworkshop.vercel.app') return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl) return;
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  // Strip query strings and fragments. Never send delivery form data or codes.
  window.va('beforeSend', event => {
    if (event.url) { const url = new URL(event.url); url.search = ''; url.hash = ''; return {...event, url: url.href}; }
    return event;
  });
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.append(script);
})();
