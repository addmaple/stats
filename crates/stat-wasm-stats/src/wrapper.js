import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() { return wasmExports().memory; }
export function alloc_f64(len) { return alloc(len * 8); }
export function free_f64(ptr, len) { free(ptr, len * 8); }

// Scalar functions
export function sum_f64(ptr, len) { return wasmExports().sum_f64(ptr, len); }
export function mean_f64(ptr, len) { return wasmExports().mean_f64(ptr, len); }
export function variance_f64(ptr, len) { return wasmExports().variance_f64(ptr, len); }
export function sample_variance_f64(ptr, len) { return wasmExports().sample_variance_f64(ptr, len); }
export function stdev_f64(ptr, len) { return wasmExports().stdev_f64(ptr, len); }
export function sample_stdev_f64(ptr, len) { return wasmExports().sample_stdev_f64(ptr, len); }
export function min_f64(ptr, len) { return wasmExports().min_f64(ptr, len); }
export function max_f64(ptr, len) { return wasmExports().max_f64(ptr, len); }
export function product_f64(ptr, len) { return wasmExports().product_f64(ptr, len); }
export function range_f64(ptr, len) { return wasmExports().range_f64(ptr, len); }
export function median_f64(ptr, len) { return wasmExports().median_f64(ptr, len); }
export function mode_f64(ptr, len) { return wasmExports().mode_f64(ptr, len); }
export function geomean_f64(ptr, len) { return wasmExports().geomean_f64(ptr, len); }
export function skewness_f64(ptr, len) { return wasmExports().skewness_f64(ptr, len); }
export function kurtosis_f64(ptr, len) { return wasmExports().kurtosis_f64(ptr, len); }
export function coeffvar_f64(ptr, len) { return wasmExports().coeffvar_f64(ptr, len); }
export function meandev_f64(ptr, len) { return wasmExports().meandev_f64(ptr, len); }
export function meddev_f64(ptr, len) { return wasmExports().meddev_f64(ptr, len); }
export function pooledvariance_f64(d1p, d1l, d2p, d2l) { return wasmExports().pooledvariance_f64(d1p, d1l, d2p, d2l); }
export function pooledstdev_f64(d1p, d1l, d2p, d2l) { return wasmExports().pooledstdev_f64(d1p, d1l, d2p, d2l); }
export function stan_moment_f64(ptr, len, k) { return wasmExports().stan_moment_f64(ptr, len, k); }

// Array functions
export function cumsum_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().cumsum_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function cumprod_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().cumprod_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function diff_f64(ptr, len) {
  if (len < 1) return { ptr: 0, len: 0 };
  const outPtr = alloc((len - 1) * 8);
  const written = wasmExports().diff_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function rank_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().rank_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function deviation_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().deviation_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function histogram_f64(ptr, len, binCount) {
  const outPtr = alloc(binCount * 8);
  const written = wasmExports().histogram_f64(ptr, len, binCount, outPtr);
  return { ptr: outPtr, len: Number(written) };
}

