import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { ArrayResult, TestsWasmModule } from './wasm-types.js';

let wasmModule: TestsWasmModule | null = null;

const requireWasm = createRequireWasm(() => wasmModule);

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
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.ttest_f64(ptr, len, mu0);
  wasm.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df ?? null,
  };
}

export function ztest(data: ArrayLike<number>, mu0: number, sigma: number): TestResult {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.ztest_f64(ptr, len, mu0, sigma);
  wasm.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df ?? null,
  };
}

export function regress(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  const wasm = requireWasm();
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
  const xPtr = wasm.alloc_f64(len);
  const yPtr = wasm.alloc_f64(len);
  const xView = f64View(xPtr, len, wasm.get_memory());
  const yView = f64View(yPtr, len, wasm.get_memory());
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);
  const result = wasm.regress_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasm.get_memory());
  wasm.free_f64(xPtr, len);
  wasm.free_f64(yPtr, len);
  wasm.free_f64(result.residuals.ptr, result.residuals.len);
  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

export function normalci(alpha: number, mean: number, se: number): [number, number] {
  const wasm = requireWasm();
  const result = wasm.normalci_f64(alpha, mean, se);
  return [result[0], result[1]];
}

export function tci(alpha: number, mean: number, stdev: number, n: number): [number, number] {
  const wasm = requireWasm();
  const result = wasm.tci_f64(alpha, mean, stdev, n);
  return [result[0], result[1]];
}
