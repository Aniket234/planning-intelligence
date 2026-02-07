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
        { name: 'DC1', capacity: '32MW', type: 'Data Centre' },
        { name: 'DC2', capacity: '20MW', type: 'Data Centre' },
        { name: 'MFGP', capacity: '110MW', type: 'Power' },
        { name: 'BESS', capacity: '10MW', type: 'Storage' }
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
    }
  ],
  locations: [
    { id: 'dublin-vdc', name: 'Vantage Dublin', lat: 53.31, lng: -6.42, capacity: '172MW', status: 'active', type: 'DC Campus' },
    { id: 'amsterdam', name: 'Amsterdam DC', lat: 52.37, lng: 4.89, capacity: '50MW', status: 'completed', type: 'Data Centre' }
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
