import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import ShaderCanvas from '../cad/ShaderCanvas.jsx';
import { SideRulers } from '../cad/Ruler.jsx';
import DimLine from '../cad/DimLine.jsx';
import CalEmbed from './CalEmbed.jsx';
import LeadForm from './LeadForm.jsx';
import { asset } from '../../content/site.js';

/** Book a demo: calendar or request-a-call tabs (#request opens the form). ?booth shows a QR code for booth screens. */
export default function BookingSection() {
  const { hash, search } = useLocation();
  const [tab, setTab] = useState('cal');           // the prerendered page always starts on the calendar
  const [ready, setReady] = useState(false);       // tab chosen from the URL; only then may the calendar load
  const [booth, setBooth] = useState(false);
  const sectionRef = useRef(null), calTab = useRef(null), formTab = useRef(null);

  useEffect(() => { if (hash === '#request') setTab('form'); setReady(true); }, [hash]);
  useEffect(() => { setBooth(new URLSearchParams(search).has('booth')); }, [search]);

  const onKey = e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const other = tab === 'cal' ? 'form' : 'cal';
    (other === 'cal' ? calTab : formTab).current.focus();
    setTab(other);
  };

  return (
    <section ref={sectionRef} id="book" className="section cta book-page">
      <ShaderCanvas />
      <SideRulers />
      <div className="wrap">
        <DimLine label="BOOK A QUANTIIFY DEMO" />
        <h1 className="center">Let&rsquo;s talk about your<br />estimating workflow.</h1>
        <p className="lede center">Discuss your construction takeoff, project volume, and trade requirements with the Quantiify team.</p>

        <span id="request" />
        <div className="book-switch" role="tablist" aria-label="How would you like to book?">
          <button ref={calTab} type="button" role="tab" id="tab-cal" aria-controls="panel-cal" aria-selected={tab === 'cal'} onClick={() => setTab('cal')} onKeyDown={onKey}>Book from Calendar</button>
          <button ref={formTab} type="button" role="tab" id="tab-form" data-hash="request" aria-controls="panel-form" aria-selected={tab === 'form'} onClick={() => setTab('form')} onKeyDown={onKey}>Request a Call</button>
        </div>

        <div className="book-panel" id="panel-cal" role="tabpanel" aria-labelledby="tab-cal" hidden={tab !== 'cal'}>
          <CalEmbed active={ready && tab === 'cal'} sectionRef={sectionRef} />
        </div>

        <div className="book-panel" id="panel-form" role="tabpanel" aria-labelledby="tab-form" hidden={tab !== 'form'}>
          <LeadForm />
        </div>

        <div className="qr" hidden={!booth}><img src={asset('qr-book-a-call.svg')} alt="QR code to book a Quantiify demo" /><span className="mono">SCAN &middot; BOOK A DEMO</span></div>
      </div>
    </section>
  );
}
