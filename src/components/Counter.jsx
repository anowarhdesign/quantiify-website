import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/** A number that counts up (ease-out) the first time it scrolls into view. */
export default function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const n = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = prefersReducedMotion() ? 1 : 1400;
      const f = t => {
        const p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        n.textContent = prefix + v + suffix;
        if (p < 1) raf = requestAnimationFrame(f);
      };
      f(t0);
    }, { threshold: .2 });
    io.observe(n);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, prefix, suffix]);
  return <span ref={ref} className="num">0</span>;
}
