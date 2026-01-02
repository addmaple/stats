#!/usr/bin/env node

/**
 * SIMD Analysis Script for Stats
 * 
 * Builds scalar and SIMD variants of the stats WASM modules,
 * then analyzes SIMD instruction usage.
 */

import { execSync, spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PACKAGE_DIR = dirname(__dirname)
const ROOT_DIR = join(PACKAGE_DIR, '../../..')
const OUTPUT_DIR = join(PACKAGE_DIR, 'simd_analysis')

// Modules to analyze
const MODULES = [
  'stat-wasm-stats',
  'stat-wasm-correlation', 
  'stat-wasm-quantiles',
]

// Path to simd-detect binary (from wasm-bindgen-lite)
const SIMD_DETECT = join(PACKAGE_DIR, 'node_modules/wasm-bindgen-lite/bench/simd-detect/target/release/simd-detect')

function run(cmd, options = {}) {
  console.log(`> ${cmd}`)
  try {
    return execSync(cmd, { stdio: 'inherit', ...options })
  } catch (err) {
    console.error(`Command failed: ${cmd}`)
    throw err
  }
}

function runSimdDetect(wasmPath, variantName) {
  if (!existsSync(SIMD_DETECT)) {
    console.warn('simd-detect not found at:', SIMD_DETECT)
    console.log('Building simd-detect...')
    const simdDetectDir = join(PACKAGE_DIR, 'node_modules/wasm-bindgen-lite/bench/simd-detect')
    if (existsSync(simdDetectDir)) {
      run(`cargo build --release`, { cwd: simdDetectDir })
    } else {
      console.error('simd-detect directory not found. Make sure wasm-bindgen-lite is installed.')
      return null
    }
  }
  
  try {
    const output = execSync(`"${SIMD_DETECT}" "${wasmPath}" --variant ${variantName}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    })
    return JSON.parse(output)
  } catch (err) {
    console.warn(`simd-detect failed: ${err.message}`)
    return null
  }
}

function buildVariant(moduleName, variant) {
  const crateDir = join(ROOT_DIR, 'crates', moduleName)
  const targetDir = join(ROOT_DIR, 'target')
  const wasmName = moduleName.replace(/-/g, '_')
  
  console.log(`\nBuilding ${moduleName} (${variant.name})...`)
  
  const env = { ...process.env, RUSTFLAGS: variant.rustflags }
  
  const args = [
    'build',
    '--release',
    '--target', 'wasm32-unknown-unknown',
    '--manifest-path', join(crateDir, 'Cargo.toml'),
  ]
  
  const result = spawnSync('cargo', args, { env, stdio: 'inherit' })
  if (result.status !== 0) {
    throw new Error(`Build failed for ${moduleName} ${variant.name}`)
  }
  
  const srcWasm = join(targetDir, 'wasm32-unknown-unknown', 'release', `${wasmName}.wasm`)
  return srcWasm
}

function computeHash(filePath) {
  const data = readFileSync(filePath)
  return createHash('sha256').update(data).digest('hex').slice(0, 16)
}

function formatSize(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

async function main() {
  console.log('═'.repeat(60))
  console.log(' Stats WASM SIMD Analysis')
  console.log('═'.repeat(60))
  
  // Variants to build
  const variants = [
    {
      name: 'scalar',
      description: 'Scalar baseline (no SIMD128)',
      rustflags: '-C opt-level=3',
    },
    {
      name: 'simd',
      description: 'SIMD via wide crate (+simd128)',
      rustflags: '-C opt-level=3 -C target-feature=+simd128',
    },
  ]
  
  // Create output directory
  mkdirSync(OUTPUT_DIR, { recursive: true })
  mkdirSync(join(OUTPUT_DIR, 'dist'), { recursive: true })
  
  const results = {
    generated: new Date().toISOString(),
    modules: {},
  }
  
  for (const moduleName of MODULES) {
    console.log(`\n${'─'.repeat(60)}`)
    console.log(`Module: ${moduleName}`)
    console.log('─'.repeat(60))
    
    results.modules[moduleName] = {
      variants: {},
      provenance: {},
    }
    
    for (const variant of variants) {
      try {
        const srcWasm = buildVariant(moduleName, variant)
        const destWasm = join(OUTPUT_DIR, 'dist', `${moduleName}-${variant.name}.wasm`)
        copyFileSync(srcWasm, destWasm)
        
        const wasmData = readFileSync(destWasm)
        const hash = computeHash(destWasm)
        
        console.log(`  ✓ ${variant.name}: ${formatSize(wasmData.length)}`)
        
        // Run SIMD analysis
        const simdReport = runSimdDetect(destWasm, `${moduleName}-${variant.name}`)
        
        results.modules[moduleName].variants[variant.name] = {
          path: `${moduleName}-${variant.name}.wasm`,
          size: wasmData.length,
          hash,
          simd: simdReport,
        }
        
        if (simdReport) {
          console.log(`    SIMD ops: ${simdReport.total_simd_ops} / ${simdReport.total_ops} (${(simdReport.overall_simd_density * 100).toFixed(1)}%)`)
          
          // Show top opcodes
          const opcodes = Object.entries(simdReport.opcode_summary || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
          if (opcodes.length > 0) {
            console.log(`    Top opcodes: ${opcodes.map(([op, count]) => `${op}(${count})`).join(', ')}`)
          }
        }
      } catch (err) {
        console.error(`  ✗ ${variant.name}: ${err.message}`)
      }
    }
    
    // Compute provenance for this module
    const scalar = results.modules[moduleName].variants['scalar']?.simd
    const simd = results.modules[moduleName].variants['simd']?.simd
    
    if (scalar && simd) {
      results.modules[moduleName].provenance = {
        scalar_ops: scalar.total_simd_ops,
        simd_ops: simd.total_simd_ops,
        simd_added: simd.total_simd_ops - scalar.total_simd_ops,
        scalar_size: results.modules[moduleName].variants['scalar'].size,
        simd_size: results.modules[moduleName].variants['simd'].size,
        size_delta: results.modules[moduleName].variants['simd'].size - results.modules[moduleName].variants['scalar'].size,
      }
    }
  }
  
  // Write JSON report
  const jsonPath = join(OUTPUT_DIR, 'report.json')
  writeFileSync(jsonPath, JSON.stringify(results, null, 2))
  
  // Generate summary
  console.log('\n' + '═'.repeat(60))
  console.log(' Summary')
  console.log('═'.repeat(60))
  
  console.log('\n| Module | Scalar SIMD | SIMD128 SIMD | Added | Size Delta |')
  console.log('|--------|-------------|--------------|-------|------------|')
  
  for (const [moduleName, data] of Object.entries(results.modules)) {
    const p = data.provenance
    if (p) {
      const sizeDelta = p.size_delta > 0 ? `+${formatSize(p.size_delta)}` : formatSize(p.size_delta)
      console.log(`| ${moduleName} | ${p.scalar_ops} | ${p.simd_ops} | +${p.simd_added} | ${sizeDelta} |`)
    }
  }
  
  // Generate HTML report
  const html = generateHtmlReport(results)
  const htmlPath = join(OUTPUT_DIR, 'report.html')
  writeFileSync(htmlPath, html)
  
  console.log(`\nReports written to: ${OUTPUT_DIR}`)
  console.log(`  - ${jsonPath}`)
  console.log(`  - ${htmlPath}`)
}

function generateHtmlReport(results) {
  const rows = Object.entries(results.modules).map(([name, data]) => {
    const p = data.provenance
    if (!p) return ''
    
    const sizeDelta = p.size_delta > 0 ? `+${formatSize(p.size_delta)}` : formatSize(p.size_delta)
    const simdClass = p.simd_added > 100 ? 'high' : p.simd_added > 10 ? 'medium' : ''
    
    return `
      <tr>
        <td class="module">${name}</td>
        <td>${p.scalar_ops}</td>
        <td class="${simdClass}">${p.simd_ops}</td>
        <td class="added ${simdClass}">+${p.simd_added}</td>
        <td>${formatSize(p.scalar_size)}</td>
        <td>${formatSize(p.simd_size)}</td>
        <td class="delta">${sizeDelta}</td>
      </tr>
    `
  }).join('')
  
  // Detailed breakdown per module
  const details = Object.entries(results.modules).map(([name, data]) => {
    const simdVariant = data.variants['simd']?.simd
    if (!simdVariant) return ''
    
    const funcs = (simdVariant.functions || [])
      .filter(f => f.simd_ops_total > 0)
      .slice(0, 10)
      .map(f => `
        <tr>
          <td>${f.name || `func_${f.index}`}</td>
          <td>${f.simd_ops_total}</td>
          <td>${(f.simd_density * 100).toFixed(1)}%</td>
          <td>${Object.entries(f.op_breakdown || {}).map(([op, n]) => `${op}(${n})`).join(', ')}</td>
        </tr>
      `).join('')
    
    return `
      <h3>${name}</h3>
      <table>
        <thead><tr><th>Function</th><th>SIMD Ops</th><th>Density</th><th>Opcodes</th></tr></thead>
        <tbody>${funcs || '<tr><td colspan="4">No SIMD functions</td></tr>'}</tbody>
      </table>
    `
  }).join('')
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stats SIMD Analysis</title>
  <style>
    :root { --bg: #0a0a0a; --surface: #141414; --border: #2a2a2a; --text: #e8e8e8; --dim: #777; --accent: #ff6b35; --green: #4ade80; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'SF Mono', monospace; background: var(--bg); color: var(--text); padding: 2rem; }
    h1 { color: var(--accent); margin-bottom: 0.5rem; }
    h2 { margin: 2rem 0 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
    h3 { color: var(--accent); margin: 1.5rem 0 0.75rem; font-size: 1rem; }
    table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 8px; overflow: hidden; font-size: 0.85rem; margin-bottom: 1rem; }
    th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
    th { background: rgba(255,107,53,0.1); color: var(--accent); font-size: 0.75rem; text-transform: uppercase; }
    .module { font-weight: 500; }
    .added { color: var(--green); }
    .high { color: var(--green); font-weight: bold; }
    .medium { color: #facc15; }
    .delta { color: var(--dim); }
    .subtitle { color: var(--dim); font-size: 0.85rem; margin-bottom: 2rem; }
    details { margin-top: 1.5rem; }
    summary { cursor: pointer; color: var(--accent); font-weight: 500; }
  </style>
</head>
<body>
  <h1>Stats WASM SIMD Analysis</h1>
  <p class="subtitle">Generated: ${results.generated}</p>
  
  <h2>Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Scalar SIMD</th>
        <th>SIMD128 SIMD</th>
        <th>Added</th>
        <th>Scalar Size</th>
        <th>SIMD Size</th>
        <th>Delta</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  
  <h2>Function Breakdown</h2>
  <p class="subtitle">Top functions with SIMD instructions (simd128 variant)</p>
  ${details}
</body>
</html>`
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
