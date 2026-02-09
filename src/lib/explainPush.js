// "Explain This Push" Engine
// Given two parsed schedules (baseline + update) and their CPM results,
// explains WHY an activity slipped by tracing driving chains and diffing changes.

export function explainPush(actId, baseParsed, baseCPM, curParsed, curCPM) {
  const baseTask = baseCPM.tasks.get(actId);
  const curTask = curCPM.tasks.get(actId);

  if (!curTask) return { error: 'Activity not found in current schedule' };

  const isNew = !baseTask;
  const startMove = isNew ? null : curTask.ES - baseTask.ES;
  const finishMove = isNew ? null : curTask.EF - baseTask.EF;

  // Get driving chains
  const curChain = curCPM.getDrivingChain(actId);
  const baseChain = baseTask ? baseCPM.getDrivingChain(actId) : [];

  // Diff the chains
  const chainComparison = compareChains(baseChain, curChain);

  // Collect all changes for activities in the driving chain
  const changeEvidence = [];
  const curChainIds = new Set(curChain.map(c => c.id));

  for (const chainAct of curChain) {
    const base = baseParsed.tasks.get(chainAct.id);
    const cur = curParsed.tasks.get(chainAct.id);
    if (!base || !cur) {
      if (!base && cur) {
        changeEvidence.push({
          actId: chainAct.id,
          code: cur.code,
          name: cur.name,
          category: 'ADDED',
          detail: 'Activity added in current schedule',
        });
      }
      continue;
    }

    // Check date changes
    if (base.start !== cur.start || base.finish !== cur.finish) {
      changeEvidence.push({
        actId: chainAct.id,
        code: cur.code,
        name: cur.name,
        category: 'DATES',
        detail: `Start: ${base.start || '—'} → ${cur.start || '—'}, Finish: ${base.finish || '—'} → ${cur.finish || '—'}`,
      });
    }

    // Check status changes
    if (normalizeStatus(base.status) !== normalizeStatus(cur.status)) {
      changeEvidence.push({
        actId: chainAct.id,
        code: cur.code,
        name: cur.name,
        category: 'PROGRESS',
        detail: `Status: ${base.status || '—'} → ${cur.status || '—'}`,
      });
    }

    // Check duration changes
    const baseDur = estimateDur(base);
    const curDur = estimateDur(cur);
    if (baseDur !== curDur) {
      changeEvidence.push({
        actId: chainAct.id,
        code: cur.code,
        name: cur.name,
        category: 'DURATION',
        detail: `Duration: ${baseDur}d → ${curDur}d`,
      });
    }

    // Check constraint changes
    if ((base.constraintType || '') !== (cur.constraintType || '') ||
        (base.constraintDate || '') !== (cur.constraintDate || '')) {
      changeEvidence.push({
        actId: chainAct.id,
        code: cur.code,
        name: cur.name,
        category: 'CONSTRAINT',
        detail: `Constraint: ${base.constraintType || 'none'} ${base.constraintDate || ''} → ${cur.constraintType || 'none'} ${cur.constraintDate || ''}`,
      });
    }
  }

  // Check relationship changes along the chain
  const relChanges = diffRelationships(baseParsed.rels, curParsed.rels, curChainIds);

  // Categorize primary driver
  const categories = {};
  for (const ev of changeEvidence) {
    categories[ev.category] = (categories[ev.category] || 0) + 1;
  }
  for (const rc of relChanges) {
    categories['LOGIC'] = (categories['LOGIC'] || 0) + 1;
  }

  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const primaryCategory = sorted[0]?.[0] || 'UNKNOWN';

  // Build narrative
  const narrative = buildNarrative(actId, curTask, startMove, finishMove, primaryCategory, changeEvidence, relChanges, curChain);

  // Confidence score
  const directChanges = changeEvidence.filter(e => e.actId === curTask.drivingPredId).length;
  const confidence = directChanges > 0 ? 85 : changeEvidence.length > 0 ? 65 : relChanges.length > 0 ? 55 : 30;

  return {
    actId,
    actCode: curTask.code,
    actName: curTask.name,
    isNew,
    startMove,
    finishMove,
    primaryCategory,
    confidence,
    narrative,
    drivingChain: curChain,
    baselineChain: baseChain,
    chainComparison,
    changeEvidence,
    relChanges,
    categories: sorted.map(([cat, count]) => ({ category: cat, count })),
  };
}

