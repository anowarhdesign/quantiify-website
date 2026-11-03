import { Link } from 'react-router';
import ShaderCanvas from '../components/cad/ShaderCanvas.jsx';
import { SideRulers } from '../components/cad/Ruler.jsx';
import BeforeAfter, { cadPair } from '../components/BeforeAfter.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow, NumCard, PhotoFigure } from '../components/ui.jsx';
import { PROJECTS, PROJECT_FEATURES, PROJECT_WF_TEXT } from '../content/projects.js';
import { asset } from '../content/site.js';

function WorkflowRow({ title, items, flip, img, w, h, alt, fig }) {
  return (
    <div className={'wf' + (flip ? ' flip' : '')}>
      <div className="wf-copy">
        <h2>{title}</h2>
        <p className="lede left">{PROJECT_WF_TEXT}</p>
        <ul className="fit">{items.map(x => <li key={x}>{x}</li>)}</ul>
      </div>
      <PhotoFigure className="wf-img reveal" frameClass="fit" caption={fig}>
        <img src={asset(img)} width={w} height={h} loading="lazy" alt={alt} />
      </PhotoFigure>
    </div>
  );
}

/** Trade landing page (projects/<slug>.html). */
export default function Project({ slug }) {
  const p = PROJECTS.find(x => x.slug === slug);
  const pair = cadPair(asset, p.slug, { alt: `${p.name} drawing with AI-detected elements highlighted by layer`, size: false });
  return (
    <>
      <section className="hero p-hero">
        <ShaderCanvas />
        <SideRulers />
        <div className="wrap p-hero-in">
          <div className="p-hero-copy">
            <Crumbs items={[['Home', '/'], ['Projects', '/#trades'], [p.name]]} />
            <h1>Turn <em>{p.name}</em> drawings into reviewable quantities without counting every manually</h1>
            <p className="lede left">{p.lede}</p>
            <div className="cta-row left">
              <Link className="btn btn-ghost" to={`/projects/${p.slug}.html#workflow`}>See the workflow</Link>{' '}
              <Link className="btn btn-primary" to="/book.html">Book a call</Link>
            </div>
          </div>
          <PhotoFigure className="reveal" caption={['Fig. 01', p.name]}>
            <img src={asset(`product/${p.photo}.webp`)} width="1200" height="800" alt={`${p.name} estimation`} />
          </PhotoFigure>
        </div>
      </section>

      <section id="quantities" className="section">
        <div className="wrap">
          <Eyebrow sheet="P-01">Quantities</Eyebrow>
          <h2>Prepare the quantities your trade needs</h2>
          <div className="qty-wrap">
            <PhotoFigure className="qty-fig reveal" caption={['Fig. 02 · Drag to compare', 'Your drawing → quantities']}>
              <BeforeAfter label="Drag to compare the CAD drawing with Quantiify's AI takeoff" {...pair} tags={['CAD drawing', 'AI takeoff']} />
            </PhotoFigure>
            <div className="qty-grid">
              {p.qty.map(([t, d], i) => <NumCard key={t} className="qty-card reveal" n={i + 1} title={t}>{d}</NumCard>)}
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="section section-tint">
        <div className="wrap">
          <Eyebrow sheet="P-02">Estimator control remains central</Eyebrow>
          <WorkflowRow title="A workflow your estimator can verify" items={p.fit1} img="ui/takeoff-cable.webp" w="1800" h="1280"
            alt="Quantiify takeoff workspace: AI auto-detect, measurements, detected items and commit" fig={['Fig. 03', 'Takeoff workspace']} />
          <Eyebrow sheet="P-03" className="wf-eyebrow">A workflow your estimator can verify</Eyebrow>
          <WorkflowRow flip title="Easy start, flexible work" items={p.fit2} img="ui/estimate.webp" w="1800" h="1423"
            alt="Quantiify estimation table with priced quantities" fig={['Fig. 04', 'Estimation']} />
        </div>
      </section>

      <section id="features" className="section">
        <div className="wrap">
          <Eyebrow sheet="P-04">Features</Eyebrow>
          <h2>Built for modern {p.name.toLowerCase()} estimation</h2>
          <div className="feats">
            {PROJECT_FEATURES.map(([t, d], i) => <NumCard key={t} className="feat reveal" n={i + 1} title={t}>{d}</NumCard>)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
