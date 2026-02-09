import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Sparkles, FileText, GitCompare, Download, ShieldCheck, Bot } from 'lucide-react';
import { c } from '../../lib/theme';
import { useApp } from '../../app/context';
import {
  generateAnalytics,
  generateComparison,
  generateRiskRegister,
  generateActionPlan,
  generateExecutiveReport,
  generatePlaybook,
} from '../../lib/analysis';
import { demoSystemData } from '../../data/demo';

// Heavy schedule processing is offloaded to a web worker (prevents UI freezing on large XERs)

// Full-page “Aniket's Planning Assistant” workspace.
// Keeps the floating button clean and moves power features here.

function nowISO() {
  return new Date().toISOString();
}

function guessIntent(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('compare') || t.includes('diff') || t.includes('baseline') || t.includes('xer vs')) return 'compare';
  if (t.includes('report') || t.includes('exec') || t.includes('pdf')) return 'report';
  if (t.includes('analytics') || t.includes('dcma') || t.includes('health') || t.includes('kpi')) return 'analytics';
  if (t.includes('risk')) return 'risk';
  if (t.includes('action') || t.includes('what should i do') || t.includes('next')) return 'action';
  return 'chat';
}

export default function AssistantSection() {
  const {
    demoMode,
    privacyMode,
    uploadedFile,
    setUploadedFile,
    baselineFile,
    setBaselineFile,
    currentFile,
    setCurrentFile,
    analysis,
    setAnalysis,
    comparison,
    setComparison,
    riskRegister,
    setRiskRegister,
    playbook,
    setPlaybook,
    actionPlan,
    setActionPlan,
  } = useApp();

  const [audience, setAudience] = useState('director');
  const [citeEvidence, setCiteEvidence] = useState(true);
  const [busy, setBusy] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // checking | online | offline
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState([]); // files attached to the next message
  const [msgs, setMsgs] = useState(() => {
    try {
      const raw = localStorage.getItem('pi_assistant_msgs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const workerRef = useRef(null);

  const getWorker = () => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker(new URL('../../workers/scheduleWorker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;
    return w;
  };

  const callWorker = (kind, payload) => new Promise((resolve, reject) => {
    const w = getWorker();
    const jobId = Math.random().toString(16).slice(2);
    const onMsg = (evt) => {
      const d = evt.data;
      if (!d || d.jobId !== jobId) return;
      w.removeEventListener('message', onMsg);
      if (d.ok) resolve(d); else reject(new Error(d.error || 'Worker error'));
    };
    w.addEventListener('message', onMsg);
    w.postMessage({ jobId, kind, ...payload });
  });

  useEffect(() => () => {
    if (workerRef.current) {
      try { workerRef.current.terminate(); } catch {}
      workerRef.current = null;
    }
  }, []);

  const endRef = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem('pi_assistant_msgs', JSON.stringify(msgs.slice(-80)));
    } catch {}
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  // Lightweight health check (won't leak keys; OPTIONS is handled by our function)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/chat', { method: 'OPTIONS' });
        if (!alive) return;
        setApiStatus(r.ok ? 'online' : 'offline');
      } catch {
        if (!alive) return;
        setApiStatus('offline');
      }
    })();
    return () => { alive = false; };
  }, []);

  const quick = useMemo(
    () => [
      'Top 10 schedule quality issues (DCMA-style). Cite activity IDs if possible.',
      'What changed since the last update, and why does it matter?',
      'What is pushing Energisation / RFS? Cite the key driving chain.',
      'Generate an executive summary for a Director (RAG + top risks + recommended actions).',
    ],
    []
  );

  const contextPack = useMemo(() => {
    // Keep grounding compact.
    return {
      demoMode,
      privacyMode,
      audience,
      hasSingle: Boolean(uploadedFile),
      hasCompare: Boolean(baselineFile && currentFile),
      analysis: analysis ? {
        kpis: analysis.kpis,
        highlights: analysis.highlights,
        evidence: analysis.evidence,
        project: analysis.project,
      } : null,
      comparison: comparison ? { summary: comparison.summary, keyMovements: comparison.keyMovements?.slice?.(0, 30) } : null,
      risks: (riskRegister || []).slice(0, 25),
      playbook: playbook ? playbook.slice(0, 25) : null,
      operator: { name: demoSystemData?.operator?.name || 'Aniket Latpate' },
    };
  }, [demoMode, privacyMode, audience, uploadedFile, baselineFile, currentFile, analysis, comparison, riskRegister, playbook]);

  const setFilesFromChat = (files) => {
    if (!files || files.length === 0) return;
    if (files.length === 1) {
      setUploadedFile(files[0]);
      setBaselineFile(null);
      setCurrentFile(null);
      return;
    }
    if (files.length >= 2) {
      setBaselineFile(files[0]);
      setCurrentFile(files[1]);
      setUploadedFile(null);
    }
  };

  const runLocalAnalytics = async (overrideFile) => {
    try {
      const file = overrideFile || uploadedFile;
      if (!file && !demoMode) return null;

      // DEMO mode uses deterministic generators.
      if (demoMode) {
        const a = generateAnalytics({ file, dataDate: new Date().toISOString().slice(0, 10) });
        setAnalysis(a);
        const rr = generateRiskRegister({ file, dataDate: a?.dataDate || '' });
        setRiskRegister(rr);
        const ap = generateActionPlan({ analysis: a, comparison: null, riskRegister: rr });
        setActionPlan(ap);
        const pb = generatePlaybook(a, rr, ap, { demoMode: true });
        setPlaybook(pb);
        return { a, rr, ap, pb };
      }

      // LIVE: compute analytics via worker (prevents UI freezing on large XERs)
      setBusy(true);
      setErr('');
      const xerText = await file.text();
      const r = await callWorker('single', { xerText });
      const a = r.analytics;
      setAnalysis(a);

      // Generate a simple risk register from the computed KPIs (still client-side, fast).
      const rr = generateRiskRegister({ file, dataDate: new Date().toISOString().slice(0, 10) });
      setRiskRegister(rr);

      const ap = generateActionPlan({ analysis: a, comparison: null, riskRegister: rr });
      setActionPlan(ap);
      const pb = generatePlaybook(a, rr, ap, { demoMode: false });
      setPlaybook(pb);
      return { a, rr, ap, pb };
    } catch (e) {
      console.error(e);
      setErr(String(e?.message || e));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const runLocalCompare = async (overrideBase, overrideCur) => {
    try {
      const baseF = overrideBase || baselineFile;
      const curF = overrideCur || currentFile;

      if (demoMode) {
        const comp = generateComparison({ fileA: baseF, fileB: curF, dataDate: new Date().toISOString().slice(0, 10) });
        setComparison(comp);
        return comp;
      }

      if (!baseF || !curF) return null;
      setBusy(true);
      setErr('');
      const baselineText = await baseF.text();
      const currentText = await curF.text();
      const r = await callWorker('compare', { baselineText, currentText, topN: 15 });
      const comp = r.comparison;
      setComparison(comp);
      return comp;
    } catch (e) {
      console.error(e);
      setErr(String(e?.message || e));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const downloadExecReport = () => {
    const html = generateExecutiveReport({
      analysis,
      comparison,
      riskRegister,
      actionPlan,
      meta: { audience, citeEvidence, generatedAt: new Date().toISOString() },
    });

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Aniket_Planning_Assistant_Report_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const send = async () => {
    if (busy) return;
    const text = input.trim();
    if (!text && pendingFiles.length === 0) return;

    // Apply attached files to the workspace before deciding intent.
    // NOTE: React state updates are async, so we also keep local references
    // for immediate processing in this send() call.
    const singleFile = pendingFiles.length === 1 ? pendingFiles[0] : uploadedFile;
    const baseFile = pendingFiles.length >= 2 ? pendingFiles[0] : baselineFile;
    const curFile = pendingFiles.length >= 2 ? pendingFiles[1] : currentFile;
    if (pendingFiles.length) setFilesFromChat(pendingFiles);

    const intent = guessIntent(text);
    const userMsg = {
      role: 'user',
      content: `${text || (pendingFiles.length ? 'Uploaded schedule file(s).' : '')}`,
      ts: nowISO(),
    };

    setMsgs((m) => [...m, userMsg]);
    setInput('');
    setPendingFiles([]);

    // Auto-run local analytics/compare/report when user asks for it.
    let ran = false;
    try {
      setBusy(true);

      if (intent === 'analytics' && (singleFile || demoMode)) {
        const out = await runLocalAnalytics(singleFile);
        ran = true;
        setMsgs((m) => [...m, { role: 'assistant', ts: nowISO(), content: `✅ Analytics generated.

Key KPIs:
• Forecast finish: ${out?.a?.kpis?.forecastFinish || out?.a?.kpis?.forecast_finish || '—'}
• Total float (median): ${out?.a?.kpis?.floatMedian || '—'}
• Missing logic: ${out?.a?.kpis?.missingLogic || '—'}

Next: ask for a director summary or click “Download exec report”.` }]);
      }

      if (intent === 'compare' && (baseFile && curFile)) {
        const comp = await runLocalCompare(baseFile, curFile);
        ran = true;
        setMsgs((m) => [...m, { role: 'assistant', ts: nowISO(), content: `✅ Comparison generated.

Summary:
${comp?.summary || '—'}

Ask: “What changed & why it matters?” for the narrative.` }]);
      }

      if (intent === 'report') {
        // Ensure we have something to report on.
        if (!analysis && (singleFile || demoMode)) await runLocalAnalytics(singleFile);
        if (!comparison && (baseFile && curFile)) await runLocalCompare(baseFile, curFile);
        ran = true;
        downloadExecReport();
        setMsgs((m) => [...m, { role: 'assistant', ts: nowISO(), content: '✅ Executive report generated and downloaded (HTML). If you want a PDF, open the HTML and “Print → Save as PDF”.' }]);
      }

      if (ran) return;

      // Otherwise: ask live AI (if configured). If API fails, provide grounded offline guidance.
      const system = `You are Aniket's Planning Assistant.

Rules:
1) Be practical and evidence-led.
2) If you make assumptions, label them.
3) Use the provided CONTEXT_JSON for grounding; do not invent project facts.
4) Prefer bullet points.
5) When asked for planning advice, use data-center commissioning-first mindset.

Output format:
- Answer (bullets)
- Evidence (activity IDs / KPIs / sections) if available
- Assumptions (if any)
- Confidence (Low/Med/High)`;

      const payload = {
        system,
        messages: [{ role: 'user', content: text }],
        meta: { audience, citeEvidence },
        context: contextPack,
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
      } catch {
        const fallback = `I’m in offline demo mode (or API not reachable).

What you can still do right now:
• Upload 1 schedule → click “Run analytics” → then “Download exec report”.
• Upload 2 schedules → click “Compare 2 schedules” for deltas.

If you want live AI replies:
• Ensure /api/chat deploys (Vercel Functions)
• Set OPENAI_API_KEY in Vercel → Project → Settings → Environment Variables
• Redeploy

Evidence I currently have:
• Analytics: ${analysis ? 'Yes' : 'No'}
• Comparison: ${comparison ? 'Yes' : 'No'}
• Risks: ${(riskRegister || []).length}`;
        setMsgs((m) => [...m, { role: 'assistant', content: fallback, ts: nowISO() }]);
      }
    } finally {
      setBusy(false);
    }
  };

  const clear = () => {
    setMsgs([]);
    try { localStorage.removeItem('pi_assistant_msgs'); } catch {}
  };

  const canRunAnalytics = Boolean(uploadedFile || demoMode);
  const canRunCompare = Boolean(baselineFile && currentFile);

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: c.text.muted }}>ASSISTANT</div>
          <h2 style={{ margin: '6px 0 0', color: c.text.primary, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bot size={18} color={c.accent.primary} /> Aniket's Planning Assistant
          </h2>
          <div style={{ marginTop: 6, fontSize: 11, color: c.text.secondary, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: apiStatus === 'online' ? c.status.active : apiStatus === 'checking' ? c.text.muted : c.status.critical }} />
              API: {apiStatus === 'online' ? 'Ready' : apiStatus === 'checking' ? 'Checking…' : 'Offline'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} color={c.text.muted} /> Client-safe: {privacyMode ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            style={{ background: c.bg.secondary, color: c.text.primary, border: `1px solid ${c.border.default}`, borderRadius: 10, padding: '8px 10px', fontSize: 12 }}
          >
            <option value="director">Director</option>
            <option value="planner">Planner</option>
            <option value="claims">Claims</option>
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: c.text.muted, border: `1px solid ${c.border.default}`, padding: '8px 10px', borderRadius: 10, background: c.bg.secondary }}>
            <input type="checkbox" checked={citeEvidence} onChange={(e) => setCiteEvidence(e.target.checked)} />
            Cite evidence
          </label>
          <button
            onClick={clear}
            style={{ padding: '8px 10px', borderRadius: 10, background: 'transparent', border: `1px solid ${c.border.default}`, color: c.text.muted, cursor: 'pointer', fontSize: 11 }}
          >
            Clear
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 14, alignItems: 'start' }}>
        {/* Left: File workflows */}
        <div style={{ background: c.bg.card, border: `1px solid ${c.border.default}`, padding: 14 }}>
          <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={14} /> Upload schedules
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ fontSize: 10, color: c.text.muted }}>
              Single schedule (for analytics)
              <input
                type="file"
                accept=".xer,.xml,.xlsx"
                style={{ width: '100%', marginTop: 6 }}
                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label style={{ fontSize: 10, color: c.text.muted }}>
                Baseline
                <input
                  type="file"
                  accept=".xer,.xml,.xlsx"
                  style={{ width: '100%', marginTop: 6 }}
                  onChange={(e) => setBaselineFile(e.target.files?.[0] || null)}
                />
              </label>
              <label style={{ fontSize: 10, color: c.text.muted }}>
                Current
                <input
                  type="file"
                  accept=".xer,.xml,.xlsx"
                  style={{ width: '100%', marginTop: 6 }}
                  onChange={(e) => setCurrentFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => { if (canRunAnalytics) runLocalAnalytics(); }}
                disabled={!canRunAnalytics}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: `1px solid ${c.border.default}`,
                  background: 'transparent',
                  color: canRunAnalytics ? c.text.primary : c.text.muted,
                  cursor: canRunAnalytics ? 'pointer' : 'not-allowed',
                  fontSize: 12,
                }}
              >
                <Sparkles size={14} /> Run analytics
              </button>
              <button
                onClick={() => { if (canRunCompare) runLocalCompare(); }}
                disabled={!canRunCompare}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px',
                  borderRadius: 12,
                  border: `1px solid ${c.border.default}`,
                  background: 'transparent',
                  color: canRunCompare ? c.text.primary : c.text.muted,
                  cursor: canRunCompare ? 'pointer' : 'not-allowed',
                  fontSize: 12,
                }}
              >
                <GitCompare size={14} /> Compare 2 schedules
              </button>
            </div>

            <button
              onClick={downloadExecReport}
              disabled={!(analysis || comparison || demoMode)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 12px',
                borderRadius: 12,
                border: `1px solid ${c.accent.primary}`,
                background: c.accent.primary,
                color: c.bg.primary,
                cursor: (analysis || comparison || demoMode) ? 'pointer' : 'not-allowed',
                fontSize: 12,
                fontWeight: 900,
                opacity: (analysis || comparison || demoMode) ? 1 : 0.5,
              }}
            >
              <Download size={14} /> Download exec report
            </button>

            <div style={{ padding: 10, background: c.bg.secondary, border: `1px solid ${c.border.default}`, borderRadius: 12 }}>
              <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 6 }}>Workspace status</div>
              <div style={{ fontSize: 11, color: c.text.secondary, lineHeight: 1.55 }}>
                • Analytics: <span style={{ color: analysis ? c.status.active : c.text.muted }}>{analysis ? 'Ready' : 'Not generated'}</span>
                <br />
                • Comparison: <span style={{ color: comparison ? c.status.active : c.text.muted }}>{comparison ? 'Ready' : 'Not generated'}</span>
                <br />
                • Risks: <span style={{ color: (riskRegister || []).length ? c.status.active : c.text.muted }}>{(riskRegister || []).length}</span>
                <br />
                • Action plan: <span style={{ color: actionPlan ? c.status.active : c.text.muted }}>{actionPlan ? 'Ready' : 'Not generated'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div style={{ background: c.bg.card, border: `1px solid ${c.border.default}`, padding: 14, display: 'grid', gridTemplateRows: '1fr auto auto', minHeight: 560 }}>
          <div style={{ overflow: 'auto', paddingRight: 8 }}>
            {msgs.length === 0 ? (
              <div style={{ color: c.text.muted, lineHeight: 1.6, fontSize: 12 }}>
                Ask me anything about your schedule. You can also attach files directly to a message.
                <div style={{ marginTop: 10, padding: 10, border: `1px solid ${c.border.default}`, background: c.bg.secondary }}>
                  <div style={{ fontSize: 10, color: c.text.muted, marginBottom: 8 }}>Quick prompts</div>
                  {quick.map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: 12,
                        border: `1px solid ${c.border.default}`,
                        background: 'transparent',
                        color: c.text.secondary,
                        cursor: 'pointer',
                        marginBottom: 8,
                        fontSize: 12,
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {msgs.map((m, i) => {
                  const isUser = m.role === 'user';
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                      <div
                        style={{
                          maxWidth: '86%',
                          background: isUser ? c.accent.primary : c.bg.secondary,
                          color: isUser ? c.bg.primary : c.text.primary,
                          border: `1px solid ${isUser ? c.accent.dim : c.border.default}`,
                          padding: '10px 12px',
                          borderRadius: 14,
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.45,
                          fontSize: 12,
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Attachments bar */}
          <div style={{ paddingTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: c.text.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={14} /> Attach files to message
              </div>
              <input
                type="file"
                accept=".xer,.xml,.xlsx"
                multiple
                onChange={(e) => setPendingFiles(Array.from(e.target.files || []))}
                style={{ fontSize: 11, color: c.text.muted }}
              />
            </div>
            {pendingFiles.length ? (
              <div style={{ fontSize: 11, color: c.text.secondary, marginBottom: 10 }}>
                Attached: {pendingFiles.map((f) => f.name).join(', ')}
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
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
                padding: '12px 12px',
                outline: 'none',
                fontSize: 12,
              }}
            />
            <button
              onClick={send}
              disabled={busy || (!input.trim() && pendingFiles.length === 0)}
              style={{
                background: busy ? c.bg.secondary : c.accent.primary,
                color: busy ? c.text.muted : c.bg.primary,
                border: `1px solid ${busy ? c.border.default : c.accent.primary}`,
                borderRadius: 12,
                padding: '12px 14px',
                fontWeight: 900,
                cursor: busy ? 'not-allowed' : 'pointer',
                fontSize: 12,
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
