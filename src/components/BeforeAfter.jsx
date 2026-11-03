import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

const ease = x => (x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const SWEEP = [[0, 50], [700, 78], [1500, 24], [2200, 50]];   // [ms, %] keyframes

/**
 * Before / after comparison slider (drag, hover or arrow keys). `after` is the full image, `before`
 * is revealed up to the handle. It sweeps once when first seen so people know it moves; the parent
 * can replay that through the ref (`ref.current.sweep()`).
 */
const BeforeAfter = forwardRef(function BeforeAfter(
  { className = 'ba-cad', label, after, before, tags, style, autoSweep = true, children }, ref,
) {
  const el = useRef(null);
  const api = useRef({});

  useEffect(() => {
    const node = el.current;
    let p = 50, dragging = false, touched = false;
    const set = v => { p = Math.max(0, Math.min(100, v)); node.style.setProperty('--p', p + '%'); node.setAttribute('aria-valuenow', Math.round(p)); };
    const at = e => { const r = node.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; };
    const down = e => { touched = true; dragging = true; node.setPointerCapture(e.pointerId); set(at(e)); };
    const move = e => { if (dragging || e.pointerType === 'mouse') { touched = true; set(at(e)); } };
    const up = () => { dragging = false; };
    const key = e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); touched = true; set(p + (e.key === 'ArrowRight' ? 5 : -5)); }
    };
    node.addEventListener('pointerdown', down);
    node.addEventListener('pointermove', move);
    node.addEventListener('pointerup', up);
    node.addEventListener('pointercancel', up);
    node.addEventListener('keydown', key);
    set(50);

    let raf = 0;
    api.current.sweep = () => {
      if (prefersReducedMotion()) return;
      touched = false;
      cancelAnimationFrame(raf);
      const t0 = performance.now() + 300;
      const f = t => {
        if (touched) return;
        const dt = t - t0;
        if (dt < 0) { raf = requestAnimationFrame(f); return; }
        let i = 0; while (i < SWEEP.length - 2 && dt > SWEEP[i + 1][0]) i++;
        const [ta, va] = SWEEP[i], [tb, vb] = SWEEP[i + 1];
        set(va + (vb - va) * ease(Math.min(1, (dt - ta) / (tb - ta))));
        if (dt < SWEEP[SWEEP.length - 1][0]) raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    };

    let io;
    if (autoSweep && !prefersReducedMotion()) {
      io = new IntersectionObserver(([en], ob) => {
        if (!en.isIntersecting) return;
        ob.disconnect();
        api.current.sweep();
      }, { threshold: .5 });
      io.observe(node);
    }
    return () => {
      cancelAnimationFrame(raf); io?.disconnect();
      node.removeEventListener('pointerdown', down);
      node.removeEventListener('pointermove', move);
      node.removeEventListener('pointerup', up);
      node.removeEventListener('pointercancel', up);
      node.removeEventListener('keydown', key);
    };
  }, [autoSweep]);

  useImperativeHandle(ref, () => ({ sweep: () => api.current.sweep?.() }), []);

  return (
    <div ref={el} className={'ba ' + className} data-ba="" role="slider" tabIndex={0} aria-label={label}
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style={style}>
      <img className="ba-after" {...after} />
      <img className="ba-before" alt="" {...before} />
      <div className="ba-handle" aria-hidden="true"><span><i>&#x2194;</i></span></div>
      <span className="ba-tag l mono">{tags[0]}</span><span className="ba-tag r mono">{tags[1]}</span>
      {children}
    </div>
  );
});

export default BeforeAfter;

/** The standard CAD drawing vs AI takeoff pair for a trade (assets/cad/<slug>-cad|takeoff.webp). */
export const cadPair = (asset, slug, { alt = '', lazy = true, size = true, srcset = false } = {}) => {
  const img = kind => ({
    src: asset(`cad/${slug}-${kind}.webp`),
    ...(srcset ? { srcSet: `${asset(`cad/${slug}-${kind}-900.webp`)} 900w, ${asset(`cad/${slug}-${kind}.webp`)} 1034w`, sizes: '(max-width: 720px) 100vw, 1100px' } : {}),
    ...(size ? { width: '1034', height: '748' } : {}),
    ...(lazy ? { loading: 'lazy' } : {}),
  });
  return { after: { ...img('takeoff'), alt }, before: img('cad') };
};
