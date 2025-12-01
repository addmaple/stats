import {
  f64View,
  copyToWasmMemory,
  loadWasmModule,
} from './shared';

interface CorrelationWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  covariance_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
  corrcoeff_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
  spearmancoeff_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
}

let wasmModule: CorrelationWasmModule | null = null;

function requireWasm(): CorrelationWasmModule {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  return wasmModule;
}

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
    if (!wasmModule) {
      throw new Error('Wasm module not initialized. Call init() first.');
    }
    if (x.length !== y.length) {
      return NaN;
    }
    const len = x.length;
    if (len === 0) {
      return NaN;
    }
    const xPtr = wasmModule.alloc_f64(len);
    const yPtr = wasmModule.alloc_f64(len);
    const xView = f64View(xPtr, len, wasmModule.get_memory());
    const yView = f64View(yPtr, len, wasmModule.get_memory());
    copyToWasmMemory(x, xView);
    copyToWasmMemory(y, yView);
    const result = fn(xPtr, len, yPtr, len);
    wasmModule.free_f64(xPtr, len);
    wasmModule.free_f64(yPtr, len);
    return result;
  };
}

export const covariance = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => wasmModule!.covariance_f64(xPtr, xLen, yPtr, yLen)
);

export const corrcoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => wasmModule!.corrcoeff_f64(xPtr, xLen, yPtr, yLen)
);

export const spearmancoeff = correlationHelper(
  (xPtr, xLen, yPtr, yLen) => wasmModule!.spearmancoeff_f64(xPtr, xLen, yPtr, yLen)
);

