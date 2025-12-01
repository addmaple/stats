import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  ArrayResult,
} from './shared';

interface TestsWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  ttest_f64(dataPtr: number, len: number, mu0: number): TestResult;
  ztest_f64(dataPtr: number, len: number, mu0: number, sigma: number): TestResult;
  regress_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): {
    slope: number;
    intercept: number;
    r_squared: number;
    residuals: ArrayResult;
  };
  normalci_f64(alpha: number, mean: number, se: number): number[];
  tci_f64(alpha: number, mean: number, stdev: number, n: number): number[];
}

let wasmModule: TestsWasmModule | null = null;

function requireWasm(): TestsWasmModule {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  return wasmModule;
}

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-tests/stat_wasm_tests.js');
  wasmModule = mod as unknown as TestsWasmModule;
}

export interface TestResult {
  statistic: number;
  p_value: number;
  df: number | null;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r_squared: number;
  residuals: Float64Array;
}

export function ttest(data: ArrayLike<number>, mu0: number): TestResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.ttest_f64(ptr, len, mu0);
  wasmModule.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df,
  };
}

export function ztest(data: ArrayLike<number>, mu0: number, sigma: number): TestResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.ztest_f64(ptr, len, mu0, sigma);
  wasmModule.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df,
  };
}

export function regress(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  if (x.length !== y.length) {
    throw new Error('x and y arrays must have the same length');
  }
  const len = x.length;
  if (len === 0) {
    return {
      slope: NaN,
      intercept: NaN,
      r_squared: NaN,
      residuals: new Float64Array(),
    };
  }
  const xPtr = wasmModule.alloc_f64(len);
  const yPtr = wasmModule.alloc_f64(len);
  const xView = f64View(xPtr, len, wasmModule.get_memory());
  const yView = f64View(yPtr, len, wasmModule.get_memory());
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);
  const result = wasmModule.regress_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasmModule.get_memory());
  wasmModule.free_f64(xPtr, len);
  wasmModule.free_f64(yPtr, len);
  wasmModule.free_f64(result.residuals.ptr, result.residuals.len);
  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

export function normalci(alpha: number, mean: number, se: number): [number, number] {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const result = wasmModule.normalci_f64(alpha, mean, se);
  return [result[0], result[1]];
}

export function tci(alpha: number, mean: number, stdev: number, n: number): [number, number] {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const result = wasmModule.tci_f64(alpha, mean, stdev, n);
  return [result[0], result[1]];
}

