import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type { ArrayResult, QuantilesWasmModule } from './wasm-types.js';

let wasmModule: QuantilesWasmModule | null = null;

const requireWasm = createRequireWasm(() => wasmModule);

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-quantiles/stat_wasm_quantiles.js');
  wasmModule = mod as unknown as QuantilesWasmModule;
}

export function percentile(data: ArrayLike<number>, k: number, exclusive: boolean = false): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.percentile_f64(ptr, len, k, exclusive);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentileInclusive(data: ArrayLike<number>, k: number): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.percentile_inclusive_f64(ptr, len, k);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentileExclusive(data: ArrayLike<number>, k: number): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.percentile_exclusive_f64(ptr, len, k);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentileOfScore(data: ArrayLike<number>, score: number, strict: boolean = false): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.percentile_of_score_f64(ptr, len, score, strict);
  wasm.free_f64(ptr, len);
  return result;
}

export interface QuartilesResult {
  q1: number;
  q2: number;
  q3: number;
}

export function quartiles(data: ArrayLike<number>): [number, number, number] {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return [NaN, NaN, NaN];
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.quartiles_f64(ptr, len);
  wasm.free_f64(ptr, len);
  return [result.q1, result.q2, result.q3];
}

export function iqr(data: ArrayLike<number>): number {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.iqr_f64(ptr, len);
  wasm.free_f64(ptr, len);
  return result;
}

export function percentiles(
  data: ArrayLike<number>,
  ps: ArrayLike<number>
): Float64Array {
  return quantiles(data, ps);
}

export function quantiles(data: ArrayLike<number>, quantilesArr: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const dataLen = data.length;
  const qsLen = quantilesArr.length;
  if (dataLen === 0 || qsLen === 0) {
    return new Float64Array();
  }
  const dataPtr = wasm.alloc_f64(dataLen);
  const qsPtr = wasm.alloc_f64(qsLen);
  const dataView = f64View(dataPtr, dataLen, wasm.get_memory());
  const qsView = f64View(qsPtr, qsLen, wasm.get_memory());
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(quantilesArr, qsView);
  const result = wasm.quantiles_f64(dataPtr, dataLen, qsPtr, qsLen);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(dataPtr, dataLen);
  wasm.free_f64(qsPtr, qsLen);
  wasm.free_f64(result.ptr, result.len);
  return output;
}

export function histogram(data: ArrayLike<number>, binCount: number): Float64Array {
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

export function histogramEdges(data: ArrayLike<number>, edges: ArrayLike<number>): Float64Array {
  const wasm = requireWasm();
  const dataLen = data.length;
  const edgesLen = edges.length;
  if (dataLen === 0 || edgesLen === 0) {
    return new Float64Array();
  }
  const dataPtr = wasm.alloc_f64(dataLen);
  const edgesPtr = wasm.alloc_f64(edgesLen);
  const dataView = f64View(dataPtr, dataLen, wasm.get_memory());
  const edgesView = f64View(edgesPtr, edgesLen, wasm.get_memory());
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(edges, edgesView);
  const result = wasm.histogram_edges_f64(dataPtr, dataLen, edgesPtr, edgesLen);
  const output = readWasmArray(result, wasm.get_memory());
  wasm.free_f64(dataPtr, dataLen);
  wasm.free_f64(edgesPtr, edgesLen);
  wasm.free_f64(result.ptr, result.len);
  return output;
}
