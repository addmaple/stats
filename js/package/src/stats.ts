import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  runUnaryArrayOp,
  loadWasmModule,
  ArrayResult,
} from './shared';

// Stats-specific WASM module interface
interface StatsWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  sum_f64(ptr: number, len: number): number;
  mean_f64(ptr: number, len: number): number;
  variance_f64(ptr: number, len: number): number;
  sample_variance_f64(ptr: number, len: number): number;
  stdev_f64(ptr: number, len: number): number;
  sample_stdev_f64(ptr: number, len: number): number;
  coeffvar_f64(ptr: number, len: number): number;
  min_f64(ptr: number, len: number): number;
  max_f64(ptr: number, len: number): number;
  product_f64(ptr: number, len: number): number;
  range_f64(ptr: number, len: number): number;
  median_f64(ptr: number, len: number): number;
  mode_f64(ptr: number, len: number): number;
  geomean_f64(ptr: number, len: number): number;
  skewness_f64(ptr: number, len: number): number;
  kurtosis_f64(ptr: number, len: number): number;
  cumsum_f64(ptr: number, len: number): ArrayResult;
  cumprod_f64(ptr: number, len: number): ArrayResult;
  diff_f64(ptr: number, len: number): ArrayResult;
  rank_f64(ptr: number, len: number): ArrayResult;
  histogram_f64(ptr: number, len: number, binCount: number): ArrayResult;
}

let wasmModule: StatsWasmModule | null = null;

function requireWasm(): StatsWasmModule {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  return wasmModule;
}

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-stats/stat_wasm_stats.js');
  wasmModule = mod as unknown as StatsWasmModule;
}

function helper(fn: (ptr: number, len: number) => number) {
  return (data: ArrayLike<number>): number => {
    if (!wasmModule) {
      throw new Error('Wasm module not initialized. Call init() first.');
    }
    const len = data.length;
    if (len === 0) {
      return fn === wasmModule.min_f64 ? NaN : fn === wasmModule.max_f64 ? NaN : 0.0;
    }
    const ptr = wasmModule.alloc_f64(len);
    const view = f64View(ptr, len, wasmModule.get_memory());
    copyToWasmMemory(data, view);
    const result = fn(ptr, len);
    wasmModule.free_f64(ptr, len);
    return result;
  };
}

function arrayHelper(fn: (ptr: number, len: number) => ArrayResult) {
  return (data: ArrayLike<number>): Float64Array => {
    if (!wasmModule) {
      throw new Error('Wasm module not initialized. Call init() first.');
    }
    const len = data.length;
    if (len === 0) {
      return new Float64Array();
    }
    const ptr = wasmModule.alloc_f64(len);
    const view = f64View(ptr, len, wasmModule.get_memory());
    copyToWasmMemory(data, view);
    const result = fn(ptr, len);
    const output = readWasmArray(result, wasmModule.get_memory());
    wasmModule.free_f64(ptr, len);
    wasmModule.free_f64(result.ptr, result.len);
    return output;
  };
}

export const sum = helper((ptr, len) => wasmModule!.sum_f64(ptr, len));
export const mean = helper((ptr, len) => wasmModule!.mean_f64(ptr, len));
export const variance = helper((ptr, len) => wasmModule!.variance_f64(ptr, len));
export const sampleVariance = helper((ptr, len) => wasmModule!.sample_variance_f64(ptr, len));
export const stdev = helper((ptr, len) => wasmModule!.stdev_f64(ptr, len));
export const sampleStdev = helper((ptr, len) => wasmModule!.sample_stdev_f64(ptr, len));
export const coeffvar = helper((ptr, len) => wasmModule!.coeffvar_f64(ptr, len));
export const min = helper((ptr, len) => wasmModule!.min_f64(ptr, len));
export const max = helper((ptr, len) => wasmModule!.max_f64(ptr, len));
export const product = helper((ptr, len) => wasmModule!.product_f64(ptr, len));
export const range = helper((ptr, len) => wasmModule!.range_f64(ptr, len));
export const median = helper((ptr, len) => wasmModule!.median_f64(ptr, len));
export const mode = helper((ptr, len) => wasmModule!.mode_f64(ptr, len));
export const geomean = helper((ptr, len) => wasmModule!.geomean_f64(ptr, len));
export const skewness = helper((ptr, len) => wasmModule!.skewness_f64(ptr, len));
export const kurtosis = helper((ptr, len) => wasmModule!.kurtosis_f64(ptr, len));
export const cumsum = arrayHelper((ptr, len) => wasmModule!.cumsum_f64(ptr, len));
export const cumprod = arrayHelper((ptr, len) => wasmModule!.cumprod_f64(ptr, len));
export const diff = arrayHelper((ptr, len) => wasmModule!.diff_f64(ptr, len));
export const rank = arrayHelper((ptr, len) => wasmModule!.rank_f64(ptr, len));

export function histogram(
  data: ArrayLike<number>,
  binCount: number
): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.histogram_f64(ptr, len, binCount);
  const output = readWasmArray(result, wasmModule.get_memory());
  wasmModule.free_f64(ptr, len);
  wasmModule.free_f64(result.ptr, result.len);
  return output;
}

