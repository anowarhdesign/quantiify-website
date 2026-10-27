(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  document.getElementById('yr').textContent = new Date().getFullYear();
  // Booth-screen mode (?booth): show the QR code so visitors can book from their phones
  if (new URLSearchParams(location.search).has('booth')) {
    document.querySelector('.qr').hidden = false;
    document.querySelector('.cta .lede').textContent = 'Stop by for a live run on your own sheets, or scan to book a call with the team.';
  }

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
    document.querySelectorAll('a, button, .who-card, .quote, .duo-card').forEach(el => {
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

  // ---------- drawing → as-built reveal ----------
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

  // ---------- status bar: current sheet + scroll progress ----------
  const sbRef = document.getElementById('sbRef'), sbName = document.getElementById('sbName');
  const sbBar = document.querySelector('.sb-progress');
  const sheets = [...document.querySelectorAll('main > section')].map(sec => {
    const eb = sec.querySelector('.eyebrow');
    if (sec.classList.contains('hero')) return { sec, ref: 'Q-001', name: 'Overview' };
    if (sec.classList.contains('cta')) return { sec, ref: 'Q-002', name: 'At the booth' };
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

  // ---------- trades ----------
  const T = [
    { t: 'Electrification', img: 'trade-electrification', p: 'Lighting, switches, sockets, MDB and SDB, circuits, cables, LPS, wiring and conduiting, HT/LT systems and solar installations.', s: 'E-101', c: '#ffd84d',
      r: [['Lighting fixture', 'E-LITE', '148', 'NOS'], ['Switch / socket outlet', 'E-POWR', '212', 'NOS'], ['Distribution board (SDB)', 'E-PANL', '6', 'NOS'], ['PVC conduit 25 mm', 'E-COND', '1,284', 'M'], ['Cable 4C × 16 mm²', 'E-CABL', '386', 'M']] },
    { t: 'Sanitary & plumbing', img: 'trade-plumbing', p: 'Fixtures, fittings, ETP and STP, rainwater harvesting, wastewater treatment systems, drainage networks and water supply.', s: 'P-201', c: '#4dd3ff',
      r: [['Water closet', 'P-FIXT', '48', 'NOS'], ['Wash basin', 'P-FIXT', '52', 'NOS'], ['uPVC drain pipe 110 mm', 'P-DRNG', '920', 'M'], ['PPR supply pipe 25 mm', 'P-WATR', '1,460', 'M'], ['Inspection chamber', 'P-DRNG', '14', 'NOS']] },
    { t: 'Electromechanical', img: 'trade-electromechanical', p: 'HVAC systems, fire detection and protection, security and surveillance, integrated building management (IBMS), ventilation and utilities.', s: 'M-301', c: '#4dd88a',
      r: [['Supply air diffuser', 'M-HVAC', '132', 'NOS'], ['GI duct', 'M-DUCT', '2,150', 'M'], ['Smoke detector', 'F-ALRM', '186', 'NOS'], ['Sprinkler head', 'F-SPRK', '412', 'NOS'], ['CCTV camera', 'S-CCTV', '38', 'NOS']] },
    { t: 'Structural & finishing', img: 'trade-structural', p: 'Sub-structure and super-structure elements: foundations, columns, beams and slabs, plus architectural finishes.', s: 'S-401', c: '#ff4d4d',
      r: [['Isolated footing', 'S-FNDN', '36', 'NOS'], ['RCC column', 'S-COLS', '84', 'NOS'], ['RCC beam', 'S-BEAM', '1,120', 'M'], ['RCC slab 150 mm', 'S-SLAB', '2,860', 'M²'], ['Floor tile finish', 'A-FLOR', '2,410', 'M²']] }
  ];
  const tabs = document.querySelectorAll('.tabs button');
  function showTrade(i) {
    const d = T[i];
    tabs.forEach((b, j) => b.setAttribute('aria-selected', i === j));
    const im = document.getElementById('tradeImg');
    im.src = `assets/product/${d.img}.webp`; im.alt = d.t;
    document.getElementById('tradeTitle').textContent = d.t;
    document.getElementById('tradeText').textContent = d.p;
    document.getElementById('tradeSheet').textContent = 'SHEET ' + d.s;
    document.getElementById('tradeRows').innerHTML = d.r.map((r, k) =>
      `<tr class="new"><td style="animation-delay:${k * 60}ms">${r[0]}</td><td class="l" style="animation-delay:${k * 60}ms"><i style="--c:${d.c}"></i>${r[1]}</td><td class="r" style="animation-delay:${k * 60}ms">${r[2]}</td><td class="r u" style="animation-delay:${k * 60}ms">${r[3]}</td></tr>`).join('');
  }
  tabs.forEach(b => b.addEventListener('click', () => showTrade(+b.dataset.tab)));
  showTrade(0);

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
