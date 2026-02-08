import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../app/context';
import { c as theme } from '../../lib/theme';
import { generateAnalytics, generateRiskRegister, generateComparison, generateActionPlan, generateExecutiveReport } from '../../lib/analysis';

const SYSTEM_PROMPT = `You are **Aniket's Planning Assistant** — a senior Planning Lead + forensic scheduling advisor embedded in a Planning Intelligence product.

Non‑negotiable rules:
- Never invent schedule facts.
- If schedule data exists, cite evidence (activity IDs / WBS / dates / KPIs).
- Separate clearly: Answer / Evidence / Assumptions.
- If data is missing, say so and propose the minimum next step to raise confidence.
- Prefer defensible language over confident language.

You help users navigate the site AND interpret extracted analytics/comparison outputs.`;

function nowISO() { return new Date().toISOString(); }

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

function buildExecutiveHtml({ title, execReport, analysis, comparison, riskRegister, actionPlan }) {
  const esc = (s) => String(s || '').replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  const lines = (arr) => (arr || []).map((x) => `<li>${esc(x)}</li>`).join('');

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <style>
    body{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; background:#0A0E0B; color:#E6F3EA; padding:24px;}
    h1,h2{margin:0 0 10px 0;}
    .card{border:1px solid rgba(200,230,210,0.18); background:rgba(20,26,22,0.7); border-radius:14px; padding:16px; margin:14px 0;}
    .meta{color:rgba(230,243,234,0.7); font-size:12px;}
    .grid{display:grid; grid-template-columns: 1fr 1fr; gap:12px;}
    @media(max-width:900px){.grid{grid-template-columns:1fr;}}
    table{width:100%; border-collapse:collapse; font-size:12px;}
    td{padding:8px; border-bottom:1px solid rgba(200,230,210,0.14); vertical-align:top;}
    .pill{display:inline-block; padding:4px 10px; border-radius:999px; border:1px solid rgba(200,230,210,0.18); font-size:12px;}
  </style>
</head>
<body>
  <h1>${esc(title)}</h1>
  <div class="meta">Generated: ${esc(execReport?.meta?.generatedAt)} • Confidence: <span class="pill">${esc(execReport?.meta?.confidence)}</span> • RAG: <span class="pill">${esc(execReport?.meta?.rag)}</span></div>

  <div class="card">
    <h2>Executive Summary</h2>
    <ul>${lines(execReport?.exec?.summary)}</ul>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Top Issues</h2>
      <ul>${lines(execReport?.exec?.topIssues)}</ul>
    </div>
    <div class="card">
      <h2>Next Best Actions</h2>
      <table>
        ${(actionPlan?.items || []).slice(0,5).map((a) => `<tr><td><b>${esc(a.title)}</b><div class=meta>Owner: ${esc(a.owner)} • Effort: ${esc(a.effort)} • Impact: ${esc(a.impact)}</div><div>${esc(a.why)}</div></td></tr>`).join('')}
      </table>
    </div>
  </div>

  <div class="card">
    <h2>Key KPIs</h2>
    <table>
      <tr><td>Data Date</td><td>${esc(analysis?.dataDate || comparison?.meta?.dataDate || '')}</td></tr>
      <tr><td>Contract Finish</td><td>${esc(analysis?.kpis?.finish || '')}</td></tr>
      <tr><td>Forecast Finish</td><td>${esc(analysis?.kpis?.forecastFinish || '')}</td></tr>
      <tr><td>Variance (days)</td><td>${esc(analysis?.kpis?.varianceDays)}</td></tr>
      <tr><td>CP Overlap</td><td>${esc(comparison?.kpis?.cpOverlap)}%</td></tr>
      <tr><td>Open Ends</td><td>${esc(comparison?.kpis?.openEnds)}</td></tr>
      <tr><td>Constraints</td><td>${esc(comparison?.kpis?.constraints)}</td></tr>
    </table>
  </div>

  <div class="card">
    <h2>Top Risks</h2>
    <table>
      ${(riskRegister || []).slice(0,6).map((r) => `<tr><td><b>${esc(r.id)} – ${esc(r.title)}</b><div class=meta>RAG: ${esc(r.rag)} • P: ${esc(r.probability)} • I: ${esc(r.impact)} • Owner: ${esc(r.owner)} • Due: ${esc(r.due)}</div><div>${esc(r.action)}</div></td></tr>`).join('')}
    </table>
  </div>

  <div class="card">
    <h2>Assumptions</h2>
    <ul>${lines(execReport?.assumptions)}</ul>
  </div>
</body>
</html>`;
}

export default function AIAgent() {
  const {
    mode,
    analysis, setAnalysis,
    comparison, setComparison,
    riskRegister, setRiskRegister,
    actionPlan, setActionPlan,
    playbook,
    demoMode,
    dataDate,
    uploadedFile, setUploadedFile,
    baselineFile, setBaselineFile,
    currentFile, setCurrentFile,
    setSection,
    setToolsTab
  } = useApp();
  const c = theme;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  // Audience controls: make the assistant feel "director-ready".
  const [audience, setAudience] = useState('planner'); // director | planner | claims
  const [citeEvidence, setCiteEvidence] = useState(true);
  const [msgs, setMsgs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pi_agent_msgs') || '[]'); } catch { return []; }
  });

  const endRef = useRef(null);

  useEffect(() => {
    try { localStorage.setItem('pi_agent_msgs', JSON.stringify(msgs.slice(-40))); } catch {}
  }, [msgs]);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [open, msgs]);

  // Allow global UI (e.g., Ctrl+K palette) to open/toggle the assistant.
  useEffect(() => {
    const onToggle = () => setOpen((v) => !v);
    const onOpen = () => setOpen(true);
    window.addEventListener('pi:toggle-assistant', onToggle);
    window.addEventListener('pi:open-assistant', onOpen);
    return () => {
      window.removeEventListener('pi:toggle-assistant', onToggle);
      window.removeEventListener('pi:open-assistant', onOpen);
    };
  }, []);

  const canSend = input.trim().length > 0 && !busy;

  const canRunCompare = !!baselineFile && !!currentFile;

  function generateAndDownloadExecReport() {
    // Ensure analysis/compare exist (demo-safe; does not upload schedule contents)
    const a = analysis || (uploadedFile ? generateAnalytics({ file: uploadedFile, dataDate }) : null);
    const r = riskRegister?.length ? riskRegister : (uploadedFile ? generateRiskRegister({ file: uploadedFile, dataDate }) : []);
    const comp = comparison || (canRunCompare ? generateComparison({ fileA: baselineFile, fileB: currentFile, dataDate }) : null);
    if (a && !analysis) setAnalysis(a);
    if (r && !riskRegister?.length) setRiskRegister(r);
    if (comp && !comparison) setComparison(comp);

    const plan = generateActionPlan({ analysis: a, comparison: comp, riskRegister: r });
    setActionPlan(plan);
    const rep = generateExecutiveReport({ analysis: a, comparison: comp, riskRegister: r, actionPlan: plan });

    const html = buildExecutiveHtml({
      title: 'Planning Intelligence — Executive Report',
      execReport: rep,
      analysis: a,
      comparison: comp,
      riskRegister: r,
      actionPlan: plan
    });
    downloadTextFile('Planning_Intelligence_Executive_Report.html', html);
    return rep;
  }

  function runLocalAnalytics() {
    const a = generateAnalytics({ file: uploadedFile, dataDate });
    const rr = generateRiskRegister({ file: uploadedFile, dataDate });
    setAnalysis(a);
    setRiskRegister(rr);
    // learning history (local-only)
    try {
      const hist = JSON.parse(localStorage.getItem('pi_learning_history') || '[]');
      const nextHist = [...hist, { at: new Date().toISOString(), analysis: a }].slice(-20);
      localStorage.setItem('pi_learning_history', JSON.stringify(nextHist));
    } catch {}
    setSection('analytics');
    return { a, rr };
  }

  function runLocalCompare() {
    const comp = generateComparison({ fileA: baselineFile, fileB: currentFile, dataDate });
    setComparison(comp);
    try {
      const hist = JSON.parse(localStorage.getItem('pi_learning_history') || '[]');
      const nextHist = [...hist, { at: new Date().toISOString(), comparison: comp }].slice(-20);
      localStorage.setItem('pi_learning_history', JSON.stringify(nextHist));
    } catch {}
    setToolsTab('compare');
    setSection('tools');
    return comp;
  }

  const quick = useMemo(() => ([
    'What changed since the last update, and why does it matter?',
    'Top 10 schedule quality issues (DCMA-style)',
    'What is pushing Energisation / RFS? Cite activity IDs.',
    'Is this schedule credible to brief a Director? Give a confidence score.',
    'Generate a Next Best Action plan with owners + effort',
    'Challenge this analysis (what would an auditor/claims consultant say?)'
  ]), []);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    // If the user is asking for analytics/report and they already uploaded files,
    // run local generators first so the assistant has grounded context.
    const wantsReport = /\b(report|exec|executive|pdf|download)\b/i.test(text);
    const wantsCompare = /\b(compare|comparison|baseline|previous|two\s*xer|2\s*xer)\b/i.test(text);
    const wantsAnalytics = /\b(analytics|kpi|dcma|qsra|risk register)\b/i.test(text);
    if (wantsAnalytics && uploadedFile && !analysis?.kpis) runLocalAnalytics();
    if (wantsCompare && baselineFile && currentFile && !comparison?.meta) runLocalCompare();
    if (wantsReport && (uploadedFile || (baselineFile && currentFile))) {
      try { generateAndDownloadExecReport(); } catch {}
    }

    setInput('');
    const next = [...msgs, { role: 'user', content: text, ts: nowISO() }];
    setMsgs(next);
    setBusy(true);

    // Grounded context (client-side): pass extracted metrics only.
    const context = {
      mode,
      analytics: analysis?.kpis ? analysis : null,
      comparison: comparison || null,
      playbook: playbook || null
    };

    const payload = {
      system: SYSTEM_PROMPT,
      context,
      meta: {
        audience,
        citeEvidence,
        uiMode: mode,
        ts: nowISO(),
      },
      messages: next.slice(-14).map(({ role, content }) => ({ role, content })),
    };

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!r.ok) throw new Error('API not available');
      const data = await r.json();
      const answer = (data && (data.output || data.text || data.message)) || 'Sorry — no response.';
      setMsgs((m) => [...m, { role: 'assistant', content: answer, ts: nowISO() }]);
    } catch (e) {
      // Local fallback (no external API key required)
      const fallback = `I’m running in offline demo mode (no AI API key configured).

What I *can* do locally:
• Explain your analytics KPIs and risk register
• Explain XER vs XER comparison outputs
• Suggest next-best actions based on the generated evidence

To enable live AI answers:
• Set OPENAI_API_KEY in your hosting environment
• Deploy the /api/chat function

Tip: Use Tools → Compare to generate a defensible “what changed” narrative.`;
      setMsgs((m) => [...m, { role: 'assistant', content: fallback, ts: nowISO() }]);
    } finally {
      setBusy(false);
    }
  };

  const bubble = (m, i) => {
    const isUser = m.role === 'user';
    return (
      <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          maxWidth: '85%',
          background: isUser ? c.accent : c.bg.secondary,
          color: isUser ? '#06110A' : c.text.primary,
          border: isUser ? `1px solid ${c.accent}` : `1px solid ${c.border.default}`,
          padding: '10px 12px',
          borderRadius: 14,
          whiteSpace: 'pre-wrap',
          lineHeight: 1.35,
          fontSize: 14,
        }}>
          {m.content}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes piPulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(160,128,64,.35);} 70% { transform: scale(1.03); box-shadow: 0 0 0 18px rgba(160,128,64,0);} 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(160,128,64,0);} }
        .pi-pa-btn{ animation: piPulse 2.4s ease-in-out infinite; }
      `}</style>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          right: 18,
          bottom: 18,
          zIndex: 60,
          borderRadius: 999,
          padding: '12px 14px',
          background: c.accent,
          border: `1px solid ${c.accent}`,
          color: '#06110A',
          fontWeight: 800,
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          cursor: 'pointer',
        }}
        className="pi-pa-btn"
        aria-label="Open assistant"
        title="Assistant"
      >
        {open ? '×' : 'PA'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed',
          right: 18,
          bottom: 70,
          width: 360,
          maxWidth: '92vw',
          height: 520,
          maxHeight: '70vh',
          zIndex: 60,
          background: c.bg.card,
          border: `1px solid ${c.border.default}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
        }}>
          <div style={{
            padding: 12,
            borderBottom: `1px solid ${c.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10
          }}>
            <div style={{ fontWeight: 900 }}>Aniket's Planning Assistant</div>
            <button
              onClick={() => { setMsgs([]); try { localStorage.removeItem('pi_agent_msgs'); } catch {} }}
              style={{ background: 'transparent', border: `1px solid ${c.border.default}`, color: c.text.primary, borderRadius: 10, padding: '6px 10px', cursor: 'pointer' }}
              title="Clear chat"
            >
              Clear
            </button>
          </div>

          {/* Controls */}
          <div style={{ padding: 10, borderBottom: `1px solid ${c.border.default}`, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <label style={{ fontSize: 11, color: c.text.muted }}>Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              style={{ background: c.bg.secondary, color: c.text.primary, border: `1px solid ${c.border.default}`, borderRadius: 10, padding: '6px 8px', fontSize: 12 }}
            >
              <option value="director">Director</option>
              <option value="planner">Planner</option>
              <option value="claims">Claims</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 8, fontSize: 11, color: c.text.muted }}>
              <input type="checkbox" checked={citeEvidence} onChange={(e) => setCiteEvidence(e.target.checked)} />
              Cite evidence
            </label>
            <button
              onClick={() => { if (!busy) setInput('Challenge this analysis: list top objections, weak points, and what evidence is required to strengthen the report.'); }}
              style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${c.border.default}`, color: c.text.muted, borderRadius: 10, padding: '6px 10px', cursor: 'pointer', fontSize: 11 }}
              title="Challenge mode"
            >
              Challenge
            </button>
          </div>

          {/* File intake (client-side only) */}
          <div style={{ padding: 10, borderBottom: `1px solid ${c.border.default}`, display: 'grid', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <label style={{ fontSize: 10, color: c.text.muted }}>
                Schedule (single)
                <input type="file" accept=".xer,.xml,.xlsx" style={{ width: '100%', marginTop: 6 }} onChange={(e) => setUploadedFile(e.target.files?.[0] || null)} />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <label style={{ fontSize: 10, color: c.text.muted }}>
                  Baseline
                  <input type="file" accept=".xer,.xml,.xlsx" style={{ width: '100%', marginTop: 6 }} onChange={(e) => setBaselineFile(e.target.files?.[0] || null)} />
                </label>
                <label style={{ fontSize: 10, color: c.text.muted }}>
                  Current
                  <input type="file" accept=".xer,.xml,.xlsx" style={{ width: '100%', marginTop: 6 }} onChange={(e) => setCurrentFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => { if (uploadedFile || demoMode) runLocalAnalytics(); }}
                style={{ padding: '8px 10px', borderRadius: 10, border: `1px solid ${c.border.default}`, background: 'transparent', color: (uploadedFile || demoMode) ? c.text.primary : c.text.muted, cursor: (uploadedFile || demoMode) ? 'pointer' : 'not-allowed', fontSize: 11 }}
                disabled={!(uploadedFile || demoMode)}
                title="Generate analytics KPIs locally">
                Run analytics
              </button>
              <button onClick={() => { if (baselineFile && currentFile) runLocalCompare(); }}
                style={{ padding: '8px 10px', borderRadius: 10, border: `1px solid ${c.border.default}`, background: 'transparent', color: (baselineFile && currentFile) ? c.text.primary : c.text.muted, cursor: (baselineFile && currentFile) ? 'pointer' : 'not-allowed', fontSize: 11 }}
                disabled={!(baselineFile && currentFile)}
                title="Generate XER vs XER comparison locally">
                Compare 2 XERs
              </button>
              <button onClick={() => { try { generateAndDownloadExecReport(); } catch {} }}
                style={{ padding: '8px 10px', borderRadius: 10, border: `1px solid ${c.border.default}`, background: c.accent, color: '#06110A', cursor: (uploadedFile || canRunCompare || demoMode) ? 'pointer' : 'not-allowed', fontSize: 11, fontWeight: 900, opacity: (uploadedFile || canRunCompare || demoMode) ? 1 : 0.5 }}
                disabled={!(uploadedFile || canRunCompare || demoMode)}
                title="Generate an executive report HTML and download">
                Download exec report
              </button>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: c.text.muted, alignSelf: 'center' }}>
                {demoMode ? 'Demo-safe • client-side' : 'Upload mode • client-side'}
              </div>
            </div>
          </div>

          <div style={{ padding: 12, overflow: 'auto', display: 'grid', gap: 10 }}>
            {msgs.length === 0 ? (
              <div style={{ color: c.text.muted, lineHeight: 1.4 }}>
                Ask me anything about:
                {'\n'}• XER analytics and reports
                {'\n'}• DCMA checks and schedule hygiene
                {'\n'}• QSRA / risk register structure
                {'\n'}• Website navigation and features
                {'\n'}
                {'\n'}Quick prompts:
                {'\n'}{quick.map((q, i) => `  ${i + 1}. ${q}`).join('\n')}
              </div>
            ) : msgs.map(bubble)}
            <div ref={endRef} />
          </div>

          <div style={{ padding: 12, borderTop: `1px solid ${c.border.default}`, display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder={busy ? 'Thinking…' : 'Type a message…'}
              style={{
                flex: 1,
                background: c.bg.secondary,
                color: c.text.primary,
                border: `1px solid ${c.border.default}`,
                borderRadius: 12,
                padding: '10px 12px',
                outline: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={!canSend}
              style={{
                background: canSend ? c.accent : c.bg.secondary,
                color: canSend ? '#06110A' : c.text.muted,
                border: `1px solid ${canSend ? c.accent : c.border.default}`,
                borderRadius: 12,
                padding: '10px 12px',
                fontWeight: 900,
                cursor: canSend ? 'pointer' : 'not-allowed',
              }}
            >
              Send
            </button>
          </div>

          {/* Quick actions */}
          <div style={{ padding: 10, borderTop: `1px solid ${c.border.default}`, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {quick.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => { if (!busy) { setInput(q); } }}
                style={{
                  background: 'transparent',
                  border: `1px solid ${c.border.default}`,
                  color: c.text.muted,
                  borderRadius: 999,
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontSize: 11
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
