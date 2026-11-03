import Counter from '../Counter.jsx';
import { Eyebrow } from '../ui.jsx';
import { STATS } from '../../content/home.js';

export default function Results() {
  return (
    <section id="results" className="section">
      <div className="wrap">
        <Eyebrow sheet="S-01">Results</Eyebrow>
        <h2>Why do people choose Quantiify?</h2>
        <p className="lede left">Quantiify combines intelligent assistance with the control, flexibility, and judgment that professional estimation requires.</p>
        <div className="stats">
          {STATS.map(s => (
            <div key={s.title} className="stat"><Counter to={s.to} suffix={s.suffix} /><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}
