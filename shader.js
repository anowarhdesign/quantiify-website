// AutoCAD-style model-space backgrounds (WebGL2): a procedural floor plan whose rooms
// fill with standard hatch patterns, and a HATCH preview under the cursor.
// Falls back to the CSS background.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const vert = `#version 300 es
  in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

  const frag = `#version 300 es
  precision highp float;
  uniform vec2 res; uniform float t; uniform vec2 mouse; uniform float dark; uniform float S;
  out vec4 o;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // Procedural floor plan: blocks of 9 × 6 units, each split three times into rooms.
  const vec2 B = vec2(9., 6.);
  void room(vec2 w, out vec2 cell, out vec2 lo, out vec2 hi){
    cell = floor(w / B);
    vec2 lp = w - cell * B;
    lo = vec2(0.); hi = B;
    vec2 seed = cell;
    for (int i = 0; i < 3; i++){
      vec2 sz = hi - lo;
      if (min(sz.x, sz.y) < 2.2) break;
      float r = hash(seed + float(i) * 7.13);
      bool sx = sz.x > sz.y * (.75 + .5 * hash(seed + 3.3));
      if (sx){ float s = floor(mix(lo.x, hi.x, .3 + .4 * r) * 2.) / 2.;
        if (lp.x < s){ hi.x = s; seed += vec2(1.3, .7); } else { lo.x = s; seed += vec2(2.9, 1.1); } }
      else   { float s = floor(mix(lo.y, hi.y, .3 + .4 * r) * 2.) / 2.;
        if (lp.y < s){ hi.y = s; seed += vec2(.5, 3.1); } else { lo.y = s; seed += vec2(4.2, .3); } }
    }
  }
  float lineAA(float v, float wpx){ float f = fwidth(v); float d = abs(fract(v + .5) - .5) / f; return 1. - smoothstep(wpx * .5, wpx * .5 + 1., d); }

  // AutoCAD hatch patterns (in world units)
  float hatch(int k, vec2 w){
    if (k == 0) return lineAA((w.x + w.y) * 2.2, 1.);                                  // ANSI31
    if (k == 1) return max(lineAA((w.x + w.y) * 1.6, 1.), lineAA((w.x - w.y) * 1.6, 1.)); // ANSI37
    if (k == 2){ vec2 g = fract(w * 3.) - .5; float r = length(g) / fwidth(w.x * 3.); return 1. - smoothstep(1., 2., r); } // AR-CONC dots
    if (k == 3){ float row = floor(w.y * 3.); float h = lineAA(w.y * 3., 1.);               // AR-BRSTD brick
      float v = lineAA(w.x * 1.5 + .5 * mod(row, 2.), 1.); return max(h, v * step(.08, fract(w.y * 3.)) * step(fract(w.y * 3.), .92)); }
    return 0.;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / res;
    vec2 m0 = mouse.x > -9000. ? (mouse - .5 * res) / S : vec2(0.);
    vec2 pan = vec2(t * .055, t * .022) - m0 * .35;      // drift + parallax toward the cursor
    vec2 w = (gl_FragCoord.xy - .5 * res) / S + pan;
    vec2 wm = (mouse - .5 * res) / S + pan;

    vec2 cell, lo, hi; room(w, cell, lo, hi);
    vec2 mc, mlo, mhi; room(wm, mc, mlo, mhi);
    vec2 lp = w - cell * B;
    float px = 1. / S;                                     // one pixel in world units

    float dRoom = min(min(lp.x - lo.x, hi.x - lp.x), min(lp.y - lo.y, hi.y - lp.y)) / px;
    float dBlock = min(min(lp.x, B.x - lp.x), min(lp.y, B.y - lp.y)) / px;
    float wall = 1. - smoothstep(.6, 1.6, dRoom);
    float ext = 1. - smoothstep(1.4, 2.6, dBlock);

    float id = hash(cell * 13.1 + lo * 3.7 + hi * 1.9);
    int k = int(floor(id * 5.));                             // 4 = empty room
    float phase = fract(id * 7.3);
    float vis = smoothstep(.3, 1., sin(t * .16 + phase * 6.2832) * .5 + .5);
    float hv = hatch(k, w) * vis;
    float inset = smoothstep(2., 5., dRoom);                // keep hatch off the walls
    hv *= inset;

    bool hover = all(equal(cell, mc)) && all(equal(lo, mlo)) && all(equal(hi, mhi)) && mouse.x > -9000.;
    float hp = hover ? hatch(0, w) * inset : 0.;            // HATCH preview under the cursor

    float edge = smoothstep(.12, .7, length((uv - .5) * vec2(1.3, 1.)));
    float a = .18 + .82 * edge;

    vec3 col;
    if (dark > .5){
      col = vec3(.043, .071, .125);                          // section navy
      col = mix(col, vec3(.56, .76, .98), hv * .05 * a);
      col = mix(col, vec3(.56, .76, .98), max(wall * .04, ext * .07) * a);
      if (hover){ col = mix(col, vec3(.15, .39, .96), .08); col = mix(col, vec3(.56, .76, .98), hp * .14 + wall * .22); }
    } else {
      col = vec3(.984, .992, 1.);
      col = mix(col, vec3(.886, .925, 1.), .5 * smoothstep(.85, 0., length(uv - vec2(.15 + .05 * sin(t * .07), .85))));
      col = mix(col, vec3(.56, .76, .98), hv * .11 * a);
      col = mix(col, vec3(.2, .25, .37), max(wall * .05, ext * .09) * a);
      if (hover){ col = mix(col, vec3(.89, .93, 1.), .45); col = mix(col, vec3(.15, .39, .96), hp * .16 + wall * .3); }
    }
    o = vec4(col, 1.);
  }`;

  document.querySelectorAll('canvas.shader').forEach(cv => {
    const gl = cv.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl) { cv.remove(); return; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.remove(); return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = n => gl.getUniformLocation(prog, n);
    const uRes = U('res'), uT = U('t'), uMouse = U('mouse'), uDark = U('dark'), uS = U('S');
    gl.uniform1f(uDark, cv.dataset.shader === 'dark' ? 1 : 0);

    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    function size() {
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
    }
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) * dpr; mouse.ty = (r.bottom - e.clientY) * dpr;
      if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    });

    let visible = false, raf = 0;
    const t0 = performance.now();
    function draw(now) {
      mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uS, 46 * dpr);
      gl.uniform1f(uT, reduce ? 12 : (now - t0) / 1000 + 12);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    }
    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(draw);
    }).observe(cv);
    cv.classList.add('on');
  });
})();
