import {
  f64View,
  f32View,
  copyToWasmMemory,
  copyToWasmMemoryF32,
  readWasmArray,
  loadWasmModule,
  createRequireWasm,
} from './shared.js';
import type {
  TestResult,
  RegressionResult,
  RegressionCoeffs,
  RegressionCoeffsF32,
  TestsWasmModule,
  AnovaResult,
  ChiSquareResult,
  TukeyHsdResult,
  TukeyPairResult,
} from './wasm-types.js';

let wasmModule: TestsWasmModule | null = null;

/**
 * Get the current WASM module instance.
 */
export function getTestsWasm(): TestsWasmModule | null {
  return wasmModule;
}

/**
 * Set the WASM module instance.
 */
export function setTestsWasm(mod: TestsWasmModule): void {
  wasmModule = mod;
}

const requireWasm = createRequireWasm(() => wasmModule);

/**
 * Initialize the tests wasm module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-tests', options.inline);
  wasmModule = mod as unknown as TestsWasmModule;
}

/**
 * Perform a one-sample t-test.
 */
export function ttest(data: ArrayLike<number>, mu0: number): TestResult {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: undefined };
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.ttest_f64(ptr, len, mu0);
  wasm.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df ?? undefined,
  };
}

/**
 * Perform a one-sample Z-test.
 */
export function ztest(data: ArrayLike<number>, mu0: number, sigma: number): TestResult {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: undefined };
  }
  const ptr = wasm.alloc_f64(len);
  const view = f64View(ptr, len, wasm.get_memory());
  copyToWasmMemory(data, view);
  const result = wasm.ztest_f64(ptr, len, mu0, sigma);
  wasm.free_f64(ptr, len);
  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df ?? undefined,
  };
}

/**
 * Calculate a confidence interval for a normal distribution.
 */
export function normalci(alpha: number, mean: number, se: number): number[] {
  const wasm = requireWasm();
  const res = wasm.normalci_f64(alpha, mean, se);
  return [res[0], res[1]];
}

/**
 * Calculate a confidence interval for a Student's t-distribution.
 */
export function tci(alpha: number, mean: number, stdev: number, n: number): number[] {
  const wasm = requireWasm();
  const res = wasm.tci_f64(alpha, mean, stdev, n);
  return [res[0], res[1]];
}

/**
 * Perform simple linear regression.
 */
export function regress(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  const wasm = requireWasm();
  const len = x.length;
  if (len === 0) {
    return { slope: NaN, intercept: NaN, r_squared: NaN, residuals: new Float64Array() };
  }
  if (len !== y.length) {
    throw new Error('x and y must have the same length');
  }

  const xPtr = wasm.alloc_f64(len);
  const yPtr = wasm.alloc_f64(len);
  const xView = f64View(xPtr, len, wasm.get_memory());
  const yView = f64View(yPtr, len, wasm.get_memory());

  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasm.regress_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasm.get_memory());

  wasm.free_f64(xPtr, len);
  wasm.free_f64(yPtr, len);

  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

/**
 * Perform regression using the naive implementation.
 */
export function regressNaive(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  const wasm = requireWasm();
  const len = x.length;
  if (len === 0) {
    return { slope: NaN, intercept: NaN, r_squared: NaN, residuals: new Float64Array() };
  }
  if (len !== y.length) {
    throw new Error('x and y must have the same length');
  }
  const xPtr = wasm.alloc_f64(len);
  const yPtr = wasm.alloc_f64(len);
  copyToWasmMemory(x, f64View(xPtr, len, wasm.get_memory()));
  copyToWasmMemory(y, f64View(yPtr, len, wasm.get_memory()));
  const result = wasm.regress_naive_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasm.get_memory());
  wasm.free_f64(xPtr, len);
  wasm.free_f64(yPtr, len);
  return { ...result, residuals };
}

/**
 * Perform regression using the SIMD implementation.
 */
export function regressSimd(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  const wasm = requireWasm();
  const len = x.length;
  if (len === 0) {
    return { slope: NaN, intercept: NaN, r_squared: NaN, residuals: new Float64Array() };
  }
  if (len !== y.length) {
    throw new Error('x and y must have the same length');
  }
  const xPtr = wasm.alloc_f64(len);
  const yPtr = wasm.alloc_f64(len);
  copyToWasmMemory(x, f64View(xPtr, len, wasm.get_memory()));
  copyToWasmMemory(y, f64View(yPtr, len, wasm.get_memory()));
  const result = wasm.regress_simd_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasm.get_memory());
  wasm.free_f64(xPtr, len);
  wasm.free_f64(yPtr, len);
  return { ...result, residuals };
}

/**
 * Perform regression using WASM kernels.
 */
