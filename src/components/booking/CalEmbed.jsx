import { useEffect } from 'react';

let loaded = false;

// Cal.com inline embed (same event as optiify.ai/book-demo for now). Loads its script once per page view.
function loadCal() {
  if (loaded) return;
  loaded = true;
  (function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
  const Cal = window.Cal;
  Cal('init', '30min', { origin: 'https://app.cal.com' });
  Cal.ns['30min']('inline', { elementOrSelector: '#cal-inline', config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }, calLink: 'optiify/30min' });
  Cal.ns['30min']('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#2664f5' } }, hideEventTypeDetails: false, layout: 'month_view' });
}

/**
 * The calendar panel. The embed loads when the panel is first shown, or shortly before the booking
 * section scrolls into view (`sectionRef`). Cal.com owns the #cal-inline node's children once loaded.
 */
export default function CalEmbed({ active, sectionRef }) {
  useEffect(() => { loaded = false; return () => { loaded = false; }; }, []);
  useEffect(() => { if (active) loadCal(); }, [active]);
  useEffect(() => {
    const io = new IntersectionObserver((es, ob) => { if (es[0].isIntersecting && active) { loadCal(); ob.disconnect(); } }, { rootMargin: '600px 0px' });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [active, sectionRef]);

  return (
    <div className="cal-frame">
      <div id="cal-inline" className="cal-inline" dangerouslySetInnerHTML={{ __html: '<p class="cal-loading mono">Loading calendar&hellip;</p>' }} />
    </div>
  );
}
