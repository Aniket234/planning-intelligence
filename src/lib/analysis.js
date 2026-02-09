// Lightweight, client-side analytics generator.
// This is NOT a full XER parser yet. It creates deterministic demo analytics
// based on filename + dataDate so the UI can be wired end-to-end.

function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmt(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function generateAnalytics({ file, dataDate }) {
  const seed = hashStr((file?.name || 'no-file') + '|' + (dataDate || 'no-date'));
  const base = new Date(dataDate || Date.now());
  const start = addDays(base, -Math.round(120 + seed * 60));
  const finish = addDays(start, Math.round(260 + seed * 90));
  const forecastFinish = addDays(finish, Math.round((seed - 0.5) * 40));

  const plannedPct = Math.round(clamp(35 + seed * 55, 0, 100));
  const earnedPct = Math.round(clamp(plannedPct - 8 + seed * 16, 0, 100));
  const variancePct = Math.round((earnedPct - plannedPct) * 10) / 10;
  const varianceDays = Math.round((finish.getTime() - forecastFinish.getTime()) / (1000 * 60 * 60 * 24));

  // CPI-like and BEI-like indicators (demo)
  const cpli = Math.round(clamp(0.92 + seed * 0.25, 0.7, 1.25) * 100) / 100;
  const bei = Math.round(clamp(0.86 + seed * 0.3, 0.6, 1.2) * 100) / 100;

  // S-curve
  const totalWeeks = 20;
  const sCurve = Array.from({ length: totalWeeks + 1 }).map((_, i) => {
    const t = i / totalWeeks;
    const planned = Math.round(100 * (t * t * (3 - 2 * t))); // smoothstep
    const earned = Math.round(clamp(planned + (variancePct * 0.8) - 6 + seed * 8 * Math.sin(i / 3), 0, 100));
    const dt = addDays(start, i * 7);
    return { date: fmt(dt), planned, earned };
  });

  // Labour histogram (demo)
  const histogram = Array.from({ length: 12 }).map((_, i) => {
    const hrs = Math.round(120 + 80 * Math.sin((i / 11) * Math.PI) + seed * 30 + (i % 3) * 8);
    return { week: `W${i + 1}`, hours: clamp(hrs, 60, 260) };
  });

  // Progress by discipline
  const disciplines = ['Civil', 'Architectural', 'Electrical', 'Mechanical', 'ICT', 'Commissioning'];
  const disciplineProgress = disciplines.map((name, i) => {
    const p = Math.round(clamp(plannedPct - 8 + i * 4 + seed * 10, 0, 100));
    const e = Math.round(clamp(p + (seed - 0.5) * 12 - (i === disciplines.length - 1 ? 18 : 0), 0, 100));
    return { name, planned: p, earned: e };
  });

  return {
    projectName: file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'Uploaded Schedule',
    dataDate: dataDate || '',
    kpis: {
      plannedPct,
      earnedPct,
      variancePct,
      varianceDays,
      start: fmt(start),
      finish: fmt(finish),
      forecastFinish: fmt(forecastFinish),
      cpli,
      bei
    },
    charts: { sCurve, histogram, disciplineProgress }
  };
}

export function generateRiskRegister({ file, dataDate }) {
  const seed = hashStr((file?.name || 'no-file') + '|risk|' + (dataDate || 'no-date'));
  const base = new Date(dataDate || Date.now());
  const risks = [
    { title: 'Missing logic / open ends', prob: 30, impact: 70, owner: 'Planner' },
    { title: 'Constraint density', prob: 25, impact: 65, owner: 'Planner' },
    { title: 'Long durations on critical activities', prob: 35, impact: 60, owner: 'Discipline Leads' },
    { title: 'Resource loading gaps', prob: 40, impact: 55, owner: 'Project Controls' },
    { title: 'Interface milestones misaligned', prob: 28, impact: 80, owner: 'PM / GC' }
  ].map((r, idx) => {
    const jitter = (seed - 0.5) * 12;
    const prob = clamp(Math.round(r.prob + jitter + idx * 2), 5, 95);
    const impact = clamp(Math.round(r.impact + (seed - 0.5) * 10 - idx), 5, 95);
    const score = prob * impact;
    const rag = score >= 6000 ? 'RED' : score >= 3500 ? 'AMBER' : 'GREEN';
    const due = fmt(addDays(base, 7 + idx * 10));
    return {
      id: `R${idx + 1}`,
      title: r.title,
      rag,
      probability: prob,
      impact,
      due,
      owner: r.owner,
      action: rag === 'RED' ? 'Immediate mitigation + logic correction workshop' : rag === 'AMBER' ? 'Targeted clean-up + re-run checks' : 'Monitor'
    };
  });
  return risks;
}

// --- Comparison + Report (demo-deterministic) ---

function scoreConfidence({ openEnds = 0, constraints = 0, cpVolatility = 0 }) {
  // 0..1
  const pen = clamp(openEnds / 80, 0, 1) * 0.45 + clamp(constraints / 120, 0, 1) * 0.35 + clamp(cpVolatility, 0, 1) * 0.2;
  return clamp(1 - pen, 0, 1);
}

export function generateComparison({ fileA, fileB, dataDate }) {
  const seed = hashStr((fileA?.name || 'A') + '|' + (fileB?.name || 'B') + '|' + (dataDate || '')); 
  const base = new Date(dataDate || Date.now());

  const openEnds = Math.round(clamp(22 + seed * 65, 5, 95));
  const constraints = Math.round(clamp(18 + seed * 110, 10, 160));
  const cpOverlap = Math.round(clamp(45 + seed * 45, 10, 95));
  const cpVolatility = clamp(1 - cpOverlap / 100, 0, 1);
  const conf = scoreConfidence({ openEnds, constraints, cpVolatility });
  const confidenceLabel = conf >= 0.78 ? 'HIGH' : conf >= 0.55 ? 'MEDIUM' : 'LOW';

  // Date movement table (top 30)
  const rows = Array.from({ length: 30 }).map((_, i) => {
    const drift = Math.round((seed - 0.5) * 28 + (i - 12) * 0.8);
    const floatMove = Math.round((seed - 0.5) * 16 - i * 0.2);
    const cpChange = (i < 10 && cpOverlap < 60) ? 'ENTERED_CP' : (i > 20 && cpOverlap < 60) ? 'EXITED_CP' : '—';
    const startMove = Math.round(drift * 0.6);
    const finishMove = drift;
    const id = `A${String(1000 + i)}`;
    return {
      id,
      name: `Activity ${id} – Commissioning / MEP Interface`,
      startMove,
      finishMove,
      floatMove,
      cpChange,
      driver: constraints > 90 && i % 3 === 0 ? 'CONSTRAINT' : openEnds > 55 && i % 4 === 0 ? 'LOGIC' : 'PROGRESS'
    };
  }).sort((a, b) => Math.abs(b.finishMove) - Math.abs(a.finishMove));

  const assumptions = [
    'Demo comparison uses deterministic simulation (no full XER parser wired yet).',
    'Critical path flags are approximated for demo; true CP requires full network calculation.',
    'Use outputs for product demo / UX validation. For live projects, connect the real parser.'
  ];

  const narrative = {
    headline: cpOverlap < 55 ? 'Critical path has materially shifted between updates.' : 'Critical path is broadly consistent between updates.',
    bullets: [
      `CP overlap: ${cpOverlap}% • volatility: ${Math.round(cpVolatility * 100)}%`,
      `Open ends signal: ${openEnds} activities (risk to forecast reliability).`,
      `Constraint density: ${constraints} (check hard constraints and mandatory dates).`,
      `Primary drift driver (demo): ${constraints > openEnds ? 'constraints / imposed dates' : 'logic completeness'}.`
    ]
  };

  return {
    meta: {
      fileA: fileA?.name || 'Baseline',
      fileB: fileB?.name || 'Current',
      dataDate: dataDate || '',
      confidence: confidenceLabel,
      confidenceScore: Math.round(conf * 100),
    },
    kpis: { openEnds, constraints, cpOverlap, cpVolatility },
    dateMoves: rows,
    narrative,
    assumptions
  };
}

export function generateActionPlan({ analysis, comparison, riskRegister }) {
  const seed = hashStr(JSON.stringify({ a: analysis?.kpis, c: comparison?.kpis }));
  const items = [
    {
      title: 'Close missing logic / open ends on driving chains',
      why: 'Open ends reduce forecast credibility and create false criticality.',
      effort: 2,
      owner: 'Planner',
    },
    {
      title: 'Review and remove hard constraints post data-date',
      why: 'Constraint-heavy programmes hide true logic-driven critical path.',
      effort: 2,
      owner: 'Planner / PM',
    },
    {
      title: 'Break down long duration commissioning tasks (>30d)',
      why: 'Long tasks mask progress, reduce control, and skew CP.',
      effort: 3,
      owner: 'Commissioning Lead',
    },
    {
      title: 'Run CP stability check and lock governance rules',
      why: 'High CP volatility suggests frequent logic churn or scope instability.',
      effort: 3,
      owner: 'Project Controls',
    },
    {
      title: 'Create milestone driver packs for Energisation / RFS',
      why: 'Milestone-centric packs speed decisions and reduce meeting churn.',
      effort: 2,
      owner: 'Planner',
    }
  ].map((it, i) => {
    const impact = Math.round(clamp(60 + (seed - 0.5) * 25 - i * 4, 30, 90));
    const confidence = Math.round(clamp(70 + (seed - 0.5) * 20 - i * 2, 40, 95));
    return { ...it, id: `A${i + 1}`, impact, confidence };
  });

  return { generatedAt: new Date().toISOString(), items };
}

export function generateExecutiveReport({ analysis, comparison, riskRegister, actionPlan }) {
  const conf = comparison?.meta?.confidence || 'MEDIUM';
  const rag = conf === 'HIGH' ? 'AMBER' : conf === 'MEDIUM' ? 'AMBER' : 'RED';
  const keyDates = analysis?.kpis ? {
    contractFinish: analysis.kpis.finish,
    forecastFinish: analysis.kpis.forecastFinish,
    varianceDays: analysis.kpis.varianceDays
  } : null;

  const topRisks = (riskRegister || []).slice(0, 5);
  const actions = (actionPlan?.items || []).slice(0, 5);

  const assumptions = [
    ...(comparison?.assumptions || []),
    'Report is generated from extracted metrics only; it does not modify schedule data.',
  ];

  return {
    meta: {
      title: 'Planning Intelligence Executive Report',
      generatedAt: new Date().toISOString(),
      confidence: conf,
      rag
    },
    exec: {
      summary: [
        `Overall status: ${rag} (confidence: ${conf}).`,
        keyDates ? `Forecast finish ${keyDates.forecastFinish} vs contract ${keyDates.contractFinish} (Δ ${keyDates.varianceDays}d).` : 'Upload + set data date for date-driven KPIs.',
        comparison?.narrative?.headline || 'Run comparison for change narrative.'
      ],
      topIssues: (comparison?.narrative?.bullets || []).slice(0, 4),
      recommendation: actions.length ? `Start with: ${actions[0].title}. Then execute actions A2–A5.` : 'Run analytics + comparison to generate action plan.'
    },
    appendix: {
      comparison,
      analytics: analysis,
      risks: topRisks,
      actions
    },
    assumptions
  };
}

export function generatePlaybook({ history }) {
  // history: array of {analysis, comparison, outcomes}
  const seed = hashStr(JSON.stringify(history || []).slice(0, 5000));
  const drivers = [
    { name: 'Commissioning / interfaces', w: 0.34 },
    { name: 'Constraint governance', w: 0.28 },
    { name: 'Logic completeness', w: 0.22 },
    { name: 'Progress rules of credit', w: 0.16 }
  ].map((d) => ({ ...d, w: clamp(d.w + (seed - 0.5) * 0.08, 0.05, 0.6) }))
   .sort((a, b) => b.w - a.w);

  return {
    updatedAt: new Date().toISOString(),
    headline: 'Project Playbook (local learning)',
    insights: [
      `Most frequent slip driver (demo): ${drivers[0].name}.`,
      'Your best ROI interventions are: fix open ends, reduce constraints, and strengthen milestone driver packs.',
      'Keep outputs versioned so guidance improves without changing the underlying metrics engine.'
    ],
    drivers: drivers.map((d) => ({ name: d.name, weight: Math.round(d.w * 100) }))
  };
}
