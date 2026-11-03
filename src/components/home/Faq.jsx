import { Eyebrow, pad2 } from '../ui.jsx';
import { FAQ } from '../../content/home.js';

const Item = ({ f, n }) => (
  <details className="faq-i" open={n === 0 || undefined}>
    <summary><span className="mono">{pad2(n + 1)}</span><span className="q">{f.q}</span><i aria-hidden="true" /></summary>
    <p>{f.a}</p>
  </details>
);

export default function Faq() {
  const half = Math.ceil(FAQ.length / 2);
  return (
    <section id="faq" className="section">
      <div className="wrap">
        <Eyebrow sheet="S-08">FAQ</Eyebrow>
        <div className="faq-head">
          <h2>Frequently asked questions</h2>
          <p className="lede left">Find answers to the questions estimators ask most. A closer look at how Quantiify simplifies the work behind every estimate.</p>
        </div>
        <div className="faq">
          <div className="faq-col">{FAQ.slice(0, half).map((f, i) => <Item key={i} f={f} n={i} />)}</div>
          <div className="faq-col">{FAQ.slice(half).map((f, i) => <Item key={i} f={f} n={half + i} />)}</div>
        </div>
      </div>
    </section>
  );
}
