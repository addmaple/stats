#!/usr/bin/env node

/**
 * Generates individual function pages from TypeScript source
 * Creates a markdown file for each exported function with interactive code examples
 */

import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, '../../js/package/src');
const outputDir = join(__dirname, '../api/functions');

// Function categories for organization
const functionCategories = {
  'basic-statistics': ['sum', 'mean', 'variance', 'sampleVariance', 'stdev', 'sampleStdev', 'min', 'max', 'product', 'range'],
  'advanced-statistics': ['median', 'mode', 'geomean', 'skewness', 'kurtosis', 'coeffvar', 'deviation', 'meandev', 'meddev'],
  'quantiles-percentiles': ['percentile', 'percentileOfScore', 'quantiles', 'quartiles', 'iqr', 'qscore', 'qtest'],
  'correlation-covariance': ['covariance', 'corrcoeff', 'spearmancoeff'],
  'distributions': ['normal', 'gamma', 'beta', 'studentT', 'chiSquared', 'fisherF', 'exponential', 'poisson', 'binomial', 'uniform', 'cauchy', 'laplace', 'logNormal', 'weibull', 'pareto', 'triangular', 'inverseGamma', 'negativeBinomial'],
  'statistical-tests': ['anovaFScore', 'anovaTest', 'anovaFScoreCategorical', 'anovaTestCategorical', 'chiSquareTest', 'ttest', 'ztest'],
  'transformations': ['cumsum', 'cumprod', 'diff', 'rank', 'histogram', 'histogramEdges', 'histogramBinning', 'cumreduce'],
  'regression': ['regress', 'normalci', 'tci'],
};

function extractJSDoc(tsContent, functionName) {
  // Find the function definition
  const functionRegex = new RegExp(
    `(?:export\\s+)?(?:async\\s+)?function\\s+${functionName}\\s*\\([^)]*\\)[^{]*\\{`,
    'm'
  );
  
  const functionIndex = tsContent.search(functionRegex);
  if (functionIndex === -1) {
    // Try const definition for correlation helpers
    const constRegex = new RegExp(
      `(?:export\\s+)?const\\s+${functionName}\\s*\\=`,
      'm'
    );
    if (tsContent.search(constRegex) === -1) return null;
  }
  
  // Find JSDoc comments before the function
  const searchIndex = tsContent.search(functionRegex) !== -1 ? tsContent.search(functionRegex) : tsContent.search(new RegExp(`(?:export\\s+)?const\\s+${functionName}\\s*\\=`, 'm'));
  const beforeFunction = tsContent.substring(0, searchIndex);
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

function generateDefaultExample(functionName, jsdoc, tsContent) {
  // If JSDoc has examples, use the first one
  if (jsdoc && jsdoc.examples && jsdoc.examples.length > 0) {
    return jsdoc.examples[0];
  }

  // Try to extract function signature from TypeScript content
  const functionRegex = new RegExp(
    `(?:export\\s+)?(?:async\\s+)?function\\s+${functionName}\\s*\\(([^)]*)\\)`,
    'm'
  );
  const match = tsContent ? tsContent.match(functionRegex) : null;
  const params = match ? match[1].split(',').map(p => p.trim().split(':')[0].trim()) : [];

  // Single array parameter functions (most stats functions)
  const singleArrayFunctions = [
    'sum', 'mean', 'variance', 'sampleVariance', 'stdev', 'sampleStdev', 
    'min', 'max', 'product', 'range', 'median', 'mode', 'geomean', 
    'skewness', 'kurtosis', 'coeffvar', 'meandev', 'meddev', 'deviation',
    'cumsum', 'cumprod', 'diff', 'rank', 'histogram', 'quartiles', 'iqr'
  ];
  
  if (singleArrayFunctions.includes(functionName)) {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data);
result;`;
  }

  // Two array parameter functions (correlation, regression)
  const twoArrayFunctions = ['corrcoeff', 'covariance', 'spearmancoeff', 'regress', 'regressNaive', 'regressSimd', 'regressWasmKernels'];
  if (twoArrayFunctions.includes(functionName)) {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const result = ${functionName}(x, y);
result;`;
  }

  // Array + number parameter functions
  if (functionName === 'percentile' || functionName === 'percentileInclusive' || functionName === 'percentileExclusive') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 0.5);
result;`;
  }

  if (functionName === 'percentileOfScore' || functionName === 'qscore') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 7);
result;`;
  }

  if (functionName === 'qtest') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 5, 0.25, 0.75);
result;`;
  }

  if (functionName === 'stanMoment') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 3);
result;`;
  }

  if (functionName === 'ttest') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 5);
result;`;
  }

  if (functionName === 'ztest') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 5, 2);
result;`;
  }

  if (functionName === 'normalci') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const result = ${functionName}(0.05, 100, 15);
