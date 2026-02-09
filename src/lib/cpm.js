// CPM Engine — Forward/Backward pass, driving predecessor, longest path
// Works on parsed XER data. All client-side, no backend needed.

/**
 * Build a directed graph from parsed XER and run CPM.
 * Returns enriched task map with ES/EF/LS/LF/TF/FF and driving info.
 */
export function runCPM(parsed) {
  const tasks = new Map();
  // Clone tasks
  for (const [id, t] of parsed.tasks) {
    tasks.set(id, {
      ...t,
      duration: estimateDurationDays(t),
      ES: 0, EF: 0, LS: Infinity, LF: Infinity,
      TF: 0, FF: 0,
      drivingPredId: null,
      drivingPredType: null,
      critical: false,
      longestPathRank: 0,
    });
  }

  // Build adjacency
  const preds = new Map(); // taskId -> [{predId, type, lag}]
  const succs = new Map(); // taskId -> [{succId, type, lag}]
  for (const id of tasks.keys()) {
    preds.set(id, []);
    succs.set(id, []);
  }

  for (const r of parsed.rels) {
    const predId = String(r.pred);
    const succId = String(r.succ);
    if (!tasks.has(predId) || !tasks.has(succId)) continue;
    const type = normalizeRelType(r.type);
    const lag = parseLag(r.lag);
    preds.get(succId).push({ predId, type, lag });
    succs.get(predId).push({ succId, type, lag });
  }

  // Topological sort (Kahn's algorithm)
  const inDeg = new Map();
  for (const id of tasks.keys()) inDeg.set(id, 0);
  // In-degree = number of predecessors
  for (const id of tasks.keys()) inDeg.set(id, preds.get(id).length);

  const queue = [];
  for (const [id, deg] of inDeg) {
    if (deg === 0) queue.push(id);
  }

  const topoOrder = [];
  const visited = new Set();
  let qi = 0;
  while (qi < queue.length) {
    const id = queue[qi++];
    if (visited.has(id)) continue;
    visited.add(id);
    topoOrder.push(id);
    for (const s of succs.get(id) || []) {
      const newDeg = inDeg.get(s.succId) - 1;
      inDeg.set(s.succId, newDeg);
      if (newDeg <= 0 && !visited.has(s.succId)) {
        queue.push(s.succId);
      }
    }
  }

  // Add any remaining (cycles) — just append them
  for (const id of tasks.keys()) {
    if (!visited.has(id)) topoOrder.push(id);
  }

  // ===== FORWARD PASS =====
  for (const id of topoOrder) {
    const task = tasks.get(id);
    let maxES = 0;
    let drivingPredId = null;
    let drivingPredType = null;

    for (const p of preds.get(id) || []) {
      const pred = tasks.get(p.predId);
      if (!pred) continue;
      let candidateES = 0;

      switch (p.type) {
        case 'FS': candidateES = pred.EF + p.lag; break;
        case 'SS': candidateES = pred.ES + p.lag; break;
        case 'FF': candidateES = pred.EF + p.lag - task.duration; break;
        case 'SF': candidateES = pred.ES + p.lag - task.duration; break;
        default:   candidateES = pred.EF + p.lag; break;
      }

      if (candidateES > maxES) {
        maxES = candidateES;
        drivingPredId = p.predId;
        drivingPredType = p.type + (p.lag ? `+${p.lag}d` : '');
      }
    }

    task.ES = Math.max(0, maxES);
    task.EF = task.ES + task.duration;
    task.drivingPredId = drivingPredId;
    task.drivingPredType = drivingPredType;
  }

  // Project finish = max EF
  let projectFinish = 0;
  for (const t of tasks.values()) {
    if (t.EF > projectFinish) projectFinish = t.EF;
  }

  // ===== BACKWARD PASS =====
  for (const id of tasks.keys()) {
    tasks.get(id).LF = projectFinish;
    tasks.get(id).LS = projectFinish;
  }

  const reverseOrder = [...topoOrder].reverse();
  for (const id of reverseOrder) {
    const task = tasks.get(id);
    let minLF = projectFinish;

    for (const s of succs.get(id) || []) {
      const succ = tasks.get(s.succId);
      if (!succ) continue;
      let candidateLF = projectFinish;

      switch (s.type) {
        case 'FS': candidateLF = succ.LS - s.lag; break;
        case 'SS': candidateLF = succ.LS - s.lag + task.duration; break;
        case 'FF': candidateLF = succ.LF - s.lag; break;
        case 'SF': candidateLF = succ.LF - s.lag + task.duration; break;
        default:   candidateLF = succ.LS - s.lag; break;
      }

      if (candidateLF < minLF) {
        minLF = candidateLF;
      }
    }

    task.LF = minLF;
    task.LS = task.LF - task.duration;

    // Float
    task.TF = task.LS - task.ES;
    task.critical = Math.abs(task.TF) <= 0.01;

    // Free float
    let minSuccES = projectFinish;
    for (const s of succs.get(id) || []) {
      const succ = tasks.get(s.succId);
      if (!succ) continue;
      if (s.type === 'FS') {
        const gap = succ.ES - task.EF - s.lag;
        if (gap < minSuccES) minSuccES = gap;
      }
    }
    task.FF = succs.get(id).length > 0 ? Math.max(0, minSuccES) : task.TF;
  }

  // ===== LONGEST PATH RANKING =====
  const sortedByFloat = [...tasks.values()]
    .sort((a, b) => a.TF - b.TF);
  sortedByFloat.forEach((t, i) => { t.longestPathRank = i + 1; });

  // ===== DRIVING CHAIN EXTRACTION =====
  function getDrivingChain(actId, maxDepth = 50) {
    const chain = [];
    let current = actId;
    const seen = new Set();
    while (current && !seen.has(current) && chain.length < maxDepth) {
      seen.add(current);
      const task = tasks.get(current);
      if (!task) break;
      chain.push({
        id: current,
        code: task.code,
        name: task.name,
        ES: task.ES, EF: task.EF,
        TF: task.TF,
        linkType: task.drivingPredType,
      });
      current = task.drivingPredId;
    }
    return chain;
  }

  return {
    tasks,
    preds,
    succs,
    topoOrder,
    projectFinish,
    getDrivingChain,
  };
}

// ===== HELPERS =====

function estimateDurationDays(task) {
  // Try original duration field first
  if (task.origDur != null && Number.isFinite(Number(task.origDur))) {
    const d = Number(task.origDur);
    // P6 stores in hours typically; if > 100 assume hours and convert
    if (d > 100) return Math.round(d / 8);
    return d;
  }
  // Fall back to date diff
  if (task.start && task.finish) {
    const s = new Date(task.start);
    const f = new Date(task.finish);
    const diff = Math.round((f - s) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }
  // Milestones
  if (task.isMilestone) return 0;
  return 1; // default
}

function normalizeRelType(type) {
  const t = String(type || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (t === 'FS' || t === 'PR_FS') return 'FS';
  if (t === 'SS' || t === 'PR_SS') return 'SS';
  if (t === 'FF' || t === 'PR_FF') return 'FF';
  if (t === 'SF' || t === 'PR_SF') return 'SF';
  return 'FS'; // default
}

function parseLag(val) {
  if (val == null) return 0;
  const n = Number(val);
  if (!Number.isFinite(n)) return 0;
  // If stored in hours, convert to days
  if (Math.abs(n) > 100) return Math.round(n / 8);
  return n;
}
