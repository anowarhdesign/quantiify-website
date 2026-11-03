import { useEffect, useState } from 'react';
import { pad2 } from './ui.jsx';

/** "On this page" list for long documents; highlights the `.cs-sec` section in view. */
export default function AsideToc({ title, sections }) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.cs-sec').forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [sections]);
  return (
    <nav className="aside-toc" aria-label={title === 'Contents' ? 'Contents' : 'On this page'}>
      <p className="mono">{title}</p>
      {sections.map((s, i) => {
        const id = 's' + (i + 1);
        return <a key={id} href={'#' + id} className={active === id ? 'on' : undefined}><span className="mono">{pad2(i + 1)}</span>{s}</a>;
      })}
    </nav>
  );
}
