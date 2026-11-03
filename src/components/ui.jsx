// Small presentational building blocks shared across pages.
import { Link } from 'react-router';

/** Section label in drawing-sheet style: <span class="ref">S-01</span> Results */
export function Eyebrow({ sheet, children, light = false, className = '' }) {
  return <p className={'eyebrow' + (light ? ' light' : '') + (className ? ' ' + className : '')}><span className="ref">{sheet}</span> {children}</p>;
}

/** Breadcrumb trail. `items` are [label, to] pairs; the last one is the current page (no link). */
export function Crumbs({ items }) {
  const out = [];
  items.forEach(([label, to], i) => {
    if (i) out.push(<span key={'s' + i}>/</span>);
    out.push(i === items.length - 1
      ? <span key={i} aria-current="page">{label}</span>
      : to ? <Link key={i} to={to}>{label}</Link> : <span key={i}>{label}</span>);
  });
  return <nav className="crumbs mono" aria-label="Breadcrumb">{out}</nav>;
}

/** Article/case-study meta row: <span>Electrification</span><span>2 min read</span> … */
export function PostMeta({ items }) {
  return <div className="post-meta mono">{items.map((x, i) => <span key={i}>{x}</span>)}</div>;
}

/** Numbered card (01 Title / text), used by audience, quantities, features, beliefs … */
export function NumCard({ className, n, title, children }) {
  return <div className={className}><span className="mono">{String(n).padStart(2, '0')}</span><h3>{title}</h3><p>{children}</p></div>;
}

/** Framed product photo with optional "Fig." caption. */
export function PhotoFigure({ className = '', frameClass = '', caption, children }) {
  return (
    <figure className={'p-photo' + (className ? ' ' + className : '')}>
      <div className={'p-photo-frame' + (frameClass ? ' ' + frameClass : '')}>{children}</div>
      {caption && <figcaption className="mono"><span>{caption[0]}</span><span>{caption[1]}</span></figcaption>}
    </figure>
  );
}

/** Markdown/HTML content block rendered from src/content. */
export function Prose({ html, className = 'prose' }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const pad2 = n => String(n).padStart(2, '0');
