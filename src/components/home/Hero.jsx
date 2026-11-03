import { Link } from 'react-router';
import ShaderCanvas from '../cad/ShaderCanvas.jsx';
import { SideRulers } from '../cad/Ruler.jsx';
import DimLine from '../cad/DimLine.jsx';
import ProductTour from './ProductTour.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <ShaderCanvas />
      <SideRulers />
      <div className="wrap hero-in">
        <DimLine className="hero-dim" label="AI TAKEOFF FOR MODERN CONSTRUCTION ESTIMATORS" hidden={false} />
        <h1>Less counting.<br /><em>More estimation.</em></h1>
        <p className="lede">Quantiify uses AI to detect, count, measure, and organize information from construction drawings so your estimating team spends less time on repetitive takeoff work and more time estimating.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" to="/book.html">Book a demo</Link>{' '}
          <Link className="btn btn-ghost" to="/#workflow">How it works</Link>
        </div>
      </div>
      {/* Real product screenshots, annotated like a drawing */}
      <div className="wrap">
        <ProductTour />
      </div>
    </section>
  );
}
