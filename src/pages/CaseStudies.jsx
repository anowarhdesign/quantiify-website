import ListHero from '../components/ListHero.jsx';
import FilterGrid from '../components/FilterGrid.jsx';
import PostCard from '../components/PostCard.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { Crumbs, Eyebrow } from '../components/ui.jsx';
import { CASES, CASE_LEARN } from '../content/caseStudies.js';

export default function CaseStudies() {
  return (
    <>
      <ListHero innerClass="list-hero-in">
        <div>
          <Crumbs items={[['Home', '/'], ['Case studies']]} />
          <Eyebrow sheet="C-01">Case studies from real users</Eyebrow>
          <h1>Case <em>studies</em></h1>
          <p className="lede left">See how construction teams use Quantiify to simplify drawing analysis, accelerate takeoff, and build more connected estimating workflows.</p>
        </div>
        <div className="learn">
          <p className="mono">In each case study</p>
          <ol>{CASE_LEARN.map(x => <li key={x}>{x}</li>)}</ol>
        </div>
      </ListHero>
      <section className="section list-body">
        <div className="wrap">
          <FilterGrid items={CASES} render={(c, hidden, i) => (
            <PostCard key={i} className="case-card" to={c.slug ? `/case-studies/${c.slug}.html` : null} trade={c.trade} meta="Commercial building"
              img={c.img} title={c.title} text={c.deck} cta="Read case study" hidden={hidden} />
          )} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
