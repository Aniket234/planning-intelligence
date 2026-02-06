import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Scatter } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Target, Zap, Shield, Activity, Globe, Layers, GitBranch, ChevronRight, RotateCcw, FileText, Settings, Upload, Search, Scale, Clock, AlertCircle, CheckSquare, XSquare, HelpCircle, MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════════════════════

const systemData = {
  operator: { name: 'ANIKET LATPATE', role: 'REGIONAL PLANNING LEAD', region: 'EMEA', yearsExperience: 8 },
  metrics: { portfolioValue: 2500, totalCapacity: 80, projectsDelivered: 12, decisionsLogged: 847, risksMitigated: 156, onTimeDelivery: 94 },
  
  locations: [
    { id: 'dublin-1', name: 'Dublin Campus A', lat: 53.35, lng: -6.26, capacity: '32MW', value: 750, status: 'active', type: 'Data Centre' },
    { id: 'dublin-2', name: 'Dublin Campus B', lat: 53.34, lng: -6.25, capacity: '48MW', value: 800, status: 'active', type: 'Data Centre' },
    { id: 'france-1', name: 'Paris Region', lat: 48.86, lng: 2.35, capacity: '25MW', value: 320, status: 'completed', type: 'Data Centre' },
    { id: 'germany-1', name: 'Frankfurt', lat: 50.11, lng: 8.68, capacity: '18MW', value: 280, status: 'completed', type: 'Pharmaceutical' },
  ],

  careerTimeline: [
    { year: '2017', value: 50, complexity: 30 },
    { year: '2019', value: 150, complexity: 55 },
    { year: '2020', value: 200, complexity: 65 },
    { year: '2021', value: 280, complexity: 70 },
    { year: '2022', value: 350, complexity: 80 },
    { year: '2023', value: 450, complexity: 85 },
    { year: '2024', value: 550, complexity: 88 },
    { year: '2025', value: 750, complexity: 95 },
  ],

  programmes: [
    {
      id: 'vantage', name: 'VANTAGE DUBLIN PORTFOLIO', shortName: 'VDC', role: 'Regional Planning Lead', period: '2025–PRESENT', status: 'ACTIVE', value: 1500,
      workstreamTimeline: [
        { month: 'Jan', design: 85, procurement: 70, construction: 45, commissioning: 10 },
        { month: 'Feb', design: 88, procurement: 75, construction: 52, commissioning: 15 },
        { month: 'Mar', design: 90, procurement: 80, construction: 58, commissioning: 20 },
        { month: 'Apr', design: 92, procurement: 83, construction: 64, commissioning: 25 },
        { month: 'May', design: 94, procurement: 86, construction: 70, commissioning: 32 },
        { month: 'Jun', design: 95, procurement: 88, construction: 72, commissioning: 35 },
      ],
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 95, confidence: 92, float: 12 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 88, confidence: 85, float: 8 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 72, confidence: 78, float: 15 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 35, confidence: 70, float: 22 },
      ],
      risks: [
        { id: 'r1', category: 'Vendor', title: 'Generator Delivery', probability: 35, impact: 85 },
        { id: 'r2', category: 'Utility', title: 'Grid Connection', probability: 20, impact: 95 },
        { id: 'r3', category: 'Resource', title: 'Cx Engineers', probability: 45, impact: 60 },
      ],
      monteCarlo: {
        p10: -15, p50: 0, p80: 12, p90: 18,
        distribution: [
          { days: -20, probability: 2 }, { days: -15, probability: 5 }, { days: -10, probability: 12 },
          { days: -5, probability: 18 }, { days: 0, probability: 25 }, { days: 5, probability: 18 },
          { days: 10, probability: 12 }, { days: 15, probability: 5 }, { days: 20, probability: 3 },
        ],
      },
      decisions: [
        { id: 'd1', title: 'IMS RESTRUCTURE', date: '2025-06', type: 'Logic Restructuring', context: 'Naive schedule showed facilities on independent paths', intervention: 'Integrated Master Schedule with shared milestones', tradeoff: { time: -2, risk: 15, confidence: 25, cost: 50 }, impact: 'Protected RFS by identifying 47 dependencies', counterfactual: '3-month clash, €4.2M exposure', metrics: { costAvoided: 4200000, floatRecovered: 18 } },
        { id: 'd2', title: 'CX PARALLELISATION', date: '2025-08', type: 'Sequencing', context: 'Sequential commissioning showed 6-week overrun', intervention: 'Parallelised Cx across independent systems', tradeoff: { time: 6, risk: -20, confidence: 15, cost: -30 }, impact: 'Absorbed vendor delay without RFS impact', counterfactual: 'Critical path breach', metrics: { costAvoided: 2800000, floatRecovered: 32 } },
      ],
    },
    {
      id: 'puredc', name: 'PURE DC GLOBAL', shortName: 'PDC', role: 'Planning Manager', period: '2022–2024', status: 'COMPLETED', value: 550,
      workstreams: [
        { id: 'design', name: 'DESIGN', progress: 100, confidence: 100, float: 0 },
        { id: 'procurement', name: 'PROCUREMENT', progress: 100, confidence: 100, float: 0 },
        { id: 'construction', name: 'CONSTRUCTION', progress: 100, confidence: 100, float: 0 },
        { id: 'commissioning', name: 'COMMISSIONING', progress: 100, confidence: 100, float: 0 },
      ],
      decisions: [
        { id: 'd1', title: 'CP RESEQUENCE', date: '2023-03', type: 'Logic', context: 'Permit delay created 8-week breach', intervention: 'Resequenced non-permit works', tradeoff: { time: 8, risk: -45, confidence: 35, cost: 0 }, impact: 'Absorbed delay without RFS slip', counterfactual: 'RFS slip 8 weeks', metrics: { costAvoided: 6500000, floatRecovered: 42 } },
      ],
    },
  ],

  capabilityRadar: [
    { capability: 'Planning', value: 95 }, { capability: 'Analysis', value: 90 },
    { capability: 'Reporting', value: 88 }, { capability: 'Governance', value: 92 },
    { capability: 'Technical', value: 85 }, { capability: 'Leadership', value: 88 },
  ],

  capabilities: {
    planning: { score: 95, tools: ['Primavera P6', 'MS Project', 'Synchro 4D'] },
    analysis: { score: 90, tools: ['EVM', 'DCMA 14-Point', 'Monte Carlo'] },
    reporting: { score: 88, tools: ['Power BI', 'Power Apps'] },
    governance: { score: 92, tools: ['IMS', 'EOT Analysis', 'Delay Forensics'] },
  },

  education: [
    { degree: 'MSc. Sustainable Energy', institution: 'UCD', year: '2019' },
    { degree: 'B.E Electrical Engineering', institution: 'University of Mumbai', year: '2016' },
  ],

  contact: { email: 'latpate.aniket92@gmail.com', phone: '+353 894451882', linkedin: 'linkedin.com/in/Aniket-Latpate' },
};

