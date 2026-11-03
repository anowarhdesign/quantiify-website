import { Link } from 'react-router';
import ShaderCanvas from '../components/cad/ShaderCanvas.jsx';
import { SideRulers } from '../components/cad/Ruler.jsx';
import BeforeAfter, { cadPair } from '../components/BeforeAfter.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow, NumCard, PhotoFigure, pad2 } from '../components/ui.jsx';
import { ABOUT_STEPS, BELIEFS, OFFER_BOQ, OFFER_STEPS } from '../content/about.js';
import { asset } from '../content/site.js';

function Offer() {
  const pair = cadPair('electrification', { alt: 'Electrical layout with AI-detected lights, fans, sockets and AC points highlighted' });
  return (
    <section id="offer" className="section offer">
      <div className="wrap">
        <Eyebrow sheet="A-04">What Quantiify does</Eyebrow>
        <div className="offer-grid">
          <div className="offer-copy">
            <h2>From your CAD drawing to a priced BOQ.</h2>
            <p className="lede left">You already have the drawings. Quantiify reads them, counts and measures every element, and turns the result into quantities and costs your estimator reviews.</p>
            <ol className="offer-steps">
              {OFFER_STEPS.map((s, i) => <li key={s.title}><span className="mono">{pad2(i + 1)}</span><div><b>{s.title}</b><small>{s.text}</small></div></li>)}
            </ol>
            <Link className="btn btn-primary" to="/book.html">See it on your drawings</Link>
          </div>
          <PhotoFigure className="offer-fig reveal" caption={['Fig. · Drag to compare', 'Drawing → quantities → cost']}>
            <BeforeAfter className="ba-cad offer-ba" label="Drag to compare your CAD drawing with Quantiify's AI takeoff and BOQ" {...pair}
              tags={['01 · Your CAD drawing', '02 · AI takeoff + BOQ']}>
              <div className="offer-boq mono" aria-hidden="true">
                <p className="h"><span>BOQ &middot; E-101</span><span>Sample</span></p>
                {OFFER_BOQ.map(([k, v]) => <p key={k}><span>{k}</span><b>{v}</b></p>)}
                <p className="t"><span>Estimated total</span><b>$ 18,420</b></p>
              </div>
            </BeforeAfter>
          </PhotoFigure>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const hero = cadPair('electrification', { alt: 'Electrical layout with AI-detected elements highlighted', lazy: false });
  return (
    <>
      <section className="hero p-hero ab-hero">
        <ShaderCanvas />
        <SideRulers />
        <div className="wrap p-hero-in">
          <div className="p-hero-copy">
            <Crumbs items={[['Home', '/'], ['About']]} />
            <Eyebrow sheet="A-01">About Quantiify</Eyebrow>
            <h1>Better estimates begin with <em>better quantity preparation.</em></h1>
            <p className="lede left">Construction estimators bring experience, context, and judgment to every project. Too much of their time is still consumed by repetitive work around the estimate: finding sheets, counting symbols, measuring geometry, checking calculations, and re-entering information across tools.</p>
            <div className="cta-row left">
              <Link className="btn btn-primary" to="/book.html">Book a call</Link>{' '}
              <Link className="btn btn-ghost" to="/#pricing">Choose a plan</Link>
            </div>
          </div>
          <PhotoFigure className="reveal" caption={['Fig. 01 · Drag to compare', 'Behind Quantiify']}>
            <BeforeAfter label="Drag to compare a CAD drawing with Quantiify's AI takeoff" {...hero} style={{ aspectRatio: '1034/748' }}
              tags={['CAD drawing', 'AI takeoff']} />
          </PhotoFigure>
        </div>
      </section>

      <section className="section section-tint">
        <div className="wrap ab-vm">
          <article className="ab-vm-card reveal">
            <Eyebrow sheet="A-02">A future where human is in the loop</Eyebrow>
            <h2>Our vision</h2>
            <p>We envision a construction industry where AI takes care of repetitive complexity while estimators stay focused on the decisions that require experience, context, and judgment.</p>
            <p>Quantiify is working toward a future where every estimator has intelligent technology beside them helping them understand more, work faster, and estimate with greater confidence.</p>
          </article>
          <article className="ab-vm-card reveal">
            <Eyebrow sheet="A-03">AI that works with estimators</Eyebrow>
            <h2>Our mission</h2>
            <p>Our mission is to simplify construction estimating by automating repetitive work, connecting critical project information, and surfacing useful insights at the right moment.</p>
            <p>From drawings to takeoffs, calculations to pricing, Quantiify helps teams move through the estimating process with less friction while keeping every important decision in the hands of the estimator.</p>
          </article>
        </div>
      </section>

      <Offer />

      <section className="section">
        <div className="wrap">
          <Eyebrow sheet="A-05">Our approach</Eyebrow>
          <h2>Five steps, one connected workflow.</h2>
          <ol className="ab-steps">
            {ABOUT_STEPS.map((s, i) => (
              <li key={s.title} className="ab-step reveal">
                <figure><img src={asset(`ui/${s.img}.webp`)} loading="lazy" alt={`Quantiify ${s.title} screen`} /></figure>
                <span className="mono">{pad2(i + 1)}</span><h3>{s.title}</h3><p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-dark">
        <ShaderCanvas variant="dark" />
        <div className="wrap">
          <Eyebrow sheet="A-06" light>What we believe</Eyebrow>
          <h2>Built for the way estimators actually work.</h2>
          <div className="ab-beliefs">
            {BELIEFS.map((b, i) => <NumCard key={b.title} className="ab-belief reveal" n={i + 1} title={b.title}>{b.text}</NumCard>)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
