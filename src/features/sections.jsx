import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip,
  Area, Line, AreaChart, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  ChevronRight, ExternalLink, Download, MapPin, Calendar, CheckCircle,
  HelpCircle, Upload, CheckSquare, Shield, FileText, Sparkles, TrendingUp
} from 'lucide-react';
import { c } from '../lib/theme';
import { useApp } from '../app/context';
import { demoSystemData, qsraChecks, dcmaChecks } from '../data/demo';
import { generateAnalytics, generateRiskRegister, generateComparison, generateActionPlan, generateExecutiveReport, generatePlaybook } from '../lib/analysis';

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

          {programme.work && programme.work.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>WHAT I DO ON THIS PROGRAMME</span>
              <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                {programme.work.map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <CheckCircle size={12} color={c.status.active} style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: c.text.secondary }}>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {['analytics', 'decisions', 'tools'].map((s) => (
              <button key={s} onClick={() => setSection(s)} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', fontSize: 9, color: c.text.muted, textTransform: 'uppercase' }}>{s}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AnalyticsSection() {
  const { analysis, uploadedFile, dataDate, setSection, setToolsTab } = useApp();

  const a = analysis;
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>ANALYTICS</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 20px' }}>
        {a ? a.projectName : 'Upload-driven Analytics'}
      </h2>

      {!a ? (
        <div style={{ padding: 24, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <p style={{ fontSize: 11, color: c.text.secondary, margin: 0, lineHeight: 1.6 }}>
            Analytics are generated from uploaded schedules.
          </p>
          <p style={{ fontSize: 10, color: c.text.muted, margin: '10px 0 0' }}>
            Current: {uploadedFile ? uploadedFile.name : 'No file uploaded'} {dataDate ? `• Data date: ${dataDate}` : ''}
          </p>
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setSection('tools'); setToolsTab('analytics'); }}
              style={{ padding: '10px 12px', background: c.accent.primary, border: 'none', cursor: 'pointer' }}
            >
              <span style={{ fontSize: 10, color: c.bg.primary }}>GO TO TOOLS → UPLOAD</span>
            </button>
            <span style={{ fontSize: 9, color: c.text.muted, alignSelf: 'center' }}>
              (Once you run analysis, this tab auto-populates KPIs + charts)
            </span>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { k: 'PLANNED %', v: `${a.kpis.plannedPct}%`, col: c.chart.design },
              { k: 'EARNED %', v: `${a.kpis.earnedPct}%`, col: c.status.active },
              { k: 'VARIANCE %', v: `${a.kpis.variancePct}%`, col: a.kpis.variancePct >= 0 ? c.status.active : c.status.warning },
              { k: 'START', v: a.kpis.start, col: c.text.primary },
              { k: 'FINISH', v: a.kpis.finish, col: c.text.primary },
              { k: 'FORECAST', v: a.kpis.forecastFinish, col: c.accent.primary }
            ].map((m) => (
              <div key={m.k} style={{ padding: 14, background: c.bg.card, border: '1px solid ' + c.border.default }}>
                <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 6 }}>{m.k}</span>
                <span style={{ fontSize: 14, color: m.col }}>{m.v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>S‑CURVE (PLANNED vs EARNED)</span>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={a.charts.sCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
                  <XAxis dataKey="date" tick={{ fontSize: 8, fill: c.text.muted }} minTickGap={18} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: c.text.muted }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="planned" fill={c.accent.glow} stroke={c.accent.primary} strokeWidth={2} name="Planned %" />
                  <Line type="monotone" dataKey="earned" stroke={c.status.active} strokeWidth={2} dot={false} name="Earned %" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>SCHEDULE INDEX</span>
              <div style={{ display: 'grid', gap: 10 }}>
                {[{ k: 'CPLI', v: a.kpis.cpli }, { k: 'BEI', v: a.kpis.bei }, { k: 'SLIP (DAYS)', v: a.kpis.varianceDays }].map((m) => (
                  <div key={m.k} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                    <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 4 }}>{m.k}</span>
                    <span style={{ fontSize: 18, color: c.accent.primary }}>{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>LABOUR HISTOGRAM (DEMO)</span>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={a.charts.histogram}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
                  <XAxis dataKey="week" tick={{ fontSize: 8, fill: c.text.muted }} />
                  <YAxis tick={{ fontSize: 8, fill: c.text.muted }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="hours" fill={c.accent.primary} name="Hours" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ padding: 20, background: c.bg.card, border: '1px solid ' + c.border.default }}>
              <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 12 }}>PROGRESS BY DISCIPLINE</span>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={a.charts.disciplineProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: c.text.muted }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: c.text.muted }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="planned" fill={c.chart.design} name="Planned" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="earned" fill={c.status.active} name="Earned" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function DecisionsSection() {
  const { programme, privacyMode } = useApp();

  const p = programme || demoSystemData.programmes[0];
  const projects = (p?.projects || []).map((x) => x.name);

  const all = (p?.decisions || []).map((d) => ({
    ...d,
    project: d.project || projects[0] || p?.shortName || 'Programme'
  }));

  const [selectedProject, setSelectedProject] = useState(projects[0] || (p?.shortName || 'Programme'));

  const filtered = all.filter((d) => (d.project || '').toLowerCase() === (selectedProject || '').toLowerCase());

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 10, color: c.text.muted }}>DECISIONS</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '8px 0 18px' }}>{p?.name || 'Programme'}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        <div style={{ padding: 14, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 10 }}>PROJECTS</div>
          {(projects.length ? projects : [p?.shortName || 'Programme']).map((name) => {
            const active = name === selectedProject;
            return (
              <button
                key={name}
                onClick={() => setSelectedProject(name)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  marginBottom: 8,
                  background: active ? 'rgba(160,128,64,0.15)' : c.bg.secondary,
                  border: '1px solid ' + (active ? c.accent.dim : c.border.default),
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: 11, color: active ? c.accent.primary : c.text.primary }}>{name}</div>
                <div style={{ fontSize: 9, color: c.text.muted, marginTop: 4 }}>
                  {all.filter((d) => (d.project || '').toLowerCase() === name.toLowerCase()).length} decisions
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ padding: 18, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'baseline' }}>
            <div>
              <div style={{ fontSize: 10, color: c.text.muted }}>SELECTED</div>
              <div style={{ fontSize: 14, color: c.text.primary, marginTop: 6 }}>{selectedProject}</div>
            </div>
            <div style={{ fontSize: 10, color: c.text.muted }}>{filtered.length} items</div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: c.text.muted, fontSize: 11 }}>
              No decisions recorded for this project yet.
            </div>
          ) : (
            <div style={{ marginTop: 14, display: 'grid', gap: 10 }}>
              {filtered.map((d) => (
                <div key={d.id} style={{ padding: 14, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ fontSize: 12, color: c.text.primary }}>{d.title}</div>
                    <div style={{ fontSize: 10, color: c.accent.primary }}>{d.date}</div>
                  </div>

                  <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                    <div style={{ padding: 10, border: '1px solid ' + c.border.default, background: c.bg.card }}>
                      <div style={{ fontSize: 9, color: c.text.muted }}>CONTEXT</div>
                      <div style={{ fontSize: 10, color: c.text.secondary, marginTop: 4 }}>{d.context}</div>
                    </div>

                    <div style={{ padding: 10, border: '1px solid ' + c.accent.dim, background: 'rgba(160,128,64,0.08)' }}>
                      <div style={{ fontSize: 9, color: c.accent.primary }}>ACTION</div>
                      <div style={{ fontSize: 10, color: c.text.primary, marginTop: 4 }}>{d.intervention}</div>
                    </div>

                    <div style={{ padding: 10, border: '1px solid ' + c.status.active, background: 'rgba(34,197,94,0.08)' }}>
                      <div style={{ fontSize: 9, color: c.status.active }}>IMPACT</div>
                      <div style={{ fontSize: 10, color: c.text.primary, marginTop: 4 }}>{d.impact}</div>
                    </div>

                    {d.metrics?.costAvoided ? (
                      <div style={{ fontSize: 10, color: c.text.muted }}>
                        Estimated value protected:{' '}
                        <Redacted privacyMode={privacyMode}>
                          <span style={{ color: c.accent.primary }}>€{Math.round(d.metrics.costAvoided / 1000000)}M</span>
                        </Redacted>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RiskSection
() {
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

function buildExecReportHtml(rep) {
  const esc = (s) => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  const bullets = (arr) => (arr || []).map((l) => `<li>${esc(l)}</li>`).join('');
  const risks = (rep?.appendix?.risks || []).map((r) => `<tr><td>${esc(r.id)}</td><td>${esc(r.title)}</td><td>${esc(r.rag)}</td><td>${esc(r.due)}</td><td>${esc(r.owner)}</td></tr>`).join('');
  const actions = (rep?.appendix?.actions || []).map((a) => `<tr><td>${esc(a.id)}</td><td>${esc(a.title)}</td><td>${esc(a.owner)}</td><td>${esc(a.impact)}</td><td>${esc(a.confidence)}</td></tr>`).join('');
  const assumptionList = bullets(rep?.assumptions || []);
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(rep?.meta?.title || 'Exec Report')}</title>
<style>
body{font-family:ui-sans-serif,system-ui;padding:24px;line-height:1.4}
h1{margin:0 0 6px}
.meta{color:#666;font-size:12px;margin-bottom:14px}
.box{border:1px solid #ddd;border-radius:12px;padding:14px;margin:12px 0}
table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f6f6f6;text-align:left}
</style></head><body>
<h1>${esc(rep?.meta?.title)}</h1>
<div class="meta">Generated: ${esc(rep?.meta?.generatedAt)} • Confidence: ${esc(rep?.meta?.confidence)} • RAG: ${esc(rep?.meta?.rag)}</div>
<div class="box"><strong>Executive Summary</strong><ul>${bullets(rep?.exec?.summary || [])}</ul></div>
<div class="box"><strong>Top Issues</strong><ul>${bullets(rep?.exec?.topIssues || [])}</ul></div>
<div class="box"><strong>Recommendation</strong><div>${esc(rep?.exec?.recommendation)}</div></div>
<div class="box"><strong>Top Risks</strong><table><thead><tr><th>ID</th><th>Risk</th><th>RAG</th><th>Due</th><th>Owner</th></tr></thead><tbody>${risks || '<tr><td colspan="5">—</td></tr>'}</tbody></table></div>
<div class="box"><strong>Next Best Actions</strong><table><thead><tr><th>ID</th><th>Action</th><th>Owner</th><th>Impact</th><th>Confidence</th></tr></thead><tbody>${actions || '<tr><td colspan="5">—</td></tr>'}</tbody></table></div>
<div class="box"><strong>Assumptions</strong><ul>${assumptionList}</ul></div>
<div class="meta">Generated by Planning Intelligence OS (client-safe demo build)</div>
</body></html>`;
}


function EvidenceLockerPanel() {
  const key = 'pi_evidence_v1';
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]') || []; } catch { return []; }
  });
  const [meta, setMeta] = useState({ ref: '', type: 'RFI', notes: '' });
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);

  const persist = (next) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const readFileAsDataUrl = (f) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = reject;
    r.readAsDataURL(f);
  });

  const add = async () => {
    if (!meta.ref.trim()) return alert('Enter a reference (e.g., RFI-012)');
    let attachment = null;
    if (file) {
      if (file.size > 6 * 1024 * 1024) return alert('File too large (max 6MB)');
      const dataUrl = await readFileAsDataUrl(file);
      attachment = { name: file.name, type: file.type, size: file.size, dataUrl };
    }
    const it = { id: String(Date.now()), ref: meta.ref.trim(), type: meta.type, notes: meta.notes.trim(), at: new Date().toISOString(), attachment };
    persist([it, ...items]);
    setMeta({ ref: '', type: meta.type, notes: '' });
    setFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = (id) => persist(items.filter((x) => x.id !== id));

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div style={{ padding: 14, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
        <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 10 }}>EVIDENCE INTAKE (LOCAL STORAGE)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8 }}>
          <input value={meta.ref} onChange={(e) => setMeta({ ...meta, ref: e.target.value })} placeholder="Reference (RFI-012 / NCR-04 / EW-08)" style={{ padding: 10, background: c.bg.card, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace' }} />
          <select value={meta.type} onChange={(e) => setMeta({ ...meta, type: e.target.value })} style={{ padding: 10, background: c.bg.card, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace' }}>
            <option>RFI</option>
            <option>Submittal</option>
            <option>NCR</option>
            <option>Early Warning</option>
            <option>Instruction</option>
            <option>Minutes</option>
            <option>Other</option>
          </select>
        </div>

        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 220px', gap: 8 }}>
          <textarea value={meta.notes} onChange={(e) => setMeta({ ...meta, notes: e.target.value })} placeholder="Notes / why it matters (causation, entitlement, mitigation, etc.)" rows={2} style={{ padding: 10, background: c.bg.card, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', resize: 'none' }} />
          <div>
            <input ref={fileRef} type="file" accept="application/pdf,image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 11 }}>
              {file ? `Selected: ${file.name}` : 'Attach file (optional)'}
            </button>
            <button onClick={add} style={{ marginTop: 8, width: '100%', padding: 10, background: c.accent.primary, border: 'none', cursor: 'pointer', color: c.bg.primary, fontSize: 11 }}>
              Add to Evidence Locker
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {items.length === 0 ? (
          <div style={{ padding: 18, textAlign: 'center', color: c.text.muted, fontSize: 11, border: '1px solid ' + c.border.default, background: c.bg.secondary }}>
            No evidence saved yet.
          </div>
        ) : items.map((it) => (
          <div key={it.id} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: c.text.primary }}>{it.ref} <span style={{ fontSize: 10, color: c.text.muted }}>({it.type})</span></div>
                <div style={{ fontSize: 10, color: c.text.muted, marginTop: 4 }}>{new Date(it.at).toLocaleString()}</div>
              </div>
              <button onClick={() => remove(it.id)} style={{ padding: '6px 10px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 10 }}>Remove</button>
            </div>
            {it.notes ? <div style={{ marginTop: 8, fontSize: 11, color: c.text.secondary, whiteSpace: 'pre-wrap' }}>{it.notes}</div> : null}
            {it.attachment ? (
              <div style={{ marginTop: 10, border: '1px solid ' + c.border.default, background: c.bg.card, padding: 10 }}>
                <div style={{ fontSize: 10, color: c.text.muted }}>ATTACHMENT</div>
                <div style={{ marginTop: 6, fontSize: 11, color: c.text.primary }}>{it.attachment.name}</div>
                <a download={it.attachment.name} href={it.attachment.dataUrl} style={{ marginTop: 6, display: 'inline-block', fontSize: 11, color: c.accent.primary }}>Download</a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ToolsSection() {
  const {
    toolsTab, setToolsTab,
    demoMode,
    uploadedFile, setUploadedFile,
    dataDate, setDataDate,
    analysis, setAnalysis,
    comparison, setComparison,
    riskRegister, setRiskRegister,
    playbook, setPlaybook,
    actionPlan, setActionPlan,
    setSection
  } = useApp();
  const [qsraResults, setQsraResults] = useState(null);
  const [dcmaResults, setDcmaResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wizard, setWizard] = useState({ baseline: false, updates: false, asBuilt: false, notices: false, diaries: false, qra: false });
  const fileRef = useRef(null);
  const fileARef = useRef(null);
  const fileBRef = useRef(null);
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [report, setReport] = useState(null);

  const tabs = [
    { id: 'hub', label: 'HUB', icon: Sparkles },
    { id: 'analytics', label: 'UPLOAD + KPIs', icon: TrendingUp },
    { id: 'compare', label: 'XER ↔ XER', icon: TrendingUp },
    { id: 'qsra', label: 'QSRA', icon: CheckSquare },
    { id: 'dcma', label: 'DCMA 14-PT', icon: Shield },
    { id: 'risk', label: 'RISK REGISTER', icon: Shield },
    { id: 'wizard', label: 'METHOD WIZARD', icon: HelpCircle },
    { id: 'evidence', label: 'EVIDENCE LOCKER', icon: FileText },
    { id: 'report', label: 'EXEC REPORT', icon: Download }
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

  function runFullAnalytics() {
    if (!uploadedFile && !demoMode) {
      alert('Please upload a schedule first (XER / XML / XLSX).');
      return;
    }
    setAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const a = generateAnalytics({ file: uploadedFile, dataDate });
          const r = generateRiskRegister({ file: uploadedFile, dataDate });
          setAnalysis(a);
          setRiskRegister(r);
          // lightweight local learning (playbook)
          try {
            const hist = JSON.parse(localStorage.getItem('pi_learning_history') || '[]');
            const nextHist = [...hist, { at: new Date().toISOString(), analysis: a }].slice(-20);
            localStorage.setItem('pi_learning_history', JSON.stringify(nextHist));
            setPlaybook(generatePlaybook({ history: nextHist }));
          } catch {}
          setAnalyzing(false);
          // push user into Analytics tab for "wow" factor
          setSection('analytics');
          return 100;
        }
        return p + 10;
      });
    }, 120);
  }

  function runComparison() {
    if (!fileA || !fileB) {
      alert('Upload two files (Baseline/Previous + Current) first.');
      return;
    }
    setAnalyzing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const comp = generateComparison({ fileA, fileB, dataDate });
          setComparison(comp);
          // local learning history
          try {
            const hist = JSON.parse(localStorage.getItem('pi_learning_history') || '[]');
            const nextHist = [...hist, { at: new Date().toISOString(), comparison: comp }].slice(-20);
            localStorage.setItem('pi_learning_history', JSON.stringify(nextHist));
            setPlaybook(generatePlaybook({ history: nextHist }));
          } catch {}
          setAnalyzing(false);
          setToolsTab('compare');
          return 100;
        }
        return p + 12.5;
      });
    }, 140);
  }

  function runActionPlan() {
    const plan = generateActionPlan({ analysis, comparison });
    setActionPlan(plan);
    return plan;
  }

  function runExecReport() {
    const plan = actionPlan || runActionPlan();
    const rep = generateExecutiveReport({ analysis, comparison, riskRegister, actionPlan: plan });
    setReport(rep);
    return rep;
  }

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadedFile(f);
  }

  function handleFileA(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileA(f);
  }
  function handleFileB(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileB(f);
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

          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button onClick={() => fileARef.current?.click()}
              style={{ width: '100%', padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }}>
              {fileA ? `Baseline: ${fileA.name}` : 'Upload Baseline / Prev (XER)'}
            </button>
            <button onClick={() => fileBRef.current?.click()}
              style={{ width: '100%', padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }}>
              {fileB ? `Current: ${fileB.name}` : 'Upload Current (XER)'}
            </button>
          </div>
          <input ref={fileARef} type="file" accept=".xer,.xml,.xlsx" onChange={handleFileA} style={{ display: 'none' }} />
          <input ref={fileBRef} type="file" accept=".xer,.xml,.xlsx" onChange={handleFileB} style={{ display: 'none' }} />

          <div style={{ marginTop: 10, fontSize: 9, color: c.text.muted, lineHeight: 1.5 }}>
            In this version, uploads are stored only in your browser session (no backend).
          </div>
        </div>

        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>QUICK ACTIONS</span>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            <button onClick={runFullAnalytics} disabled={analyzing}
              style={{ padding: 12, background: c.status.active, border: 'none', cursor: 'pointer', opacity: analyzing ? 0.7 : 1 }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN FULL ANALYTICS (UPLOAD → DASHBOARD)'}</span>
            </button>
            <button onClick={runQSRA} disabled={analyzing}
              style={{ padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: analyzing ? 0.7 : 1 }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN QSRA (DEMO)'}</span>
            </button>
            <button onClick={runDCMA} disabled={analyzing}
              style={{ padding: 12, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN DCMA (DEMO)'}</span>
            </button>
            <button onClick={runComparison} disabled={analyzing}
              style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', opacity: analyzing ? 0.7 : 1 }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>{analyzing ? `ANALYZING... ${Math.round(progress)}%` : 'RUN XER ↔ XER COMPARISON'}</span>
            </button>
            <button onClick={() => { runActionPlan(); setToolsTab('compare'); }}
              style={{ padding: 12, background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>GENERATE ACTION PLAN (NEXT BEST ACTIONS)</span>
            </button>
            <button onClick={() => { runExecReport(); setToolsTab('report'); }}
              style={{ padding: 12, background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>GENERATE EXEC REPORT (WEB + DOWNLOAD)</span>
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

      {toolsTab === 'analytics' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>UPLOAD → ANALYTICS DASHBOARD</span>
          {!analysis ? (
            <div style={{ marginTop: 12, padding: 16, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <p style={{ fontSize: 11, color: c.text.secondary, margin: 0, lineHeight: 1.6 }}>
                Set a Data Date, upload a schedule (XER/XML/XLSX), then click “RUN FULL ANALYTICS”.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { k: 'Project', v: analysis.projectName },
                  { k: 'Data date', v: analysis.dataDate || '—' },
                  { k: 'Earned %', v: `${analysis.kpis.earnedPct}%` },
                  { k: 'Variance', v: `${analysis.kpis.varianceDays}d` }
                ].map((m) => (
                  <div key={m.k} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                    <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 4 }}>{m.k}</span>
                    <span style={{ fontSize: 10, color: c.text.primary }}>{m.v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSection('analytics')}
                style={{ marginTop: 12, padding: 12, width: '100%', background: c.accent.primary, border: 'none', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 10, color: c.bg.primary }}>OPEN ANALYTICS TAB</span>
              </button>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'compare' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>XER ↔ XER COMPARISON (DEMO-DETERMINISTIC)</span>
          <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.6 }}>
            Upload Baseline/Previous + Current, then run comparison. Outputs include date movement, CP shift signals, logic deltas, confidence and assumptions.
          </p>

          {!comparison ? (
            <div style={{ marginTop: 12, padding: 16, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <p style={{ fontSize: 11, color: c.text.secondary, margin: 0, lineHeight: 1.6 }}>
                No comparison yet. Use the buttons above: “Upload Baseline/Prev”, “Upload Current”, then click “RUN XER ↔ XER COMPARISON”.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { k: 'Confidence', v: comparison.meta.confidence },
                  { k: 'CP overlap', v: `${comparison.meta.cpOverlapPct}%` },
                  { k: 'Open ends Δ', v: `${comparison.meta.openEndsDelta > 0 ? '+' : ''}${comparison.meta.openEndsDelta}` },
                  { k: 'Constraints Δ', v: `${comparison.meta.constraintsDelta > 0 ? '+' : ''}${comparison.meta.constraintsDelta}` },
                ].map((m) => (
                  <div key={m.k} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                    <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 4 }}>{m.k}</span>
                    <span style={{ fontSize: 10, color: c.text.primary }}>{m.v}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: 12, background: 'rgba(160,128,64,0.08)', border: '1px solid ' + c.accent.dim }}>
                <div style={{ fontSize: 10, color: c.accent.primary, marginBottom: 6 }}>What changed & why it matters</div>
                <div style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>
                  <div style={{ color: c.text.primary, marginBottom: 6 }}>{comparison.narrative.headline}</div>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {comparison.narrative.bullets.map((b, i) => <li key={i} style={{ marginBottom: 4 }}>{b}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 8 }}>Top activity movement (sample)</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {comparison.tables.movement.slice(0, 8).map((r) => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 9, color: c.text.secondary }}>
                        <span style={{ color: c.text.primary }}>{r.id}</span>
                        <span>ΔStart {r.startMove}d</span>
                        <span>ΔFinish {r.finishMove}d</span>
                        <span>ΔFloat {r.floatMove}d</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 8 }}>Assumptions</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 9, color: c.text.secondary, lineHeight: 1.6 }}>
                    {comparison.assumptions.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 8 }}>Next Best Actions</div>
                  <button onClick={runActionPlan} style={{ padding: '8px 10px', background: c.accent.primary, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, color: c.bg.primary }}>GENERATE / REFRESH ACTION PLAN</span>
                  </button>
                  {actionPlan?.items ? (
                    <div style={{ display: 'grid', gap: 8 }}>
                      {actionPlan.items.slice(0, 6).map((it) => (
                        <div key={it.id} style={{ padding: 10, border: '1px solid ' + c.border.default, background: c.bg.card }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                            <span style={{ fontSize: 10, color: c.text.primary }}>{it.id}. {it.title}</span>
                            <span style={{ fontSize: 8, color: c.text.muted }}>Impact {it.impact} • Conf {it.confidence}</span>
                          </div>
                          <div style={{ fontSize: 9, color: c.text.secondary, marginTop: 6, lineHeight: 1.5 }}>{it.why}</div>
                          <div style={{ fontSize: 8, color: c.text.muted, marginTop: 6 }}>Owner: {it.owner} • Effort: {it.effort}/5</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 10, color: c.text.muted }}>Generate an action plan to see a prioritised fix list.</div>
                  )}
                </div>

                <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 8 }}>Project Playbook (learning)</div>
                  {playbook ? (
                    <div>
                      <div style={{ fontSize: 10, color: c.text.primary }}>{playbook.headline}</div>
                      <div style={{ fontSize: 9, color: c.text.secondary, marginTop: 8, lineHeight: 1.6 }}>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {playbook.insights.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}
                        </ul>
                      </div>
                      <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                        {playbook.drivers.map((d) => (
                          <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: c.text.secondary }}>
                            <span>{d.name}</span><span>{d.weight}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: 10, color: c.text.muted }}>Run analytics and comparison a few times to build a local playbook.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {toolsTab === 'risk' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 9, color: c.text.muted }}>RISK REGISTER (UPLOAD‑DRIVEN)</span>
          {!riskRegister || riskRegister.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center' }}>
              <Shield size={32} color={c.text.muted} />
              <p style={{ fontSize: 11, color: c.text.muted, marginTop: 12 }}>Run Full Analytics to generate a risk register</p>
            </div>
          ) : (
            <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              {riskRegister.map((r) => {
                const col = r.rag === 'RED' ? c.status.critical : r.rag === 'AMBER' ? c.status.warning : c.status.active;
                return (
                  <div key={r.id} style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default, borderLeft: '3px solid ' + col }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: c.text.primary }}>{r.title}</span>
                      <span style={{ fontSize: 9, color: col }}>{r.rag}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <span style={{ fontSize: 8, color: c.text.muted }}>P: {r.probability}%</span>
                      <span style={{ fontSize: 8, color: c.text.muted }}>I: {r.impact}%</span>
                      <span style={{ fontSize: 8, color: c.text.muted }}>Due: {r.due}</span>
                      <span style={{ fontSize: 8, color: c.text.muted }}>Owner: {r.owner}</span>
                    </div>
                    <p style={{ fontSize: 9, color: c.text.secondary, margin: '8px 0 0', lineHeight: 1.5 }}>{r.action}</p>
                  </div>
                );
              })}
            </div>
          )}
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

      {toolsTab === 'evidence' && (<EvidenceLockerPanel />)}

      {toolsTab === 'report' && (
        <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
          <span style={{ fontSize: 11, color: c.text.primary }}>Executive Report (Web + Download)</span>
          <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.5 }}>
            Generates a client-safe executive narrative using only extracted metrics. For demo mode, no sensitive content is embedded.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <button onClick={runExecReport} style={{ padding: '10px 12px', background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.bg.primary }}>GENERATE / REFRESH</span>
            </button>
            <button onClick={() => { const rep = report || runExecReport(); downloadTextFile('Planning_Intelligence_ExecReport.json', JSON.stringify(rep, null, 2)); }}
              style={{ padding: '10px 12px', background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>DOWNLOAD JSON</span>
            </button>
            <button onClick={() => { const rep = report || runExecReport(); const html = buildExecReportHtml(rep); downloadTextFile('Planning_Intelligence_ExecReport.html', html); }}
              style={{ padding: '10px 12px', background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 10, color: c.text.primary }}>DOWNLOAD HTML</span>
            </button>
          </div>

          {!report ? (
            <div style={{ marginTop: 12, padding: 16, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <p style={{ margin: 0, fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>
                Generate the report to see a one-page executive summary + planner appendix.
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 12, padding: 14, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 12, color: c.text.primary, fontWeight: 900 }}>{report.meta.title}</div>
                  <div style={{ fontSize: 9, color: c.text.muted, marginTop: 4 }}>Generated: {new Date(report.meta.generatedAt).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: c.text.primary }}>RAG: <span style={{ color: report.meta.rag === 'RED' ? c.status.critical : report.meta.rag === 'AMBER' ? c.status.warning : c.status.active }}>{report.meta.rag}</span></div>
                  <div style={{ fontSize: 9, color: c.text.muted }}>Confidence: {report.meta.confidence}</div>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 9, color: c.text.muted }}>EXEC SUMMARY</div>
                <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>
                  {report.exec.summary.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                </ul>
              </div>

              {report.exec.topIssues?.length ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 9, color: c.text.muted }}>TOP ISSUES</div>
                  <ul style={{ margin: '6px 0 0', paddingLeft: 16, fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>
                    {report.exec.topIssues.map((s, i) => <li key={i} style={{ marginBottom: 4 }}>{s}</li>)}
                  </ul>
                </div>
              ) : null}

              <div style={{ marginTop: 12, padding: 12, background: c.bg.card, border: '1px solid ' + c.border.default }}>
                <div style={{ fontSize: 9, color: c.text.muted }}>RECOMMENDATION</div>
                <div style={{ fontSize: 10, color: c.text.secondary, marginTop: 6, lineHeight: 1.6 }}>{report.exec.recommendation}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- MAP (zoomable, theme-matching) ---
export function MapSection() {
  const systemData = demoSystemData;
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);
  const [drag, setDrag] = useState(null);
  const locations = systemData.locations || [];

  // Simple equirectangular projection into a 1000x500 canvas.
  const toXY = (lat, lng) => ({ x: ((lng + 180) / 360) * 1000, y: ((90 - lat) / 180) * 500 });
  const viewBox = `${-offset.x} ${-offset.y} ${1000 / zoom} ${500 / zoom}`;

  const onMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDrag({ startX: e.clientX, startY: e.clientY, base: { ...offset }, rect });
  };
  const onMouseMove = (e) => {
    if (!drag) return;
    const dx = (e.clientX - drag.startX) / zoom;
    const dy = (e.clientY - drag.startY) / zoom;
    setOffset({ x: Math.max(-250, Math.min(250, drag.base.x - dx)), y: Math.max(-160, Math.min(160, drag.base.y - dy)) });
  };
  const onMouseUp = () => setDrag(null);


  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function focusLocation(loc, nextZoom = 2.2) {
    if (!loc) return;
    const z = clamp(nextZoom, 1, 5);
    const w = 1000 / z;
    const h = 500 / z;
    const { x, y } = toXY(loc.lat, loc.lng);

    // Because we render via viewBox = {-offset.x, -offset.y, w, h},
    // to center (x,y) we need offset = (w/2 - x, h/2 - y)
    const ox = clamp((w / 2) - x, -250, 250);
    const oy = clamp((h / 2) - y, -160, 160);

    setZoom(z);
    setOffset({ x: ox, y: oy });
    setSelectedId(loc.id);
  }
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>MAP</span>
      <h2 style={{ fontSize: 16, color: c.text.primary, margin: '6px 0 14px' }}>Project Locations</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button onClick={() => setZoom((z) => Math.min(2.4, Math.round((z + 0.2) * 10) / 10))} style={{ padding: '8px 10px', background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10 }}>ZOOM +</button>
        <button onClick={() => setZoom((z) => Math.max(1, Math.round((z - 0.2) * 10) / 10))} style={{ padding: '8px 10px', background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10 }}>ZOOM -</button>
        <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} style={{ padding: '8px 10px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 10 }}>RESET</button>
        <div style={{ marginLeft: 'auto', fontSize: 10, color: c.text.muted, display: 'flex', alignItems: 'center' }}>Drag to pan • {locations.length} pins</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <div
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseUp}
          onMouseUp={onMouseUp}
          style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default, cursor: drag ? 'grabbing' : 'grab' }}
        >
          <div style={{ marginBottom: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
            <model-viewer
              src="/earth.glb"
              alt="3D Earth"
              auto-rotate
              camera-controls
              interaction-prompt="none"
              style={{ width: '100%', height: 220, display: 'block' }}
            />
          </div>
          <svg width="100%" height="420" viewBox={viewBox} style={{ background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
            {/* subtle grid */}
            {Array.from({ length: 19 }).map((_, i) => (
              <line key={'lat'+i} x1={0} x2={1000} y1={(i * 500) / 18} y2={(i * 500) / 18} stroke={c.border.default} strokeDasharray="2 6" opacity="0.35" />
            ))}
            {Array.from({ length: 25 }).map((_, i) => (
              <line key={'lon'+i} y1={0} y2={500} x1={(i * 1000) / 24} x2={(i * 1000) / 24} stroke={c.border.default} strokeDasharray="2 6" opacity="0.35" />
            ))}

            {/* pins */}
            {locations.map((loc) => {
              const p = toXY(loc.lat, loc.lng);
              const col = loc.status === 'active' ? c.status.active : c.accent.primary;
              return (
                <g key={loc.id} onClick={() => focusLocation(loc, 2.4)} style={{ cursor: 'pointer' }}>
                  {loc.status === 'active' && (
                    <circle cx={p.x} cy={p.y} r={10} fill="none" stroke={col} strokeWidth={1} opacity={0.5}>
                      <animate attributeName="r" from="6" to="16" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <rect x={p.x - 4} y={p.y - 4} width={8} height={8} fill={col} transform={`rotate(45 ${p.x} ${p.y})`} />
                </g>
              );
            })}
          </svg>
          <div style={{ marginTop: 10, fontSize: 9, color: c.text.muted, lineHeight: 1.5 }}>
            Note: This is a lightweight, theme-matching map layer (no heavy map libraries). If you want, we can upgrade to a true world basemap with country outlines + clustering.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 460, overflowY: 'auto' }}>
          {locations.map((loc) => (
            <div key={loc.id}
              onClick={() => focusLocation(loc, 2.4)}
              style={{ padding: 12, background: selectedId === loc.id ? 'rgba(160,128,64,0.12)' : c.bg.card, border: '1px solid ' + (selectedId === loc.id ? c.accent.dim : c.border.default), cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: c.text.primary }}>{loc.name}</span>
                <span style={{ fontSize: 9, color: loc.status === 'active' ? c.status.active : c.accent.primary }}>{loc.status.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 9, color: c.text.secondary }}>{loc.type} • {loc.capacity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- POSTS (Reddit-style, local-only) ---
export function PostsSection() {
  const { isAdmin, setIsAdmin } = useApp();
  const storageKey = 'pi_posts_v1';
  const adminKey = 'pi_admin_v1';

  const initial = useMemo(() => {
    try {
      const v = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, []);

  const [posts, setPosts] = useState(initial);
  const [draft, setDraft] = useState({ title: '', body: '', mediaUrl: '' });
  const [mediaFile, setMediaFile] = useState(null);
  const [pin, setPin] = useState('');
  const fileRef = useRef(null);
  const [sharePostId, setSharePostId] = useState(null);

  React.useEffect(() => {
    try {
      const a = localStorage.getItem(adminKey) === '1';
      if (a && !isAdmin) setIsAdmin(true);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (next) => {
    setPosts(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const login = () => {
    const ok = (pin || '').trim().toLowerCase() === 'aniket';
    if (!ok) return alert('Incorrect PIN');
    setIsAdmin(true);
    try { localStorage.setItem(adminKey, '1'); } catch { /* ignore */ }
    setPin('');
  };

  const logout = () => {
    setIsAdmin(false);
    try { localStorage.removeItem(adminKey); } catch { /* ignore */ }
  };

  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  const createPost = async () => {
    if (!isAdmin) return alert('Login as operator to create posts.');
    if (!draft.title.trim() || !draft.body.trim()) return;

    let media = null;
    if (mediaFile) {
      if (mediaFile.size > 5 * 1024 * 1024) return alert('File too large (max 5MB).');
      try {
        const dataUrl = await readFileAsDataUrl(mediaFile);
        media = { kind: mediaFile.type.startsWith('video') ? 'video' : 'image', dataUrl, name: mediaFile.name, type: mediaFile.type };
      } catch {
        return alert('Could not read file.');
      }
    } else if (draft.mediaUrl.trim()) {
      media = { kind: 'url', url: draft.mediaUrl.trim() };
    }

    const p = {
      id: String(Date.now()),
      title: draft.title.trim(),
      body: draft.body.trim(),
      createdAt: new Date().toISOString(),
      score: 0,
      userVote: 0,
      comments: [],
      media
    };
    persist([p, ...posts]);
    setDraft({ title: '', body: '', mediaUrl: '' });
    setMediaFile(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const vote = (id, delta) => {
    const next = posts.map((p) => {
      if (p.id !== id) return p;
      const newVote = p.userVote === delta ? 0 : delta;
      const score = p.score - p.userVote + newVote;
      return { ...p, score, userVote: newVote };
    });
    persist(next);
  };

  const [commentDraft, setCommentDraft] = useState({});

  const addComment = (id) => {
    const txt = (commentDraft[id] || '').trim();
    if (!txt) return;
    const next = posts.map((p) => p.id === id ? { ...p, comments: [...p.comments, { id: String(Date.now()), text: txt, at: new Date().toISOString() }] } : p);
    persist(next);
    setCommentDraft({ ...commentDraft, [id]: '' });
  };
  const share = async (id) => {
    const url = `${window.location.origin}${window.location.pathname}#post=${id}`;
    const text = 'Check this post';

    // Copy link first (always)
    try { await navigator.clipboard.writeText(url); } catch {}

    // If Web Share API exists, use it (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Post', text, url });
        return;
      } catch {
        // fallthrough to custom share panel
      }
    }

    setSharePostId(id);
  };

  const openSocialShare = (platform) => {
    if (!sharePostId) return;
    const url = `${window.location.origin}${window.location.pathname}#post=${sharePostId}`;
    const text = encodeURIComponent('Check this post');
    const u = encodeURIComponent(url);

    const links = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      whatsapp: `https://wa.me/?text=${text}%20${u}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
      email: `mailto:?subject=${encodeURIComponent('Post')}&body=${text}%20${u}`,
    };

    const target = links[platform];
    if (!target) return;

    window.open(target, '_blank', 'noopener,noreferrer');
  };


  const renderMedia = (media) => {
    if (!media) return null;

    if (media.kind === 'image') {
      return <img src={media.dataUrl} alt={media.name || 'post'} style={{ width: '100%', display: 'block' }} />;
    }
    if (media.kind === 'video') {
      return <video src={media.dataUrl} controls style={{ width: '100%', display: 'block' }} />;
    }
    if (media.kind === 'url') {
      const u = media.url || '';
      const isImg = /(\.png|\.jpg|\.jpeg|\.gif|\.webp)(\?.*)?$/i.test(u);
      const isVid = /(\.mp4|\.webm|\.mov)(\?.*)?$/i.test(u);
      if (isImg) return <img src={u} alt="post" style={{ width: '100%', display: 'block' }} />;
      if (isVid) return <video src={u} controls style={{ width: '100%', display: 'block' }} />;
      return <a href={u} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: 12, color: c.accent.primary, fontSize: 11 }}>Open media</a>;
    }
    return null;
  };

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 10, color: c.text.muted }}>POSTS</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '8px 0 14px' }}>Updates & Posts</h2>

      <div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: c.text.secondary }}>
            Only the operator can create posts. Everyone can vote and comment.
          </span>

          {isAdmin ? (
            <button onClick={logout} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 11 }}>
              Logout Operator
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Operator PIN" style={{ padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', width: 160 }} />
              <button onClick={login} style={{ padding: '8px 12px', background: c.accent.primary, border: 'none', cursor: 'pointer', color: c.bg.primary, fontSize: 11 }}>
                Login
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Post title" style={{ padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace' }} />
          <input value={draft.mediaUrl} onChange={(e) => setDraft({ ...draft, mediaUrl: e.target.value })} placeholder="Media URL (optional)" style={{ padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 8 }}>
          <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Write your post..." rows={3} style={{ width: '100%', padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace', resize: 'none' }} />
          <div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: 10, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 11 }}>
              {mediaFile ? `Selected: ${mediaFile.name}` : 'Upload Image/Video'}
            </button>
            {mediaFile ? (
              <button onClick={() => { setMediaFile(null); if (fileRef.current) fileRef.current.value=''; }} style={{ marginTop: 8, width: '100%', padding: 10, background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 11 }}>
                Remove file
              </button>
            ) : null}
          </div>
        </div>

        <button onClick={createPost} style={{ marginTop: 10, padding: 12, width: '100%', background: c.accent.primary, border: 'none', cursor: 'pointer' }}>
          <span style={{ fontSize: 11, color: c.bg.primary }}>{isAdmin ? 'CREATE POST' : 'LOGIN TO CREATE POST'}</span>
        </button>

        <div style={{ marginTop: 8, fontSize: 10, color: c.text.muted }}>
          Demo PIN: <span style={{ color: c.accent.primary }}>aniket</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {posts.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <span style={{ fontSize: 12, color: c.text.muted }}>No posts yet.</span>
          </div>
        ) : posts.map((p) => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 10, padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <button onClick={() => vote(p.id, 1)} style={{ width: 36, height: 36, border: '1px solid ' + c.border.default, background: p.userVote === 1 ? 'rgba(34,197,94,0.15)' : 'transparent', cursor: 'pointer', color: p.userVote === 1 ? c.status.active : c.text.muted }}>▲</button>
              <div style={{ fontSize: 12, color: c.text.primary }}>{p.score}</div>
              <button onClick={() => vote(p.id, -1)} style={{ width: 36, height: 36, border: '1px solid ' + c.border.default, background: p.userVote === -1 ? 'rgba(239,68,68,0.15)' : 'transparent', cursor: 'pointer', color: p.userVote === -1 ? c.status.critical : c.text.muted }}>▼</button>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, color: c.text.primary }}>{p.title}</div>
                  <div style={{ fontSize: 10, color: c.text.muted, marginTop: 4 }}>{new Date(p.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={() => share(p.id)} style={{ padding: '8px 12px', background: 'transparent', border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.muted, fontSize: 11 }}>
                  Share
                </button>
              </div>

              <p style={{ fontSize: 11, color: c.text.secondary, marginTop: 10, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{p.body}</p>

              {p.media ? (
                <div style={{ marginTop: 10, border: '1px solid ' + c.border.default, background: c.bg.secondary, overflow: 'hidden' }}>
                  {renderMedia(p.media)}
                </div>
              ) : null}

              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid ' + c.border.default }}>
                <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 8 }}>{p.comments.length} comments</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={commentDraft[p.id] || ''} onChange={(e) => setCommentDraft({ ...commentDraft, [p.id]: e.target.value })} placeholder="Add a comment" style={{ flex: 1, padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 11, fontFamily: 'monospace' }} />
                  <button onClick={() => addComment(p.id)} style={{ padding: '10px 14px', background: c.accent.primary, border: 'none', cursor: 'pointer', color: c.bg.primary, fontSize: 11 }}>
                    Reply
                  </button>
                </div>

                {p.comments.length > 0 && (
                  <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                    {p.comments.slice(-5).map((cmt) => (
                      <div key={cmt.id} style={{ padding: 10, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
                        <div style={{ fontSize: 10, color: c.text.muted }}>{new Date(cmt.at).toLocaleString()}</div>
                        <div style={{ fontSize: 11, color: c.text.primary, marginTop: 4, whiteSpace: 'pre-wrap' }}>{cmt.text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// CaseFiles intentionally removed for now (can be re-added when you want downloadable artefacts).
