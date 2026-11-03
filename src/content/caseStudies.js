// Case studies. Only the electrical one is written up (text from quantiify.ai); the rest show as "in progress".
import electrical from './case-studies/simplifying-electrical-estimating.json';

export const CASES_META = {
  title: 'Case Studies · Quantiify',
  description: 'See how construction teams use Quantiify to simplify drawing analysis, accelerate takeoff, and build more connected estimating workflows.',
};

export const CASES = [
  { slug: 'simplifying-electrical-estimating', trade: 'Electrification', title: 'Simplifying electrical estimating from drawings',
    deck: 'How Quantiify helps estimators turn electrical drawing pages into structured quantities and cost estimates.',
    img: 'cad/electrification-takeoff.webp', imgAlt: 'Electrical layout with AI-detected elements', caption: 'Electrical layout plan',
    sections: electrical },
  { slug: '', trade: 'Electromechanical', title: 'Streamlining mechanical & HVAC drawing takeoffs',
    deck: 'How mechanical estimating teams extract piping, ductwork, and equipment quantities directly from drawing schedules.',
    img: 'cad/electromechanical-takeoff.webp' },
  { slug: '', trade: 'Structural & finishing', title: 'Accelerating architectural & finish quantities',
    deck: 'Organizing area, perimeter, room finishes, and opening counts across coordinated architectural sheet sets.',
    img: 'cad/structural-finishing-takeoff.webp' },
  { slug: '', trade: 'Sanitary & plumbing', title: 'Precision civil sitework takeoff from coordinated plans',
    deck: 'Calculating sitework, grading, paving, and underground utility quantities with full drawing traceability.',
    img: 'cad/sanitary-plumbing-takeoff.webp' },
];

export const CASE_LEARN = [
  'Client and project context.',
  'The previous takeoff workflow and its constraints.',
  'The Quantiify workflow used for the project.',
  'How quantities were reviewed, corrected, and approved.',
];

export const APPROACH_CHAIN = ['Upload', 'Analyze', 'Takeoff', 'Estimate', 'Export'];
