#!/usr/bin/env node
/**
 * Bundle Size Checker for CI
 *
 * Checks that bundle sizes don't exceed thresholds.
 * Fails with exit code 1 if any threshold is exceeded.
 *
 * Usage:
 *   node scripts/check-bundle-size.js [--update-baseline]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { gzipSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const BASELINE_FILE = join(ROOT_DIR, 'size-baseline.json');

// Size thresholds (gzipped KB) - allow 10% growth before failing
const GROWTH_TOLERANCE = 0.10;

// Modules to check
const MODULES = [
  { name: 'stats', jsPath: 'dist/stats.js', wasmPath: 'pkg/stat-wasm-stats/stat_wasm_stats_bg.wasm' },
  { name: 'distributions', jsPath: 'dist/distributions.js', wasmPath: 'pkg/stat-wasm-distributions/stat_wasm_distributions_bg.wasm' },
  { name: 'quantiles', jsPath: 'dist/quantiles.js', wasmPath: 'pkg/stat-wasm-quantiles/stat_wasm_quantiles_bg.wasm' },
  { name: 'correlation', jsPath: 'dist/correlation.js', wasmPath: 'pkg/stat-wasm-correlation/stat_wasm_correlation_bg.wasm' },
  { name: 'tests', jsPath: 'dist/tests.js', wasmPath: 'pkg/stat-wasm-tests/stat_wasm_tests_bg.wasm' },
  { name: 'index', jsPath: 'dist/index.js', wasmPath: 'pkg/stat-wasm/stat_wasm_bg.wasm' },
];

function getFileSize(filePath) {
  const fullPath = join(ROOT_DIR, filePath);
  if (!existsSync(fullPath)) {
    return { raw: 0, gzipped: 0 };
  }
  const content = readFileSync(fullPath);
  const gzipped = gzipSync(content);
  return {
    raw: content.length,
    gzipped: gzipped.length,
  };
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(2);
}

function main() {
  const updateBaseline = process.argv.includes('--update-baseline');
  
  console.log('📦 Checking bundle sizes...\n');

  const currentSizes = {};
  let hasError = false;

  // Load baseline if exists
  let baseline = {};
  if (existsSync(BASELINE_FILE)) {
    try {
      baseline = JSON.parse(readFileSync(BASELINE_FILE, 'utf-8'));
    } catch {
      console.log('⚠️  Could not parse baseline file, will create new baseline.\n');
    }
  }

  // Measure current sizes
  console.log('Module              JS (gzip)    WASM (gzip)   Total (gzip)  Status');
  console.log('─'.repeat(75));

  for (const mod of MODULES) {
    const jsSize = getFileSize(mod.jsPath);
    const wasmSize = getFileSize(mod.wasmPath);
    const totalGzipped = jsSize.gzipped + wasmSize.gzipped;

    currentSizes[mod.name] = {
      js: jsSize.gzipped,
      wasm: wasmSize.gzipped,
      total: totalGzipped,
    };

    // Check against baseline
    let status = '✅';
    let statusNote = '';
    
    if (baseline[mod.name]) {
      const baselineTotal = baseline[mod.name].total;
      const growth = (totalGzipped - baselineTotal) / baselineTotal;
      
      if (growth > GROWTH_TOLERANCE) {
        status = '❌';
        statusNote = ` (+${(growth * 100).toFixed(1)}%)`;
        hasError = true;
      } else if (growth > 0.05) {
        status = '⚠️';
        statusNote = ` (+${(growth * 100).toFixed(1)}%)`;
      } else if (growth < -0.05) {
        status = '🎉';
        statusNote = ` (${(growth * 100).toFixed(1)}%)`;
      }
    } else {
      status = '🆕';
      statusNote = ' (no baseline)';
    }

    const name = mod.name.padEnd(18);
    const jsKB = formatKB(jsSize.gzipped).padStart(8) + 'KB';
    const wasmKB = formatKB(wasmSize.gzipped).padStart(8) + 'KB';
    const totalKB = formatKB(totalGzipped).padStart(8) + 'KB';
    
    console.log(`${name} ${jsKB}    ${wasmKB}     ${totalKB}    ${status}${statusNote}`);
  }

  console.log('─'.repeat(75));
  console.log('');

  if (updateBaseline) {
    writeFileSync(BASELINE_FILE, JSON.stringify(currentSizes, null, 2) + '\n');
    console.log(`✅ Baseline updated: ${BASELINE_FILE}\n`);
  } else if (hasError) {
    console.log('❌ Bundle size check FAILED! One or more modules exceeded the size threshold.');
    console.log(`   Threshold: ${(GROWTH_TOLERANCE * 100).toFixed(0)}% growth allowed`);
    console.log('');
    console.log('   To update the baseline (if the growth is intentional):');
    console.log('   node scripts/check-bundle-size.js --update-baseline');
    console.log('');
    process.exit(1);
  } else {
    console.log('✅ Bundle size check passed!\n');
  }
}

main();






