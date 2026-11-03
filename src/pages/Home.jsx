import Hero from '../components/home/Hero.jsx';
import Results from '../components/home/Results.jsx';
import Workflow from '../components/home/Workflow.jsx';
import Trades from '../components/home/Trades.jsx';
import Comparison from '../components/home/Comparison.jsx';
import Audience from '../components/home/Audience.jsx';
import Stories from '../components/home/Stories.jsx';
import Pricing from '../components/home/Pricing.jsx';
import Faq from '../components/home/Faq.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { RulerRow } from '../components/cad/Ruler.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <RulerRow />
      <Results />
      <Workflow />
      <Trades />
      <Comparison />
      <Audience />
      <Stories />
      <Pricing />
      <CtaBand />
      <Faq />
    </>
  );
}
