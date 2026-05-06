(function () {
  const script = document.currentScript;
  if (!script) return;

  const ENDPOINT = script.getAttribute('data-endpoint');
  const SITE = script.getAttribute('data-site') || '';
  if (!ENDPOINT) return;

  function deviceType() {
    const ua = navigator.userAgent || '';
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'tablet';
    if (/Mobile|iPhone|Android.+Mobile|Windows Phone|IEMobile|Opera Mini/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  function urlParams() {
    const q = new URLSearchParams(window.location.search);
    return {
      gclid: q.get('gclid') || '',
      utm_source: q.get('utm_source') || '',
      utm_medium: q.get('utm_medium') || '',
      utm_campaign: q.get('utm_campaign') || ''
    };
  }

  function send(event, extra) {
    try {
      const payload = Object.assign({
        event: event,
        site: SITE,
        device: deviceType(),
        path: window.location.pathname,
        referrer: document.referrer || ''
      }, urlParams(), extra || {});
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
        mode: 'cors',
        credentials: 'omit'
      }).catch(function () {});
    } catch (_) { /* fire-and-forget */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { send('pageview'); });
  } else {
    send('pageview');
  }

  document.addEventListener('click', function (e) {
    const link = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!link) return;
    send('click_whatsapp');
  });

  window.p2mAnalytics = { send: send };
})();
