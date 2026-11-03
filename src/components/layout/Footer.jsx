import { Link } from 'react-router';
import { asset, CONTACT } from '../../content/site.js';

/** Footer drawn as a drawing title block. */
export default function Footer() {
  return (
    <footer className="titleblock">
      <div className="wrap">
        <div className="tb">
          <div className="tb-cell tb-brand">
            <span className="tb-k">Drawn by</span>
            <img src={asset('conneqted-logo.svg')} alt="Conneqted Agents" width="89" height="44" loading="lazy" />
            <p>Agentic SaaS and AI products, from idea to production.</p>
          </div>
          <div className="tb-cell"><span className="tb-k">Pages</span><span className="tb-v tb-links"><Link to="/about.html">About</Link><Link to="/blog.html">Blog</Link><Link to="/case-studies.html">Case studies</Link><Link to="/book.html">Book a demo</Link></span></div>
          <div className="tb-cell"><span className="tb-k">Contact</span><span className="tb-v"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><br /><a href={`mailto:${CONTACT.support}`}>{CONTACT.support}</a><br /><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></span></div>
          <div className="tb-cell"><span className="tb-k">Address</span><span className="tb-v">{CONTACT.street}<br />{CONTACT.city}</span></div>
          <div className="tb-cell tb-sheet"><span className="tb-k">Sheet</span><span className="tb-v big mono">Q-001</span><span className="tb-k">Rev 01 · NTS</span></div>
        </div>
        <p className="fine mono">© <span id="yr" suppressHydrationWarning>{new Date().getFullYear()}</span> Conneqted Agents · <a href="https://conneqtedagents.ai/" target="_blank" rel="noopener">conneqtedagents.ai</a> &middot; <Link to="/privacy.html">Privacy Policy</Link> &middot; <Link to="/terms.html">Terms of Service</Link></p>
      </div>
    </footer>
  );
}
