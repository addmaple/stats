#!/usr/bin/env node

/**
 * Script to systematically import ALL jstat test cases
 * 
 * This script:
 * 1. Scans jstat test directory
 * 2. For each test file, creates a corresponding test file in our test suite
 * 3. Converts jstat's vows.js format to Node.js test format
 * 4. Maps jstat API calls to our API calls
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths - script is in js/tests/scripts/, so go up to project root
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const JSTAT_TEST_DIR = path.join(PROJECT_ROOT, 'js/bench/node_modules/jstat/test');
const OUR_TEST_DIR = path.resolve(__dirname, '../test/jstat');

// Debug: log paths
console.log('JSTAT_TEST_DIR:', JSTAT_TEST_DIR);
console.log('OUR_TEST_DIR:', OUR_TEST_DIR);
console.log('JSTAT_TEST_DIR exists:', fs.existsSync(JSTAT_TEST_DIR));

// Function name mappings from jstat to our API
const FUNCTION_MAPPINGS = {
  // Vector operations
  'mean': 'mean',
  'variance': 'variance',
  'stdev': 'stdev',
  'sum': 'sum',
  'median': 'median',
  'min': 'min',
  'max': 'max',
  'range': 'range',
  'skewness': 'skewness',
  'kurtosis': 'kurtosis',
  'corrcoeff': 'corrcoeff',
  'covariance': 'covariance',
  'spearmancoeff': 'spearmancoeff',
  'quantiles': 'quantiles',
  'percentile': 'percentileInclusive', // Note: jstat uses false by default (inclusive)
  'geomean': 'geomean',
  'product': 'product',
  'cumsum': 'cumsum',
  'cumprod': 'cumprod',
  'diff': 'diff',
  'rank': 'rank',
  'mode': 'mode',
  'coeffvar': 'coeffvar',
  'deviation': 'deviation',
  'meandev': 'meandev',
  'meddev': 'meddev',
  'histogram': 'histogram',
  'quartiles': 'quartiles',
  'percentileOfScore': 'percentileOfScore',
  
  // Distributions - these use a different API pattern
  'normal': 'normal', // Returns distribution handle
  'gamma': 'gamma',
  'beta': 'beta',
  'studentt': 'studentT',
  'chisquare': 'chiSquared',
  'fisherf': 'fisherF',
  'exponential': 'exponential',
  'poisson': 'poisson',
  'binomial': 'binomial',
  'uniform': 'uniform',
  'cauchy': 'cauchy',
  'laplace': 'laplace',
  'lognormal': 'lognormal',
  'weibull': 'weibull',
  'pareto': 'pareto',
  'triangular': 'triangular',
  'invgamma': 'invgamma',
  'negbin': 'negbin',
};

// Categories to process
const CATEGORIES = [
  { jstat: 'vector', ours: 'vector', skip: [] },
  { jstat: 'distribution', ours: 'distribution', skip: ['arcsine', 'kumaraswamy', 'noncentralt', 'central-f', 'tukey'] }, // Skip unimplemented
  { jstat: 'test', ours: 'test', skip: [] },
  { jstat: 'models', ours: 'models', skip: [] },
];

function extractTestCases(jstatTestContent) {
  const testCases = [];
  
  // Extract suite.addBatch content - need to handle nested braces properly
  const batchMatch = jstatTestContent.match(/suite\.addBatch\(\{([\s\S]*)\}\)/);
  if (!batchMatch) {
    // Try alternative format
    const altMatch = jstatTestContent.match(/addBatch\(\{([\s\S]*)\}\)/);
    if (!altMatch) return testCases;
    return extractFromBatch(altMatch[1], testCases);
  }
  
  return extractFromBatch(batchMatch[1], testCases);
}

function extractFromBatch(batchContent, testCases) {
  // Find all test groups - match 'key': { ... } patterns
  // Need to handle nested braces by counting them
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let start = -1;
  let groupName = '';
  
  for (let i = 0; i < batchContent.length; i++) {
    const char = batchContent[i];
    const prevChar = i > 0 ? batchContent[i - 1] : '';
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === "'" && prevChar !== '\\') {
      inString = !inString;
      continue;
    }
    
    if (inString) continue;
    
    if (char === '{') {
      if (depth === 0 && start === -1) {
        // Find the key before this brace
        const beforeBrace = batchContent.substring(Math.max(0, i - 50), i);
        const keyMatch = beforeBrace.match(/'([^']+)':\s*\{/);
        if (keyMatch && !keyMatch[1].startsWith('#')) {
          start = i;
          groupName = keyMatch[1];
        }
      }
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0 && start !== -1) {
        const groupContent = batchContent.substring(start + 1, i);
        extractTestsFromGroup(groupName, groupContent, testCases);
        start = -1;
        groupName = '';
      }
    }
  }
  
  return testCases;
}

function extractTestsFromGroup(groupName, groupContent, testCases) {
  // Extract test functions from group content
  // Pattern: 'testName': function(...) { ... }
  const testRegex = /'([^']+)':\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\}(?=\s*[,}])/g;
  let testMatch;
  
  while ((testMatch = testRegex.exec(groupContent)) !== null) {
    const testName = testMatch[1];
    const testBody = testMatch[2];
    
    // Skip topic functions
    if (testName === 'topic') continue;
    
    testCases.push({
      group: groupName,
      name: testName,
      body: testBody.trim(),
    });
  }
}

function convertJstatCallToOurAPI(jstatCall, functionName) {
  // Convert jStat.functionName(...) or jStat(data).functionName(...)
  // to ourFunctionName(...)
  
  // Handle jStat.functionName(data) pattern
  let converted = jstatCall.replace(/jStat\.([a-zA-Z]+)\(/g, (match, fn) => {
    const ourFn = FUNCTION_MAPPINGS[fn] || fn;
    return `${ourFn}(`;
  });
  
  // Handle jStat(data).functionName() pattern
  converted = converted.replace(/jStat\(([^)]+)\)\.([a-zA-Z]+)\(/g, (match, data, fn) => {
    const ourFn = FUNCTION_MAPPINGS[fn] || fn;
    return `${ourFn}(${data}, `;
  });
  
  // Handle jStat(data).functionName(true) pattern (for matrix operations)
  converted = converted.replace(/jStat\(([^)]+)\)\.([a-zA-Z]+)\(true\)/g, (match, data, fn) => {
    // Matrix operations not yet implemented
    return `/* Matrix operation: ${fn}(${data}, true) - not yet implemented */ null`;
  });
  
  return converted;
}

function generateTestFile(jstatTestPath, category, functionName) {
  const jstatContent = fs.readFileSync(jstatTestPath, 'utf8');
  const testCases = extractTestCases(jstatContent);
  
  if (testCases.length === 0) {
    console.warn(`  ⚠️  No test cases extracted from ${path.basename(jstatTestPath)}`);
    return false;
  }
  
  const ourFunctionName = FUNCTION_MAPPINGS[functionName] || functionName;
  const outputDir = path.join(OUR_TEST_DIR, category);
  const outputFile = path.join(outputDir, `${functionName}.test.js`);
  
  // Check if file already exists
  if (fs.existsSync(outputFile)) {
    console.log(`  ⏭️  Skipping ${functionName}.test.js (already exists)`);
    return false;
  }
  
  // Generate test file content
  let testContent = `import { describe, it } from 'node:test';
