import React, { useEffect, useState } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { c } from '../../lib/theme';
import { useApp } from '../../app/context';

// Clean floating launcher.
// All heavy features live in the dedicated "Aniket's AI Assistant" tab.
export default function AIAgent() {
  const { setSection } = useApp();
  const [peek, setPeek] = useState(false);

  const openAssistant = () => {
    setSection('assistant');
    setPeek(false);
  };

  // Backwards compatibility: earlier builds used a custom event.
  useEffect(() => {
    const onOpen = () => openAssistant();
    window.addEventListener('pi:open-assistant', onOpen);
    return () => window.removeEventListener('pi:open-assistant', onOpen);
  }, []);

  return (
    <>
      <motion.button
        onClick={() => setPeek((v) => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        style={{
          position: 'fixed',
          right: 22,
          bottom: 22,
          zIndex: 70,
          width: 56,
          height: 56,
          borderRadius: 999,
          border: `1px solid ${c.border.default}`,
          background: `radial-gradient(circle at 30% 30%, rgba(160,128,64,0.25), rgba(0,0,0,0.9))`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label="Open Aniket's Planning Assistant"
        title="Open Aniket's Planning Assistant"
      >
        <Bot size={20} color={c.accent.primary} />
      </motion.button>

      <AnimatePresence>
        {peek && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed',
              right: 22,
              bottom: 88,
              zIndex: 70,
              width: 320,
              background: `linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.55))`,
              border: `1px solid ${c.border.default}`,
              borderRadius: 16,
              padding: 12,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
              fontFamily: 'monospace'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontSize: 10, color: c.text.muted }}>ANIKET'S PLANNING ASSISTANT</div>
              <button
                onClick={() => setPeek(false)}
                style={{ background: 'transparent', border: 'none', color: c.text.muted, cursor: 'pointer', fontSize: 12 }}
              >
                ×
              </button>
            </div>

            <div style={{ marginTop: 10, color: c.text.secondary, fontSize: 12, lineHeight: 1.5 }}>
              For analytics, XER comparison, and executive reports, open the dedicated assistant workspace.
            </div>

            <button
              onClick={openAssistant}
              style={{
                marginTop: 12,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 12px',
                borderRadius: 12,
                border: `1px solid ${c.accent.primary}`,
                background: c.accent.primary,
                color: c.bg.primary,
                fontWeight: 900,
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              <Sparkles size={14} /> Open Assistant
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