result;`;
  }

  if (functionName === 'tci') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const result = ${functionName}(0.05, 100, 15, 20);
result;`;
  }

  // Array + array parameter (quantiles, percentiles)
  if (functionName === 'quantiles' || functionName === 'percentiles') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, [0.25, 0.5, 0.75]);
result;`;
  }

  // Weighted functions
  if (functionName === 'weightedPercentile' || functionName === 'weightedMedian') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5];
const weights = [1, 1, 2, 1, 1];
const result = ${functionName}(data, weights${functionName === 'weightedPercentile' ? ', 0.5' : ''});
result;`;
  }

  if (functionName === 'weightedQuantiles') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5];
const weights = [1, 1, 2, 1, 1];
const result = ${functionName}(data, weights, [0.25, 0.5, 0.75]);
result;`;
  }

  // Histogram functions
  if (functionName === 'histogramEdges') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const edges = [0, 3, 6, 10];
const result = ${functionName}(data, edges);
result;`;
  }

  if (functionName === 'histogramBinning') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data, 5);
result;`;
  }

  // ANOVA functions
  if (functionName === 'anovaFScore' || functionName === 'anovaTest') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const group1 = [2, 3, 7, 2, 6];
const group2 = [10, 11, 14, 13, 15];
const group3 = [20, 21, 24, 23, 25];
const result = ${functionName}([group1, group2, group3]);
result;`;
  }

  if (functionName === 'anovaFScoreCategorical' || functionName === 'anovaTestCategorical') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const groups = ['A', 'A', 'B', 'B', 'C', 'C'];
const values = [10, 12, 20, 22, 30, 32];
const result = ${functionName}(groups, values);
result;`;
  }

  if (functionName === 'tukeyHsdCategorical') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const groups = ['A', 'A', 'B', 'B', 'C', 'C'];
const values = [10, 12, 20, 22, 30, 32];
const result = ${functionName}(groups, values);
result;`;
  }

  if (functionName === 'chiSquareTest') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const cat1 = ['A', 'A', 'B', 'B', 'C', 'C'];
const cat2 = ['X', 'Y', 'X', 'Y', 'X', 'Y'];
const result = ${functionName}(cat1, cat2);
result;`;
  }

  // Pooled functions
  if (functionName === 'pooledvariance' || functionName === 'pooledstdev') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data1 = [1, 2, 3, 4, 5];
const data2 = [6, 7, 8, 9, 10];
const result = ${functionName}(data1, data2);
result;`;
  }

  // Distribution functions
  const distributionFunctions = [
    'normal', 'gamma', 'beta', 'studentT', 'chiSquared', 'fisherF', 
    'exponential', 'poisson', 'binomial', 'uniform', 'cauchy', 'laplace',
    'logNormal', 'weibull', 'pareto', 'triangular', 'inverseGamma', 'negativeBinomial'
  ];
  
  if (distributionFunctions.includes(functionName)) {
    // Different distributions have different parameter structures
    if (functionName === 'normal') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ mean: 0, sd: 1 });
const result = dist.pdf(0);
result;`;
    } else if (functionName === 'gamma') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ shape: 2, rate: 1 });
const result = dist.pdf(1);
result;`;
    } else if (functionName === 'beta') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ alpha: 2, beta: 5 });
const result = dist.pdf(0.3);
result;`;
    } else if (functionName === 'studentT') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ dof: 10 });
const result = dist.pdf(0);
result;`;
    } else if (functionName === 'chiSquared') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ dof: 5 });
const result = dist.pdf(3);
result;`;
    } else if (functionName === 'fisherF') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ df1: 3, df2: 10 });
const result = dist.pdf(2);
result;`;
    } else if (functionName === 'exponential') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ rate: 0.5 });
const result = dist.pdf(1);
result;`;
    } else if (functionName === 'poisson') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ lambda: 3 });
const result = dist.pdf(2);
result;`;
    } else if (functionName === 'binomial') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ n: 10, p: 0.5 });
const result = dist.pdf(5);
result;`;
    } else if (functionName === 'uniform') {
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ min: 0, max: 1 });
const result = dist.pdf(0.5);
result;`;
    } else {
      // Generic distribution example
      return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}();
const result = dist.pdf(0);
result;`;
    }
  }

  // cumreduce has a custom reducer
  if (functionName === 'cumreduce') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5];
const result = ${functionName}(data, 0, (acc, val) => acc + val);
result;`;
  }

  // Default fallback - try to infer from params
  if (params.length === 1 && params[0] === 'data') {
    return `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const result = ${functionName}(data);
result;`;
  }

  // If we can't determine, provide a minimal working example
  return `import { init, ${functionName} } from '@addmaple/stats';
await init();

// Example usage
const data = [1, 2, 3, 4, 5];
const result = ${functionName}(data);
result;`;
}

