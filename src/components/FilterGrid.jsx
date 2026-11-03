import { useState } from 'react';
import { TRADE_NAMES } from '../content/trades.js';

/** Trade filter chips over a card grid (blog, case studies). `render(item, hidden)` draws one card. */
export default function FilterGrid({ items, render }) {
  const [filter, setFilter] = useState('all');
  return (
    <>
      <div className="filters mono" role="group" aria-label="Filter by trade">
        {['all', ...TRADE_NAMES].map(t => (
          <button key={t} type="button" data-filter={t} className={filter === t ? 'on' : undefined} onClick={() => setFilter(t)}>{t === 'all' ? 'All' : t}</button>
        ))}
      </div>
      <div className="post-grid" data-filter-grid="">
        {items.map((item, i) => render(item, filter !== 'all' && item.trade !== filter, i))}
      </div>
    </>
  );
}
