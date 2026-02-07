import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Target, Shield, Activity, Globe, Layers, GitBranch, ChevronRight, FileText, Settings, Upload, Clock, CheckSquare, HelpCircle, Send, X, Bot, User, Sparkles, Briefcase, MapPin, Calendar, Download, ExternalLink } from 'lucide-react';

const systemData = {
  operator: { name: 'ANIKET LATPATE', role: 'REGIONAL PLANNING LEAD', company: 'VANTAGE DATA CENTERS', email: 'latpate.aniket92@gmail.com', phone: '+353 894451882', location: 'Dublin, Ireland' },
  careerTimeline: [
    { id: 'vantage', company: 'Vantage Data Centers', role: 'Regional Planning Lead – EMEA', period: 'May 2025 - Present', location: 'Dublin, Ireland', type: 'current', logo: '🏢', description: 'Portfolio-level planning across hyperscale data center developments.', highlights: ['Managing IMS for Dublin portfolio (€1.5B+)', 'Overseeing 4 projects: 2 DCs, MFGP, BESS'], value: 1500, projects: 4 },
    { id: 'jpc', company: 'John Paul Construction', role: 'MEP Planning Lead', period: 'July 2024 - May 2025', location: 'Dublin, Ireland', type: 'past', logo: '🏗️', description: 'Led MEP planning across data centres, pharma, residential.', highlights: ['Managed 21+ projects across Ireland'], value: 500, projects: 21 },
    { id: 'puredc', company: 'Pure DC Global', role: 'Planning Manager', period: 'Sept 2022 - July 2024', location: 'Dublin, Ireland', type: 'past', logo: '💾', description: 'Project planning for hyperscale data centre.', highlights: ['Managed €550M+ data centre project'], value: 550, projects: 2 },
    { id: 'mercury', company: 'Mercury Engineering', role: 'Project Planner', period: 'Sept 2019 - Sept 2022', location: 'Dublin, Ireland', type: 'past', logo: '⚡', description: 'Scheduling for DC, Healthcare, Pharma across Europe.', highlights: ['€459M+ across 6 countries'], value: 459, projects: 7 }
  ],
  education: [
    { degree: 'MSc. Sustainable Energy & Green Technologies', institution: 'University College Dublin', year: '2018-2019', grade: '2:1 | NFQ Level 9', logo: '🎓' },
    { degree: 'B.E Electrical Engineering', institution: 'University of Mumbai', year: '2016', logo: '🎓' }
  ],
  programmes: [
    { id: 'vantage', name: 'VANTAGE DATA CENTERS', shortName: 'VDC', role: 'Regional Planning Lead', period: 'May 2025 – Present', status: 'ACTIVE', value: 1500, totalCapacity: '172MW', location: { city: 'Dublin', area: 'Grangecastle', country: 'Ireland' },
      projects: [{ name: 'DC1', capacity: '32MW', type: 'Data Centre' }, { name: 'DC2', capacity: '20MW', type: 'Data Centre' }, { name: 'MFGP', capacity: '110MW', type: 'Power' }, { name: 'BESS', capacity: '10MW', type: 'Storage' }],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 95 }, { id: 'procurement', name: 'PROCUREMENT', progress: 88 }, { id: 'construction', name: 'CONSTRUCTION', progress: 72 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 35 }],
      workstreamTimeline: [{ month: 'Jan', design: 85, procurement: 70, construction: 45, commissioning: 10 }, { month: 'Feb', design: 88, procurement: 75, construction: 52, commissioning: 15 }, { month: 'Mar', design: 90, procurement: 80, construction: 58, commissioning: 20 }, { month: 'Jun', design: 95, procurement: 88, construction: 72, commissioning: 35 }],
      risks: [{ id: 'r1', title: 'Generator Delivery', probability: 35, impact: 85 }, { id: 'r2', title: 'Grid Connection', probability: 20, impact: 95 }],
      monteCarlo: { distribution: [{ days: -20, probability: 2 }, { days: -10, probability: 12 }, { days: 0, probability: 25 }, { days: 10, probability: 12 }, { days: 20, probability: 3 }] },
      decisions: [{ id: 'd1', title: 'IMS RESTRUCTURE', date: '2025-06', context: 'Facilities on independent paths', intervention: 'Integrated Master Schedule', impact: 'Protected RFS', counterfactual: '€4.2M exposure', metrics: { costAvoided: 4200000 } }]
    },
    { id: 'jpc', name: 'JOHN PAUL CONSTRUCTION', shortName: 'JPC', role: 'MEP Planning Lead', period: 'July 2024 – May 2025', status: 'COMPLETED', value: 500, totalCapacity: '96MW+', location: { city: 'Dublin', country: 'Ireland' },
      projects: [{ name: 'Dublin Projects', capacity: 'Various', type: 'Mixed' }, { name: 'Drogheda DC1', capacity: '48MW', type: 'Data Centre' }, { name: 'Drogheda DC2', capacity: '48MW', type: 'Data Centre' }],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'RESOURCE LEVELLING', date: '2024-09', context: 'Resource conflicts', intervention: 'Cross-project matrix', impact: 'Eliminated conflicts', counterfactual: 'Multiple delays', metrics: { costAvoided: 1800000 } }]
    },
    { id: 'puredc', name: 'PURE DC GLOBAL', shortName: 'PDC', role: 'Planning Manager', period: 'Sept 2022 – July 2024', status: 'COMPLETED', value: 550, totalCapacity: '40MW', location: { city: 'Dublin', area: 'Ballycoolin', country: 'Ireland' },
      projects: [{ name: 'Ballycoolin DC1', capacity: '20MW', type: 'Data Centre' }, { name: 'Ballycoolin DC2', capacity: '20MW', type: 'Data Centre' }],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'CP RESEQUENCE', date: '2023-03', context: 'Permit delay', intervention: 'Resequenced works', impact: 'Absorbed delay', counterfactual: '8 week slip', metrics: { costAvoided: 6500000 } }]
    },
    { id: 'mercury', name: 'MERCURY ENGINEERING', shortName: 'MER', role: 'Project Planner', period: 'Sept 2019 – Sept 2022', status: 'COMPLETED', value: 459, totalCapacity: '180MW', location: { city: 'Multiple', country: 'Europe' },
      projects: [{ name: 'Amsterdam DC', capacity: '50MW', type: 'Data Centre' }, { name: 'Paris DC', capacity: '32MW', type: 'Data Centre' }, { name: 'Warsaw DC', capacity: '48MW', type: 'Data Centre' }],
      workstreams: [{ id: 'design', name: 'DESIGN', progress: 100 }, { id: 'procurement', name: 'PROCUREMENT', progress: 100 }, { id: 'construction', name: 'CONSTRUCTION', progress: 100 }, { id: 'commissioning', name: 'COMMISSIONING', progress: 100 }],
      decisions: [{ id: 'd1', title: 'EVM IMPLEMENTATION', date: '2020-06', context: 'No baseline', intervention: 'P6/Excel EVM', impact: 'IBR approved', counterfactual: 'Reactive reporting', metrics: { costAvoided: 1200000 } }]
    }
  ],
  locations: [
    { id: 'dublin-vdc', name: 'Vantage Dublin', lat: 53.31, lng: -6.42, capacity: '172MW', status: 'active', type: 'DC Campus' },
    { id: 'dublin-pdc', name: 'Pure DC', lat: 53.41, lng: -6.35, capacity: '40MW', status: 'completed', type: 'Data Centre' },
    { id: 'amsterdam', name: 'Amsterdam DC', lat: 52.37, lng: 4.89, capacity: '50MW', status: 'completed', type: 'Data Centre' },
    { id: 'paris', name: 'Paris DC', lat: 48.86, lng: 2.35, capacity: '32MW', status: 'completed', type: 'Data Centre' },
    { id: 'warsaw', name: 'Warsaw DC', lat: 52.23, lng: 21.01, capacity: '48MW', status: 'completed', type: 'Data Centre' }
  ],
  careerProgression: [{ year: '2017', value: 50, complexity: 30 }, { year: '2019', value: 150, complexity: 55 }, { year: '2021', value: 350, complexity: 75 }, { year: '2023', value: 750, complexity: 85 }, { year: '2025', value: 1500, complexity: 95 }],
  capabilityRadar: [{ capability: 'Planning', value: 95 }, { capability: 'Analysis', value: 90 }, { capability: 'Reporting', value: 88 }, { capability: 'Governance', value: 92 }, { capability: 'Technical', value: 85 }, { capability: 'Leadership', value: 88 }],
  capabilities: { planning: { score: 95, tools: ['Primavera P6', 'MS Project', 'Synchro 4D'] }, analysis: { score: 90, tools: ['EVM', 'DCMA 14-Point', 'Monte Carlo'] }, reporting: { score: 88, tools: ['Power BI', 'Excel'] }, governance: { score: 92, tools: ['IMS', 'IBR', 'EOT Analysis'] } }
};

