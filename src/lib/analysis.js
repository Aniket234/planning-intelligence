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