// QSRA Health Check Data (Based on Laminar Projects methodology)
const qsraChecks = [
  { id: '1a', name: 'FS Relationships', desc: 'Min 90% of relationships are FS with 0d lag', threshold: '≥70%', target: 70, amber: 60, weight: 10 },
  { id: '1b', name: 'SF Relationships', desc: 'Start-Finish relationships not permitted', threshold: '=0', target: 0, amber: 0, weight: 8 },
  { id: '2a', name: 'Missing Predecessors', desc: 'Only first activity may lack predecessor', threshold: '≤1', target: 1, amber: 10, weight: 9 },
  { id: '2b', name: 'Missing Successors', desc: 'Only last activity may lack successor', threshold: '≤1', target: 1, amber: 10, weight: 9 },
  { id: '3', name: 'Lead Relationships', desc: '0% of relationships have leads (<0d lag)', threshold: '=0%', target: 0, amber: 0, weight: 10 },
  { id: '4', name: 'Lag Relationships', desc: 'Less than 15% of relationships have lags', threshold: '<15%', target: 15, amber: 20, weight: 7 },
  { id: '5', name: 'Excessive Lags', desc: 'Lags exceeding 10% of total duration', threshold: '<5%', target: 5, amber: 10, weight: 6 },
  { id: '6a', name: 'Hard Constraints', desc: 'No hard constraints (Mandatory Start/Finish)', threshold: '=0', target: 0, amber: 2, weight: 10 },
  { id: '6b', name: 'Soft Constraints', desc: 'Less than 10% of activities have constraints', threshold: '<10%', target: 10, amber: 15, weight: 7 },
  { id: '7', name: 'Excessive Durations', desc: 'Less than 10% of activities >20d duration', threshold: '<10%', target: 10, amber: 15, weight: 6 },
  { id: '8', name: 'Negative Float', desc: '0% of activities have negative total float', threshold: '=0%', target: 0, amber: 2, weight: 10 },
  { id: '9', name: 'Critical Float', desc: '5-15% of activities have 0-15d total float', threshold: '5-15%', target: null, amber: null, weight: 5 },
  { id: '10', name: 'Excessive Float', desc: 'Less than 10% of activities >40d float', threshold: '<10%', target: 10, amber: 15, weight: 5 },
  { id: '11a', name: 'Invalid Planned Dates', desc: '0% of activities have planned dates in past', threshold: '=0%', target: 0, amber: 0, weight: 8 },
  { id: '11b', name: 'Invalid Actual Dates', desc: '0% of activities have actual dates in future', threshold: '=0%', target: 0, amber: 0, weight: 8 },
  { id: '12', name: 'Riding Data Date', desc: 'Less than 5% of activities on data date', threshold: '<5%', target: 5, amber: 10, weight: 4 },
  { id: '13', name: 'Resource Loaded', desc: 'Over 90% of activities have resources', threshold: '>90%', target: 90, amber: 80, weight: 4 },
];

// AI Knowledge Base for the assistant
const aiKnowledgeBase = {
  about: {
    name: "Aniket Latpate",
    role: "Regional Planning Lead - EMEA",
    company: "Vantage Data Centers",
    experience: "8+ years in capital project planning",
    specializations: ["Hyperscale Data Centers", "MEP Planning", "Delay Analysis", "Forensic Planning"],
    portfolio: "€2.5B+ in delivered projects",
    location: "Dublin, Ireland"
  },
  sections: {
    system: "Overview of career metrics, portfolio value, and active programmes",
    analytics: "Interactive charts showing workstream progress, Monte Carlo analysis, and decision impact",
    programmes: "Detailed view of all programmes including Vantage Dublin (€1.5B), Pure DC (€550M), Mercury Engineering",
    decisions: "Replay mode showing key planning interventions with context, trade-offs, and outcomes",
    risk: "Risk matrix with P20/P50/P80 scenarios and Monte Carlo schedule distribution",
    map: "Geographic distribution of projects across EMEA",
    capabilities: "Technical skills radar, tools proficiency, and contact form",
    tools: "QSRA Schedule Health Check, Delay Analysis Method Selector, Claim Readiness Assessment"
  },
  tools: {
    qsra: "Quantitative Schedule Risk Assessment based on 17-point health check methodology developed by Laminar Projects",
    dcma: "DCMA 14-Point Assessment for schedule quality compliance",
    delay: "SCL Protocol-aligned delay analysis method selection based on available records",
    claim: "Claim readiness scoring and dispute risk simulation"
  },
  expertise: ["Primavera P6", "MS Project", "Synchro 4D", "Power BI", "Monte Carlo Analysis", "EVM", "DCMA 14-Point", "SCL Protocol", "EOT Analysis", "Delay Forensics"]
};