// Build explanations for top N slipped activities
export function explainTopSlips(baseParsed, baseCPM, curParsed, curCPM, topN = 10) {
  const results = [];
  for (const [id, curTask] of curCPM.tasks) {
    const baseTask = baseCPM.tasks.get(id);
    if (!baseTask) continue;
    const slip = curTask.EF - baseTask.EF;
    if (slip > 0) {
      results.push({ id, slip, code: curTask.code, name: curTask.name });
    }
  }
  results.sort((a, b) => b.slip - a.slip);
  const top = results.slice(0, topN);

  return top.map(r => ({
    ...r,
    explanation: explainPush(r.id, baseParsed, baseCPM, curParsed, curCPM),
  }));
}

// ===== HELPERS =====

function compareChains(baseChain, curChain) {
  const baseIds = baseChain.map(c => c.id);
  const curIds = curChain.map(c => c.id);
  const baseSet = new Set(baseIds);
  const curSet = new Set(curIds);

  const newDrivers = curIds.filter(id => !baseSet.has(id));
  const removedDrivers = baseIds.filter(id => !curSet.has(id));
  const commonDrivers = curIds.filter(id => baseSet.has(id));

  return {
    newDrivers,
    removedDrivers,
    commonDrivers,
    chainChanged: newDrivers.length > 0 || removedDrivers.length > 0,
    summary: newDrivers.length > 0
      ? `Driving chain changed: ${newDrivers.length} new driver(s)`
      : removedDrivers.length > 0
        ? `Driving chain changed: ${removedDrivers.length} driver(s) removed`
        : 'Driving chain structure unchanged',
  };
}

function diffRelationships(baseRels, curRels, relevantIds) {
  const baseKey = new Set(baseRels.map(r => `${r.pred}|${r.succ}|${r.type}`));
  const curKey = new Set(curRels.map(r => `${r.pred}|${r.succ}|${r.type}`));

  const changes = [];

  // Added relationships
  for (const r of curRels) {
    const key = `${r.pred}|${r.succ}|${r.type}`;
    if (!baseKey.has(key) && (relevantIds.has(String(r.pred)) || relevantIds.has(String(r.succ)))) {
      changes.push({ type: 'ADDED', pred: r.pred, succ: r.succ, relType: r.type, lag: r.lag || 0 });
    }
  }

  // Removed relationships
  for (const r of baseRels) {
    const key = `${r.pred}|${r.succ}|${r.type}`;
    if (!curKey.has(key) && (relevantIds.has(String(r.pred)) || relevantIds.has(String(r.succ)))) {
      changes.push({ type: 'REMOVED', pred: r.pred, succ: r.succ, relType: r.type, lag: r.lag || 0 });
    }
  }

  return changes;
}

function buildNarrative(actId, curTask, startMove, finishMove, primaryCategory, changeEvidence, relChanges, curChain) {
  const parts = [];

  if (finishMove != null && finishMove !== 0) {
    parts.push(`Activity ${curTask.code || actId} ${finishMove > 0 ? 'slipped' : 'improved'} by ${Math.abs(finishMove)} day(s).`);
  }

  const categoryLabels = {
    DATES: 'predecessor date movements',
    PROGRESS: 'progress updates on driving predecessors',
    DURATION: 'duration changes',
    CONSTRAINT: 'constraint changes',
    LOGIC: 'logic/relationship changes',
    ADDED: 'newly added activities in the chain',
    CALENDAR: 'calendar changes',
  };

  if (primaryCategory && categoryLabels[primaryCategory]) {
    parts.push(`Primary driver: ${categoryLabels[primaryCategory]}.`);
  }

  if (relChanges.length > 0) {
    const added = relChanges.filter(r => r.type === 'ADDED').length;
    const removed = relChanges.filter(r => r.type === 'REMOVED').length;
    if (added) parts.push(`${added} relationship(s) added in driving chain.`);
    if (removed) parts.push(`${removed} relationship(s) removed from driving chain.`);
  }

  if (curChain.length > 1) {
    const driver = curChain[1];
    if (driver) {
      parts.push(`Immediate driving predecessor: ${driver.code || driver.id} via ${driver.linkType || 'FS'}.`);
    }
  }

  return parts.join(' ');
}

function normalizeStatus(s) {
  const t = String(s || '').toUpperCase();
  if (t.startsWith('COM') || t === 'CO') return 'COMPLETE';
  if (t.startsWith('IN') || t === 'IP') return 'IN_PROGRESS';
  if (t.startsWith('NOT') || t === 'NS') return 'NOT_STARTED';
  return t;
}

function estimateDur(task) {
  if (task.origDur != null) {
    const d = Number(task.origDur);
    if (Number.isFinite(d)) return d > 100 ? Math.round(d / 8) : d;
  }
  if (task.start && task.finish) {
    const diff = Math.round((new Date(task.finish) - new Date(task.start)) / (86400000));
    return Math.max(0, diff);
  }
  return 0;
}
