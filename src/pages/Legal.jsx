import { Link } from 'react-router';
import ListHero from '../components/ListHero.jsx';
import AsideToc from '../components/AsideToc.jsx';
import { Crumbs, Eyebrow, Prose, pad2 } from '../components/ui.jsx';
import { LEGAL } from '../content/legal.js';

/** Privacy Policy / Terms of Service, from src/content/legal/<slug>.md */
export default function Legal({ slug }) {
  const doc = LEGAL[slug];
  return (
    <>
      <ListHero>
        <Crumbs items={[['Home', '/'], ['Legal', null], [doc.title]]} />
        <Eyebrow sheet="L">{doc.eyebrow}</Eyebrow>
        <h1 dangerouslySetInnerHTML={{ __html: doc.h1 }} />
        <p className="lede left">{doc.intro}</p>
        <p className="legal-date mono">Last updated: {doc.updated} &middot; Governed by the laws of Bangladesh</p>
      </ListHero>
      <section className="section">
        <div className="wrap post-wrap">
          <div className="post-main">
            {doc.sections.map((s, i) => (
              <section key={s.title} className="cs-sec" id={'s' + (i + 1)}>
                <Eyebrow sheet={pad2(i + 1)}>{s.title}</Eyebrow>
                <Prose html={s.html} />
              </section>
            ))}
          </div>
          <aside className="post-aside">
            <AsideToc title="Contents" sections={doc.sections.map(s => s.title)} />
            <div className="aside-rel"><p className="mono">Legal</p><Link to="/privacy.html">Privacy Policy</Link><Link to="/terms.html">Terms of Service</Link></div>
          </aside>
        </div>
      </section>
    </>
  );
}