import assert from 'node:assert';
import { init`;
  
  // Add imports based on function type
  if (category === 'distribution') {
    testContent += `, ${ourFunctionName}`;
  } else {
    testContent += `, ${ourFunctionName}`;
  }
  
  testContent += ` } from '@stats/core';
import jStat from 'jstat';

// Generated from jstat test: ${path.basename(jstatTestPath)}
describe('${functionName} - jstat compatibility', () => {
  it('should initialize wasm module', async () => {
    await init();
  });
`;

  // Add test cases
  for (const testCase of testCases) {
    const testName = testCase.name.replace(/'/g, '');
    testContent += `
  it('${testName}', async () => {
    await init();
    // TODO: Convert this test case from jstat format
    // Original: ${testCase.body.substring(0, 100)}...
    // You may need to manually convert jStat API calls to our API
  });
`;
  }
  
  testContent += `});
`;
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputFile, testContent);
  console.log(`  ✅ Created ${functionName}.test.js (${testCases.length} test cases)`);
  return true;
}

function processCategory(category) {
  const jstatCategoryDir = path.join(JSTAT_TEST_DIR, category.jstat);
  const ourCategoryDir = path.join(OUR_TEST_DIR, category.ours);
  
  if (!fs.existsSync(jstatCategoryDir)) {
    console.log(`⚠️  Category ${category.jstat} not found in jstat tests`);
    return;
  }
  
  console.log(`\n📁 Processing category: ${category.jstat}`);
  
  const testFiles = fs.readdirSync(jstatCategoryDir)
    .filter(f => f.endsWith('-test.js'))
    .filter(f => !category.skip.some(skip => f.includes(skip)));
  
  let created = 0;
  let skipped = 0;
  
  for (const testFile of testFiles) {
    const functionName = testFile.replace('-test.js', '');
    const jstatTestPath = path.join(jstatCategoryDir, testFile);
    
    if (generateTestFile(jstatTestPath, category.ours, functionName)) {
      created++;
    } else {
      skipped++;
    }
  }
  
  console.log(`   Created: ${created}, Skipped: ${skipped}`);
}

// Main execution
console.log('🚀 Importing all jstat test cases...\n');

for (const category of CATEGORIES) {
  processCategory(category);
}

console.log('\n✨ Done!');
console.log('\n📝 Next steps:');
console.log('   1. Review generated test files');
console.log('   2. Manually convert jStat API calls to our API');
console.log('   3. Add proper assertions based on jstat test expectations');
console.log('   4. Run tests: npm test');