// Delay Analysis Methods
const delayMethods = [
  { id: 'impacted', name: 'Impacted As-Planned', type: 'Prospective', complexity: 'Low', dataReq: 'Low', defensibility: 'Medium', desc: 'Inserts delay events into baseline to show theoretical impact' },
  { id: 'collapsed', name: 'Collapsed As-Built', type: 'Retrospective', complexity: 'High', dataReq: 'High', defensibility: 'High', desc: 'Removes delay events from as-built to show but-for completion' },
  { id: 'tia', name: 'Time Impact Analysis', type: 'Prospective', complexity: 'High', dataReq: 'High', defensibility: 'High', desc: 'Contemporaneous analysis at time of delay event' },
  { id: 'windows', name: 'Windows Analysis', type: 'Retrospective', complexity: 'Very High', dataReq: 'Very High', defensibility: 'Very High', desc: 'Period-by-period analysis using updated programmes' },
  { id: 'asplanned', name: 'As-Planned vs As-Built', type: 'Retrospective', complexity: 'Medium', dataReq: 'Medium', defensibility: 'Medium', desc: 'Comparison of planned vs actual dates' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const c = {
  bg: { primary: '#030303', secondary: '#080808', card: '#0a0a0a', elevated: '#101010' },
  text: { primary: '#e4e4e4', secondary: '#888888', muted: '#555555', dim: '#333333' },
  accent: { primary: '#a08040', bright: '#c4a050', dim: '#705830', glow: 'rgba(160,128,64,0.4)' },
  status: { active: '#22c55e', warning: '#eab308', critical: '#ef4444', info: '#3b82f6' },
  chart: { design: '#3b82f6', procurement: '#8b5cf6', construction: '#22c55e', commissioning: '#eab308' },
  border: { default: '#1a1a1a', hover: '#2a2a2a' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const Ctx = createContext(null);
const useCtx = () => useContext(Ctx);

function Provider({ children }) {
  const [section, setSection] = useState('system');
  const [programme, setProgramme] = useState(null);
  const [decision, setDecision] = useState(null);
  const [mode, setMode] = useState('executive');
  const [scenario, setScenario] = useState('p50');
  const [stress, setStress] = useState(null);
  const [toolsTab, setToolsTab] = useState('qsra');
  const [aiOpen, setAiOpen] = useState(false);
  
  return (
    <Ctx.Provider value={{ section, setSection, programme, setProgramme, decision, setDecision, mode, setMode, scenario, setScenario, stress, setStress, toolsTab, setToolsTab, aiOpen, setAiOpen }}>
      {children}
    </Ctx.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI ASSISTANT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function AIAssistant() {
  const { aiOpen, setAiOpen, setSection } = useCtx();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm Aniket's Planning Intelligence Assistant. I can help you navigate this portfolio, answer questions about his experience, explain the QSRA tools, or discuss planning methodologies. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Navigation commands
    if (msg.includes('show') || msg.includes('go to') || msg.includes('navigate') || msg.includes('open')) {
      if (msg.includes('system') || msg.includes('overview') || msg.includes('home')) {
        setSection('system');
        return "I've navigated you to the System Overview. Here you can see Aniket's key metrics, career progression chart, and active programmes.";
      }
      if (msg.includes('analytics') || msg.includes('chart') || msg.includes('graph')) {
        setSection('analytics');
        return "I've opened the Analytics Dashboard. You'll find workstream progress charts, Monte Carlo distributions, and decision impact analysis here.";
      }
      if (msg.includes('programme') || msg.includes('project')) {
        setSection('programmes');
        return "I've navigated to the Programmes section. Click on any programme to see detailed constraint analysis and system inputs.";
      }
      if (msg.includes('decision') || msg.includes('replay')) {
        setSection('decisions');
        return "Welcome to Decision Replay Mode. Select any decision node on the left to see an animated replay of the context, intervention, trade-offs, and outcomes.";
      }
      if (msg.includes('risk') || msg.includes('monte carlo')) {
        setSection('risk');
        return "I've opened the Risk & Uncertainty section. Toggle between P20/P50/P80 scenarios to see how risk probabilities change. The Monte Carlo distribution shows schedule confidence levels.";
      }
      if (msg.includes('map') || msg.includes('location') || msg.includes('geograph')) {
        setSection('map');
        return "Here's the geographic distribution of projects. Hover over any marker to see project details. Active projects pulse on the map.";
      }
      if (msg.includes('capabil') || msg.includes('skill') || msg.includes('contact')) {
        setSection('capabilities');
        return "I've navigated to the Capabilities section. You'll find the competency radar chart, technical skills, and a contact form to reach Aniket directly.";
      }
      if (msg.includes('tool') || msg.includes('qsra') || msg.includes('dcma') || msg.includes('delay analysis')) {
        setSection('tools');
        return "Welcome to the Analysis Tools section. You can run QSRA Schedule Health Checks, select appropriate delay analysis methods, assess claim readiness, and simulate expert cross-examination.";
      }
    }
    
    // About Aniket
    if (msg.includes('who is') || msg.includes('about') || msg.includes('aniket') || msg.includes('background')) {
      return `Aniket Latpate is a Regional Planning Lead for EMEA at Vantage Data Centers, managing a €1.5B+ hyperscale data center portfolio in Dublin. With ${aiKnowledgeBase.about.experience}, he specializes in ${aiKnowledgeBase.about.specializations.join(', ')}. His total delivered portfolio exceeds ${aiKnowledgeBase.about.portfolio}.`;
    }
    
    // Experience & Portfolio
    if (msg.includes('experience') || msg.includes('portfolio') || msg.includes('project')) {
      return "Aniket has delivered €2.5B+ in capital projects across data centers, pharmaceuticals, and healthcare sectors. Key programmes include: Vantage Dublin (€1.5B, 80MW - current), Pure DC Global (€550M - completed), Mercury Engineering International (€459M - completed). He has worked across Ireland, UK, France, and Germany.";
    }
    
    // Tools & Methodology
    if (msg.includes('qsra') || msg.includes('schedule health') || msg.includes('health check')) {
      return "The QSRA (Quantitative Schedule Risk Assessment) is a 17-point schedule health check methodology. It evaluates: logic integrity (FS relationships, open ends, leads/lags), constraints usage, duration distribution, float analysis, date validity, and resource loading. Each check has target and amber thresholds. Go to Tools → QSRA to run an analysis.";
    }
    
    if (msg.includes('delay analysis') || msg.includes('scl') || msg.includes('methodology')) {
      return "Aniket uses SCL Protocol-aligned delay analysis methodologies. The method selector recommends approaches based on available records: Windows Analysis (highest defensibility), Time Impact Analysis (prospective), Collapsed As-Built (retrospective), or As-Planned vs As-Built. Go to Tools → Delay Analysis to see the selector.";
    }
    
    if (msg.includes('dcma') || msg.includes('14 point') || msg.includes('14-point')) {
      return "The DCMA 14-Point Assessment is a US Defense Contract Management Agency standard for schedule quality. It checks: logic completeness, leads/lags, relationship types, constraints, float distribution, duration reasonableness, invalid dates, resources, and critical path validity. Aniket's QSRA tool incorporates these checks with additional metrics.";
    }
    
    // Skills & Tools
    if (msg.includes('skill') || msg.includes('tool') || msg.includes('software') || msg.includes('capabil')) {
      return `Aniket's core competencies: Planning (95%) - Primavera P6, MS Project, Synchro 4D; Analysis (90%) - EVM, DCMA 14-Point, Monte Carlo; Reporting (88%) - Power BI, Power Apps; Governance (92%) - IMS Development, EOT Analysis, Delay Forensics. Navigate to Capabilities to see the full radar chart.`;
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach') || msg.includes('linkedin')) {
      return "You can connect with Aniket via: LinkedIn (linkedin.com/in/aniket-latpate), Email (latpate.aniket92@gmail.com), or Phone (+353 894451882). There's also a contact form in the Capabilities section that sends messages directly to his email.";
    }
    
    // Monte Carlo / Risk
    if (msg.includes('monte carlo') || msg.includes('probability') || msg.includes('p50') || msg.includes('p80')) {
      return "Monte Carlo analysis shows schedule confidence levels. P50 means 50% probability of achieving that date (most likely). P80 is the 'board-safe' confidence level with 80% probability. The Risk section shows these distributions with adjustable scenarios. Aniket uses this for executive reporting and risk-based decision making.";
    }
    
    // Decision Replay
    if (msg.includes('decision') && (msg.includes('replay') || msg.includes('how') || msg.includes('work'))) {
      return "Decision Replay Mode shows how Aniket approaches complex planning problems. Each decision node displays: Context (the problem), Intervention (the solution), Trade-off Analysis (time/risk/confidence/cost impacts), Outcome (results achieved), and Counterfactual (what would have happened without the intervention). It demonstrates systems thinking under uncertainty.";
    }
    
    // Default response
    return "I can help you explore Aniket's portfolio, navigate sections, explain planning methodologies, or answer questions about his experience. Try asking about: his background, the QSRA tool, delay analysis methods, specific projects, or say 'show me [section]' to navigate directly.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    const response = generateResponse(userMessage);
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Who is Aniket?", action: "Tell me about Aniket's background" },
    { label: "Show Analytics", action: "Navigate to analytics" },
    { label: "QSRA Explained", action: "What is QSRA?" },
    { label: "Contact Info", action: "How can I contact Aniket?" },
  ];

  if (!aiOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setAiOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: '50%', background: `linear-gradient(135deg, ${c.accent.primary}, ${c.accent.bright})`,
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 20px ${c.accent.glow}`, zIndex: 1000
        }}
      >
        <Bot size={24} color={c.bg.primary} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 24, right: 24, width: 380, height: 520,
        background: c.bg.secondary, border: `1px solid ${c.border.default}`,
        display: 'flex', flexDirection: 'column', zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${c.accent.primary}, ${c.accent.bright})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color={c.bg.primary} />
          </div>
          <div>
            <span style={{ fontSize: 11, color: c.text.primary, display: 'block' }}>Planning AI Assistant</span>
            <span style={{ fontSize: 9, color: c.status.active }}>● Online</span>
          </div>
        </div>
        <button onClick={() => setAiOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={18} color={c.text.muted} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 28, height: 28, flexShrink: 0, background: msg.role === 'user' ? c.status.info : c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {msg.role === 'user' ? <User size={14} color="white" /> : <Bot size={14} color={c.bg.primary} />}
            </div>
            <div style={{ maxWidth: '80%', padding: '10px 12px', background: msg.role === 'user' ? 'rgba(59,130,246,0.2)' : c.bg.card, border: `1px solid ${msg.role === 'user' ? 'rgba(59,130,246,0.3)' : c.border.default}` }}>
              <p style={{ fontSize: 11, color: c.text.primary, margin: 0, lineHeight: 1.5 }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: c.accent.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={14} color={c.bg.primary} />
            </div>
            <div style={{ padding: '10px 12px', background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent.primary }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {quickActions.map((qa, i) => (
            <button key={i} onClick={() => { setInput(qa.action); }} style={{ padding: '6px 10px', background: c.bg.card, border: `1px solid ${c.border.default}`, cursor: 'pointer', fontSize: 9, color: c.text.secondary }}>
              {qa.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: 12, borderTop: `1px solid ${c.border.default}`, display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: '10px 12px', background: c.bg.card, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }}
        />
        <button onClick={handleSend} disabled={!input.trim()} style={{ padding: '10px 14px', background: input.trim() ? c.accent.primary : c.bg.card, border: 'none', cursor: input.trim() ? 'pointer' : 'default' }}>
          <Send size={14} color={input.trim() ? c.bg.primary : c.text.muted} />
        </button>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: c.bg.elevated, border: `1px solid ${c.border.default}`, padding: 12, fontFamily: 'monospace' }}>
      <p style={{ fontSize: 10, color: c.text.muted, marginBottom: 6 }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ fontSize: 11, color: e.color, margin: '2px 0' }}>{e.name}: {e.value}</p>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

function Boot({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [200, 500, 800, 1100, 1400, 1700, 2000, 2300].map((d, i) => 
      setTimeout(() => setPhase(i + 1), d)
    );
    const complete = setTimeout(onComplete, 2800);
    return () => { timers.forEach(clearTimeout); clearTimeout(complete); };
  }, [onComplete]);

  const steps = [
    { p: 1, icon: Activity, text: 'INITIALISING PLANNING INTELLIGENCE' },
    { p: 2, icon: Layers, text: 'LOADING PROGRAMME DATA' },
    { p: 3, icon: GitBranch, text: 'MAPPING DECISION NETWORKS' },
    { p: 4, icon: AlertTriangle, text: 'CALIBRATING RISK MODELS' },
    { p: 5, icon: Settings, text: 'LOADING ANALYSIS TOOLS' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ width: '100%', maxWidth: 500, padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = phase > s.p;
            const active = phase === s.p;
            return phase >= s.p ? (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, border: `1px solid ${done ? c.status.active : c.accent.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {done ? <CheckCircle size={12} color={c.status.active} /> : <Icon size={12} color={c.accent.primary} style={active ? { animation: 'pulse 1s infinite' } : {}} />}
                </div>
                <span style={{ fontSize: 10, letterSpacing: '0.08em', color: done ? c.status.active : c.accent.primary }}>{s.text}</span>
              </motion.div>
            ) : null;
          })}
        </div>

        {phase >= 6 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 20, border: `1px solid ${c.border.default}`, background: c.bg.secondary }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Shield size={20} color={c.accent.primary} />
              <div>
                <h1 style={{ fontSize: 16, color: c.text.primary, margin: 0 }}>{systemData.operator.name}</h1>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>{systemData.operator.role}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 18, color: c.accent.primary }}>€2.5B+</span>
              <span style={{ fontSize: 18, color: c.status.active }}>847</span>
              <span style={{ fontSize: 18, color: c.chart.design }}>12</span>
            </div>
          </motion.div>
        )}

        {phase >= 7 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 16 }}>
            <div style={{ height: 2, background: c.border.default }}>
              <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.5 }} style={{ height: '100%', background: c.accent.primary }} />
            </div>
          </motion.div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS BAR
