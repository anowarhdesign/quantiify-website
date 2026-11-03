import { Link } from 'react-router';
import { PostMeta } from './ui.jsx';
import { asset } from '../content/site.js';

/** Card in the blog / case-study grids. Without `to` it is a "write-up in progress" placeholder. */
export default function PostCard({ to, trade, meta, img, title, text, cta, hidden, className = '' }) {
  const body = (
    <>
      <figure><img src={asset(img)} loading="lazy" alt="" /></figure>
      <PostMeta items={[trade, meta]} />
      <h3>{title}</h3>
      <p>{text}</p>
    </>
  );
  const cls = 'post-card' + (className ? ' ' + className : '');
  return to
    ? <Link className={cls + ' reveal'} to={to} data-trade={trade} hidden={hidden}>{body}<span className="link">{cta} &rarr;</span></Link>
    : <div className={cls + ' soon reveal'} data-trade={trade} hidden={hidden}>{body}<span className="soon-tag mono">Write-up in progress</span></div>;
}
