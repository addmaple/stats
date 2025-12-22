import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() { return wasmExports().memory; }
export function alloc_f64(len) { return alloc(len * 8); }
export function free_f64(ptr, len) { free(ptr, len * 8); }

// Quantiles
export function percentile_f64(ptr, len, k, ex) { return wasmExports().percentile_f64(ptr, len, k, ex); }
export function percentile_inclusive_f64(ptr, len, k) { return wasmExports().percentile_inclusive_f64(ptr, len, k); }
export function percentile_exclusive_f64(ptr, len, k) { return wasmExports().percentile_exclusive_f64(ptr, len, k); }
export function percentile_of_score_f64(ptr, len, s, st) { return wasmExports().percentile_of_score_f64(ptr, len, s, st); }
export function qscore_f64(ptr, len, s, st) { return wasmExports().qscore_f64(ptr, len, s, st); }
export function qtest_f64(ptr, len, s, ql, qu) { return !!wasmExports().qtest_f64(ptr, len, s, ql, qu); }

export function quartiles_f64(ptr, len) {
  const outPtr = alloc(3 * 8);
  wasmExports().quartiles_f64(ptr, len, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { q1: view[0], q2: view[1], q3: view[2] };
  free(outPtr, 3 * 8);
  return res;
}
export function iqr_f64(ptr, len) { return wasmExports().iqr_f64(ptr, len); }
export function quantiles_f64(dp, dl, qsp, qsl) {
  const outPtr = alloc(qsl * 8);
  const written = wasmExports().quantiles_f64(dp, dl, qsp, qsl, outPtr);
  return { ptr: outPtr, len: Number(written) };
}

// Weighted
export function weighted_percentile_f64(dp, dl, wp, wl, p) { return wasmExports().weighted_percentile_f64(dp, dl, wp, wl, p); }
export function weighted_quantiles_f64(dp, dl, wp, wl, qsp, qsl) {
  const outPtr = alloc(qsl * 8);
  const written = wasmExports().weighted_quantiles_f64(dp, dl, wp, wl, qsp, qsl, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function weighted_median_f64(dp, dl, wp, wl) { return wasmExports().weighted_median_f64(dp, dl, wp, wl); }

// Histograms
export function histogram_f64(ptr, len, bc) {
  const outPtr = alloc(bc * 8);
  const written = wasmExports().histogram_f64(ptr, len, bc, outPtr);
  return { ptr: outPtr, len: Number(written), cap: bc };
}
export function histogram_edges_f64(dp, dl, ep, el) {
  const bc = el > 0 ? el - 1 : 0;
  const outPtr = alloc(bc * 8);
  const written = wasmExports().histogram_edges_f64(dp, dl, ep, el, outPtr);
  return { ptr: outPtr, len: Number(written), cap: bc };
}

function histogramWithEdgesHelper(fn, ptr, len, bins, ...args) {
  const edgesOutPtr = alloc((bins + 1) * 8);
  const countsOutPtr = alloc(bins * 8);
  const written = wasmExports()[fn](ptr, len, bins, ...args, edgesOutPtr, countsOutPtr);
  return {
    edges: { ptr: edgesOutPtr, len: bins + 1, cap: bins + 1 },
    counts: { ptr: countsOutPtr, len: Number(written), cap: bins }
  };
}

export function histogram_fixed_width_with_edges_f64(ptr, len, bins) { return histogramWithEdgesHelper('histogram_fixed_width_with_edges_f64', ptr, len, bins); }
export function histogram_equal_frequency_with_edges_f64(ptr, len, bins) { return histogramWithEdgesHelper('histogram_equal_frequency_with_edges_f64', ptr, len, bins); }
export function histogram_auto_with_edges_f64(ptr, len, rule, binsOverride) {
  const maxBins = 1024; 
  const edgesOutPtr = alloc((maxBins + 1) * 8);
  const countsOutPtr = alloc(maxBins * 8);
  const written = wasmExports().histogram_auto_with_edges_f64(ptr, len, rule, binsOverride, edgesOutPtr, countsOutPtr);
  return {
    edges: { ptr: edgesOutPtr, len: Number(written) + 1, cap: maxBins + 1 },
    counts: { ptr: countsOutPtr, len: Number(written), cap: maxBins }
  };
}
export function histogram_auto_with_edges_collapse_tails_f64(ptr, len, rule, binsOverride, k) {
  const maxBins = 1024;
  const edgesOutPtr = alloc((maxBins + 1) * 8);
  const countsOutPtr = alloc(maxBins * 8);
  const written = wasmExports().histogram_auto_with_edges_collapse_tails_f64(ptr, len, rule, binsOverride, k, edgesOutPtr, countsOutPtr);
  return {
    edges: { ptr: edgesOutPtr, len: Number(written) + 1, cap: maxBins + 1 },
    counts: { ptr: countsOutPtr, len: Number(written), cap: maxBins }
  };
}
export function histogram_custom_with_edges_f64(dp, dl, ep, el, co) {
  const countsOutPtr = alloc((el - 1) * 8);
  const edgesOutPtr = alloc(el * 8);
  const written = wasmExports().histogram_custom_with_edges_f64(dp, dl, ep, el, co, edgesOutPtr, countsOutPtr);
  return {
    edges: { ptr: edgesOutPtr, len: el, cap: el },
    counts: { ptr: countsOutPtr, len: Number(written), cap: el - 1 }
  };
}
