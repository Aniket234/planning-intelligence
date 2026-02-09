import React, { useMemo, useRef, useState, Fragment, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Upload, Sparkles, TrendingUp, CheckSquare, Shield, HelpCircle, FileText, Download, Search, ChevronRight, AlertTriangle, Zap, Info } from 'lucide-react';
import { c } from '../lib/theme';
import { useApp } from '../app/context';
import { explainPush } from '../lib/explainPush';

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: c.bg.elevated, border: '1px solid ' + c.border.default, padding: 10 }}>
    <p style={{ fontSize: 9, color: c.text.muted, marginBottom: 4 }}>{label}</p>
    {payload.map((e, i) => <p key={i} style={{ fontSize: 10, color: e.color, margin: '2px 0' }}>{e.name}: {e.value}</p>)}
  </div>);
};

function Card({ title, children, style }) {
  return (<div style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default, ...style }}>
    {title && <span style={{ fontSize: 9, color: c.text.muted, display: 'block', marginBottom: 10 }}>{title}</span>}
    {children}
  </div>);
}

function Badge({ status }) {
  const col = status === 'PASS' ? c.status.active : status === 'WARNING' ? c.status.warning : status === 'FAIL' ? c.status.critical : c.text.muted;
  return <span style={{ fontSize: 8, padding: '2px 6px', background: col + '22', color: col, fontWeight: 700 }}>{status}</span>;
}

function Kpi({ label, value, color }) {
  return (<div style={{ padding: 10, background: c.bg.card, border: '1px solid ' + c.border.default }}>
    <span style={{ fontSize: 8, color: c.text.muted, display: 'block', marginBottom: 4 }}>{label}</span>
    <span style={{ fontSize: 14, color: color || c.accent.primary }}>{value}</span>
  </div>);
}

