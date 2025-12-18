// Wrapper to handle WASM imports for the docs site
import * as stats from '../../../js/package/dist/index.js';

// The library tries to import WASM using relative paths that don't work in browser
// We need to intercept and fix the import path
const originalInit = stats.init;

stats.init = async function() {
  // Check if already initialized
  if (stats.wasmModule) {
    return;
  }
  
  try {
    // Try to import WASM module using a path that works in Vite
    // We'll use a dynamic import with a resolved path
    const wasmPath = new URL('../../../crates/stat-wasm/pkg/stat_wasm.js', import.meta.url).href;
    const wasmModule = await import(wasmPath);
    
    // Set the wasm module on the stats object
    // This is a bit of a hack, but necessary since the module structure expects it
    if (stats.default && typeof stats.default.init === 'function') {
      await stats.default.init();
    } else {
      // Call the original init which should now work
      await originalInit.call(stats);
    }
  } catch (err) {
    console.error('Failed to load WASM module:', err);
    throw err;
  }
};

export default stats;
export * from '../../../js/package/dist/index.js';








