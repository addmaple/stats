#!/usr/bin/env node

/**
 * Helper script to generate test files from jstat test cases
 * 
 * Usage:
 *   node scripts/generate-test.js <jstat-test-file> <output-file> <function-name>
 * 
 * Example:
 *   node scripts/generate-test.js ../bench/node_modules/jstat/test/vector/mean-test.js test/jstat/vector/mean.test.js mean
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jstatTestFile = process.argv[2];
const outputFile = process.argv[3];
const functionName = process.argv[4];

if (!jstatTestFile || !outputFile || !functionName) {
  console.error('Usage: node generate-test.js <jstat-test-file> <output-file> <function-name>');
  process.exit(1);
}

// Read jstat test file
const jstatTestContent = fs.readFileSync(jstatTestFile, 'utf8');

// Extract test cases (simplified parser)
const testCases = [];
const suiteMatch = jstatTestContent.match(/suite\.addBatch\(\{([\s\S]*?)\}\)/);
if (suiteMatch) {
  const batchContent = suiteMatch[1];
  // Simple extraction - this is a basic parser
  const testMatch = batchContent.match(/'([^']+)':\s*\{[\s\S]*?'topic':\s*function\(\)\s*\{[\s\S]*?\},([\s\S]*?)\}/g);
  if (testMatch) {
    testMatch.forEach(match => {
      const nameMatch = match.match(/'([^']+)':/);
      if (nameMatch) {
        testCases.push(nameMatch[1]);
      }
    });
  }
}

// Generate test file template
const testTemplate = `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init, ${functionName} } from '@stats/core';
import jStat from 'jstat';

describe('${functionName} - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });

  // TODO: Add test cases from jstat test file
  // Source: ${path.basename(jstatTestFile)}
  
  it('basic test', async () => {
    await init();
    const data = [1, 2, 3];
    const jstatResult = jStat.${functionName}(data);
    const ourResult = ${functionName}(data);
    assert.equal(ourResult, jstatResult);
  });
});
`;

// Write output file
const outputPath = path.resolve(__dirname, '..', outputFile);
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(outputPath, testTemplate);
console.log(`Generated test file: ${outputPath}`);
console.log(`Found ${testCases.length} test cases in jstat file`);
console.log('Please review and update the test file with actual test cases from the jstat test file.');

