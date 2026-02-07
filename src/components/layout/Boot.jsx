import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Layers, GitBranch, AlertTriangle, Settings, CheckCircle, Shield } from 'lucide-react';
import { c } from '../../lib/theme';
import { demoSystemData } from '../../data/demo';

export default function Boot({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 450),
      setTimeout(() => setPhase(3), 700),
      setTimeout(() => setPhase(4), 950),
      setTimeout(() => setPhase(5), 1200),
      setTimeout(() => setPhase(6), 1500),
      setTimeout(() => onComplete?.(), 1900)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const steps = [
    { p: 1, icon: Activity, text: 'INITIALISING PLANNING INTELLIGENCE' },
    { p: 2, icon: Layers, text: 'LOADING PROGRAMME DATA' },
    { p: 3, icon: GitBranch, text: 'MAPPING DECISION NETWORKS' },
    { p: 4, icon: AlertTriangle, text: 'CALIBRATING RISK MODELS' },
    { p: 5, icon: Settings, text: 'LOADING TOOLKIT' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      <div style={{ width: '100%', maxWidth: 520, padding: 32 }}>
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
              <Shield size={18} color={c.accent.primary} />
              <div>
                <h1 style={{ fontSize: 16, color: c.text.primary, margin: 0 }}>{demoSystemData.operator.name}</h1>
                <p style={{ fontSize: 10, color: c.text.secondary, margin: 0 }}>{demoSystemData.operator.role} • {demoSystemData.operator.company}</p>
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
