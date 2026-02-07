export const demoSystemData = {
  operator: {
    name: 'ANIKET LATPATE',
    role: 'REGIONAL PLANNING LEAD',
    company: 'VANTAGE DATA CENTERS',
    email: 'latpate.aniket92@gmail.com',
    phone: '+353 894451882',
    location: 'Dublin, Ireland'
  },
  careerProgression: [
    { year: '2017', value: 50, complexity: 30 },
    { year: '2019', value: 150, complexity: 55 },
    { year: '2021', value: 350, complexity: 75 },
    { year: '2023', value: 750, complexity: 85 },
    { year: '2025', value: 1500, complexity: 95 }
  ],
  capabilityRadar: [
    { capability: 'Planning', value: 95 },
    { capability: 'Analysis', value: 90 },
    { capability: 'Reporting', value: 88 },
    { capability: 'Governance', value: 92 },
    { capability: 'Technical', value: 85 },
    { capability: 'Leadership', value: 88 }
  ],
  careerTimeline: [
    {
      id: 'vantage',
      company: 'Vantage Data Centers',
      role: 'Regional Planning Lead – EMEA',
      period: 'May 2025 – Present',
      location: 'Dublin (Grangecastle), Ireland',
      type: 'current',
      logo: '🏢',
      headline: 'Dublin Campus (4 Projects) – Portfolio planning and delivery governance',
      bullets: [
        'Dublin Campus: 2 Data Centres + Multifuel Generation Plant (MFGP) + BESS',
        'DC1: 32MW • DC2: 20MW • MFGP: 110MW • BESS: 10MW',
        'Integrated Master Schedule (IMS), risk integration, stakeholder alignment'
      ]
    },
    {
      id: 'jpc',
      company: 'John Paul Construction',
      role: 'MEP Planning Lead',
      period: 'Jul 2024 – May 2025',
      location: 'Ireland',
      type: 'past',
      logo: '🏗️',
      headline: 'Multi-sector planning across data centres, pharma, residential and commercial',
      bullets: [
        '12 Projects in Dublin',
        'Drogheda: 2 Data Centres (DC1 48MW, DC2 48MW)',
        'Pharma: Limerick + Cork • Residential: 5 • Commercial: 3'
      ]
    },
    {
      id: 'puredc',
      company: 'Pure Data Centres',
      role: 'Planning Manager',
      period: 'Sep 2022 – Jul 2024',
      location: 'Dublin (Ballycoolin), Ireland',
      type: 'past',
      logo: '💾',
      headline: 'Hyperscale delivery planning for a 2‑building campus',
      bullets: [
        'Ballycoolin: DC1 20MW • DC2 20MW',
        'Baseline / update cycles, change control and reporting',
        'Commissioning readiness and handover tracking'
      ]
    },
    {
      id: 'mercury',
      company: 'Mercury Engineering',
      role: 'Project Planner',
      period: 'Sep 2019 – Sep 2022',
      location: 'Ireland + Europe',
      type: 'past',
      logo: '⚡',
      headline: 'MEP planning across DC, pharma and healthcare projects',
      bullets: [
        'Pharma: Dundalk • Hospital: Dublin',
        'Dublin (Grangecastle): DC1 20MW • DC2 30MW (Electrical contract)',
        'EU DCs: Amsterdam 50MW • Paris 32MW (Electrical) • Warsaw 48MW (E,M,ICT)'
      ]
    }
  ],

  programmes: [
    {
      id: 'vantage',
      name: 'VANTAGE DATA CENTERS',
      shortName: 'VDC',
      role: 'Regional Planning Lead',
      period: 'May 2025 – Present',
      status: 'ACTIVE',
      value: 1500,
      totalCapacity: '172MW',
      location: { city: 'Dublin', area: 'Grangecastle', country: 'Ireland' },
      projects: [
        { name: 'Dublin Campus', capacity: '4 Projects', type: 'Campus' },
        { name: 'DC1', capacity: '32MW', type: 'Data Centre' },
        { name: 'DC2', capacity: '20MW', type: 'Data Centre' },
        { name: 'MFGP', capacity: '110MW', type: 'Generation Plant' },
        { name: 'BESS', capacity: '10MW', type: 'Battery Storage' }
      ],
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 95 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 88 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 72 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 35 }
      ],
      workstreamTimeline: [
        { month: 'Jan', design: 85, procurement: 70, construction: 45, commissioning: 10 },
        { month: 'Feb', design: 88, procurement: 75, construction: 52, commissioning: 15 },
        { month: 'Mar', design: 90, procurement: 80, construction: 58, commissioning: 20 },
        { month: 'Jun', design: 95, procurement: 88, construction: 72, commissioning: 35 }
      ],
      risks: [
        { id: 'r1', title: 'Generator Delivery', probability: 35, impact: 85 },
        { id: 'r2', title: 'Grid Connection', probability: 20, impact: 95 },
        { id: 'r3', title: 'Commissioning Access', probability: 30, impact: 60 }
      ],
      monteCarlo: { distribution: [
        { days: -20, probability: 2 },
        { days: -10, probability: 12 },
        { days: 0, probability: 25 },
        { days: 10, probability: 12 },
        { days: 20, probability: 3 }
      ]},
      decisions: [
        {
          id: 'd1',
          title: 'IMS RESTRUCTURE',
          date: '2025-06',
          context: 'Facilities on independent paths',
          intervention: 'Integrated Master Schedule',
          impact: 'Protected RFS',
          counterfactual: '€4.2M exposure',
          metrics: { costAvoided: 4200000 }
        }
      ]
    },
    {
      id: 'jpc',
      name: 'JOHN PAUL CONSTRUCTION',
      shortName: 'JPC',
      role: 'MEP Planning Lead',
      period: 'Jul 2024 – May 2025',
      status: 'COMPLETED',
      value: 500,
      totalCapacity: '96MW+',
      location: { city: 'Dublin', country: 'Ireland' },
      projects: [
        { name: 'Dublin (12 Projects)', capacity: '12', type: 'Mixed' },
        { name: 'Drogheda DC1', capacity: '48MW', type: 'Data Centre' },
        { name: 'Drogheda DC2', capacity: '48MW', type: 'Data Centre' },
        { name: 'Pharma (Limerick)', capacity: '1', type: 'Pharma' },
        { name: 'Pharma (Cork)', capacity: '1', type: 'Pharma' },
        { name: 'Residential', capacity: '5', type: 'Residential' },
        { name: 'Commercial', capacity: '3', type: 'Commercial' }
      ],
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 100 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 100 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 100 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }
      ],
      workstreamTimeline: [
        { month: 'Q1', design: 100, procurement: 100, construction: 100, commissioning: 95 },
        { month: 'Q2', design: 100, procurement: 100, construction: 100, commissioning: 100 }
      ],
      risks: [],
      monteCarlo: { distribution: [
        { days: -10, probability: 5 },
        { days: 0, probability: 40 },
        { days: 10, probability: 10 }
      ]},
      decisions: [
        {
          id: 'd1',
          title: 'RESOURCE LEVELLING',
          date: '2024-09',
          context: 'Cross-project resource conflicts',
          intervention: 'Cross-project planning matrix',
          impact: 'Reduced interfaces and improved predictability',
          counterfactual: 'Multiple overlapping critical paths',
          metrics: { costAvoided: 1800000 }
        }
      ]
    },
    {
      id: 'puredc',
      name: 'PURE DATA CENTRES',
      shortName: 'PDC',
      role: 'Planning Manager',
      period: 'Sep 2022 – Jul 2024',
      status: 'COMPLETED',
      value: 550,
      totalCapacity: '40MW',
      location: { city: 'Dublin', area: 'Ballycoolin', country: 'Ireland' },
      projects: [
        { name: 'Ballycoolin DC1', capacity: '20MW', type: 'Data Centre' },
        { name: 'Ballycoolin DC2', capacity: '20MW', type: 'Data Centre' }
      ],
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 100 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 100 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 100 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }
      ],
      workstreamTimeline: [
        { month: 'Y1', design: 100, procurement: 90, construction: 70, commissioning: 40 },
        { month: 'Y2', design: 100, procurement: 100, construction: 100, commissioning: 100 }
      ],
      risks: [],
      monteCarlo: { distribution: [
        { days: -14, probability: 4 },
        { days: 0, probability: 35 },
        { days: 14, probability: 8 }
      ]},
      decisions: [
        {
          id: 'd1',
          title: 'CP RESEQUENCE',
          date: '2023-03',
          context: 'Permit delay pressure',
          intervention: 'Resequenced works + logic repairs',
          impact: 'Absorbed delay without moving key milestones',
          counterfactual: '8 week slip',
          metrics: { costAvoided: 6500000 }
        }
      ]
    },
    {
      id: 'mercury',
      name: 'MERCURY ENGINEERING',
      shortName: 'MER',
      role: 'Project Planner',
      period: 'Sep 2019 – Sep 2022',
      status: 'COMPLETED',
      value: 459,
      totalCapacity: '180MW+',
      location: { city: 'Multiple', country: 'Europe' },
      projects: [
        { name: 'Dundalk Pharma', capacity: '1', type: 'Pharma' },
        { name: 'Dublin Hospital', capacity: '1', type: 'Healthcare' },
        { name: 'Dublin DC1', capacity: '20MW', type: 'Data Centre (Electrical)' },
        { name: 'Dublin DC2', capacity: '30MW', type: 'Data Centre (Electrical)' },
        { name: 'Amsterdam DC', capacity: '50MW', type: 'Data Centre' },
        { name: 'Paris DC', capacity: '32MW', type: 'Data Centre (Electrical)' },
        { name: 'Warsaw DC', capacity: '48MW', type: 'Data Centre (E,M,ICT)' }
      ],
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 100 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 100 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 100 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }
      ],
      workstreamTimeline: [
        { month: 'Y1', design: 85, procurement: 70, construction: 45, commissioning: 15 },
        { month: 'Y2', design: 100, procurement: 95, construction: 85, commissioning: 60 },
        { month: 'Y3', design: 100, procurement: 100, construction: 100, commissioning: 100 }
      ],
      risks: [],
      monteCarlo: { distribution: [
        { days: -21, probability: 3 },
        { days: 0, probability: 28 },
        { days: 21, probability: 7 }
      ]},
      decisions: [
        {
          id: 'd1',
          title: 'EVM IMPLEMENTATION',
          date: '2020-06',
          context: 'No consistent baseline controls',
          intervention: 'P6/Excel earned value reporting framework',
          impact: 'IBR-ready controls and clearer forecasting',
          counterfactual: 'Reactive reporting',
          metrics: { costAvoided: 1200000 }
        }
      ]
    }
  ],

  locations: [
    { id: 'dublin-vdc', name: 'Dublin – Grangecastle (VDC)', lat: 53.31, lng: -6.42, capacity: '172MW', status: 'active', type: 'DC Campus' },
    { id: 'dublin-ballycoolin', name: 'Dublin – Ballycoolin (PDC)', lat: 53.42, lng: -6.36, capacity: '40MW', status: 'completed', type: 'Data Centre' },
    { id: 'drogheda', name: 'Drogheda (JPC)', lat: 53.72, lng: -6.35, capacity: '96MW', status: 'completed', type: 'Data Centre' },
    { id: 'amsterdam', name: 'Amsterdam DC', lat: 52.37, lng: 4.89, capacity: '50MW', status: 'completed', type: 'Data Centre' },
    { id: 'paris', name: 'Paris DC', lat: 48.86, lng: 2.35, capacity: '32MW', status: 'completed', type: 'Data Centre' },
    { id: 'warsaw', name: 'Warsaw DC', lat: 52.23, lng: 21.01, capacity: '48MW', status: 'completed', type: 'Data Centre' }
  ]
};

