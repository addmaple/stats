#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function rmrf(p) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {}
}

function listJson(dir) {
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

function fileUrlToPath(u) {
  // Handles file:///... URLs emitted by V8.
  try {
    const url = new URL(u);
    if (url.protocol !== 'file:') return null;
    return decodeURIComponent(url.pathname);
  } catch {
    return null;
  }
}

function buildNewlineOffsets(source) {
  const offs = [0];
  for (let i = 0; i < source.length; i++) {
    if (source.charCodeAt(i) === 10) offs.push(i + 1); // '\n'
  }
  return offs;
}

function computeCoverableLines(source) {
  const lines = source.split('\n');
  const coverable = new Array(lines.length).fill(true);
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '') {
      coverable[i] = false;
      continue;
    }
    // Heuristic: ignore comment-only lines (JSDoc dominates dist output)
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('*/')) {
      coverable[i] = false;
      continue;
    }
  }
  return coverable;
}

function lineIndexForOffset(newlines, offset) {
  // Find last newline offset <= offset. Return 0-based line index.
  let lo = 0;
  let hi = newlines.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (newlines[mid] <= offset) lo = mid + 1;
    else hi = mid - 1;
  }
  return Math.max(0, hi);
}

function markCoveredLines(newlines, coverableLines, coveredLineSet, startOffset, endOffset) {
  const startLine = lineIndexForOffset(newlines, startOffset);
  const endLine = lineIndexForOffset(newlines, Math.max(startOffset, endOffset - 1));
  for (let i = startLine; i <= endLine; i++) {
    if (coverableLines[i]) coveredLineSet.add(i);
  }
}

function summarizeFile(coverageEntry, filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const newlines = buildNewlineOffsets(source);
  const coverableLines = computeCoverableLines(source);
  const totalLines = coverableLines.reduce((acc, v) => acc + (v ? 1 : 0), 0);

  let totalFuncs = 0;
  let hitFuncs = 0;
  let totalRanges = 0;
  let hitRanges = 0;
  const coveredLines = new Set();
  let wrapperHit = false;
  let sawNonWrapper = false;

  for (const fn of coverageEntry.functions ?? []) {
    // Skip the synthetic "top-level" wrapper that covers the whole file.
    // V8 reports this as an anonymous function with a single range [0..source.length].
    if (
      (fn.functionName ?? '') === '' &&
      (fn.ranges?.length ?? 0) === 1 &&
      fn.ranges[0].startOffset === 0 &&
      fn.ranges[0].endOffset >= source.length
    ) {
      if ((fn.ranges?.[0]?.count ?? 0) > 0) wrapperHit = true;
      continue;
    }

    sawNonWrapper = true;
    totalFuncs++;
    const fnHit = fn.ranges?.some((r) => r.count > 0) ?? false;
    if (fnHit) hitFuncs++;

    for (const r of fn.ranges ?? []) {
      totalRanges++;
      if (r.count > 0) {
        hitRanges++;
        markCoveredLines(newlines, coverableLines, coveredLines, r.startOffset, r.endOffset);
      }
    }
  }

  // For "loader" modules that are basically only top-level statements, V8 doesn't
  // provide granular ranges beyond the wrapper. Treat those as fully covered if loaded.
  if (!sawNonWrapper && wrapperHit && totalLines > 0) {
    for (let i = 0; i < coverableLines.length; i++) {
      if (coverableLines[i]) coveredLines.add(i);
    }
  }

  return {
    totalLines,
    hitLines: coveredLines.size,
    totalFuncs,
    hitFuncs,
    totalRanges,
    hitRanges,
  };
}

function pct(hit, total) {
  if (!total) return 0;
  return (hit / total) * 100;
}

const args = process.argv.slice(2);
const testGlob = args[0] ?? 'test/**/*.test.js';

const COVERAGE_DIR = path.resolve(process.cwd(), '.v8-coverage');
rmrf(COVERAGE_DIR);
fs.mkdirSync(COVERAGE_DIR, { recursive: true });

// Run tests with raw V8 coverage output.
const run = spawnSync(
  process.execPath,
  [
    '--test',
    '--experimental-test-isolation=none',
    '--test-concurrency=1',
    testGlob,
  ],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_V8_COVERAGE: COVERAGE_DIR,
    },
  }
);

if (run.status !== 0) {
  process.exit(run.status ?? 1);
}

// Merge coverage from all JSON files.
const jsonFiles = listJson(COVERAGE_DIR);
const byPath = new Map(); // filePath -> Map<fnKey, { ranges: {startOffset,endOffset,count}[] }>

