import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Target, Zap, Shield, Activity, Globe, Layers, GitBranch, ChevronRight, FileText, Settings, Upload, Scale, Clock, AlertCircle, CheckSquare, XSquare, HelpCircle, Send, X, Bot, User, Sparkles, Briefcase, GraduationCap, MapPin, Calendar, Download, ExternalLink } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const systemData = {
  operator: { 
    name: 'ANIKET LATPATE', 
    role: 'REGIONAL PLANNING LEAD', 
    company: 'VANTAGE DATA CENTERS',
    region: 'EMEA', 
    yearsExperience: 8,
    email: 'latpate.aniket92@gmail.com',
    phone: '+353 894451882',
    linkedin: 'linkedin.com/in/aniket-latpate',
    location: 'Dublin, Ireland'
  },
  
  metrics: { portfolioValue: 3000, totalCapacity: 458, projectsDelivered: 35, onTimeDelivery: 94, countries: 6 },

  careerTimeline: [
    { id: 'vantage', company: 'Vantage Data Centers', role: 'Regional Planning Lead – EMEA', period: 'May 2025 - Present', location: 'Dublin, Ireland', type: 'current', logo: '🏢', description: 'Portfolio-level planning, controls, and governance across hyperscale data center developments in Ireland and the UK.', highlights: ['Managing Integrated Master Schedule for Dublin portfolio (€1.5B+)', 'Overseeing 4 major projects: 2 Data Centres, MFGP, and BESS', 'Line managing team of planners across multiple projects'], value: 1500, projects: 4 },
    { id: 'jpc', company: 'John Paul Construction', role: 'MEP Planning Lead', period: 'July 2024 - May 2025', location: 'Dublin, Ireland', type: 'past', logo: '🏗️', description: 'Led MEP planning across multiple construction projects including data centres, pharma, residential, and commercial sectors.', highlights: ['Managed 21+ projects simultaneously across Ireland', 'Coordinated resources across labor, materials, and equipment'], value: 500, projects: 21 },
    { id: 'puredc', company: 'Pure DC Global', role: 'Planning Manager', period: 'Sept 2022 - July 2024', location: 'Dublin, Ireland', type: 'past', logo: '💾', description: 'Project planning and controls for hyperscale data centre development.', highlights: ['Managed €550M+ data centre project', 'Implemented Power BI and Power Apps for analytics'], value: 550, projects: 2 },
    { id: 'mercury', company: 'Mercury Engineering', role: 'Project Planner', period: 'Sept 2019 - Sept 2022', location: 'Dublin, Ireland', type: 'past', logo: '⚡', description: 'Project scheduling for Data Centre, Healthcare, and Pharmaceutical projects across Europe.', highlights: ['Managed schedules totaling €459M+ across 6 countries', 'Implemented EVM, S-Curve, and DCMA Analysis'], value: 459, projects: 7 },
    { id: 'ace', company: 'ACE Electricals', role: 'Maintenance Engineer', period: 'May 2017 - July 2018', location: 'Mumbai, India', type: 'past', logo: '🔌', description: 'High voltage switchgear operations and maintenance.', highlights: ['Operated 22kV high voltage switchgear'], value: 50, projects: 1 }
  ],

  education: [
    { degree: 'MSc. Sustainable Energy & Green Technologies', institution: 'University College Dublin', year: '2018-2019', grade: '2:1 | NFQ Level 9', logo: '🎓' },
    { degree: 'B.E Electrical Engineering', institution: 'University of Mumbai', year: '2016', logo: '🎓' },
    { degree: 'Diploma in Electrical Engineering', institution: 'Dr. B.A.T University', year: '2011', logo: '📜' }
  ],

  programmes: [
    {
      id: 'vantage', name: 'VANTAGE DATA CENTERS', shortName: 'VDC', role: 'Regional Planning Lead – EMEA',
      period: 'May 2025 – Present', status: 'ACTIVE', value: 1500, totalCapacity: '172MW',
      location: { city: 'Dublin', area: 'Grangecastle', country: 'Ireland' },
      projects: [
        { name: 'DC1 - Data Centre', capacity: '32MW', type: 'Data Centre' },
        { name: 'DC2 - Data Centre', capacity: '20MW', type: 'Data Centre' },
        { name: 'MFGP - Generation Plant', capacity: '110MW', type: 'Power' },
        { name: 'BESS - Energy Storage', capacity: '10MW', type: 'Storage' }
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
        { month: 'Apr', design: 92, procurement: 83, construction: 64, commissioning: 25 },
        { month: 'May', design: 94, procurement: 86, construction: 70, commissioning: 32 },
        { month: 'Jun', design: 95, procurement: 88, construction: 72, commissioning: 35 }
      ],
      risks: [
        { id: 'r1', title: 'Generator Delivery', probability: 35, impact: 85 },
        { id: 'r2', title: 'Grid Connection', probability: 20, impact: 95 },
        { id: 'r3', title: 'Cx Engineers', probability: 45, impact: 60 }
      ],
      monteCarlo: { distribution: [{ days: -20, probability: 2 }, { days: -15, probability: 5 }, { days: -10, probability: 12 }, { days: -5, probability: 18 }, { days: 0, probability: 25 }, { days: 5, probability: 18 }, { days: 10, probability: 12 }, { days: 15, probability: 5 }, { days: 20, probability: 3 }] },
      decisions: [
        { id: 'd1', title: 'IMS RESTRUCTURE', date: '2025-06', context: 'Naive schedule showed facilities on independent paths', intervention: 'Integrated Master Schedule with shared milestones', impact: 'Protected RFS by identifying 47 dependencies', counterfactual: '3-month clash, €4.2M exposure', metrics: { costAvoided: 4200000 } },
        { id: 'd2', title: 'CX PARALLELISATION', date: '2025-08', context: 'Sequential commissioning showed 6-week overrun', intervention: 'Parallelised Cx across independent systems', impact: 'Absorbed vendor delay', counterfactual: 'Critical path breach', metrics: { costAvoided: 2800000 } }
      ]
    },
    {
      id: 'jpc', name: 'JOHN PAUL CONSTRUCTION', shortName: 'JPC', role: 'MEP Planning Lead',
      period: 'July 2024 – May 2025', status: 'COMPLETED', value: 500, totalCapacity: '96MW+',
      location: { city: 'Dublin', country: 'Ireland' },
      projects: [
        { name: 'Dublin Projects (12)', capacity: 'Various', type: 'Mixed' },
        { name: 'Drogheda DC1', capacity: '48MW', type: 'Data Centre' },
        { name: 'Drogheda DC2', capacity: '48MW', type: 'Data Centre' },
        { name: 'Limerick Pharma', capacity: 'N/A', type: 'Pharma' },
        { name: 'Cork Pharma', capacity: 'N/A', type: 'Pharma' },
        { name: 'Residential (5)', capacity: 'N/A', type: 'Residential' },
        { name: 'Commercial (3)', capacity: 'N/A', type: 'Commercial' }
      ],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'RESOURCE LEVELLING', date: '2024-09', context: 'Multiple projects competing for resources', intervention: 'Cross-project levelling matrix', impact: 'Eliminated conflicts', counterfactual: 'Delays on 4+ projects', metrics: { costAvoided: 1800000 } }]
    },
    {
      id: 'puredc', name: 'PURE DC GLOBAL', shortName: 'PDC', role: 'Planning Manager',
      period: 'Sept 2022 – July 2024', status: 'COMPLETED', value: 550, totalCapacity: '40MW',
      location: { city: 'Dublin', area: 'Ballycoolin', country: 'Ireland' },
      projects: [{ name: 'Ballycoolin DC1', capacity: '20MW', type: 'Data Centre' }, { name: 'Ballycoolin DC2', capacity: '20MW', type: 'Data Centre' }],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'CP RESEQUENCE', date: '2023-03', context: 'Permit delay created 8-week breach', intervention: 'Resequenced non-permit works', impact: 'Absorbed delay', counterfactual: 'RFS slip 8 weeks', metrics: { costAvoided: 6500000 } }]
    },
    {
      id: 'mercury', name: 'MERCURY ENGINEERING', shortName: 'MER', role: 'Project Planner',
      period: 'Sept 2019 – Sept 2022', status: 'COMPLETED', value: 459, totalCapacity: '180MW',
      location: { city: 'Multiple', country: 'Europe' },
      projects: [
        { name: 'Dundalk Pharma', capacity: 'N/A', type: 'Pharma', location: 'Ireland' },
        { name: 'Dublin Hospital', capacity: 'N/A', type: 'Healthcare', location: 'Ireland' },
        { name: 'Grangecastle DC1', capacity: '20MW', type: 'DC (Elec)', location: 'Dublin' },
        { name: 'Grangecastle DC2', capacity: '30MW', type: 'DC (Elec)', location: 'Dublin' },
        { name: 'Amsterdam DC', capacity: '50MW', type: 'Data Centre', location: 'Netherlands' },
        { name: 'Paris DC', capacity: '32MW', type: 'DC (Elec)', location: 'France' },
        { name: 'Warsaw DC', capacity: '48MW', type: 'DC (E&M+ICT)', location: 'Poland' }
      ],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'EVM IMPLEMENTATION', date: '2020-06', context: 'Client required EV reporting', intervention: 'P6/Excel EVM system', impact: 'IBR approval', counterfactual: 'Reactive reporting', metrics: { costAvoided: 1200000 } }]
    }
  ],

  locations: [
    { id: 'dublin-vdc', name: 'Vantage Dublin', lat: 53.31, lng: -6.42, capacity: '172MW', value: 1500, status: 'active', type: 'DC Campus' },
    { id: 'drogheda', name: 'Drogheda DCs', lat: 53.72, lng: -6.35, capacity: '96MW', value: 150, status: 'completed', type: 'Data Centre' },
    { id: 'dublin-pdc', name: 'Pure DC', lat: 53.41, lng: -6.35, capacity: '40MW', value: 550, status: 'completed', type: 'Data Centre' },
    { id: 'amsterdam', name: 'Amsterdam DC', lat: 52.37, lng: 4.89, capacity: '50MW', value: 80, status: 'completed', type: 'Data Centre' },
    { id: 'paris', name: 'Paris DC', lat: 48.86, lng: 2.35, capacity: '32MW', value: 60, status: 'completed', type: 'Data Centre' },
    { id: 'warsaw', name: 'Warsaw DC', lat: 52.23, lng: 21.01, capacity: '48MW', value: 70, status: 'completed', type: 'Data Centre' },
    { id: 'limerick', name: 'Limerick Pharma', lat: 52.67, lng: -8.63, capacity: 'N/A', value: 30, status: 'completed', type: 'Pharma' },
    { id: 'cork', name: 'Cork Pharma', lat: 51.90, lng: -8.47, capacity: 'N/A', value: 30, status: 'completed', type: 'Pharma' },
    { id: 'dundalk', name: 'Dundalk Pharma', lat: 54.00, lng: -6.42, capacity: 'N/A', value: 40, status: 'completed', type: 'Pharma' }
  ],

  careerProgression: [
    { year: '2017', value: 50, complexity: 30 }, { year: '2019', value: 150, complexity: 55 },
    { year: '2020', value: 250, complexity: 65 }, { year: '2021', value: 350, complexity: 75 },
    { year: '2022', value: 550, complexity: 80 }, { year: '2023', value: 750, complexity: 85 },
    { year: '2024', value: 1000, complexity: 90 }, { year: '2025', value: 1500, complexity: 95 }
  ],

  capabilityRadar: [{ capability: 'Planning', value: 95 }, { capability: 'Analysis', value: 90 }, { capability: 'Reporting', value: 88 }, { capability: 'Governance', value: 92 }, { capability: 'Technical', value: 85 }, { capability: 'Leadership', value: 88 }],
  
  capabilities: {
    planning: { score: 95, tools: ['Primavera P6', 'MS Project', 'Synchro 4D', 'Openspace'] },
    analysis: { score: 90, tools: ['EVM', 'DCMA 14-Point', 'Monte Carlo', 'S-Curve'] },
    reporting: { score: 88, tools: ['Power BI', 'Power Apps', 'Excel'] },
    governance: { score: 92, tools: ['IMS', 'IBR', 'EOT Analysis', 'Delay Forensics'] }
  }
};

