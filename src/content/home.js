// Homepage copy (sourced from quantiify.ai). FAQ and plans also feed the JSON-LD and llms.txt.
export const HOME_META = {
  title: 'AI Takeoff & Estimation Software for Construction | Quantiify',
  description: 'Quantiify reads your PDF and CAD drawings, counts and measures every element with AI, and turns reviewed quantities into priced estimates and BOQs. Book a demo.',
};

export const STATS = [
  { to: 70, suffix: '%', title: 'Less repetitive work', text: 'Automate routine takeoffs.' },
  { to: 3, suffix: '×', title: 'Faster takeoff workflow', text: 'From plans to quantities.' },
  { to: 500, suffix: '+', title: 'Projects processed', text: 'Trusted across projects.' },
  { to: 10, suffix: '+', title: 'Saved hours per project', text: 'Spend less time measuring.' },
];

export const WORKFLOW_STEPS = [
  { cmd: 'UPLOAD', title: 'Upload', short: 'Add construction document for your project.', text: 'Bring in your drawings. Add construction documents for your project across approved PDF and CAD formats.' },
  { cmd: 'ANALYZE', title: 'Analyze', short: 'Let Quantiify understand the drawing set.', text: 'The system processes and classifies documents, organizes sheets, and prepares relevant takeoff information using AI assistance.' },
  { cmd: 'TAKEOFF', title: 'Takeoff', short: 'Count and measure what matters.', text: 'Use AI-assisted tools to identify components, count symbols, and perform relevant linear and area measurements.' },
  { cmd: 'ESTIMATE', title: 'Estimate', short: 'Turn quantities into estimating information.', text: 'Apply project and trade calculations using estimation datasets to move beyond raw counts and generate the BOQ.' },
  { cmd: 'EXPORT', title: 'Export', short: 'Take reviewed quantities forward.', text: 'Generate structured BOQ and schedule outputs for estimating, pricing, reporting, and downstream workflows.' },
];

export const COMPARE_COLS = ['Quantiify', 'STACK', 'Bluebeam', 'Togal.AI'];
export const COMPARE_ROWS = [
  { title: 'AI + human control', text: 'Let AI handle repetitive takeoff work while you review, edit, and stay in control.', marks: [1, 0, 0, 1] },
  { title: 'Fewer workflow handoffs', text: 'Keep takeoff, calculations, and pricing in one workflow.', marks: [1, 0, 0, 0] },
  { title: 'Faster reviewed quantities', text: 'Let AI prepare quantities for quick estimator review.', marks: [1, 1, 0, 1] },
  { title: 'Connected calculations', text: 'Turn takeoff quantities into calculations without switching tools.', marks: [1, 0, 0, 0] },
  { title: 'Integrated pricing workflow', text: 'Find, configure, and apply project rates faster.', marks: [1, 1, 0, 0] },
];

export const AUDIENCE = [
  { title: 'Engineers & estimators', text: 'Reviewed quantities and estimates, with precision.' },
  { title: 'Project managers & contractors', text: 'Faster pricing while keeping cost control.' },
  { title: 'Owners & industrialists', text: 'Transparent, data-driven BOQs and budgets.' },
  { title: 'Consultants & developers', text: 'Print-ready cost estimates and BOQs with fewer errors.' },
];

export const STORIES = [
  { big: '3 days → 6 hrs', who: 'Electrical contractor', quote: 'We cut takeoff time from 3 days to under 6 hours and now bid 3× more projects monthly. It has transformed our estimation throughput with reliable accuracy. Their customer support assisted our setup from day one. I wholeheartedly recommend Quantiify!' },
  { big: '95%+', who: 'Civil estimator', quote: 'The adaptive symbol recognition delivered 95%+ accuracy on complex drawing sets. It has completely transformed our takeoff consistency. Their customer support and trade logic are outstanding. I highly recommend them to any infrastructure firm!' },
  { big: '½ prep time', who: 'Quantiify customer', quote: 'Quantiify has truly transformed how we handle commercial drawing sets. We cut preparation hours in half without losing estimator oversight. Their customer support is top notch, always responsive to trade needs. I highly recommend this to estimating teams!' },
  { big: 'Estimator control', who: 'Quantiify customer', quote: 'Quantiify has truly transformed our takeoff workflow. The platform prioritizes estimator control and precision, making the entire bid process seamless. Their customer support is top notch, always ready to assist with complex drawings. I highly recommend using this platform!' },
];

export const PLANS = [
  {
    name: 'Free', desc: 'Explore Quantiify and test AI-assisted workflows before scaling.', monthly: 0, annual: 0, cta: 'Start Free', variant: '',
    incTitle: "What's included:",
    inc: ['Access to all manual features', 'Access to AI-assisted features', 'Up to 3 projects', 'AI enabled for 1 project', '1 user', 'Full manual workflows'],
    lim: ['Limited AI usage', 'No team collaboration', 'Intended for evaluation (not production use)'],
  },
  {
    name: 'Basic (Team)', desc: 'Perfect for individual estimators and small contractor teams.', monthly: 299, annual: 249, cta: 'Purchase plan', variant: 'pop',
    incTitle: "What's included:",
    inc: ['Up to 10 projects', 'AI assistance on all projects', 'Up to 3 users per company', 'Full collaboration within projects', 'Manual + AI-assisted workflows', 'Standard performance limits'],
  },
  {
    name: 'Enterprise', desc: 'Built for growing organizations managing multiple projects and trades.', monthly: 899, annual: 749, cta: 'Purchase plan', variant: 'dark',
    incTitle: 'Everything in Basic (Team), plus:',
    inc: ['Unlimited projects', '5 users included', 'Full AI assistance across all projects', 'Higher AI usage limits', 'Priority performance allocation', 'Multi-project & multi-trade optimized'],
  },
];

export const FAQ = [
  { q: 'Can I use Quantiify if my estimating process still requires manual takeoff?', a: 'Yes. Quantiify supports manual, AI-assisted, and hybrid takeoff workflows. Your estimator can review, edit, override, or complete quantities rather than being forced to accept an automated result.' },
  { q: 'How does Quantiify handle projects with multiple sheets and document types?', a: 'Quantiify is designed to work with project document sets, not just isolated drawings. Your documents can be organized and processed together so the relevant sheets and information are available throughout the takeoff workflow.' },
  { q: 'Can Quantiify support different estimating logic for different trades?', a: 'Yes. Quantiify supports trade-aware workflows where components, measurement methods, calculations, review steps, and structured outputs can be aligned with electrical, mechanical, architectural, and civil estimating requirements.' },
  { q: 'Can multiple estimators or quantity surveyors collaborate on the same project?', a: 'Yes. Team plans support multiple users within the estimating workflow, allowing project work, quantity review, and approval processes to be managed across the team according to the selected plan.' },
  { q: 'Which drawing and document formats does Quantiify support?', a: 'Quantiify supports project drawing sets in approved PDF and CAD formats.' },
  { q: 'Can Quantiify generate BOQ-ready outputs for pricing and tender preparation?', a: 'Quantiify can turn reviewed quantities into structured BOQ outputs that can support pricing, reporting, and downstream tender or estimating workflows. The estimator or quantity surveyor remains responsible for reviewing and approving the final information.' },
];
