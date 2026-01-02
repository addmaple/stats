import {
  f64View,
  copyToWasmMemory,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { CorrelationWasmModule } from './wasm-types.js';

let wasmModule: CorrelationWasmModule | null = null;

/**
 * Get the current WASM module instance.
 */
export function getCorrelationWasm(): CorrelationWasmModule | null {
  return wasmModule;
}

/**
 * Set the WASM module instance.
 */
export function setCorrelationWasm(mod: CorrelationWasmModule): void {
  wasmModule = mod;
}

const requireWasm = createRequireWasm(() => wasmModule);

/**
 * Initialize the correlation wasm module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-correlation', options.inline);
  wasmModule = mod as unknown as CorrelationWasmModule;
}

function correlationHelper(
  fn: (xPtr: number, xLen: number, yPtr: number, yLen: number) => number
) {
  return (x: ArrayLike<number>, y: ArrayLike<number>): number => {
    const wasm = requireWasm();
    if (x.length !== y.length) {
      return NaN;
    }
    const len = x.length;
    if (len === 0) {
      return NaN;
    }
    const xPtr = wasm.alloc_f64(len);
    const yPtr = wasm.alloc_f64(len);
    const xView = f64View(xPtr, len, wasm.get_memory());
    const yView = f64View(yPtr, len, wasm.get_memory());
    copyToWasmMemory(x, xView);
    copyToWasmMemory(y, yView);
    const result = fn(xPtr, len, yPtr, len);
    wasm.free_f64(xPtr, len);
    wasm.free_f64(yPtr, len);
    return result;
  };
}

/**
 * Calculate the covariance between two arrays.
 */
export const covariance = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().covariance_f64(xPtr, xLen, yPtr, yLen)
);

/**
 * Calculate the Pearson correlation coefficient.
 */
export const corrcoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().corrcoeff_f64(xPtr, xLen, yPtr, yLen)
);

/**
 * Calculate the Spearman rank correlation coefficient.
 */
export const spearmancoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().spearmancoeff_f64(xPtr, xLen, yPtr, yLen)
);
