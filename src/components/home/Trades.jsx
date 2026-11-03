import { useState } from 'react';
import { Link } from 'react-router';
import BeforeAfter from '../BeforeAfter.jsx';
import { Eyebrow } from '../ui.jsx';
import { TRADES } from '../../content/trades.js';
import { asset } from '../../content/site.js';

/** What can you detect: one tab per trade, CAD vs AI takeoff slider and a sample quantity schedule. */
export default function Trades() {
  const [tab, setTab] = useState(0);
  const d = TRADES[tab];
  return (
    <section id="trades" className="section">
      <div className="wrap">
        <Eyebrow sheet="S-03">What can you detect?</Eyebrow>
        <h2>One takeoff engine, four layer sets.</h2>
        <div className="tabs" role="tablist">
          {TRADES.map((t, i) => (
            <button key={t.slug} role="tab" aria-selected={i === tab} data-tab={i} onClick={() => setTab(i)}><i style={{ '--c': t.color }} />{t.name}</button>
          ))}
        </div>
        <div className="trade">
          <div className="trade-copy">
            <BeforeAfter className="trade-photo ba-cad" label="Drag to compare the CAD drawing with Quantiify's AI takeoff"
              after={{ id: 'tradeImg', src: asset(`cad/${d.slug}-takeoff.webp`), width: '1034', height: '748', loading: 'lazy', decoding: 'async', alt: `${d.name} drawing with AI-detected elements highlighted by layer` }}
              before={{ id: 'tradeDraw', src: asset(`cad/${d.slug}-cad.webp`), width: '1034', height: '748', loading: 'lazy', decoding: 'async' }}
              tags={['CAD drawing', 'AI takeoff']} />
            <h3 id="tradeTitle">{d.name}</h3>
            <p id="tradeText">{d.text}</p>
            <Link className="link" id="tradeLink" to={`/projects/${d.slug}.html`}>Explore {d.name} &rarr;</Link>
          </div>
          <div className="sheet">
            <div className="sheet-head mono"><span>QTY SCHEDULE</span><span id="tradeSheet">SHEET {d.sheet}</span></div>
            <table>
              <thead><tr><th>Item</th><th>Layer</th><th className="r">Qty</th><th className="r">Unit</th></tr></thead>
              {/* keyed by trade so the rows re-mount and replay their entry animation */}
              <tbody id="tradeRows" key={d.slug}>
                {d.rows.map((r, k) => {
                  const delay = { animationDelay: `${k * 60}ms` };
                  return (
                    <tr key={k} className="new">
                      <td style={delay}>{r[0]}</td>
                      <td className="l" style={delay}><i style={{ '--c': d.color }} />{r[1]}</td>
                      <td className="r" style={delay}>{r[2]}</td>
                      <td className="r u" style={delay}>{r[3]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="sheet-note mono">Sample output · every line reviewable before pricing</p>
          </div>
        </div>
      </div>
    </section>
  );
}
