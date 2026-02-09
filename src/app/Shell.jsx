import React from 'react';
import StatusBar from '../components/layout/StatusBar';
import Nav from '../components/layout/Nav';
import CommandPalette from '../components/layout/CommandPalette';
import AIAgent from '../features/ai/AIAgent';
import AssistantSection from '../features/ai/AssistantSection';
import {
  SystemSection,
  CareerSection,
  TimelineSection,
  AnalyticsSection,
  ProgrammesSection,
  DecisionsSection,
  MapSection,
  CapabilitiesSection,
  PostsSection,
} from '../features/sections';
import ToolsSectionV2 from '../features/ToolsSectionV2';
import { useApp } from './context';
import { c } from '../lib/theme';

export default function Shell() {
  const { section } = useApp();

  return (
    <div style={{ minHeight: '100vh', background: c.bg.primary }}>
      <StatusBar />
      <CommandPalette />
      <div style={{ display: 'flex' }}>
        <Nav />
        <main style={{ flex: 1, marginLeft: 0, paddingTop: 36 }}>
          {section === 'system' && <SystemSection />}
          {section === 'career' && <CareerSection />}
          {section === 'timeline' && <TimelineSection />}
          {section === 'analytics' && <AnalyticsSection />}
          {section === 'programmes' && <ProgrammesSection />}
          {section === 'decisions' && <DecisionsSection />}
          {section === 'map' && <MapSection />}
          {section === 'capabilities' && <CapabilitiesSection />}
          {section === 'tools' && <ToolsSectionV2 />}
          {section === 'assistant' && <AssistantSection />}
          {section === 'posts' && <PostsSection />}
        </main>
      </div>

      {/* Global floating assistant */}
      <AIAgent />
    </div>
  );
}
