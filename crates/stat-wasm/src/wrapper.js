import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() { return wasmExports().memory; }
export function alloc_f64(len) { return alloc(len * 8); }
export function free_f64(ptr, len) { free(ptr, len * 8); }
export function alloc_f32(len) { return alloc(len * 4); }
export function free_f32(ptr, len) { free(ptr, len * 4); }
export function alloc_i32(len) { return alloc(len * 4); }
export function free_i32(ptr, len) { free(ptr, len * 4); }

// Stats functions (Scalars)
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
export function percentile_of_score_f64(ptr, len, s, st) { return wasmExports().percentile_of_score_f64(ptr, len, s, st); }
export function qscore_f64(ptr, len, s, st) { return wasmExports().qscore_f64(ptr, len, s, st); }
export function qtest_f64(ptr, len, s, ql, qu) { return !!wasmExports().qtest_f64(ptr, len, s, ql, qu); }

// Stats functions (Direct)
export function sum_f64_direct(ptr, len) { return wasmExports().sum_f64_direct(ptr, len); }
export function mean_f64_direct(ptr, len) { return wasmExports().mean_f64_direct(ptr, len); }
export function variance_f64_direct(ptr, len) { return wasmExports().variance_f64_direct(ptr, len); }
export function sample_variance_f64_direct(ptr, len) { return wasmExports().sample_variance_f64_direct(ptr, len); }
export function stdev_f64_direct(ptr, len) { return wasmExports().stdev_f64_direct(ptr, len); }
export function sample_stdev_f64_direct(ptr, len) { return wasmExports().sample_stdev_f64_direct(ptr, len); }

// Array stats functions
export function cumsum_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().cumsum_f64(ptr, len, outPtr);
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
export function cumprod_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().cumprod_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}
export function deviation_f64(ptr, len) {
  const outPtr = alloc(len * 8);
  const written = wasmExports().deviation_f64(ptr, len, outPtr);
  return { ptr: outPtr, len: Number(written) };
}

// Correlation
export function covariance_f64(xp, xl, yp, yl) { return wasmExports().covariance_f64(xp, xl, yp, yl); }
export function corrcoeff_f64(xp, xl, yp, yl) { return wasmExports().corrcoeff_f64(xp, xl, yp, yl); }
export function spearmancoeff_f64(xp, xl, yp, yl) { return wasmExports().spearmancoeff_f64(xp, xl, yp, yl); }

// Quantiles
export function percentile_f64(ptr, len, k, ex) { return wasmExports().percentile_f64(ptr, len, k, ex); }
export function percentile_inclusive_f64(ptr, len, k) { return wasmExports().percentile_inclusive_f64(ptr, len, k); }
export function percentile_exclusive_f64(ptr, len, k) { return wasmExports().percentile_exclusive_f64(ptr, len, k); }
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

// ANOVA & Tests
export function anova_f_score_flat(dp, lp, ng) { return wasmExports().anova_f_score_flat(dp, lp, ng); }
export function anova_flat(dp, lp, ng) {
  const outPtr = alloc(3 * 8);
  wasmExports().anova_flat(dp, lp, ng, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { f_score: view[0], df_between: Number(view[1]), df_within: Number(view[2]) };
  free(outPtr, 3 * 8);
  return res;
}
export function ttest_f64(dp, l, mu0) {
  const outPtr = alloc(3 * 8);
  wasmExports().ttest_f64(dp, l, mu0, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { statistic: view[0], p_value: view[1], df: isNaN(view[2]) ? undefined : view[2] };
  free(outPtr, 3 * 8);
  return res;
}
export function ztest_f64(dp, l, mu0, s) {
  const outPtr = alloc(3 * 8);
  wasmExports().ztest_f64(dp, l, mu0, s, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { statistic: view[0], p_value: view[1], df: isNaN(view[2]) ? undefined : view[2] };
  free(outPtr, 3 * 8);
  return res;
}

// Regression
export function regress_f64(xp, xl, yp, yl) {
  const cOut = alloc(3 * 8);
  const rOut = alloc(xl * 8);
  const written = wasmExports().regress_f64(xp, xl, yp, yl, cOut, rOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2], residuals: { ptr: rOut, len: Number(written) } };
  free(cOut, 3 * 8);
  return res;
}
export function regress_naive_f64(xp, xl, yp, yl) {
  const cOut = alloc(3 * 8);
  const rOut = alloc(xl * 8);
  const written = wasmExports().regress_naive_f64(xp, xl, yp, yl, cOut, rOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2], residuals: { ptr: rOut, len: Number(written) } };
  free(cOut, 3 * 8);
  return res;
}
export function regress_simd_f64(xp, xl, yp, yl) {
  const cOut = alloc(3 * 8);
  const rOut = alloc(xl * 8);
  const written = wasmExports().regress_simd_f64(xp, xl, yp, yl, cOut, rOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2], residuals: { ptr: rOut, len: Number(written) } };
  free(cOut, 3 * 8);
  return res;
}
export function regress_wasm_kernels_f64(xp, xl, yp, yl) {
  const cOut = alloc(3 * 8);
  const rOut = alloc(xl * 8);
  const written = wasmExports().regress_wasm_kernels_f64(xp, xl, yp, yl, cOut, rOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2], residuals: { ptr: rOut, len: Number(written) } };
  free(cOut, 3 * 8);
  return res;
}

