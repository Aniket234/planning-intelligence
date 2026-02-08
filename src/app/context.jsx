import React, { createContext, useContext, useMemo, useState } from 'react';
import { demoSystemData } from '../data/demo';

const Ctx = createContext(null);

export const useApp = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used within AppProvider');
  return v;
};

export function AppProvider({ children }) {
  const [section, setSection] = useState('system');
  const [mode, setMode] = useState('executive'); // executive | planner
  const [scenario, setScenario] = useState('p50'); // p20 | p50 | p80

  // experience
  const [programme, setProgramme] = useState(demoSystemData.programmes[0] ?? null);
  const [decision, setDecision] = useState(null);

  // product switches
  const [demoMode, setDemoMode] = useState(true); // demo vs upload
  const [privacyMode, setPrivacyMode] = useState(false); // redact sensitive fields
  const [uploadedFile, setUploadedFile] = useState(null);
  const [baselineFile, setBaselineFile] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [dataDate, setDataDate] = useState('');

  // Derived analytics from uploads (client-side, no backend)
  const [analysis, setAnalysis] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [riskRegister, setRiskRegister] = useState([]);

  // “Learning” layer (local-only)
  const [playbook, setPlaybook] = useState(null);
  const [actionPlan, setActionPlan] = useState(null);

  // Posts (stored in localStorage)
  const [isAdmin, setIsAdmin] = useState(false);

  // tools
  const [toolsTab, setToolsTab] = useState('hub'); // hub | analytics | qsra | dcma | risk | wizard | evidence | report

  const value = useMemo(
    () => ({
      section, setSection,
      mode, setMode,
      scenario, setScenario,
      programme, setProgramme,
      decision, setDecision,
      demoMode, setDemoMode,
      privacyMode, setPrivacyMode,
      uploadedFile, setUploadedFile,
      baselineFile, setBaselineFile,
      currentFile, setCurrentFile,
      dataDate, setDataDate,
      analysis, setAnalysis,
      comparison, setComparison,
      riskRegister, setRiskRegister,
      playbook, setPlaybook,
      actionPlan, setActionPlan,
      isAdmin, setIsAdmin,
      toolsTab, setToolsTab
    }),
    [section, mode, scenario, programme, decision, demoMode, privacyMode, uploadedFile, baselineFile, currentFile, dataDate, analysis, comparison, riskRegister, playbook, actionPlan, isAdmin, toolsTab]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
