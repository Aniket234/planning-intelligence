// Compute lightweight planning analytics from parsed XER structures.

function median(nums) {
  const a = nums.filter((n) => Number.isFinite(n)).slice().sort((x, y) => x - y);
  if (!a.length) return null;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

function minDate(dates) {
  const xs = dates.filter(Boolean).slice().sort();
  return xs.length ? xs[0] : null;
}

function maxDate(dates) {
  const xs = dates.filter(Boolean).slice().sort();
  return xs.length ? xs[xs.length - 1] : null;
}

function daysBetween(a, b) {
  if (!a || !b) return null;
  const da = new Date(a);
  const db = new Date(b);
  const diff = Math.round((db - da) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) ? diff : null;
}

export function computeAnalytics(parsed) {
  const tasks = Array.from(parsed.tasks.values());
  const starts = tasks.map((t) => t.start);
  const finishes = tasks.map((t) => t.finish);
  const lateFinishes = tasks.map((t) => t.lateFinish || t.finish);

  const contractStart = minDate(starts);
  const contractFinish = maxDate(finishes);
  const forecastFinish = maxDate(lateFinishes);

  const floatDays = tasks
    .map((t) => (Number.isFinite(t.floatHours) ? t.floatHours / 8 : null))
    .filter((n) => Number.isFinite(n));

  const floatMedian = median(floatDays);

  // Status counts (P6 uses: Not Started, In Progress, Completed — but values vary)
  const statusCounts = tasks.reduce(
    (acc, t) => {
      const s = String(t.status || '').toUpperCase();
      if (s.startsWith('NOT') || s === 'NS') acc.notStarted++;
      else if (s.startsWith('IN') || s === 'IP') acc.inProgress++;
      else if (s.startsWith('COM') || s === 'CO') acc.complete++;
      else acc.unknown++;
      return acc;
    },
    { notStarted: 0, inProgress: 0, complete: 0, unknown: 0 }
  );

  const openStart = tasks.filter((t) => (parsed.predCount.get(t.id) || 0) === 0).length;
  const openFinish = tasks.filter((t) => (parsed.succCount.get(t.id) || 0) === 0).length;
  const missingLogic = openStart + openFinish;

  const constraints = tasks.filter((t) => String(t.constraintType || '').trim() && String(t.constraintType).trim() !== '0').length;
  const milestones = tasks.filter((t) => t.isMilestone).length;

  const varianceDays = daysBetween(contractFinish, forecastFinish);

  // Simple “drivers”: tasks close to forecast finish with low float
  const driverCandidates = tasks
    .filter((t) => t.lateFinish || t.finish)
    .map((t) => {
      const f = t.lateFinish || t.finish;
      const lag = daysBetween(f, forecastFinish) ?? 9999;
      const fd = Number.isFinite(t.floatHours) ? t.floatHours / 8 : null;
      return { ...t, _lagToFinish: lag, _floatDays: fd };
    })
    .sort((a, b) => a._lagToFinish - b._lagToFinish)
    .slice(0, 80)
    .sort((a, b) => (a._floatDays ?? 999) - (b._floatDays ?? 999))
    .slice(0, 12)
    .map((t) => ({ id: t.id, code: t.code, name: t.name, lateFinish: t.lateFinish || t.finish, floatDays: t._floatDays }));

  // WBS hotspots (top WBS by count of low-float activities)
  const wbsRisk = new Map();
  for (const t of tasks) {
    const fd = Number.isFinite(t.floatHours) ? t.floatHours / 8 : null;
    if (fd === null) continue;
    if (fd > 5) continue;
    const w = t.wbsId ? String(t.wbsId) : 'NO_WBS';
    wbsRisk.set(w, (wbsRisk.get(w) || 0) + 1);
  }
  const wbsHotspots = Array.from(wbsRisk.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([wbsId, count]) => {
      const w = parsed.wbsById.get(wbsId);
      return { wbsId, wbsCode: w?.code || wbsId, wbsName: w?.name || '', countLowFloat: count };
    });

  return {
    projectName: parsed.projectName,
    kpis: {
      activities: tasks.length,
      milestones,
      contractStart,
      contractFinish,
      forecastFinish,
      varianceDays: varianceDays ?? 0,
      floatMedian: floatMedian !== null ? Math.round(floatMedian * 10) / 10 : null,
      openStart,
      openFinish,
      missingLogic,
      constraints,
      statusCounts,
    },
    evidence: {
      drivers: driverCandidates,
      wbsHotspots,
    },
  };
}

export function computeComparison(baseParsed, curParsed) {
  const baseTasks = baseParsed.tasks;
  const curTasks = curParsed.tasks;

  const baseIds = new Set(baseTasks.keys());
  const curIds = new Set(curTasks.keys());

  const added = Array.from(curIds).filter((id) => !baseIds.has(id));
  const removed = Array.from(baseIds).filter((id) => !curIds.has(id));

  const moved = [];
  for (const id of curIds) {
    if (!baseIds.has(id)) continue;
    const a = baseTasks.get(id);
    const b = curTasks.get(id);
    if (!a || !b) continue;

    const startMove = (a.start && b.start) ? daysBetween(a.start, b.start) : 0;
    const finishMove = (a.finish && b.finish) ? daysBetween(a.finish, b.finish) : 0;
    const floatMove = (Number.isFinite(a.floatHours) && Number.isFinite(b.floatHours)) ? (b.floatHours - a.floatHours) / 8 : null;

    if (startMove || finishMove || (floatMove && Math.abs(floatMove) >= 0.5)) {
      moved.push({
        id,
        code: b.code,
        name: b.name,
        startMove,
        finishMove,
        floatMove: floatMove !== null ? Math.round(floatMove * 10) / 10 : null,
      });
    }
  }

  moved.sort((x, y) => Math.abs(y.finishMove) - Math.abs(x.finishMove));

  const topMoves = moved.slice(0, 30);

  // Approx “CP overlap” using low-float (<=0) sets
  const baseCP = new Set(Array.from(baseTasks.values()).filter((t) => (t.floatHours ?? 999999) <= 0).map((t) => t.id));
  const curCP = new Set(Array.from(curTasks.values()).filter((t) => (t.floatHours ?? 999999) <= 0).map((t) => t.id));
  const inter = Array.from(curCP).filter((id) => baseCP.has(id)).length;
  const union = new Set([...baseCP, ...curCP]).size || 1;
  const cpOverlap = Math.round((inter / union) * 100);

  const summary = `Added: ${added.length} • Removed: ${removed.length} • Moved: ${moved.length} • CP overlap (approx): ${cpOverlap}%`;

  return {
    meta: {
      baseline: baseParsed.projectName,
      current: curParsed.projectName,
    },
    summary,
    added: added.slice(0, 50),
    removed: removed.slice(0, 50),
    keyMovements: topMoves,
    kpis: { added: added.length, removed: removed.length, moved: moved.length, cpOverlap },
  };
}
