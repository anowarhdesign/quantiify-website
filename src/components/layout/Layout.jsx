import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import CadCursor from '../cad/CadCursor.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import StatusBar from './StatusBar.jsx';
import { applyHead } from '../../seo/head.js';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Fade/slide in every `.reveal` element on the page the first time it scrolls into view. */
function useReveal(page) {
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('in');
    }), { threshold: .2 });
    document.querySelectorAll('.reveal:not(.in)').forEach(n => io.observe(n));
    return () => io.disconnect();
  }, [page]);
}

/** New page: start at the top, or at the #section in the URL (smoothly when it is on the same page). */
function useScrollOnNavigate(pathname, hash) {
  const prev = useRef(null);
  useIsoLayoutEffect(() => {
    const samePage = prev.current === pathname;
    const first = prev.current === null;
    prev.current = pathname;
    if (first) return;                                   // the browser already handled the initial load
    const el = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) el.scrollIntoView({ behavior: samePage ? 'smooth' : 'instant', block: 'start' });
    else if (!samePage) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
}

/** Shared page shell: CAD cursor, header, main content, title-block footer and status bar. */
export default function Layout({ route, children }) {
  const { pathname, hash } = useLocation();
  useEffect(() => { if (route) applyHead(route); }, [route]);
  useScrollOnNavigate(pathname, hash);
  useReveal(pathname);

  return (
    <>
      <CadCursor page={pathname} />
      <Header />
      <main id="top">{children}</main>
      <Footer />
      <StatusBar page={pathname} />
    </>
  );
}
