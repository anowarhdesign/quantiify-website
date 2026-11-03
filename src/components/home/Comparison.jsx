import { Eyebrow, pad2 } from '../ui.jsx';
import { COMPARE_COLS, COMPARE_ROWS } from '../../content/home.js';

/** Why Quantiify: capability comparison laid out as a drawing-sheet schedule. */
export default function Comparison() {
  return (
    <section id="why" className="section">
      <div className="wrap">
        <Eyebrow sheet="S-04">Capability comparison</Eyebrow>
        <h2>Why Quantiify?</h2>
        <p className="lede left">Quantiify combines intelligent assistance with the control, flexibility, and judgment professional estimation requires.</p>
        <div className="cmp" role="table" aria-label={'Capability comparison: ' + COMPARE_COLS.join(', ')}>
          <div className="cmp-head mono" role="row">
            <div className="cmp-cap" role="columnheader">Capability</div>
            {COMPARE_COLS.map((c, i) => <div key={c} className={'cmp-c' + (i ? '' : ' q')} role="columnheader">{c}</div>)}
          </div>
          {COMPARE_ROWS.map((r, n) => (
            <div key={r.title} className="cmp-r" role="row">
              <div className="cmp-cap" role="rowheader"><span className="mono">{pad2(n + 1)}</span><div><h3>{r.title}</h3><p>{r.text}</p></div></div>
              {COMPARE_COLS.map((c, i) => (
                <div key={c} className={'cmp-c' + (i ? '' : ' q')} role="cell" data-col={c}>
                  <span className={'mk ' + (r.marks[i] ? 'yes' : 'no')} role="img" aria-label={`${c}: ${r.marks[i] ? 'yes' : 'no'}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="cmp-note mono">Comparison as published on quantiify.ai</p>
      </div>
    </section>
  );
}
