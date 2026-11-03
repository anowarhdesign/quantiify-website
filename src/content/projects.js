// Trade ("project") landing pages. Copy is sourced from quantiify.ai/solutions/*.
export const PROJECTS = [
  {
    slug: 'electrification', name: 'Electrification', photo: 'trade-electrification',
    title: 'Electrification Takeoff Software for Estimators | Quantiify',
    lede: 'Quantiify helps electrical estimating teams detect repeated components, organize counts, review locations, and prepare structured quantities from complex drawing sets.',
    qty: [['Devices and symbols', 'Identify repeated electrical components and organize counts by type, sheet, zone, or project structure.'],
      ['Lighting and fixtures', 'Prepare fixture quantities and review each detected item in the plan context.'],
      ['Linear measurements', 'Capture relevant lengths for conduit, cable pathways, and other measurable scope.'],
      ['Schedules and outputs', 'Move reviewed quantities into structured schedules for estimating and pricing.']],
    fit1: ['Commercial fit-outs and office projects.', 'Residential and mixed-use developments.', 'Institutional, healthcare, and education projects.', 'Multi-sheet electrical drawing sets and revisions.'],
    fit2: ['Commercial fit-outs and office projects.', 'Residential and mixed-use developments.', 'Institutional, healthcare, and education projects.', 'Multi-sheet electrical drawing sets and revisions.'],
  },
  {
    slug: 'sanitary-plumbing', name: 'Sanitary & plumbing', photo: 'trade-plumbing',
    title: 'Sanitary & Plumbing Takeoff Software | Quantiify',
    lede: 'Quantiify helps civil estimating teams measure areas, trace utility and pipe runs, and calculate site quantities with traceable drawing references.',
    qty: [['Linear sitework', 'Measure utilities, roads, boundaries, and other linear civil scope.'],
      ['Areas and surfaces', 'Capture relevant paved, landscaped, graded, and treatment areas.'],
      ['Site components', 'Count and organize repeated civil and site elements from the plan set.'],
      ['Calculated quantities', 'Apply project logic to reviewed measurements and prepare structured outputs.']],
    fit1: ['Commercial and residential site development.', 'Infrastructure and utility packages.', 'Roads, paving, landscaping, and external works.', 'Civil drawing sets with multiple plans, details, and revisions.'],
    fit2: ['Commercial and residential site development.', 'Infrastructure and utility packages.', 'Roads, paving, landscaping, and external works.', 'Civil drawing sets with multiple plans, details, and revisions.'],
  },
  {
    slug: 'electromechanical', name: 'Electromechanical', photo: 'trade-electromechanical',
    title: 'Electromechanical Takeoff Software for Estimators | Quantiify',
    lede: 'Quantiify helps mechanical estimators identify equipment and fixtures, measure relevant scope, organize quantities, and review every result before it moves into the estimate.',
    qty: [['Equipment and fixtures', 'Identify and organize mechanical components across plans and schedules.'],
      ['Duct and pipe measurements', 'Capture relevant linear measurements and group quantities for review.'],
      ['Areas and zones', 'Organize takeoff information by floor, zone, system, or project structure.'],
      ['Trade calculations', 'Apply workflow-specific calculations after the underlying quantity has been checked.']],
    fit1: ['HVAC and building services packages.', 'Commercial and institutional projects.', 'Multi-floor mechanical systems.', 'Drawing sets that require coordinated plan and schedule review.'],
    fit2: ['Commercial HVAC and plant installations.', 'Residential and mixed-use developments.', 'Hospitals, laboratories, and educational facilities.', 'Multi-sheet mechanical drawing sets and revisions.'],
  },
  {
    slug: 'structural-finishing', name: 'Structural & finishing', photo: 'trade-structural',
    title: 'Structural & Finishing Takeoff Software | Quantiify',
    lede: 'Quantiify helps architectural estimators extract room dimensions, wall lengths, finish areas, and door/window counts from coordinated drawing sets.',
    qty: [['Areas and finishes', 'Measure relevant floor, wall, ceiling, and finish areas from architectural drawings.'],
      ['Lengths and perimeters', 'Capture linear quantities for partitions, finishes, and other measurable elements.'],
      ['Openings and components', 'Count doors, windows, rooms, and repeated architectural elements.'],
      ['Structured schedules', 'Organize reviewed quantities for downstream BOQ, estimating, and reporting workflows.']],
    fit1: ['Commercial interiors and fit-outs.', 'Residential and mixed-use developments.', 'Hospitality, healthcare, and education projects.', 'Large drawing sets with repeated room and finish types.'],
    fit2: ['Commercial offices and retail fit-outs.', 'Residential housing and apartment schemes.', 'Institutional, education, and healthcare projects.', 'Multi-sheet architectural drawing sets and revisions.'],
  },
];

export const PROJECT_FEATURES = [
  ['AI Drawing Intelligence', 'Analyze drawings and identify key elements automatically.'],
  ['AI-Assisted Takeoff', 'Speed up counting, measuring, and quantity takeoff.'],
  ['Cross-Floor Takeoff', 'Reuse configured takeoff data across drawing floors.'],
  ['AI Quick Optimize', 'Connect quantities with relevant pricing sources and rates.'],
  ['Structured Estimation', 'Turn takeoff quantities into organized cost estimates.'],
];

export const PROJECT_WF_TEXT = 'Upload the project drawing set. Quantiify assists with detection and measurement. Your estimator reviews '
  + 'the result in drawing context, corrects what needs attention, applies relevant calculations, and approves '
  + 'the quantities that move forward.';

export const projectH1 = p => `Turn ${p.name} drawings into reviewable quantities without counting every manually`;
