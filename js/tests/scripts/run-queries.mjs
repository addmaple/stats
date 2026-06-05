#!/usr/bin/env node
/**
 * Run statistical queries against Glassdoor/Walmart review datasets.
 *
 * Usage:
 *   node scripts/run-queries.mjs glassdoor          # run all defined queries
 *   node scripts/run-queries.mjs walmart            # run walmart queries
 *   node scripts/run-queries.mjs glassdoor --try "mean rating where company=Walmart"
 *   node scripts/run-queries.mjs glassdoor --list   # list available queries
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jStat from 'jstat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../..');

const STATS = {
  count: (values) => values.length,
  mean: (values) => jStat.mean(values),
  median: (values) => jStat.median(values),
  stdev: (values) => jStat.stdev(values),
  min: (values) => jStat.min(values),
  max: (values) => jStat.max(values),
  sum: (values) => jStat.sum(values),
  percentile: (values, p) => jStat.percentile(values, p),
};

const DATASETS = {
  glassdoor: {
    dir: path.join(ROOT, 'data/glassdoor'),
    data: 'glassdoor-reviews.json',
    queries: 'queries.json',
  },
  walmart: {
    dir: path.join(ROOT, 'data/walmart'),
    data: 'walmart-reviews.json',
    queries: 'queries.json',
  },
};

function applyFilter(rows, filter = {}) {
  return rows.filter((row) => {
    if (filter.company && row.company !== filter.company) return false;
    if (filter.employee_type_prefix && !row.employee_type.startsWith(filter.employee_type_prefix)) return false;
    if (filter.rating_gte !== undefined && parseFloat(row.rating) < filter.rating_gte) return false;
    if (filter.rating_lte !== undefined && parseFloat(row.rating) > filter.rating_lte) return false;
    if (filter.rating_eq !== undefined && parseFloat(row.rating) !== filter.rating_eq) return false;
    return true;
  });
}

function getColumnValues(rows, column) {
  return rows.map((r) => {
    const val = r[column];
    const num = parseFloat(val);
    return Number.isNaN(num) ? val : num;
  });
}

function executeQuery(rows, query) {
  const filtered = applyFilter(rows, query.filter);
  const values = getColumnValues(filtered, query.column);

  switch (query.operation) {
    case 'count':
      return STATS.count(values);
    case 'mean':
      return STATS.mean(values);
    case 'median':
      return STATS.median(values);
    case 'stdev':
      return STATS.stdev(values);
    case 'min':
      return STATS.min(values);
    case 'max':
      return STATS.max(values);
    case 'sum':
      return STATS.sum(values);
    case 'percentile':
      return STATS.percentile(values, query.params?.p ?? 0.5);
    default:
      throw new Error(`Unknown operation: ${query.operation}`);
  }
}

function assertClose(actual, expected, tolerance) {
  if (tolerance === 0) return actual === expected;
  return Math.abs(actual - expected) <= tolerance;
}

function parseTryQuery(queryStr, rows) {
  // Simple ad-hoc query parser: "mean rating" or "mean rating where company=Walmart"
  const match = queryStr.match(/^(\w+)\s+(\w+)(?:\s+where\s+(.+))?$/i);
  if (!match) {
    throw new Error(`Could not parse query: "${queryStr}". Try: "mean rating where company=Walmart"`);
  }

  const [, operation, column, whereClause] = match;
  const filter = {};

  if (whereClause) {
    for (const part of whereClause.split(/\s+and\s+/i)) {
      const [key, val] = part.split('=').map((s) => s.trim());
      if (key === 'company') filter.company = val;
      else if (key === 'employee_type') filter.employee_type_prefix = val;
      else if (key.endsWith('_gte')) filter[`${key.replace('_gte', '')}_gte`] = parseFloat(val);
      else if (key.endsWith('_lte')) filter[`${key.replace('_lte', '')}_gte`] = parseFloat(val);
      else filter[key] = isNaN(Number(val)) ? val : Number(val);
    }
  }

  const query = { operation: operation.toLowerCase(), column, filter: Object.keys(filter).length ? filter : undefined };
  const result = executeQuery(rows, query);
  const filtered = applyFilter(rows, query.filter);
  return { query, result, rowCount: filtered.length };
}

function main() {
  const args = process.argv.slice(2);
  const datasetName = args[0];

  if (!datasetName || !DATASETS[datasetName]) {
    console.error('Usage: node scripts/run-queries.mjs <glassdoor|walmart> [--list | --try "query"]');
    process.exit(1);
  }

  const config = DATASETS[datasetName];
  const dataPath = path.join(config.dir, config.data);
  const queriesPath = path.join(config.dir, config.queries);

  const rows = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const queryDef = JSON.parse(fs.readFileSync(queriesPath, 'utf-8'));

  if (args.includes('--list')) {
    console.log(`\n${datasetName} queries (${queryDef.queries.length} total):\n`);
    for (const q of queryDef.queries) {
      const filterStr = q.filter ? ` [filter: ${JSON.stringify(q.filter)}]` : '';
      console.log(`  ${q.id}`);
      console.log(`    ${q.description}`);
      console.log(`    ${q.operation}(${q.column})${filterStr} → expected: ${q.expected}`);
    }
    return;
  }

  if (args.includes('--try')) {
    const tryIdx = args.indexOf('--try');
    const queryStr = args[tryIdx + 1];
    if (!queryStr) {
      console.error('Provide a query string after --try');
      process.exit(1);
    }
    const { query, result, rowCount } = parseTryQuery(queryStr, rows);
    console.log(`\nAd-hoc query: ${queryStr}`);
    console.log(`  Parsed: ${query.operation}(${query.column})${query.filter ? ` filter=${JSON.stringify(query.filter)}` : ''}`);
    console.log(`  Rows matched: ${rowCount}`);
    console.log(`  Result: ${typeof result === 'number' ? result.toFixed(6) : result}`);
    return;
  }

  console.log(`\nRunning ${queryDef.queries.length} queries against ${datasetName} (${rows.length} rows)\n`);
  console.log('='.repeat(72));

  let passed = 0;
  let failed = 0;

  for (const query of queryDef.queries) {
    try {
      const actual = executeQuery(rows, query);
      const ok = assertClose(actual, query.expected, query.tolerance ?? 1e-6);
      const status = ok ? 'PASS' : 'FAIL';
      const icon = ok ? '✓' : '✗';

      if (ok) passed++;
      else failed++;

      const actualStr = typeof actual === 'number' ? actual.toFixed(6) : String(actual);
      const expectedStr = typeof query.expected === 'number' ? query.expected.toFixed(6) : String(query.expected);

      console.log(`${icon} [${status}] ${query.id}`);
      console.log(`       ${query.description}`);
      if (!ok) {
        console.log(`       expected: ${expectedStr}, got: ${actualStr} (tolerance: ${query.tolerance})`);
      } else {
        console.log(`       result: ${actualStr}`);
      }
    } catch (err) {
      failed++;
      console.log(`✗ [ERROR] ${query.id}: ${err.message}`);
    }
  }

  console.log('='.repeat(72));
  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${queryDef.queries.length}\n`);

  if (failed > 0) process.exit(1);
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
