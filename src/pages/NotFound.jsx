import { Link } from 'react-router';
import ListHero from '../components/ListHero.jsx';
import { Crumbs, Eyebrow } from '../components/ui.jsx';

/** Served as 404.html by GitHub Pages for any URL that is not a page. */
export default function NotFound() {
  return (
    <ListHero>
      <Crumbs items={[['Home', '/'], ['Not found']]} />
      <Eyebrow sheet="404">Sheet not found</Eyebrow>
      <h1>This drawing <em>isn&rsquo;t in the set.</em></h1>
      <p className="lede left">The page you were looking for has moved or never existed.</p>
      <div className="cta-row left">
        <Link className="btn btn-primary" to="/">Back to the homepage</Link>{' '}
        <Link className="btn btn-ghost" to="/book.html">Book a demo</Link>
      </div>
    </ListHero>
  );
}
