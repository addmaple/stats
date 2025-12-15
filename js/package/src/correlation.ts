import {
  f64View,
  copyToWasmMemory,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { CorrelationWasmModule } from './wasm-types.js';

let wasmModule: CorrelationWasmModule | null = null;

const requireWasm = createRequireWasm(() => wasmModule);

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-correlation/stat_wasm_correlation.js');
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

export const covariance = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().covariance_f64(xPtr, xLen, yPtr, yLen)
);

export const corrcoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().corrcoeff_f64(xPtr, xLen, yPtr, yLen)
);

export const spearmancoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => requireWasm().spearmancoeff_f64(xPtr, xLen, yPtr, yLen)
);
