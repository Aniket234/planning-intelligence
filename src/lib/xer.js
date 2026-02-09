// Enhanced Primavera P6 XER parser (client-side)
// Extracts %T/%F/%R tables. Supports TASK, TASKPRED, PROJWBS, CALENDAR, PROJECT.

// Split an XER %F/%R line.
// Many XER exports are tab-delimited; some are comma-delimited.
// For comma-delimited rows, we do a tiny quote-safe split (no deps).
function splitRow(line) {
  if (line.includes('\t')) return line.split('\t');

  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // Toggle quote mode; handle doubled quotes ""
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function toISODate(s) {
  if (!s) return null;
  const t = String(s).trim();
  if (!t) return null;
  const m = t.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function parseXERText(xerText) {
  const lines = String(xerText || '').split(/\r?\n/);
  const tables = new Map();
  let current = null;
  let cols = [];

  const pushRow = (tableName, row) => {
    if (!tables.has(tableName)) tables.set(tableName, []);
    tables.get(tableName).push(row);
  };

  for (const raw of lines) {
    const line = raw;
    if (!line) continue;
    if (line.startsWith('%T')) { current = line.slice(2).trim(); cols = []; continue; }
    if (!current) continue;
    if (line.startsWith('%F')) { cols = splitRow(line.slice(2)).map((c) => String(c).trim()); continue; }
    if (line.startsWith('%R')) {
      const vals = splitRow(line.slice(2));
      const row = {};
      for (let i = 0; i < cols.length; i++) row[cols[i]] = vals[i] ?? '';
      pushRow(current, row);
      continue;
    }
  }

  const TASK = tables.get('TASK') || [];
  const TASKPRED = tables.get('TASKPRED') || [];
  const PROJECT = tables.get('PROJECT') || [];
  const PROJWBS = tables.get('PROJWBS') || [];
  const CALENDAR = tables.get('CALENDAR') || [];

  // IMPORTANT:
  // Use Activity ID (TASK.task_code) as the *primary key*.
  // TASK.task_id is an internal numeric key and can differ between exports.
  const tasks = new Map(); // key: activityId (task_code)
  const idToCode = new Map(); // key: internal task_id -> task_code
  for (const t of TASK) {
    const internalId = t.task_id || t.taskid || t.task_code_id;
    const actId = (t.task_code || '').trim();
    const key = actId || String(internalId || '').trim();
    if (!key) continue;

    if (internalId && actId) idToCode.set(String(internalId), actId);

    tasks.set(String(key), {
      id: String(key),
      internalId: internalId ? String(internalId) : null,
      code: actId || String(key),
      name: t.task_name || t.task_desc || '',
      wbsId: t.wbs_id || t.projwbs_id || null,
      calendarId: t.clndr_id || t.calendar_id || null,
      status: t.status_code || t.task_status || '',
      start: toISODate(t.target_start_date || t.early_start_date || t.plan_start_date),
      finish: toISODate(t.target_end_date || t.early_end_date || t.plan_end_date),
      actualStart: toISODate(t.act_start_date || t.actual_start_date),
      actualFinish: toISODate(t.act_end_date || t.actual_finish_date),
      lateStart: toISODate(t.late_start_date),
      lateFinish: toISODate(t.late_end_date),
      floatHours: safeNum(t.total_float_hr_cnt ?? t.total_float ?? t.float_hr_cnt),
      origDur: safeNum(t.target_drtn_hr_cnt ?? t.duration_hr_cnt ?? t.original_duration),
      remDur: safeNum(t.remain_drtn_hr_cnt ?? t.remaining_duration),
      pctComplete: safeNum(t.phys_complete_pct ?? t.percent_complete),
      constraintType: t.cstr_type || t.constraint_type || '',
      constraintDate: toISODate(t.cstr_date || t.constraint_date),
      activityType: t.task_type || t.activity_type || '',
      isMilestone: String(t.task_type || '').toLowerCase().includes('mile') ||
        String(t.duration_hr_cnt || t.target_drtn_hr_cnt || '').trim() === '0',
    });
  }

  const predCount = new Map();
  const succCount = new Map();
  const rels = [];
  for (const r of TASKPRED) {
    // TASKPRED typically references internal ids (task_id / pred_task_id)
    const succRaw = r.task_id || r.taskid || r.task_code;
    const predRaw = r.pred_task_id || r.pred_taskid || r.pred_task_code;
    if (!succRaw || !predRaw) continue;
    const succId = idToCode.get(String(succRaw)) || String(succRaw);
    const predId = idToCode.get(String(predRaw)) || String(predRaw);
    const s = String(succId);
    const p = String(predId);
    predCount.set(s, (predCount.get(s) || 0) + 1);
    succCount.set(p, (succCount.get(p) || 0) + 1);
    const lag = safeNum(r.lag_hr_cnt ?? r.lag_days ?? r.lag) || 0;
    rels.push({ succ: s, pred: p, type: r.pred_type || r.rel_type || 'PR_FS', lag, lagHrs: safeNum(r.lag_hr_cnt) });
  }

  const wbsById = new Map();
  for (const w of PROJWBS) {
    const id = w.wbs_id || w.projwbs_id;
    if (!id) continue;
    wbsById.set(String(id), {
      id: String(id), code: w.wbs_short_name || w.wbs_code || '',
      name: w.wbs_name || '', parent: w.parent_wbs_id ? String(w.parent_wbs_id) : null,
    });
  }

  const calendars = new Map();
  for (const cal of CALENDAR) {
    const id = cal.clndr_id || cal.calendar_id;
    if (!id) continue;
    calendars.set(String(id), { id: String(id), name: cal.clndr_name || cal.calendar_name || '', type: cal.clndr_type || '' });
  }

  const project = PROJECT[0] || {};
  const projectName = project.proj_short_name || project.proj_name || 'Schedule';
  const dataDate = toISODate(project.last_recalc_date || project.data_date);

  return { projectName, dataDate, tasks, rels, predCount, succCount, wbsById, calendars, tables };
}

export async function parseXERFile(file) {
  const text = await file.text();
  return parseXERText(text);
}
