import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip,
  Area, Line, AreaChart, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  ChevronRight, ExternalLink, Download, MapPin, Calendar, CheckCircle,
  HelpCircle, Upload, CheckSquare, Shield, FileText, Sparkles
} from 'lucide-react';
import { c } from '../lib/theme';
import { useApp } from '../app/context';
import { demoSystemData, qsraChecks, dcmaChecks } from '../data/demo';

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: c.bg.elevated, border: '1px solid ' + c.border.default, padding: 12 }}>
      <p style={{ fontSize: 10, color: c.text.muted, marginBottom: 6 }}>{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ fontSize: 11, color: e.color, margin: '2px 0' }}>
          {e.name}: {e.value}
        </p>
      ))}
    </div>
  );
};

function Redacted({ privacyMode, children, fallback = '—' }) {
  return <>{privacyMode ? fallback : children}</>;
}

export function SystemSection() {
  const { setSection, setProgramme, privacyMode } = useApp();
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
        <h1 style={{ fontSize: 22, color: c.text.primary, margin: '6px 0 2px' }}>
          <Redacted privacyMode={privacyMode} fallback="PLANNING INTELLIGENCE OS">{demoSystemData.operator.name}</Redacted>
        </h1>
        <p style={{ fontSize: 11, color: c.text.secondary }}>
          <Redacted privacyMode={privacyMode} fallback="Regional Planning Lead • Data Center Delivery">
            Regional Planning Lead • {demoSystemData.operator.company} • EMEA
          </Redacted>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {metrics.map((m) => (
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
            <span style={{ fontSize: 8, color: c.text.muted }}>VIEW</span>
            <ChevronRight size={10} color={c.text.muted} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={demoSystemData.careerProgression}>
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
        {demoSystemData.programmes.map((p) => (
          <motion.div
            key={p.id}
            whileHover={{ borderColor: c.accent.dim }}
            onClick={() => { setProgramme(p); setSection('programmes'); }}
            style={{ padding: 16, marginBottom: 10, background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer' }}
          >
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

export function CareerSection() {
  const { privacyMode } = useApp();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>CAREER</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>
        <Redacted privacyMode={privacyMode} fallback="Planning Professional">{demoSystemData.operator.name}</Redacted>
      </h2>
      <p style={{ fontSize: 11, color: c.text.secondary }}>
        <Redacted privacyMode={privacyMode} fallback="Data Center Planning • EMEA">{demoSystemData.operator.role} • {demoSystemData.operator.company}</Redacted>
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <a href="https://www.linkedin.com/in/aniket-latpate/" target="_blank" rel="noopener noreferrer"
           style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#0a66c2', textDecoration: 'none' }}>
          <ExternalLink size={12} color="white" />
          <span style={{ fontSize: 10, color: 'white' }}>LinkedIn</span>
        </a>
        <a href="/Aniket_Latpate_CV.pdf" download style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: c.accent.primary, textDecoration: 'none' }}>
          <Download size={12} color={c.bg.primary} />
          <span style={{ fontSize: 10, color: c.bg.primary }}>Download CV</span>
        </a>
      </div>

      <div style={{ marginTop: 20, padding: 18, background: c.bg.card, border: '1px solid ' + c.border.default }}>
        <p style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.6, margin: 0 }}>
          Use the new <span style={{ color: c.accent.primary }}>TIMELINE</span> tab for a LinkedIn-style experience view (companies, projects, capacities).
          This page stays “client-safe” (no confidential programme details).
        </p>
      </div>
    </div>
  );
}

export function TimelineSection() {
  const { privacyMode } = useApp();
  const items = demoSystemData.careerTimeline || [];

  const [activeId, setActiveId] = useState(items[0]?.id ?? null);
  const active = useMemo(() => items.find((i) => i.id === activeId) || items[0], [activeId, items]);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>TIMELINE</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>
        <Redacted privacyMode={privacyMode} fallback="Career Timeline">{demoSystemData.operator.name}</Redacted>
      </h2>
      <p style={{ fontSize: 11, color: c.text.secondary, marginBottom: 18 }}>
        LinkedIn-style experience timeline • sectors, locations, capacities
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 14 }}>
        {/* Left rail */}
        <div style={{ padding: 14, background: c.bg.card, border: '1px solid ' + c.border.default, height: 'fit-content' }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>EXPERIENCE</span>
          <div style={{ display: 'grid', gap: 8 }}>
            {items.map((it) => {
              const selected = it.id === activeId;
              return (
                <motion.button
                  key={it.id}
                  whileHover={{ x: 2 }}
                  onClick={() => setActiveId(it.id)}
                  style={{
                    textAlign: 'left',
                    padding: 12,
                    background: selected ? 'rgba(160,128,64,0.12)' : c.bg.secondary,
                    border: '1px solid ' + (selected ? c.accent.dim : c.border.default),
                    cursor: 'pointer',
                    display: 'grid',
                    gridTemplateColumns: '28px 1fr',
                    gap: 10,
                    alignItems: 'start'
                  }}
                >
                  <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid ' + (selected ? c.accent.dim : c.border.default), background: c.bg.card }}>
                    <span style={{ fontSize: 16 }}>{it.logo}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ fontSize: 10, color: selected ? c.accent.primary : c.text.primary }}>{it.company}</span>
                      {it.type === 'current' && <span style={{ fontSize: 8, color: c.status.active }}>ACTIVE</span>}
                    </div>
                    <span style={{ fontSize: 9, color: c.text.secondary, display: 'block', marginTop: 2 }}>{it.role}</span>
                    <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginTop: 6 }}>
                      <Calendar size={10} style={{ verticalAlign: 'middle', marginRight: 6 }} />{it.period}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ padding: 18, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          {active ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, color: c.text.primary }}>
                    {active.role}
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: c.accent.primary }}>{active.company}</p>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10 }}>
                    <span style={{ fontSize: 9, color: c.text.muted }}>
                      <Calendar size={10} style={{ verticalAlign: 'middle', marginRight: 6 }} />{active.period}
                    </span>
                    <span style={{ fontSize: 9, color: c.text.muted }}>
                      <MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 6 }} />{active.location}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '6px 10px', border: '1px solid ' + c.border.default, background: c.bg.secondary }}>
                  <span style={{ fontSize: 8, color: c.text.muted }}>VIEW</span>
                  <div style={{ fontSize: 10, color: active.type === 'current' ? c.status.active : c.text.secondary }}>
                    {active.type === 'current' ? 'Current Role' : 'Past Role'}
                  </div>
                </div>
              </div>

              {active.headline && (
                <div style={{ marginTop: 16, padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <span style={{ fontSize: 9, color: c.text.muted }}>SUMMARY</span>
                  <p style={{ margin: '6px 0 0', fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>{active.headline}</p>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 10 }}>HIGHLIGHTS</span>
                <div style={{ display: 'grid', gap: 8 }}>
                  {(active.bullets || []).map((b, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                      <CheckCircle size={14} color={c.status.active} style={{ marginTop: 1 }} />
                      <span style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, padding: 12, background: 'rgba(160,128,64,0.08)', border: '1px solid ' + c.accent.dim }}>
                <span style={{ fontSize: 9, color: c.accent.primary }}>TIP</span>
                <p style={{ margin: '6px 0 0', fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>
                  Want this to match LinkedIn even closer? Next upgrade: add “skills per role”, “key projects per role”,
                  and attach work samples (IMS extracts, dashboards, trackers) behind a password.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <HelpCircle size={32} color={c.text.muted} />
              <p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>No timeline items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProgrammesSection() {
  const { programme, setProgramme, setSection } = useApp();
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PROGRAMMES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Select Programme</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
        {demoSystemData.programmes.map((p) => (
          <motion.div key={p.id} whileHover={{ borderColor: c.accent.dim }} onClick={() => setProgramme(p)}
            style={{ padding: 16, background: programme && programme.id === p.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: '1px solid ' + (programme && programme.id === p.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
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
              <p style={{ fontSize: 10, color: c.text.muted, margin: '4px 0 0' }}>
                <MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                {programme.location.area ? programme.location.area + ', ' : ''}{programme.location.city}, {programme.location.country}
              </p>
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
            {['analytics', 'decisions', 'risk', 'tools', 'casefiles'].map((s) => (
              <button key={s} onClick={() => setSection(s)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', fontSize: 9, color: c.text.muted, textTransform: 'uppercase' }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AnalyticsSection() {
  const { programme } = useApp();
  const p = programme || demoSystemData.programmes[0];
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>ANALYTICS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>SCHEDULE PROBABILITY (DEMO)</span>
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
            <BarChart data={(p.decisions || []).map((d) => ({ name: d.title.split(' ')[0], cost: (d.metrics?.costAvoided ?? 0) / 1_000_000 }))}>
              <XAxis dataKey="name" tick={{ fontSize: 8, fill: c.text.muted }} />
              <YAxis tick={{ fontSize: 8, fill: c.text.muted }} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="cost" fill={c.accent.primary} name="€M Saved" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function DecisionsSection() {
  const { programme, decision, setDecision, mode } = useApp();
  const [phase, setPhase] = useState(0);
  const p = programme || demoSystemData.programmes[0];

  React.useEffect(() => {
    if (!decision) return;
    setPhase(0);
    const timers = [
      setTimeout(() => setPhase(1), 250),
      setTimeout(() => setPhase(2), 550),
      setTimeout(() => setPhase(3), 850),
      setTimeout(() => setPhase(4), 1150)
    ];
    return () => timers.forEach(clearTimeout);
  }, [decision]);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>DECISIONS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div>
          {(p.decisions || []).map((d, i) => (
            <div key={d.id} onClick={() => setDecision(d)}
              style={{ padding: 12, marginBottom: 8, background: decision && decision.id === d.id ? 'rgba(160,128,64,0.1)' : c.bg.card, border: '1px solid ' + (decision && decision.id === d.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: decision && decision.id === d.id ? c.accent.primary : c.border.default, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: decision && decision.id === d.id ? c.bg.primary : c.text.muted }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 10, color: c.text.primary }}>{d.title}</span>
              </div>
              <span style={{ fontSize: 8, color: c.text.muted }}>{d.date}</span>
            </div>
          ))}
        </div>

        {decision ? (
          <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <h3 style={{ fontSize: 14, color: c.text.primary, margin: '0 0 16px' }}>{decision.title}</h3>
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, marginBottom: 10 }}>
                  <span style={{ fontSize: 8, color: c.text.muted }}>CONTEXT</span>
                  <p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.context}</p>
                </motion.div>
              )}
              {phase >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.accent.dim, marginBottom: 10 }}>
                  <span style={{ fontSize: 8, color: c.accent.primary }}>INTERVENTION</span>
                  <p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.intervention}</p>
                </motion.div>
              )}
              {phase >= 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid ' + c.status.active, marginBottom: 10 }}>
                  <span style={{ fontSize: 8, color: c.status.active }}>OUTCOME</span>
                  <p style={{ fontSize: 10, color: c.text.primary, margin: '4px 0 0' }}>{decision.impact}</p>
                </motion.div>
              )}
              {phase >= 4 && mode === 'planner' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid ' + c.status.critical }}>
                  <span style={{ fontSize: 8, color: c.status.critical }}>COUNTERFACTUAL</span>
                  <p style={{ fontSize: 10, color: c.text.secondary, margin: '4px 0 0' }}>{decision.counterfactual}</p>
                </motion.div>
              )}
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

export function RiskSection() {
  const { programme, scenario, setScenario } = useApp();
  const p = programme || demoSystemData.programmes[0];
  const mult = { p20: 0.7, p50: 1, p80: 1.4 };
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>RISK</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>{p.name}</h2>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {['p20', 'p50', 'p80'].map((s) => (
          <button key={s} onClick={() => setScenario(s)}
            style={{ padding: '8px 12px', border: '1px solid ' + (scenario === s ? c.accent.dim : c.border.default), background: scenario === s ? 'rgba(160,128,64,0.1)' : 'transparent', cursor: 'pointer', fontSize: 9, color: scenario === s ? c.accent.primary : c.text.muted }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {p.risks?.length ? (
        <div style={{ display: 'grid', gap: 10 }}>
          {p.risks.map((r) => {
            const adj = Math.min(100, Math.round(r.probability * mult[scenario]));
            const col = r.impact > 80 ? c.status.critical : r.impact > 60 ? c.status.warning : c.status.info;
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
      ) : (
        <p style={{ color: c.text.muted, fontSize: 10 }}>No active risks</p>
      )}
    </div>
  );
}

export function CapabilitiesSection() {
  const { privacyMode } = useApp();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  function handleSend() {
    setStatus('sending');
    fetch('https://formspree.io/f/xpwzgkvq', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      .then((res) => { if (res.ok) { setStatus('success'); setFormData({ name: '', email: '', message: '' }); } else { setStatus('error'); } })
      .catch(() => setStatus('error'));
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>CAPABILITIES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Technical Matrix</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={demoSystemData.capabilityRadar}>
              <PolarGrid stroke={c.border.default} />
              <PolarAngleAxis dataKey="capability" tick={{ fontSize: 9, fill: c.text.secondary }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 7, fill: c.text.muted }} />
              <Radar dataKey="value" stroke={c.accent.primary} fill={c.accent.glow} fillOpacity={0.6} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>CONNECT</span>
          <a href="https://www.linkedin.com/in/aniket-latpate/" target="_blank" rel="noopener noreferrer"
             style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: '#0a66c2', textDecoration: 'none', marginBottom: 12 }}>
            <ExternalLink size={16} color="white" /><span style={{ fontSize: 11, color: 'white' }}>Connect on LinkedIn</span>
          </a>
          <div style={{ padding: 12, background: c.bg.secondary }}>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📧 <Redacted privacyMode={privacyMode} fallback="hidden">{demoSystemData.operator.email}</Redacted></p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: '0 0 8px' }}>📱 <Redacted privacyMode={privacyMode} fallback="hidden">{demoSystemData.operator.phone}</Redacted></p>
            <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>📍 {demoSystemData.operator.location}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
        <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 16 }}>SEND MESSAGE</span>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <CheckCircle size={32} color={c.status.active} />
            <p style={{ fontSize: 12, color: c.status.active, marginTop: 12 }}>Message Sent!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name" style={{ width: '100%', padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email" style={{ width: '100%', padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Message" rows={4} style={{ gridColumn: '1 / span 2', width: '100%', padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace', resize: 'none' }} />
            <button onClick={handleSend} disabled={!formData.name || !formData.email || !formData.message}
              style={{ gridColumn: '1 / span 2', width: '100%', padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: (!formData.name || !formData.email || !formData.message) ? 0.5 : 1 }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WizardCard({ title, children }) {
  return (
    <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>{title}</span>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function buildHtmlReport({ title, summaryLines, rows }) {
  const esc = (s) => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const summary = summaryLines.map((l) => `<li>${esc(l)}</li>`).join('');
  const tableRows = rows.map((r) => `<tr><td>${esc(r.k)}</td><td>${esc(r.v)}</td></tr>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>body{font-family:ui-sans-serif,system-ui; padding:24px}h1{margin:0 0 12px}ul{margin:0 0 18px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;font-size:13px}th{background:#f6f6f6;text-align:left}</style>
</head><body><h1>${esc(title)}</h1><ul>${summary}</ul><table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>${tableRows}</tbody></table><p style="margin-top:16px;font-size:12px;color:#666">Generated by Planning Intelligence OS (demo build)</p></body></html>`;
}

export function ToolsSection() {
  const { toolsTab, setToolsTab, demoMode, uploadedFile, setUploadedFile, dataDate, setDataDate } = useApp();
  const [qsraResults, setQsraResults] = useState(null);
  const [dcmaResults, setDcmaResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wizard, setWizard] = useState({ baseline: false, updates: false, asBuilt: false, notices: false, diaries: false, qra: false });
  const fileRef = useRef(null);

  const tabs = [
    { id: 'hub', label: 'HUB', icon: Sparkles },
    { id: 'qsra', label: 'QSRA', icon: CheckSquare },
    { id: 'dcma', label: 'DCMA 14-PT', icon: Shield },
    { id: 'wizard', label: 'METHOD WIZARD', icon: HelpCircle },
    { id: 'evidence', label: 'EVIDENCE LOCKER', icon: FileText },
    { id: 'report', label: 'EXPORT REPORT', icon: Download }
  ];

  function runQSRA() {
    setAnalyzing(true); setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const results = qsraChecks.map((ck) => {
            const rand = Math.random();
            const val = Math.round(rand * 15);
            const st = rand > 0.6 ? 'PASS' : rand > 0.3 ? 'AMBER' : 'FAIL';
            return { id: ck.id, name: ck.name, threshold: ck.threshold, value: val, status: st };
          });
          const passed = results.filter((r) => r.status === 'PASS').length;
          const amber = results.filter((r) => r.status === 'AMBER').length;
          const score = Math.round(((passed + amber * 0.5) / results.length) * 100);
          setQsraResults({ healthScore: score, checks: results, fitness: score >= 80 ? 'Fit for prospective' : score >= 60 ? 'Fit for retrospective' : 'At risk' });
          setAnalyzing(false);
          return 100;
        }
        return p + 12.5;
      });
    }, 220);
  }

  function runDCMA() {
    setAnalyzing(true); setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const results = dcmaChecks.map((ck) => {
            const rand = Math.random();
            const val = Math.round(rand * 10);
            const st = rand > 0.5 ? 'PASS' : 'WARNING';
            return { id: ck.id, name: ck.name, threshold: ck.threshold, value: val, status: st };
          });
          const passed = results.filter((r) => r.status === 'PASS').length;
          const score = Math.round((passed / 14) * 100);
          setDcmaResults({ score, checks: results, compliance: passed >= 12 ? 'COMPLIANT' : passed >= 10 ? 'MARGINAL' : 'NON-COMPLIANT' });
          setAnalyzing(false);
          return 100;
        }
        return p + 7.14;
      });
    }, 120);
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedFile(f);
  }

  const methodRec = useMemo(() => {
    const { baseline, updates, asBuilt, notices, diaries, qra } = wizard;
    if (baseline && updates && asBuilt) return { method: 'Time Impact Analysis (TIA) / Windows (Impacted As-Planned)', why: 'You have baseline, updates, and as-built evidence.' };
    if (baseline && updates && !asBuilt) return { method: 'Windows / Time Impact Analysis (TIA)', why: 'You can measure impacts between update windows.' };
    if (baseline && asBuilt && !updates) return { method: 'As-Planned vs As-Built (with caution)', why: 'No periodic updates, but you can triangulate with as-built.' };
    if (!baseline && asBuilt && diaries) return { method: 'As-Built Critical Path (ABCP)', why: 'Reconstruct critical path from as-built + site records.' };
    if (notices && diaries && !baseline) return { method: 'Narrative + Cause-Effect / Collapsed As-Built (risk)', why: 'Focus on contemporaneous records; schedule method will be weaker without baseline.' };
    if (qra) return { method: 'QSRA / Probabilistic range', why: 'Use for risk-informed forecasting rather than entitlement.' };
    return { method: 'Hybrid approach', why: 'Select the documents you have to get a tailored recommendation.' };
  }, [wizard]);

  const hubCards = [
    { title: 'Run QSRA', desc: 'Schedule health checks. Demo version uses simulated results.' },
    { title: 'Run DCMA', desc: '14-point schedule quality assessment. Demo version uses simulated results.' },
    { title: 'Delay Method Wizard', desc: 'Choose the best delay analysis method based on the evidence you have.' },
    { title: 'Evidence Locker', desc: 'Organise claim documents into a defensible structure.' },
    { title: 'Export Report', desc: 'Generate a simple, shareable HTML report (client-safe).' }
  ];

  function exportReport() {
    const title = 'Planning Intelligence Report';
    const summary = [
      demoMode ? 'Mode: DEMO (safe to share publicly)' : 'Mode: UPLOAD (your private file attached locally)',
      uploadedFile ? `Schedule file: ${uploadedFile.name}` : 'Schedule file: none',
      dataDate ? `Data date: ${dataDate}` : 'Data date: not set'
    ];
    const rows = [
      { k: 'QSRA Health Score', v: qsraResults ? qsraResults.healthScore + '/100' : 'Not run' },
      { k: 'QSRA Fitness', v: qsraResults ? qsraResults.fitness : '—' },
      { k: 'DCMA Score', v: dcmaResults ? dcmaResults.score + '/100' : 'Not run' },
      { k: 'DCMA Compliance', v: dcmaResults ? dcmaResults.compliance : '—' },
      { k: 'Recommended Method', v: methodRec.method },
      { k: 'Why', v: methodRec.why }
    ];
    const html = buildHtmlReport({ title, summaryLines: summary, rows });
    downloadTextFile('Planning_Intelligence_Report.html', html);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>TOOLS</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>Planning Toolkit</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 20 }}>
        QSRA • DCMA • Delay Method Wizard • Evidence Locker • Report Export
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = toolsTab === t.id;
          return (
            <button key={t.id} onClick={() => setToolsTab(t.id)}
              style={{ padding: '10px 14px', background: active ? 'rgba(160,128,64,0.15)' : c.bg.card, border: '1px solid ' + (active ? c.accent.dim : c.border.default), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 16 }}>
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Upload size={16} color={c.accent.primary} />
            <span style={{ fontSize: 11, color: c.text.primary }}>Schedule Input</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              type="date"
              value={dataDate}
              onChange={(e) => setDataDate(e.target.value)}
              style={{ width: '100%', padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 10, fontFamily: 'monospace' }}
            >
              {uploadedFile ? uploadedFile.name : 'Upload XER / XML / XLSX'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".xer,.xml,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />

          <div style={{ marginTop: 10, fontSize: 9, color: c.text.muted, lineHeight: 1.5 }}>
            In this version, uploads are stored only in your browser session (no backend).
          </div>
        </div>

        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>QUICK ACTIONS</span>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <button onClick={runQSRA} disabled={analyzing}
              style={{ padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: analyzing ? 0.7 : 1 }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN QSRA (DEMO)'}</span>
            </button>
            <button onClick={runDCMA} disabled={analyzing}
              style={{ padding: 12, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN DCMA (DEMO)'}</span>
            </button>
            <button onClick={exportReport} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>EXPORT HTML REPORT</span>
            </button>
          </div>
          {analyzing && (
            <div style={{ marginTop: 10, height: 4, background: c.border.default }}>
              <motion.div animate={{ width: progress + '%' }} style={{ height: '100%', background: c.accent.primary }} />
            </div>
          )}
        </div>
      </div>

      {toolsTab === 'hub' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {hubCards.map((card) => (
            <div key={card.title} style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 11, color: c.text.primary }}>{card.title}</span>
              <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.5 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      )}

      {toolsTab === 'qsra' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>QSRA RESULTS</span>
          {!qsraResults ? (
            <div style={{ padding: 28, textAlign: 'center' }}>
              <HelpCircle size={32} color={c.text.muted} />
              <p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Run QSRA to see results</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0 12px' }}>
                <span style={{ fontSize: 56, color: qsraResults.healthScore >= 80 ? c.status.active : qsraResults.healthScore >= 60 ? c.status.warning : c.status.critical }}>{qsraResults.healthScore}</span>
                <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                <span style={{ marginLeft: 10, fontSize: 10, color: c.text.secondary }}>Fitness: {qsraResults.fitness}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {qsraResults.checks.map((ck) => {
                  const col = ck.status === 'PASS' ? c.status.active : ck.status === 'AMBER' ? c.status.warning : c.status.critical;
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
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>DCMA 14-POINT RESULTS</span>
          {!dcmaResults ? (
            <div style={{ padding: 28, textAlign: 'center' }}>
              <Shield size={32} color={c.text.muted} />
              <p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Run DCMA to see results</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '14px 0 12px' }}>
                <span style={{ fontSize: 56, color: dcmaResults.score >= 85 ? c.status.active : dcmaResults.score >= 70 ? c.status.warning : c.status.critical }}>{dcmaResults.score}</span>
                <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
                <span style={{ marginLeft: 10, fontSize: 10, color: c.text.secondary }}>Compliance: {dcmaResults.compliance}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {dcmaResults.checks.map((ck) => {
                  const col = ck.status === 'PASS' ? c.status.active : c.status.warning;
                  return (
                    <div key={ck.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: '3px solid ' + col }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: c.text.primary }}>{ck.id}. {ck.name}</span>
                        <span style={{ fontSize: 8, color: col }}>{ck.status}</span>
                      </div>
                      <span style={{ fontSize: 8, color: c.text.muted }}>Target: {ck.threshold}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'wizard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <WizardCard title="What documents do you have?">
            {[
              ['baseline', 'Approved Baseline programme'],
              ['updates', 'Periodic updates (weekly / monthly)'],
              ['asBuilt', 'As-built programme / progress record'],
              ['notices', 'Notices / EWs / correspondence linking cause-effect'],
              ['diaries', 'Site diaries, logs, photos'],
              ['qra', 'Risk register / QSRA inputs']
            ].map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={wizard[k]} onChange={() => setWizard({ ...wizard, [k]: !wizard[k] })} />
                <span style={{ fontSize: 10, color: c.text.secondary }}>{label}</span>
              </label>
            ))}
          </WizardCard>

          <WizardCard title="Recommended approach">
            <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <div style={{ fontSize: 11, color: c.text.primary, marginBottom: 8 }}>{methodRec.method}</div>
              <div style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.5 }}>{methodRec.why}</div>
            </div>
            <button
              onClick={() => downloadTextFile('Delay_Analysis_Recommendation.txt', `Recommended Method: ${methodRec.method}\nWhy: ${methodRec.why}`)}
              style={{ marginTop: 10, padding: 10, width: '100%', background: c.accent.primary, border: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 10, color: c.bg.primary }}>DOWNLOAD RECOMMENDATION</span>
            </button>
          </WizardCard>
        </div>
      )}

      {toolsTab === 'evidence' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { t: 'Contract & Amendments', items: ['Contract', 'Scope', 'Change orders'] },
            { t: 'Programmes', items: ['Baseline', 'Updates', 'Recovery plans'] },
            { t: 'Records', items: ['Daily reports', 'Site diaries', 'Photos'] },
            { t: 'Correspondence', items: ['Early warnings', 'RFIs', 'Minutes'] },
            { t: 'Commercial', items: ['Valuations', 'Payment certs', 'EOT submissions'] },
            { t: 'Outputs', items: ['Narrative', 'Impact table', 'Appendices'] }
          ].map((b) => (
            <div key={b.t} style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 11, color: c.text.primary }}>{b.t}</span>
              <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                {b.items.map((it) => (
                  <div key={it} style={{ padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                    <span style={{ fontSize: 10, color: c.text.secondary }}>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {toolsTab === 'report' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 11, color: c.text.primary }}>Export a client-safe report</span>
          <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.5 }}>
            Exports an HTML file you can send as evidence of your tooling. This avoids bundling any sensitive project data (use Privacy + Demo toggles).
          </p>
          <button onClick={exportReport} style={{ marginTop: 10, padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 10, color: c.bg.primary }}>DOWNLOAD HTML REPORT</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function CaseFilesSection() {
  const templates = [
    {
      name: 'EOT Claim Pack',
      why: 'Standard structure that recruiters recognise (SCL/Delay Protocol-aligned logic).',
      bullets: ['Executive summary', 'Cause-effect narrative', 'Windows analysis inputs', 'Appendices index']
    },
    {
      name: 'Programme Health Pack',
      why: 'Demonstrates planning governance and schedule controls (DCMA/QSRA).',
      bullets: ['14-point results', 'Key logic fixes', 'Float paths', 'Action tracker']
    },
    {
      name: 'Commissioning Readiness Pack',
      why: 'Shows commissioning strategy and readiness gating.',
      bullets: ['Systems matrix', 'I&C gates', 'Test packs', 'RFS readiness dashboard']
    }
  ];

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>CASE FILES</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>Recruiter-ready artefacts</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {templates.map((t) => (
          <div key={t.name} style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 11, color: c.text.primary }}>{t.name}</span>
            <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.5 }}>{t.why}</p>
            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
              {t.bullets.map((b) => (
                <div key={b} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <CheckCircle size={12} color={c.status.active} style={{ marginTop: 2 }} />
                  <span style={{ fontSize: 10, color: c.text.secondary }}>{b}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => downloadTextFile(`${t.name.replaceAll(' ','_')}.txt`, `${t.name}\n\n${t.bullets.map((x)=>'- '+x).join('\n')}`)}
              style={{ marginTop: 12, padding: 10, width: '100%', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer' }}
            >
              <span style={{ fontSize: 10, color: c.text.primary }}>DOWNLOAD TEMPLATE</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