const qsraChecks = [
  { id: '1a', name: 'FS Relationships', desc: 'Min 90% FS with 0d lag', threshold: '≥70%', category: 'Logic' },
  { id: '1b', name: 'SF Relationships', desc: 'No SF relationships', threshold: '=0', category: 'Logic' },
  { id: '2a', name: 'Missing Predecessors', desc: 'Only first lacks predecessor', threshold: '≤1', category: 'Logic' },
  { id: '2b', name: 'Missing Successors', desc: 'Only last lacks successor', threshold: '≤1', category: 'Logic' },
  { id: '3', name: 'Lead Relationships', desc: '0% leads', threshold: '=0%', category: 'Logic' },
  { id: '4', name: 'Lag Relationships', desc: '<15% have lags', threshold: '<15%', category: 'Logic' },
  { id: '5', name: 'Excessive Lags', desc: 'Lags >10% duration', threshold: '<5%', category: 'Logic' },
  { id: '6a', name: 'Hard Constraints', desc: 'No hard constraints', threshold: '=0', category: 'Constraints' },
  { id: '6b', name: 'Soft Constraints', desc: '<10% constrained', threshold: '<10%', category: 'Constraints' },
  { id: '7', name: 'Excessive Durations', desc: '<10% >20d', threshold: '<10%', category: 'Duration' },
  { id: '8', name: 'Negative Float', desc: '0% negative float', threshold: '=0%', category: 'Float' },
  { id: '9', name: 'Critical Float', desc: '5-15% have 0-15d', threshold: '5-15%', category: 'Float' },
  { id: '10', name: 'Excessive Float', desc: '<10% >40d float', threshold: '<10%', category: 'Float' },
  { id: '11a', name: 'Invalid Planned', desc: '0% in past', threshold: '=0%', category: 'Dates' },
  { id: '11b', name: 'Invalid Actual', desc: '0% in future', threshold: '=0%', category: 'Dates' },
  { id: '12', name: 'Riding Data Date', desc: '<5% on DD', threshold: '<5%', category: 'Dates' },
  { id: '13', name: 'Resource Loaded', desc: '>90% resourced', threshold: '>90%', category: 'Resources' }
];

