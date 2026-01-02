import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type {
  ArrayResult,
  QuantilesWasmModule,
  HistogramWithEdgesResult,
} from './wasm-types.js';

let wasmModule: QuantilesWasmModule | null = null;

/**
 * Get the current WASM module instance.
 */
export function getQuantilesWasm(): QuantilesWasmModule | null {
  return wasmModule;
}

/**
 * Set the WASM module instance.
 */
export function setQuantilesWasm(mod: QuantilesWasmModule): void {
  wasmModule = mod;
}

const requireWasm = createRequireWasm(() => wasmModule);

/**
 * Initialize the quantiles wasm module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-quantiles', options.inline);
  wasmModule = mod as unknown as QuantilesWasmModule;
}

/**
 * Helper to create a view into wasm memory
 */
function getF64View(ptr: number, len: number): Float64Array {
  const wasm = requireWasm();
  return f64View(ptr, len, wasm.get_memory());
}

/**
 * Calculate a percentile of an array.
 * 
 * @param data - Sorted or unsorted array
 * @param k - Percentile (0 to 1)
 * @param exclusive - If true, use exclusive percentile calculation
 */
export function percentile(data: ArrayLike<number>, k: number, exclusive: boolean = false): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0 || k < 0 || k > 1) return NaN;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.percentile_f64(ptr, len, k, exclusive);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentileInclusive(data: ArrayLike<number>, k: number): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0 || k < 0 || k > 1) return NaN;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.percentile_inclusive_f64(ptr, len, k);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentileExclusive(data: ArrayLike<number>, k: number): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0 || k < 0 || k > 1) return NaN;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.percentile_exclusive_f64(ptr, len, k);
  wasm.free_f64(ptr, len);
  return result;
}

/**
 * Calculate the percentile rank of a score.
 */
export function percentileOfScore(data: ArrayLike<number>, score: number, strict: boolean = false): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return NaN;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.percentile_of_score_f64(ptr, len, score, strict);
  wasm.free_f64(ptr, len);
  return result;
}

/**
 * Calculate the Q-score (quantile score) of a value.
 */
export function qscore(data: ArrayLike<number>, score: number, strict: boolean = false): number {
  return percentileOfScore(data, score, strict);
}

/**
 * Perform a quantile test.
 */
export function qtest(data: ArrayLike<number>, score: number, qLower: number, qUpper: number): boolean {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return false;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.qtest_f64(ptr, len, score, qLower, qUpper);
  wasm.free_f64(ptr, len);
  return result;
}

/**
 * Calculate quartiles (Q1, Q2, Q3).
 */
export function quartiles(data: ArrayLike<number>): [number, number, number] {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return [NaN, NaN, NaN];

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.quartiles_f64(ptr, len);
  wasm.free_f64(ptr, len);
  return [result.q1, result.q2, result.q3];
}

/**
 * Calculate interquartile range (IQR).
 */
export function iqr(data: ArrayLike<number>): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return NaN;

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.iqr_f64(ptr, len);
  wasm.free_f64(ptr, len);
  return result;
}

/**
 * Calculate multiple percentiles at once.
 */
export function percentiles(data: ArrayLike<number>, ps: ArrayLike<number>): Float64Array {
  return quantiles(data, ps);
}

/**
 * Calculate multiple quantiles at once.
 */
export function quantiles(data: ArrayLike<number>, qs: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const dLen = data.length;
  const qLen = qs.length;
  if (dLen === 0 || qLen === 0) return new Float64Array();

  const dPtr = wasm.alloc_f64(dLen);
  const qPtr = wasm.alloc_f64(qLen);
  const dView = getF64View(dPtr, dLen);
  const qView = getF64View(qPtr, qLen);

  copyToWasmMemory(data, dView);
  copyToWasmMemory(qs, qView);

  const result = wasm.quantiles_f64(dPtr, dLen, qPtr, qLen);
  const output = readWasmArray(result, wasm.get_memory());

  wasm.free_f64(dPtr, dLen);
  wasm.free_f64(qPtr, qLen);
  wasm.free_f64(result.ptr, result.len);
  return output;
}

