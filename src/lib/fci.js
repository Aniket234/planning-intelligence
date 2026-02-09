// Float Credibility Index — scores how trustworthy each activity's float is.
// Score 0-100. Higher = more credible float. Lower = float may be fake.

export function computeFCI(cpmResult, parsed) {
  const { tasks, preds, succs } = cpmResult;
  const fciMap = new Map();

  // Pre-compute schedule-wide stats for relative penalties
  const allTasks = Array.from(tasks.values());
  const totalRels = parsed.rels.length || 1;
  const avgPreds = totalRels / Math.max(1, allTasks.length);

  // Count calendars used
  const calendarSet = new Set();
  for (const t of parsed.tasks.values()) {
    if (t.calendarId) calendarSet.add(t.calendarId);
  }
  const defaultCalendar = findMostCommonCalendar(parsed);

  for (const [id, task] of tasks) {
    const original = parsed.tasks.get(id);
    let score = 100;
    const penalties = [];

    const predList = preds.get(id) || [];
    const succList = succs.get(id) || [];

    // === 1. CONSTRAINT PENALTY ===
    const cType = String(original?.constraintType || '').toUpperCase();
    if (isHardConstraint(cType)) {
      const pen = 35;
      score -= pen;
      penalties.push({ rule: 'Hard constraint', penalty: pen, detail: cType });
    } else if (isSoftConstraint(cType)) {
      const pen = 10;
      score -= pen;
      penalties.push({ rule: 'Soft constraint', penalty: pen, detail: cType });
    }

    // === 2. LAG PENALTY ===
    let totalLag = 0;
    let ssCount = 0;
    let ffCount = 0;
    let sfCount = 0;
    for (const p of predList) {
      totalLag += Math.abs(p.lag || 0);
      if (p.type === 'SS') ssCount++;
      if (p.type === 'FF') ffCount++;
      if (p.type === 'SF') sfCount++;
    }
    for (const s of succList) {
      totalLag += Math.abs(s.lag || 0);
    }
    if (totalLag > 0) {
      const lagPen = Math.min(25, Math.round(totalLag * 1.5));
      score -= lagPen;
      penalties.push({ rule: 'Excessive lags', penalty: lagPen, detail: `${totalLag}d total lag` });
    }

    // === 3. OPEN-END PENALTY ===
    const isStartMilestone = task.isMilestone && predList.length === 0 && task.duration === 0;
    const isFinishMilestone = task.isMilestone && succList.length === 0 && task.duration === 0;

    if (predList.length === 0 && !isStartMilestone) {
      const pen = 25;
      score -= pen;
      penalties.push({ rule: 'No predecessors (open start)', penalty: pen });
    }
    if (succList.length === 0 && !isFinishMilestone) {
      const pen = 25;
      score -= pen;
      penalties.push({ rule: 'No successors (open finish)', penalty: pen });
    }

    // === 4. SS/FF RATIO PENALTY ===
    const totalLinks = predList.length + succList.length;
    const nonFSCount = ssCount + ffCount + sfCount;
    if (totalLinks > 0) {
      const nonFSRatio = nonFSCount / totalLinks;
      if (nonFSRatio > 0.6) {
        const pen = 12;
        score -= pen;
        penalties.push({ rule: 'High SS/FF ratio', penalty: pen, detail: `${Math.round(nonFSRatio * 100)}% non-FS` });
      }
    }

    // === 5. LOGIC FRAGILITY ===
    if (predList.length === 0 && succList.length === 0) {
      const pen = 20;
      score -= pen;
      penalties.push({ rule: 'Isolated activity (no logic)', penalty: pen });
    }

    // === 6. LAG-TO-DURATION RATIO ===
    if (task.duration > 0 && totalLag > 0) {
      const ratio = totalLag / task.duration;
      if (ratio > 1.0) {
        const pen = Math.min(15, Math.round(ratio * 5));
        score -= pen;
        penalties.push({ rule: 'Lag exceeds duration', penalty: pen, detail: `ratio ${ratio.toFixed(1)}` });
      }
    }

    // === 7. HIGH FLOAT WITH CONSTRAINTS IN CHAIN ===
    if (task.TF > 20) {
      // Walk upstream to count constraints
      let upstreamConstraints = 0;
      let current = task.drivingPredId;
      const seen = new Set();
      let steps = 0;
      while (current && !seen.has(current) && steps < 20) {
        seen.add(current);
        steps++;
        const orig = parsed.tasks.get(current);
        if (orig && isHardConstraint(String(orig.constraintType || ''))) {
          upstreamConstraints++;
        }
        const upstream = tasks.get(current);
        current = upstream?.drivingPredId;
      }
      if (upstreamConstraints >= 2) {
        const pen = 15;
        score -= pen;
        penalties.push({ rule: 'Float masked by upstream constraints', penalty: pen, detail: `${upstreamConstraints} constraints in chain` });
      }
    }

    // === 8. CALENDAR DEVIATION ===
    if (original?.calendarId && defaultCalendar && original.calendarId !== defaultCalendar) {
      const pen = 8;
      score -= pen;
      penalties.push({ rule: 'Non-standard calendar', penalty: pen });
    }

    // Clamp
    score = Math.max(0, Math.min(100, score));

    fciMap.set(id, {
      score,
      penalties,
      grade: score >= 80 ? 'HIGH' : score >= 50 ? 'MEDIUM' : 'LOW',
      color: score >= 80 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444',
    });
  }

  // Summary stats
  const scores = Array.from(fciMap.values()).map(f => f.score);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const lowCount = scores.filter(s => s < 40).length;
  const medCount = scores.filter(s => s >= 40 && s < 80).length;
  const highCount = scores.filter(s => s >= 80).length;
  const unreliablePct = scores.length ? Math.round((lowCount / scores.length) * 100) : 0;

  return {
    fciMap,
    summary: {
      average: avg,
      lowCount,
      medCount,
      highCount,
      unreliablePct,
      total: scores.length,
    },
  };
}

// ===== HELPERS =====

function isHardConstraint(type) {
  const t = String(type).toUpperCase();
  return ['CS_MEO', 'CS_MSO', 'CS_MEOB', 'CS_MSOB', 'MANDATORY_START', 'MANDATORY_FINISH',
    'MUST_START_ON', 'MUST_FINISH_ON', 'CS_MSFOB', 'CS_MEFOB'].some(c => t.includes(c) || t === c);
}

function isSoftConstraint(type) {
  const t = String(type).toUpperCase();
  if (!t || t === '0' || t === 'NONE') return false;
  if (isHardConstraint(t)) return false;
  return ['CS_ALAP', 'CS_ASAP', 'CS_SNET', 'CS_SNLT', 'CS_FNET', 'CS_FNLT',
    'START_NO_EARLIER', 'START_NO_LATER', 'FINISH_NO_EARLIER', 'FINISH_NO_LATER',
    'AS_LATE_AS_POSSIBLE', 'AS_SOON_AS_POSSIBLE'].some(c => t.includes(c));
}

export { isHardConstraint, isSoftConstraint };

function findMostCommonCalendar(parsed) {
  const counts = new Map();
  for (const t of parsed.tasks.values()) {
    if (t.calendarId) counts.set(t.calendarId, (counts.get(t.calendarId) || 0) + 1);
  }
  let best = null, bestCount = 0;
  for (const [cal, count] of counts) {
    if (count > bestCount) { best = cal; bestCount = count; }
  }
  return best;
}