const dcmaChecks = [
  { id: 1, name: 'Logic', desc: 'Missing pred/succ', threshold: '< 5%' },
  { id: 2, name: 'Leads', desc: 'Negative lag', threshold: '= 0%' },
  { id: 3, name: 'Lags', desc: 'Lags present', threshold: '< 5%' },
  { id: 4, name: 'Relationship Types', desc: 'Non-FS', threshold: '< 10%' },
  { id: 5, name: 'Hard Constraints', desc: 'Constraints', threshold: '< 5%' },
  { id: 6, name: 'High Float', desc: '>44 days', threshold: '< 5%' },
  { id: 7, name: 'Negative Float', desc: 'Neg float', threshold: '= 0%' },
  { id: 8, name: 'High Duration', desc: '>44 days', threshold: '< 5%' },
  { id: 9, name: 'Invalid Dates', desc: 'Bad dates', threshold: '= 0%' },
  { id: 10, name: 'Resources', desc: 'Unresourced', threshold: '< 5%' },
  { id: 11, name: 'Missed Tasks', desc: 'Past incomplete', threshold: '< 5%' },
  { id: 12, name: 'CP Test', desc: 'CP vs duration', threshold: '> 95%' },
  { id: 13, name: 'CPLI', desc: 'CP Length Index', threshold: '> 1.0' },
  { id: 14, name: 'BEI', desc: 'Baseline Exec', threshold: '> 0.95' }
];

const delayMethods = [
  { id: 'impacted', name: 'Impacted As-Planned', type: 'Prospective', complexity: 'Low', defensibility: 'Medium', desc: 'Inserts delays into baseline' },
  { id: 'collapsed', name: 'Collapsed As-Built', type: 'Retrospective', complexity: 'High', defensibility: 'High', desc: 'Removes delays from as-built' },
  { id: 'tia', name: 'Time Impact Analysis', type: 'Prospective', complexity: 'High', defensibility: 'High', desc: 'Contemporaneous analysis' },
  { id: 'windows', name: 'Windows Analysis', type: 'Retrospective', complexity: 'Very High', defensibility: 'Very High', desc: 'Period-by-period analysis' },
  { id: 'asplanned', name: 'As-Planned vs As-Built', type: 'Retrospective', complexity: 'Medium', defensibility: 'Medium', desc: 'Comparison approach' }
];

// Design System
const c = {
  bg: { primary: '#030303', secondary: '#080808', card: '#0a0a0a', elevated: '#101010' },
  text: { primary: '#e4e4e4', secondary: '#888888', muted: '#555555', dim: '#333333' },
  accent: { primary: '#a08040', bright: '#c4a050', dim: '#705830', glow: 'rgba(160,128,64,0.4)' },
  status: { active: '#22c55e', warning: '#eab308', critical: '#ef4444', info: '#3b82f6' },
  chart: { design: '#3b82f6', procurement: '#8b5cf6', construction: '#22c55e', commissioning: '#eab308' },
  border: { default: '#1a1a1a', hover: '#2a2a2a' }
};

// Context
const Ctx = createContext(null);
const useCtx = () => useContext(Ctx);

function Provider({ children }) {
  const [section, setSection] = useState('system');
  const [programme, setProgramme] = useState(null);
  const [decision, setDecision] = useState(null);
  const [mode, setMode] = useState('executive');
  const [scenario, setScenario] = useState('p50');
  const [toolsTab, setToolsTab] = useState('qsra');
  const [aiOpen, setAiOpen] = useState(false);
  
  return (
    <Ctx.Provider value={{ section, setSection, programme, setProgramme, decision, setDecision, mode, setMode, scenario, setScenario, toolsTab, setToolsTab, aiOpen, setAiOpen }}>
      {children}
    </Ctx.Provider>
  );
}

// Chart Tooltip
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: c.bg.elevated, border: `1px solid ${c.border.default}`, padding: 12, fontFamily: 'monospace' }}>
      <p style={{ fontSize: 10, color: c.text.muted, marginBottom: 6 }}>{label}</p>
      {payload.map((e, i) => <p key={i} style={{ fontSize: 11, color: e.color, margin: '2px 0' }}>{e.name}: {e.value}</p>)}
    </div>
  );
};

// Boot
function Boot({ onComplete }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    [200, 500, 800, 1100, 1400, 1700].forEach((d, i) => setTimeout(() => setPhase(i + 1), d));
    setTimeout(onComplete, 2200);
  }, [onComplete]);

  const steps = [
    { p: 1, icon: Activity, text: 'INITIALISING PLANNING INTELLIGENCE' },
    { p: 2, icon: Layers, text: 'LOADING PROGRAMME DATA' },
    { p: 3, icon: GitBranch, text: 'MAPPING DECISION NETWORKS' },
    { p: 4, icon: AlertTriangle, text: 'CALIBRATING RISK MODELS' },
    { p: 5, icon: Settings, text: 'LOADING ANALYSIS TOOLS' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ width: '100%', maxWidth: 500, padding: 32 }}>
        {steps.map((s, i) => {
          const Icon = s.icon;
          const done = phase > s.p;
          return phase >= s.p ? (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, border: `1px solid ${done ? c.status.active : c.accent.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done ? <CheckCircle size={12} color={c.status.active} /> : <Icon size={12} color={c.accent.primary} />}
              </div>
              <span style={{ fontSize: 10, color: done ? c.status.active : c.accent.primary }}>{s.text}</span>
            </motion.div>
          ) : null;
        })}
        {phase >= 6 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20, border: `1px solid ${c.border.default}`, background: c.bg.secondary, marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Shield size={20} color={c.accent.primary} />
              <div>
                <h1 style={{ fontSize: 16, color: c.text.primary, margin: 0 }}>{systemData.operator.name}</h1>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>{systemData.operator.role} • {systemData.operator.company}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div><span style={{ fontSize: 18, color: c.accent.primary }}>€3B+</span><span style={{ fontSize: 8, color: c.text.muted, display: 'block' }}>Portfolio</span></div>
              <div><span style={{ fontSize: 18, color: c.status.active }}>458MW</span><span style={{ fontSize: 8, color: c.text.muted, display: 'block' }}>Capacity</span></div>
              <div><span style={{ fontSize: 18, color: c.chart.design }}>35</span><span style={{ fontSize: 8, color: c.text.muted, display: 'block' }}>Projects</span></div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Status Bar
function StatusBar() {
  const { section, mode, programme } = useCtx();
  const labels = { system: 'SYSTEM', career: 'CAREER', analytics: 'ANALYTICS', programmes: 'PROGRAMMES', decisions: 'DECISIONS', risk: 'RISK', map: 'MAP', capabilities: 'CAPABILITIES', tools: 'TOOLS' };
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 32, background: c.bg.primary, borderBottom: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: 'monospace', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, background: c.status.active }} />
          <span style={{ fontSize: 9, color: c.status.active }}>ONLINE</span>
        </div>
        <span style={{ color: c.border.hover }}>│</span>
        <span style={{ fontSize: 10, color: c.text.primary }}>{labels[section]}</span>
        {programme && <><span style={{ color: c.border.hover }}>│</span><span style={{ fontSize: 9, color: c.accent.primary }}>{programme.shortName}</span></>}
      </div>
      <span style={{ fontSize: 9, color: c.text.secondary }}>{systemData.operator.name}</span>
    </div>
  );
}

// Navigation
const sections = [
  { id: 'system', label: 'SYSTEM', icon: Activity },
  { id: 'career', label: 'CAREER', icon: Briefcase },
  { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
  { id: 'programmes', label: 'PROGRAMMES', icon: Layers },
  { id: 'decisions', label: 'DECISIONS', icon: GitBranch },
  { id: 'risk', label: 'RISK', icon: AlertTriangle },
  { id: 'map', label: 'MAP', icon: Globe },
  { id: 'capabilities', label: 'CAPABILITIES', icon: Target },
  { id: 'tools', label: 'TOOLS', icon: Settings }
];

function Nav() {
  const { section, setSection, mode, setMode } = useCtx();
  return (
    <nav style={{ width: 180, minHeight: '100vh', paddingTop: 32, background: c.bg.secondary, borderRight: `1px solid ${c.border.default}`, fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, borderBottom: `1px solid ${c.border.default}` }}>
        <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>MODE</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['executive', 'planner'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: 6, border: `1px solid ${mode === m ? c.accent.dim : c.border.default}`, background: mode === m ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 8, color: mode === m ? c.accent.primary : c.text.muted }}>{m.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        {sections.map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button key={s.id} onClick={() => setSection(s.id)} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: active ? 'linear-gradient(90deg, rgba(160,128,64,0.1), transparent)' : 'transparent', borderLeft: `2px solid ${active ? c.accent.dim : 'transparent'}`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// System Section
function SystemSection() {
  const { setSection, setProgramme } = useCtx();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE SYSTEM</span>
        <h1 style={{ fontSize: 22, color: c.text.primary, margin: '6px 0 2px' }}>{systemData.operator.name}</h1>
        <p style={{ fontSize: 11, color: c.text.secondary }}>Regional Planning Lead • Vantage Data Centers • EMEA</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[{ l: 'PORTFOLIO VALUE', v: '€3B+', c: c.accent.primary }, { l: 'TOTAL CAPACITY', v: '458MW', c: c.chart.design }, { l: 'ON-TIME', v: '94%', c: c.status.active }, { l: 'PROJECTS', v: '35', c: c.chart.procurement }].map(m => (
          <div key={m.l} style={{ padding: 16, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>{m.l}</span>
            <span style={{ fontSize: 24, color: m.c }}>{m.v}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}`, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>CAREER PROGRESSION</span>
          <button onClick={() => setSection('career')} style={{ padding: '4px 10px', background: 'transparent', border: `1px solid ${c.border.default}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 8, color: c.text.muted }}>VIEW TIMELINE</span>
            <ChevronRight size={10} color={c.text.muted} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={systemData.careerProgression}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
            <XAxis dataKey="year" tick={{ fontSize: 9, fill: c.text.muted }} />
            <YAxis tick={{ fontSize: 9, fill: c.text.muted }} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="value" fill={c.accent.glow} stroke={c.accent.primary} strokeWidth={2} name="Value €M" />
            <Line type="monotone" dataKey="complexity" stroke={c.chart.design} strokeWidth={2} dot={false} name="Complexity" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>PROGRAMMES</span>
        {systemData.programmes.map(p => (
          <motion.div key={p.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => { setProgramme(p); setSection('programmes'); }} style={{ padding: 16, marginBottom: 10, background: c.bg.card, border: `1px solid ${c.border.default}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, background: p.status === 'ACTIVE' ? c.status.active : c.text.muted }} />
                  <span style={{ fontSize: 8, color: p.status === 'ACTIVE' ? c.status.active : c.text.muted }}>{p.status}</span>
                </div>
                <h3 style={{ fontSize: 12, color: c.text.primary, margin: 0 }}>{p.name}</h3>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: '2px 0 0' }}>{p.role}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 20, color: c.accent.primary }}>€{p.value}M</span>
                <span style={{ fontSize: 9, color: c.text.muted, display: 'block' }}>{p.totalCapacity}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Career Section