/**
 * Calculate a weighted percentile.
 */
export function weightedPercentile(data: ArrayLike<number>, weights: ArrayLike<number>, p: number): number {
  const wasm = requireWasm();
  const dLen = data.length;
  if (dLen === 0 || dLen !== weights.length) return NaN;

  const dPtr = wasm.alloc_f64(dLen);
  const wPtr = wasm.alloc_f64(dLen);
  const dView = getF64View(dPtr, dLen);
  const wView = getF64View(wPtr, dLen);

  copyToWasmMemory(data, dView);
  copyToWasmMemory(weights, wView);

  const result = wasm.weighted_percentile_f64(dPtr, dLen, wPtr, dLen, p);
  wasm.free_f64(dPtr, dLen);
  wasm.free_f64(wPtr, dLen);
  return result;
}

/**
 * Calculate multiple weighted quantiles at once.
 */
export function weightedQuantiles(data: ArrayLike<number>, weights: ArrayLike<number>, qs: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const dLen = data.length;
  const qLen = qs.length;
  if (dLen === 0 || dLen !== weights.length || qLen === 0) return new Float64Array();

  const dPtr = wasm.alloc_f64(dLen);
  const wPtr = wasm.alloc_f64(dLen);
  const qPtr = wasm.alloc_f64(qLen);
  const dView = getF64View(dPtr, dLen);
  const wView = getF64View(wPtr, dLen);
  const qView = getF64View(qPtr, qLen);

  copyToWasmMemory(data, dView);
  copyToWasmMemory(weights, wView);
  copyToWasmMemory(qs, qView);

  const result = wasm.weighted_quantiles_f64(dPtr, dLen, wPtr, dLen, qPtr, qLen);
  const output = readWasmArray(result, wasm.get_memory());

  wasm.free_f64(dPtr, dLen);
  wasm.free_f64(wPtr, dLen);
  wasm.free_f64(qPtr, qLen);
  wasm.free_f64(result.ptr, result.len);
  return output;
}

/**
 * Calculate the weighted median.
 */
export function weightedMedian(data: ArrayLike<number>, weights: ArrayLike<number>): number {
  const wasm = requireWasm();
  const dLen = data.length;
  if (dLen === 0 || dLen !== weights.length) return NaN;

  const dPtr = wasm.alloc_f64(dLen);
  const wPtr = wasm.alloc_f64(dLen);
  const dView = getF64View(dPtr, dLen);
  const wView = getF64View(wPtr, dLen);

  copyToWasmMemory(data, dView);
  copyToWasmMemory(weights, wView);

  const result = wasm.weighted_median_f64(dPtr, dLen, wPtr, dLen);
  wasm.free_f64(dPtr, dLen);
  wasm.free_f64(wPtr, dLen);
  return result;
}

/**
 * Calculate a histogram with specified number of bins.
 */
export function histogram(data: ArrayLike<number>, binCount: number): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return new Float64Array();

  const ptr = wasm.alloc_f64(len);
  const view = getF64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasm.histogram_f64(ptr, len, binCount);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(ptr, len);
  wasm.free_f64(result.ptr, result.len);
  return output;
}

/**
 * Calculate a histogram with specified bin edges.
 */
export function histogramEdges(data: ArrayLike<number>, edges: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const dLen = data.length;
  const eLen = edges.length;
  if (dLen === 0 || eLen < 2) return new Float64Array();

  const dPtr = wasm.alloc_f64(dLen);
  const ePtr = wasm.alloc_f64(eLen);
  const dView = getF64View(dPtr, dLen);
  const eView = getF64View(ePtr, eLen);

  copyToWasmMemory(data, dView);
  copyToWasmMemory(edges, eView);

  const result = wasm.histogram_edges_f64(dPtr, dLen, ePtr, eLen);
  const output = readWasmArray(result, wasm.get_memory());

  wasm.free_f64(dPtr, dLen);
  wasm.free_f64(ePtr, eLen);
  wasm.free_f64(result.ptr, result.len);
  return output;
}

