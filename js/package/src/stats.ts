import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { ArrayResult, StatsWasmModule } from './wasm-types.js';

let wasmModule: StatsWasmModule | null = null;

/**
 * Get the current WASM module instance.
 */
export function getStatsWasm(): StatsWasmModule | null {
  return wasmModule;
}

/**
 * Set the WASM module instance.
 */
export function setStatsWasm(mod: StatsWasmModule): void {
  wasmModule = mod;
}

const requireWasm = createRequireWasm(() => wasmModule);

/**
 * Initialize the stats wasm module.
 * 
 * @param options - Initialization options
 * @param options.inline - If true, use the inline (base64) version of the WASM module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-stats', options.inline);
  wasmModule = mod as unknown as StatsWasmModule;
}

/**
 * Helper to create a view into wasm memory
 */
function getF64View(ptr: number, len: number): Float64Array {
  const wasm = requireWasm();
  return f64View(ptr, len, wasm.get_memory());
}

/**
 * Internal helper to run a basic stats function
 */
function runStatsOp(data: ArrayLike<number>, op: (ptr: number, len: number) => number, emptyValue: number = NaN): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return emptyValue;

  // Optimize for Float64Array already in WASM memory
  if (data instanceof Float64Array && data.buffer === wasm.get_memory().buffer) {
    return op(data.byteOffset, len);
  }

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = op(ptr, len);
  wasm.free_f64(ptr, len);
  return result;
}

/**
 * Calculate the sum of an array.
 * 
 * @param data - Array of numbers to sum
 * @returns The sum of all elements
 */
export function sum(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().sum_f64(ptr, len), 0);
}

/**
 * Calculate the arithmetic mean (average) of an array.
 * 
 * @param data - Array of numbers
 * @returns The mean value, or NaN if array is empty
 */
export function mean(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().mean_f64(ptr, len));
}

/**
 * Calculate the population variance of an array.
 */
export function variance(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().variance_f64(ptr, len));
}

/**
 * Calculate the sample variance of an array (Bessel's correction).
 */
export function sampleVariance(data: ArrayLike<number>): number {
  const len = data.length;
  if (len < 2) return NaN;
  return runStatsOp(data, (ptr, len) => requireWasm().sample_variance_f64(ptr, len));
}

/**
 * Calculate the standard deviation (population) of an array.
 */
export function stdev(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().stdev_f64(ptr, len));
}

/**
 * Calculate the sample standard deviation of an array.
 */
export function sampleStdev(data: ArrayLike<number>): number {
  const len = data.length;
  if (len < 2) return NaN;
  return runStatsOp(data, (ptr, len) => requireWasm().sample_stdev_f64(ptr, len));
}

/**
 * Calculate the minimum value in an array.
 */
export function min(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().min_f64(ptr, len));
}

/**
 * Calculate the maximum value in an array.
 */
export function max(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().max_f64(ptr, len));
}

/**
 * Calculate the product of all elements in an array.
 */
export function product(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().product_f64(ptr, len));
}

/**
 * Calculate the range (max - min) of an array.
 */
export function range(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().range_f64(ptr, len));
}

/**
 * Calculate the median of an array.
 */
export function median(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().median_f64(ptr, len));
}

/**
 * Calculate the mode of an array.
 */
export function mode(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().mode_f64(ptr, len));
}

/**
 * Calculate the geometric mean of an array.
 */
export function geomean(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().geomean_f64(ptr, len));
}

/**
 * Calculate the skewness of an array.
 */
export function skewness(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().skewness_f64(ptr, len));
}

/**
 * Calculate the kurtosis of an array.
 */
export function kurtosis(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().kurtosis_f64(ptr, len));
}

/**
 * Calculate the k-th standardized moment.
 */
export function stanMoment(data: ArrayLike<number>, k: number): number {
  return runStatsOp(data, (ptr, len) => requireWasm().stan_moment_f64(ptr, len, k));
}

/**
 * Calculate the coefficient of variation.
 */
export function coeffvar(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().coeffvar_f64(ptr, len));
}

/**
 * Calculate the mean absolute deviation.
 */
export function meandev(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().meandev_f64(ptr, len));
}

/**
 * Calculate the median absolute deviation.
 */
export function meddev(data: ArrayLike<number>): number {
  return runStatsOp(data, (ptr, len) => requireWasm().meddev_f64(ptr, len));
}

/**
 * Calculate the pooled variance of two arrays.
 */
export function pooledvariance(data1: ArrayLike<number>, data2: ArrayLike<number>): number {
  const wasm = requireWasm();
  const len1 = data1.length;
  const len2 = data2.length;
  if (len1 === 0 || len2 === 0) return NaN;

  const ptr1 = wasm.alloc_f64(len1);
  const ptr2 = wasm.alloc_f64(len2);
  const view1 = getF64View(ptr1, len1);
  const view2 = getF64View(ptr2, len2);
  copyToWasmMemory(data1, view1);
  copyToWasmMemory(data2, view2);

  const result = wasm.pooledvariance_f64(ptr1, len1, ptr2, len2);
  wasm.free_f64(ptr1, len1);
  wasm.free_f64(ptr2, len2);
  return result;
}

/**
 * Calculate the pooled standard deviation of two arrays.
 */
export function pooledstdev(data1: ArrayLike<number>, data2: ArrayLike<number>): number {
  const wasm = requireWasm();
  const len1 = data1.length;
  const len2 = data2.length;
  if (len1 === 0 || len2 === 0) return NaN;

  const ptr1 = wasm.alloc_f64(len1);
  const ptr2 = wasm.alloc_f64(len2);
  const view1 = getF64View(ptr1, len1);
  const view2 = getF64View(ptr2, len2);
  copyToWasmMemory(data1, view1);
  copyToWasmMemory(data2, view2);

  const result = wasm.pooledstdev_f64(ptr1, len1, ptr2, len2);
  wasm.free_f64(ptr1, len1);
  wasm.free_f64(ptr2, len2);
  return result;
}

/**
 * Calculate the cumulative sum.
 */
export function cumsum(data: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.cumsum_f64(ptr, len);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Calculate the cumulative product.
 */
export function cumprod(data: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.cumprod_f64(ptr, len);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Calculate the difference between consecutive elements.
 */
export function diff(data: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len < 1) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.diff_f64(ptr, len);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Calculate the rank of each element.
 */
export function rank(data: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.rank_f64(ptr, len);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Calculate the deviation from the mean for each element.
 */
export function deviation(data: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.deviation_f64(ptr, len);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Calculate a histogram with specified number of bins.
 */
export function histogram(data: ArrayLike<number>, binCount: number = 4): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);
  const result = wasm.histogram_f64(ptr, len, binCount);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  return output;
}

/**
 * Cumulative reduction using a custom reducer function.
 * 
 * Note: This is implemented in JS to allow custom reducers.
 */
export function cumreduce(
  data: ArrayLike<number>,
  initialValue: number,
  reducer: (acc: number, val: number) => number
): Float64Array {
  const len = data.length;
  const result = new Float64Array(len);
  let acc = initialValue;
  for (let i = 0; i < len; i++) {
    acc = reducer(acc, data[i]);
    result[i] = acc;
  }
  return result;
}