function CareerSection() {
  const { setSection, setProgramme } = useCtx();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 9, color: c.text.muted }}>CAREER TIMELINE</span>
          <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>{systemData.operator.name}</h2>
          <p style={{ fontSize: 11, color: c.text.secondary }}>{systemData.operator.role} • {systemData.operator.company}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="https://www.linkedin.com/in/aniket-latpate/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0a66c2', textDecoration: 'none' }}>
            <ExternalLink size={12} color="white" />
            <span style={{ fontSize: 10, color: 'white' }}>LinkedIn</span>
          </a>
          <a href="/Aniket_Latpate_CV.pdf" download style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: c.accent.primary, textDecoration: 'none' }}>
            <Download size={12} color={c.bg.primary} />
            <span style={{ fontSize: 10, color: c.bg.primary }}>Download CV</span>
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[{ v: '8+', l: 'Years' }, { v: '€3B+', l: 'Portfolio' }, { v: '6', l: 'Countries' }, { v: '35', l: 'Projects' }].map((m, i) => (
          <div key={i} style={{ padding: 16, background: c.bg.card, border: `1px solid ${c.border.default}`, textAlign: 'center' }}>
            <span style={{ fontSize: 28, color: [c.accent.primary, c.chart.design, c.status.active, c.chart.procurement][i] }}>{m.v}</span>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block' }}>{m.l}</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>EXPERIENCE</span>
        <div style={{ position: 'relative', paddingLeft: 24 }}>
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: c.border.default }} />
          {systemData.careerTimeline.map((job, i) => (
            <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={{ position: 'relative', marginBottom: 20, paddingLeft: 24 }}>
              <div style={{ position: 'absolute', left: -24, top: 4, width: 16, height: 16, background: job.type === 'current' ? c.status.active : c.bg.card, border: `2px solid ${job.type === 'current' ? c.status.active : c.accent.primary}`, borderRadius: '50%', zIndex: 1 }} />
              <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${job.type === 'current' ? c.accent.dim : c.border.default}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20 }}>{job.logo}</span>
                      <div>
                        <h3 style={{ fontSize: 14, color: c.text.primary, margin: 0 }}>{job.role}</h3>
                        <p style={{ fontSize: 11, color: c.accent.primary, margin: 0 }}>{job.company}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      <span style={{ fontSize: 9, color: c.text.muted }}><Calendar size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />{job.period}</span>
                      <span style={{ fontSize: 9, color: c.text.muted }}><MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />{job.location}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 18, color: c.accent.primary }}>€{job.value}M</span>
                    <span style={{ fontSize: 8, color: c.text.muted, display: 'block' }}>{job.projects} Projects</span>
                  </div>
                </div>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 12px', lineHeight: 1.5 }}>{job.description}</p>
                {job.highlights.map((h, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                    <CheckCircle size={12} color={c.status.active} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: c.text.secondary }}>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>EDUCATION</span>
        {systemData.education.map((edu, i) => (
          <div key={i} style={{ padding: 16, marginBottom: 10, background: c.bg.card, border: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>{edu.logo}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 12, color: c.text.primary, margin: 0 }}>{edu.degree}</h4>
              <p style={{ fontSize: 10, color: c.text.secondary, margin: '2px 0 0' }}>{edu.institution}</p>
              {edu.grade && <p style={{ fontSize: 9, color: c.text.muted, margin: '2px 0 0' }}>{edu.grade}</p>}
            </div>
            <span style={{ fontSize: 11, color: c.accent.primary }}>{edu.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Continue in next part due to length...
: c.text.muted }} />
                <YAxis tick={{ fontSize: 8, fill: c.text.muted }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="probability" stroke={c.accent.primary} fill={c.accent.glow} name="Probability" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>DECISION IMPACT</span>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={p.decisions?.map(d => ({ name: d.title.split(' ')[0], cost: (d.metrics?.costAvoided || 0) / 1000000 })) || []}>
                <XAxis dataKey="name" tick={{ fontSize: 8, fill: c.text.muted }} />
                <YAxis tick={{ fontSize: 8, fill: c.text.muted }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="cost" fill={c.accent.primary} name="€M Saved" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// Decisions Section
function DecisionsSection() {
  const { programme, decision, setDecision, mode } = useCtx();
  const [phase, setPhase] = useState(0);
  const p = programme || systemData.programmes[0];
  useEffect(() => { if (decision) { setPhase(0); [300, 800, 1300, 1800].forEach((d, i) => setTimeout(() => setPhase(i + 1), d)); } }, [decision]);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>DECISIONS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div>
          {p.decisions?.map((d, i) => (
            <div key={d.id} onClick={() => setDecision(d)} style={{ padding: 12, marginBottom: 8, background: decision?.id === d.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: `1px solid ${decision?.id === d.id ? c.accent.dim : c.border.default}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: decision?.id === d.id ? c.accent.primary : c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: decision?.id === d.id ? c.bg.primary : c.text.muted }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 10, color: c.text.primary }}>{d.title}</span>
              </div>
              <span style={{ fontSize: 8, color: c.text.muted }}>{d.date}</span>
            </div>
          ))}
        </div>
        {decision ? (
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <h3 style={{ fontSize: 14, color: c.text.primary, margin: '0 0 16px' }}>{decision.title}</h3>
            <AnimatePresence>
              {phase >= 1 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.text.muted }}>CONTEXT</span><p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.context}</p></motion.div>}
              {phase >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, border: `1px solid ${c.accent.dim}`, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.accent.primary }}>INTERVENTION</span><p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.intervention}</p></motion.div>}
              {phase >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(34,197,94,0.1)', border: `1px solid ${c.status.active}`, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.status.active }}>OUTCOME</span><p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.impact}</p></motion.div>}
              {phase >= 4 && mode === 'planner' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: `1px solid ${c.status.critical}` }}><span style={{ fontSize: 8, color: c.status.critical }}>COUNTERFACTUAL</span><p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.counterfactual}</p></motion.div>}
            </AnimatePresence>
          </div>
        ) : <div style={{ padding: 40, background: c.bg.card, border: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 11, color: c.text.muted }}>Select a decision</span></div>}
      </div>
    </div>
  );
}

// Risk Section
function RiskSection() {
  const { programme, scenario, setScenario } = useCtx();
  const p = programme || systemData.programmes[0];
  const mult = { p20: 0.7, p50: 1, p80: 1.4 };
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>RISK</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['p20', 'p50', 'p80'].map(s => (
          <button key={s} onClick={() => setScenario(s)} style={{ padding: '8px 12px', border: `1px solid ${scenario === s ? c.accent.dim : c.border.default}`, background: scenario === s ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 9, color: scenario === s ? c.accent.primary : c.text.muted }}>{s.toUpperCase()}</button>
        ))}
      </div>
      {p.risks ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {p.risks.map(r => {
            const adj = Math.min(100, Math.round(r.probability * mult[scenario]));
            const col = r.impact > 80 ? c.status.critical : r.impact > 60 ? c.status.warning : c.status.info;
            return (
              <div key={r.id} style={{ padding: 14, background: c.bg.card, border: `1px solid ${c.border.default}`, borderLeft: `3px solid ${col}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: c.text.primary }}>{r.title}</span>
                  <span style={{ fontSize: 9, color: col }}>{adj}%</span>
                </div>
                <div style={{ height: 4, background: c.border.default }}><div style={{ width: `${adj}%`, height: '100%', background: col }} /></div>
              </div>
            );
          })}
        </div>
      ) : <p style={{ color: c.text.muted, fontSize: 10 }}>No active risks for completed programme</p>}
    </div>
  );
}

// Map Section
function MapSection() {
  const [hover, setHover] = useState(null);
  const toXY = (lat, lng) => ({ x: ((lng + 15) / 50) * 700 + 50, y: ((58 - lat) / 15) * 400 + 50 });
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>GEOGRAPHIC DISTRIBUTION</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0' }}>Project Locations</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 20 }}>6 Countries • 35 Projects • 458MW</p>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <svg width="100%" height="400" viewBox="0 0 800 500" style={{ background: c.bg.secondary }}>
            {systemData.locations.map(loc => {
              const pos = toXY(loc.lat, loc.lng);
              const col = loc.status === 'active' ? c.status.active : c.accent.primary;
              return (
                <g key={loc.id} onMouseEnter={() => setHover(loc.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                  {loc.status === 'active' && <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={col} strokeWidth="1" opacity="0.4"><animate attributeName="r" from="10" to="22" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" /></circle>}
                  <rect x={pos.x - 6} y={pos.y - 6} width={12} height={12} fill={col} transform={`rotate(45 ${pos.x} ${pos.y})`} />
                  {hover === loc.id && <><rect x={pos.x + 12} y={pos.y - 30} width={120} height={45} fill={c.bg.elevated} stroke={c.border.default} /><text x={pos.x + 18} y={pos.y - 12} fill={c.text.primary} fontSize="9">{loc.name}</text><text x={pos.x + 18} y={pos.y} fill={c.text.secondary} fontSize="8">{loc.type}</text><text x={pos.x + 18} y={pos.y + 12} fill={c.accent.primary} fontSize="8">{loc.capacity}</text></>}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 440, overflowY: 'auto' }}>
          {systemData.locations.map(loc => (
            <div key={loc.id} onMouseEnter={() => setHover(loc.id)} onMouseLeave={() => setHover(null)} style={{ padding: 12, background: hover === loc.id ? c.bg.elevated : c.bg.card, border: `1px solid ${hover === loc.id ? c.accent.dim : c.border.default}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, background: loc.status === 'active' ? c.status.active : c.accent.primary }} />
                <span style={{ fontSize: 10, color: c.text.primary }}>{loc.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 8, color: c.text.muted }}>{loc.type}</span>
                <span style={{ fontSize: 9, color: c.accent.primary }}>{loc.capacity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Capabilities Section
function CapabilitiesSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const send = async () => {
    setStatus('sending');
    try {
      const res = await fetch('https://formspree.io/f/xpwzgkvq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      setStatus(res.ok ? 'success' : 'error');
      if (res.ok) setFormData({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
  };
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>CAPABILITIES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Technical Matrix</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={systemData.capabilityRadar}>
              <PolarGrid stroke={c.border.default} />
              <PolarAngleAxis dataKey="capability" tick={{ fontSize: 9, fill: c.text.secondary }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7, fill: c.text.muted }} />
              <Radar dataKey="value" stroke={c.accent.primary} fill={c.accent.glow} fillOpacity={0.6} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          {Object.entries(systemData.capabilities).map(([k, v]) => (
            <div key={k} style={{ padding: 12, marginBottom: 8, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 9, color: c.text.primary, textTransform: 'uppercase' }}>{k}</span>
                <span style={{ fontSize: 11, color: c.accent.primary }}>{v.score}%</span>
              </div>
              <div style={{ height: 3, background: c.border.default }}><div style={{ width: `${v.score}%`, height: '100%', background: c.accent.primary }} /></div>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {v.tools.map((t, i) => <span key={i} style={{ fontSize: 7, padding: '2px 4px', background: c.bg.secondary, color: c.text.muted }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>CONNECT</span>
          <a href="https://www.linkedin.com/in/aniket-latpate/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#0a66c2', textDecoration: 'none', marginBottom: 12 }}>
            <ExternalLink size={16} color="white" />
            <span style={{ fontSize: 11, color: 'white' }}>Connect on LinkedIn</span>
          </a>
          <div style={{ padding: 12, background: c.bg.secondary }}>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📧 {systemData.operator.email}</p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📱 {systemData.operator.phone}</p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>📍 {systemData.operator.location}</p>
          </div>
        </div>
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>SEND MESSAGE</span>
          {status === 'success' ? <div style={{ textAlign: 'center', padding: 20 }}><CheckCircle size={32} color={c.status.active} /><p style={{ fontSize: 12, color: c.status.active, marginTop: 12 }}>Sent!</p></div> : (
            <>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" style={{ width: '100%', padding: 8, marginBottom: 8, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" style={{ width: '100%', padding: 8, marginBottom: 8, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Message" rows={3} style={{ width: '100%', padding: 8, marginBottom: 12, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace', resize: 'none' }} />
              <button onClick={send} disabled={!formData.name || !formData.email || !formData.message} style={{ width: '100%', padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: (!formData.name || !formData.email || !formData.message) ? 0.5 : 1 }}>
                <span style={{ fontSize: 10, color: c.bg.primary }}>{status === 'sending' ? 'SENDING...' : 'SEND'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Tools Section (QSRA, DCMA, Delay Analysis)
function ToolsSection() {
  const { toolsTab, setToolsTab, mode } = useCtx();
  const [qsraResults, setQsraResults] = useState(null);
  const [dcmaResults, setDcmaResults] = useState(null);
  const [projectInfo, setProjectInfo] = useState({ name: '', dataDate: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const [docs, setDocs] = useState({ baseline: true, updates: true, asBuilt: false, dailyReports: true, delayNotices: true, changeOrders: true });

  const runQSRA = async () => {
    setAnalyzing(true); setProgress(0);
    for (let i = 0; i < 8; i++) { await new Promise(r => setTimeout(r, 250)); setProgress((i+1)*12.5); }
    const results = qsraChecks.map(ck => {
      const rand = Math.random();
      const val = ck.threshold.includes('=0') ? (rand > 0.7 ? Math.round(rand*5) : 0) : Math.round(rand*15);
      const st = ck.threshold.includes('=0') ? (val === 0 ? 'PASS' : 'FAIL') : (rand > 0.6 ? 'PASS' : rand > 0.3 ? 'AMBER' : 'FAIL');
      return { ...ck, value: val, status: st };
    });
    const passed = results.filter(r => r.status === 'PASS').length;
    const amber = results.filter(r => r.status === 'AMBER').length;
    const score = Math.round(((passed + amber*0.5) / results.length) * 100);
    setQsraResults({ projectName: projectInfo.name || 'Analysis', analysisDate: new Date().toISOString(), totalActivities: Math.floor(Math.random()*3000)+1000, totalDuration: Math.floor(Math.random()*500)+200, healthScore: score, checks: results, fitness: score >= 80 ? 'Fit for prospective' : score >= 60 ? 'Fit for retrospective' : 'At risk' });
    setAnalyzing(false);
  };

  const runDCMA = async () => {
    setAnalyzing(true); setProgress(0);
    for (let i = 0; i < 14; i++) { await new Promise(r => setTimeout(r, 120)); setProgress((i+1)*7.14); }
    const results = dcmaChecks.map(ck => {
      const rand = Math.random();
      const val = ck.threshold.includes('= 0') ? (rand > 0.7 ? 0 : Math.round(rand*5)) : Math.round(rand*10);
      const st = ck.threshold.includes('= 0') ? (val === 0 ? 'PASS' : 'FAIL') : (rand > 0.5 ? 'PASS' : 'WARNING');
      return { ...ck, value: val, status: st };
    });
    const passed = results.filter(r => r.status === 'PASS').length;
    setDcmaResults({ projectName: projectInfo.name || 'Analysis', analysisDate: new Date().toISOString(), score: Math.round((passed/14)*100), checks: results, compliance: passed >= 12 ? 'COMPLIANT' : passed >= 10 ? 'MARGINAL' : 'NON-COMPLIANT' });
    setAnalyzing(false);
  };

  const generatePDF = async (type) => {
    const data = type === 'qsra' ? qsraResults : dcmaResults;
    if (!data) return;
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFillColor(3, 3, 3); doc.rect(0, 0, 210, 35, 'F');
      doc.setTextColor(160, 128, 64); doc.setFontSize(16);
      doc.text(type === 'qsra' ? 'QSRA SCHEDULE HEALTH CHECK' : 'DCMA 14-POINT ASSESSMENT', 14, 15);
      doc.setFontSize(10); doc.setTextColor(136, 136, 136);
      doc.text(`Project: ${data.projectName}`, 14, 25);
      doc.text(`Date: ${new Date(data.analysisDate).toLocaleDateString()}`, 14, 30);
      doc.setFontSize(24); doc.setTextColor(data.score >= 80 ? 34 : 234, data.score >= 80 ? 197 : 179, data.score >= 80 ? 94 : 8);
      doc.text(`${data.score || data.healthScore}/100`, 170, 22);
      let y = 45; doc.setFontSize(8); doc.setTextColor(0, 0, 0);
      data.checks.forEach(ck => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`${ck.id}. ${ck.name}`, 14, y);
        doc.text(ck.threshold, 100, y);
        doc.text(`${ck.value}%`, 140, y);
        const col = ck.status === 'PASS' ? [34,197,94] : ck.status === 'AMBER' || ck.status === 'WARNING' ? [234,179,8] : [239,68,68];
        doc.setTextColor(...col); doc.text(ck.status, 170, y);
        doc.setTextColor(0, 0, 0); y += 6;
      });
      doc.setFontSize(7); doc.setTextColor(136, 136, 136);
      doc.text('Generated by Planning Intelligence System | Aniket Latpate', 14, 290);
      doc.save(`${type.toUpperCase()}_Report_${data.projectName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) { alert('PDF library not loaded. Run: npm install jspdf'); }
  };

  const getMethod = () => {
    const sc = Object.values(docs).filter(Boolean).length;
    if (sc >= 5) return { name: 'Windows Analysis', confidence: 92 };
    if (sc >= 4) return { name: 'Time Impact Analysis', confidence: 78 };
    if (sc >= 3) return { name: 'Collapsed As-Built', confidence: 65 };
    return { name: 'As-Planned vs As-Built', confidence: 45 };
  };

  const tabs = [{ id: 'qsra', label: 'QSRA', icon: CheckSquare }, { id: 'dcma', label: 'DCMA 14-PT', icon: Shield }, { id: 'delay', label: 'DELAY', icon: Clock }, { id: 'claim', label: 'CLAIM', icon: Scale }, { id: 'stress', label: 'STRESS TEST', icon: AlertCircle }];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>Analysis Tools</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 20 }}>QSRA • DCMA 14-Point • SCL Delay Analysis</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => {
          const I = t.icon;
          const a = toolsTab === t.id;
          return <button key={t.id} onClick={() => setToolsTab(t.id)} style={{ padding: '10px 16px', background: a ? 'rgba(160,128,64,0.15)' : c.bg.card, border: `1px solid ${a ? c.accent.dim : c.border.default}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><I size={12} color={a ? c.accent.primary : c.text.muted} /><span style={{ fontSize: 9, color: a ? c.accent.primary : c.text.primary }}>{t.label}</span></button>;
        })}
      </div>

      {toolsTab === 'qsra' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><Upload size={16} color={c.accent.primary} /><span style={{ fontSize: 11, color: c.text.primary }}>Schedule Analysis</span></div>
              <input type="text" value={projectInfo.name} onChange={e => setProjectInfo({...projectInfo, name: e.target.value})} placeholder="Project Name" style={{ width: '100%', padding: 10, marginBottom: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input type="date" value={projectInfo.dataDate} onChange={e => setProjectInfo({...projectInfo, dataDate: e.target.value})} style={{ width: '100%', padding: 10, marginBottom: 12, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input ref={fileRef} type="file" accept=".xer,.xml,.xlsx" onChange={e => { if (e.target.files[0]) { setUploadedFile(e.target.files[0]); setProjectInfo(p => ({...p, name: e.target.files[0].name.replace(/\.[^/.]+$/, '')})); }}} style={{ display: 'none' }} />
              <div onClick={() => fileRef.current?.click()} style={{ padding: 24, border: `2px dashed ${uploadedFile ? c.status.active : c.border.default}`, textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: uploadedFile ? 'rgba(34,197,94,0.1)' : 'transparent' }}>
                {uploadedFile ? <><CheckCircle size={24} color={c.status.active} style={{ marginBottom: 8 }} /><p style={{ fontSize: 10, color: c.status.active, margin: 0 }}>{uploadedFile.name}</p></> : <><FileText size={24} color={c.text.muted} style={{ marginBottom: 8 }} /><p style={{ fontSize: 10, color: c.text.muted, margin: 0 }}>Drop P6 XER or click</p></>}
              </div>
              <button onClick={runQSRA} disabled={analyzing} style={{ width: '100%', padding: 14, background: analyzing ? c.bg.secondary : c.accent.primary, border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 10, color: analyzing ? c.text.muted : c.bg.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN QSRA'}</span></button>
              {analyzing && <div style={{ marginTop: 12, height: 4, background: c.border.default }}><motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: c.accent.primary }} /></div>}
            </div>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: c.text.muted }}>HEALTH SCORE</span>
                {qsraResults && <button onClick={() => generatePDF('qsra')} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${c.accent.dim}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={12} color={c.accent.primary} /><span style={{ fontSize: 8, color: c.accent.primary }}>PDF</span></button>}
              </div>
              {qsraResults ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 56, color: qsraResults.healthScore >= 80 ? c.status.active : qsraResults.healthScore >= 60 ? c.status.warning : c.status.critical }}>{qsraResults.healthScore}</span>
                    <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(34,197,94,0.2)', color: c.status.active }}>{qsraResults.checks.filter(r => r.status === 'PASS').length} PASS</span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(234,179,8,0.2)', color: c.status.warning }}>{qsraResults.checks.filter(r => r.status === 'AMBER').length} AMBER</span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(239,68,68,0.2)', color: c.status.critical }}>{qsraResults.checks.filter(r => r.status === 'FAIL').length} FAIL</span>
                  </div>
                  <div style={{ padding: 12, background: c.bg.secondary }}><span style={{ fontSize: 9, color: c.text.muted }}>FITNESS: </span><span style={{ fontSize: 10, color: c.status.active }}>{qsraResults.fitness}</span></div>
                </>
              ) : <div style={{ padding: 32, textAlign: 'center' }}><HelpCircle size={32} color={c.text.muted} /><p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Upload schedule to analyze</p></div>}
            </div>
          </div>
          {qsraResults && (
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>17-POINT ASSESSMENT</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {qsraResults.checks.map(ck => {
                  const col = ck.status === 'PASS' ? c.status.active : ck.status === 'AMBER' ? c.status.warning : c.status.critical;
                  return <div key={ck.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: `3px solid ${col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: c.text.primary }}>{ck.id}. {ck.name}</span>
                      <span style={{ fontSize: 8, padding: '2px 6px', background: `${col}20`, color: col }}>{ck.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 8, color: c.text.dim }}>Target: {ck.threshold}</span>
                      <span style={{ fontSize: 8, color: c.text.secondary }}>Actual: {ck.value}%</span>
                    </div>
                  </div>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'dcma' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}><Shield size={16} color={c.accent.primary} /><span style={{ fontSize: 11, color: c.text.primary }}>DCMA 14-Point</span></div>
              <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 16 }}>Defense Contract Management Agency schedule quality standard.</p>
              <button onClick={runDCMA} disabled={analyzing} style={{ width: '100%', padding: 14, background: c.accent.primary, border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 10, color: c.bg.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN DCMA'}</span></button>
            </div>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: c.text.muted }}>COMPLIANCE</span>
                {dcmaResults && <button onClick={() => generatePDF('dcma')} style={{ padding: '6px 12px', background: 'transparent', border: `1px solid ${c.accent.dim}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={12} color={c.accent.primary} /><span style={{ fontSize: 8, color: c.accent.primary }}>PDF</span></button>}
              </div>
              {dcmaResults ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 56, color: dcmaResults.score >= 85 ? c.status.active : dcmaResults.score >= 70 ? c.status.warning : c.status.critical }}>{dcmaResults.score}</span>
                    <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                  </div>
                  <div style={{ padding: 12, background: dcmaResults.compliance === 'COMPLIANT' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', border: `1px solid ${dcmaResults.compliance === 'COMPLIANT' ? c.status.active : c.status.warning}` }}>
                    <span style={{ fontSize: 12, color: dcmaResults.compliance === 'COMPLIANT' ? c.status.active : c.status.warning }}>{dcmaResults.compliance}</span>
                  </div>
                </>
              ) : <div style={{ padding: 32, textAlign: 'center' }}><Shield size={32} color={c.text.muted} /><p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Run analysis</p></div>}
            </div>
          </div>
          {dcmaResults && (
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>14-POINT RESULTS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {dcmaResults.checks.map(ck => {
                  const col = ck.status === 'PASS' ? c.status.active : ck.status === 'WARNING' ? c.status.warning : c.status.critical;
                  return <div key={ck.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: `3px solid ${col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: c.text.primary }}>{ck.id}. {ck.name}</span>
                      <span style={{ fontSize: 8, color: col }}>{ck.status}</span>
                    </div>
                    <p style={{ fontSize: 9, color: c.text.muted, margin: 0 }}>{ck.desc}</p>
                  </div>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'delay' && (
        <div>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}`, marginBottom: 16 }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>AVAILABLE RECORDS</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {Object.entries(docs).map(([k, v]) => (
                <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: c.bg.secondary, cursor: 'pointer' }}>
                  <input type="checkbox" checked={v} onChange={() => setDocs({...docs, [k]: !v})} style={{ accentColor: c.accent.primary }} />
                  <span style={{ fontSize: 9, color: c.text.primary, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.accent.dim}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 9, color: c.text.muted }}>RECOMMENDED</span>
              <span style={{ fontSize: 9, padding: '4px 10px', background: c.accent.glow, color: c.accent.primary }}>{getMethod().confidence}%</span>
            </div>
            <h3 style={{ fontSize: 16, color: c.accent.primary, margin: '0 0 12px' }}>{getMethod().name}</h3>
          </div>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>ALL METHODS (SCL)</span>
            {delayMethods.map(m => (
              <div key={m.id} style={{ padding: 16, marginBottom: 8, background: m.name === getMethod().name ? 'rgba(160,128,64,0.1)' : c.bg.card, border: `1px solid ${m.name === getMethod().name ? c.accent.dim : c.border.default}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><h4 style={{ fontSize: 12, color: c.text.primary, margin: 0 }}>{m.name}</h4><p style={{ fontSize: 9, color: c.text.secondary, margin: '4px 0 0' }}>{m.desc}</p></div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 8, padding: '2px 6px', background: c.bg.secondary, color: c.text.muted }}>{m.type}</span>
                    <span style={{ fontSize: 8, padding: '2px 6px', background: m.defensibility === 'Very High' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)', color: m.defensibility === 'Very High' ? c.status.active : c.status.warning }}>{m.defensibility}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toolsTab === 'claim' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>CLAIM READINESS</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 48, color: c.status.warning }}>67</span>
              <span style={{ fontSize: 14, color: c.text.muted }}>/100</span>
            </div>
            <div style={{ padding: 12, background: 'rgba(234,179,8,0.1)', border: `1px solid ${c.status.warning}` }}><span style={{ fontSize: 10, color: c.status.warning }}>MODERATE RISK</span></div>
          </div>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>VULNERABILITIES</span>
            {[{ n: 'Incomplete as-built', s: 'HIGH' }, { n: 'Logic modifications', s: 'MEDIUM' }, { n: 'Concurrent delay', s: 'HIGH' }].map((v, i) => (
              <div key={i} style={{ padding: 10, marginBottom: 8, background: c.bg.secondary, borderLeft: `3px solid ${v.s === 'HIGH' ? c.status.critical : c.status.warning}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: c.text.primary }}>{v.n}</span>
                  <span style={{ fontSize: 8, color: v.s === 'HIGH' ? c.status.critical : c.status.warning }}>{v.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toolsTab === 'stress' && (
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>EXPERT CROSS-EXAMINATION</span>
          {[{ q: 'Why Windows Analysis with update gaps?', s: 'Critical' }, { q: 'Critical path changes post-event?', s: 'High' }, { q: 'Concurrent delay apportionment?', s: 'Critical' }, { q: 'Baseline logic deficiencies?', s: 'Medium' }].map((item, i) => (
            <div key={i} style={{ padding: 16, marginBottom: 10, background: c.bg.secondary, borderLeft: `3px solid ${item.s === 'Critical' ? c.status.critical : item.s === 'High' ? c.status.warning : c.status.info}` }}>
              <span style={{ fontSize: 8, color: item.s === 'Critical' ? c.status.critical : c.status.warning }}>{item.s.toUpperCase()}</span>
              <p style={{ fontSize: 10, color: c.text.primary, margin: '8px 0 0' }}>{item.q}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// AI Assistant
function AIAssistant() {
  const { aiOpen, setAiOpen, setSection } = useCtx();
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: "Hello! I'm Aniket's Planning AI. Ask me about his experience, navigate sections, or learn about QSRA tools." }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const respond = (msg) => {
    const m = msg.toLowerCase();
    if (m.includes('show') || m.includes('go to') || m.includes('navigate')) {
      if (m.includes('career')) { setSection('career'); return "Navigated to Career Timeline."; }
      if (m.includes('analytic')) { setSection('analytics'); return "Opened Analytics Dashboard."; }
      if (m.includes('tool') || m.includes('qsra')) { setSection('tools'); return "Welcome to Analysis Tools."; }
      if (m.includes('map')) { setSection('map'); return "Showing project locations."; }
      if (m.includes('capabil') || m.includes('contact')) { setSection('capabilities'); return "Here are capabilities and contact info."; }
    }
    if (m.includes('who') || m.includes('about') || m.includes('aniket')) return "Aniket Latpate is Regional Planning Lead at Vantage Data Centers, managing €1.5B+ portfolio. 8+ years experience across data centres, pharma, healthcare.";
    if (m.includes('qsra') || m.includes('health check')) return "QSRA is a 17-point schedule health check. Go to Tools to run analysis on your P6 schedules.";
    if (m.includes('contact') || m.includes('email')) return "Email: latpate.aniket92@gmail.com, Phone: +353 894451882, LinkedIn: linkedin.com/in/aniket-latpate";
    return "I can help navigate the portfolio, explain tools, or share Aniket's experience. Try: 'show career', 'what is QSRA', or 'contact info'.";
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input; setInput('');
    setMsgs(p => [...p, { role: 'user', content: userMsg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    setMsgs(p => [...p, { role: 'assistant', content: respond(userMsg) }]);
    setTyping(false);
  };

  if (!aiOpen) return (
    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} onClick={() => setAiOpen(true)} style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%', background: `linear-gradient(135deg, ${c.accent.primary}, ${c.accent.bright})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${c.accent.glow}`, zIndex: 1000 }}>
      <Bot size={24} color={c.bg.primary} />
    </motion.button>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'fixed', bottom: 24, right: 24, width: 360, height: 480, background: c.bg.secondary, border: `1px solid ${c.border.default}`, display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${c.accent.primary}, ${c.accent.bright})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={16} color={c.bg.primary} /></div>
          <div><span style={{ fontSize: 11, color: c.text.primary }}>Planning AI</span><span style={{ fontSize: 9, color: c.status.active, display: 'block' }}>● Online</span></div>
        </div>
        <button onClick={() => setAiOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={18} color={c.text.muted} /></button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 28, height: 28, flexShrink: 0, background: m.role === 'user' ? c.status.info : c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {m.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color={c.bg.primary} />}
            </div>
            <div style={{ maxWidth: '80%', padding: '10px 12px', background: m.role === 'user' ? 'rgba(59,130,246,0.2)' : c.bg.card, border: `1px solid ${m.role === 'user' ? 'rgba(59,130,246,0.3)' : c.border.default}` }}>
              <p style={{ fontSize: 11, color: c.text.primary, margin: 0, lineHeight: 1.5 }}>{m.content}</p>
            </div>
          </div>
        ))}
        {typing && <div style={{ display: 'flex', gap: 10 }}><div style={{ width: 28, height: 28, background: c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={14} color={c.bg.primary} /></div><div style={{ padding: '10px 12px', background: c.bg.card }}><div style={{ display: 'flex', gap: 4 }}>{[0,1,2].map(i => <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent.primary }} />)}</div></div></div>}
        <div ref={ref} />
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${c.border.default}`, display: 'flex', gap: 8 }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && send()} placeholder="Ask anything..." style={{ flex: 1, padding: '10px 12px', background: c.bg.card, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }} />
        <button onClick={send} style={{ padding: '10px 14px', background: input.trim() ? c.accent.primary : c.bg.card, border: 'none', cursor: 'pointer' }}><Send size={14} color={input.trim() ? c.bg.primary : c.text.muted} /></button>
      </div>
    </motion.div>
  );
}

// Main
function Main() {
  const { section } = useCtx();
  const sections = { system: SystemSection, career: CareerSection, analytics: AnalyticsSection, programmes: ProgrammesSection, decisions: DecisionsSection, risk: RiskSection, map: MapSection, capabilities: CapabilitiesSection, tools: ToolsSection };
  const Section = sections[section] || SystemSection;
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: c.bg.primary }}>
      <StatusBar />
      <Nav />
      <main style={{ flex: 1, marginTop: 32, overflowY: 'auto', maxHeight: 'calc(100vh - 32px)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            <Section />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// App
export default function App() {
  const [booted, setBooted] = useState(false);
  return (
    <Provider>
      <AnimatePresence mode="wait">
        {!booted ? <motion.div key="boot" exit={{ opacity: 0 }}><Boot onComplete={() => setBooted(true)} /></motion.div> : <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Main /><AIAssistant /></motion.div>}
      </AnimatePresence>
      <style>{`* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #030303; overflow-x: hidden; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #333; }`}</style>
    </Provider>
  );
}