export type HistogramBinningOptions =
  | { mode: 'auto'; rule?: 'FD' | 'Scott' | 'sqrtN'; bins?: number; collapseTails?: { enabled: boolean; k?: number } }
  | { mode: 'equalFrequency'; bins: number }
  | { mode: 'fixedWidth'; bins: number }
  | { mode: 'custom'; edges: number[] | Float64Array };

export interface HistogramBinningResult {
  edges: Float64Array;
  counts: Float64Array;
}

/**
 * Advanced histogram binning function.
 */
export function histogramBinning(data: ArrayLike<number>, options: HistogramBinningOptions | number): HistogramBinningResult {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) return { edges: new Float64Array(), counts: new Float64Array() };

  // Handle legacy numeric input
  if (typeof options === 'number') {
    options = { mode: 'auto', bins: options };
  }

  const dPtr = wasm.alloc_f64(len);
  copyToWasmMemory(data, getF64View(dPtr, len));

  let res: HistogramWithEdgesResult;

  if (options.mode === 'auto') {
    const rule = options.rule === 'Scott' ? 1 : options.rule === 'sqrtN' ? 2 : 0;
    if (options.collapseTails?.enabled) {
      res = wasm.histogram_auto_with_edges_collapse_tails_f64(dPtr, len, rule, options.bins ?? 0, options.collapseTails.k ?? 1.5);
    } else {
      res = wasm.histogram_auto_with_edges_f64(dPtr, len, rule, options.bins ?? 0);
    }
  } else if (options.mode === 'equalFrequency') {
    if (!options.bins) throw new Error('equalFrequency mode requires bins > 0');
    res = wasm.histogram_equal_frequency_with_edges_f64(dPtr, len, options.bins);
  } else if (options.mode === 'fixedWidth') {
    if (!options.bins) throw new Error('fixedWidth mode requires bins > 0');
    res = wasm.histogram_fixed_width_with_edges_f64(dPtr, len, options.bins);
  } else if (options.mode === 'custom') {
    if (!options.edges || options.edges.length < 2) throw new Error('custom mode requires edges array');
    const eLen = options.edges.length;
    const ePtr = wasm.alloc_f64(eLen);
    copyToWasmMemory(options.edges, f64View(ePtr, eLen, wasm.get_memory()));
    res = wasm.histogram_custom_with_edges_f64(dPtr, len, ePtr, eLen, false);
    wasm.free_f64(ePtr, eLen);
  } else {
    wasm.free_f64(dPtr, len);
    throw new Error(`Invalid binning mode: ${(options as any).mode}`);
  }

  const edges = readWasmArray(res.edges, wasm.get_memory());
  const counts = readWasmArray(res.counts, wasm.get_memory());

  wasm.free_f64(dPtr, len);
  wasm.free_f64(res.edges.ptr, res.edges.cap ?? res.edges.len);
  wasm.free_f64(res.counts.ptr, res.counts.cap ?? res.counts.len);

  return { edges, counts };
}

/**
 * Presets for common histogram binning strategies.
 */
export const BinningPresets = {
  autoFD: (bins?: number): HistogramBinningOptions => ({ mode: 'auto', rule: 'FD', bins }),
  autoScott: (bins?: number): HistogramBinningOptions => ({ mode: 'auto', rule: 'Scott', bins }),
  autoSqrt: (bins?: number): HistogramBinningOptions => ({ mode: 'auto', rule: 'sqrtN', bins }),
  autoWithTailCollapse: (k: number = 1.5, bins?: number): HistogramBinningOptions => ({ mode: 'auto', rule: 'FD', bins, collapseTails: { enabled: true, k } }),
  equalFrequency: (bins: number): HistogramBinningOptions => ({ mode: 'equalFrequency', bins }),
  fixedWidth: (bins: number): HistogramBinningOptions => ({ mode: 'fixedWidth', bins }),
  deciles: (): HistogramBinningOptions => ({ mode: 'equalFrequency', bins: 10 }),
  quartiles: (): HistogramBinningOptions => ({ mode: 'equalFrequency', bins: 4 }),
  custom: (edges: number[] | Float64Array): HistogramBinningOptions => ({ mode: 'custom', edges: [...edges].sort((a, b) => a - b) }),
};
