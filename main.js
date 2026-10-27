(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  document.getElementById('yr').textContent = new Date().getFullYear();

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

  // ---------- crosshair + status bar coords + OSNAP-style hover ----------
  const xh = document.querySelector('.xhair');
  const snap = document.querySelector('.snap'), tag = snap.querySelector('.snap-tag');
  const coords = document.getElementById('coords');
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
      const X = (e.clientX / 8).toFixed(2), Y = ((document.documentElement.scrollHeight - e.pageY) / 8).toFixed(2);
      coords.textContent = `X ${X}   Y ${Y}   Z 0.00`;
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