export function regressWasmKernels(x: ArrayLike<number>, y: ArrayLike<number>): RegressionResult {
  const wasm = requireWasm();
  const len = x.length;
  if (len === 0) {
    return { slope: NaN, intercept: NaN, r_squared: NaN, residuals: new Float64Array() };
  }
  if (len !== y.length) {
    throw new Error('x and y must have the same length');
  }
  const xPtr = wasm.alloc_f64(len);
  const yPtr = wasm.alloc_f64(len);
  copyToWasmMemory(x, f64View(xPtr, len, wasm.get_memory()));
  copyToWasmMemory(y, f64View(yPtr, len, wasm.get_memory()));
  const result = wasm.regress_wasm_kernels_f64(xPtr, len, yPtr, len);
  const residuals = readWasmArray(result.residuals, wasm.get_memory());
  wasm.free_f64(xPtr, len);
  wasm.free_f64(yPtr, len);
  return { ...result, residuals };
}

/**
 * A reusable workspace for regression to avoid repeated allocations.
 */
export class RegressionWorkspace {
  private wasm: TestsWasmModule;
  private xPtr: number = 0;
  private yPtr: number = 0;
  private capacity: number = 0;

  constructor() {
    this.wasm = requireWasm();
  }

  /**
   * Ensure the workspace has enough capacity for the given size.
   */
  private ensureCapacity(size: number): void {
    if (size > this.capacity) {
      if (this.capacity > 0) {
        this.wasm.free_f64(this.xPtr, this.capacity);
        this.wasm.free_f64(this.yPtr, this.capacity);
      }
      this.xPtr = this.wasm.alloc_f64(size);
      this.yPtr = this.wasm.alloc_f64(size);
      this.capacity = size;
    }
  }

