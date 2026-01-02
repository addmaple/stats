#!/usr/bin/env node

/**
 * Auto-generates example code blocks from example files
 * This script scans the examples directory and generates markdown with code blocks
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const examplesDir = join(__dirname, '../examples');
const outputDir = join(__dirname, '../examples-generated');

async function generateExamples() {
  try {
    const files = await readdir(examplesDir);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    
    console.log(`Found ${jsFiles.length} example files`);
    
    for (const file of jsFiles) {
      const filePath = join(examplesDir, file);
      const content = await readFile(filePath, 'utf-8');
      const name = basename(file, '.js');
      
      // Extract description from comments if present
      const lines = content.split('\n');
      let description = '';
      if (lines[0].startsWith('//')) {
        description = lines[0].replace(/^\/\/\s*/, '');
      }
      
      // Generate markdown
      const markdown = `# ${name}

${description ? description + '\n' : ''}

\`\`\`js
${content}
\`\`\`
`;
      
      const outputPath = join(outputDir, `${name}.md`);
      await writeFile(outputPath, markdown);
      console.log(`Generated: ${name}.md`);
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error generating examples:', error);
    process.exit(1);
  }
}

generateExamples();









