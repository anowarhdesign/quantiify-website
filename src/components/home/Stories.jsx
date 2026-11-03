import { useEffect, useRef, useState } from 'react';
import { Eyebrow, pad2 } from '../ui.jsx';
import { STORIES } from '../../content/home.js';
import { prefersReducedMotion } from '../../lib/motion.js';

/** Customer stories: scroll-snap slider with prev/next, keyboard, mouse drag and a position ruler. */
export default function Stories() {
  const trackRef = useRef(null), barRef = useRef(null);
  const [now, setNow] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const goRef = useRef(() => {});

  useEffect(() => {
    const track = trackRef.current, bar = barRef.current;
    const slides = [...track.children];
    const step = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const i = Math.round(track.scrollLeft / step());
      setNow(i);
      const pv = Math.min(perView(), slides.length);
      bar.style.width = (pv / slides.length * 100) + '%';
      bar.style.left = (Math.min(i, slides.length - pv) / slides.length * 100) + '%';
      setAtStart(track.scrollLeft <= 2);
      setAtEnd(track.scrollLeft >= max - 2);
    };
    goRef.current = d => {
      const last = slides.length - Math.min(perView(), slides.length);
      const target = Math.max(0, Math.min(last, Math.round(track.scrollLeft / step()) + d));
      track.scrollTo({ left: target * step(), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    };
    const onScroll = () => requestAnimationFrame(sync);
    // mouse drag (touch and trackpads scroll natively)
    let dragX = null, startLeft = 0;
    const down = e => { if (e.pointerType !== 'mouse') return; dragX = e.clientX; startLeft = track.scrollLeft; track.classList.add('dragging'); };
    const move = e => { if (dragX !== null) track.scrollLeft = startLeft - (e.clientX - dragX); };
    const up = () => {
      if (dragX === null) return;
      dragX = null; track.classList.remove('dragging');
      track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step(), behavior: 'smooth' });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('resize', sync);
    sync();
    return () => {
      track.removeEventListener('scroll', onScroll); track.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move); removeEventListener('pointerup', up); removeEventListener('resize', sync);
    };
  }, []);

  const onKey = e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goRef.current(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goRef.current(-1); }
  };

  return (
    <section className="section" id="stories">
      <div className="wrap">
        <Eyebrow sheet="S-06">Customer stories</Eyebrow>
        <div className="stories-head">
          <h2>Customer stories, see Quantiify in the real world.</h2>
          <div className="sl-nav">
            <span className="sl-count mono" aria-live="polite"><b id="slNow">{pad2(now + 1)}</b> / {pad2(STORIES.length)}</span>
            <button type="button" className="sl-btn" id="slPrev" aria-label="Previous story" disabled={atStart} onClick={() => goRef.current(-1)}>&larr;</button>
            <button type="button" className="sl-btn" id="slNext" aria-label="Next story" disabled={atEnd} onClick={() => goRef.current(1)}>&rarr;</button>
          </div>
        </div>
        <div ref={trackRef} className="slider" id="stories-track" role="region" aria-roledescription="carousel" aria-label="Customer stories" tabIndex={0} onKeyDown={onKey}>
          {STORIES.map((s, i) => (
            <div key={i} className="quote" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${STORIES.length}`}>
              <span className="big mono">{s.big}</span>
              <blockquote>{s.quote}</blockquote>
              <p className="who mono">{s.who}</p>
            </div>
          ))}
        </div>
        <div className="sl-ruler" aria-hidden="true"><span ref={barRef} id="slBar" /></div>
        <a className="link" href="https://quantiify.ai/case-studies/" target="_blank" rel="noopener">Read case studies &rarr;</a>
      </div>
    </section>
  );
}
