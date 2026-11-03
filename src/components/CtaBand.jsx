import { Link } from 'react-router';
import ShaderCanvas from './cad/ShaderCanvas.jsx';
import { SideRulers } from './cad/Ruler.jsx';
import DimLine from './cad/DimLine.jsx';

/** "Your next takeoff" call-to-action band that closes most pages. */
export default function CtaBand() {
  return (
    <section id="cta" className="section cta cta-band">
      <ShaderCanvas />
      <SideRulers />
      <div className="wrap center">
        <DimLine label="YOUR NEXT TAKEOFF" />
        <h2>Spend less time on the takeoff.<br />Spend more time estimating.</h2>
        <p className="lede center">Bring a drawing set and see Quantiify count it, or tell us about your estimating workflow.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/book.html">Book a demo</Link>{' '}
          <Link className="btn btn-ghost" to="/book.html#request">Request a call</Link>
        </div>
      </div>
    </section>
  );
}
