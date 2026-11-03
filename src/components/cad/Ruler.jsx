import { useEffect, useRef, useState } from 'react';

/** Drafting ruler along a section edge. Vertical rulers are numbered every 80 px, horizontal every 100 px. */
export default function Ruler({ side }) {
  const ref = useRef(null);
  const [len, setLen] = useState(0);
  const vertical = side === 'left' || side === 'right';

  useEffect(() => {
    const el = ref.current;
    const measure = () => setLen(vertical ? el.offsetHeight : el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [vertical]);

  const marks = [];
  if (vertical) for (let y = 80; y < len; y += 80) marks.push(<span key={y} className="n" style={{ top: y + 'px' }}>{y}</span>);
  else for (let x = 0, i = 0; x < len - 20; x += 100, i++) marks.push(<span key={x} className="n" style={{ left: x + 'px' }}>{i * 10}</span>);

  return <div ref={ref} className={vertical ? `ruler-v ${side}` : 'ruler-h'} aria-hidden="true">{marks}</div>;
}

/** The pair of vertical rulers framing a hero or CTA band. */
export function SideRulers() {
  return <><Ruler side="left" /><Ruler side="right" /></>;
}

/** Full-width horizontal ruler between sections. */
export function RulerRow() {
  return <div className="wrap"><Ruler side="top" /></div>;
}
