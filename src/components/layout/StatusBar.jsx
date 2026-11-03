import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { CONTACT } from '../../content/site.js';

const OVERVIEW = { ref: 'Q-001', name: 'Overview' };

/** AutoCAD-style status bar: the "sheet" (section) in view, scroll progress and a Book a demo shortcut. */
export default function StatusBar({ page }) {
  const [sheet, setSheet] = useState(OVERVIEW);
  const barRef = useRef(null);

  // current sheet: each main > section with an eyebrow ref (S-01 …) is a sheet
  useEffect(() => {
    setSheet(OVERVIEW);
    const sheets = [...document.querySelectorAll('main > section')].map(sec => {
      const eb = sec.querySelector('.eyebrow');
      if (sec.classList.contains('hero')) return { sec, ref: 'Q-001', name: 'Overview' };
      if (sec.id === 'book' || sec.id === 'cta') return { sec, ref: 'Q-002', name: 'Book a demo' };
      if (!eb) return null;
      const ref = eb.querySelector('.ref').textContent;
      return { sec, ref, name: eb.textContent.replace(ref, '').trim() };
    }).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const sh = sheets.find(x => x.sec === e.target);
      setSheet({ ref: sh.ref, name: sh.name });
    }), { rootMargin: '-45% 0px -50% 0px' });
    sheets.forEach(x => io.observe(x.sec));
    return () => io.disconnect();
  }, [page]);

  // scroll progress
  useEffect(() => {
    const prog = () => {
      const h = document.documentElement;
      barRef.current.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - innerHeight)})`;
    };
    addEventListener('scroll', prog, { passive: true });
    prog();
    return () => removeEventListener('scroll', prog);
  }, [page]);

  return (
    <div className="statusbar mono">
      <span ref={barRef} className="sb-progress" aria-hidden="true" />
      <span className="sb-sheet"><b id="sbRef">{sheet.ref}</b><span id="sbName">{sheet.name}</span></span>
      <span className="grow" />
      <a className="sb-mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      <Link className="sb-cta" to="/book.html">Book a demo <span aria-hidden="true">&#x21B5;</span></Link>
    </div>
  );
}
