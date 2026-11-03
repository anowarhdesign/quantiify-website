import ListHero from '../components/ListHero.jsx';
import FilterGrid from '../components/FilterGrid.jsx';
import PostCard from '../components/PostCard.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow } from '../components/ui.jsx';
import { POSTS } from '../content/blog.js';

export default function Blog() {
  return (
    <>
      <ListHero>
        <Crumbs items={[['Home', '/'], ['Blog']]} />
        <Eyebrow sheet="B-01">Blog</Eyebrow>
        <h1>Construction estimating &amp; <em>AI takeoff</em> blog</h1>
        <p className="lede left">Practical guides on construction takeoff, quantity estimation, AI-assisted workflows, drawing review, and trade-specific estimating.</p>
      </ListHero>
      <section className="section list-body">
        <div className="wrap">
          <FilterGrid items={POSTS} render={(p, hidden) => (
            <PostCard key={p.slug} to={`/blog/${p.slug}.html`} trade={p.trade} meta={`${p.minutes} min read`} img={p.cover}
              title={p.title} text={p.excerpt} cta="Read article" hidden={hidden} />
          )} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
