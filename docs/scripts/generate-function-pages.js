#!/usr/bin/env node

/**
 * Generates individual function pages from TypeScript source
 * Creates a markdown file for each exported function with interactive code examples
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcPath = join(__dirname, '../../js/package/src/index.ts');
const outputDir = join(__dirname, '../api/functions');

// Function categories for organization
const functionCategories = {
  'basic-statistics': ['sum', 'mean', 'variance', 'sampleVariance', 'stdev', 'sampleStdev', 'min', 'max', 'product', 'range'],
  'advanced-statistics': ['median', 'mode', 'geomean', 'skewness', 'kurtosis', 'coeffvar', 'deviation', 'meandev', 'meddev'],
  'quantiles-percentiles': ['percentile', 'percentileOfScore', 'quantiles', 'quartiles', 'iqr', 'qscore', 'qtest'],
  'correlation-covariance': ['covariance', 'corrcoeff', 'spearmancoeff'],
  'distributions': ['normal', 'gamma', 'beta', 'studentT', 'chiSquared', 'fisherF', 'exponential', 'poisson', 'binomial', 'uniform', 'cauchy', 'laplace', 'logNormal', 'weibull', 'pareto', 'triangular', 'inverseGamma', 'negativeBinomial'],
  'statistical-tests': ['anovaFScore', 'anovaTest', 'anovaFScoreCategorical', 'anovaTestCategorical', 'chiSquareTest', 'ttest', 'ztest'],
  'transformations': ['cumsum', 'cumprod', 'diff', 'rank', 'histogram', 'histogramEdges', 'cumreduce'],
  'regression': ['regress', 'normalci', 'tci'],
};

function extractJSDoc(tsContent, functionName) {
  // Find the function definition
  const functionRegex = new RegExp(
    `(?:export\\s+)?(?:async\\s+)?function\\s+${functionName}\\s*\\([^)]*\\)[^{]*\\{`,
    'm'
  );
  
  // Find JSDoc comments before the function
  const beforeFunction = tsContent.substring(0, tsContent.search(functionRegex));
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  const matches = [...beforeFunction.matchAll(jsdocRegex)];
  
  // Find the JSDoc that's closest to the function (last one before it)
  if (matches.length === 0) return null;
  
  const lastMatch = matches[matches.length - 1];
  const jsdocContent = lastMatch[1];
  
  // Extract description (everything before first @param, @returns, @example, etc.)
  const descriptionLines = [];
  const lines = jsdocContent.split(/\n/);
  for (const line of lines) {
    const cleaned = line.replace(/^\s*\*\s?/, '').trim();
    if (cleaned.startsWith('@')) break;
    if (cleaned) descriptionLines.push(cleaned);
  }
  const description = descriptionLines.join(' ').trim();
  
  const params = [];
  const paramRegex = /@param\s+(\w+)\s*-\s*([^\n]+)/g;
  let paramMatch;
  while ((paramMatch = paramRegex.exec(jsdocContent)) !== null) {
    params.push({
      name: paramMatch[1],
      description: paramMatch[2].trim(),
    });
  }
  
  const returnsMatch = jsdocContent.match(/@returns\s+([^\n]+)/);
  const returns = returnsMatch ? returnsMatch[1].trim() : null;
  
  const examples = [];
  const exampleRegex = /@example\s*\n\s*```(?:js|javascript)?\n([\s\S]*?)```/g;
  let exampleMatch;
  while ((exampleMatch = exampleRegex.exec(jsdocContent)) !== null) {
    examples.push(exampleMatch[1].trim());
  }
  
  return {
    description,
    params,
    returns,
    examples,
  };
}

function generateFunctionPage(functionName, jsdoc, category) {
  // Generate a better default example based on function signature
  let defaultExample;
  if (jsdoc.examples && jsdoc.examples.length > 0) {
    defaultExample = jsdoc.examples[0];
  } else {
    // Generate a simple example based on function name
    if (functionName === 'sum' || functionName === 'mean' || functionName === 'median' || functionName === 'min' || functionName === 'max') {
      defaultExample = `import { init, ${functionName} } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const result = ${functionName}(data);
console.log(result);`;
    } else if (functionName === 'corrcoeff' || functionName === 'covariance' || functionName === 'spearmancoeff') {
      defaultExample = `import { init, ${functionName} } from '@stats/core';
await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const result = ${functionName}(x, y);
console.log(result);`;
    } else if (functionName.startsWith('normal') || functionName.startsWith('gamma') || functionName.startsWith('beta')) {
      defaultExample = `import { init, ${functionName} } from '@stats/core';
await init();

const dist = ${functionName}({ mean: 0, sd: 1 });
const result = dist.pdf(0);
console.log(result);`;
    } else {
      defaultExample = `import { init, ${functionName} } from '@stats/core';
await init();

// Example usage
const result = ${functionName}(/* your parameters */);
console.log(result);`;
    }
  }

  const paramsTable = jsdoc.params && jsdoc.params.length > 0
    ? `\n### Parameters\n\n| Name | Description |\n|------|-------------|\n${jsdoc.params.map(p => `| \`${p.name}\` | ${p.description} |`).join('\n')}\n`
    : '';

  const returnsSection = jsdoc.returns
    ? `\n### Returns\n\n${jsdoc.returns}\n`
    : '';

  const examplesSection = jsdoc.examples && jsdoc.examples.length > 0
    ? `\n### Examples\n\n${jsdoc.examples.map((ex, i) => `#### Example ${i + 1}\n\n\`\`\`js\n${ex}\n\`\`\``).join('\n\n')}\n`
    : '';

  // Escape YAML description - wrap in quotes if it contains special characters
  const description = jsdoc.description || `${functionName} function`;
  const escapedDescription = description.includes(':') || description.includes('`') || description.includes('*') || description.includes('|') || description.includes('\n')
    ? `"${description.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ')}"`
    : description;

  return `---
title: ${functionName}
description: ${escapedDescription}
---

# ${functionName}

${jsdoc.description || `The \`${functionName}\` function.`}
${paramsTable}${returnsSection}${examplesSection}

