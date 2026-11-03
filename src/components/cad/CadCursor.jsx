import { useEffect, useRef } from 'react';
import { finePointer, prefersReducedMotion } from '../../lib/motion.js';

const SNAP_TARGETS = 'a, button, .who-card, .quote, .plan, .faq-i summary';
const NATIVE_POINTER = 'input, textarea, select, .prose, .lede, .faq-i p, .cal-frame, .quote blockquote';

/**
 * Decorative AutoCAD cursor (desktop pointers only): crosshair, OSNAP grips that lock onto the
 * hovered link/button/card, and a fading polyline trail. Over forms and reading text the normal
 * pointer comes back. `page` changes on navigation so the snap targets are re-bound.
 */
export default function CadCursor({ page }) {
  const hRef = useRef(null), vRef = useRef(null), boxRef = useRef(null), snapRef = useRef(null), tagRef = useRef(null);
  const target = useRef(null);

  // normal pointer over forms and reading text (the CAD cursor is decorative)
  useEffect(() => {
    const onOver = e => document.body.classList.toggle('native', !!e.target.closest(NATIVE_POINTER));
    document.addEventListener('mouseover', onOver);
    return () => document.removeEventListener('mouseover', onOver);
  }, []);

  // crosshair follows the mouse; snap box follows its target on scroll
  useEffect(() => {
    if (!finePointer()) return;
    document.body.classList.add('cad');
    const onMove = e => {
      hRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      vRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      boxRef.current.style.left = e.clientX + 'px'; boxRef.current.style.top = e.clientY + 'px';
    };
    const onScroll = () => place();
    addEventListener('mousemove', onMove);
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.body.classList.remove('cad');
      removeEventListener('mousemove', onMove);
      removeEventListener('scroll', onScroll);
    };
  }, []);

  function place() {
    const el = target.current, snap = snapRef.current;
    if (!el || !snap) return;
    const r = el.getBoundingClientRect(), pad = 6;
    snap.style.transform = `translate(${r.left - pad}px, ${r.top - pad}px)`;
    snap.style.width = (r.width + pad * 2) + 'px';
    snap.style.height = (r.height + pad * 2) + 'px';
  }

  // OSNAP: bind every snap target on the current page
  useEffect(() => {
    if (!finePointer()) return;
    const els = [...document.querySelectorAll(SNAP_TARGETS)];
    const enter = e => {
      const el = e.currentTarget;
      target.current = el;
      const kind = el.matches('a, button') ? (el.matches('.btn, button') ? 'SELECT' : 'LINK') : 'OBJECT';
      const label = (el.getAttribute('aria-label') || (el.querySelector('b') || el).textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);
      tagRef.current.textContent = `${kind} · ${label}`;
      place();
      document.body.classList.add('snapping');
    };
    const leave = () => { target.current = null; document.body.classList.remove('snapping'); };
    els.forEach(el => { el.addEventListener('mouseenter', enter); el.addEventListener('mouseleave', leave); });
    return () => {
      els.forEach(el => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); });
      leave();
    };
  }, [page]);

  // CAD mouse trail: a fading polyline with snap-point markers
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    const cv = document.createElement('canvas');
    cv.className = 'trail'; cv.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cv);
    const ctx = cv.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const fit = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const pts = [], LIFE = 420, GAP = 52;   // ms a point lives, px between snap markers
    let raf = 0, lastMark = null;
    const draw = now => {
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (let i = 1; i < pts.length; i++) {
        const a = 1 - (now - pts[i].t) / LIFE;
        ctx.strokeStyle = `rgba(38,100,245,${(a * a * .16).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pts[i - 1].x, pts[i - 1].y); ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke();
      }
      for (const p of pts) {
        if (!p.mark) continue;
        const a = 1 - (now - p.t) / LIFE;
        ctx.strokeStyle = `rgba(38,100,245,${(a * a * .3).toFixed(3)})`;
        ctx.strokeRect(p.x - 2, p.y - 2, 4, 4);
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0;
      if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
    };
    const onMove = e => {
      const t = performance.now();
      const mark = !lastMark || Math.hypot(e.clientX - lastMark.x, e.clientY - lastMark.y) > GAP;
      if (mark) lastMark = { x: e.clientX, y: e.clientY };
      pts.push({ x: e.clientX, y: e.clientY, t, mark });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    addEventListener('resize', fit);
    addEventListener('mousemove', onMove, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', fit); removeEventListener('mousemove', onMove); cv.remove(); };
  }, []);

  return (
    <>
      <div className="xhair" aria-hidden="true"><span ref={hRef} className="xh-h" /><span ref={vRef} className="xh-v" /><span ref={boxRef} className="xh-box" /></div>
      <div ref={snapRef} className="snap" aria-hidden="true"><i /><i /><i /><i /><span ref={tagRef} className="snap-tag mono" /></div>
    </>
  );
}