export default function ToolsSectionV2() {
  const ctx = useApp();
  const { toolsTab, setToolsTab, uploadedFile, setUploadedFile, baselineFile, setBaselineFile, currentFile, setCurrentFile, dataDate, setDataDate, setAnalysis, setSection } = ctx;

  const [parsed, setParsed] = useState(null);
  const [cpm, setCpm] = useState(null);
  const [fci, setFci] = useState(null);
  const [dcma, setDcma] = useState(null);
  const [parsedBase, setParsedBase] = useState(null);
  const [parsedCur, setParsedCur] = useState(null);
  const [baseCpm, setBaseCpm] = useState(null);
  const [curCpm, setCurCpm] = useState(null);
  const [explains, setExplains] = useState(null);
  const [realComp, setRealComp] = useState(null);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [selAct, setSelAct] = useState(null);
  const [filter, setFilter] = useState('');
  const [fciMode, setFciMode] = useState('all');
  const [wizard, setWizard] = useState({ baseline: false, updates: false, asBuilt: false, notices: false, diaries: false, qra: false });
  const [explainActId, setExplainActId] = useState('');

  const fR = useRef(null), fA = useRef(null), fB = useRef(null);
  const workerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        try { workerRef.current.terminate(); } catch {}
        workerRef.current = null;
      }
    };
  }, []);

  function getWorker() {
    if (workerRef.current) return workerRef.current;
    const w = new Worker(new URL('../workers/scheduleWorker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;
    return w;
  }

  function callWorker(kind, payload) {
    return new Promise((resolve, reject) => {
      const w = getWorker();
      const jobId = Math.random().toString(16).slice(2);
      const onMsg = (evt) => {
        const d = evt.data;
        if (!d || d.jobId !== jobId) return;
        w.removeEventListener('message', onMsg);
        if (d.ok) resolve(d);
        else reject(new Error(d.error || 'Worker error'));
      };
      w.addEventListener('message', onMsg);
      w.postMessage({ jobId, kind, ...payload });
    });
  }

  function rehydrateParsed(p) {
    if (!p) return null;
    return {
      projectName: p.projectName,
      dataDate: p.dataDate,
      tasks: new Map(p.tasks || []),
      rels: p.rels || [],
      predCount: new Map(p.predCount || []),
      succCount: new Map(p.succCount || []),
      wbsById: new Map(p.wbsById || []),
      calendars: new Map(p.calendars || []),
    };
  }

  function rehydrateCPM(cp) {
    if (!cp) return null;
    const tasks = new Map(cp.tasks || []);
    const getDrivingChain = (actId, maxDepth = 50) => {
      const chain = [];
      let current = actId;
      const seen = new Set();
      while (current && !seen.has(current) && chain.length < maxDepth) {
        seen.add(current);
        const t = tasks.get(current);
        if (!t) break;
        chain.push({
          id: current,
          code: t.code,
          name: t.name,
          ES: t.ES,
          EF: t.EF,
          TF: t.TF,
          linkType: t.drivingPredType,
        });
        current = t.drivingPredId;
      }
      return chain;
    };
    return { projectFinish: cp.projectFinish, tasks, getDrivingChain };
  }

  function rehydrateFCI(fc) {
    if (!fc) return null;
    return { summary: fc.summary, fciMap: new Map(fc.fciMap || []) };
  }

  const tabs = [
    { id: 'hub', label: 'HUB', icon: Sparkles },
    { id: 'reader', label: 'XER READER', icon: Search },
    { id: 'fci', label: 'FLOAT INDEX', icon: AlertTriangle },
    { id: 'dcma', label: 'DCMA 14-PT', icon: Shield },
    { id: 'explain', label: 'EXPLAIN PUSH', icon: Zap },
    { id: 'compare', label: 'XER ↔ XER', icon: TrendingUp },
    { id: 'wizard', label: 'METHOD', icon: HelpCircle },
  ];

  // === Single schedule pipeline ===
  async function runSingle(file) {
    if (!file) return;
    setBusy(true); setMsg('Reading file...');
    try {
      const xerText = await file.text();
      setMsg('Analyzing schedule (worker)...');
      const r = await callWorker('single', { xerText });

      const p = rehydrateParsed(r.parsed);
      const cp = rehydrateCPM(r.cpm);
      const fc = rehydrateFCI(r.fci);

      setParsed(p);
      setCpm(cp);
      setFci(fc);
      setDcma(r.dcma);
      setAnalysis({ projectName: p.projectName, dataDate: p.dataDate || dataDate || '', kpis: r.analytics?.kpis, evidence: r.analytics?.evidence, real: true });

      setMsg(`Done — ${p.tasks.size} activities, DCMA ${r.dcma?.score ?? '—'}/100, FCI avg ${fc?.summary?.average ?? '—'}`);
      setToolsTab('reader');
    } catch (e) { setMsg('Error: ' + e.message); console.error(e); }
    setBusy(false);
  }

  // === Comparison pipeline ===
  async function runComp() {
    if (!baselineFile || !currentFile) return alert('Upload both XER files.');
    setBusy(true); setMsg('Reading files...');
    try {
      const baselineText = await baselineFile.text();
      const currentText = await currentFile.text();
      setMsg('Comparing schedules (worker)...');
      const r = await callWorker('compare', { baselineText, currentText, topN: 15 });

      const bp = rehydrateParsed(r.baseline?.parsed);
      const cp2 = rehydrateParsed(r.current?.parsed);
      const bc = rehydrateCPM(r.baseline?.cpm);
      const cc = rehydrateCPM(r.current?.cpm);
      const fc = rehydrateFCI(r.fci);

      setParsedBase(bp);
      setParsedCur(cp2);
      setBaseCpm(bc);
      setCurCpm(cc);
      setRealComp(r.comparison);
      setExplains(r.explains);
      setFci(fc);
      setDcma(r.dcma);
      setParsed(cp2);
      setCpm(cc);
      setAnalysis({ projectName: cp2.projectName, dataDate: cp2.dataDate || dataDate || '', kpis: r.analytics?.kpis, evidence: r.analytics?.evidence, real: true, comparison: r.comparison });
      setMsg(`Done — ${(r.explains || []).length} slipped activities analysed.`);
      setToolsTab('explain');
    } catch (e) { setMsg('Error: ' + e.message); console.error(e); }
    setBusy(false);
  }

  // === Single explain ===
  function runSingleExplain() {
    if (!parsedBase || !parsedCur || !baseCpm || !curCpm || !explainActId) return;
    const r = explainPush(explainActId.trim(), parsedBase, baseCpm, parsedCur, curCpm);
    setExplains(prev => prev ? [{ id: explainActId, slip: r.finishMove || 0, code: r.actCode, name: r.actName, explanation: r }, ...prev] : [{ id: explainActId, slip: r.finishMove || 0, code: r.actCode, name: r.actName, explanation: r }]);
  }

  // === Filtered activities for reader ===
  const acts = useMemo(() => {
    if (!cpm) return [];
    let list = Array.from(cpm.tasks.values());
    if (filter) { const q = filter.toLowerCase(); list = list.filter(t => (t.code || '').toLowerCase().includes(q) || (t.name || '').toLowerCase().includes(q)); }
    if (fciMode !== 'all' && fci) {
      list = list.filter(t => { const f = fci.fciMap.get(t.id); if (!f) return false; if (fciMode === 'low') return f.score < 40; if (fciMode === 'med') return f.score >= 40 && f.score < 80; return f.score >= 80; });
    }
    return list.sort((a, b) => a.TF - b.TF).slice(0, 200);
  }, [cpm, filter, fciMode, fci]);

  const methodRec = useMemo(() => {
    const w = wizard;
    if (w.baseline && w.updates && w.asBuilt) return { method: 'Time Impact Analysis (TIA) / Windows', why: 'Baseline + updates + as-built evidence.' };
    if (w.baseline && w.updates) return { method: 'Windows / TIA', why: 'Measure impacts between update windows.' };
    if (w.baseline && w.asBuilt) return { method: 'As-Planned vs As-Built', why: 'Triangulate with as-built data.' };
    if (!w.baseline && w.asBuilt && w.diaries) return { method: 'As-Built Critical Path (ABCP)', why: 'Reconstruct CP from as-built + records.' };
    if (w.notices && w.diaries) return { method: 'Narrative + Cause-Effect', why: 'Contemporaneous records approach.' };
    if (w.qra) return { method: 'QSRA / Probabilistic', why: 'Risk-informed forecasting.' };
    return { method: 'Hybrid approach', why: 'Select your evidence above.' };
  }, [wizard]);

  // === FCI distribution chart data ===
  const fciChartData = useMemo(() => {
    if (!fci) return [];
    const buckets = [
      { range: '0-20', count: 0, fill: '#ef4444' }, { range: '21-40', count: 0, fill: '#f97316' },
      { range: '41-60', count: 0, fill: '#eab308' }, { range: '61-80', count: 0, fill: '#22c55e' },
      { range: '81-100', count: 0, fill: '#10b981' },
    ];
    for (const f of fci.fciMap.values()) {
      if (f.score <= 20) buckets[0].count++;
      else if (f.score <= 40) buckets[1].count++;
      else if (f.score <= 60) buckets[2].count++;
      else if (f.score <= 80) buckets[3].count++;
      else buckets[4].count++;
    }
    return buckets;
  }, [fci]);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>PLANNING INTELLIGENCE</span>
      <h2 style={{ fontSize: 18, color: c.text.primary, margin: '6px 0' }}>Tools Engine</h2>
      <p style={{ fontSize: 10, color: c.text.secondary, marginBottom: 16 }}>XER Reader • CPM Engine • Float Credibility Index • DCMA 14-Point • Explain Push</p>

      {/* Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {tabs.map(t => { const I = t.icon; const a = toolsTab === t.id;
          return (<button key={t.id} onClick={() => setToolsTab(t.id)} style={{ padding: '8px 12px', background: a ? 'rgba(160,128,64,0.15)' : c.bg.card, border: '1px solid ' + (a ? c.accent.dim : c.border.default), cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <I size={11} color={a ? c.accent.primary : c.text.muted} /><span style={{ fontSize: 9, color: a ? c.accent.primary : c.text.primary }}>{t.label}</span></button>);
        })}
      </div>

      {/* Upload */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <Card title="SINGLE SCHEDULE">
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input type="date" value={dataDate} onChange={e => setDataDate(e.target.value)} style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
            <button onClick={() => fR.current?.click()} style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10 }}>{uploadedFile ? uploadedFile.name : 'Upload XER'}</button>
          </div>
          <input ref={fR} type="file" accept=".xer" onChange={e => { const f = e.target.files?.[0]; if (f) { setUploadedFile(f); runSingle(f); }}} style={{ display: 'none' }} />
          <button onClick={() => uploadedFile && runSingle(uploadedFile)} disabled={busy || !uploadedFile} style={{ width: '100%', padding: 10, background: c.status.active, border: 'none', cursor: 'pointer', opacity: (busy || !uploadedFile) ? 0.5 : 1 }}>
            <span style={{ fontSize: 10, color: '#030303' }}>{busy ? 'PROCESSING...' : 'RUN ANALYSIS (CPM + FCI + DCMA)'}</span></button>
        </Card>
        <Card title="COMPARISON (BASELINE vs UPDATE)">
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => fA.current?.click()} style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10 }}>{baselineFile ? `B: ${baselineFile.name}` : 'Baseline XER'}</button>
            <button onClick={() => fB.current?.click()} style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, cursor: 'pointer', color: c.text.primary, fontSize: 10 }}>{currentFile ? `C: ${currentFile.name}` : 'Current XER'}</button>
          </div>
          <input ref={fA} type="file" accept=".xer" onChange={e => { const f = e.target.files?.[0]; if (f) setBaselineFile(f); }} style={{ display: 'none' }} />
          <input ref={fB} type="file" accept=".xer" onChange={e => { const f = e.target.files?.[0]; if (f) setCurrentFile(f); }} style={{ display: 'none' }} />
          <button onClick={runComp} disabled={busy || !baselineFile || !currentFile} style={{ width: '100%', padding: 10, background: c.accent.primary, border: 'none', cursor: 'pointer', opacity: (busy || !baselineFile || !currentFile) ? 0.5 : 1 }}>
            <span style={{ fontSize: 10, color: '#030303' }}>{busy ? 'COMPARING...' : 'RUN COMPARISON + EXPLAIN PUSH'}</span></button>
        </Card>
      </div>
      {msg && <div style={{ padding: 8, marginBottom: 14, background: c.bg.secondary, border: '1px solid ' + c.border.default }}><span style={{ fontSize: 10, color: c.accent.primary }}>{msg}</span></div>}

      {/* ===== HUB ===== */}
      {toolsTab === 'hub' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { t: 'XER Reader', d: 'P6-like viewer with CPM dates, float, driving predecessors.', tab: 'reader' },
            { t: 'Float Credibility Index', d: 'Scores float trustworthiness (0-100). Detects fake float.', tab: 'fci' },
            { t: 'DCMA 14-Point', d: 'Real schedule quality assessment from your XER data.', tab: 'dcma' },
            { t: 'Explain Push', d: 'What pushed this activity? Traces driving chain causality.', tab: 'explain' },
            { t: 'XER Comparison', d: 'Baseline vs update: movements, CP changes, diffs.', tab: 'compare' },
            { t: 'Method Wizard', d: 'Recommended delay analysis method based on your evidence.', tab: 'wizard' },
          ].map(x => (
            <motion.div key={x.t} whileHover={{ borderColor: c.accent.dim }} onClick={() => setToolsTab(x.tab)}
              style={{ padding: 16, background: c.bg.card, border: '1px solid ' + c.border.default, cursor: 'pointer' }}>
              <span style={{ fontSize: 11, color: c.text.primary }}>{x.t}</span>
              <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8, lineHeight: 1.5 }}>{x.d}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== XER READER ===== */}
      {toolsTab === 'reader' && (<div>
        {!cpm ? <Card><p style={{ fontSize: 11, color: c.text.muted }}>Upload an XER file to view activities with CPM-computed dates.</p></Card> : (<>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 10 }}>
            <Kpi label="ACTIVITIES" value={cpm.tasks.size} />
            <Kpi label="RELATIONSHIPS" value={parsed?.rels.length || 0} />
            <Kpi label="CRITICAL" value={Array.from(cpm.tasks.values()).filter(t => t.critical).length} color={c.status.critical} />
            <Kpi label="PROJECT DUR" value={`${cpm.projectFinish}d`} />
            <Kpi label="DCMA" value={dcma ? `${dcma.score}/100` : '—'} />
            <Kpi label="FCI AVG" value={fci ? fci.summary.average : '—'} color={fci && fci.summary.average < 50 ? c.status.warning : c.status.active} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search ID / Name..." style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
            <select value={fciMode} onChange={e => setFciMode(e.target.value)} style={{ padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }}>
              <option value="all">All FCI</option><option value="low">FCI &lt; 40</option><option value="med">FCI 40-80</option><option value="high">FCI 80+</option>
            </select>
            <span style={{ fontSize: 9, color: c.text.muted, alignSelf: 'center' }}>{acts.length} shown</span>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: 'monospace' }}>
              <thead><tr style={{ borderBottom: '1px solid ' + c.border.default, position: 'sticky', top: 0, background: c.bg.primary }}>
                {['ID', 'Name', 'Dur', 'ES', 'EF', 'TF', 'FF', 'FCI', 'Crit', 'Driver'].map(h => (
                  <th key={h} style={{ padding: '6px', textAlign: 'left', color: c.text.muted, fontSize: 8 }}>{h}</th>))}
              </tr></thead>
              <tbody>{acts.map(t => { const f = fci?.fciMap.get(t.id); const sel = selAct === t.id;
                return (<tr key={t.id} onClick={() => setSelAct(sel ? null : t.id)} style={{ borderBottom: '1px solid ' + c.border.default, cursor: 'pointer', background: sel ? 'rgba(160,128,64,0.1)' : t.critical ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                  <td style={{ padding: '5px', color: c.accent.primary }}>{t.code}</td>
                  <td style={{ padding: '5px', color: c.text.primary, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</td>
                  <td style={{ padding: '5px', color: c.text.secondary }}>{t.duration}</td>
                  <td style={{ padding: '5px', color: c.text.secondary }}>{t.ES}</td>
                  <td style={{ padding: '5px', color: c.text.secondary }}>{t.EF}</td>
                  <td style={{ padding: '5px', color: t.TF <= 0 ? c.status.critical : t.TF <= 10 ? c.status.warning : c.text.secondary, fontWeight: t.TF <= 0 ? 700 : 400 }}>{t.TF}</td>
                  <td style={{ padding: '5px', color: c.text.secondary }}>{t.FF}</td>
                  <td style={{ padding: '5px' }}>{f && <span style={{ color: f.color, fontWeight: 700 }}>{f.score}</span>}</td>
                  <td style={{ padding: '5px', color: t.critical ? c.status.critical : c.text.muted }}>{t.critical ? 'YES' : '—'}</td>
                  <td style={{ padding: '5px', color: c.text.muted, fontSize: 9 }}>{t.drivingPredType || '—'}</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
          {selAct && cpm.tasks.get(selAct) && (() => { const t = cpm.tasks.get(selAct); const o = parsed?.tasks.get(selAct); const f = fci?.fciMap.get(selAct); const chain = cpm.getDrivingChain(selAct);
            return (<Card title={`DETAIL — ${t.code}`} style={{ marginTop: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div><div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>GENERAL</div>
                  {[['Name', t.name], ['Status', o?.status || '—'], ['Duration', t.duration + 'd'], ['Constraint', o?.constraintType || 'None']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 9, color: c.text.muted }}>{k}</span><span style={{ fontSize: 9, color: c.text.primary }}>{v}</span></div>))}
                </div>
                <div><div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>CPM</div>
                  {[['ES', t.ES], ['EF', t.EF], ['LS', t.LS], ['LF', t.LF], ['TF', t.TF], ['FF', t.FF]].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><span style={{ fontSize: 9, color: c.text.muted }}>{k}</span><span style={{ fontSize: 9, color: (k === 'TF' || k === 'FF') && v <= 0 ? c.status.critical : c.text.primary }}>{v}</span></div>))}
                </div>
                <div><div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>FCI</div>
                  {f ? (<><div style={{ fontSize: 28, color: f.color, fontWeight: 700 }}>{f.score}<span style={{ fontSize: 12, color: c.text.muted }}>/100</span></div>
                    <div style={{ fontSize: 9, color: f.color, marginBottom: 6 }}>{f.grade}</div>
                    {f.penalties.map((p, i) => <div key={i} style={{ fontSize: 9, color: c.text.secondary, marginBottom: 2 }}>−{p.penalty}: {p.rule}{p.detail ? ` (${p.detail})` : ''}</div>)}
                  </>) : <span style={{ fontSize: 10, color: c.text.muted }}>—</span>}
                </div>
              </div>
              {chain.length > 1 && (<div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>DRIVING CHAIN ({chain.length} steps)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                  {chain.map((s, i) => (<Fragment key={s.id}>
                    <div style={{ padding: '4px 8px', background: s.TF <= 0 ? 'rgba(239,68,68,0.12)' : c.bg.secondary, border: '1px solid ' + c.border.default, fontSize: 9 }}>
                      <span style={{ color: c.accent.primary }}>{s.code}</span><span style={{ color: c.text.muted, marginLeft: 4 }}>TF:{s.TF}</span>
                    </div>
                    {i < chain.length - 1 && <span style={{ color: c.text.muted, fontSize: 10 }}>→</span>}
                  </Fragment>))}
                </div>
              </div>)}
            </Card>);
          })()}
        </>)}
      </div>)}

      {/* ===== FCI ===== */}
      {toolsTab === 'fci' && (<div>
        {!fci ? <Card><p style={{ fontSize: 11, color: c.text.muted }}>Upload and analyse an XER to compute Float Credibility Index.</p></Card> : (<>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
            <Kpi label="AVERAGE FCI" value={fci.summary.average} color={fci.summary.average >= 70 ? c.status.active : fci.summary.average >= 40 ? c.status.warning : c.status.critical} />
            <Kpi label="HIGH (80+)" value={fci.summary.highCount} color={c.status.active} />
            <Kpi label="MEDIUM (40-80)" value={fci.summary.medCount} color={c.status.warning} />
            <Kpi label="LOW (< 40)" value={fci.summary.lowCount} color={c.status.critical} />
            <Kpi label="UNRELIABLE %" value={`${fci.summary.unreliablePct}%`} color={c.status.critical} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <Card title="FCI DISTRIBUTION">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={fciChartData}><CartesianGrid strokeDasharray="3 3" stroke={c.border.default} />
                  <XAxis dataKey="range" tick={{ fontSize: 9, fill: c.text.muted }} /><YAxis tick={{ fontSize: 9, fill: c.text.muted }} />
                  <Tooltip content={<Tip />} /><Bar dataKey="count" name="Activities" fill={c.accent.primary} radius={[3, 3, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </Card>
            <Card title="WHAT THIS MEANS">
              <p style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.6, margin: 0 }}>
                Float Credibility Index (FCI) scores how trustworthy each activity's total float is.
                Float can be artificially created by hard constraints, excessive lags, open ends (missing logic),
                or calendar manipulation. A low FCI means the float may be "fake" — the schedule appears to have
                buffer, but it's unreliable.
              </p>
              <div style={{ marginTop: 10, padding: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span style={{ fontSize: 10, color: c.status.critical, fontWeight: 700 }}>{fci.summary.unreliablePct}% of schedule float is potentially unreliable.</span>
              </div>
            </Card>
          </div>
          <Card title="LOWEST FCI ACTIVITIES (most suspicious float)">
            <div style={{ display: 'grid', gap: 6 }}>
              {Array.from(fci.fciMap.entries()).sort((a, b) => a[1].score - b[1].score).slice(0, 15).map(([id, f]) => {
                const t = cpm?.tasks.get(id);
                return (<div key={id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 60px 1fr', gap: 8, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: f.color, fontWeight: 700 }}>{f.score}</span>
                  <div><span style={{ fontSize: 10, color: c.accent.primary }}>{t?.code || id}</span><span style={{ fontSize: 9, color: c.text.secondary, marginLeft: 8 }}>{t?.name || ''}</span></div>
                  <span style={{ fontSize: 9, color: c.text.muted }}>TF: {t?.TF ?? '—'}</span>
                  <div style={{ fontSize: 8, color: c.text.muted }}>{f.penalties.map(p => p.rule).join(' • ')}</div>
                </div>);
              })}
            </div>
          </Card>
        </>)}
      </div>)}

      {/* ===== DCMA ===== */}
      {toolsTab === 'dcma' && (<div>
        {!dcma ? <Card><p style={{ fontSize: 11, color: c.text.muted }}>Upload and analyse an XER to run the real DCMA 14-point check.</p></Card> : (<>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 56, color: dcma.score >= 85 ? c.status.active : dcma.score >= 70 ? c.status.warning : c.status.critical, fontWeight: 700 }}>{dcma.score}</span>
            <span style={{ fontSize: 16, color: c.text.muted }}>/100</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: c.text.secondary }}>Compliance: <span style={{ color: dcma.compliance === 'COMPLIANT' ? c.status.active : dcma.compliance === 'MARGINAL' ? c.status.warning : c.status.critical, fontWeight: 700 }}>{dcma.compliance}</span></span>
            <span style={{ marginLeft: 'auto', fontSize: 10, color: c.text.muted }}>{dcma.summary.passed} pass • {dcma.summary.warnings} warn • {dcma.summary.failed} fail</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {dcma.results.map(r => {
              const col = r.status === 'PASS' ? c.status.active : r.status === 'WARNING' ? c.status.warning : r.status === 'FAIL' ? c.status.critical : c.text.muted;
              return (<div key={r.id} style={{ padding: 12, background: c.bg.secondary, borderLeft: '3px solid ' + col, border: '1px solid ' + c.border.default }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: c.text.primary }}>{r.id}. {r.name}</span>
                  <Badge status={r.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 9, color: c.text.muted }}>Threshold: {r.threshold}</span>
                  <span style={{ fontSize: 9, color: col, fontWeight: 700 }}>Actual: {r.value}</span>
                </div>
                <div style={{ fontSize: 8, color: c.text.muted, marginTop: 4 }}>{r.detail}</div>
              </div>);
            })}
          </div>
        </>)}
      </div>)}

      {/* ===== EXPLAIN PUSH ===== */}
      {toolsTab === 'explain' && (<div>
        {!explains ? (<Card>
          <p style={{ fontSize: 11, color: c.text.muted }}>Upload Baseline + Current XER and run comparison to see push explanations.</p>
          <p style={{ fontSize: 10, color: c.text.secondary, marginTop: 8 }}>The engine traces driving predecessor chains between versions and identifies what caused each activity to slip.</p>
        </Card>) : (<>
          {parsedBase && parsedCur && baseCpm && curCpm && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={explainActId} onChange={e => setExplainActId(e.target.value)} placeholder="Enter Activity ID to explain..." style={{ flex: 1, padding: 8, background: c.bg.secondary, border: '1px solid ' + c.border.default, color: c.text.primary, fontSize: 10, fontFamily: 'monospace' }} />
              <button onClick={runSingleExplain} style={{ padding: '8px 14px', background: c.accent.primary, border: 'none', cursor: 'pointer' }}><span style={{ fontSize: 10, color: '#030303' }}>EXPLAIN</span></button>
            </div>
          )}
          <div style={{ display: 'grid', gap: 10 }}>
            {explains.map((ex, idx) => { const e = ex.explanation; if (!e || e.error) return null;
              return (<Card key={idx} title={`${e.actCode || ex.id} — ${e.actName || ex.name}`}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  <Kpi label="FINISH MOVE" value={`${e.finishMove > 0 ? '+' : ''}${e.finishMove ?? 0}d`} color={e.finishMove > 0 ? c.status.critical : c.status.active} />
                  <Kpi label="START MOVE" value={`${e.startMove > 0 ? '+' : ''}${e.startMove ?? 0}d`} />
                  <Kpi label="PRIMARY CAUSE" value={e.primaryCategory || '—'} />
                  <Kpi label="CONFIDENCE" value={`${e.confidence}%`} color={e.confidence >= 70 ? c.status.active : c.status.warning} />
                </div>
                <div style={{ padding: 10, background: 'rgba(160,128,64,0.08)', border: '1px solid ' + c.accent.dim, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, color: c.text.primary, lineHeight: 1.6 }}>{e.narrative}</span>
                </div>
                {e.changeEvidence?.length > 0 && (<div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>CHANGE EVIDENCE ({e.changeEvidence.length})</div>
                  {e.changeEvidence.slice(0, 8).map((ev, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: 6, borderBottom: '1px solid ' + c.border.default, fontSize: 9 }}>
                      <span style={{ color: c.accent.primary, minWidth: 60 }}>{ev.code || ev.actId}</span>
                      <Badge status={ev.category} />
                      <span style={{ color: c.text.secondary }}>{ev.detail}</span>
                    </div>))}
                </div>)}
                {e.drivingChain?.length > 1 && (<div>
                  <div style={{ fontSize: 9, color: c.text.muted, marginBottom: 6 }}>CURRENT DRIVING CHAIN</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                    {e.drivingChain.slice(0, 12).map((s, i) => (<Fragment key={s.id}>
                      <div style={{ padding: '3px 6px', background: s.TF <= 0 ? 'rgba(239,68,68,0.1)' : c.bg.secondary, border: '1px solid ' + c.border.default, fontSize: 8 }}>
                        <span style={{ color: c.accent.primary }}>{s.code}</span>
                      </div>
                      {i < Math.min(11, e.drivingChain.length - 1) && <span style={{ color: c.text.muted, fontSize: 9 }}>→</span>}
                    </Fragment>))}
                  </div>
                </div>)}
                {e.chainComparison?.chainChanged && (<div style={{ marginTop: 8, padding: 8, background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', fontSize: 9, color: c.status.warning }}>{e.chainComparison.summary}</div>)}
              </Card>);
            })}
          </div>
        </>)}
      </div>)}

      {/* ===== COMPARE ===== */}
      {toolsTab === 'compare' && (<div>
        {!realComp ? <Card><p style={{ fontSize: 11, color: c.text.muted }}>Upload Baseline + Current XER and run comparison.</p></Card> : (<>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
            <Kpi label="ADDED" value={realComp.kpis.added} />
            <Kpi label="REMOVED" value={realComp.kpis.removed} />
            <Kpi label="MOVED" value={realComp.kpis.moved} />
            <Kpi label="CP OVERLAP" value={`${realComp.kpis.cpOverlap}%`} color={realComp.kpis.cpOverlap > 70 ? c.status.active : c.status.warning} />
          </div>
          <Card title="SUMMARY"><p style={{ fontSize: 10, color: c.text.secondary }}>{realComp.summary}</p></Card>
          <Card title="TOP MOVEMENTS" style={{ marginTop: 10 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10, fontFamily: 'monospace' }}>
                <thead><tr style={{ borderBottom: '1px solid ' + c.border.default }}>
                  {['ID', 'Name', 'ΔStart', 'ΔFinish', 'ΔFloat'].map(h => <th key={h} style={{ padding: '6px', textAlign: 'left', color: c.text.muted, fontSize: 8 }}>{h}</th>)}
                </tr></thead>
                <tbody>{realComp.keyMovements.slice(0, 20).map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid ' + c.border.default }}>
                    <td style={{ padding: '5px', color: c.accent.primary }}>{m.code || m.id}</td>
                    <td style={{ padding: '5px', color: c.text.primary, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</td>
                    <td style={{ padding: '5px', color: m.startMove > 0 ? c.status.critical : m.startMove < 0 ? c.status.active : c.text.secondary }}>{m.startMove > 0 ? '+' : ''}{m.startMove}d</td>
                    <td style={{ padding: '5px', color: m.finishMove > 0 ? c.status.critical : m.finishMove < 0 ? c.status.active : c.text.secondary, fontWeight: 700 }}>{m.finishMove > 0 ? '+' : ''}{m.finishMove}d</td>
                    <td style={{ padding: '5px', color: c.text.secondary }}>{m.floatMove != null ? m.floatMove + 'd' : '—'}</td>
                  </tr>))}</tbody>
              </table>
            </div>
          </Card>
        </>)}
      </div>)}

      {/* ===== WIZARD ===== */}
      {toolsTab === 'wizard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Card title="WHAT EVIDENCE DO YOU HAVE?">
            {[['baseline', 'Approved Baseline programme'], ['updates', 'Periodic updates (weekly/monthly)'], ['asBuilt', 'As-built programme / progress record'],
              ['notices', 'Notices / EWs / correspondence'], ['diaries', 'Site diaries, logs, photos'], ['qra', 'Risk register / QSRA inputs']
            ].map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                <input type="checkbox" checked={wizard[k]} onChange={() => setWizard({ ...wizard, [k]: !wizard[k] })} />
                <span style={{ fontSize: 10, color: c.text.secondary }}>{label}</span>
              </label>))}
          </Card>
          <Card title="RECOMMENDED APPROACH">
            <div style={{ padding: 12, background: c.bg.secondary, border: '1px solid ' + c.border.default }}>
              <div style={{ fontSize: 12, color: c.text.primary, marginBottom: 8, fontWeight: 700 }}>{methodRec.method}</div>
              <div style={{ fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>{methodRec.why}</div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
