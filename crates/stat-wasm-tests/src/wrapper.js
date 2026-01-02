import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() { return wasmExports().memory; }
export function alloc_f64(len) { return alloc(len * 8); }
export function free_f64(ptr, len) { free(ptr, len * 8); }
export function alloc_f32(len) { return alloc(len * 4); }
export function free_f32(ptr, len) { free(ptr, len * 4); }
export function alloc_i32(len) { return alloc(len * 4); }
export function free_i32(ptr, len) { free(ptr, len * 4); }

// Tests
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

// ANOVA & Chi-Square
export function anova_f_score_flat(dp, lp, ng) { return wasmExports().anova_f_score_flat(dp, lp, ng); }
export function anova_flat(dp, lp, ng, outPtr) {
  wasmExports().anova_flat(dp, lp, ng, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  return { f_score: view[0], df_between: Number(view[1]), df_within: Number(view[2]) };
}
export function chi_square_test(p1, p2, len, card1, card2, outPtr) {
  wasmExports().chi_square_test(p1, p2, len, card1, card2, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  return { statistic: view[0], p_value: view[1], df: view[2] };
}
export function anova_f_score_categorical(gp, pv, len) { return wasmExports().anova_f_score_categorical(gp, pv, len); }
export function anova_categorical(gp, pv, len, outPtr) {
  wasmExports().anova_categorical(gp, pv, len, outPtr);
  const view = new Float64Array(wasmExports().memory.buffer, outPtr, 3);
  return { f_score: view[0], df_between: view[1], df_within: view[2] };
}
export function tukey_hsd_categorical(gp, pv, len, outPtr) {
  return wasmExports().tukey_hsd_categorical(gp, pv, len, outPtr);
}

