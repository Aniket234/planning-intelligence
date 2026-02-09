// DCMA 14-Point Schedule Assessment — computed from real XER data + CPM results.
// Each metric returns: name, threshold, actual value, pass/fail status, detail text.

import { isHardConstraint } from './fci.js';

export function runDCMA14(parsed, cpmResult) {
  const tasks = Array.from(cpmResult.tasks.values());
  const origTasks = Array.from(parsed.tasks.values());
  const rels = parsed.rels || [];
  const total = tasks.length || 1;

  const results = [];

  // 1. Logic — Missing predecessors
  const noPreds = tasks.filter(t => {
    const pList = cpmResult.preds.get(t.id) || [];
    return pList.length === 0 && !(t.isMilestone && t.duration === 0);
  }).length;
  const noPredsPct = round2((noPreds / total) * 100);
  results.push({
    id: 1, name: 'Missing Predecessors',
    threshold: '< 5%', value: `${noPredsPct}%`, raw: noPredsPct,
    status: noPredsPct < 5 ? 'PASS' : noPredsPct < 10 ? 'WARNING' : 'FAIL',
    detail: `${noPreds} of ${total} activities have no predecessors`
  });

  // 2. Missing successors
  const noSuccs = tasks.filter(t => {
    const sList = cpmResult.succs.get(t.id) || [];
    return sList.length === 0 && !(t.isMilestone && t.duration === 0);
  }).length;
  const noSuccsPct = round2((noSuccs / total) * 100);
  results.push({
    id: 2, name: 'Missing Successors',
    threshold: '< 5%', value: `${noSuccsPct}%`, raw: noSuccsPct,
    status: noSuccsPct < 5 ? 'PASS' : noSuccsPct < 10 ? 'WARNING' : 'FAIL',
    detail: `${noSuccs} of ${total} activities have no successors`
  });

  // 3. Leads (negative lags)
  const leadsCount = rels.filter(r => {
    const lag = Number(r.lag || 0);
    return lag < 0 || (r.lagHrs != null && Number(r.lagHrs) < 0);
  }).length;
  const leadsPct = round2((leadsCount / Math.max(1, rels.length)) * 100);
  results.push({
    id: 3, name: 'Leads (Negative Lags)',
    threshold: '0%', value: `${leadsPct}%`, raw: leadsPct,
    status: leadsPct === 0 ? 'PASS' : 'FAIL',
    detail: `${leadsCount} of ${rels.length} relationships have leads`
  });

  // 4. Lags
  const lagsCount = rels.filter(r => {
    const lag = Number(r.lag || 0);
    return lag > 0;
  }).length;
  const lagsPct = round2((lagsCount / Math.max(1, rels.length)) * 100);
  results.push({
    id: 4, name: 'Lags',
    threshold: '< 5%', value: `${lagsPct}%`, raw: lagsPct,
    status: lagsPct < 5 ? 'PASS' : lagsPct < 15 ? 'WARNING' : 'FAIL',
    detail: `${lagsCount} of ${rels.length} relationships have positive lags`
  });

  // 5. Relationship Types (non-FS)
  const nonFS = rels.filter(r => {
    const t = String(r.type || '').toUpperCase().replace(/[^A-Z]/g, '');
    return t !== 'FS' && t !== 'PRFS';
  }).length;
  const nonFSPct = round2((nonFS / Math.max(1, rels.length)) * 100);
  results.push({
    id: 5, name: 'Relationship Types (non-FS)',
    threshold: '< 10%', value: `${nonFSPct}%`, raw: nonFSPct,
    status: nonFSPct < 10 ? 'PASS' : nonFSPct < 20 ? 'WARNING' : 'FAIL',
    detail: `${nonFS} of ${rels.length} relationships are non-FS`
  });

  // 6. Hard Constraints
  const hardConst = origTasks.filter(t => isHardConstraint(String(t.constraintType || ''))).length;
  const hardConstPct = round2((hardConst / total) * 100);
  results.push({
    id: 6, name: 'Hard Constraints',
    threshold: '< 5%', value: `${hardConstPct}%`, raw: hardConstPct,
    status: hardConstPct < 5 ? 'PASS' : hardConstPct < 10 ? 'WARNING' : 'FAIL',
    detail: `${hardConst} of ${total} activities have hard constraints`
  });

  // 7. High Float (> 44 working days)
  const highFloat = tasks.filter(t => t.TF > 44).length;
  const highFloatPct = round2((highFloat / total) * 100);
  results.push({
    id: 7, name: 'High Float (> 44d)',
    threshold: '< 5%', value: `${highFloatPct}%`, raw: highFloatPct,
    status: highFloatPct < 5 ? 'PASS' : highFloatPct < 10 ? 'WARNING' : 'FAIL',
    detail: `${highFloat} of ${total} activities have float > 44 days`
  });

  // 8. Negative Float
  const negFloat = tasks.filter(t => t.TF < 0).length;
  const negFloatPct = round2((negFloat / total) * 100);
  results.push({
    id: 8, name: 'Negative Float',
    threshold: '0%', value: `${negFloatPct}%`, raw: negFloatPct,
    status: negFloat === 0 ? 'PASS' : 'FAIL',
    detail: `${negFloat} of ${total} activities have negative float`
  });

  // 9. High Duration (> 44 working days)
  const highDur = tasks.filter(t => t.duration > 44).length;
  const highDurPct = round2((highDur / total) * 100);
  results.push({
    id: 9, name: 'High Duration (> 44d)',
    threshold: '< 5%', value: `${highDurPct}%`, raw: highDurPct,
    status: highDurPct < 5 ? 'PASS' : highDurPct < 10 ? 'WARNING' : 'FAIL',
    detail: `${highDur} of ${total} activities have duration > 44 days`
  });

  // 10. Invalid Dates
  const today = new Date().toISOString().slice(0, 10);
  const invalidDates = origTasks.filter(t => {
    const status = String(t.status || '').toUpperCase();
    const isComplete = status.startsWith('COM') || status === 'CO';
    const notStarted = status.startsWith('NOT') || status === 'NS';
    // Complete with no actual finish
    if (isComplete && !t.actualFinish && !t.finish) return true;
    // Not started with actual start
    if (notStarted && t.actualStart) return true;
    return false;
  }).length;
  const invalidDatesPct = round2((invalidDates / total) * 100);
  results.push({
    id: 10, name: 'Invalid Dates',
    threshold: '0%', value: `${invalidDatesPct}%`, raw: invalidDatesPct,
    status: invalidDates === 0 ? 'PASS' : 'WARNING',
    detail: `${invalidDates} of ${total} activities have date inconsistencies`
  });

  // 11. Resources (can't fully check without TASKRSRC, flag as informational)
  results.push({
    id: 11, name: 'Resource Assignment',
    threshold: '> 90%', value: 'N/A', raw: null,
    status: 'INFO',
    detail: 'Resource table (TASKRSRC) not parsed in this version — check manually'
  });

  // 12. Missed Tasks (past baseline finish, not complete)
  const missedTasks = origTasks.filter(t => {
    const status = String(t.status || '').toUpperCase();
    const isComplete = status.startsWith('COM') || status === 'CO';
    if (isComplete) return false;
    if (t.finish && t.finish < today) return true;
    return false;
  }).length;
  const missedPct = round2((missedTasks / total) * 100);
  results.push({
    id: 12, name: 'Missed Tasks',
    threshold: '< 5%', value: `${missedPct}%`, raw: missedPct,
    status: missedPct < 5 ? 'PASS' : missedPct < 15 ? 'WARNING' : 'FAIL',
    detail: `${missedTasks} of ${total} incomplete activities are past their finish date`
  });

  // 13. Critical Path Length Index (CPLI)
  const criticalTasks = tasks.filter(t => t.critical);
  const cpLength = criticalTasks.reduce((sum, t) => sum + t.duration, 0);
  const projectDur = cpmResult.projectFinish || 1;
  const cpli = projectDur > 0 ? round2((projectDur + (tasks[0]?.TF || 0)) / projectDur) : 1;
  results.push({
    id: 13, name: 'CPLI',
    threshold: '> 1.0', value: cpli.toString(), raw: cpli,
    status: cpli >= 1.0 ? 'PASS' : cpli >= 0.95 ? 'WARNING' : 'FAIL',
    detail: `Critical Path Length Index = ${cpli}`
  });

  // 14. BEI (Baseline Execution Index) — approximated
  const completedTasks = origTasks.filter(t => {
    const s = String(t.status || '').toUpperCase();
    return s.startsWith('COM') || s === 'CO';
  }).length;
  const shouldBeComplete = origTasks.filter(t => t.finish && t.finish <= today).length;
  const bei = shouldBeComplete > 0 ? round2(completedTasks / shouldBeComplete) : 1;
  results.push({
    id: 14, name: 'BEI',
    threshold: '> 0.95', value: bei.toString(), raw: bei,
    status: bei >= 0.95 ? 'PASS' : bei >= 0.85 ? 'WARNING' : 'FAIL',
    detail: `${completedTasks} completed vs ${shouldBeComplete} planned complete by today`
  });

  // Scoring
  const passed = results.filter(r => r.status === 'PASS').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const score = Math.round(((passed + warnings * 0.5) / results.length) * 100);
  const compliance = passed >= 12 ? 'COMPLIANT' : passed >= 10 ? 'MARGINAL' : 'NON-COMPLIANT';

  return {
    results,
    score,
    compliance,
    summary: { passed, warnings, failed, total: results.length },
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