  /**
   * Perform regression using the workspace.
   */
  regress(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffs {
    const len = x.length;
    if (len === 0 || len !== y.length) {
      return { slope: NaN, intercept: NaN, r_squared: NaN };
    }

    this.ensureCapacity(len);

    const xView = f64View(this.xPtr, len, this.wasm.get_memory());
    const yView = f64View(this.yPtr, len, this.wasm.get_memory());

    copyToWasmMemory(x, xView);
    copyToWasmMemory(y, yView);

    return this.wasm.regress_coeffs_f64(this.xPtr, len, this.yPtr, len);
  }

  /**
   * Perform regression using 32-bit floats.
   */
  regressF32(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffsF32 {
    const len = x.length;
    if (len === 0 || len !== y.length) {
      return { slope: NaN, intercept: NaN, r_squared: NaN };
    }

    this.ensureCapacity(len); // Note: we use f64 capacity for simplicity

    const xView = f32View(this.xPtr, len, this.wasm.get_memory());
    const yView = f32View(this.yPtr, len, this.wasm.get_memory());

    copyToWasmMemoryF32(x, xView);
    copyToWasmMemoryF32(y, yView);

    return this.wasm.regress_coeffs_f32(this.xPtr, len, this.yPtr, len);
  }

  /**
   * Release WASM memory.
   */
  dispose(): void {
    if (this.capacity > 0) {
      this.wasm.free_f64(this.xPtr, this.capacity);
      this.wasm.free_f64(this.yPtr, this.capacity);
      this.capacity = 0;
    }
  }
}

/**
 * Perform one-way ANOVA and return the F-score.
 */
export function anovaFScore(groups: ArrayLike<number>[]): number {
  const wasm = requireWasm();
  const numGroups = groups.length;
  if (numGroups < 2) return NaN;

  let totalLen = 0;
  for (const g of groups) {
    if (g.length === 0) return NaN;
    totalLen += g.length;
  }

  const dPtr = wasm.alloc_f64(totalLen);
  const lPtr = wasm.alloc_f64(numGroups);
  const dView = f64View(dPtr, totalLen, wasm.get_memory());
  const lView = f64View(lPtr, numGroups, wasm.get_memory());

  let offset = 0;
  for (let i = 0; i < numGroups; i++) {
    const g = groups[i];
    copyToWasmMemory(g, dView.subarray(offset, offset + g.length));
    lView[i] = g.length;
    offset += g.length;
  }

  const result = wasm.anova_f_score_flat(dPtr, lPtr, numGroups);
  wasm.free_f64(dPtr, totalLen);
  wasm.free_f64(lPtr, numGroups);
  return result;
}

/**
 * Perform one-way ANOVA and return full results.
 */
export function anovaTest(groups: ArrayLike<number>[]): AnovaResult {
  const wasm = requireWasm();
  const numGroups = groups.length;
  if (numGroups < 2) return { fScore: NaN, dfBetween: 0, dfWithin: 0 };

  let totalLen = 0;
  for (const g of groups) {
    if (g.length === 0) return { fScore: NaN, dfBetween: 0, dfWithin: 0 };
    totalLen += g.length;
  }

  const dPtr = wasm.alloc_f64(totalLen);
  const lPtr = wasm.alloc_f64(numGroups);
  const outPtr = wasm.alloc_f64(3);
  const dView = f64View(dPtr, totalLen, wasm.get_memory());
  const lView = f64View(lPtr, numGroups, wasm.get_memory());

  let offset = 0;
  for (let i = 0; i < numGroups; i++) {
    const g = groups[i];
    copyToWasmMemory(g, dView.subarray(offset, offset + g.length));
    lView[i] = g.length;
    offset += g.length;
  }

  const result = wasm.anova_flat(dPtr, lPtr, numGroups, outPtr);
  wasm.free_f64(dPtr, totalLen);
  wasm.free_f64(lPtr, numGroups);
  wasm.free_f64(outPtr, 3);
  
  // result from wasm might have snake_case, map to camelCase
  return {
    fScore: (result as any).f_score ?? (result as any).fScore,
    dfBetween: (result as any).df_between ?? (result as any).dfBetween,
    dfWithin: (result as any).df_within ?? (result as any).dfWithin
  };
}

/**
 * Map categorical strings to integers.
 */
function mapCategorical(cat: string[]): { ints: Int32Array; cardinality: number } {
  const map = new Map<string, number>();
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

/**
 * Perform Chi-Square test of independence.
 */
export function chiSquareTest(
  cat1: string[],
  cat2: string[],
  options: { cardinality1?: number; cardinality2?: number } = {}
): ChiSquareResult {
  const wasm = requireWasm();
  if (cat1.length !== cat2.length) {
    throw new Error('cat1 and cat2 must have the same length');
  }

  const { ints: i1, cardinality: c1 } = mapCategorical(cat1);
  const { ints: i2, cardinality: c2 } = mapCategorical(cat2);
  const card1 = options.cardinality1 ?? c1;
  const card2 = options.cardinality2 ?? c2;
  const len = cat1.length;

  const p1 = wasm.alloc_i32(len);
  const p2 = wasm.alloc_i32(len);
  const outPtr = wasm.alloc_f64(3);

  new Int32Array(wasm.get_memory().buffer, p1, len).set(i1);
  new Int32Array(wasm.get_memory().buffer, p2, len).set(i2);

  const result = wasm.chi_square_test(p1, p2, len, card1, card2, outPtr);
  const view = new Float64Array(wasm.get_memory().buffer, outPtr, 3);
  const res = { statistic: view[0], pValue: view[1], df: view[2] };

  wasm.free_i32(p1, len);
  wasm.free_i32(p2, len);
  wasm.free_f64(outPtr, 3);
  return res;
}

/**
 * Perform ANOVA with categorical labels.
 */
export function anovaFScoreCategorical(groups: string[], values: number[]): number {
  const wasm = requireWasm();
  const { ints } = mapCategorical(groups);
  const len = groups.length;
  const pg = wasm.alloc_i32(len);
  const pv = wasm.alloc_f64(len);

  new Int32Array(wasm.get_memory().buffer, pg, len).set(ints);
  new Float64Array(wasm.get_memory().buffer, pv, len).set(values);

  const res = wasm.anova_f_score_categorical(pg, pv, len);
  wasm.free_i32(pg, len);
  wasm.free_f64(pv, len);
  return res;
}

/**
 * Perform full ANOVA test with categorical labels.
 */
export function anovaTestCategorical(groups: string[], values: number[]): AnovaResult {
  const wasm = requireWasm();
  const { ints } = mapCategorical(groups);
  const len = groups.length;
  const pg = wasm.alloc_i32(len);
  const pv = wasm.alloc_f64(len);
  const outPtr = wasm.alloc_f64(3);

  new Int32Array(wasm.get_memory().buffer, pg, len).set(ints);
  new Float64Array(wasm.get_memory().buffer, pv, len).set(values);

  const result = wasm.anova_categorical(pg, pv, len, outPtr);
  wasm.free_i32(pg, len);
  wasm.free_f64(pv, len);
  wasm.free_f64(outPtr, 3);
  
  return {
    fScore: (result as any).f_score ?? (result as any).fScore,
    dfBetween: (result as any).df_between ?? (result as any).dfBetween,
    dfWithin: (result as any).df_within ?? (result as any).dfWithin
  };
}

/**
 * Perform Tukey HSD test with categorical labels.
 */
export function tukeyHsdCategorical(groups: string[], values: number[]): TukeyHsdResult {
  const wasm = requireWasm();
  const { ints } = mapCategorical(groups);
  const len = groups.length;
  const pg = wasm.alloc_i32(len);
  const pv = wasm.alloc_f64(len);
  const outPtr = wasm.alloc_f64(1024); // Sufficient buffer for Tukey results

  new Int32Array(wasm.get_memory().buffer, pg, len).set(ints);
  new Float64Array(wasm.get_memory().buffer, pv, len).set(values);

  const written = wasm.tukey_hsd_categorical(pg, pv, len, outPtr);
  const view = new Float64Array(wasm.get_memory().buffer, outPtr, 3 + Number(written) * 7);
  
  const comparisons: TukeyPairResult[] = [];
  for (let i = 0; i < Number(written); i++) {
    const base = 3 + i * 7;
    comparisons.push({
      group1: view[base],
      group2: view[base + 1],
      mean_diff: view[base + 2],
      q_statistic: view[base + 3],
      p_value: view[base + 4],
      ci_lower: view[base + 5],
      ci_upper: view[base + 6]
    });
  }

  const res = {
    num_groups: view[0],
    df_within: view[1],
    msw: view[2],
    comparisons
  };

  wasm.free_i32(pg, len);
  wasm.free_f64(pv, len);
  wasm.free_f64(outPtr, 1024);
  return res;
}
