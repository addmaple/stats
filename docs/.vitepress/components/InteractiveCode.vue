<template>
  <div class="interactive-code">
    <div class="code-editor">
      <div class="editor-header">
        <span class="editor-title">Try it out</span>
        <button 
          @click="runCode" 
          :disabled="isRunning || !isInitialized"
          class="run-button"
        >
          {{ isRunning ? 'Running...' : 'Run' }}
        </button>
      </div>
      <div class="editor-content">
        <textarea
          v-model="code"
          class="code-input"
          :placeholder="placeholder"
          spellcheck="false"
        ></textarea>
      </div>
    </div>
    
    <div v-if="output !== null" class="output">
      <div class="output-header">Output</div>
      <pre class="output-content">{{ output }}</pre>
    </div>
    
    <div v-if="error" class="error">
      <div class="error-header">Error</div>
      <pre class="error-content">{{ error }}</pre>
    </div>
    
    <div v-if="!isInitialized" class="loading">
      <div class="loading-text">Initializing library...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  defaultCode: {
    type: String,
    default: '',
  },
  'default-code': {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Enter your code here...',
  },
});

// Support both camelCase and kebab-case props
const defaultCodeValue = props.defaultCode || props['default-code'] || '';
// Decode HTML entities
const decodedCode = defaultCodeValue
  .replace(/&#10;/g, '\n')
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

const code = ref(decodedCode);
const output = ref(null);
const error = ref(null);
const isRunning = ref(false);
const isInitialized = ref(false);
let statsModule = null;

onMounted(async () => {
  try {
    // Use npm package (works in both dev and production)
    // For local development, the prebuild script will build the package if Rust is available
    const module = await import('@addmaple/stats');
    
    // Initialize the library
    await module.init();
    statsModule = module;
    isInitialized.value = true;
  } catch (err) {
    console.error('Failed to initialize library:', err);
    error.value = `Failed to initialize library: ${err.message}`;
  }
});

const runCode = async () => {
  if (!isInitialized.value || !statsModule) {
    error.value = 'Library not initialized yet';
    return;
  }

  isRunning.value = true;
  output.value = null;
  error.value = null;

  try {
    // Transform the code to replace import statements with direct variable access
    let transformedCode = code.value;
    
    // Remove import statements and extract function names
    // Support both @stats/core and @addmaple/stats
    const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]@(?:stats\/core|addmaple\/stats)['"];?/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(code.value)) !== null) {
      const imported = match[1]
        .split(',')
        .map(s => s.trim())
        .filter(s => s);
      imports.push(...imported);
    }
    
    // Remove import and init lines
    transformedCode = transformedCode
      .replace(/import\s*\{[^}]+\}\s*from\s*['"]@(?:stats\/core|addmaple\/stats)['"];?\s*/g, '')
      .replace(/await\s+init\(\);?\s*/g, '');
    
    // Create a function that wraps the user code
    // Provide all exports as individual variables
    const exports = { ...statsModule };
    const exportNames = Object.keys(exports);
    
    // Create variable declarations for imported functions
    const varDeclarations = imports
      .filter(name => exportNames.includes(name))
      .map(name => `const ${name} = exports.${name};`)
      .join('\n');
    
    // Capture console.log output
    const consoleOutput = [];
    const originalLog = console.log;
    const customConsole = {
      ...console,
      log: (...args) => {
        consoleOutput.push(args.map(arg => formatOutput(arg)).join(' '));
        originalLog(...args);
      }
    };
    
    try {
      // Wrap code in a function that captures the last expression value
      // Split by lines to find the last expression
      const lines = transformedCode.trim().split('\n').filter(l => l.trim());
      const lastLine = lines[lines.length - 1].trim();
      
      // If the last line is an expression statement (ends with ; but is just a variable/expression),
      // or is a bare expression (no ;), convert it to a return statement
      let execCode = transformedCode;
      if (lastLine) {
        // Check if it's a simple expression statement (e.g., "result;" or "result")
        const isExpressionStatement = lastLine.endsWith(';') && 
          !lastLine.includes('=') && 
          !lastLine.includes('const ') && 
          !lastLine.includes('let ') && 
          !lastLine.includes('var ') &&
          !lastLine.includes('function ') &&
          !lastLine.includes('if ') &&
          !lastLine.includes('for ') &&
          !lastLine.includes('while ') &&
          !lastLine.includes('return ') &&
          !lastLine.startsWith('//');
        
        const isBareExpression = !lastLine.endsWith(';') && 
          !lastLine.endsWith('{') && 
          !lastLine.endsWith('}') &&
          !lastLine.startsWith('//');
        
        if (isExpressionStatement || isBareExpression) {
          // Remove semicolon if present, then add return
          const expression = lastLine.replace(/;$/, '').trim();
          const lastLineIndex = transformedCode.lastIndexOf(lastLine);
          if (lastLineIndex >= 0) {
            execCode = transformedCode.substring(0, lastLineIndex) + `return ${expression};`;
          }
        }
      }
      
      const func = new Function(
        'exports',
        'console',
        `
        ${varDeclarations}
        ${execCode}
      `
      );

      // Execute the code with exports available
      const result = func(exports, customConsole);

      // Handle promises
      let finalResult;
      if (result instanceof Promise) {
        finalResult = await result;
      } else {
        finalResult = result;
      }
      
      // If there's console output, show that; otherwise show the result
      if (consoleOutput.length > 0) {
        output.value = consoleOutput.join('\n');
      } else if (finalResult !== undefined && finalResult !== null) {
        output.value = formatOutput(finalResult);
      } else {
        // If no console output and result is undefined, try to show a helpful message
        output.value = finalResult === undefined ? 'undefined' : String(finalResult);
      }
    } catch (err) {
      throw err;
    } finally {
      // Restore original console.log
      console.log = originalLog;
    }
  } catch (err) {
    error.value = err.message || String(err);
  } finally {
    isRunning.value = false;
  }
};

const formatOutput = (value) => {
  if (value === null || value === undefined) {
    return String(value);
  }
  if (value instanceof Float64Array || value instanceof Array) {
    return JSON.stringify(Array.from(value), null, 2);
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};
</script>

<style scoped>
.interactive-code {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.code-editor {
  background: var(--vp-c-bg-alt);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.editor-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.run-button {
  padding: 0.375rem 0.75rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.run-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.run-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-content {
  padding: 1rem;
}

.code-input {
  width: 100%;
  min-height: 200px;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 0.75rem;
  resize: vertical;
  tab-size: 2;
}

.code-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.output,
.error {
  padding: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.output {
  background: var(--vp-c-bg-soft);
}

.error {
  background: rgba(255, 0, 0, 0.05);
}

.output-header,
.error-header {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-2);
}

.error-header {
  color: #f56565;
}

.output-content,
.error-content {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.error-content {
  color: #f56565;
}

.loading {
  padding: 1rem;
  text-align: center;
  color: var(--vp-c-text-2);
}

.loading-text {
  font-size: 0.875rem;
}
</style>