for (const jf of jsonFiles) {
  const raw = fs.readFileSync(jf, 'utf8');
  const parsed = JSON.parse(raw);
  for (const entry of parsed.result ?? []) {
    const p = fileUrlToPath(entry.url);
    if (!p) continue;
    if (!fs.existsSync(p)) continue;
    if (p.endsWith('.wasm')) continue;

    // Keep only our code (js/package/dist + js/package/pkg); skip node internals and deps.
    if (!p.includes('/js/package/dist/') && !p.includes('/js/package/pkg/')) continue;

    let fnMap = byPath.get(p);
    if (!fnMap) {
      fnMap = new Map();
      byPath.set(p, fnMap);
    }

    for (const fn of entry.functions ?? []) {
      const ranges = fn.ranges ?? [];
      const key =
        `${fn.functionName ?? ''}|` +
        ranges.map((r) => `${r.startOffset}:${r.endOffset}`).join(',');

      const prev = fnMap.get(key);
      if (!prev) {
        fnMap.set(key, {
          functionName: fn.functionName ?? '',
          ranges: ranges.map((r) => ({
            startOffset: r.startOffset,
            endOffset: r.endOffset,
            count: r.count,
          })),
        });
      } else {
        // Merge counts by max (we only care if it was hit at least once)
        for (let i = 0; i < ranges.length; i++) {
          const r = ranges[i];
          const pr = prev.ranges[i];
          if (!pr) continue;
          if (r.count > pr.count) pr.count = r.count;
        }
      }
    }
  }
}

let agg = {
  totalLines: 0,
  hitLines: 0,
  totalFuncs: 0,
  hitFuncs: 0,
  totalRanges: 0,
  hitRanges: 0,
};

const rows = [];
for (const [p, fnMap] of byPath.entries()) {
  const entry = { functions: Array.from(fnMap.values()) };
  const s = summarizeFile(entry, p);
  rows.push({ path: p, ...s });
}

rows.sort((a, b) => a.path.localeCompare(b.path));

// Aggregate totals (weighted)
for (const r of rows) {
  agg.totalLines += r.totalLines;
  agg.hitLines += r.hitLines;
  agg.totalFuncs += r.totalFuncs;
  agg.hitFuncs += r.hitFuncs;
  agg.totalRanges += r.totalRanges;
  agg.hitRanges += r.hitRanges;
}

const aggDist = { totalLines: 0, hitLines: 0, totalFuncs: 0, hitFuncs: 0, totalRanges: 0, hitRanges: 0 };
const aggPkg = { totalLines: 0, hitLines: 0, totalFuncs: 0, hitFuncs: 0, totalRanges: 0, hitRanges: 0 };
for (const r of rows) {
  const bucket = r.path.includes('/dist/') ? aggDist : r.path.includes('/pkg/') ? aggPkg : null;
  if (!bucket) continue;
  bucket.totalLines += r.totalLines;
  bucket.hitLines += r.hitLines;
  bucket.totalFuncs += r.totalFuncs;
  bucket.hitFuncs += r.hitFuncs;
  bucket.totalRanges += r.totalRanges;
  bucket.hitRanges += r.hitRanges;
}

console.log('\n## V8 coverage (approx)');
console.log(`- testGlob: ${testGlob}`);
console.log(`- files: ${rows.length}`);
console.log(
  `- lines: ${pct(agg.hitLines, agg.totalLines).toFixed(2)}% (${agg.hitLines}/${agg.totalLines})`
);
console.log(
  `- branches(blocks): ${pct(agg.hitRanges, agg.totalRanges).toFixed(2)}% (${agg.hitRanges}/${agg.totalRanges})`
);
console.log(
  `- functions: ${pct(agg.hitFuncs, agg.totalFuncs).toFixed(2)}% (${agg.hitFuncs}/${agg.totalFuncs})`
);

if (aggDist.totalLines || aggPkg.totalLines) {
  console.log('\n## Breakdown');
  if (aggDist.totalLines) {
    console.log(
      `- dist/*: lines ${pct(aggDist.hitLines, aggDist.totalLines).toFixed(2)}%, blocks ${pct(aggDist.hitRanges, aggDist.totalRanges).toFixed(2)}%, funcs ${pct(aggDist.hitFuncs, aggDist.totalFuncs).toFixed(2)}%`
    );
  }
  if (aggPkg.totalLines) {
    console.log(
      `- pkg/*: lines ${pct(aggPkg.hitLines, aggPkg.totalLines).toFixed(2)}%, blocks ${pct(aggPkg.hitRanges, aggPkg.totalRanges).toFixed(2)}%, funcs ${pct(aggPkg.hitFuncs, aggPkg.totalFuncs).toFixed(2)}%`
    );
  }
}

if (process.env.COVERAGE_V8_VERBOSE === '1') {
  const fmt = (hit, total) => `${pct(hit, total).toFixed(2)}% (${hit}/${total})`;
  const sorted = [...rows].sort(
    (a, b) => pct(a.hitLines, a.totalLines) - pct(b.hitLines, b.totalLines)
  );
  console.log('\n## Lowest line coverage (top 10)');
  for (const r of sorted.slice(0, 10)) {
    const rel = r.path.split('/js/package/')[1] ?? r.path;
    console.log(
      `- ${rel}: lines ${fmt(r.hitLines, r.totalLines)}, blocks ${fmt(r.hitRanges, r.totalRanges)}, funcs ${fmt(r.hitFuncs, r.totalFuncs)}`
    );
  }
}

