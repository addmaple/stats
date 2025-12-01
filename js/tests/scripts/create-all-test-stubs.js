#!/usr/bin/env node

/**
 * Create test stub files for ALL jstat test cases
 * This creates empty test files that can be filled in manually
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const JSTAT_TEST_DIR = path.join(PROJECT_ROOT, 'js/bench/node_modules/jstat/test');
const OUR_TEST_DIR = path.resolve(__dirname, '../test/jstat');

const CATEGORIES = [
  { jstat: 'vector', ours: 'vector' },
  { jstat: 'distribution', ours: 'distribution' },
  { jstat: 'test', ours: 'test' },
  { jstat: 'models', ours: 'models' },
];

function createTestStub(category, functionName, jstatTestPath) {
  const outputDir = path.join(OUR_TEST_DIR, category);
  const outputFile = path.join(outputDir, `${functionName}.test.js`);
  
  if (fs.existsSync(outputFile)) {
    return false; // Already exists
  }
  
  const jstatContent = fs.readFileSync(jstatTestPath, 'utf8');
  
  // Extract expected values from assertions
  const assertions = [];
  const assertMatches = jstatContent.matchAll(/assert\.(equal|epsilon|deepEqual|isTrue|isFalse)\(([^)]+)\)/g);
  for (const match of assertMatches) {
    assertions.push(match[0]);
  }
  
  const testContent = `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init } from '@stats/core';
import jStat from 'jstat';

// Generated from: ${path.basename(jstatTestPath)}
// TODO: Import the function(s) you need from '@stats/core'
// TODO: Convert jstat test cases below to use our API

describe('${functionName} - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  // Original jstat assertions found:
${assertions.slice(0, 5).map(a => `  // ${a}`).join('\n')}
${assertions.length > 5 ? `  // ... and ${assertions.length - 5} more` : ''}

  // TODO: Add test cases here
  // Example:
  // it('basic test', async () => {
  //   await init();
  //   const data = [1, 2, 3];
  //   const jstatResult = jStat.${functionName}(data);
  //   const ourResult = ${functionName}(data); // Import this function
  //   assert.equal(ourResult, jstatResult);
  // });
});
`;
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, testContent);
  return true;
}

function processCategory(category) {
  const jstatCategoryDir = path.join(JSTAT_TEST_DIR, category.jstat);
  
  if (!fs.existsSync(jstatCategoryDir)) {
    console.log(`⚠️  Category ${category.jstat} not found`);
    return { created: 0, skipped: 0 };
  }
  
  console.log(`\n📁 Processing category: ${category.jstat}`);
  
  const testFiles = fs.readdirSync(jstatCategoryDir)
    .filter(f => f.endsWith('-test.js'));
  
  let created = 0;
  let skipped = 0;
  
  for (const testFile of testFiles) {
    const functionName = testFile.replace('-test.js', '');
    const jstatTestPath = path.join(jstatCategoryDir, testFile);
    
    if (createTestStub(category.ours, functionName, jstatTestPath)) {
      created++;
      console.log(`  ✅ Created ${functionName}.test.js`);
    } else {
      skipped++;
    }
  }
  
  return { created, skipped };
}

// Main
console.log('🚀 Creating test stubs for all jstat test cases...\n');

let totalCreated = 0;
let totalSkipped = 0;

for (const category of CATEGORIES) {
  const { created, skipped } = processCategory(category);
  totalCreated += created;
  totalSkipped += skipped;
}

console.log(`\n✨ Done!`);
console.log(`   Created: ${totalCreated} test files`);
console.log(`   Skipped: ${totalSkipped} (already exist)`);
console.log(`\n📝 Next steps:`);
console.log(`   1. Review generated test files`);
console.log(`   2. Import the appropriate functions from '@stats/core'`);
console.log(`   3. Convert jstat API calls to our API`);
console.log(`   4. Add proper assertions`);
console.log(`   5. Run tests: npm test`);

