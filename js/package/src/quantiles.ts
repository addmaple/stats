import {
  f64View,
  copyToWasmMemory,
  readWasmArray,
  loadWasmModule,
  ArrayResult,
} from './shared';

interface QuantilesWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  percentile_f64(ptr: number, len: number, k: number, exclusive: boolean): number;
  percentile_inclusive_f64(ptr: number, len: number, k: number): number;
  percentile_exclusive_f64(ptr: number, len: number, k: number): number;
  percentile_of_score_f64(ptr: number, len: number, score: number, strict: boolean): number;
  quartiles_f64(ptr: number, len: number): { q1: number; q2: number; q3: number };
  iqr_f64(ptr: number, len: number): number;
  quantiles_f64(dataPtr: number, dataLen: number, qsPtr: number, qsLen: number): ArrayResult;
  histogram_f64(ptr: number, len: number, binCount: number): ArrayResult;
  histogram_edges_f64(dataPtr: number, dataLen: number, edgesPtr: number, edgesLen: number): ArrayResult;
}

let wasmModule: QuantilesWasmModule | null = null;

function requireWasm(): QuantilesWasmModule {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  return wasmModule;
}

export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-quantiles/stat_wasm_quantiles.js');
  wasmModule = mod as unknown as QuantilesWasmModule;
}

export function percentile(data: ArrayLike<number>, k: number, exclusive: boolean = false): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.percentile_f64(ptr, len, k, exclusive);
  wasmModule.free_f64(ptr, len);
  return result;
}

export function percentileInclusive(data: ArrayLike<number>, k: number): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.percentile_inclusive_f64(ptr, len, k);
  wasmModule.free_f64(ptr, len);
  return result;
}

export function percentileExclusive(data: ArrayLike<number>, k: number): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.percentile_exclusive_f64(ptr, len, k);
  wasmModule.free_f64(ptr, len);
  return result;
}

export function percentileOfScore(data: ArrayLike<number>, score: number, strict: boolean = false): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.percentile_of_score_f64(ptr, len, score, strict);
  wasmModule.free_f64(ptr, len);
  return result;
}

export interface QuartilesResult {
  q1: number;
  q2: number;
  q3: number;
}

export function quartiles(data: ArrayLike<number>): QuartilesResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return { q1: NaN, q2: NaN, q3: NaN };
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.quartiles_f64(ptr, len);
  wasmModule.free_f64(ptr, len);
  return result;
}

export function iqr(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const len = data.length;
  if (len === 0) {
    return NaN;
  }
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len, wasmModule.get_memory());
  copyToWasmMemory(data, view);
  const result = wasmModule.iqr_f64(ptr, len);
  wasmModule.free_f64(ptr, len);
  return result;
}

export function percentiles(
  data: ArrayLike<number>,
  ps: ArrayLike<number>
): Float64Array {
  return quantiles(data, ps);
}

export function quantiles(data: ArrayLike<number>, quantiles: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const dataLen = data.length;
  const qsLen = quantiles.length;
  if (dataLen === 0 || qsLen === 0) {
    return new Float64Array();
  }
  const dataPtr = wasmModule.alloc_f64(dataLen);
  const qsPtr = wasmModule.alloc_f64(qsLen);
  const dataView = f64View(dataPtr, dataLen, wasmModule.get_memory());
  const qsView = f64View(qsPtr, qsLen, wasmModule.get_memory());
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(quantiles, qsView);
  const result = wasmModule.quantiles_f64(dataPtr, dataLen, qsPtr, qsLen);
  const output = readWasmArray(result, wasmModule.get_memory());
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(qsPtr, qsLen);
  wasmModule.free_f64(result.ptr, result.len);
  return output;
}

export function histogram(data: ArrayLike<number>, binCount: number): Float64Array {
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

export function histogramEdges(data: ArrayLike<number>, edges: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  const dataLen = data.length;
  const edgesLen = edges.length;
  if (dataLen === 0 || edgesLen === 0) {
    return new Float64Array();
  }
  const dataPtr = wasmModule.alloc_f64(dataLen);
  const edgesPtr = wasmModule.alloc_f64(edgesLen);
  const dataView = f64View(dataPtr, dataLen, wasmModule.get_memory());
  const edgesView = f64View(edgesPtr, edgesLen, wasmModule.get_memory());
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(edges, edgesView);
  const result = wasmModule.histogram_edges_f64(dataPtr, dataLen, edgesPtr, edgesLen);
  const output = readWasmArray(result, wasmModule.get_memory());
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(edgesPtr, edgesLen);
  wasmModule.free_f64(result.ptr, result.len);
  return output;
}

