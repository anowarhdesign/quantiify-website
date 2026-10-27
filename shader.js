// Topographic contour-line backgrounds (WebGL2). Falls back to the CSS background.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const vert = `#version 300 es
  in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

  const frag = `#version 300 es
  precision highp float;
  uniform vec2 res; uniform float t; uniform vec2 mouse; uniform float dark;
  out vec4 o;

  vec2 h2(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return -1. + 2.*fract(sin(p)*43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p), u = f*f*(3.-2.*f);
    return mix(mix(dot(h2(i),f), dot(h2(i+vec2(1,0)),f-vec2(1,0)),u.x),
               mix(dot(h2(i+vec2(0,1)),f-vec2(0,1)), dot(h2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);
  }
  float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*noise(p); p=p*2.02+vec2(1.7,9.2); a*=.5; } return s; }

  void main(){
    vec2 uv = gl_FragCoord.xy / res;
    vec2 p = (gl_FragCoord.xy - .5*res) / 520.;
    float tt = t * .035;

    // terrain field, slowly drifting; cursor raises a soft hill
    vec2 q = vec2(fbm(p + vec2(0., tt)), fbm(p + vec2(5.2, 1.3) - tt));
    float h = fbm(p * 1.1 + 1.6 * q + tt);
    vec2 m = (mouse - .5*res) / 520.;
    h += .28 * exp(-dot(p - m, p - m) * 6.);

    float v = h * 14.;
    float w = fwidth(v);
    float minor = 1. - smoothstep(0., 1.1, abs(fract(v) - .5) / w);
    float vm = v / 5.;
    float major = 1. - smoothstep(0., 1.4, abs(fract(vm) - .5) / fwidth(vm));

    // keep the middle calmer behind the headline, stronger toward edges
    float edge = smoothstep(.15, .75, length((uv - .5) * vec2(1.4, 1.)));

    vec3 col;
    if (dark > .5) {
      col = vec3(.043,.071,.125);
      col += vec3(.09,.17,.36) * .55 * smoothstep(.9,.0,length(uv - vec2(.8,.15)));
      float scan = exp(-pow((uv.y - fract(1. - t*.04)) * 9., 2.));
      vec3 line = vec3(.56,.76,.98);
      col += line * (minor * (.07 + .22*scan) + major * (.16 + .3*scan)) * (.45 + .55*edge);
    } else {
      col = vec3(.984,.992,1.);
      col = mix(col, vec3(.886,.925,1.), .55 * smoothstep(.85,.0,length(uv - vec2(.15 + .05*sin(t*.07),.85))));
      col = mix(col, vec3(.91,.94,.99), .45 * smoothstep(.8,.0,length(uv - vec2(.9,.2))));
      col = mix(col, vec3(.56,.76,.98), minor * .16 * (.35 + .65*edge));
      col = mix(col, vec3(.15,.39,.96), major * .14 * (.3 + .7*edge));
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
    const uRes = U('res'), uT = U('t'), uMouse = U('mouse'), uDark = U('dark');
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
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;
      gl.uniform2f(uRes, cv.width, cv.height);
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
