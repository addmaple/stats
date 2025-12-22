import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() {
  return wasmExports().memory;
}

export function alloc_f64(len) {
  return alloc(len * 8);
}

export function free_f64(ptr, len) {
  free(ptr, len * 8);
}

// Correlation functions
export function covariance_f64(xPtr, xLen, yPtr, yLen) { return wasmExports().covariance_f64(xPtr, xLen, yPtr, yLen); }
export function corrcoeff_f64(xPtr, xLen, yPtr, yLen) { return wasmExports().corrcoeff_f64(xPtr, xLen, yPtr, yLen); }
export function spearmancoeff_f64(xPtr, xLen, yPtr, yLen) { return wasmExports().spearmancoeff_f64(xPtr, xLen, yPtr, yLen); }

