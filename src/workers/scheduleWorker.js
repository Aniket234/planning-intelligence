// Web Worker: heavy schedule processing (parse XER, CPM, DCMA, FCI, comparisons)
// Runs off the main thread so the UI stays responsive.

import { parseXERText } from '../lib/xer';
import { runCPM } from '../lib/cpm';
import { computeFCI } from '../lib/fci';
import { runDCMA14 } from '../lib/dcma';
import { computeAnalytics, computeComparison } from '../lib/scheduleMetrics';
import { explainTopSlips } from '../lib/explainPush';

function mapToEntries(m) {
  return m instanceof Map ? Array.from(m.entries()) : [];
}

function mapToObject(m) {
  if (!(m instanceof Map)) return {};
  const o = {};
  for (const [k, v] of m.entries()) o[k] = v;
  return o;
}

function serializeParsed(p) {
  return {
    projectName: p.projectName,
    dataDate: p.dataDate,
    tasks: mapToEntries(p.tasks),
    rels: p.rels || [],
    predCount: mapToEntries(p.predCount),
    succCount: mapToEntries(p.succCount),
    wbsById: mapToEntries(p.wbsById),
    calendars: mapToEntries(p.calendars),
  };
}

function serializeCPM(cp) {
  return {
    projectFinish: cp.projectFinish,
    tasks: mapToEntries(cp.tasks),
  };
}

function serializeFCI(fc) {
  return {
    summary: fc.summary,
    fciMap: mapToEntries(fc.fciMap),
  };
}

self.onmessage = async (evt) => {
  const msg = evt.data || {};
  const jobId = msg.jobId;
  try {
    if (msg.kind === 'single') {
      const parsed = parseXERText(msg.xerText);
      const cpm = runCPM(parsed);
      const fci = computeFCI(cpm, parsed);
      const dcma = runDCMA14(parsed, cpm);
      const analytics = computeAnalytics(parsed);

      self.postMessage({
        jobId,
        ok: true,
        kind: 'single',
        parsed: serializeParsed(parsed),
        cpm: serializeCPM(cpm),
        fci: serializeFCI(fci),
        dcma,
        analytics,
      });
      return;
    }

    if (msg.kind === 'compare') {
      const baseParsed = parseXERText(msg.baselineText);
      const curParsed = parseXERText(msg.currentText);
      const baseCpm = runCPM(baseParsed);
      const curCpm = runCPM(curParsed);
      const comp = computeComparison(baseParsed, curParsed);
      const explains = explainTopSlips(baseParsed, baseCpm, curParsed, curCpm, msg.topN || 15);
      const fci = computeFCI(curCpm, curParsed);
      const dcma = runDCMA14(curParsed, curCpm);
      const analytics = computeAnalytics(curParsed);

      self.postMessage({
        jobId,
        ok: true,
        kind: 'compare',
        baseline: {
          parsed: serializeParsed(baseParsed),
          cpm: serializeCPM(baseCpm),
        },
        current: {
          parsed: serializeParsed(curParsed),
          cpm: serializeCPM(curCpm),
        },
        comparison: comp,
        explains,
        fci: serializeFCI(fci),
        dcma,
        analytics,
      });
      return;
    }

    throw new Error('Unknown kind: ' + String(msg.kind));
  } catch (err) {
    self.postMessage({ jobId, ok: false, error: String(err?.message || err) });
  }
};