function generateFunctionPage(functionName, jsdoc, category, tsContent = '') {
  // Generate a better default example based on function signature
  const defaultExample = generateDefaultExample(functionName, jsdoc, tsContent);

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
    // Read all TypeScript files in srcDir
    const files = await readdir(srcDir);
    const tsFiles = files.filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'wasm-types.ts' && f !== 'shared.ts');
    
    // Create output directory
    await mkdir(outputDir, { recursive: true });
    
    // Generate pages for each function in each file
    const generatedPages = [];
    
    for (const file of tsFiles) {
      const filePath = join(srcDir, file);
      const tsContent = await readFile(filePath, 'utf-8');
      
      // Find all exported functions
      const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*\(/g;
      let match;
      while ((match = functionRegex.exec(tsContent)) !== null) {
        const functionName = match[1];
        if (functionName === 'init' || functionName.startsWith('_')) continue;
        if (functionName.startsWith('get') && functionName.endsWith('Wasm')) continue;
        if (functionName.startsWith('set') && functionName.endsWith('Wasm')) continue;
        
        const jsdoc = extractJSDoc(tsContent, functionName);
        
        // Find category
        let category = 'other';
        for (const [cat, funcs] of Object.entries(functionCategories)) {
          if (funcs.includes(functionName)) {
            category = cat;
            break;
          }
        }
        
        const pageContent = generateFunctionPage(functionName, jsdoc || {}, category, tsContent);
        const functionDir = join(outputDir, functionName);
        await mkdir(functionDir, { recursive: true });
        const pagePath = join(functionDir, 'index.md');
        
        await writeFile(pagePath, pageContent);
        generatedPages.push({ functionName, category, path: `/api/functions/${functionName}/` });
        console.log(`Generated page for ${functionName} (from ${file})`);
      }
      
      // Also check for exported consts (like correlation helpers)
      const constRegex = /export\s+const\s+(\w+)\s*\=/g;
      while ((match = constRegex.exec(tsContent)) !== null) {
        const functionName = match[1];
        if (functionName === 'init' || functionName.startsWith('_')) continue;
        
        const jsdoc = extractJSDoc(tsContent, functionName);
        if (!jsdoc) continue; // Only if it has JSDoc, to avoid random constants
        
        // Find category
        let category = 'other';
        for (const [cat, funcs] of Object.entries(functionCategories)) {
          if (funcs.includes(functionName)) {
            category = cat;
            break;
          }
        }
        
        const pageContent = generateFunctionPage(functionName, jsdoc || {}, category, tsContent);
        const functionDir = join(outputDir, functionName);
        await mkdir(functionDir, { recursive: true });
        const pagePath = join(functionDir, 'index.md');
        
        await writeFile(pagePath, pageContent);
        generatedPages.push({ functionName, category, path: `/api/functions/${functionName}/` });
        console.log(`Generated page for ${functionName} (const from ${file})`);
      }
    }

    // Generate category pages to fix 404s in sidebar
    for (const [category, funcs] of Object.entries(functionCategories)) {
      const catTitle = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const categoryContent = `---
title: ${catTitle}
description: ${catTitle} functions in @stats/core
---

# ${catTitle}

This page lists all functions in the **${catTitle}** category.

## Functions

${funcs.map(f => {
  const p = generatedPages.find(gp => gp.functionName === f);
  return p ? `- [${f}](${p.path})` : `- ${f} (no documentation generated)`;
}).join('\n')}

## More Information
For a complete list of all available functions, see the [Function Reference](/api/functions/).
`;
      const categoryPath = join(dirname(outputDir), `${category}.md`);
      await writeFile(categoryPath, categoryContent);
      console.log(`Generated category page: ${category}`);
    }

    // Special case for Initialization page
    const initPageContent = `---
title: Initialization
description: How to initialize @stats/core
---

# Initialization

Before using any functions from \`@stats/core\`, you must initialize the library. This is because it uses WebAssembly under the hood, which needs to be loaded and initialized.

## init()

The \`init\` function initializes the WebAssembly module. It is SIMD-aware and will automatically use SIMD if supported by the environment.

### Usage

\`\`\`javascript
import { init } from '@addmaple/stats';

await init();
// Now you can use other functions
\`\`\`

### Example

<InteractiveCode default-code="import { init, mean } from '@addmaple/stats';&#10;await init();&#10;&#10;const result = mean([1, 2, 3, 4, 5]);&#10;result;" />
`;
    await writeFile(join(dirname(outputDir), 'initialization.md'), initPageContent);
    console.log('Generated initialization.md');
    
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
