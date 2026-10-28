(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  document.getElementById('yr').textContent = new Date().getFullYear();
  // Booth-screen mode (?booth): show the QR code so visitors can book from their phones
  if (new URLSearchParams(location.search).has('booth')) {
    document.querySelector('.qr').hidden = false;
  }

  // ---------- nav: Projects menu ----------
  document.querySelectorAll('.nav-dd').forEach(dd => {
    const btn = dd.querySelector('.dd-btn');
    let t;
    const set = open => { dd.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
    btn.addEventListener('click', () => set(!dd.classList.contains('open')));
    dd.addEventListener('mouseenter', () => { clearTimeout(t); set(true); });
    dd.addEventListener('mouseleave', () => { t = setTimeout(() => set(false), 150); });
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && dd.classList.contains('open')) { set(false); btn.focus(); } });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
  });

  // ---------- rulers ----------
  function numberRulers() {
    document.querySelectorAll('.ruler-v').forEach(r => {
      r.querySelectorAll('.n').forEach(n => n.remove());
      for (let y = 80; y < r.offsetHeight; y += 80) {
        const n = document.createElement('span');
        n.className = 'n'; n.style.top = y + 'px'; n.textContent = y;
        r.appendChild(n);
      }
    });
    document.querySelectorAll('.ruler-h').forEach(r => {
      r.querySelectorAll('.n').forEach(n => n.remove());
      for (let x = 0, i = 0; x < r.offsetWidth - 20; x += 100, i++) {
        const n = document.createElement('span');
        n.className = 'n'; n.style.left = x + 'px'; n.textContent = i * 10;
        r.appendChild(n);
      }
    });
  }
  numberRulers();
  addEventListener('resize', numberRulers);

  // ---------- crosshair + OSNAP-style hover ----------
  const xh = document.querySelector('.xhair');
  const snap = document.querySelector('.snap'), tag = snap.querySelector('.snap-tag');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.body.classList.add('cad');
    const h = xh.querySelector('.xh-h'), v = xh.querySelector('.xh-v'), b = xh.querySelector('.xh-box');
    let target = null;
    const place = () => {
      if (!target) return;
      const r = target.getBoundingClientRect(), pad = 6;
      snap.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
      snap.style.width = (r.width + pad * 2) + 'px';
      snap.style.height = (r.height + pad * 2) + 'px';
    };
    addEventListener('mousemove', e => {
      h.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      v.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    addEventListener('scroll', place, { passive: true });
    document.querySelectorAll('a, button, .who-card, .quote, .plan, .faq-i summary').forEach(el => {
      el.addEventListener('mouseenter', () => {
        target = el;
        const kind = el.matches('a, button') ? (el.matches('.btn, button') ? 'SELECT' : 'LINK') : 'OBJECT';
        const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
        tag.textContent = `${kind} · ${label}`;
        place();
        document.body.classList.add('snapping');
      });
      el.addEventListener('mouseleave', () => { target = null; document.body.classList.remove('snapping'); });
    });
  }

  // ---------- hero product walkthrough ----------
  if (document.getElementById('productFrame')) {
  // Coordinates are pixels on app-symbol-count.webp (1560 × 1209).
  const IMG = { w: 1560, h: 1209 }, UI = { x: 85, y: 103, w: 1375, h: 1002 };
  const regions = [
    { x: 1237, y: 200, w: 215, h: 400 },   // AI auto-detect + legend counts
    { x: 352, y: 283, w: 858, h: 615 },    // drawing canvas
    { x: 1240, y: 815, w: 212, h: 230 }    // unsaved edits + commit
  ];
  const symbols = [[550,477],[608,477],[665,477],[884,427],[883,524],[537,535],[646,546],[776,580],[816,580],[873,580],[970,580],
    [560,613],[651,613],[651,641],[762,635],[560,686],[651,686],[762,693],[850,691],[819,720],[840,734],[926,672],[1028,734],
    [560,757],[651,757],[711,759],[762,767],[934,788],[997,655],[831,580],[651,657]];
  const frame = document.getElementById('productFrame');
  const spot = frame.querySelector('.spot'), dets = frame.querySelector('.dets'), scanEl = frame.querySelector('.scanline');
  const steps = [...frame.querySelectorAll('.callout')];
  const pct = (v, total) => (v / total * 100) + '%';
  symbols.sort((a, b) => a[0] - b[0]).forEach(([x, y]) => {
    const d = document.createElement('i');
    d.style.left = pct(x, IMG.w); d.style.top = pct(y, IMG.h);
    dets.appendChild(d);
  });
  const detEls = [...dets.children];
  let step = -1, auto = true, timer, scanRaf;

  function scan() {
    cancelAnimationFrame(scanRaf);
    detEls.forEach(d => d.classList.remove('on'));
    const x0 = 400, x1 = 1145, t0 = performance.now(), dur = reduce ? 1 : 1800;
    frame.classList.add('scanning');
    (function f(t) {
      const p = Math.min(1, (t - t0) / dur), x = x0 + (x1 - x0) * p;
      scanEl.style.left = pct(x, IMG.w);
      detEls.forEach((d, i) => { if (symbols[i][0] <= x) d.classList.add('on'); });
      if (p < 1) scanRaf = requestAnimationFrame(f); else frame.classList.remove('scanning');
    })(t0);
  }
  function setStep(i) {
    if (i === step) return;
    step = i;
    const r = regions[i];
    spot.style.left = pct(r.x - UI.x, UI.w); spot.style.top = pct(r.y - UI.y, UI.h);
    spot.style.width = pct(r.w, UI.w); spot.style.height = pct(r.h, UI.h);
    steps.forEach((b, j) => b.setAttribute('aria-pressed', i === j));
    frame.dataset.step = i;
    if (i === 1) scan(); else { cancelAnimationFrame(scanRaf); frame.classList.remove('scanning'); }
  }
  function cycle() { clearTimeout(timer); if (!auto) return; timer = setTimeout(() => { setStep((step + 1) % 3); cycle(); }, step === 1 ? 4600 : 3600); }
  steps.forEach((b, i) => {
    b.addEventListener('click', () => { auto = false; clearTimeout(timer); step = -1; setStep(i); });
    b.addEventListener('mouseenter', () => { if (auto) { clearTimeout(timer); setStep(i); } });
    b.addEventListener('mouseleave', () => cycle());
  });
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { frame.classList.add('live'); if (step < 0) setStep(0); cycle(); }
    else clearTimeout(timer);
  }, { threshold: .4 }).observe(frame);

  // subtle 3D tilt + parallax callouts
  if (!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, tiltRaf = 0;
    const tick = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      frame.style.setProperty('--rx', (-cy * 4).toFixed(3) + 'deg');
      frame.style.setProperty('--ry', (cx * 5).toFixed(3) + 'deg');
      frame.style.setProperty('--px', (cx * 14).toFixed(2) + 'px');
      frame.style.setProperty('--py', (cy * 10).toFixed(2) + 'px');
      tiltRaf = (Math.abs(tx - cx) + Math.abs(ty - cy) > .001) ? requestAnimationFrame(tick) : 0;
    };
    frame.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(tick);
    });
    frame.addEventListener('pointerleave', () => { tx = ty = 0; if (!tiltRaf) tiltRaf = requestAnimationFrame(tick); });
  }

  }
  // ---------- drawing → as-built reveal ----------
  if (document.getElementById('rb')) {
  const rb = document.getElementById('rb');
  let rbHover = false, rbManual = null;
  const setP = v => {
    v = Math.max(4, Math.min(96, v));
    rb.style.setProperty('--p', v + '%');
    rb.setAttribute('aria-valuenow', Math.round(v));
  };
  const fromScroll = () => {
    if (rbHover || rbManual !== null) return;
    const r = rb.getBoundingClientRect();
    const t = 1 - (r.top + r.height / 2) / innerHeight;   // 0 entering bottom → 1 leaving top
    setP(15 + Math.max(0, Math.min(1, (t - .15) / .7)) * 70);
  };
  addEventListener('scroll', fromScroll, { passive: true });
  fromScroll();
  rb.addEventListener('pointermove', e => {
    rbHover = true;
    const r = rb.getBoundingClientRect();
    setP((e.clientX - r.left) / r.width * 100);
  });
  rb.addEventListener('pointerleave', () => { rbHover = false; rbManual = null; fromScroll(); });
  rb.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    rbManual = (rbManual ?? +rb.getAttribute('aria-valuenow')) + (e.key === 'ArrowRight' ? 5 : -5);
    setP(rbManual);
  });

  }
  // ---------- status bar: current sheet + scroll progress ----------
  const sbRef = document.getElementById('sbRef'), sbName = document.getElementById('sbName');
  const sbBar = document.querySelector('.sb-progress');
  const sheets = [...document.querySelectorAll('main > section')].map(sec => {
    const eb = sec.querySelector('.eyebrow');
    if (sec.classList.contains('hero')) return { sec, ref: 'Q-001', name: 'Overview' };
    if (sec.id === 'book') return { sec, ref: 'Q-002', name: 'Book a demo' };
    if (!eb) return null;
    const ref = eb.querySelector('.ref').textContent;
    return { sec, ref, name: eb.textContent.replace(ref, '').trim() };
  }).filter(Boolean);
  const sheetIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sh = sheets.find(x => x.sec === e.target);
    sbRef.textContent = sh.ref; sbName.textContent = sh.name;
  }), { rootMargin: '-45% 0px -50% 0px' });
  sheets.forEach(x => sheetIO.observe(x.sec));
  const prog = () => { const h = document.documentElement; sbBar.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - innerHeight)})`; };
  addEventListener('scroll', prog, { passive: true }); prog();

  // ---------- customer stories slider ----------
  if (document.getElementById('stories-track')) {
  const track = document.getElementById('stories-track');
  const slides = [...track.children];
  const slPrev = document.getElementById('slPrev'), slNext = document.getElementById('slNext');
  const slNowEl = document.getElementById('slNow'), slBar = document.getElementById('slBar');
  const slStep = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  const perView = () => Math.max(1, Math.round(track.clientWidth / slStep()));
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const i = Math.round(track.scrollLeft / slStep());
    slNowEl.textContent = String(i + 1).padStart(2, '0');
    const pv = Math.min(perView(), slides.length);
    slBar.style.width = (pv / slides.length * 100) + '%';
    slBar.style.left = (Math.min(i, slides.length - pv) / slides.length * 100) + '%';
    slPrev.disabled = track.scrollLeft <= 2;
    slNext.disabled = track.scrollLeft >= max - 2;
  };
  let slTarget = 0;
  const go = d => {
    const last = slides.length - Math.min(perView(), slides.length);
    slTarget = Math.max(0, Math.min(last, Math.round(track.scrollLeft / slStep()) + d));
    track.scrollTo({ left: slTarget * slStep(), behavior: reduce ? 'auto' : 'smooth' });
  };
  slPrev.addEventListener('click', () => go(-1));
  slNext.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); slNext.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); slPrev.click(); }
  });
  // mouse drag (touch and trackpads scroll natively)
  let dragX = null, startLeft = 0;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    dragX = e.clientX; startLeft = track.scrollLeft; track.classList.add('dragging');
  });
  addEventListener('pointermove', e => { if (dragX !== null) track.scrollLeft = startLeft - (e.clientX - dragX); });
  addEventListener('pointerup', () => {
    if (dragX === null) return;
    dragX = null; track.classList.remove('dragging');
    track.scrollTo({ left: Math.round(track.scrollLeft / slStep()) * slStep(), behavior: 'smooth' });
  });
  addEventListener('resize', sync);
  sync();

  }
  // ---------- pricing: monthly / annual ----------
  document.querySelectorAll('.bill button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.bill button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    document.querySelectorAll('.price .amt').forEach(el => { el.textContent = Number(el.dataset[b.dataset.bill]).toLocaleString('en-US'); });
  }));

  // ---------- booking: calendar / request-a-call ----------
  const tabCal = document.getElementById('tab-cal'), tabForm = document.getElementById('tab-form');
  const panelCal = document.getElementById('panel-cal'), panelForm = document.getElementById('panel-form');
  let calLoaded = false;
  function loadCal() {
    if (calLoaded) return; calLoaded = true;
    // Cal.com inline embed (same event as optiify.ai/book-demo for now)
    (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
    Cal('init', '30min', { origin: 'https://app.cal.com' });
    Cal.ns['30min']('inline', { elementOrSelector: '#cal-inline', config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }, calLink: 'optiify/30min' });
    Cal.ns['30min']('ui', { cssVarsPerTheme: { light: { 'cal-brand': '#2664f5' } }, hideEventTypeDetails: false, layout: 'month_view' });
  }
  function showBook(which) {
    const cal = which === 'cal';
    tabCal.setAttribute('aria-selected', cal); tabForm.setAttribute('aria-selected', !cal);
    panelCal.hidden = !cal; panelForm.hidden = cal;
    if (cal) loadCal();
  }
  tabCal.addEventListener('click', () => showBook('cal'));
  tabForm.addEventListener('click', () => showBook('form'));
  [tabCal, tabForm].forEach(t => t.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const o = t === tabCal ? tabForm : tabCal; o.focus(); o.click(); }
  }));
  // Load the calendar shortly before the section scrolls into view
  new IntersectionObserver((es, ob) => { if (es[0].isIntersecting && !panelCal.hidden) { loadCal(); ob.disconnect(); } }, { rootMargin: '600px 0px' })
    .observe(document.getElementById('book'));

  // Request-a-call form. Without an endpoint it falls back to a pre-filled email.
  const form = document.getElementById('leadForm'), status = document.getElementById('formStatus'), done = document.getElementById('formDone');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').trim(), email = (fd.get('email') || '').trim();
    form.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    const bad = [];
    if (!name) bad.push(form.elements.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(form.elements.email);
    if (bad.length) {
      bad.forEach(x => x.setAttribute('aria-invalid', 'true'));
      status.textContent = 'Please add your name and a valid work email.';
      bad[0].focus(); return;
    }
    const trades = fd.getAll('trades').join(', ');
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      status.textContent = 'Sending…';
      try {
        const r = await fetch(endpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(r.status);
        form.hidden = true; done.hidden = false; done.focus();
      } catch { status.textContent = 'Something went wrong. Please email info@quantiify.ai.'; }
      return;
    }
    const body = [
      `Name: ${name}`, `Work email: ${email}`, `Company: ${fd.get('company') || '-'}`, `Phone: ${fd.get('phone') || '-'}`,
      `Trades: ${trades || '-'}`, '', fd.get('message') || ''
    ].join('\n');
    location.href = `mailto:info@quantiify.ai?subject=${encodeURIComponent('Quantiify demo request: ' + name)}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app to send the request…';
  });

  // ---------- trades ----------
  if (document.getElementById('tradeRows')) {
  const T = [
    { t: 'Electrification', slug: 'electrification', img: 'trade-electrification', p: 'Lighting, switches, sockets, MDB and SDB, circuits, cables, LPS, wiring and conduiting, HT/LT systems and solar installations.', s: 'E-101', c: '#ffd84d',
      r: [['Lighting fixture', 'E-LITE', '148', 'NOS'], ['Switch / socket outlet', 'E-POWR', '212', 'NOS'], ['Distribution board (SDB)', 'E-PANL', '6', 'NOS'], ['PVC conduit 25 mm', 'E-COND', '1,284', 'M'], ['Cable 4C × 16 mm²', 'E-CABL', '386', 'M']] },
    { t: 'Sanitary & plumbing', slug: 'sanitary-plumbing', img: 'trade-plumbing', p: 'Fixtures, fittings, ETP and STP, rainwater harvesting, wastewater treatment systems, drainage networks and water supply.', s: 'P-201', c: '#4dd3ff',
      r: [['Water closet', 'P-FIXT', '48', 'NOS'], ['Wash basin', 'P-FIXT', '52', 'NOS'], ['uPVC drain pipe 110 mm', 'P-DRNG', '920', 'M'], ['PPR supply pipe 25 mm', 'P-WATR', '1,460', 'M'], ['Inspection chamber', 'P-DRNG', '14', 'NOS']] },
    { t: 'Electromechanical', slug: 'electromechanical', img: 'trade-electromechanical', p: 'HVAC systems, fire detection and protection, security and surveillance, integrated building management (IBMS), ventilation and utilities.', s: 'M-301', c: '#4dd88a',
      r: [['Supply air diffuser', 'M-HVAC', '132', 'NOS'], ['GI duct', 'M-DUCT', '2,150', 'M'], ['Smoke detector', 'F-ALRM', '186', 'NOS'], ['Sprinkler head', 'F-SPRK', '412', 'NOS'], ['CCTV camera', 'S-CCTV', '38', 'NOS']] },
    { t: 'Structural & finishing', slug: 'structural-finishing', img: 'trade-structural', p: 'Sub-structure and super-structure elements: foundations, columns, beams and slabs, plus architectural finishes.', s: 'S-401', c: '#ff4d4d',
      r: [['Isolated footing', 'S-FNDN', '36', 'NOS'], ['RCC column', 'S-COLS', '84', 'NOS'], ['RCC beam', 'S-BEAM', '1,120', 'M'], ['RCC slab 150 mm', 'S-SLAB', '2,860', 'M²'], ['Floor tile finish', 'A-FLOR', '2,410', 'M²']] }
  ];
  const tabs = document.querySelectorAll('.tabs button');
  function showTrade(i) {
    const d = T[i];
    tabs.forEach((b, j) => b.setAttribute('aria-selected', i === j));
    const im = document.getElementById('tradeImg');
    im.src = `assets/product/${d.img}.webp`; im.alt = d.t;
    const tl = document.getElementById('tradeLink');
    tl.href = `projects/${d.slug}.html`; tl.innerHTML = `Explore ${d.t} &rarr;`;
    document.getElementById('tradeTitle').textContent = d.t;
    document.getElementById('tradeText').textContent = d.p;
    document.getElementById('tradeSheet').textContent = 'SHEET ' + d.s;
    document.getElementById('tradeRows').innerHTML = d.r.map((r, k) =>
      `<tr class="new"><td style="animation-delay:${k * 60}ms">${r[0]}</td><td class="l" style="animation-delay:${k * 60}ms"><i style="--c:${d.c}"></i>${r[1]}</td><td class="r" style="animation-delay:${k * 60}ms">${r[2]}</td><td class="r u" style="animation-delay:${k * 60}ms">${r[3]}</td></tr>`).join('');
  }
  tabs.forEach(b => b.addEventListener('click', () => showTrade(+b.dataset.tab)));
  showTrade(0);

  }
  // ---------- counters + reveal ----------
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const n = e.target;
    io.unobserve(n);
    if (n.classList.contains('num')) {
      const to = +n.dataset.to, pre = n.dataset.prefix || '', suf = n.dataset.suffix || '', t0 = performance.now(), dur = reduce ? 1 : 1400;
      (function f(t) {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        n.textContent = pre + v + suf;
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    } else n.classList.add('in');
  }), { threshold: .2 });
  document.querySelectorAll('.num,.reveal').forEach(n => io.observe(n));
})();
