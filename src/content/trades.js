// The four trades ("layer sets"): nav cards, homepage tabs and sample quantity schedules.
export const TRADES = [
  {
    name: 'Electrification', slug: 'electrification', thumb: 'trade-electrification-thumb', color: '#ffd84d', sheet: 'E-101',
    blurb: 'AI-powered electrical takeoffs, from symbols to cable lengths.',
    text: 'Lighting, switches, sockets, MDB and SDB, circuits, cables, LPS, wiring and conduiting, HT/LT systems and solar installations.',
    rows: [['Lighting fixture', 'E-LITE', '148', 'NOS'], ['Switch / socket outlet', 'E-POWR', '212', 'NOS'], ['Distribution board (SDB)', 'E-PANL', '6', 'NOS'], ['PVC conduit 25 mm', 'E-COND', '1,284', 'M'], ['Cable 4C × 16 mm²', 'E-CABL', '386', 'M']],
  },
  {
    name: 'Sanitary & plumbing', slug: 'sanitary-plumbing', thumb: 'trade-plumbing-thumb', color: '#4dd3ff', sheet: 'P-201',
    blurb: 'Measure civil elements and generate accurate quantities with AI.',
    text: 'Fixtures, fittings, ETP and STP, rainwater harvesting, wastewater treatment systems, drainage networks and water supply.',
    rows: [['Water closet', 'P-FIXT', '48', 'NOS'], ['Wash basin', 'P-FIXT', '52', 'NOS'], ['uPVC drain pipe 110 mm', 'P-DRNG', '920', 'M'], ['PPR supply pipe 25 mm', 'P-WATR', '1,460', 'M'], ['Inspection chamber', 'P-DRNG', '14', 'NOS']],
  },
  {
    name: 'Electromechanical', slug: 'electromechanical', thumb: 'trade-electromechanical-thumb', color: '#4dd88a', sheet: 'M-301',
    blurb: 'Detect mechanical components and calculate quantities faster.',
    text: 'HVAC systems, fire detection and protection, security and surveillance, integrated building management (IBMS), ventilation and utilities.',
    rows: [['Supply air diffuser', 'M-HVAC', '132', 'NOS'], ['GI duct', 'M-DUCT', '2,150', 'M'], ['Smoke detector', 'F-ALRM', '186', 'NOS'], ['Sprinkler head', 'F-SPRK', '412', 'NOS'], ['CCTV camera', 'S-CCTV', '38', 'NOS']],
  },
  {
    name: 'Structural & finishing', slug: 'structural-finishing', thumb: 'trade-structural-thumb', color: '#ff4d4d', sheet: 'S-401',
    blurb: 'Measure spaces, materials, and building elements with AI.',
    text: 'Sub-structure and super-structure elements: foundations, columns, beams and slabs, plus architectural finishes.',
    rows: [['Isolated footing', 'S-FNDN', '36', 'NOS'], ['RCC column', 'S-COLS', '84', 'NOS'], ['RCC beam', 'S-BEAM', '1,120', 'M'], ['RCC slab 150 mm', 'S-SLAB', '2,860', 'M²'], ['Floor tile finish', 'A-FLOR', '2,410', 'M²']],
  },
];

export const TRADE_NAMES = TRADES.map(t => t.name);
