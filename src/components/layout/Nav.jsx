import React from 'react';
import { Activity, TrendingUp, Layers, GitBranch, Globe, Target, Settings, Briefcase, Clock, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { c } from '../../lib/theme';
import { useApp } from '../../app/context';

const sections = [
  { id: 'system', label: 'SYSTEM', icon: Activity },
  { id: 'career', label: 'CAREER', icon: Briefcase },
  { id: 'timeline', label: 'TIMELINE', icon: Clock },
  { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp },
  { id: 'programmes', label: 'PROGRAMMES', icon: Layers },
  { id: 'decisions', label: 'DECISIONS', icon: GitBranch },
  { id: 'map', label: 'MAP', icon: Globe },
  { id: 'capabilities', label: 'CAPABILITIES', icon: Target },
  { id: 'tools', label: 'TOOLS', icon: Settings },
  { id: 'posts', label: 'POSTS', icon: MessageSquare }
];

export default function Nav() {
  const { section, setSection } = useApp();

  return (
    <nav
      style={{
        width: 190,
        minHeight: '100vh',
        paddingTop: 36,
        background: c.bg.secondary,
        borderRight: '1px solid ' + c.border.default,
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1, paddingTop: 8 }}>
        {sections.map((s) => {
          const Icon = s.icon;
          const active = section === s.id;
          return (
            <motion.button
              key={s.id}
              whileHover={{ x: 2 }}
              onClick={() => setSection(s.id)}
              style={{
                width: '100%',
                padding: '10px 12px',
                textAlign: 'left',
                background: active ? 'linear-gradient(90deg, rgba(160,128,64,0.12), transparent)' : 'transparent',
                borderLeft: '2px solid ' + (active ? c.accent.dim : 'transparent'),
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <Icon size={12} color={active ? c.accent.primary : c.text.muted} />
              <span style={{ fontSize: 9, color: active ? c.accent.primary : c.text.primary }}>{s.label}</span>
            </motion.button>
          );
        })}
      </div>
      <div style={{ padding: 12, borderTop: '1px solid ' + c.border.default }}>
        <span style={{ fontSize: 8, color: c.text.muted }}>
          Built with Vite + React • Planning Intelligence OS
        </span>
      </div>
    </nav>
  );
}