// ═══════════════════════════════════════════════════════════════════════════════

function StatusBar() {
  const { section, mode, programme } = useCtx();
  const labels = { system: 'SYSTEM', analytics: 'ANALYTICS', programmes: 'PROGRAMMES', decisions: 'DECISIONS', risk: 'RISK', map: 'MAP', capabilities: 'CAPABILITIES', tools: 'ANALYSIS TOOLS' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 32, background: c.bg.primary, borderBottom: `1px solid ${c.border.default}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: 'monospace', zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, background: c.status.active }} />
          <span style={{ fontSize: 9, color: c.status.active }}>ONLINE</span>
        </div>
        <span style={{ color: c.border.hover }}>│</span>
        <span style={{ fontSize: 10, color: c.text.primary }}>{labels[section] || 'SYSTEM'}</span>
        {programme && (
          <>
            <span style={{ color: c.border.hover }}>│</span>
            <span style={{ fontSize: 9, color: c.accent.primary }}>{programme.shortName}</span>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 9, color: c.text.muted, padding: '2px 8px', border: `1px solid ${c.border.default}` }}>{mode.toUpperCase()}</span>
        <span style={{ fontSize: 9, color: c.text.secondary }}>{systemData.operator.name}</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

const sections = [
  { id: 'system', label: 'SYSTEM', icon: Activity },
  { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
  { id: 'programmes', label: 'PROGRAMMES', icon: Layers },
  { id: 'decisions', label: 'DECISIONS', icon: GitBranch },
  { id: 'risk', label: 'RISK', icon: AlertTriangle },
  { id: 'map', label: 'MAP', icon: Globe },
  { id: 'capabilities', label: 'CAPABILITIES', icon: Target },
  { id: 'tools', label: 'TOOLS', icon: Settings },
];

function Nav() {
  const { section, setSection, mode, setMode, stress, setStress } = useCtx();

  return (
    <nav style={{ width: 180, minHeight: '100vh', paddingTop: 32, background: c.bg.secondary, borderRight: `1px solid ${c.border.default}`, fontFamily: 'monospace', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 12, borderBottom: `1px solid ${c.border.default}` }}>
        <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>MODE</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {['executive', 'planner'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: 6, border: `1px solid ${mode === m ? c.accent.dim : c.border.default}`, background: mode === m ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 8, color: mode === m ? c.accent.primary : c.text.muted }}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, paddingTop: 4 }}>
        {sections.map(s => {
          const Icon = s.icon;
          const active = section === s.id;
          const isTools = s.id === 'tools';
          return (
            <button key={s.id} onClick={() => setSection(s.id)} style={{ width: '100%', padding: '10px 12px', textAlign: 'left', background: active ? 'linear-gradient(90deg, rgba(160,128,64,0.1), transparent)' : 'transparent', borderLeft: `2px solid ${active ? c.accent.dim : 'transparent'}`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={12} color={active ? c.accent.primary : isTools ? c.status.info : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{s.label}</span>
              {isTools && <span style={{ fontSize: 7, color: c.status.info, marginLeft: 'auto' }}>NEW</span>}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${c.border.default}` }}>
        <button onClick={() => setStress(stress ? null : 'vendor')} style={{ width: '100%', padding: 10, background: stress ? 'rgba(234,179,8,0.1)' : 'transparent', border: `1px solid ${stress ? c.status.warning : c.border.default}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Zap size={10} color={stress ? c.status.warning : c.text.muted} />
          <span style={{ fontSize: 8, color: stress ? c.status.warning : c.text.muted }}>STRESS TEST</span>
        </button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function SystemSection() {
  const { setSection, setProgramme } = useCtx();
  const metrics = [
    { label: 'PORTFOLIO VALUE', value: '€2.5B+', color: c.accent.primary },
    { label: 'CAPACITY', value: '80MW', color: c.chart.design },
    { label: 'ON-TIME', value: '94%', color: c.status.active },
    { label: 'DECISIONS', value: '847', color: c.chart.procurement },
  ];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE</span>
        <h1 style={{ fontSize: 22, color: c.text.primary, margin: '6px 0 2px' }}>{systemData.operator.name}</h1>
        <p style={{ fontSize: 11, color: c.text.secondary }}>{systemData.operator.role} • {systemData.operator.region}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {metrics.map(m => (
          <div key={m.label} style={{ padding: 16, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 8 }}>{m.label}</span>
            <span style={{ fontSize: 24, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}`, marginBottom: 24 }}>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>CAREER PROGRESSION</span>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={systemData.careerTimeline}>
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
              <span style={{ fontSize: 20, color: c.accent.primary }}>€{p.value}M</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOLS SECTION - PLANNING INTELLIGENCE MODULES
