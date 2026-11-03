import { Link } from 'react-router';
import ListHero from '../components/ListHero.jsx';
import AsideToc from '../components/AsideToc.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow, PostMeta, pad2 } from '../components/ui.jsx';
import { APPROACH_CHAIN, CASES } from '../content/caseStudies.js';
import { asset } from '../content/site.js';

// Section body from source blocks [tag, text]: li runs become lists, h3/h4 become h2, worked sums get the calc style.
function Blocks({ blocks }) {
  const out = [];
  let ul = [];
  const flush = () => { if (ul.length) { out.push(<ul key={'u' + out.length}>{ul}</ul>); ul = []; } };
  blocks.forEach(([tag, text], i) => {
    if (tag === 'li') { ul.push(<li key={i}>{text}</li>); return; }
    flush();
    if (tag === 'h3' || tag === 'h4') out.push(<h2 key={i}>{text.replace(/:$/, '').trim()}</h2>);
    else if (/^([\d.,]+ ?m(?: of cable)?|[\d.,]+ m × \$[\d.,]+\/m = \$[\d.,]+)$/.test(text)) out.push(<p key={i} className="calc mono">{text}</p>);
    else out.push(<p key={i}>{text}</p>);
  });
  flush();
  return out;
}

function SectionBody({ name, blocks }) {
  if (name === 'Approach') {
    const ps = blocks.filter(([t]) => t === 'p').map(([, x]) => x);
    return (
      <>
        <p>{ps[0]}</p>
        <ol className="cs-chain">{APPROACH_CHAIN.map((s, k) => <li key={s}><span className="mono">{pad2(k + 1)}</span>{s}</li>)}</ol>
        {ps.slice(1).map((x, k) => <p key={k}>{x}</p>)}
      </>
    );
  }
  if (name === 'Outcome') {
    const cards = [];
    for (const [t, x] of blocks) {
      if (t === 'h3') cards.push([x, '']);
      else if (cards.length) cards[cards.length - 1][1] += x;
    }
    return <div className="cs-out">{cards.map(([a, b]) => <div key={a}><h3>{a}</h3><p>{b}</p></div>)}</div>;
  }
  return <Blocks blocks={blocks} />;
}

export default function CaseStudy({ slug }) {
  const c = CASES.find(x => x.slug === slug);
  return (
    <>
      <ListHero innerClass="p-hero-in">
        <div className="p-hero-copy">
          <Crumbs items={[['Home', '/'], ['Case studies', '/case-studies.html'], [c.trade]]} />
          <PostMeta items={[c.trade, 'Commercial building', 'Construction estimating']} />
          <h1>{c.title}</h1>
          <p className="lede left">{c.deck}</p>
        </div>
        <figure className="p-photo"><div className="p-photo-frame"><img src={asset(c.img)} alt={c.imgAlt} /></div>
          <figcaption className="mono"><span>Fig. 01</span><span>{c.caption}</span></figcaption></figure>
      </ListHero>
      <section className="section">
        <div className="wrap post-wrap">
          <div className="post-main">
            {c.sections.map((s, k) => (
              <section key={s.name} className="cs-sec" id={'s' + (k + 1)}>
                <Eyebrow sheet={pad2(k + 1)}>{s.name}</Eyebrow>
                <h2>{s.heading}</h2>
                <div className="prose"><SectionBody name={s.name} blocks={s.blocks} /></div>
              </section>
            ))}
          </div>
          <aside className="post-aside">
            <AsideToc title="On this page" sections={c.sections.map(s => s.name)} />
            <div className="aside-card">
              <p>Want the same workflow on your drawings?</p>
              <Link className="btn btn-primary" to="/book.html">Book a demo</Link>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
