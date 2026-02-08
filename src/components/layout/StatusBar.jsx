import React from 'react';
import { motion } from 'framer-motion';
import { Shield, UploadCloud, EyeOff, Eye } from 'lucide-react';
import { c } from '../../lib/theme';
import { useApp } from '../../app/context';
import { demoSystemData } from '../../data/demo';

const labels = {
  system: 'SYSTEM',
  career: 'CAREER',
  analytics: 'ANALYTICS',
  programmes: 'PROGRAMMES',
  decisions: 'DECISIONS',
  risk: 'RISK',
  map: 'MAP',
  capabilities: 'CAPABILITIES',
  tools: 'TOOLS'
};

export default function StatusBar() {
  const {
    section,
    programme,
    demoMode, setDemoMode,
    privacyMode, setPrivacyMode,
    mode, setMode
  } = useApp();

  const opName = privacyMode ? 'OPERATOR' : demoSystemData.operator.name;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 36,
      background: c.bg.primary, borderBottom: '1px solid ' + c.border.default,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', fontFamily: 'monospace', zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: 6, height: 6, background: c.status.active }}
          />
          <span style={{ fontSize: 9, color: c.status.active }}>ONLINE</span>
        </div>

        <span style={{ color: c.border.hover }}>│</span>
        <span style={{ fontSize: 10, color: c.text.primary }}>{labels[section] ?? 'SYSTEM'}</span>
        {programme && (
          <>
            <span style={{ color: c.border.hover }}>│</span>
            <span style={{ fontSize: 9, color: c.accent.primary }}>{programme.shortName}</span>
          </>
        )}

        <span style={{ color: c.border.hover }}>│</span>

        <button
          onClick={() => setMode(mode === 'executive' ? 'planner' : 'executive')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: '1px solid ' + c.border.default,
            cursor: 'pointer', padding: '4px 8px'
          }}
          title="Toggle Executive / Planner"
        >
          <Shield size={12} color={mode === 'planner' ? c.status.active : c.text.muted} />
          <span style={{ fontSize: 9, color: mode === 'planner' ? c.status.active : c.text.muted }}>
            {mode.toUpperCase()}
          </span>
        </button>

        <button
          onClick={() => setDemoMode(!demoMode)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: demoMode ? 'rgba(34,197,94,0.10)' : 'transparent',
            border: '1px solid ' + (demoMode ? c.status.active : c.border.default),
            cursor: 'pointer', padding: '4px 8px'
          }}
          title="Demo Mode: sample data you can share on LinkedIn"
        >
          <UploadCloud size={12} color={demoMode ? c.status.active : c.text.muted} />
          <span style={{ fontSize: 9, color: demoMode ? c.status.active : c.text.muted }}>
            {demoMode ? 'DEMO' : 'UPLOAD'}
          </span>
        </button>

        <button
          onClick={() => setPrivacyMode(!privacyMode)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: privacyMode ? 'rgba(234,179,8,0.10)' : 'transparent',
            border: '1px solid ' + (privacyMode ? c.status.warning : c.border.default),
            cursor: 'pointer', padding: '4px 8px'
          }}
          title="Privacy mode hides sensitive details"
        >
          {privacyMode ? <EyeOff size={12} color={c.status.warning} /> : <Eye size={12} color={c.text.muted} />}
          <span style={{ fontSize: 9, color: privacyMode ? c.status.warning : c.text.muted }}>
            {privacyMode ? 'PRIVATE' : 'PUBLIC'}
          </span>
        </button>
      </div>

      <span style={{ fontSize: 9, color: c.text.secondary }}>{opName}</span>
    </div>
  );
}