## Try it out

<InteractiveCode default-code="${defaultExample.replace(/"/g, '&quot;').replace(/\n/g, '&#10;')}" />
`;
}

async function generatePages() {
  try {
    // Read TypeScript source
    const tsContent = await readFile(srcPath, 'utf-8');
    
    // Create output directory
    await mkdir(outputDir, { recursive: true });
    
    // Find all exported functions
    const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
    const functions = [];
    let match;
    
    while ((match = functionRegex.exec(tsContent)) !== null) {
      const functionName = match[1];
      // Skip init function
      if (functionName === 'init') continue;
      functions.push(functionName);
    }
    
    console.log(`Found ${functions.length} functions`);
    
    // Generate pages for each function
    const generatedPages = [];
    
    for (const functionName of functions) {
      const jsdoc = extractJSDoc(tsContent, functionName);
      
      // Find category
      let category = 'other';
      for (const [cat, funcs] of Object.entries(functionCategories)) {
        if (funcs.includes(functionName)) {
          category = cat;
          break;
        }
      }
      
      const pageContent = generateFunctionPage(functionName, jsdoc || {}, category);
      // Create directory for each function with index.md (VitePress convention)
      const functionDir = join(outputDir, functionName);
      await mkdir(functionDir, { recursive: true });
      const pagePath = join(functionDir, 'index.md');
      
      await writeFile(pagePath, pageContent);
      generatedPages.push({ functionName, category, path: `/api/functions/${functionName}/` });
      
      console.log(`Generated page for ${functionName}`);
    }
    
    // Generate index page
    const indexContent = `---
title: Function Reference
description: Individual function pages
---

# Function Reference

This section contains detailed documentation for each function in \`@stats/core\`.

## By Category

${Object.entries(functionCategories).map(([cat, funcs]) => {
  const funcsInCat = generatedPages.filter(p => p.category === cat);
  if (funcsInCat.length === 0) return '';
  return `### ${cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n${funcsInCat.map(p => `- [${p.functionName}](${p.path})`).join('\n')}\n`;
}).join('\n')}

## All Functions

${generatedPages.map(p => `- [${p.functionName}](${p.path})`).join('\n')}
`;
    
    await writeFile(join(outputDir, 'index.md'), indexContent);
    
    console.log(`\nGenerated ${generatedPages.length} function pages`);
    console.log(`Output directory: ${outputDir}`);
    
    return generatedPages;
    
  } catch (error) {
    console.error('Error generating pages:', error);
    process.exit(1);
  }
}

generatePages();