export const qsraChecks = [
  { id: '1', name: 'FS Relationships', threshold: '>=70%' },
  { id: '2', name: 'Missing Logic', threshold: '<=1' },
  { id: '3', name: 'Leads', threshold: '=0%' },
  { id: '4', name: 'Lags', threshold: '<15%' },
  { id: '5', name: 'Hard Constraints', threshold: '=0' },
  { id: '6', name: 'Soft Constraints', threshold: '<10%' },
  { id: '7', name: 'High Duration', threshold: '<10%' },
  { id: '8', name: 'Negative Float', threshold: '=0%' },
  { id: '9', name: 'High Float', threshold: '<10%' },
  { id: '10', name: 'Resources', threshold: '>90%' }
];

export const dcmaChecks = [
  { id: 1, name: 'Logic', threshold: '< 5%' },
  { id: 2, name: 'Leads', threshold: '= 0%' },
  { id: 3, name: 'Lags', threshold: '< 5%' },
  { id: 4, name: 'Relationships', threshold: '< 10%' },
  { id: 5, name: 'Constraints', threshold: '< 5%' },
  { id: 6, name: 'High Float', threshold: '< 5%' },
  { id: 7, name: 'Neg Float', threshold: '= 0%' },
  { id: 8, name: 'High Duration', threshold: '< 5%' },
  { id: 9, name: 'Invalid Dates', threshold: '= 0%' },
  { id: 10, name: 'Resources', threshold: '< 5%' },
  { id: 11, name: 'Missed Tasks', threshold: '< 5%' },
  { id: 12, name: 'Critical Path', threshold: '> 95%' },
  { id: 13, name: 'CPLI', threshold: '> 1.0' },
  { id: 14, name: 'BEI', threshold: '> 0.95' }
];
