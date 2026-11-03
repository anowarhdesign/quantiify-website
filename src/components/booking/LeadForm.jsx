import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { CONTACT, FORM_ENDPOINT } from '../../content/site.js';
import { TRADE_NAMES } from '../../content/trades.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Request-a-call form. Posts JSON to FormSubmit (relayed to info@quantiify.ai), with a honeypot field.
 * Without an endpoint it falls back to a pre-filled email.
 */
export default function LeadForm({ endpoint = FORM_ENDPOINT }) {
  const formRef = useRef(null), doneRef = useRef(null);
  const [status, setStatus] = useState('');
  const [invalid, setInvalid] = useState({});
  const [sent, setSent] = useState(false);

  useEffect(() => { if (sent) doneRef.current.focus(); }, [sent]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = formRef.current, fd = new FormData(form);
    const name = (fd.get('name') || '').trim(), email = (fd.get('email') || '').trim();
    const bad = [];
    if (!name) bad.push('name');
    if (!EMAIL.test(email)) bad.push('email');
    setInvalid(Object.fromEntries(bad.map(k => [k, true])));
    if (bad.length) {
      setStatus('Please add your name and a valid work email.');
      form.elements[bad[0]].focus();
      return;
    }
    const trades = fd.getAll('trades').join(', ');
    if (endpoint) {
      setStatus('Sending…');
      try {
        const r = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            _subject: 'Quantiify demo request: ' + name, _template: 'table', _replyto: email, _honey: fd.get('_honey') || '',
            name, email, company: fd.get('company') || '-', phone: fd.get('phone') || '-', trades: trades || '-',
            message: fd.get('message') || '-', page: location.href,
          }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || String(j.success) === 'false') throw new Error(j.message || r.status);
        setSent(true);
      } catch { setStatus(`Something went wrong. Please try again or email ${CONTACT.email}.`); }
      return;
    }
    const body = [
      `Name: ${name}`, `Work email: ${email}`, `Company: ${fd.get('company') || '-'}`, `Phone: ${fd.get('phone') || '-'}`,
      `Trades: ${trades || '-'}`, '', fd.get('message') || '',
    ].join('\n');
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Quantiify demo request: ' + name)}&body=${encodeURIComponent(body)}`;
    setStatus('Opening your email app to send the request…');
  }

  return (
    <>
      <form ref={formRef} className="lead-form" id="leadForm" noValidate data-endpoint={endpoint} hidden={sent} onSubmit={onSubmit}>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }} />
        <div className="f-row">
          <label className="f"><span>Full Name</span><input name="name" type="text" autoComplete="name" placeholder="Jane Smith" required aria-invalid={invalid.name || undefined} /></label>
          <label className="f"><span>Work Email</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required aria-invalid={invalid.email || undefined} /></label>
        </div>
        <div className="f-row">
          <label className="f"><span>Company</span><input name="company" type="text" autoComplete="organization" placeholder="Company name" /></label>
          <label className="f"><span>Phone <em>(optional)</em></span><input name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" /></label>
        </div>
        <fieldset className="f chips">
          <legend>Trades you estimate <em>(optional)</em></legend>
          {TRADE_NAMES.map(t => <label key={t}><input type="checkbox" name="trades" value={t} /><span>{t}</span></label>)}
        </fieldset>
        <label className="f"><span>What would you like to discuss?</span><textarea name="message" rows="4" placeholder="Tell us about your current estimating workflow..." /></label>
        <p className="f-legal">By submitting this form, you agree that Quantiify may contact you about your request. See our <Link to="/privacy.html">Privacy Policy</Link> and <Link to="/terms.html">Terms of Service</Link> for details.</p>
        <div className="f-actions">
          <p className="f-status" id="formStatus" role="status" aria-live="polite">{status}</p>
          <button type="submit" className="btn btn-primary">Request a Call</button>
        </div>
      </form>
      <div ref={doneRef} className="form-done" id="formDone" hidden={!sent} tabIndex={-1}>
        <h3>Thanks, we&rsquo;ve got your request.</h3>
        <p>Expect a response from us within 24 hours.</p>
      </div>
    </>
  );
}
