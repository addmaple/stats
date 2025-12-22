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

function generateFunctionPage(functionName, jsdoc, category) {
  // Generate a better default example based on function signature
  let defaultExample;
  if (jsdoc.examples && jsdoc.examples.length > 0) {
    defaultExample = jsdoc.examples[0];
  } else {
    // Generate a simple example based on function name
    if (functionName === 'sum' || functionName === 'mean' || functionName === 'median' || functionName === 'min' || functionName === 'max') {
      defaultExample = `import { init, ${functionName} } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5];
const result = ${functionName}(data);
result;`;
    } else if (functionName === 'corrcoeff' || functionName === 'covariance' || functionName === 'spearmancoeff') {
      defaultExample = `import { init, ${functionName} } from '@addmaple/stats';
await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const result = ${functionName}(x, y);
result;`;
    } else if (functionName.startsWith('normal') || functionName.startsWith('gamma') || functionName.startsWith('beta')) {
      defaultExample = `import { init, ${functionName} } from '@addmaple/stats';
await init();

const dist = ${functionName}({ mean: 0, sd: 1 });
const result = dist.pdf(0);
result;`;
    } else {
      defaultExample = `import { init, ${functionName} } from '@addmaple/stats';
await init();

// Example usage
const result = ${functionName}(/* your parameters */);
result;`;
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
        
        const pageContent = generateFunctionPage(functionName, jsdoc || {}, category);
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
        
        const pageContent = generateFunctionPage(functionName, jsdoc || {}, category);
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