export function regress_coeffs_f64(xp, xl, yp, yl) {
  const out = alloc(3 * 8);
  wasmExports().regress_coeffs_f64(xp, xl, yp, yl, out);
  const cv = new Float64Array(wasmExports().memory.buffer, out, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(out, 3 * 8);
  return res;
}
export function regress_naive_coeffs_f64(xp, xl, yp, yl) {
  const out = alloc(3 * 8);
  wasmExports().regress_naive_coeffs_f64(xp, xl, yp, yl, out);
  const cv = new Float64Array(wasmExports().memory.buffer, out, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(out, 3 * 8);
  return res;
}
export function regress_simd_coeffs_f64(xp, xl, yp, yl) {
  const out = alloc(3 * 8);
  wasmExports().regress_simd_coeffs_f64(xp, xl, yp, yl, out);
  const cv = new Float64Array(wasmExports().memory.buffer, out, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(out, 3 * 8);
  return res;
}
export function regress_wasm_kernels_coeffs_f64(xp, xl, yp, yl) {
  const out = alloc(3 * 8);
  wasmExports().regress_wasm_kernels_coeffs_f64(xp, xl, yp, yl, out);
  const cv = new Float64Array(wasmExports().memory.buffer, out, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(out, 3 * 8);
  return res;
}

export function regress_naive_residuals_inplace_f64(xp, xl, yp, yl, rop) {
  const cOut = alloc(3 * 8);
  wasmExports().regress_naive_residuals_inplace_f64(xp, xl, yp, yl, rop, cOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(cOut, 3 * 8);
  return res;
}
export function regress_simd_residuals_inplace_f64(xp, xl, yp, yl, rop) {
  const cOut = alloc(3 * 8);
  wasmExports().regress_simd_residuals_inplace_f64(xp, xl, yp, yl, rop, cOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(cOut, 3 * 8);
  return res;
}
export function regress_wasm_kernels_residuals_inplace_f64(xp, xl, yp, yl, rop) {
  const cOut = alloc(3 * 8);
  wasmExports().regress_wasm_kernels_residuals_inplace_f64(xp, xl, yp, yl, rop, cOut);
  const cv = new Float64Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(cOut, 3 * 8);
  return res;
}

// f32 Regression
export function regress_simd_coeffs_f32(xp, xl, yp, yl) {
  const out = alloc(3 * 4);
  wasmExports().regress_simd_coeffs_f32(xp, xl, yp, yl, out);
  const cv = new Float32Array(wasmExports().memory.buffer, out, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(out, 3 * 4);
  return res;
}
export function regress_simd_residuals_inplace_f32(xp, xl, yp, yl, rop) {
  const cOut = alloc(3 * 4);
  wasmExports().regress_simd_residuals_inplace_f32(xp, xl, yp, yl, rop, cOut);
  const cv = new Float32Array(wasmExports().memory.buffer, cOut, 3);
  const res = { slope: cv[0], intercept: cv[1], r_squared: cv[2] };
  free(cOut, 3 * 4);
  return res;
}

// CI
export function normalci_f64(a, m, s) {
  const out = alloc(2 * 8);
  wasmExports().normalci_f64(a, m, s, out);
  const v = new Float64Array(wasmExports().memory.buffer, out, 2);
  const copy = new Float64Array(v);
  free(out, 2 * 8);
  return copy;
}
export function tci_f64(a, m, s, n) {
  const out = alloc(2 * 8);
  wasmExports().tci_f64(a, m, s, n, out);
  const v = new Float64Array(wasmExports().memory.buffer, out, 2);
  const copy = new Float64Array(v);
  free(out, 2 * 8);
  return copy;
}

// Helper for categorical mapping
function mapCategorical(cat) {
  const map = new Map();
  let next = 0;
  const ints = new Int32Array(cat.length);
  for (let i = 0; i < cat.length; i++) {
    let val = map.get(cat[i]);
    if (val === undefined) {
      val = next++;
      map.set(cat[i], val);
    }
    ints[i] = val;
  }
  return { ints, cardinality: next };
}

export function chi_square_test(cat1, cat2, options = {}) {
  const { ints: i1, cardinality: c1 } = mapCategorical(cat1);
  const { ints: i2, cardinality: c2 } = mapCategorical(cat2);
  const card1 = options.cardinality1 ?? c1;
  const card2 = options.cardinality2 ?? c2;
  const len = cat1.length;
  const p1 = alloc(len * 4);
  const p2 = alloc(len * 4);
  new Int32Array(wasmExports().memory.buffer, p1, len).set(i1);
  new Int32Array(wasmExports().memory.buffer, p2, len).set(i2);
  const outPtr = alloc(3 * 8);
  wasmExports().chi_square_test(p1, p2, len, card1, card2, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { statistic: view[0], p_value: view[1], df: view[2] };
  free(p1, len * 4);
  free(p2, len * 4);
  free(outPtr, 3 * 8);
  return res;
}

export function chi_square_test_with_cardinality(cat1, cat2, cardinality1, cardinality2) {
  return chi_square_test(cat1, cat2, { cardinality1, cardinality2 });
}

export function anova_f_score_categorical(groups, values) {
  const { ints } = mapCategorical(groups);
  const len = groups.length;
  const pg = alloc(len * 4);
  const pv = alloc(len * 8);
  new Int32Array(wasmExports().memory.buffer, pg, len).set(ints);
  new Float64Array(wasmExports().memory.buffer, pv, len).set(values);
  const res = wasmExports().anova_f_score_categorical(pg, pv, len);
  free(pg, len * 4);
  free(pv, len * 8);
  return res;
}

export function anova_categorical(groups, values) {
  const { ints } = mapCategorical(groups);
  const len = groups.length;
  const pg = alloc(len * 4);
  const pv = alloc(len * 8);
  new Int32Array(wasmExports().memory.buffer, pg, len).set(ints);
  new Float64Array(wasmExports().memory.buffer, pv, len).set(values);
  const outPtr = alloc(3 * 8);
  wasmExports().anova_categorical(pg, pv, len, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  const res = { f_score: view[0], df_between: view[1], df_within: view[2] };
  free(pg, len * 4);
  free(pv, len * 8);
  free(outPtr, 3 * 8);
  return res;
}

export function tukey_hsd_categorical(groups, values) {
  const { ints, cardinality } = mapCategorical(groups);
  const len = groups.length;
  const pg = alloc(len * 4);
  const pv = alloc(len * 8);
  new Int32Array(wasmExports().memory.buffer, pg, len).set(ints);
  new Float64Array(wasmExports().memory.buffer, pv, len).set(values);
  const numComps = (cardinality * (cardinality - 1)) / 2;
  const outPtr = alloc((3 + numComps * 7) * 8);
  const written = wasmExports().tukey_hsd_categorical(pg, pv, len, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3 + Number(written) * 7);
  const comparisons = [];
  for (let i = 0; i < Number(written); i++) {
    const base = 3 + i * 7;
    comparisons.push({
      group1: view[base], group2: view[base + 1], mean_diff: view[base + 2],
      q_statistic: view[base + 3], p_value: view[base + 4], ci_lower: view[base + 5], ci_upper: view[base + 6]
    });
  }
  const res = { num_groups: view[0], df_within: view[1], msw: view[2], comparisons };
  free(pg, len * 4); free(pv, len * 8); free(outPtr, (3 + numComps * 7) * 8);
  return res;
}

// Distributions
export function normal_pdf_scalar(x, m, s) { return wasmExports().normal_pdf_scalar(x, m, s); }
export function normal_cdf_scalar(x, m, s) { return wasmExports().normal_cdf_scalar(x, m, s); }
export function normal_inv_scalar(p, m, s) { return wasmExports().normal_inv_scalar(p, m, s); }
export function normal_pdf_inplace(ip, l, m, s, op) { wasmExports().normal_pdf_inplace(ip, l, m, s, op); }
export function normal_cdf_inplace(ip, l, m, s, op) { wasmExports().normal_cdf_inplace(ip, l, m, s, op); }

export function gamma_pdf_scalar(x, s, r) { return wasmExports().gamma_pdf_scalar(x, s, r); }
export function gamma_cdf_scalar(x, s, r) { return wasmExports().gamma_cdf_scalar(x, s, r); }
export function gamma_inv_scalar(p, s, r) { return wasmExports().gamma_inv_scalar(p, s, r); }
export function gamma_pdf_inplace(ip, l, s, r, op) { wasmExports().gamma_pdf_inplace(ip, l, s, r, op); }
export function gamma_cdf_inplace(ip, l, s, r, op) { wasmExports().gamma_cdf_inplace(ip, l, s, r, op); }

export function beta_pdf_scalar(x, a, b) { return wasmExports().beta_pdf_scalar(x, a, b); }
export function beta_cdf_scalar(x, a, b) { return wasmExports().beta_cdf_scalar(x, a, b); }
export function beta_inv_scalar(p, a, b) { return wasmExports().beta_inv_scalar(p, a, b); }
export function beta_pdf_inplace(ip, l, a, b, op) { wasmExports().beta_pdf_inplace(ip, l, a, b, op); }
export function beta_cdf_inplace(ip, l, a, b, op) { wasmExports().beta_cdf_inplace(ip, l, a, b, op); }

export function student_t_pdf_scalar(x, m, s, d) { return wasmExports().student_t_pdf_scalar(x, m, s, d); }
export function student_t_cdf_scalar(x, m, s, d) { return wasmExports().student_t_cdf_scalar(x, m, s, d); }
export function student_t_inv_scalar(p, m, s, d) { return wasmExports().student_t_inv_scalar(p, m, s, d); }
export function student_t_pdf_inplace(ip, l, m, s, d, op) { wasmExports().student_t_pdf_inplace(ip, l, m, s, d, op); }
export function student_t_cdf_inplace(ip, l, m, s, d, op) { wasmExports().student_t_cdf_inplace(ip, l, m, s, d, op); }

export function chi_squared_pdf_scalar(x, d) { return wasmExports().chi_squared_pdf_scalar(x, d); }
export function chi_squared_cdf_scalar(x, d) { return wasmExports().chi_squared_cdf_scalar(x, d); }
export function chi_squared_inv_scalar(p, d) { return wasmExports().chi_squared_inv_scalar(p, d); }
export function chi_squared_pdf_inplace(ip, l, d, op) { wasmExports().chi_squared_pdf_inplace(ip, l, d, op); }
export function chi_squared_cdf_inplace(ip, l, d, op) { wasmExports().chi_squared_cdf_inplace(ip, l, d, op); }

export function fisher_f_pdf_scalar(x, d1, d2) { return wasmExports().fisher_f_pdf_scalar(x, d1, d2); }
export function fisher_f_cdf_scalar(x, d1, d2) { return wasmExports().fisher_f_cdf_scalar(x, d1, d2); }
export function fisher_f_inv_scalar(p, d1, d2) { return wasmExports().fisher_f_inv_scalar(p, d1, d2); }
export function fisher_f_pdf_inplace(ip, l, d1, d2, op) { wasmExports().fisher_f_pdf_inplace(ip, l, d1, d2, op); }
export function fisher_f_cdf_inplace(ip, l, d1, d2, op) { wasmExports().fisher_f_cdf_inplace(ip, l, d1, d2, op); }

export function exponential_pdf_scalar(x, r) { return wasmExports().exponential_pdf_scalar(x, r); }
export function exponential_cdf_scalar(x, r) { return wasmExports().exponential_cdf_scalar(x, r); }
export function exponential_inv_scalar(p, r) { return wasmExports().exponential_inv_scalar(p, r); }
export function exponential_pdf_inplace(ip, l, r, op) { wasmExports().exponential_pdf_inplace(ip, l, r, op); }
export function exponential_cdf_inplace(ip, l, r, op) { wasmExports().exponential_cdf_inplace(ip, l, r, op); }

export function poisson_pmf_scalar(k, l) { return wasmExports().poisson_pmf_scalar(k, l); }
export function poisson_cdf_scalar(k, l) { return wasmExports().poisson_cdf_scalar(k, l); }
export function poisson_inv_scalar(p, l) { return wasmExports().poisson_inv_scalar(p, l); }
export function poisson_pmf_inplace(ip, l, lam, op) { wasmExports().poisson_pmf_inplace(ip, l, lam, op); }
export function poisson_cdf_inplace(ip, l, lam, op) { wasmExports().poisson_cdf_inplace(ip, l, lam, op); }

export function binomial_pmf_scalar(k, n, p) { return wasmExports().binomial_pmf_scalar(k, n, p); }
export function binomial_cdf_scalar(k, n, p) { return wasmExports().binomial_cdf_scalar(k, n, p); }
export function binomial_inv_scalar(pr, n, p) { return wasmExports().binomial_inv_scalar(pr, n, p); }
export function binomial_pmf_inplace(ip, l, n, p, op) { wasmExports().binomial_pmf_inplace(ip, l, n, p, op); }
export function binomial_cdf_inplace(ip, l, n, p, op) { wasmExports().binomial_cdf_inplace(ip, l, n, p, op); }

export function uniform_pdf_scalar(x, mi, ma) { return wasmExports().uniform_pdf_scalar(x, mi, ma); }
export function uniform_cdf_scalar(x, mi, ma) { return wasmExports().uniform_cdf_scalar(x, mi, ma); }
export function uniform_inv_scalar(p, mi, ma) { return wasmExports().uniform_inv_scalar(p, mi, ma); }
export function uniform_pdf_inplace(ip, l, mi, ma, op) { wasmExports().uniform_pdf_inplace(ip, l, mi, ma, op); }
export function uniform_cdf_inplace(ip, l, mi, ma, op) { wasmExports().uniform_cdf_inplace(ip, l, mi, ma, op); }

export function cauchy_pdf_scalar(x, lo, sc) { return wasmExports().cauchy_pdf_scalar(x, lo, sc); }
export function cauchy_cdf_scalar(x, lo, sc) { return wasmExports().cauchy_cdf_scalar(x, lo, sc); }
export function cauchy_inv_scalar(p, lo, sc) { return wasmExports().cauchy_inv_scalar(p, lo, sc); }
export function cauchy_pdf_inplace(ip, l, lo, sc, op) { wasmExports().cauchy_pdf_inplace(ip, l, lo, sc, op); }
export function cauchy_cdf_inplace(ip, l, lo, sc, op) { wasmExports().cauchy_cdf_inplace(ip, l, lo, sc, op); }

export function laplace_pdf_scalar(x, lo, sc) { return wasmExports().laplace_pdf_scalar(x, lo, sc); }
export function laplace_cdf_scalar(x, lo, sc) { return wasmExports().laplace_cdf_scalar(x, lo, sc); }
export function laplace_inv_scalar(p, lo, sc) { return wasmExports().laplace_inv_scalar(p, lo, sc); }
export function laplace_pdf_inplace(ip, l, lo, sc, op) { wasmExports().laplace_pdf_inplace(ip, l, lo, sc, op); }
export function laplace_cdf_inplace(ip, l, lo, sc, op) { wasmExports().laplace_cdf_inplace(ip, l, lo, sc, op); }

export function lognormal_pdf_scalar(x, m, s) { return wasmExports().lognormal_pdf_scalar(x, m, s); }
export function lognormal_cdf_scalar(x, m, s) { return wasmExports().lognormal_cdf_scalar(x, m, s); }
export function lognormal_inv_scalar(p, m, s) { return wasmExports().lognormal_inv_scalar(p, m, s); }
export function lognormal_pdf_inplace(ip, l, m, s, op) { wasmExports().lognormal_pdf_inplace(ip, l, m, s, op); }
export function lognormal_cdf_inplace(ip, l, m, s, op) { wasmExports().lognormal_cdf_inplace(ip, l, m, s, op); }

export function weibull_pdf_scalar(x, sh, sc) { return wasmExports().weibull_pdf_scalar(x, sh, sc); }
export function weibull_cdf_scalar(x, sh, sc) { return wasmExports().weibull_cdf_scalar(x, sh, sc); }
export function weibull_inv_scalar(p, sh, sc) { return wasmExports().weibull_inv_scalar(p, sh, sc); }
export function weibull_pdf_inplace(ip, l, sh, sc, op) { wasmExports().weibull_pdf_inplace(ip, l, sh, sc, op); }
export function weibull_cdf_inplace(ip, l, sh, sc, op) { wasmExports().weibull_cdf_inplace(ip, l, sh, sc, op); }

export function pareto_pdf_scalar(x, sc, sh) { return wasmExports().pareto_pdf_scalar(x, sc, sh); }
export function pareto_cdf_scalar(x, sc, sh) { return wasmExports().pareto_cdf_scalar(x, sc, sh); }
export function pareto_inv_scalar(p, sc, sh) { return wasmExports().pareto_inv_scalar(p, sc, sh); }
export function pareto_pdf_inplace(ip, l, sc, sh, op) { wasmExports().pareto_pdf_inplace(ip, l, sc, sh, op); }
export function pareto_cdf_inplace(ip, l, sc, sh, op) { wasmExports().pareto_cdf_inplace(ip, l, sc, sh, op); }

export function triangular_pdf_scalar(x, mi, ma, mo) { return wasmExports().triangular_pdf_scalar(x, mi, ma, mo); }
export function triangular_cdf_scalar(x, mi, ma, mo) { return wasmExports().triangular_cdf_scalar(x, mi, ma, mo); }
export function triangular_inv_scalar(p, mi, ma, mo) { return wasmExports().triangular_inv_scalar(p, mi, ma, mo); }
export function triangular_pdf_inplace(ip, l, mi, ma, mo, op) { wasmExports().triangular_pdf_inplace(ip, l, mi, ma, mo, op); }
export function triangular_cdf_inplace(ip, l, mi, ma, mo, op) { wasmExports().triangular_cdf_inplace(ip, l, mi, ma, mo, op); }

export function invgamma_pdf_scalar(x, sh, r) { return wasmExports().invgamma_pdf_scalar(x, sh, r); }
export function invgamma_cdf_scalar(x, sh, r) { return wasmExports().invgamma_cdf_scalar(x, sh, r); }
export function invgamma_inv_scalar(p, sh, r) { return wasmExports().invgamma_inv_scalar(p, sh, r); }
export function invgamma_pdf_inplace(ip, l, sh, r, op) { wasmExports().invgamma_pdf_inplace(ip, l, sh, r, op); }
export function invgamma_cdf_inplace(ip, l, sh, r, op) { wasmExports().invgamma_cdf_inplace(ip, l, sh, r, op); }

export function negbin_pmf_scalar(k, r, p) { return wasmExports().negbin_pmf_scalar(k, r, p); }
export function negbin_cdf_scalar(k, r, p) { return wasmExports().negbin_cdf_scalar(k, r, p); }
export function negbin_inv_scalar(pr, r, p) { return wasmExports().negbin_inv_scalar(pr, r, p); }
export function negbin_pmf_inplace(ip, l, r, p, op) { wasmExports().negbin_pmf_inplace(ip, l, r, p, op); }
export function negbin_cdf_inplace(ip, l, r, p, op) { wasmExports().negbin_cdf_inplace(ip, l, r, p, op); }