const qsraChecks = [
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

const dcmaChecks = [
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

const c = {
  bg: { primary: '#030303', secondary: '#080808', card: '#0a0a0a', elevated: '#101010' },
  text: { primary: '#e4e4e4', secondary: '#888888', muted: '#555555', dim: '#333333' },
  accent: { primary: '#a08040', bright: '#c4a050', dim: '#705830', glow: 'rgba(160,128,64,0.4)' },
  status: { active: '#22c55e', warning: '#eab308', critical: '#ef4444', info: '#3b82f6' },
  chart: { design: '#3b82f6', procurement: '#8b5cf6', construction: '#22c55e', commissioning: '#eab308' },
  border: { default: '#1a1a1a', hover: '#2a2a2a' }
};

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
  return (<Ctx.Provider value={{ section, setSection, programme, setProgramme, decision, setDecision, mode, setMode, scenario, setScenario, toolsTab, setToolsTab, aiOpen, setAiOpen }}>{children}</Ctx.Provider>);
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (<div style={{ background: c.bg.elevated, border: '1px solid ' + c.border.default, padding: 12 }}><p style={{ fontSize: 10, color: c.text.muted, marginBottom: 6 }}>{label}</p>{payload.map((e, i) => (<p key={i} style={{ fontSize: 11, color: e.color, margin: '2px 0' }}>{e.name}: {e.value}</p>))}</div>);
};

function Boot({ onComplete }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 500);
    const t3 = setTimeout(() => setPhase(3), 800);
    const t4 = setTimeout(() => setPhase(4), 1100);
    const t5 = setTimeout(() => setPhase(5), 1400);
    const t6 = setTimeout(() => setPhase(6), 1700);
    const t7 = setTimeout(onComplete, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); clearTimeout(t7); };
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
          if (phase < s.p) return null;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, border: '1px solid ' + (done ? c.status.active : c.accent.primary), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {done ? <CheckCircle size={12} color={c.status.active} /> : <Icon size={12} color={c.accent.primary} />}
              </div>
              <span style={{ fontSize: 10, color: done ? c.status.active : c.accent.primary }}>{s.text}</span>
            </motion.div>
          );
        })}
        {phase >= 6 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20, border: '1px solid ' + c.border.default, background: c.bg.secondary, marginTop: 20 }}>
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

