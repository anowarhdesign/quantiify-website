import { Eyebrow, NumCard } from '../ui.jsx';
import { AUDIENCE } from '../../content/home.js';

export default function Audience() {
  return (
    <section className="section section-tint">
      <div className="wrap">
        <Eyebrow sheet="S-05">Built for</Eyebrow>
        <h2>Everyone who signs off on a number.</h2>
        <div className="who">
          {AUDIENCE.map((a, i) => <NumCard key={a.title} className="who-card reveal" n={i + 1} title={a.title}>{a.text}</NumCard>)}
        </div>
      </div>
    </section>
  );
}
