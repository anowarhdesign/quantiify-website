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

  // ---------- crosshair + status bar coords ----------
  const xh = document.querySelector('.xhair');
  const coords = document.getElementById('coords');
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    document.body.classList.add('cad');
    const h = xh.querySelector('.xh-h'), v = xh.querySelector('.xh-v'), b = xh.querySelector('.xh-box');
    addEventListener('mousemove', e => {
      h.style.top = e.clientY + 'px';
      v.style.left = e.clientX + 'px';
      b.style.left = e.clientX + 'px'; b.style.top = e.clientY + 'px';
      const X = (e.clientX / 8).toFixed(2), Y = ((document.documentElement.scrollHeight - e.pageY) / 8).toFixed(2);
      coords.textContent = `X ${X}   Y ${Y}   Z 0.00`;
    });
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => xh.style.opacity = '.35');
      el.addEventListener('mouseleave', () => xh.style.opacity = '1');
    });
  }

  // ---------- floor plan ----------
  const svg = document.getElementById('plan');
  const el = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n); return n;
  };
  const defs = el('defs', {});
  const g = el('linearGradient', { id: 'scanGrad', x1: 0, x2: 1 }, defs);
  el('stop', { offset: 0, 'stop-color': '#8fc2fa', 'stop-opacity': 0 }, g);
  el('stop', { offset: 1, 'stop-color': '#8fc2fa', 'stop-opacity': .35 }, g);

  // walls
  el('rect', { x: 40, y: 30, width: 720, height: 380, class: 'wall' });
  [
    'M470 30V200', 'M470 200H560 M600 200H760', 'M40 270H330 M370 270H760',
    'M280 270V410', 'M540 270V330 M540 370V410', 'M470 200V270'
  ].forEach(d => el('path', { d, class: 'iwall' }));
  // doors (leaf + swing)
  [['M560 200V160', 'M560 160A40 40 0 0 1 600 200'],
   ['M330 270V310', 'M330 310A40 40 0 0 0 370 270'],
   ['M540 330H580', 'M580 330A40 40 0 0 1 540 370'],
   ['M200 410V375', 'M200 375A35 35 0 0 1 235 410']
  ].forEach(([a, b]) => { el('path', { d: a, class: 'door' }); el('path', { d: b, class: 'door', 'stroke-dasharray': '3 3' }); });
  // dimensions
  el('path', { d: 'M40 14H760 M40 8V20 M760 8V20', class: 'dimln' });
  el('text', { x: 400, y: 11, 'text-anchor': 'middle', class: 'dimt' }).textContent = "72'-0\"";
  el('path', { d: 'M24 30V410 M18 30H30 M18 410H30', class: 'dimln' });
  const lt = el('text', { x: 20, y: 220, 'text-anchor': 'middle', class: 'dimt', transform: 'rotate(-90 20 220)' }); lt.textContent = "38'-0\"";
  // room tags
  [['OPEN OFFICE 101', 255, 250], ['CONF 102', 690, 188], ['CORRIDOR', 615, 258], ['OFFICE 104', 160, 400], ['STOR 105', 410, 400], ['IT 106', 650, 400]]
    .forEach(([t, x, y]) => { el('text', { x, y, 'text-anchor': 'middle', class: 'room' }).textContent = t; });

  const syms = [];
  const lite = [];
  [100, 180, 260, 340, 420].forEach(x => [70, 135, 200].forEach(y => lite.push([x, y])));
  [520, 615, 710].forEach(x => [70, 135].forEach(y => lite.push([x, y])));
  [520, 615, 710].forEach(x => lite.push([x, 232]));
  [[110, 310], [210, 310], [110, 360], [210, 360], [350, 320], [470, 320], [600, 310], [700, 310], [600, 360], [700, 360]].forEach(p => lite.push(p));
  lite.forEach(([x, y]) => {
    const s = el('g', { class: 'sym' });
    el('circle', { cx: x, cy: y, r: 7 }, s);
    el('path', { d: `M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}` }, s);
    syms.push({ x, y, k: 'lite' });
  });
  const powr = [[48, 100], [48, 180], [48, 240], [140, 38], [380, 38], [462, 120], [478, 90], [752, 110], [640, 192], [48, 330], [272, 340], [288, 390], [532, 300], [548, 395], [752, 330], [752, 390]];
  powr.forEach(([x, y]) => {
    const s = el('g', { class: 'sym p' });
    el('circle', { cx: x, cy: y, r: 4.5 }, s);
    const v = x < 60 || x > 740 || (x > 260 && x < 560 && y > 280) || (x > 455 && x < 490);
    el('path', { d: v ? `M${x - 2} ${y - 8}V${y + 8}M${x + 2} ${y - 8}V${y + 8}` : `M${x - 8} ${y - 2}H${x + 8}M${x - 8} ${y + 2}H${x + 8}` }, s);
    syms.push({ x, y, k: 'powr' });
  });
  const data = [[48, 140], [220, 38], [300, 38], [462, 60], [700, 38], [48, 300], [272, 310], [752, 300]];
  data.forEach(([x, y]) => {
    const s = el('g', { class: 'sym d' });
    el('path', { d: `M${x} ${y - 6}L${x + 6} ${y + 5}H${x - 6}Z` }, s);
    syms.push({ x, y, k: 'data' });
  });
  [[580, 180], [350, 290], [560, 350], [218, 392]].forEach(([x, y]) => syms.push({ x, y, k: 'door', w: 44 }));

  const scan = el('rect', { x: -120, y: 30, width: 120, height: 380, class: 'scan' });
  const dets = syms.map(s => {
    const w = s.w || 22;
    return Object.assign(el('rect', { x: s.x - w / 2, y: s.y - w / 2, width: w, height: w, rx: 2, class: 'det' }), { k: s.k, cx: s.x });
  });
  // sort detections left → right to follow the scan line
  dets.sort((a, b) => a.cx - b.cx);

  const countEls = {};
  document.querySelectorAll('[data-count]').forEach(n => countEls[n.dataset.count] = n);
  const totalEl = document.getElementById('vpTotal'), barEl = document.getElementById('vpBar');
  const cmdEl = document.getElementById('cmdText');

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  async function type(text, speed = 28) {
    cmdEl.textContent = '';
    for (const ch of text) { cmdEl.textContent += ch; await sleep(reduce ? 0 : speed); }
  }

  let running = false;
  async function runTakeoff() {
    if (running) return; running = true;
    const c = { lite: 0, powr: 0, data: 0, door: 0 };
    dets.forEach(d => d.classList.remove('on'));
    Object.values(countEls).forEach(n => n.textContent = '0');
    totalEl.textContent = '0'; barEl.style.width = '0%';
    scan.setAttribute('x', -120);

    await type('QTAKEOFF');
    await sleep(500);
    await type('Select sheets: E-101 Lighting Plan · 1 sheet selected');
    await sleep(600);
    await type('Detecting symbols on 5 layers…');

    const start = performance.now(), dur = reduce ? 1 : 3200;
    let i = 0;
    await new Promise(done => {
      (function frame(t) {
        const p = Math.min(1, (t - start) / dur);
        const sx = 40 + p * 740;
        scan.setAttribute('x', sx - 120);
        while (i < dets.length && dets[i].cx <= sx) {
          const d = dets[i++]; d.classList.add('on');
          c[d.k]++; countEls[d.k].textContent = c[d.k];
          totalEl.textContent = i; barEl.style.width = (i / dets.length * 100) + '%';
        }
        p < 1 ? requestAnimationFrame(frame) : done();
      })(start);
    });
    scan.setAttribute('x', -120);
    await type(`${dets.length} objects counted · ${c.lite} fixtures, ${c.powr} receptacles, ${c.data} data, ${c.door} doors · ready for review`, 18);
    await sleep(3200);
    await type('EXPORT  BOQ → Estimate_E-101.xlsx ✓');
    await sleep(2600);
    running = false;
  }

  const vp = document.querySelector('.viewport');
  let loop;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      runTakeoff();
      if (!reduce && !loop) loop = setInterval(() => runTakeoff(), 16000);
    } else if (loop) { clearInterval(loop); loop = null; }
  }, { threshold: .35 }).observe(vp);

  // ---------- trades ----------
  const T = [
    { t: 'Electrical, symbol to cable', p: 'Count fixtures, devices and panels straight from the legend, then measure conduit and cable runs across every sheet in the set.', u: 'electrical', s: 'E-101', c: '#ffd84d',
      r: [['LED downlight 2×2', 'E-LITE', '148', 'EA'], ['Duplex receptacle', 'E-POWR', '212', 'EA'], ['Data outlet', 'E-DATA', '96', 'EA'], ['Panelboard', 'E-POWR', '6', 'EA'], ['EMT conduit ¾"', 'E-COND', '1,284', 'LF']] },
    { t: 'Architectural, space by space', p: 'Measure rooms, partitions, finishes and openings, so areas, lengths and element counts are ready for pricing.', u: 'architectural', s: 'A-201', c: '#4dd3ff',
      r: [['Gypsum partition', 'A-WALL', '3,420', 'LF'], ['Carpet tile', 'A-FLOR', '18,600', 'SF'], ['Door, single leaf', 'A-DOOR', '64', 'EA'], ['Storefront window', 'A-GLAZ', '42', 'EA'], ['Ceiling, ACT 2×2', 'A-CLNG', '15,900', 'SF']] },
    { t: 'Mechanical, duct to rooftop', p: 'Pick up HVAC components, duct runs and rooftop equipment, and keep them tied to the sheets they came from.', u: 'mechanical', s: 'M-301', c: '#4dd88a',
      r: [['Supply diffuser', 'M-HVAC', '132', 'EA'], ['Return grille', 'M-HVAC', '74', 'EA'], ['Rectangular duct', 'M-DUCT', '2,150', 'LF'], ['VAV box', 'M-EQPM', '28', 'EA'], ['Rooftop unit', 'M-EQPM', '4', 'EA']] },
    { t: 'Civil, site and infrastructure', p: 'Quantify pipe runs, structures, paving and curbs across site plans for infrastructure and sitework bids.', u: 'civil', s: 'C-401', c: '#ff4d4d',
      r: [['Storm pipe 18" RCP', 'C-STRM', '1,860', 'LF'], ['Catch basin', 'C-STRM', '22', 'EA'], ['Asphalt paving', 'C-PAVE', '42,300', 'SF'], ['Concrete curb', 'C-CURB', '3,140', 'LF'], ['Sanitary manhole', 'C-SSWR', '9', 'EA']] }
  ];
  const tabs = document.querySelectorAll('.tabs button');
  function showTrade(i) {
    const d = T[i];
    tabs.forEach((b, j) => b.setAttribute('aria-selected', i === j));
    document.getElementById('tradeTitle').textContent = d.t;
    document.getElementById('tradeText').textContent = d.p;
    document.getElementById('tradeLink').href = `https://quantiify.ai/solutions/${d.u}/`;
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
      const to = +n.dataset.to, suf = n.dataset.suffix || '', t0 = performance.now(), dur = reduce ? 1 : 1400;
      (function f(t) {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        n.textContent = v + suf;
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    } else n.classList.add('in');
  }), { threshold: .2 });
  document.querySelectorAll('.num,.reveal').forEach(n => io.observe(n));
})();
