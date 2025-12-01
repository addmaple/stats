#!/usr/bin/env node

/**
 * Extracts code examples from TypeScript source files
 * Looks for @example JSDoc tags and extracts them
 */

import { readFile, writeFile } from 'fs/promises';
import { glob } from 'glob';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, '../../js/package/src');
const outputDir = join(__dirname, '../examples-extracted');

async function extractExamples() {
  try {
    const files = await glob('**/*.ts', { cwd: srcDir });
    const examples = [];
    
    for (const file of files) {
      const filePath = join(srcDir, file);
      const content = await readFile(filePath, 'utf-8');
      
      // Extract @example blocks
      const exampleRegex = /@example\s*\n\s*```(?:js|javascript)?\n([\s\S]*?)```/g;
      let match;
      
      while ((match = exampleRegex.exec(content)) !== null) {
        examples.push({
          file,
          code: match[1].trim(),
        });
      }
    }
    
    console.log(`Extracted ${examples.length} examples`);
    
    // Write examples to files
    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];
      const fileName = `example-${i + 1}-${example.file.replace('.ts', '')}.js`;
      const outputPath = join(outputDir, fileName);
      await writeFile(outputPath, example.code);
      console.log(`Wrote: ${fileName}`);
    }
    
  } catch (error) {
    console.error('Error extracting examples:', error);
    process.exit(1);
  }
}

extractExamples();

