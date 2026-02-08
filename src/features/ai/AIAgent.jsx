import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../app/context';
import { c as theme } from '../../lib/theme';

const SYSTEM_PROMPT = `You are a Planning Intelligence assistant.

Rules:
- Never invent schedule facts.
- When schedule data exists, cite evidence (activity IDs / WBS / dates / KPIs).
- Separate: Answer / Evidence / Assumptions.
- If data is missing, say so and suggest the minimum next step.

You help users navigate the site AND interpret the extracted analytics/comparison outputs.`;

function nowISO() { return new Date().toISOString(); }

export default function AIAgent() {
  const { analysis, comparison, playbook, mode } = useApp();
  const c = theme;

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
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

  const canSend = input.trim().length > 0 && !busy;

  const quick = useMemo(() => ([
    'What changed & why it matters?',
    'Top 10 schedule quality issues',
    'What is pushing the key milestone / RFS?',
    'Is this schedule credible to brief a Director?',
    'Generate a next best action plan'
  ]), []);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

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
      messages: next.slice(-12).map(({ role, content }) => ({ role, content })),
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
        aria-label="Open assistant"
        title="Assistant"
      >
        {open ? '×' : 'AI'}
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
            <div style={{ fontWeight: 900 }}>Planning Intelligence AI</div>
            <button
              onClick={() => { setMsgs([]); try { localStorage.removeItem('pi_agent_msgs'); } catch {} }}
              style={{ background: 'transparent', border: `1px solid ${c.border.default}`, color: c.text.primary, borderRadius: 10, padding: '6px 10px', cursor: 'pointer' }}
              title="Clear chat"
            >
              Clear
            </button>
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
