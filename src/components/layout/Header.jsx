import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import NavDropdown from './NavDropdown.jsx';
import { TRADES } from '../../content/trades.js';
import { asset } from '../../content/site.js';

const RESOURCES = [
  { to: '/blog.html', title: 'Blog', text: 'Guides on takeoff and estimating' },
  { to: '/case-studies.html', title: 'Case studies', text: 'How teams estimate with Quantiify' },
  { to: '/#faq', title: 'FAQ', text: 'Questions estimators ask most' },
];

export default function Header() {
  const [menu, setMenu] = useState(false);
  const btnRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => { document.body.classList.toggle('menu-open', menu); }, [menu]);
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && menu) { setMenu(false); btnRef.current.focus(); } };
    const mq = matchMedia('(min-width:1001px)');
    const onWide = e => { if (e.matches) setMenu(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onWide); };
  }, [menu]);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link className="brand" to="/" aria-label="Quantiify home">
          <img src={asset('quantiify-logo.svg')} alt="Quantiify" className="q-logo" width="102" height="34" />
          <span className="by"><span>by</span><img src={asset('conneqted-logo-dark.svg')} alt="Conneqted Agents" width="44" height="22" /></span>
        </Link>
        <nav className="links" aria-label="Primary">
          <Link to="/#workflow">Workflow</Link>
          <NavDropdown id="ddProjects" label="Projects">
            {TRADES.map(t => (
              <Link key={t.slug} className="dd-card" to={`/projects/${t.slug}.html`}>
                <img src={asset(`product/${t.thumb}.webp`)} width="480" height="320" loading="lazy" decoding="async" alt="" />
                <b>{t.name}</b><span>{t.blurb}</span>
              </Link>
            ))}
          </NavDropdown>
          <Link to="/#pricing">Pricing</Link>
          <NavDropdown id="ddResources" label="Resources" small>
            {RESOURCES.map(r => <Link key={r.to} className="dd-item" to={r.to}><b>{r.title}</b><span>{r.text}</span></Link>)}
          </NavDropdown>
          <Link to="/about.html">About</Link>
        </nav>
        <Link className="btn btn-primary btn-sm" to="/book.html">Book a demo</Link>
        <button ref={btnRef} type="button" className="menu-btn" aria-expanded={menu} aria-controls="mnav" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(m => !m)}><i /><i /></button>
        <nav className="mnav" id="mnav" aria-label="Menu" hidden={!menu} onClick={e => { if (e.target.closest('a')) setMenu(false); }}>
          <Link to="/#workflow">Workflow</Link>
          <p className="mnav-k mono">Projects</p>
          {TRADES.map(t => <Link key={t.slug} className="sub" to={`/projects/${t.slug}.html`}>{t.name}</Link>)}
          <Link to="/#pricing">Pricing</Link>
          <p className="mnav-k mono">Resources</p>
          {RESOURCES.map(r => <Link key={r.to} className="sub" to={r.to}>{r.title}</Link>)}
          <Link to="/about.html">About</Link>
          <Link className="btn btn-primary" to="/book.html">Book a demo</Link>
        </nav>
      </div>
    </header>
  );
}
