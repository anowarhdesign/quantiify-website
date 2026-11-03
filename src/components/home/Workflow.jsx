import { useEffect, useRef, useState } from 'react';
import ShaderCanvas from '../cad/ShaderCanvas.jsx';
import BeforeAfter from '../BeforeAfter.jsx';
import { Eyebrow, pad2 } from '../ui.jsx';
import { SCREENS, Shot } from './screens.jsx';
import { WORKFLOW_STEPS } from '../../content/home.js';
import { asset } from '../../content/site.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import useRevealOnce from '../../lib/useRevealOnce.js';

// Frames shown for each step, in order. 'compare' is the raw sheet vs AI-detected slider.
const PANES = [['dashboard', 'setup', 'uploading', 'upload'], ['detecting', 'compare'], ['takeoff'], ['estimate'], ['export']];
const COMPARE_MS = 4400;
const frameMs = name => (name === 'compare' ? COMPARE_MS : SCREENS[name].ms);

function Step({ i, step, on, onSelect, onHover, onKey }) {
  const [ref, shown] = useRevealOnce();
  return (
    <li ref={ref} className={'reveal' + (shown ? ' in' : '') + (on ? ' on' : '')} data-wf={i} role="tab" tabIndex={0} aria-selected={on}
      onClick={onSelect} onMouseEnter={onHover} onKeyDown={onKey}>
      <span className="cmd mono">{step.cmd}</span><h3>{step.title}</h3><p className="sd">{step.short}</p><p>{step.text}</p>
    </li>
  );
}

/** How it works: five selectable steps; each plays its real product screens, then moves to the next step. */
export default function Workflow() {
  const [cur, setCur] = useState(0);
  const [frame, setFrame] = useState(0);
  const [run, setRun] = useState(0);          // restarts the current frame's timer
  const [inView, setInView] = useState(false);
  const auto = useRef(true);
  const viewerRef = useRef(null), baRef = useRef(null), stepRefs = useRef([]);

  const show = i => { setCur(i); setFrame(0); setRun(r => r + 1); };
  const stop = () => { auto.current = false; };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setInView(e.isIntersecting); if (e.isIntersecting) { setFrame(0); setRun(r => r + 1); } }, { threshold: .4 });
    io.observe(viewerRef.current);
    return () => io.disconnect();
  }, []);

  // play the current pane's frames, then the next step (or loop the pane once someone has interacted)
  useEffect(() => {
    const frames = PANES[cur], name = frames[frame];
    if (name === 'compare') baRef.current?.sweep();
    if (prefersReducedMotion() || !inView) return;
    const t = setTimeout(() => {
      if (frame + 1 < frames.length) setFrame(frame + 1);
      else if (auto.current) show((cur + 1) % PANES.length);
      else { setFrame(0); setRun(r => r + 1); }
    }, frameMs(name) || 5000);
    return () => clearTimeout(t);
  }, [cur, frame, run, inView]);

  const onKey = i => e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stop(); show(i); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault(); stop();
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + PANES.length) % PANES.length;
      stepRefs.current[n]?.focus(); show(n);
    }
  };
  const isCompare = PANES[cur][frame] === 'compare';

  return (
    <section id="workflow" className="section section-dark">
      <ShaderCanvas variant="dark" />
      <div className="wrap">
        <Eyebrow sheet="S-02" light>Easy start, flexible work</Eyebrow>
        <h2>How Quantiify works</h2>
        <p className="lede left light">Every trade works differently. Quantiify is designed to adapt the takeoff workflow to the project, not force every estimator into the same process.</p>
        <div className="wf-layout">
          <ol className="steps" role="tablist" aria-label="How Quantiify works" ref={el => { if (el) stepRefs.current = [...el.children]; }}>
            {WORKFLOW_STEPS.map((s, i) => (
              <Step key={s.cmd} i={i} step={s} on={i === cur}
                onSelect={() => { stop(); show(i); }}
                onHover={() => { auto.current = false; if (i !== cur) show(i); }}
                onKey={onKey(i)} />
            ))}
          </ol>
          <div className="p-photo wf-demo reveal">
            <div ref={viewerRef} className="p-photo-frame wf-viewer" onPointerDown={stop}>
              {PANES.map((frames, p) => (
                <figure key={p} className="wf-pane" data-pane={p} hidden={p !== cur}>
                  {frames.map((name, f) => (
                    <div key={name} className="fr" data-ms={frameMs(name)} hidden={!(p === cur ? f === frame : f === 0)}>
                      {name === 'compare' ? (
                        <div className="shot" style={{ '--ar': '1732/1040' }}>
                          <BeforeAfter ref={baRef} className="ba-sheet" label="Drag to compare the raw drawing sheet with the AI-detected takeoff"
                            after={{ src: asset('product/sheet-detected.webp'), width: '1732', height: '1040', loading: 'lazy', alt: 'Floor plan with AI-detected electrical symbols boxed by type' }}
                            before={{ src: asset('product/sheet-raw.webp'), width: '1732', height: '1040', loading: 'lazy' }}
                            tags={['Raw sheet', 'AI-detected']} />
                        </div>
                      ) : <Shot name={name} />}
                    </div>
                  ))}
                  <div className="fr-dots" aria-hidden="true">
                    {frames.length > 1 && frames.map((name, f) => <i key={name} className={p === cur && f === frame ? 'on' : undefined} />)}
                  </div>
                </figure>
              ))}
            </div>
            <p className="wf-cap mono">
              <span id="wfCapL">{isCompare ? 'Fig. 02 · Drag to compare' : 'Fig. 02 · Product UI'}</span>
              <span id="wfCapR">{pad2(cur + 1) + ' · ' + WORKFLOW_STEPS[cur].title}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
