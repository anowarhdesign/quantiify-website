import { useEffect, useRef, useState } from 'react';
import { VERT, FRAG } from './cadShader.glsl.js';

// Sets up the WebGL2 program on a canvas. Returns a cleanup function, or null when WebGL2 is unavailable.
function startShader(cv, dark) {
  const gl = cv.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const uRes = U('res'), uT = U('t'), uMouse = U('mouse'), uDark = U('dark'), uS = U('S');
  gl.uniform1f(uDark, dark ? 1 : 0);

  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const size = () => {
    const r = cv.getBoundingClientRect();
    cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
  };
  size();

  // The plan is still: it only redraws while the cursor highlight is easing.
  let visible = false, raf = 0;
  const kick = () => { if (visible && !raf) raf = requestAnimationFrame(draw); };
  function draw() {
    raf = 0;
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
    gl.uniform2f(uRes, cv.width, cv.height);
    gl.uniform1f(uS, 46 * dpr);
    gl.uniform1f(uT, 12);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) > .5) kick();
  }
  const ro = new ResizeObserver(() => { size(); kick(); });
  ro.observe(cv);
  const host = cv.parentElement;
  const onMove = e => {
    const r = cv.getBoundingClientRect();
    mouse.tx = (e.clientX - r.left) * dpr; mouse.ty = (r.bottom - e.clientY) * dpr;
    if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty; }
    kick();
  };
  host.addEventListener('pointermove', onMove);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf); raf = 0;
    kick();
  });
  io.observe(cv);
  return () => {
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    host.removeEventListener('pointermove', onMove);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}

/**
 * Animated CAD floor-plan background for a section. Compiled only when it nears the viewport,
 * in idle time, so it never competes with first paint. Without WebGL2 the canvas is dropped and
 * the section's CSS background shows instead.
 */
export default function ShaderCanvas({ variant = 'light' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    let stop = null, idleId = 0, cancelled = false;
    const idle = window.requestIdleCallback || (f => setTimeout(f, 200));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const near = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      near.disconnect();
      idleId = idle(() => {
        if (cancelled) return;
        stop = startShader(cv, variant === 'dark');
        if (stop) setOn(true); else setFailed(true);
      }, { timeout: 1500 });
    }, { rootMargin: '200px 0px' });
    near.observe(cv);
    return () => { cancelled = true; near.disconnect(); cancelIdle(idleId); stop?.(); };
  }, [variant]);

  if (failed) return null;
  return <canvas ref={ref} className={'shader' + (on ? ' on' : '')} data-shader={variant} aria-hidden="true" />;
}
