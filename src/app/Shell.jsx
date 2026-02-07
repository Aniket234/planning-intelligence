import React from 'react';
import StatusBar from '../components/layout/StatusBar';
import Nav from '../components/layout/Nav';
import {
  SystemSection, CareerSection, TimelineSection, AnalyticsSection, ProgrammesSection,
  DecisionsSection, RiskSection, CapabilitiesSection, ToolsSection, CaseFilesSection
} from '../features/sections';
import { useApp } from './context';
import { c } from '../lib/theme';

function Placeholder({ title, note }) {
  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <span style={{ fontSize: 9, color: c.text.muted }}>{title}</span>
      <div style={{ marginTop: 12, padding: 18, background: c.bg.card, border: '1px solid ' + c.border.default }}>
        <p style={{ margin: 0, fontSize: 10, color: c.text.secondary, lineHeight: 1.6 }}>{note}</p>
      </div>
    </div>
  );
}

export default function Shell() {
  const { section } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary }}>
      <StatusBar />
      <div style={{ display: 'flex' }}>
        <Nav />
        <main style={{ flex: 1, marginLeft: 0, paddingTop: 36 }}>
          {section === 'system' && <SystemSection />}
          {section === 'career' && <CareerSection />}
          {section === 'timeline' && <TimelineSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'programmes' && <ProgrammesSection />}
          {section === 'decisions' && <DecisionsSection />}
          {section === 'risk' && <RiskSection />}
          {section === 'map' && <Placeholder title="MAP" note="Map module is intentionally lightweight in this build. If you want, I can add an interactive leaflet map with project pins + filters, and a 'timeline slider' to show growth by year." />}
          {section === 'capabilities' && <CapabilitiesSection />}
          {section === 'tools' && <ToolsSection />}
          {section === 'casefiles' && <CaseFilesSection />}
        </main>
      </div>
    </div>
  );
}
