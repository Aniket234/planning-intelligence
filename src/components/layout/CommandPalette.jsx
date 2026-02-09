import React, { useEffect, useMemo, useState } from 'react';
import { Search, Sparkles, BarChart3, Globe, Settings, GitBranch, Layers, Briefcase, Clock, Activity, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../app/context';
import { c } from '../../lib/theme';

// Ctrl+K command palette to make the app feel "product-grade".
export default function CommandPalette() {
  const { setSection, setToolsTab } = useApp();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      const k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (k === 'escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = useMemo(() => ([
    { label: 'System', icon: Activity, run: () => setSection('system') },
    { label: 'Career', icon: Briefcase, run: () => setSection('career') },
    { label: 'Timeline', icon: Clock, run: () => setSection('timeline') },
    { label: 'Analytics', icon: BarChart3, run: () => setSection('analytics') },
    { label: 'Programmes', icon: Layers, run: () => setSection('programmes') },
    { label: 'Decisions', icon: GitBranch, run: () => setSection('decisions') },
    { label: 'Map', icon: Globe, run: () => setSection('map') },
    { label: 'Tools', icon: Settings, run: () => setSection('tools') },
    { label: 'Posts', icon: MessageSquare, run: () => setSection('posts') },

    { label: 'Open Aniket\'s Planning Assistant', icon: Sparkles, run: () => setSection('assistant') },
    { label: 'Tools → XER ↔ XER comparison', icon: Sparkles, run: () => { setSection('tools'); setToolsTab('compare'); } },
    { label: 'Tools → Exec Report', icon: Sparkles, run: () => { setSection('tools'); setToolsTab('report'); } },
  ]), [setSection, setToolsTab]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((it) => it.label.toLowerCase().includes(s));
  }, [q, items]);

  const runItem = (it) => {
    it.run?.();
    setQ('');
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.55)' }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: 520,
              maxWidth: '92vw',
              margin: '90px auto',
              borderRadius: 18,
              overflow: 'hidden',
              background: c.bg.card,
              border: `1px solid ${c.border.default}`,
              boxShadow: '0 30px 90px rgba(0,0,0,0.55)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderBottom: `1px solid ${c.border.default}` }}>
              <Search size={14} color={c.text.muted} />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search actions… (Ctrl+K)"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: c.text.primary, fontSize: 14 }}
              />
              <div style={{ fontSize: 11, color: c.text.muted, border: `1px solid ${c.border.default}`, padding: '3px 8px', borderRadius: 999 }}>Esc</div>
            </div>

            <div style={{ maxHeight: 340, overflow: 'auto' }}>
              {filtered.slice(0, 14).map((it) => {
                const Icon = it.icon;
                return (
                  <button
                    key={it.label}
                    onClick={() => runItem(it)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${c.border.default}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10
                    }}
                  >
                    <Icon size={14} color={c.text.muted} />
                    <span style={{ color: c.text.primary, fontSize: 13 }}>{it.label}</span>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ padding: 12, color: c.text.muted, fontSize: 13 }}>No matches.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
