import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { ArrayResult, StatsWasmModule } from './wasm-types.js';

let wasmModule: StatsWasmModule | null = null;

const requireWasm = createRequireWasm(() => wasmModule);

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-stats/stat_wasm_stats.js');
  wasmModule = mod as unknown as StatsWasmModule;
}

function helper(fn: (ptr: number, len: number) => number, emptyValue: number) {
  return (data: ArrayLike<number>): number => {
    const wasm = requireWasm();
    const len = data.length;
    if (len === 0) {
      return emptyValue;
    }
    const ptr = wasm.alloc_f64(len);
    const view = f64View(ptr, len, wasm.get_memory());
    copyToWasmMemory(data, view);
    const result = fn(ptr, len);
    wasm.free_f64(ptr, len);
    return result;
  };
}

function arrayHelper(fn: (ptr: number, len: number) => ArrayResult) {
  return (data: ArrayLike<number>): Float64Array => {
    const wasm = requireWasm();
    const len = data.length;
    if (len === 0) {
      return new Float64Array();
    }
    const ptr = wasm.alloc_f64(len);
    const view = f64View(ptr, len, wasm.get_memory());
    copyToWasmMemory(data, view);
    const result = fn(ptr, len);
    const output = readWasmArray(result, wasm.get_memory());
    wasm.free_f64(ptr, len);
    wasm.free_f64(result.ptr, result.len);
    return output;
  };
}

export const sum = helper((ptr, len) => requireWasm().sum_f64(ptr, len), 0.0);
export const mean = helper((ptr, len) => requireWasm().mean_f64(ptr, len), NaN);
export const variance = helper((ptr, len) => requireWasm().variance_f64(ptr, len), NaN);
export const sampleVariance = helper((ptr, len) => requireWasm().sample_variance_f64(ptr, len), NaN);
export const stdev = helper((ptr, len) => requireWasm().stdev_f64(ptr, len), NaN);
export const sampleStdev = helper((ptr, len) => requireWasm().sample_stdev_f64(ptr, len), NaN);
export const coeffvar = helper((ptr, len) => requireWasm().coeffvar_f64(ptr, len), NaN);
export const min = helper((ptr, len) => requireWasm().min_f64(ptr, len), NaN);
export const max = helper((ptr, len) => requireWasm().max_f64(ptr, len), NaN);
export const product = helper((ptr, len) => requireWasm().product_f64(ptr, len), NaN);
export const range = helper((ptr, len) => requireWasm().range_f64(ptr, len), NaN);
export const median = helper((ptr, len) => requireWasm().median_f64(ptr, len), NaN);
export const mode = helper((ptr, len) => requireWasm().mode_f64(ptr, len), NaN);
export const geomean = helper((ptr, len) => requireWasm().geomean_f64(ptr, len), NaN);
export const skewness = helper((ptr, len) => requireWasm().skewness_f64(ptr, len), NaN);
export const kurtosis = helper((ptr, len) => requireWasm().kurtosis_f64(ptr, len), NaN);
export const cumsum = arrayHelper((ptr, len) => requireWasm().cumsum_f64(ptr, len));
export const cumprod = arrayHelper((ptr, len) => requireWasm().cumprod_f64(ptr, len));
export const diff = arrayHelper((ptr, len) => requireWasm().diff_f64(ptr, len));
export const rank = arrayHelper((ptr, len) => requireWasm().rank_f64(ptr, len));

export function histogram(
  data: ArrayLike<number>,
  binCount: number
): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.histogram_f64(ptr, len, binCount);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  wasm.free_f64(result.ptr, result.len);
  return output;
}