// ═══════════════════════════════════════════════════════════════════════════════

function ToolsSection() {
  const { toolsTab, setToolsTab, mode } = useCtx();
  const [qsraResults, setQsraResults] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [projectInfo, setProjectInfo] = useState({ name: '', dataDate: '', activities: '' });
  const [availableDocs, setAvailableDocs] = useState({
    baseline: true, updates: true, asBuilt: false, dailyReports: true, delayNotices: true, changeOrders: true
  });

  const runQSRA = () => {
    // Simulated QSRA analysis results
    const results = qsraChecks.map(check => {
      const rand = Math.random();
      let value, status;
      if (check.target === 0) {
        value = rand > 0.7 ? Math.round(rand * 5) : 0;
        status = value === 0 ? 'PASS' : value <= (check.amber || 2) ? 'AMBER' : 'FAIL';
      } else if (check.target === null) {
        value = 5 + Math.round(rand * 15);
        status = (value >= 5 && value <= 15) ? 'PASS' : 'AMBER';
      } else {
        value = Math.round(rand * check.target * 1.5);
        status = value <= check.target ? 'PASS' : value <= (check.amber || check.target * 1.5) ? 'AMBER' : 'FAIL';
      }
      return { ...check, value, status };
    });
    setQsraResults(results);
  };

  const getHealthScore = () => {
    if (!qsraResults) return 0;
    const passed = qsraResults.filter(r => r.status === 'PASS').length;
    const amber = qsraResults.filter(r => r.status === 'AMBER').length;
    return Math.round(((passed * 1 + amber * 0.5) / qsraResults.length) * 100);
  };

  const getMethodRecommendation = () => {
    const score = Object.values(availableDocs).filter(Boolean).length;
    if (score >= 5) return { method: 'windows', confidence: 92 };
    if (score >= 4) return { method: 'tia', confidence: 78 };
    if (score >= 3) return { method: 'collapsed', confidence: 65 };
    return { method: 'asplanned', confidence: 45 };
  };

  const tabs = [
    { id: 'qsra', label: 'QSRA HEALTH CHECK', icon: CheckSquare },
    { id: 'delay', label: 'DELAY ANALYSIS', icon: Clock },
    { id: 'claim', label: 'CLAIM READINESS', icon: Scale },
    { id: 'stress', label: 'EXPERT STRESS TEST', icon: AlertCircle },
  ];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE</span>
        <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>Analysis Tools</h2>
        <p style={{ fontSize: 10, color: c.text.secondary }}>QSRA Schedule Health Check • SCL-aligned Delay Analysis • Forensic Planning</p>
      </div>

      {/* Tool Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = toolsTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setToolsTab(tab.id)} style={{ padding: '10px 16px', background: active ? 'rgba(160,128,64,0.15)' : c.bg.card, border: `1px solid ${active ? c.accent.dim : c.border.default}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* QSRA HEALTH CHECK TAB */}
      {toolsTab === 'qsra' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Upload size={16} color={c.accent.primary} />
                <span style={{ fontSize: 11, color: c.text.primary }}>Schedule Analysis</span>
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>PROJECT NAME</label>
                <input type="text" value={projectInfo.name} onChange={(e) => setProjectInfo({...projectInfo, name: e.target.value})} placeholder="e.g., UPS Energization & Reconnection" style={{ width: '100%', padding: 8, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              </div>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>DATA DATE</label>
                <input type="date" value={projectInfo.dataDate} onChange={(e) => setProjectInfo({...projectInfo, dataDate: e.target.value})} style={{ width: '100%', padding: 8, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              </div>

              <div style={{ padding: 20, border: `2px dashed ${c.border.default}`, textAlign: 'center', marginBottom: 16 }}>
                <FileText size={28} color={c.text.muted} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 10, color: c.text.muted, margin: 0 }}>Drop P6 XER file or click to upload</p>
                <p style={{ fontSize: 8, color: c.text.dim, margin: '4px 0 0' }}>Supports .xer, .xml, .xlsx formats</p>
              </div>
              
              <button onClick={runQSRA} style={{ width: '100%', padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
                <span style={{ fontSize: 10, color: c.bg.primary, fontWeight: 500 }}>RUN QSRA ANALYSIS</span>
              </button>
              
              <p style={{ fontSize: 8, color: c.text.dim, margin: '12px 0 0', textAlign: 'center' }}>
                Methodology: Laminar Projects Schedule Health Check
              </p>
            </div>

            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>SCHEDULE HEALTH SCORE</span>
              {qsraResults ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 56, color: getHealthScore() >= 80 ? c.status.active : getHealthScore() >= 60 ? c.status.warning : c.status.critical }}>
                      {getHealthScore()}
                    </span>
                    <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(34,197,94,0.2)', color: c.status.active }}>
                      {qsraResults.filter(r => r.status === 'PASS').length} PASS
                    </span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(234,179,8,0.2)', color: c.status.warning }}>
                      {qsraResults.filter(r => r.status === 'AMBER').length} AMBER
                    </span>
                    <span style={{ fontSize: 9, padding: '4px 10px', background: 'rgba(239,68,68,0.2)', color: c.status.critical }}>
                      {qsraResults.filter(r => r.status === 'FAIL').length} FAIL
                    </span>
                  </div>
                  
                  <div style={{ padding: 12, background: c.bg.secondary, border: `1px solid ${c.border.default}` }}>
                    <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 8 }}>SCHEDULE FITNESS</span>
                    <span style={{ fontSize: 11, color: getHealthScore() >= 70 ? c.status.active : c.status.warning }}>
                      {getHealthScore() >= 80 ? '✓ Fit for prospective analysis' : 
                       getHealthScore() >= 60 ? '⚠ Fit for retrospective analysis only' : 
                       '✗ At risk of expert rejection'}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <HelpCircle size={32} color={c.text.muted} style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 11, color: c.text.muted, margin: 0 }}>Upload schedule to analyze</p>
                  <p style={{ fontSize: 9, color: c.text.dim, margin: '8px 0 0' }}>17-point health check based on industry standards</p>
                </div>
              )}
            </div>
          </div>

          {qsraResults && (
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>QSRA 17-POINT ASSESSMENT</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {qsraResults.map(check => {
                  const statusColor = check.status === 'PASS' ? c.status.active : check.status === 'AMBER' ? c.status.warning : c.status.critical;
                  const StatusIcon = check.status === 'PASS' ? CheckSquare : check.status === 'AMBER' ? AlertTriangle : XSquare;
                  return (
                    <div key={check.id} style={{ padding: 12, background: c.bg.secondary, border: `1px solid ${c.border.default}`, borderLeft: `3px solid ${statusColor}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <StatusIcon size={12} color={statusColor} />
                          <span style={{ fontSize: 10, color: c.text.primary }}>{check.id}. {check.name}</span>
                        </div>
                        <span style={{ fontSize: 8, padding: '2px 6px', background: `${statusColor}20`, color: statusColor }}>{check.status}</span>
                      </div>
                      <p style={{ fontSize: 9, color: c.text.muted, margin: '0 0 6px' }}>{check.desc}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 8, color: c.text.dim }}>Target: {check.threshold}</span>
                        <span style={{ fontSize: 8, color: c.text.secondary }}>Actual: {check.value}{check.threshold.includes('%') ? '%' : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {mode === 'planner' && (
                <div style={{ marginTop: 16, padding: 16, background: c.bg.secondary, border: `1px solid ${c.status.warning}` }}>
                  <span style={{ fontSize: 9, color: c.status.warning, display: 'block', marginBottom: 8 }}>PLANNER BEHAVIOUR INSIGHT</span>
                  <p style={{ fontSize: 10, color: c.text.secondary, margin: 0, lineHeight: 1.5 }}>
                    Schedule exhibits characteristics of <strong style={{ color: c.text.primary }}>
                    {getHealthScore() >= 80 ? 'delivery-focused planning' : getHealthScore() >= 60 ? 'reporting-driven planning' : 'claim-defensive planning'}
                    </strong>. {getHealthScore() < 70 && 'High constraint usage and limited logic density suggest focus on milestone dates rather than work sequence. Recommend logic review before delay analysis.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* DELAY ANALYSIS TAB */}
      {toolsTab === 'delay' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>AVAILABLE RECORDS</span>
              {Object.entries(availableDocs).map(([key, value]) => (
                <div key={key} onClick={() => setAvailableDocs({...availableDocs, [key]: !value})} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${c.border.default}`, cursor: 'pointer' }}>
                  <div style={{ width: 16, height: 16, border: `1px solid ${value ? c.status.active : c.border.default}`, background: value ? c.status.active : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {value && <CheckCircle size={10} color={c.bg.primary} />}
                  </div>
                  <span style={{ fontSize: 10, color: value ? c.text.primary : c.text.muted, textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: 12, background: c.bg.secondary, border: `1px solid ${c.accent.dim}` }}>
                <span style={{ fontSize: 9, color: c.accent.primary, display: 'block', marginBottom: 8 }}>RECOMMENDED METHOD</span>
                <span style={{ fontSize: 14, color: c.text.primary }}>{delayMethods.find(m => m.id === getMethodRecommendation().method)?.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 9, color: c.text.muted }}>Confidence:</span>
                  <span style={{ fontSize: 11, color: getMethodRecommendation().confidence > 70 ? c.status.active : c.status.warning }}>
                    {getMethodRecommendation().confidence}%
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>SCL DELAY ANALYSIS METHODS</span>
              {delayMethods.map(method => {
                const isRec = method.id === getMethodRecommendation().method;
                return (
                  <motion.div key={method.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => setSelectedMethod(method)} style={{ padding: 14, marginBottom: 8, background: isRec ? 'rgba(160,128,64,0.1)' : c.bg.secondary, border: `1px solid ${isRec ? c.accent.dim : c.border.default}`, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, color: c.text.primary }}>{method.name}</span>
                          {isRec && <span style={{ fontSize: 7, padding: '2px 6px', background: c.accent.primary, color: c.bg.primary }}>RECOMMENDED</span>}
                        </div>
                        <span style={{ fontSize: 9, color: c.text.muted }}>{method.type}</span>
                      </div>
                      <span style={{ fontSize: 9, padding: '2px 8px', background: method.defensibility === 'Very High' ? 'rgba(34,197,94,0.2)' : method.defensibility === 'High' ? 'rgba(59,130,246,0.2)' : 'rgba(136,136,136,0.2)', color: method.defensibility === 'Very High' ? c.status.active : method.defensibility === 'High' ? c.status.info : c.text.muted }}>
                        {method.defensibility}
                      </span>
                    </div>
                    <p style={{ fontSize: 9, color: c.text.secondary, margin: 0 }}>{method.desc}</p>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                      <span style={{ fontSize: 8, color: c.text.dim }}>Complexity: {method.complexity}</span>
                      <span style={{ fontSize: 8, color: c.text.dim }}>Data Req: {method.dataReq}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CLAIM READINESS TAB */}
      {toolsTab === 'claim' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>CLAIM READINESS SCORE</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 56, color: c.status.warning }}>67</span>
              <span style={{ fontSize: 14, color: c.text.muted }}>/100</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ fontSize: 9, padding: '4px 12px', background: 'rgba(234,179,8,0.2)', color: c.status.warning }}>MODERATE RISK</span>
            </div>
            <div style={{ height: 8, background: c.border.default, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: '67%', height: '100%', background: `linear-gradient(90deg, ${c.status.active}, ${c.status.warning})` }} />
            </div>
          </div>

          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>TOP VULNERABILITIES</span>
            {[
              { issue: 'Incomplete as-built records', impact: 'HIGH', desc: 'Gaps in progress tracking Q2-Q3 2024' },
              { issue: 'Logic modifications post-delay', impact: 'MEDIUM', desc: 'Critical path changed after event notice' },
              { issue: 'Concurrent delay exposure', impact: 'HIGH', desc: 'Overlapping employer/contractor delays identified' },
            ].map((v, i) => (
              <div key={i} style={{ padding: 12, marginBottom: 8, background: c.bg.secondary, borderLeft: `3px solid ${v.impact === 'HIGH' ? c.status.critical : c.status.warning}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: c.text.primary }}>{v.issue}</span>
                  <span style={{ fontSize: 8, color: v.impact === 'HIGH' ? c.status.critical : c.status.warning }}>{v.impact}</span>
                </div>
                <p style={{ fontSize: 9, color: c.text.muted, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ gridColumn: '1 / -1', padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>DISPUTE RISK SIMULATION</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { stage: 'Negotiation', risk: 35, color: c.status.active },
                { stage: 'Adjudication', risk: 55, color: c.status.warning },
                { stage: 'Arbitration', risk: 68, color: c.status.warning },
                { stage: 'Litigation', risk: 78, color: c.status.critical },
              ].map(s => (
                <div key={s.stage} style={{ padding: 16, background: c.bg.secondary, border: `1px solid ${c.border.default}`, textAlign: 'center' }}>
                  <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 8 }}>{s.stage.toUpperCase()}</span>
                  <span style={{ fontSize: 24, color: s.color }}>{s.risk}%</span>
                  <span style={{ fontSize: 8, color: c.text.dim, display: 'block', marginTop: 4 }}>Rejection Risk</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EXPERT STRESS TEST TAB */}
      {toolsTab === 'stress' && (
        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <AlertCircle size={20} color={c.status.warning} />
            <div>
              <span style={{ fontSize: 11, color: c.text.primary }}>Expert Witness Simulation</span>
              <p style={{ fontSize: 9, color: c.text.muted, margin: 0 }}>Opposing expert challenges to your analysis</p>
            </div>
          </div>

          {[
            { q: 'How do you justify the selection of Windows Analysis when contemporaneous updates show significant gaps in Q3 2023?', severity: 'critical' },
            { q: 'Your critical path determination appears to have changed post-event. Can you demonstrate this reflects actual site conditions?', severity: 'high' },
            { q: 'The contractor-caused delays appear to overlap with the employer events. How have you apportioned concurrent delay?', severity: 'critical' },
            { q: 'Your baseline programme contains 23% missing logic. How can this support a prospective analysis?', severity: 'high' },
            { q: 'Progress records from the daily reports contradict the updated programme. Which record is correct?', severity: 'medium' },
          ].map((challenge, i) => (
            <div key={i} style={{ padding: 16, marginBottom: 12, background: c.bg.secondary, border: `1px solid ${challenge.severity === 'critical' ? c.status.critical : challenge.severity === 'high' ? c.status.warning : c.border.default}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 24, height: 24, background: challenge.severity === 'critical' ? 'rgba(239,68,68,0.2)' : challenge.severity === 'high' ? 'rgba(234,179,8,0.2)' : 'rgba(136,136,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: challenge.severity === 'critical' ? c.status.critical : challenge.severity === 'high' ? c.status.warning : c.text.muted }}>Q{i + 1}</span>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: c.text.primary, margin: '0 0 8px', lineHeight: 1.5 }}>{challenge.q}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontSize: 8, padding: '2px 8px', background: 'rgba(59,130,246,0.2)', color: c.status.info, cursor: 'pointer' }}>PREPARE RESPONSE</span>
                    <span style={{ fontSize: 8, padding: '2px 8px', background: 'rgba(136,136,136,0.2)', color: c.text.muted, cursor: 'pointer' }}>FLAG FOR REVIEW</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, padding: 16, background: 'rgba(160,128,64,0.1)', border: `1px solid ${c.accent.dim}` }}>
            <span style={{ fontSize: 9, color: c.accent.primary, display: 'block', marginBottom: 8 }}>SYSTEM RECOMMENDATION</span>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: 0, lineHeight: 1.5 }}>
              Based on the identified vulnerabilities, recommend strengthening as-built record compilation and conducting logic audit before proceeding to formal claim submission. Consider hybrid methodology combining impacted as-planned with as-built verification for improved defensibility.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYTICS SECTION
// ═══════════════════════════════════════════════════════════════════════════════

function AnalyticsSection() {
  const { programme } = useCtx();
  const p = programme || systemData.programmes[0];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 9, color: c.text.muted }}>ANALYTICS</span>
        <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0' }}>{p.name}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        {p.workstreamTimeline && (
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
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

        <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>CURRENT STATUS</span>
          {p.workstreams.map((w, i) => (
            <div key={w.id} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: c.text.primary }}>{w.name}</span>
                <span style={{ fontSize: 9, color: c.accent.primary }}>{w.progress}%</span>
              </div>
              <div style={{ height: 5, background: c.border.default, borderRadius: 2 }}>
                <div style={{ width: `${w.progress}%`, height: '100%', background: [c.chart.design, c.chart.procurement, c.chart.construction, c.chart.commissioning][i], borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {p.monteCarlo && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// SIMPLE SECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function ProgrammesSection() {
  const { programme, setProgramme, setSection } = useCtx();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PROGRAMMES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Select Programme</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {systemData.programmes.map(p => (
          <motion.div key={p.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => { setProgramme(p); setSection('analytics'); }} style={{ padding: 16, background: programme?.id === p.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: `1px solid ${programme?.id === p.id ? c.accent.dim : c.border.default}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, background: p.status === 'ACTIVE' ? c.status.active : c.text.muted }} />
              <span style={{ fontSize: 8, color: p.status === 'ACTIVE' ? c.status.active : c.text.muted }}>{p.status}</span>
            </div>
            <h3 style={{ fontSize: 12, color: c.text.primary, margin: 0 }}>{p.name}</h3>
            <p style={{ fontSize: 9, color: c.text.secondary, margin: '2px 0 10px' }}>{p.role}</p>
            <span style={{ fontSize: 18, color: c.accent.primary }}>€{p.value}M</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DecisionsSection() {
  const { programme, decision, setDecision, mode } = useCtx();
  const [phase, setPhase] = useState(0);
  const p = programme || systemData.programmes[0];

  useEffect(() => {
    if (decision) {
      setPhase(0);
      [300, 800, 1300, 1800, 2300].forEach((d, i) => setTimeout(() => setPhase(i + 1), d));
    }
  }, [decision]);

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
          <button key={s} onClick={() => setScenario(s)} style={{ padding: '8px 12px', border: `1px solid ${scenario === s ? c.accent.dim : c.border.default}`, background: scenario === s ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 9, color: scenario === s ? c.accent.primary : c.text.muted }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      {p.risks && (
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
      )}
    </div>
  );
}

function MapSection() {
  const [hover, setHover] = useState(null);
  const statusColors = { active: c.status.active, completed: c.accent.primary, planning: c.status.info };
  const toXY = (lat, lng) => ({ x: ((lng + 10) / 90) * 600 + 100, y: ((60 - lat) / 50) * 350 + 75 });

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>MAP</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Project Locations</h2>
      <div style={{ padding: 20, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
        <svg width="100%" height="400" viewBox="0 0 800 500" style={{ background: c.bg.secondary }}>
          {systemData.locations.map(loc => {
            const pos = toXY(loc.lat, loc.lng);
            return (
              <g key={loc.id} onMouseEnter={() => setHover(loc.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
                {loc.status === 'active' && <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={statusColors[loc.status]} strokeWidth="1" opacity="0.4"><animate attributeName="r" from="10" to="22" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" /></circle>}
                <rect x={pos.x - 6} y={pos.y - 6} width={12} height={12} fill={statusColors[loc.status]} transform={`rotate(45 ${pos.x} ${pos.y})`} />
                {hover === loc.id && <><rect x={pos.x + 12} y={pos.y - 20} width={100} height={36} fill={c.bg.elevated} stroke={c.border.default} /><text x={pos.x + 18} y={pos.y - 4} fill={c.text.primary} fontSize="9">{loc.name}</text><text x={pos.x + 18} y={pos.y + 8} fill={c.accent.primary} fontSize="8">€{loc.value}M</text></>}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function CapabilitiesSection() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [formStatus, setFormStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      // Using Formspree - replace with your form ID after signing up at formspree.io
      const response = await fetch('https://formspree.io/f/xpwzgkvq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          _subject: `Portfolio Contact: ${formData.name} from ${formData.company || 'N/A'}`,
        }),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
        setTimeout(() => setFormStatus(null), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
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
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>FOUNDATION</span>
        {systemData.education.map((e, i) => (
          <div key={i} style={{ padding: 12, marginBottom: 8, background: c.bg.card, border: `1px solid ${c.border.default}`, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 11, color: c.text.primary }}>{e.degree}</span>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block' }}>{e.institution}</span>
            </div>
            <span style={{ fontSize: 10, color: c.accent.primary }}>{e.year}</span>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>CONNECT</span>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* LinkedIn & Contact Info */}
          <div style={{ padding: 24, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: 'rgba(160,128,64,0.1)', border: `1px solid ${c.accent.dim}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} color={c.accent.primary} />
              </div>
              <div>
                <h3 style={{ fontSize: 14, color: c.text.primary, margin: 0 }}>{systemData.operator.name}</h3>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>{systemData.operator.role}</p>
              </div>
            </div>

            {/* LinkedIn Button */}
            <a 
              href="https://www.linkedin.com/in/aniket-latpate/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#0a66c2', border: 'none', textDecoration: 'none', marginBottom: 12, cursor: 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span style={{ fontSize: 11, color: 'white', fontWeight: 500 }}>Connect on LinkedIn</span>
            </a>

            {/* Contact Details */}
            <div style={{ padding: 14, background: c.bg.secondary, border: `1px solid ${c.border.default}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, background: c.accent.primary }} />
                <span style={{ fontSize: 10, color: c.text.secondary }}>{systemData.contact.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, background: c.accent.primary }} />
                <span style={{ fontSize: 10, color: c.text.secondary }}>{systemData.contact.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, background: c.accent.primary }} />
                <span style={{ fontSize: 10, color: c.text.secondary }}>Dublin, Ireland</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={{ padding: 24, background: c.bg.card, border: `1px solid ${c.border.default}` }}>
            <span style={{ fontSize: 11, color: c.text.primary, display: 'block', marginBottom: 16 }}>Send a Message</span>
            
            {formStatus === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                style={{ padding: 32, textAlign: 'center' }}
              >
                <div style={{ width: 48, height: 48, background: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle size={24} color={c.status.active} />
                </div>
                <h4 style={{ fontSize: 14, color: c.status.active, margin: '0 0 8px' }}>Message Sent</h4>
                <p style={{ fontSize: 10, color: c.text.muted, margin: 0 }}>I'll get back to you shortly.</p>
              </motion.div>
            ) : (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>NAME *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    style={{ width: '100%', padding: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }}
                    placeholder="Your name"
                  />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>EMAIL *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{ width: '100%', padding: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }}
                    placeholder="your@email.com"
                  />
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>COMPANY</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    style={{ width: '100%', padding: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none' }}
                    placeholder="Your company (optional)"
                  />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 6 }}>MESSAGE *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    style={{ width: '100%', padding: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', outline: 'none', resize: 'vertical' }}
                    placeholder="Your message..."
                  />
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={formStatus === 'sending' || !formData.name || !formData.email || !formData.message}
                  style={{ 
                    width: '100%', 
                    padding: 14, 
                    background: formStatus === 'sending' ? c.bg.secondary : c.accent.primary, 
                    border: 'none', 
                    cursor: formStatus === 'sending' ? 'wait' : 'pointer',
                    opacity: (!formData.name || !formData.email || !formData.message) ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: 10, color: formStatus === 'sending' ? c.text.muted : c.bg.primary, fontWeight: 500, letterSpacing: '0.05em' }}>
                    {formStatus === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                  </span>
                </button>
                
                {formStatus === 'error' && (
                  <p style={{ fontSize: 9, color: c.status.critical, margin: '12px 0 0', textAlign: 'center' }}>
                    Failed to send. Please try again or email directly.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* System Stable Footer */}
      <div style={{ padding: 32, background: c.bg.card, border: `1px solid ${c.border.default}`, textAlign: 'center' }}>
        <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, background: c.accent.primary, margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: 16, color: c.text.primary, margin: '0 0 6px' }}>SYSTEM STABLE.</h3>
        <p style={{ fontSize: 11, color: c.text.secondary, margin: '0 0 20px' }}>NO ACTION REQUIRED.</p>
        <p style={{ fontSize: 10, color: c.text.muted, margin: 0 }}>
          If access is required, you already know how to reach me.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

function Main() {
  const { section } = useCtx();
  const render = () => {
    switch (section) {
      case 'system': return <SystemSection />;
      case 'analytics': return <AnalyticsSection />;
      case 'programmes': return <ProgrammesSection />;
      case 'decisions': return <DecisionsSection />;
      case 'risk': return <RiskSection />;
      case 'map': return <MapSection />;
      case 'capabilities': return <CapabilitiesSection />;
      case 'tools': return <ToolsSection />;
      default: return <SystemSection />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(160,128,64,0.02) 0%, transparent 50%)' }}>
      <StatusBar />
      <div style={{ paddingTop: 32, display: 'flex' }}>
        <Nav />
        <main style={{ flex: 1, minHeight: 'calc(100vh - 32px)', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {render()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP
// ═══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <Provider>
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div key="boot" exit={{ opacity: 0 }}>
            <Boot onComplete={() => setBooted(true)} />
          </motion.div>
        ) : (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Main />
            <AIAssistant />
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #030303; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </Provider>
  );
}