function StatusBar() {
  const { section, programme } = useCtx();
  const labels = { system: 'SYSTEM', career: 'CAREER', analytics: 'ANALYTICS', programmes: 'PROGRAMMES', decisions: 'DECISIONS', risk: 'RISK', map: 'MAP', capabilities: 'CAPABILITIES', tools: 'TOOLS' };
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 32, background: c.bg.primary, borderBottom: '1px solid ' + c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: 'monospace', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, background: c.status.active }} />
          <span style={{ fontSize: 9, color: c.status.active }}>ONLINE</span>
        </div>
        <span style={{ color: c.border.hover }}>│</span>
        <span style={{ fontSize: 10, color: c.text.primary }}>{labels[section]}</span>
        {programme && (<><span style={{ color: c.border.hover }}>│</span><span style={{ fontSize: 9, color: c.accent.primary }}>{programme.shortName}</span></>)}
      </div>
      <span style={{ fontSize: 9, color: c.text.secondary }}>{systemData.operator.name}</span>
    </div>
  );
}

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
    <nav style={{ width: 180, minHeight: '100vh', paddingTop: 32, background: c.bg.secondary, borderRight: '1px solid ' + c.border.default, fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, borderBottom: '1px solid ' + c.border.default }}>
        <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>MODE</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['executive', 'planner'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: 6, border: '1px solid ' + (mode === m ? c.accent.dim : c.border.default), background: mode === m ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 8, color: mode === m ? c.accent.primary : c.text.muted }}>{m.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        {sections.map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <button key={s.id} onClick={() => setSection(s.id)} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: active ? 'linear-gradient(90deg, rgba(160,128,64,0.1), transparent)' : 'transparent', borderLeft: '2px solid ' + (active ? c.accent.dim : 'transparent'), border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{s.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SystemSection() {
  const { setSection, setProgramme } = useCtx();
  const metrics = [
    { label: 'PORTFOLIO VALUE', value: '€3B+', color: c.accent.primary },
    { label: 'TOTAL CAPACITY', value: '458MW', color: c.chart.design },
    { label: 'ON-TIME', value: '94%', color: c.status.active },
    { label: 'PROJECTS', value: '35', color: c.chart.procurement }
  ];
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE SYSTEM</span>
        <h1 style={{ fontSize: 22, color: c.text.primary, margin: '6px 0 2px' }}>{systemData.operator.name}</h1>
        <p style={{ fontSize: 11, color: c.text.secondary }}>Regional Planning Lead • Vantage Data Centers • EMEA</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>{m.label}</span>
            <span style={{ fontSize: 24, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>CAREER PROGRESSION</span>
          <button onClick={() => setSection('career')} style={{ padding: '4px 10px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
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
          <motion.div key={p.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => { setProgramme(p); setSection('programmes'); }} style={{ padding: 16, marginBottom: 10, background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
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

function CareerSection() {
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
          <div key={i} style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default, textAlign: 'center' }}>
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
              <div style={{ position: 'absolute', left: -24, top: 4, width: 16, height: 16, background: job.type === 'current' ? c.status.active : c.bg.card, border: '2px solid ' + (job.type === 'current' ? c.status.active : c.accent.primary), borderRadius: '50%', zIndex: 1 }} />
              <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + (job.type === 'current' ? c.accent.dim : c.border.default) }}>
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
          <div key={i} style={{ padding: 16, marginBottom: 10, background: c.bg.card, border: '1px solid ' + c.border.default, display: 'flex', alignItems: 'center', gap: 16 }}>
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

function ProgrammesSection() {
  const { programme, setProgramme, setSection } = useCtx();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PROGRAMMES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Select Programme</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        {systemData.programmes.map(p => (
          <motion.div key={p.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => setProgramme(p)} style={{ padding: 16, background: programme && programme.id === p.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: '1px solid ' + (programme && programme.id === p.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: p.status === 'ACTIVE' ? c.status.active : c.text.muted }} />
              <span style={{ fontSize: 8, color: p.status === 'ACTIVE' ? c.status.active : c.text.muted }}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 12, color: c.text.primary, margin: 0 }}>{p.name}</h3>
            <p style={{ fontSize: 9, color: c.text.secondary, margin: '2px 0 10px' }}>{p.role}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 18, color: c.accent.primary }}>€{p.value}M</span>
              <span style={{ fontSize: 9, color: c.text.muted }}>{p.totalCapacity}</span>
            </div>
          </motion.div>
        ))}
      </div>
      {programme && (
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, color: c.text.primary, margin: '0 0 4px' }}>{programme.name}</h3>
              <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>{programme.role} • {programme.period}</p>
              <p style={{ fontSize: 10, color: c.text.muted, margin: '4px 0 0' }}><MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />{programme.location.area ? programme.location.area + ', ' : ''}{programme.location.city}, {programme.location.country}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 24, color: c.accent.primary }}>€{programme.value}M</span>
              <span style={{ fontSize: 10, color: c.text.muted, display: 'block' }}>{programme.totalCapacity}</span>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>PROJECTS ({programme.projects.length})</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {programme.projects.map((proj, i) => (
                <div key={i} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: 10, color: c.text.primary }}>{proj.name}</span>
                      <span style={{ fontSize: 9, color: c.text.muted, display: 'block' }}>{proj.type}</span>
                    </div>
                    <span style={{ fontSize: 11, color: c.accent.primary }}>{proj.capacity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['analytics', 'decisions', 'risk'].map(s => (
              <button key={s} onClick={() => setSection(s)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', fontSize: 9, color: c.text.muted, textTransform: 'uppercase' }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsSection() {
  const { programme } = useCtx();
  const p = programme || systemData.programmes[0];
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>ANALYTICS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {p.workstreamTimeline && (
          <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>WORKSTREAM PROGRESS</span>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={p.workstreamTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
                <XAxis dataKey="month" tick={{ fontSize: 8, fill: c.text.muted }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: c.text.muted }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="design" stroke={c.chart.design} fill={c.chart.design} fillOpacity={0.5} name="Design" />
                <Area type="monotone" dataKey="procurement" stroke={c.chart.procurement} fill={c.chart.procurement} fillOpacity={0.5} name="Procurement" />
                <Area type="monotone" dataKey="construction" stroke={c.chart.construction} fill={c.chart.construction} fillOpacity={0.5} name="Construction" />
                <Area type="monotone" dataKey="commissioning" stroke={c.chart.commissioning} fill={c.chart.commissioning} fillOpacity={0.5} name="Commissioning" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>STATUS</span>
          {p.workstreams.map((w, i) => (
            <div key={w.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: c.text.primary }}>{w.name}</span>
                <span style={{ fontSize: 9, color: c.accent.primary }}>{w.progress}%</span>
              </div>
              <div style={{ height: 5, background: c.border.default, borderRadius: 2 }}>
                <div style={{ width: w.progress + '%', height: '100%', background: [c.chart.design, c.chart.procurement, c.chart.construction, c.chart.commissioning][i], borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {p.monteCarlo && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>SCHEDULE PROBABILITY</span>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={p.monteCarlo.distribution}>
                <XAxis dataKey="days" tick={{ fontSize: 8, fill: c.text.muted }} />
                <YAxis tick={{ fontSize: 8, fill: c.text.muted }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="probability" stroke={c.accent.primary} fill={c.accent.glow} name="Probability" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>DECISION IMPACT</span>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={(p.decisions || []).map(function(d) { return { name: d.title.split(' ')[0], cost: (d.metrics && d.metrics.costAvoided ? d.metrics.costAvoided : 0) / 1000000 }; })}>
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

function DecisionsSection() {
  const { programme, decision, setDecision, mode } = useCtx();
  const [phase, setPhase] = useState(0);
  const p = programme || systemData.programmes[0];
  useEffect(function() {
    if (decision) {
      setPhase(0);
      var t1 = setTimeout(function() { setPhase(1); }, 300);
      var t2 = setTimeout(function() { setPhase(2); }, 800);
      var t3 = setTimeout(function() { setPhase(3); }, 1300);
      var t4 = setTimeout(function() { setPhase(4); }, 1800);
      return function() { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [decision]);
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>DECISIONS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div>
          {(p.decisions || []).map(function(d, i) {
            return (
              <div key={d.id} onClick={function() { setDecision(d); }} style={{ padding: 12, marginBottom: 8, background: decision && decision.id === d.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: '1px solid ' + (decision && decision.id === d.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: decision && decision.id === d.id ? c.accent.primary : c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 8, color: decision && decision.id === d.id ? c.bg.primary : c.text.muted }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 10, color: c.text.primary }}>{d.title}</span>
                </div>
                <span style={{ fontSize: 8, color: c.text.muted }}>{d.date}</span>
              </div>
            );
          })}
        </div>
        {decision ? (
          <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <h3 style={{ fontSize: 14, color: c.text.primary, margin: '0 0 16px' }}>{decision.title}</h3>
            <AnimatePresence>
              {phase >= 1 && (<motion.div key="ctx" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.text.muted }}>CONTEXT</span><p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.context}</p></motion.div>)}
              {phase >= 2 && (<motion.div key="int" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.accent.dim, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.accent.primary }}>INTERVENTION</span><p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.intervention}</p></motion.div>)}
              {phase >= 3 && (<motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid ' + c.status.active, marginBottom: 10 }}><span style={{ fontSize: 8, color: c.status.active }}>OUTCOME</span><p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.impact}</p></motion.div>)}
              {phase >= 4 && mode === 'planner' && (<motion.div key="cf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid ' + c.status.critical }}><span style={{ fontSize: 8, color: c.status.critical }}>COUNTERFACTUAL</span><p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.counterfactual}</p></motion.div>)}
            </AnimatePresence>
          </div>
        ) : (
          <div style={{ padding: 40, background: c.bg.card, border: '1px solid ' + c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 11, color: c.text.muted }}>Select a decision</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RiskSection() {
  const { programme, scenario, setScenario } = useCtx();
  const p = programme || systemData.programmes[0];
  var mult = { p20: 0.7, p50: 1, p80: 1.4 };
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>RISK</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['p20', 'p50', 'p80'].map(function(s) {
          return (<button key={s} onClick={function() { setScenario(s); }} style={{ padding: '8px 12px', border: '1px solid ' + (scenario === s ? c.accent.dim : c.border.default), background: scenario === s ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 9, color: scenario === s ? c.accent.primary : c.text.muted }}>{s.toUpperCase()}</button>);
        })}
      </div>
      {p.risks ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {p.risks.map(function(r) {
            var adj = Math.min(100, Math.round(r.probability * mult[scenario]));
            var col = r.impact > 80 ? c.status.critical : r.impact > 60 ? c.status.warning : c.status.info;
            return (
              <div key={r.id} style={{ padding: 14, background: c.bg.card, border: '1px solid ' + c.border.default, borderLeft: '3px solid ' + col }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: c.text.primary }}>{r.title}</span>
                  <span style={{ fontSize: 9, color: col }}>{adj}%</span>
                </div>
                <div style={{ height: 4, background: c.border.default }}><div style={{ width: adj + '%', height: '100%', background: col }} /></div>
              </div>
            );
          })}
        </div>
      ) : (<p style={{ color: c.text.muted, fontSize: 10 }}>No active risks</p>)}
    </div>
  );
}

function MapSection() {
  const [hover, setHover] = useState(null);
  function toXY(lat, lng) { return { x: ((lng + 15) / 50) * 700 + 50, y: ((58 - lat) / 15) * 400 + 50 }; }
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>GEOGRAPHIC DISTRIBUTION</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0' }}>Project Locations</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 20 }}>6 Countries • 35 Projects • 458MW</p>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <svg width="100%" height="400" viewBox="0 0 800 500" style={{ background: c.bg.secondary }}>
            {systemData.locations.map(function(loc) {
              var pos = toXY(loc.lat, loc.lng);
              var col = loc.status === 'active' ? c.status.active : c.accent.primary;
              return (
                <g key={loc.id} onMouseEnter={function() { setHover(loc.id); }} onMouseLeave={function() { setHover(null); }} style={{ cursor: 'pointer' }}>
                  {loc.status === 'active' && (<circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={col} strokeWidth="1" opacity="0.4"><animate attributeName="r" from="10" to="22" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" /></circle>)}
                  <rect x={pos.x - 6} y={pos.y - 6} width={12} height={12} fill={col} transform={'rotate(45 ' + pos.x + ' ' + pos.y + ')'} />
                  {hover === loc.id && (<><rect x={pos.x + 12} y={pos.y - 30} width={120} height={45} fill={c.bg.elevated} stroke={c.border.default} /><text x={pos.x + 18} y={pos.y - 12} fill={c.text.primary} fontSize="9">{loc.name}</text><text x={pos.x + 18} y={pos.y} fill={c.text.secondary} fontSize="8">{loc.type}</text><text x={pos.x + 18} y={pos.y + 12} fill={c.accent.primary} fontSize="8">{loc.capacity}</text></>)}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 440, overflowY: 'auto' }}>
          {systemData.locations.map(function(loc) {
            return (
              <div key={loc.id} onMouseEnter={function() { setHover(loc.id); }} onMouseLeave={function() { setHover(null); }} style={{ padding: 12, background: hover === loc.id ? c.bg.elevated : c.bg.card, border: '1px solid ' + (hover === loc.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, background: loc.status === 'active' ? c.status.active : c.accent.primary }} />
                  <span style={{ fontSize: 10, color: c.text.primary }}>{loc.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 8, color: c.text.muted }}>{loc.type}</span>
                  <span style={{ fontSize: 9, color: c.accent.primary }}>{loc.capacity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  function handleSend() {
    setStatus('sending');
    fetch('https://formspree.io/f/xpwzgkvq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      .then(function(res) { if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', message: '' }); } else { setStatus('error'); } })
      .catch(function() { setStatus('error'); });
  }
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>CAPABILITIES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Technical Matrix</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
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
          {Object.entries(systemData.capabilities).map(function(entry) {
            var k = entry[0]; var v = entry[1];
            return (
              <div key={k} style={{ padding: 12, marginBottom: 8, background: c.bg.card, border: '1px solid ' + c.border.default }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: c.text.primary, textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: 11, color: c.accent.primary }}>{v.score}%</span>
                </div>
                <div style={{ height: 3, background: c.border.default }}><div style={{ width: v.score + '%', height: '100%', background: c.accent.primary }} /></div>
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {v.tools.map(function(t, i) { return (<span key={i} style={{ fontSize: 7, padding: '2px 4px', background: c.bg.secondary, color: c.text.muted }}>{t}</span>); })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>CONNECT</span>
          <a href="https://www.linkedin.com/in/aniket-latpate/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#0a66c2', textDecoration: 'none', marginBottom: 12 }}>
            <ExternalLink size={16} color="white" /><span style={{ fontSize: 11, color: 'white' }}>Connect on LinkedIn</span>
          </a>
          <div style={{ padding: 12, background: c.bg.secondary }}>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📧 {systemData.operator.email}</p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📱 {systemData.operator.phone}</p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>📍 {systemData.operator.location}</p>
          </div>
        </div>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>SEND MESSAGE</span>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: 20 }}><CheckCircle size={32} color={c.status.active} /><p style={{ fontSize: 12, color: c.status.active, marginTop: 12 }}>Message Sent!</p></div>
          ) : (
            <div>
              <input type="text" value={formData.name} onChange={function(e) { setFormData({ name: e.target.value, email: formData.email, message: formData.message }); }} placeholder="Name" style={{ width: '100%', padding: 8, marginBottom: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input type="email" value={formData.email} onChange={function(e) { setFormData({ name: formData.name, email: e.target.value, message: formData.message }); }} placeholder="Email" style={{ width: '100%', padding: 8, marginBottom: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <textarea value={formData.message} onChange={function(e) { setFormData({ name: formData.name, email: formData.email, message: e.target.value }); }} placeholder="Message" rows={3} style={{ width: '100%', padding: 8, marginBottom: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace', resize: 'none' }} />
              <button onClick={handleSend} disabled={!formData.name || !formData.email || !formData.message} style={{ width: '100%', padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: (!formData.name || !formData.email || !formData.message) ? 0.5 : 1 }}>
                <span style={{ fontSize: 10, color: c.bg.primary }}>{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolsSection() {
  const { toolsTab, setToolsTab } = useCtx();
  const [qsraResults, setQsraResults] = useState(null);
  const [dcmaResults, setDcmaResults] = useState(null);
  const [projectInfo, setProjectInfo] = useState({ name: '', dataDate: '' });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);

  function runQSRA() {
    setAnalyzing(true);
    setProgress(0);
    var interval = setInterval(function() {
      setProgress(function(p) {
        if (p >= 100) {
          clearInterval(interval);
          var results = qsraChecks.map(function(ck) {
            var rand = Math.random();
            var val = Math.round(rand * 15);
            var st = rand > 0.6 ? 'PASS' : rand > 0.3 ? 'AMBER' : 'FAIL';
            return { id: ck.id, name: ck.name, threshold: ck.threshold, value: val, status: st };
          });
          var passed = results.filter(function(r) { return r.status === 'PASS'; }).length;
          var amber = results.filter(function(r) { return r.status === 'AMBER'; }).length;
          var score = Math.round(((passed + amber * 0.5) / results.length) * 100);
          setQsraResults({ projectName: projectInfo.name || 'Analysis', healthScore: score, checks: results, fitness: score >= 80 ? 'Fit for prospective' : score >= 60 ? 'Fit for retrospective' : 'At risk' });
          setAnalyzing(false);
          return 100;
        }
        return p + 12.5;
      });
    }, 250);
  }

  function runDCMA() {
    setAnalyzing(true);
    setProgress(0);
    var interval = setInterval(function() {
      setProgress(function(p) {
        if (p >= 100) {
          clearInterval(interval);
          var results = dcmaChecks.map(function(ck) {
            var rand = Math.random();
            var val = Math.round(rand * 10);
            var st = rand > 0.5 ? 'PASS' : 'WARNING';
            return { id: ck.id, name: ck.name, threshold: ck.threshold, value: val, status: st };
          });
          var passed = results.filter(function(r) { return r.status === 'PASS'; }).length;
          setDcmaResults({ projectName: projectInfo.name || 'Analysis', score: Math.round((passed / 14) * 100), checks: results, compliance: passed >= 12 ? 'COMPLIANT' : passed >= 10 ? 'MARGINAL' : 'NON-COMPLIANT' });
          setAnalyzing(false);
          return 100;
        }
        return p + 7.14;
      });
    }, 120);
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setProjectInfo({ name: e.target.files[0].name.replace(/\.[^/.]+$/, ''), dataDate: projectInfo.dataDate });
    }
  }

  var tabs = [
    { id: 'qsra', label: 'QSRA', icon: CheckSquare },
    { id: 'dcma', label: 'DCMA 14-PT', icon: Shield }
  ];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>Analysis Tools</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 20 }}>QSRA Schedule Health Check • DCMA 14-Point Assessment</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(function(t) {
          var Icon = t.icon;
          var active = toolsTab === t.id;
          return (
            <button key={t.id} onClick={function() { setToolsTab(t.id); }} style={{ padding: '10px 16px', background: active ? 'rgba(160,128,64,0.15)' : c.bg.card, border: '1px solid ' + (active ? c.accent.dim : c.border.default), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {toolsTab === 'qsra' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Upload size={16} color={c.accent.primary} />
                <span style={{ fontSize: 11, color: c.text.primary }}>Schedule Analysis</span>
              </div>
              <input type="text" value={projectInfo.name} onChange={function(e) { setProjectInfo({ name: e.target.value, dataDate: projectInfo.dataDate }); }} placeholder="Project Name" style={{ width: '100%', padding: 10, marginBottom: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input type="date" value={projectInfo.dataDate} onChange={function(e) { setProjectInfo({ name: projectInfo.name, dataDate: e.target.value }); }} style={{ width: '100%', padding: 10, marginBottom: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <input ref={fileRef} type="file" accept=".xer,.xml,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
              <div onClick={function() { if (fileRef.current) fileRef.current.click(); }} style={{ padding: 24, border: '2px dashed ' + (uploadedFile ? c.status.active : c.border.default), textAlign: 'center', marginBottom: 16, cursor: 'pointer', background: uploadedFile ? 'rgba(34,197,94,0.1)' : 'transparent' }}>
                {uploadedFile ? (
                  <div><CheckCircle size={24} color={c.status.active} style={{ marginBottom: 8 }} /><p style={{ fontSize: 10, color: c.status.active, margin: 0 }}>{uploadedFile.name}</p></div>
                ) : (
                  <div><FileText size={24} color={c.text.muted} style={{ marginBottom: 8 }} /><p style={{ fontSize: 10, color: c.text.muted, margin: 0 }}>Drop P6 XER or click to upload</p></div>
                )}
              </div>
              <button onClick={runQSRA} disabled={analyzing} style={{ width: '100%', padding: 14, background: analyzing ? c.bg.secondary : c.accent.primary, border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 10, color: analyzing ? c.text.muted : c.bg.primary }}>{analyzing ? 'ANALYZING... ' + Math.round(progress) + '%' : 'RUN QSRA ANALYSIS'}</span>
              </button>
              {analyzing && (<div style={{ marginTop: 12, height: 4, background: c.border.default }}><motion.div animate={{ width: progress + '%' }} style={{ height: '100%', background: c.accent.primary }} /></div>)}
            </div>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: c.text.muted }}>HEALTH SCORE</span>
                {qsraResults && (<button onClick={function() { alert('PDF export - install jspdf'); }} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid ' + c.accent.dim, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={12} color={c.accent.primary} /><span style={{ fontSize: 8, color: c.accent.primary }}>PDF</span></button>)}
              </div>
              {qsraResults ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 56, color: qsraResults.healthScore >= 80 ? c.status.active : qsraResults.healthScore >= 60 ? c.status.warning : c.status.critical }}>{qsraResults.healthScore}</span>
                    <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(34,197,94,0.2)', color: c.status.active }}>{qsraResults.checks.filter(function(r) { return r.status === 'PASS'; }).length} PASS</span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(234,179,8,0.2)', color: c.status.warning }}>{qsraResults.checks.filter(function(r) { return r.status === 'AMBER'; }).length} AMBER</span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(239,68,68,0.2)', color: c.status.critical }}>{qsraResults.checks.filter(function(r) { return r.status === 'FAIL'; }).length} FAIL</span>
                  </div>
                  <div style={{ padding: 12, background: c.bg.secondary }}><span style={{ fontSize: 9, color: c.text.muted }}>FITNESS: </span><span style={{ fontSize: 10, color: c.status.active }}>{qsraResults.fitness}</span></div>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}><HelpCircle size={32} color={c.text.muted} /><p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Upload schedule to analyze</p></div>
              )}
            </div>
          </div>
          {qsraResults && (
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>ASSESSMENT RESULTS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {qsraResults.checks.map(function(ck) {
                  var col = ck.status === 'PASS' ? c.status.active : ck.status === 'AMBER' ? c.status.warning : c.status.critical;
                  return (
                    <div key={ck.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: '3px solid ' + col }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: c.text.primary }}>{ck.id}. {ck.name}</span>
                        <span style={{ fontSize: 8, padding: '2px 6px', background: col + '33', color: col }}>{ck.status}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 8, color: c.text.dim }}>Target: {ck.threshold}</span>
                        <span style={{ fontSize: 8, color: c.text.secondary }}>Actual: {ck.value}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'dcma' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Shield size={16} color={c.accent.primary} />
                <span style={{ fontSize: 11, color: c.text.primary }}>DCMA 14-Point Assessment</span>
              </div>
              <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 16 }}>Defense Contract Management Agency schedule quality standard.</p>
              <button onClick={runDCMA} disabled={analyzing} style={{ width: '100%', padding: 14, background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 10, color: c.bg.primary }}>{analyzing ? 'ANALYZING... ' + Math.round(progress) + '%' : 'RUN DCMA ANALYSIS'}</span>
              </button>
            </div>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 9, color: c.text.muted }}>COMPLIANCE SCORE</span>
              </div>
              {dcmaResults ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 56, color: dcmaResults.score >= 85 ? c.status.active : dcmaResults.score >= 70 ? c.status.warning : c.status.critical }}>{dcmaResults.score}</span>
                    <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                  </div>
                  <div style={{ padding: 12, background: dcmaResults.compliance === 'COMPLIANT' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', border: '1px solid ' + (dcmaResults.compliance === 'COMPLIANT' ? c.status.active : c.status.warning) }}>
                    <span style={{ fontSize: 12, color: dcmaResults.compliance === 'COMPLIANT' ? c.status.active : c.status.warning }}>{dcmaResults.compliance}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}><Shield size={32} color={c.text.muted} /><p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Run analysis to see results</p></div>
              )}
            </div>
          </div>
          {dcmaResults && (
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>14-POINT RESULTS</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {dcmaResults.checks.map(function(ck) {
                  var col = ck.status === 'PASS' ? c.status.active : c.status.warning;
                  return (
                    <div key={ck.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: '3px solid ' + col }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: c.text.primary }}>{ck.id}. {ck.name}</span>
                        <span style={{ fontSize: 8, color: col }}>{ck.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, ' + c.accent.primary + ', ' + c.accent.bright + ')', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px ' + c.accent.glow, zIndex: 1000 }}>
        <Bot size={24} color={c.bg.primary} />
      </motion.button>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'fixed', bottom: 24, right: 24, width: 360, height: 480, background: c.bg.secondary, border: '1px solid ' + c.border.default, display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid ' + c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, ' + c.accent.primary + ', ' + c.accent.bright + ')', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color={c.bg.primary} />
          </div>
          <div>
            <span style={{ fontSize: 11, color: c.text.primary }}>Planning AI</span>
            <span style={{ fontSize: 9, color: c.status.active, display: 'block' }}>● Online</span>
          </div>
        </div>
        <button onClick={function() { setAiOpen(false); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <X size={18} color={c.text.muted} />
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.map(function(m, i) {
          return (
            <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: 28, height: 28, flexShrink: 0, background: m.role === 'user' ? c.status.info : c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color={c.bg.primary} />}
              </div>
              <div style={{ maxWidth: '80%', padding: '10px 12px', background: m.role === 'user' ? 'rgba(59,130,246,0.2)' : c.bg.card, border: '1px solid ' + (m.role === 'user' ? 'rgba(59,130,246,0.3)' : c.border.default) }}>
                <p style={{ fontSize: 11, color: c.text.primary, margin: 0, lineHeight: 1.5 }}>{m.content}</p>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color={c.bg.primary} />
            </div>
            <div style={{ padding: '10px 12px', background: c.bg.card }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent.primary }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent.primary }} />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent.primary }} />
              </div>
            </div>
          </div>
        )}
        <div ref={ref} />
      </div>
      <div style={{ padding: 12, borderTop: '1px solid ' + c.border.default, display: 'flex', gap: 8 }}>
        <input type="text" value={input} onChange={function(e) { setInput(e.target.value); }} onKeyPress={function(e) { if (e.key === 'Enter') send(); }} placeholder="Ask anything..." style={{ flex: 1, padding: '10px 12px', background: c.bg.card, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }} />
        <button onClick={send} style={{ padding: '10px 14px', background: input.trim() ? c.accent.primary : c.bg.card, border: 'none', cursor: 'pointer' }}>
          <Send size={14} color={input.trim() ? c.bg.primary : c.text.muted} />
        </button>
      </div>
    </motion.div>
  );
}

function Main() {
  const { section } = useCtx();
  var sectionComponents = {
    system: SystemSection,
    career: CareerSection,
    analytics: AnalyticsSection,
    programmes: ProgrammesSection,
    decisions: DecisionsSection,
    risk: RiskSection,
    map: MapSection,
    capabilities: CapabilitiesSection,
    tools: ToolsSection
  };
  var Section = sectionComponents[section] || SystemSection;
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

export default function App() {
  const [booted, setBooted] = useState(false);
  return (
    <Provider>
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div key="boot" exit={{ opacity: 0 }}>
            <Boot onComplete={function() { setBooted(true); }} />
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Main />
            <AIAssistant />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{'* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #030303; overflow-x: hidden; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #333; }'}</style>
    </Provider>
  );
}
