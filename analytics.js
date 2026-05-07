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

  function safeStorage(type) {
    try {
      const s = window[type];
      const k = '__p2m_test__';
      s.setItem(k, '1'); s.removeItem(k);
      return s;
    } catch (_) { return null; }
  }

  function sessionInfo() {
    const ss = safeStorage('sessionStorage');
    if (!ss) return { is_new_session: true, session_id: '' };
    let id = ss.getItem('p2m_sid');
    let isNew = false;
    if (!id) {
      id = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      ss.setItem('p2m_sid', id);
      isNew = true;
    }
    return { is_new_session: isNew, session_id: id };
  }

  function gclidFirstVisit(gclid) {
    if (!gclid) return null;
    const ls = safeStorage('localStorage');
    if (!ls) return null;
    const key = 'p2m_gclid_' + gclid;
    if (ls.getItem(key)) return false;
    ls.setItem(key, String(Date.now()));
    return true;
  }

  function send(event, extra) {
    try {
      const params = urlParams();
      const session = sessionInfo();
      const gclidFirst = gclidFirstVisit(params.gclid);
      const payload = Object.assign({
        event: event,
        site: SITE,
        device: deviceType(),
        path: window.location.pathname,
        referrer: document.referrer || '',
        is_new_session: session.is_new_session,
        session_id: session.session_id,
        gclid_is_first_visit: gclidFirst
      }, params, extra || {});
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
