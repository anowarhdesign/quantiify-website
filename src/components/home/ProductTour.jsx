import { useEffect, useRef, useState } from 'react';
import { SCREENS, Shot } from './screens.jsx';
import { prefersReducedMotion } from '../../lib/motion.js';

const CHAPTERS = [
  ['setup', 'Project setup'], ['uploading', 'Upload'], ['legend', 'AI legend detection'], ['symbols', 'Symbol count'],
  ['takeoff', 'Cable takeoff'], ['estimate', 'Estimate'], ['export', 'Export'],
];

/** Hero product tour: project setup → export, one chapter per screen, auto-advancing while in view. */
export default function ProductTour() {
  const [ti, setTi] = useState(0);
  const [restart, setRestart] = useState(0);        // bumps when a chapter is (re)started without changing index
  const [visible, setVisible] = useState(false);
  const figRef = useRef(null), pbRefs = useRef([]);

  const go = i => { setTi(i); setRestart(r => r + 1); };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setVisible(e.isIntersecting); if (e.isIntersecting) setRestart(r => r + 1); }, { threshold: .3 });
    io.observe(figRef.current);
    return () => io.disconnect();
  }, []);

  // progress bar on the current tab, then advance to the next chapter
  useEffect(() => {
    const reduce = prefersReducedMotion(), ms = SCREENS[CHAPTERS[ti][0]].ms;
    pbRefs.current.forEach((pb, k) => {
      pb.style.animation = 'none'; void pb.offsetWidth;
      pb.style.animation = k === ti && !reduce ? `tourPb ${ms}ms linear forwards` : '';
    });
    if (!visible || reduce) return;
    const t = setTimeout(() => go((ti + 1) % CHAPTERS.length), ms);
    return () => clearTimeout(t);
  }, [ti, restart, visible]);

  return (
    <figure ref={figRef} className="tour reveal" id="tour" aria-label="Quantiify product tour">
      <div className="tour-frame">
        <div className="tour-stage">
          {CHAPTERS.map(([name], i) => (
            <div key={name} className="fr" data-i={i} hidden={i !== ti} data-ms={SCREENS[name].ms}><Shot name={name} eager={i === 0} /></div>
          ))}
        </div>
      </div>
      <ol className="tour-tabs mono">
        {CHAPTERS.map(([name, label], i) => (
          <li key={name}>
            <button type="button" data-tour={i} aria-current={i === ti ? 'step' : undefined} className={i < ti ? 'done' : undefined} onClick={() => go(i)}>
              <span>{String(i + 1).padStart(2, '0')}</span>{label}<i className="pb" ref={el => { pbRefs.current[i] = el; }} />
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
}
