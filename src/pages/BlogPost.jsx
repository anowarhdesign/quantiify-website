import { Link } from 'react-router';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow, PostMeta, Prose } from '../components/ui.jsx';
import { POSTS, relatedPosts } from '../content/blog.js';
import { asset } from '../content/site.js';

export default function BlogPost({ slug }) {
  const p = POSTS.find(x => x.slug === slug);
  return (
    <>
      <article className="section post">
        <div className="wrap post-wrap">
          <div className="post-main">
            <Crumbs items={[['Home', '/'], ['Blog', '/blog.html'], [p.trade]]} />
            <PostMeta items={[p.trade, `${p.minutes} min read`, 'Quantiify team']} />
            <h1>{p.title}</h1>
            <p className="post-deck">{p.deck}</p>
            <figure className="p-photo post-cover"><div className="p-photo-frame"><img src={asset(p.cover)} alt="" /></div></figure>
            <Prose html={p.html} />
          </div>
          <aside className="post-aside">
            <div className="aside-card">
              <Eyebrow sheet="Q">See it on your drawings</Eyebrow>
              <p>Bring a drawing set and watch Quantiify count and measure it.</p>
              <Link className="btn btn-primary" to="/book.html">Book a demo</Link>
            </div>
            <div className="aside-rel">
              <p className="mono">More articles</p>
              {relatedPosts(p).map(q => <Link key={q.slug} to={`/blog/${q.slug}.html`}><span className="mono">{q.trade}</span>{q.title}</Link>)}
              <Link className="link" to="/blog.html">All articles &rarr;</Link>
            </div>
          </aside>
        </div>
      </article>
      <CtaBand />
    </>
  );
}
