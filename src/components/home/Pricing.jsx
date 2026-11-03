import { useState } from 'react';
import { Link } from 'react-router';
import { Eyebrow } from '../ui.jsx';
import { PLANS } from '../../content/home.js';

export default function Pricing() {
  const [bill, setBill] = useState('monthly');
  return (
    <section id="pricing" className="section section-tint">
      <div className="wrap">
        <Eyebrow sheet="S-07">Pricing</Eyebrow>
        <div className="pricing-head">
          <div>
            <h2>Simple, scalable pricing for every estimation team</h2>
            <p className="lede left">Flexible plans for solo estimators to enterprise teams. Cut manual work, speed up takeoffs, and scale without switching platforms. Pick the plan that fits your workflow.</p>
          </div>
          <div className="bill" role="group" aria-label="Billing period">
            {[['monthly', 'm', 'Monthly'], ['annual', 'a', 'Annually']].map(([key, short, label]) => (
              <button key={key} type="button" className={bill === key ? 'on' : undefined} data-bill={short} aria-pressed={bill === key} onClick={() => setBill(key)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="plans">
          {PLANS.map(p => (
            <article key={p.name} className={'plan' + (p.variant ? ' ' + p.variant : '')}>
              <h3>{p.name}</h3>
              <p className="plan-desc">{p.desc}</p>
              <p className="price"><span className="cur">$</span><span className="amt">{p[bill].toLocaleString('en-US')}</span><span className="per">/month</span></p>
              <Link className={'btn plan-cta ' + (p.variant === 'dark' ? 'btn-light' : 'btn-primary')} to="/book.html">{p.cta}</Link>
              <p className="plan-sub">{p.incTitle}</p>
              <ul className="inc">{p.inc.map(x => <li key={x}>{x}</li>)}</ul>
              {p.lim && <><p className="plan-sub">Limitations:</p><ul className="lim">{p.lim.map(x => <li key={x}>{x}</li>)}</ul></>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
