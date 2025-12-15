import { simd } from 'wasm-feature-detect';

interface ArrayResult {
  ptr: number;
  len: number;
}

interface HistogramWithEdgesResult {
  edges: ArrayResult;
  counts: ArrayResult;
}

/**
 * Full descriptive statistics snapshot for a numeric array.
 *
 * Returned by {@link descriptiveStats}.
 */
export interface DescriptiveStatsResult {
  /** Number of observations (N) */
  count: number;
  /** Sum of all values */
  sum: number;
  /** Arithmetic mean */
  mean: number;
  /** Population variance */
  variance: number;
  /** Sample variance (Bessel's correction) */
  sampleVariance: number;
  /** Population standard deviation */
  stdev: number;
  /** Sample standard deviation */
  sampleStdev: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Range (max - min) */
  range: number;
  /** Median (50th percentile) */
  median: number;
  /** First quartile (25th percentile) */
  q1: number;
  /** Second quartile (50th percentile, same as median) */
  q2: number;
  /** Third quartile (75th percentile) */
  q3: number;
  /** Interquartile range (Q3 - Q1) */
  iqr: number;
  /** Coefficient of variation (stdev / mean) */
  coeffvar: number;
  /** Mean absolute deviation from the mean */
  meandev: number;
  /** Median absolute deviation from the median */
  meddev: number;
  /** Skewness (third standardized moment) */
  skewness: number;
  /** Excess kurtosis (fourth standardized moment minus 3) */
  kurtosis: number;
  /** Standard error of the mean (sampleStdev / sqrt(N)) */
  standardError: number;
}

// Type definitions for wasm module
interface WasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  alloc_f32(len: number): number;
  free_f32(ptr: number, len: number): void;
  sum_f64(ptr: number, len: number): number;
  mean_f64(ptr: number, len: number): number;
  variance_f64(ptr: number, len: number): number;
  sample_variance_f64(ptr: number, len: number): number;
  stdev_f64(ptr: number, len: number): number;
  sample_stdev_f64(ptr: number, len: number): number;
  min_f64(ptr: number, len: number): number;
  max_f64(ptr: number, len: number): number;
  product_f64(ptr: number, len: number): number;
  range_f64(ptr: number, len: number): number;
  median_f64(ptr: number, len: number): number;
  mode_f64(ptr: number, len: number): number;
  geomean_f64(ptr: number, len: number): number;
  skewness_f64(ptr: number, len: number): number;
  kurtosis_f64(ptr: number, len: number): number;
  sum_f64_direct(ptr: number, len: number): number;
  mean_f64_direct(ptr: number, len: number): number;
  variance_f64_direct(ptr: number, len: number): number;
  sample_variance_f64_direct(ptr: number, len: number): number;
  stdev_f64_direct(ptr: number, len: number): number;
  sample_stdev_f64_direct(ptr: number, len: number): number;
  cumsum_f64(ptr: number, len: number): ArrayResult;
  cumprod_f64(ptr: number, len: number): ArrayResult;
  diff_f64(ptr: number, len: number): ArrayResult;
  rank_f64(ptr: number, len: number): ArrayResult;
  coeffvar_f64(ptr: number, len: number): number;
  deviation_f64(ptr: number, len: number): ArrayResult;
  meandev_f64(ptr: number, len: number): number;
  meddev_f64(ptr: number, len: number): number;
  pooledvariance_f64(
    data1Ptr: number,
    data1Len: number,
    data2Ptr: number,
    data2Len: number
  ): number;
  pooledstdev_f64(
    data1Ptr: number,
    data1Len: number,
    data2Ptr: number,
    data2Len: number
  ): number;
  stan_moment_f64(ptr: number, len: number, k: number): number;
  percentile_f64(ptr: number, len: number, k: number, exclusive: boolean): number;
  percentile_of_score_f64(ptr: number, len: number, score: number, strict: boolean): number;
  qscore_f64(ptr: number, len: number, score: number, strict: boolean): number;
  qtest_f64(ptr: number, len: number, score: number, qLower: number, qUpper: number): boolean;
  percentile_inclusive_f64(ptr: number, len: number, k: number): number;
  percentile_exclusive_f64(ptr: number, len: number, k: number): number;
  quartiles_f64(ptr: number, len: number): { q1: number; q2: number; q3: number };
  iqr_f64(ptr: number, len: number): number;
  quantiles_f64(
    dataPtr: number,
    dataLen: number,
    qsPtr: number,
    qsLen: number
  ): ArrayResult;
  weighted_percentile_f64(
    dataPtr: number,
    dataLen: number,
    weightsPtr: number,
    weightsLen: number,
    p: number
  ): number;
  weighted_quantiles_f64(
    dataPtr: number,
    dataLen: number,
    weightsPtr: number,
    weightsLen: number,
    qsPtr: number,
    qsLen: number
  ): ArrayResult;
  weighted_median_f64(
    dataPtr: number,
    dataLen: number,
    weightsPtr: number,
    weightsLen: number
  ): number;
  histogram_f64(ptr: number, len: number, binCount: number): ArrayResult;
  histogram_edges_f64(
    dataPtr: number,
    dataLen: number,
    edgesPtr: number,
    edgesLen: number
  ): ArrayResult;
  histogram_fixed_width_with_edges_f64(
    ptr: number,
    len: number,
    bins: number
  ): HistogramWithEdgesResult;
  histogram_equal_frequency_with_edges_f64(
    ptr: number,
    len: number,
    bins: number
  ): HistogramWithEdgesResult;
  histogram_auto_with_edges_f64(
    ptr: number,
    len: number,
    rule: number,
    binsOverride: number
  ): HistogramWithEdgesResult;
  histogram_auto_with_edges_collapse_tails_f64(
    ptr: number,
    len: number,
    rule: number,
    binsOverride: number,
    k: number
  ): HistogramWithEdgesResult;
  histogram_custom_with_edges_f64(
    dataPtr: number,
    dataLen: number,
    edgesPtr: number,
    edgesLen: number,
    clampOutside: boolean
  ): HistogramWithEdgesResult;
  covariance_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number
  ): number;
  corrcoeff_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number
  ): number;
  spearmancoeff_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number
  ): number;
  anova_f_score_flat(
    dataPtr: number,
    lensPtr: number,
    numGroups: number
  ): number;
  anova_flat(
    dataPtr: number,
    lensPtr: number,
    numGroups: number
  ): { f_score: number; df_between: number; df_within: number };
  chi_square_test(
    cat1: string[],
    cat2: string[]
  ): { statistic: number; p_value: number; df: number };
  chi_square_test_with_cardinality(
    cat1: string[],
    cat2: string[],
    cardinality1: number | null,
    cardinality2: number | null
  ): { statistic: number; p_value: number; df: number };
  anova_f_score_categorical(
    groups: string[],
    values: number[]
  ): number;
  anova_categorical(
    groups: string[],
    values: number[]
  ): { f_score: number; df_between: number; df_within: number };
  normal_pdf_scalar(x: number, mean: number, sd: number): number;
  normal_cdf_scalar(x: number, mean: number, sd: number): number;
  normal_inv_scalar(p: number, mean: number, sd: number): number;
  normal_pdf_inplace(
    inputPtr: number,
    len: number,
    mean: number,
    sd: number,
    outputPtr: number
  ): void;
  normal_cdf_inplace(
    inputPtr: number,
    len: number,
    mean: number,
    sd: number,
    outputPtr: number
  ): void;
  gamma_pdf_scalar(x: number, shape: number, rate: number): number;
  gamma_cdf_scalar(x: number, shape: number, rate: number): number;
  gamma_inv_scalar(p: number, shape: number, rate: number): number;
  gamma_pdf_inplace(
    inputPtr: number,
    len: number,
    shape: number,
    rate: number,
    outputPtr: number
  ): void;
  gamma_cdf_inplace(
    inputPtr: number,
    len: number,
    shape: number,
    rate: number,
    outputPtr: number
  ): void;
  beta_pdf_scalar(x: number, alpha: number, beta: number): number;
  beta_cdf_scalar(x: number, alpha: number, beta: number): number;
  beta_inv_scalar(p: number, alpha: number, beta: number): number;
  beta_pdf_inplace(
    inputPtr: number,
    len: number,
    alpha: number,
    beta: number,
    outputPtr: number
  ): void;
  beta_cdf_inplace(
    inputPtr: number,
    len: number,
    alpha: number,
    beta: number,
    outputPtr: number
  ): void;
  student_t_pdf_scalar(
    x: number,
    mean: number,
    scale: number,
    dof: number
  ): number;
  student_t_cdf_scalar(
    x: number,
    mean: number,
    scale: number,
    dof: number
  ): number;
  student_t_inv_scalar(
    p: number,
    mean: number,
    scale: number,
    dof: number
  ): number;
  student_t_pdf_inplace(
    inputPtr: number,
    len: number,
    mean: number,
    scale: number,
    dof: number,
    outputPtr: number
  ): void;
  student_t_cdf_inplace(
    inputPtr: number,
    len: number,
    mean: number,
    scale: number,
    dof: number,
    outputPtr: number
  ): void;
  chi_squared_pdf_scalar(x: number, dof: number): number;
  chi_squared_cdf_scalar(x: number, dof: number): number;
  chi_squared_inv_scalar(p: number, dof: number): number;
  chi_squared_pdf_inplace(
    inputPtr: number,
    len: number,
    dof: number,
    outputPtr: number
  ): void;
  chi_squared_cdf_inplace(
    inputPtr: number,
    len: number,
    dof: number,
    outputPtr: number
  ): void;
  fisher_f_pdf_scalar(x: number, df1: number, df2: number): number;
  fisher_f_cdf_scalar(x: number, df1: number, df2: number): number;
  fisher_f_inv_scalar(p: number, df1: number, df2: number): number;
  fisher_f_pdf_inplace(
    inputPtr: number,
    len: number,
    df1: number,
    df2: number,
    outputPtr: number
  ): void;
  fisher_f_cdf_inplace(
    inputPtr: number,
    len: number,
    df1: number,
    df2: number,
    outputPtr: number
  ): void;
  exponential_pdf_scalar(x: number, rate: number): number;
  exponential_cdf_scalar(x: number, rate: number): number;
  exponential_inv_scalar(p: number, rate: number): number;
  exponential_pdf_inplace(
    inputPtr: number,
    len: number,
    rate: number,
    outputPtr: number
  ): void;
  exponential_cdf_inplace(
    inputPtr: number,
    len: number,
    rate: number,
    outputPtr: number
  ): void;
  poisson_pmf_scalar(k: number, lambda: number): number;
  poisson_cdf_scalar(k: number, lambda: number): number;
  poisson_inv_scalar(p: number, lambda: number): number;
  poisson_pmf_inplace(
    inputPtr: number,
    len: number,
    lambda: number,
    outputPtr: number
  ): void;
  poisson_cdf_inplace(
    inputPtr: number,
    len: number,
    lambda: number,
    outputPtr: number
  ): void;
  binomial_pmf_scalar(k: number, n: number, p: number): number;
  binomial_cdf_scalar(k: number, n: number, p: number): number;
  binomial_inv_scalar(prob: number, n: number, p: number): number; // prob is probability, p is success probability
  binomial_pmf_inplace(
    inputPtr: number,
    len: number,
    n: number,
    p: number,
    outputPtr: number
  ): void;
  binomial_cdf_inplace(
    inputPtr: number,
    len: number,
    n: number,
    p: number,
    outputPtr: number
  ): void;
  uniform_pdf_scalar(x: number, min: number, max: number): number;
  uniform_cdf_scalar(x: number, min: number, max: number): number;
  uniform_inv_scalar(p: number, min: number, max: number): number;
  uniform_pdf_inplace(inputPtr: number, len: number, min: number, max: number, outputPtr: number): void;
  uniform_cdf_inplace(inputPtr: number, len: number, min: number, max: number, outputPtr: number): void;
  cauchy_pdf_scalar(x: number, location: number, scale: number): number;
  cauchy_cdf_scalar(x: number, location: number, scale: number): number;
  cauchy_inv_scalar(p: number, location: number, scale: number): number;
  cauchy_pdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  cauchy_cdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  laplace_pdf_scalar(x: number, location: number, scale: number): number;
  laplace_cdf_scalar(x: number, location: number, scale: number): number;
  laplace_inv_scalar(p: number, location: number, scale: number): number;
  laplace_pdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  laplace_cdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  lognormal_pdf_scalar(x: number, mean: number, sd: number): number;
  lognormal_cdf_scalar(x: number, mean: number, sd: number): number;
  lognormal_inv_scalar(p: number, mean: number, sd: number): number;
  lognormal_pdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  lognormal_cdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  weibull_pdf_scalar(x: number, shape: number, scale: number): number;
  weibull_cdf_scalar(x: number, shape: number, scale: number): number;
  weibull_inv_scalar(p: number, shape: number, scale: number): number;
  weibull_pdf_inplace(inputPtr: number, len: number, shape: number, scale: number, outputPtr: number): void;
  weibull_cdf_inplace(inputPtr: number, len: number, shape: number, scale: number, outputPtr: number): void;
  pareto_pdf_scalar(x: number, scale: number, shape: number): number;
  pareto_cdf_scalar(x: number, scale: number, shape: number): number;
  pareto_inv_scalar(p: number, scale: number, shape: number): number;
  pareto_pdf_inplace(inputPtr: number, len: number, scale: number, shape: number, outputPtr: number): void;
  pareto_cdf_inplace(inputPtr: number, len: number, scale: number, shape: number, outputPtr: number): void;
  triangular_pdf_scalar(x: number, min: number, max: number, mode: number): number;
  triangular_cdf_scalar(x: number, min: number, max: number, mode: number): number;
  triangular_inv_scalar(p: number, min: number, max: number, mode: number): number;
  triangular_pdf_inplace(inputPtr: number, len: number, min: number, max: number, mode: number, outputPtr: number): void;
  triangular_cdf_inplace(inputPtr: number, len: number, min: number, max: number, mode: number, outputPtr: number): void;
  invgamma_pdf_scalar(x: number, shape: number, rate: number): number;
  invgamma_cdf_scalar(x: number, shape: number, rate: number): number;
  invgamma_inv_scalar(p: number, shape: number, rate: number): number;
  invgamma_pdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  invgamma_cdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  negbin_pmf_scalar(k: number, r: number, p: number): number;
  negbin_cdf_scalar(k: number, r: number, p: number): number;
  negbin_inv_scalar(prob: number, r: number, p: number): number;
  negbin_pmf_inplace(inputPtr: number, len: number, r: number, p: number, outputPtr: number): void;
  negbin_cdf_inplace(inputPtr: number, len: number, r: number, p: number, outputPtr: number): void;
  // Statistical Tests
  ttest_f64(dataPtr: number, len: number, mu0: number): TestResult;
  ztest_f64(dataPtr: number, len: number, mu0: number, sigma: number): TestResult;
  regress_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): WasmRegressionResult;
  regress_naive_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): WasmRegressionResult;
  regress_simd_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): WasmRegressionResult;
  regress_wasm_kernels_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): WasmRegressionResult;
  regress_coeffs_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): RegressionCoeffs;
  regress_naive_coeffs_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): RegressionCoeffs;
  regress_simd_coeffs_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): RegressionCoeffs;
  regress_wasm_kernels_coeffs_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): RegressionCoeffs;
  regress_naive_residuals_inplace_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number,
    residualsOutPtr: number
  ): RegressionCoeffs;
  regress_simd_residuals_inplace_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number,
    residualsOutPtr: number
  ): RegressionCoeffs;
  regress_wasm_kernels_residuals_inplace_f64(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number,
    residualsOutPtr: number
  ): RegressionCoeffs;
  // f32 regression (SIMD-focused)
  regress_simd_coeffs_f32(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number
  ): { slope: number; intercept: number; r_squared: number };
  regress_simd_residuals_inplace_f32(
    xPtr: number,
    xLen: number,
    yPtr: number,
    yLen: number,
    residualsOutPtr: number
  ): { slope: number; intercept: number; r_squared: number };
  // Confidence Intervals
  normalci_f64(alpha: number, mean: number, se: number): Float64Array;
  tci_f64(alpha: number, mean: number, stdev: number, n: number): Float64Array;
}

export interface TestResult {
  statistic: number;
  p_value: number;
  df: number | null;
}

interface WasmRegressionResult {
  slope: number;
  intercept: number;
  r_squared: number;
  residuals: ArrayResult;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  r_squared: number;
  residuals: Float64Array;
}

export interface RegressionCoeffs {
  slope: number;
  intercept: number;
  r_squared: number;
}

export interface RegressionCoeffsF32 {
  slope: number;
  intercept: number;
  r_squared: number;
}

let wasmModule: WasmModule | null = null;

function requireWasm(): WasmModule {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }
  return wasmModule;
}

/**
 * Initialize the wasm module (SIMD-aware).
 * 
 * This function must be called once before using any statistics functions.
 * It's safe to call multiple times - it will only initialize once.
 * 
 * @example
 * ```js
 * import { init, mean } from '@stats/core';
 * 
 * await init();
 * const result = mean([1, 2, 3]);
 * ```
 */
export async function init(): Promise<void> {
  if (wasmModule) {
    return;
  }

  const supportsSimd = await simd();
  
  // For now, use the same build for both SIMD and non-SIMD
  // TODO: Load SIMD build when available
  // @ts-ignore - WASM module path resolved at runtime
  // Path is relative to dist/index.js location
  const mod = await import('../pkg/stat-wasm/stat_wasm.js');
  wasmModule = mod as unknown as WasmModule;
}

/**
 * Helper to create a view into wasm memory
 */
function f64View(ptr: number, len: number): Float64Array {
  const wasm = requireWasm();
  const memory = wasm.get_memory();
  return new Float64Array(memory.buffer, ptr, len);
}

function f32View(ptr: number, len: number): Float32Array {
  const wasm = requireWasm();
  const memory = wasm.get_memory();
  return new Float32Array(memory.buffer, ptr, len);
}

/**
 * Helper to efficiently copy data to WASM memory
 */
function copyToWasmMemory(data: ArrayLike<number>, view: Float64Array): void {
  if (data instanceof Float64Array) {
    view.set(data);
  } else if (data instanceof Array) {
    view.set(data as number[]);
  } else {
    // Fallback for ArrayLike - use efficient copy if possible
    const len = data.length;
    if (len > 0 && typeof (data as any)[0] === 'number') {
      // Try to use set if it's array-like with numeric indices
      try {
        view.set(data as any);
      } catch {
        // Fallback to manual copy
        for (let i = 0; i < len; i++) {
          view[i] = data[i];
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        view[i] = data[i];
      }
    }
  }
}

function copyToWasmMemoryF32(data: ArrayLike<number>, view: Float32Array): void {
  if (data instanceof Float32Array) {
    view.set(data);
  } else if (data instanceof Array) {
    // Converts numbers to f32 on assignment
    view.set(data as number[]);
  } else {
    const len = data.length;
    try {
      view.set(data as any);
    } catch {
      for (let i = 0; i < len; i++) {
        view[i] = data[i] as number;
      }
    }
  }
}

/**
 * Helper to copy data out of WASM memory and free the buffer
 */
function readWasmArray(result: ArrayResult): Float64Array {
  const wasm = requireWasm();
  const view = f64View(result.ptr, result.len);
  const copy = new Float64Array(result.len);
  copy.set(view);
  wasm.free_f64(result.ptr, result.len);
  return copy;
}

type ArrayKernel = (inputPtr: number, len: number, outputPtr: number) => void;

export interface DistributionHandle {
  pdf(x: number): number;
  cdf(x: number): number;
  inv(p: number): number;
  pdfArray(data: ArrayLike<number>): Float64Array;
  cdfArray(data: ArrayLike<number>): Float64Array;
}

interface DistributionBindings {
  pdfScalar: (x: number) => number;
  cdfScalar: (x: number) => number;
  invScalar: (p: number) => number;
  pdfKernel: ArrayKernel;
  cdfKernel: ArrayKernel;
}

function runUnaryArrayOp(
  data: ArrayLike<number>,
  kernel: ArrayKernel
): Float64Array {
  const wasm = requireWasm();
  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }

  const inputPtr = wasm.alloc_f64(len);
  const outputPtr = wasm.alloc_f64(len);
  const inputView = f64View(inputPtr, len);
  const outputView = f64View(outputPtr, len);
  copyToWasmMemory(data, inputView);
  kernel(inputPtr, len, outputPtr);

  const copy = new Float64Array(len);
  copy.set(outputView);
  wasm.free_f64(inputPtr, len);
  wasm.free_f64(outputPtr, len);
  return copy;
}

function buildDistribution(bindings: DistributionBindings): DistributionHandle {
  return {
    pdf: bindings.pdfScalar,
    cdf: bindings.cdfScalar,
    inv: bindings.invScalar,
    pdfArray(data: ArrayLike<number>) {
      return runUnaryArrayOp(data, bindings.pdfKernel);
    },
    cdfArray(data: ArrayLike<number>) {
      return runUnaryArrayOp(data, bindings.cdfKernel);
    },
  };
}
 
/**
 * Calculate the sum of an array.
 * 
 * @param data - Array of numbers to sum
 * @returns The sum of all elements
 * 
 * @example
 * ```js
 * import { init, sum } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const total = sum(data); // 15
 * ```
 */
export function sum(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return 0;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.sum_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.sum_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the arithmetic mean (average) of an array.
 * 
 * @param data - Array of numbers
 * @returns The mean value, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, mean } from '@stats/core';
 * await init();
 * 
 * const scores = [85, 90, 78, 92, 88];
 * const average = mean(scores); // 86.6
 * ```
 */
export function mean(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.mean_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.mean_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the population variance of an array.
 * Uses the formula: Σ(x - μ)² / N
 * 
 * @param data - Array of numbers
 * @returns The population variance, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, variance } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const popVar = variance(data); // 2
 * ```
 */
export function variance(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.variance_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.variance_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the sample variance of an array (Bessel's correction).
 * Uses the formula: Σ(x - x̄)² / (N - 1)
 * 
 * @param data - Array of numbers (must have at least 2 elements)
 * @returns The sample variance, or NaN if array has less than 2 elements
 * 
 * @example
 * ```js
 * import { init, sampleVariance } from '@stats/core';
 * await init();
 * 
 * const sample = [1, 2, 3, 4, 5];
 * const sampVar = sampleVariance(sample); // 2.5
 * ```
 */
export function sampleVariance(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len < 2) {
    return NaN;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.sample_variance_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.sample_variance_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the standard deviation (population) of an array.
 * 
 * Standard deviation measures how spread out your data is. A low standard deviation 
 * means values are close to the mean, while a high standard deviation means values 
 * are more spread out.
 * 
 * **When to use:** Use this when you have data for the entire population (not a sample).
 * For sample data, use `sampleStdev` instead.
 * 
 * @param data - Array of numbers
 * @returns The population standard deviation, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, stdev } from '@stats/core';
 * await init();
 * 
 * // Test scores for entire class (population)
 * const scores = [85, 90, 78, 92, 88];
 * const spread = stdev(scores); // ~4.47
 * // Lower spread = more consistent scores
 * ```
 */
export function stdev(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.stdev_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.stdev_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the sample standard deviation of an array.
 * 
 * This is the standard deviation adjusted for sample data (uses N-1 instead of N).
 * Use this when you have a sample from a larger population and want to estimate 
 * the population's standard deviation.
 * 
 * **When to use:** Use this for sample data (most common case). Use `stdev` only 
 * when you have data for the entire population.
 * 
 * @param data - Array of numbers (must have at least 2 elements)
 * @returns The sample standard deviation, or NaN if array has less than 2 elements
 * 
 * @example
 * ```js
 * import { init, sampleStdev } from '@stats/core';
 * await init();
 * 
 * // Sample of 10 people's heights
 * const heights = [65, 68, 70, 72, 74, 66, 69, 71, 73, 67];
 * const spread = sampleStdev(heights); // ~3.16 inches
 * ```
 */
export function sampleStdev(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len < 2) {
    return NaN;
  }

  // Optimize for Float64Array - use direct memory access
  if (data instanceof Float64Array && data.buffer === wasmModule.get_memory().buffer) {
    const ptr = data.byteOffset / 8; // f64 is 8 bytes
    return wasmModule.sample_stdev_f64_direct(ptr, len);
  }

  // For other array types, copy to WASM memory efficiently
  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);
  
  const result = wasmModule.sample_stdev_f64_direct(ptr, len);
  wasmModule.free_f64(ptr, len);
  
  return result;
}

/**
 * Calculate the coefficient of variation (CV).
 * 
 * The coefficient of variation is the ratio of standard deviation to the mean.
 * It's useful for comparing variability across datasets with different scales.
 * A higher CV means more relative variability.
 * 
 * **When to use:** Compare variability between datasets with different units or scales.
 * For example, comparing height variability (inches) vs weight variability (pounds).
 * 
 * @param data - Array of numbers
 * @returns The coefficient of variation (stdev / mean), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, coeffvar } from '@stats/core';
 * await init();
 * 
 * // Compare variability of two different measurements
 * const heights = [65, 68, 70, 72, 74]; // inches
 * const weights = [120, 140, 160, 180, 200]; // pounds
 * 
 * const heightCV = coeffvar(heights); // ~0.05 (5% variability)
 * const weightCV = coeffvar(weights); // ~0.24 (24% variability)
 * // Weights are more variable relative to their mean
 * ```
 */
export function coeffvar(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.coeffvar_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate deviations from mean (x - mean) for each element.
 * 
 * Returns an array where each element is the deviation from the mean.
 * Useful for understanding how each value differs from the average.
 * 
 * @param data - Array of numbers
 * @returns Array of deviations from mean, or empty array if input is empty
 * 
 * @example
 * ```js
 * import { init, deviation } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const devs = deviation(data);
 * // devs = [-2, -1, 0, 1, 2] (mean is 3)
 * ```
 */
export function deviation(data: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return new Float64Array(0);
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.deviation_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

/**
 * Calculate mean deviation (mean absolute deviation from mean).
 * 
 * Mean deviation measures the average distance of data points from the mean.
 * It's similar to standard deviation but uses absolute values instead of squares.
 * 
 * @param data - Array of numbers
 * @returns The mean deviation, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, meandev } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const md = meandev(data); // ~1.2
 * ```
 */
export function meandev(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.meandev_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate median deviation (mean absolute deviation from median).
 * 
 * Median deviation measures the average distance of data points from the median.
 * More robust to outliers than mean deviation.
 * 
 * @param data - Array of numbers
 * @returns The median deviation, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, meddev } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const md = meddev(data); // ~1.2
 * ```
 */
export function meddev(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.meddev_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate pooled variance for two groups.
 * 
 * Pooled variance combines the variance estimates from two groups,
 * weighted by their degrees of freedom. Used in two-sample t-tests.
 * 
 * Formula: ((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2)
 * 
 * @param data1 - First group of numbers (must have at least 2 elements)
 * @param data2 - Second group of numbers (must have at least 2 elements)
 * @returns The pooled variance, or NaN if either group has fewer than 2 elements
 * 
 * @example
 * ```js
 * import { init, pooledvariance } from '@stats/core';
 * await init();
 * 
 * const group1 = [1, 2, 3, 4, 5];
 * const group2 = [6, 7, 8, 9, 10];
 * const pooledVar = pooledvariance(group1, group2);
 * ```
 */
export function pooledvariance(
  data1: ArrayLike<number>,
  data2: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len1 = data1.length;
  const len2 = data2.length;
  if (len1 < 2 || len2 < 2) {
    return NaN;
  }

  const ptr1 = wasmModule.alloc_f64(len1);
  const view1 = f64View(ptr1, len1);
  copyToWasmMemory(data1, view1);

  const ptr2 = wasmModule.alloc_f64(len2);
  const view2 = f64View(ptr2, len2);
  copyToWasmMemory(data2, view2);

  const result = wasmModule.pooledvariance_f64(ptr1, len1, ptr2, len2);
  wasmModule.free_f64(ptr1, len1);
  wasmModule.free_f64(ptr2, len2);

  return result;
}

/**
 * Calculate pooled standard deviation for two groups.
 * 
 * This is the square root of pooled variance. Used in two-sample t-tests.
 * 
 * @param data1 - First group of numbers (must have at least 2 elements)
 * @param data2 - Second group of numbers (must have at least 2 elements)
 * @returns The pooled standard deviation, or NaN if either group has fewer than 2 elements
 * 
 * @example
 * ```js
 * import { init, pooledstdev } from '@stats/core';
 * await init();
 * 
 * const group1 = [1, 2, 3, 4, 5];
 * const group2 = [6, 7, 8, 9, 10];
 * const pooledStd = pooledstdev(group1, group2);
 * ```
 */
export function pooledstdev(
  data1: ArrayLike<number>,
  data2: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len1 = data1.length;
  const len2 = data2.length;
  if (len1 < 2 || len2 < 2) {
    return NaN;
  }

  const ptr1 = wasmModule.alloc_f64(len1);
  const view1 = f64View(ptr1, len1);
  copyToWasmMemory(data1, view1);

  const ptr2 = wasmModule.alloc_f64(len2);
  const view2 = f64View(ptr2, len2);
  copyToWasmMemory(data2, view2);

  const result = wasmModule.pooledstdev_f64(ptr1, len1, ptr2, len2);
  wasmModule.free_f64(ptr1, len1);
  wasmModule.free_f64(ptr2, len2);

  return result;
}

/**
 * Calculate the k-th standardized moment.
 * 
 * Standardized moments are normalized by the standard deviation raised to the k-th power.
 * - k=1: always 0
 * - k=2: always 1
 * - k=3: skewness
 * - k=4: kurtosis
 * 
 * @param data - Array of numbers
 * @param k - Moment order (positive integer)
 * @returns The standardized moment, or NaN if data is empty or stdev is zero
 * 
 * @example
 * ```js
 * import { init, stanMoment } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * const skew = stanMoment(data, 3); // Skewness
 * const kurt = stanMoment(data, 4); // Kurtosis
 * ```
 */
export function stanMoment(data: ArrayLike<number>, k: number): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0 || k < 1 || !Number.isInteger(k)) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.stan_moment_f64(ptr, len, k);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the median (middle value) of an array.
 * 
 * The median is the value that separates the higher half from the lower half.
 * Unlike the mean, it's not affected by extreme outliers, making it useful for 
 * skewed data.
 * 
 * **When to use:** Use median instead of mean when your data has outliers or 
 * is heavily skewed. For example, income data often uses median because a few 
 * very high incomes would skew the mean.
 * 
 * @param data - Array of numbers
 * @returns The median value, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, median, mean } from '@stats/core';
 * await init();
 * 
 * // Data with an outlier
 * const salaries = [40000, 45000, 50000, 55000, 200000];
 * 
 * console.log(mean(salaries));  // 78000 (skewed by outlier)
 * console.log(median(salaries)); // 50000 (better representation)
 * ```
 */
export function median(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.median_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the mode (most frequent value) of an array.
 * 
 * The mode is the value that appears most often in your data. Unlike mean and median,
 * mode can be used with categorical data too.
 * 
 * **When to use:** Find the most common value in your dataset. Useful for finding 
 * the most popular choice, most common score, or most frequent measurement.
 * 
 * @param data - Array of numbers
 * @returns The mode (most frequent value), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, mode } from '@stats/core';
 * await init();
 * 
 * // Most common test score
 * const scores = [85, 90, 85, 78, 85, 92];
 * const mostCommon = mode(scores); // 85
 * 
 * // Most common shoe size
 * const shoeSizes = [8, 9, 9, 10, 9, 8, 11];
 * const popularSize = mode(shoeSizes); // 9
 * ```
 */
export function mode(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.mode_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the geometric mean of an array.
 * 
 * The geometric mean is the nth root of the product of n values. It's useful for 
 * rates of change, ratios, and percentages. All values must be positive.
 * 
 * **When to use:** Use for growth rates, investment returns, or any multiplicative 
 * data. For example, calculating average growth rate over multiple periods.
 * 
 * @param data - Array of positive numbers
 * @returns The geometric mean, or NaN if array is empty or contains non-positive values
 * 
 * @example
 * ```js
 * import { init, geomean } from '@stats/core';
 * await init();
 * 
 * // Average annual growth rate over 3 years
 * const growthRates = [1.05, 1.10, 1.08]; // 5%, 10%, 8% growth
 * const avgGrowth = geomean(growthRates); // ~1.076 (7.6% average)
 * 
 * // Compare with arithmetic mean (incorrect for growth rates)
 * // Arithmetic mean would give 1.077, but geometric mean is correct
 * ```
 */
export function geomean(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.geomean_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the skewness (asymmetry) of an array.
 * 
 * Skewness measures how asymmetrical your data distribution is:
 * - **Zero**: Symmetrical distribution (like a bell curve)
 * - **Positive**: Right-skewed (tail extends to the right, mean > median)
 * - **Negative**: Left-skewed (tail extends to the left, mean < median)
 * 
 * **When to use:** Understand the shape of your data distribution. Helps decide 
 * whether to use mean or median as your measure of center.
 * 
 * @param data - Array of numbers (must have at least 3 elements)
 * @returns The skewness value, or NaN if array has less than 3 elements
 * 
 * @example
 * ```js
 * import { init, skewness } from '@stats/core';
 * await init();
 * 
 * // Right-skewed data (most values low, few very high)
 * const incomes = [30000, 35000, 40000, 45000, 50000, 200000];
 * const skew = skewness(incomes); // Positive value (right-skewed)
 * 
 * // Symmetrical data
 * const symmetric = [1, 2, 3, 4, 5];
 * const skew2 = skewness(symmetric); // Close to 0
 * ```
 */
export function skewness(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len < 3) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.skewness_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the kurtosis (tail heaviness) of an array.
 * 
 * Kurtosis measures how heavy the tails of your distribution are compared to a 
 * normal distribution:
 * - **Zero**: Normal distribution (mesokurtic)
 * - **Positive**: Heavy tails, more outliers (leptokurtic)
 * - **Negative**: Light tails, fewer outliers (platykurtic)
 * 
 * **When to use:** Understand the tail behavior of your data. High kurtosis means 
 * more extreme values than expected in a normal distribution.
 * 
 * @param data - Array of numbers (must have at least 4 elements)
 * @returns The kurtosis value, or NaN if array has less than 4 elements
 * 
 * @example
 * ```js
 * import { init, kurtosis } from '@stats/core';
 * await init();
 * 
 * // Data with many extreme values
 * const data = [1, 2, 3, 4, 5, 100, 200];
 * const kurt = kurtosis(data); // Positive (heavy tails)
 * 
 * // Uniform distribution (light tails)
 * const uniform = [1, 2, 3, 4, 5];
 * const kurt2 = kurtosis(uniform); // Negative (light tails)
 * ```
 */
export function kurtosis(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len < 4) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.kurtosis_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Find the minimum (smallest) value in an array.
 * 
 * Returns the smallest number in your dataset. Useful for finding the lowest 
 * score, minimum temperature, smallest measurement, etc.
 * 
 * @param data - Array of numbers
 * @returns The minimum value, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, min } from '@stats/core';
 * await init();
 * 
 * const temperatures = [72, 68, 75, 80, 65];
 * const coldest = min(temperatures); // 65
 * 
 * const scores = [85, 90, 78, 92, 88];
 * const lowestScore = min(scores); // 78
 * ```
 */
export function min(data: ArrayLike<number>): number {
  const len = data.length;
  if (len === 0) return NaN;
  
  let low = data[0];
  for (let i = 1; i < len; i++) {
    if (data[i] < low) low = data[i];
  }
  return low;
}

/**
 * Find the maximum (largest) value in an array.
 * 
 * Returns the largest number in your dataset. Useful for finding the highest 
 * score, maximum temperature, largest measurement, etc.
 * 
 * @param data - Array of numbers
 * @returns The maximum value, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, max } from '@stats/core';
 * await init();
 * 
 * const temperatures = [72, 68, 75, 80, 65];
 * const hottest = max(temperatures); // 80
 * 
 * const scores = [85, 90, 78, 92, 88];
 * const highestScore = max(scores); // 92
 * ```
 */
export function max(data: ArrayLike<number>): number {
  const len = data.length;
  if (len === 0) return NaN;
  
  let high = data[0];
  for (let i = 1; i < len; i++) {
    if (data[i] > high) high = data[i];
  }
  return high;
}

/**
 * Calculate the product (multiplication) of all values in an array.
 * 
 * Multiplies all numbers together. Useful for calculating compound growth, 
 * probabilities of independent events, or any multiplicative operation.
 * 
 * @param data - Array of numbers
 * @returns The product of all values, or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, product } from '@stats/core';
 * await init();
 * 
 * // Compound growth over 3 years
 * const multipliers = [1.05, 1.10, 1.08];
 * const totalGrowth = product(multipliers); // 1.2474 (24.74% total)
 * 
 * // Probability of independent events
 * const probabilities = [0.5, 0.6, 0.7];
 * const combinedProb = product(probabilities); // 0.21
 * ```
 */
export function product(data: ArrayLike<number>): number {
  const len = data.length;
  if (len === 0) return NaN;
  
  let prod = 1;
  for (let i = 0; i < len; i++) {
    prod *= data[i];
  }
  return prod;
}

/**
 * Calculate the range (difference between max and min) of an array.
 * 
 * The range shows the spread of your data - how much variation exists between 
 * the smallest and largest values. Simple but useful for understanding data spread.
 * 
 * **Note:** Range is sensitive to outliers. A single extreme value can make 
 * the range very large.
 * 
 * @param data - Array of numbers
 * @returns The range (max - min), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, range } from '@stats/core';
 * await init();
 * 
 * const temperatures = [72, 68, 75, 80, 65];
 * const tempRange = range(temperatures); // 15 (80 - 65)
 * 
 * const scores = [85, 90, 78, 92, 88];
 * const scoreRange = range(scores); // 14 (92 - 78)
 * ```
 */
export function range(data: ArrayLike<number>): number {
  const len = data.length;
  if (len === 0) return NaN;
  
  let low = data[0];
  let high = data[0];
  for (let i = 1; i < len; i++) {
    const v = data[i];
    if (v < low) low = v;
    if (v > high) high = v;
  }
  return high - low;
}

/**
 * Calculate the cumulative sum of an array.
 * 
 * Returns an array where each element is the sum of all previous elements plus 
 * the current element. Useful for tracking running totals, cumulative growth, 
 * or accumulated values over time.
 * 
 * @param data - Array of numbers
 * @returns Array of cumulative sums
 * 
 * @example
 * ```js
 * import { init, cumsum } from '@stats/core';
 * await init();
 * 
 * // Daily sales
 * const dailySales = [100, 150, 120, 200, 180];
 * const cumulative = cumsum(dailySales);
 * // Result: [100, 250, 370, 570, 750]
 * // Day 1: 100, Day 2: 250 (100+150), Day 3: 370 (100+150+120), etc.
 * 
 * // Running total of scores
 * const scores = [10, 20, 15, 25];
 * const runningTotal = cumsum(scores); // [10, 30, 45, 70]
 * ```
 */
export function cumsum(data: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.cumsum_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

/**
 * Calculate the cumulative product of an array.
 * 
 * Returns an array where each element is the product of all previous elements 
 * multiplied by the current element. Useful for tracking compound growth over time.
 * 
 * @param data - Array of numbers
 * @returns Array of cumulative products
 * 
 * @example
 * ```js
 * import { init, cumprod } from '@stats/core';
 * await init();
 * 
 * // Monthly growth multipliers
 * const growth = [1.02, 1.03, 1.01, 1.04];
 * const cumulative = cumprod(growth);
 * // Result: [1.02, 1.0506, 1.0611, 1.1035]
 * // Shows cumulative growth: 2%, then 5.06%, then 6.11%, then 10.35%
 * ```
 */
export function cumprod(data: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.cumprod_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

/**
 * Calculate differences between consecutive elements.
 * 
 * Returns an array where each element is the difference between the current 
 * and previous value. Useful for finding changes, growth rates, or deltas over time.
 * 
 * @param data - Array of numbers (must have at least 2 elements)
 * @returns Array of differences (length will be data.length - 1)
 * 
 * @example
 * ```js
 * import { init, diff } from '@stats/core';
 * await init();
 * 
 * // Daily temperature changes
 * const temps = [72, 75, 73, 78, 80];
 * const changes = diff(temps); // [3, -2, 5, 2]
 * // Day 1→2: +3°, Day 2→3: -2°, Day 3→4: +5°, Day 4→5: +2°
 * 
 * // Month-over-month sales growth
 * const sales = [1000, 1200, 1100, 1500];
 * const growth = diff(sales); // [200, -100, 400]
 * ```
 */
export function diff(data: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len < 2) {
    return new Float64Array();
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.diff_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

/**
 * Cumulative reduction: apply a reduction function cumulatively.
 * 
 * Similar to cumsum/cumprod but with a custom reducer function. Applies the reducer
 * function to each element along with the accumulated value from previous elements.
 * 
 * **When to use:** When you need cumulative operations beyond sum/product, such as
 * cumulative maximum, cumulative minimum, or custom cumulative calculations.
 * 
 * @param data - Input array
 * @param init - Initial value for the accumulator
 * @param reducer - Function that takes (accumulator, value) and returns new accumulator
 * @returns Array of cumulative results (same length as input)
 * 
 * @example
 * ```js
 * import { init, cumreduce } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5];
 * 
 * // Cumulative sum of squares
 * const cumSqSum = cumreduce(data, 0, (acc, x) => acc + x * x);
 * // [1, 5, 14, 30, 55]
 * 
 * // Cumulative maximum
 * const cumMax = cumreduce(data, -Infinity, (acc, x) => Math.max(acc, x));
 * // [1, 2, 3, 4, 5]
 * 
 * // Cumulative product with offset
 * const cumProd = cumreduce(data, 1, (acc, x) => acc * x);
 * // [1, 2, 6, 24, 120]
 * ```
 */
export function cumreduce(
  data: ArrayLike<number>,
  init: number,
  reducer: (acc: number, val: number) => number
): Float64Array {
  const len = data.length;
  const result = new Float64Array(len);
  let acc = init;

  for (let i = 0; i < len; i++) {
    acc = reducer(acc, data[i]);
    result[i] = acc;
  }

  return result;
}

/**
 * Calculate the ranks of array values.
 * 
 * Assigns ranks to each value, where 1 is the smallest and N is the largest.
 * Tied values receive the average of their ranks. Useful for non-parametric 
 * statistics and converting values to ranks.
 * 
 * @param data - Array of numbers
 * @returns Array of ranks (same length as input)
 * 
 * @example
 * ```js
 * import { init, rank } from '@stats/core';
 * await init();
 * 
 * // Rank test scores
 * const scores = [85, 90, 78, 92, 85];
 * const ranks = rank(scores); // [2.5, 4, 1, 5, 2.5]
 * // 78 gets rank 1 (lowest), 85s get rank 2.5 (average of 2 and 3), etc.
 * 
 * // Rank by performance
 * const performance = [10, 20, 15, 25];
 * const performanceRanks = rank(performance); // [1, 3, 2, 4]
 * ```
 */
export function rank(data: ArrayLike<number>): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.rank_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

// =============================================================================
// Quantiles & Percentiles
// =============================================================================

/**
 * Calculate a percentile value.
 * 
 * Finds the value below which a given percentage of observations fall.
 * For example, the 90th percentile is the value below which 90% of the data lies.
 * 
 * **Common percentiles:**
 * - 0.5 (50th percentile) = median
 * - 0.25 (25th percentile) = first quartile (Q1)
 * - 0.75 (75th percentile) = third quartile (Q3)
 * - 0.95 (95th percentile) = value below which 95% of data falls
 * 
 * @param data - Input array
 * @param k - Percentile value between 0.0 and 1.0 (e.g., 0.5 for median, 0.9 for 90th percentile)
 * @param exclusive - If true, uses exclusive method (R6); if false, uses inclusive method (R7, default)
 * @returns The percentile value, or NaN if k is out of range or array is empty
 * 
 * @example
 * ```js
 * import { init, percentile } from '@stats/core';
 * await init();
 * 
 * // Test scores
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * 
 * const p50 = percentile(scores, 0.5);  // 86.5 (median)
 * const p90 = percentile(scores, 0.9);  // ~95 (90th percentile)
 * const p25 = percentile(scores, 0.25);  // ~77 (25th percentile)
 * ```
 */
export function percentile(
  data: ArrayLike<number>,
  k: number,
  exclusive: boolean = false
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0 || k < 0 || k > 1) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.percentile_f64(ptr, len, k, exclusive);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate the percentile rank of a score (inverse of percentile).
 * 
 * Finds what percentile a given value falls into. For example, if a score 
 * is at the 75th percentile, it means 75% of values are below it.
 * 
 * **When to use:** Determine where a specific value ranks relative to your dataset.
 * Useful for comparing individual scores to the overall distribution.
 * 
 * @param data - Input array
 * @param score - Value to find percentile rank for
 * @param strict - If true, use strict comparison (< instead of <=). Default: false
 * @returns Percentile rank (0.0 to 1.0), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, percentileOfScore } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * 
 * // What percentile is score 85?
 * const rank = percentileOfScore(scores, 85); // ~0.4 (40th percentile)
 * 
 * // What percentile is score 90?
 * const rank90 = percentileOfScore(scores, 90); // ~0.7 (70th percentile)
 * ```
 */
export function percentileOfScore(
  data: ArrayLike<number>,
  score: number,
  strict: boolean = false
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.percentile_of_score_f64(ptr, len, score, strict);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate quantile score (same as percentileOfScore).
 * 
 * Finds what quantile a given value falls into. This is an alias for
 * percentileOfScore for consistency with naming conventions.
 * 
 * @param data - Input array
 * @param score - Value to find quantile rank for
 * @param strict - If true, use strict comparison (< instead of <=). Default: false
 * @returns Quantile score (0.0 to 1.0), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, qscore } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * const quantile = qscore(scores, 85); // ~0.4 (40th quantile)
 * ```
 */
export function qscore(
  data: ArrayLike<number>,
  score: number,
  strict: boolean = false
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.qscore_f64(ptr, len, score, strict);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Quantile test: test if a value falls within a given quantile range.
 * 
 * Returns true if the score falls within the specified quantile range [qLower, qUpper].
 * Useful for filtering or categorizing values based on their quantile position.
 * 
 * @param data - Input array
 * @param score - Value to test
 * @param qLower - Lower quantile bound (0.0 to 1.0)
 * @param qUpper - Upper quantile bound (0.0 to 1.0)
 * @returns True if score falls within the quantile range, false otherwise
 * 
 * @example
 * ```js
 * import { init, qtest } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * 
 * // Check if score 85 is in the middle 50% (25th to 75th percentile)
 * const inMiddle = qtest(scores, 85, 0.25, 0.75); // true
 * 
 * // Check if score 95 is in the top 10%
 * const inTop10 = qtest(scores, 95, 0.9, 1.0); // true
 * ```
 */
export function qtest(
  data: ArrayLike<number>,
  score: number,
  qLower: number,
  qUpper: number
): boolean {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0 || qLower < 0 || qUpper > 1 || qLower > qUpper) {
    return false;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.qtest_f64(ptr, len, score, qLower, qUpper);
  wasmModule.free_f64(ptr, len);

  return result;
}

/**
 * Calculate multiple percentiles at once.
 *
 * This is a convenience wrapper around `quantiles` that accepts an array of
 * percentile values and returns the corresponding values in the data.
 *
 * **Note:** Percentiles are expressed as quantiles between 0.0 and 1.0,
 * matching jStat’s behavior. For example, `[0.1, 0.5, 0.9]` corresponds to
 * the 10th, 50th, and 90th percentiles.
 *
 * @param data - Input array
 * @param ps - Array of percentile values between 0.0 and 1.0
 * @returns Array of percentile values in the same order as `ps`
 */
export function percentiles(
  data: ArrayLike<number>,
  ps: ArrayLike<number>
): Float64Array {
  return quantiles(data, ps);
}

/**
 * Calculate multiple quantiles at once.
 * 
 * More efficient than calling `percentile` multiple times. Calculates several 
 * percentiles in a single operation, which is faster when you need multiple values.
 * 
 * **When to use:** When you need multiple percentiles (e.g., deciles, quartiles) 
 * from the same dataset.
 * 
 * @param data - Input array
 * @param qs - Array of quantile values between 0.0 and 1.0 (e.g., [0.1, 0.5, 0.9] for 10th, 50th, 90th percentiles)
 * @returns Array of quantile values in the same order as qs
 * 
 * @example
 * ```js
 * import { init, quantiles } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * 
 * // Calculate deciles (10th, 20th, ..., 90th percentiles)
 * const deciles = quantiles(scores, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
 * // Returns array with 9 values
 * ```
 */
export function quantiles(
  data: ArrayLike<number>,
  qs: ArrayLike<number>
): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  const qsLen = qs.length;
  if (dataLen === 0 || qsLen === 0) {
    return new Float64Array(qsLen).fill(NaN);
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const qsPtr = wasmModule.alloc_f64(qsLen);
  const dataView = f64View(dataPtr, dataLen);
  const qsView = f64View(qsPtr, qsLen);
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(qs, qsView);

  const result = wasmModule.quantiles_f64(dataPtr, dataLen, qsPtr, qsLen);
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(qsPtr, qsLen);

  return readWasmArray(result);
}

/**
 * Calculate the quartiles (Q1, Q2/median, Q3) of an array.
 * 
 * Quartiles divide your data into four equal parts:
 * - **Q1 (25th percentile)**: 25% of values are below this
 * - **Q2 (50th percentile)**: The median - 50% of values are below this
 * - **Q3 (75th percentile)**: 75% of values are below this
 * 
 * **When to use:** Understand data distribution, create box plots, or identify outliers.
 * 
 * @param data - Input array
 * @returns Array [q1, q2, q3] matching jStat behavior
 * 
 * @example
 * ```js
 * import { init, quartiles } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * const [q1, q2, q3] = quartiles(scores);
 * // q1 ≈ 77, q2 ≈ 86.5 (median), q3 ≈ 92
 * ```
 */
export function quartiles(data: ArrayLike<number>): [number, number, number] {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return [NaN, NaN, NaN];
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.quartiles_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return [result.q1, result.q2, result.q3];
}

/**
 * Calculate the interquartile range (IQR).
 * 
 * IQR is the range of the middle 50% of your data (Q3 - Q1). It's a robust 
 * measure of spread that's not affected by outliers, unlike the regular range.
 * 
 * **When to use:** Measure spread when you have outliers, or identify outliers 
 * (values outside Q1 - 1.5×IQR or Q3 + 1.5×IQR are typically considered outliers).
 * 
 * @param data - Input array
 * @returns The interquartile range (Q3 - Q1), or NaN if array is empty
 * 
 * @example
 * ```js
 * import { init, iqr } from '@stats/core';
 * await init();
 * 
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * const spread = iqr(scores); // ~15 (92 - 77)
 * 
 * // Identify outliers: values outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]
 * ```
 */
export function iqr(data: ArrayLike<number>): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return NaN;
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.iqr_f64(ptr, len);
  wasmModule.free_f64(ptr, len);

  return result;
}

// =============================================================================
// Weighted Quantiles
// =============================================================================

/**
 * Calculate a weighted percentile using linear interpolation.
 * 
 * Uses the cumulative weight method: sorts data by value, computes cumulative
 * weights, normalizes to [0, 1], and interpolates to find the value at the
 * desired quantile position.
 * 
 * **When to use:** When observations have different importance or frequency weights,
 * such as survey data with sampling weights, or aggregated data where each value
 * represents multiple observations.
 * 
 * @param data - Input array of values
 * @param weights - Array of weights (must be same length as data, all non-negative)
 * @param p - Percentile value between 0.0 and 1.0 (e.g., 0.5 for weighted median)
 * @returns The interpolated weighted percentile value, or NaN for invalid inputs
 * 
 * @example
 * ```js
 * import { init, weightedPercentile } from '@addmaple/stats';
 * await init();
 * 
 * const values = [1, 2, 3, 4, 5];
 * const weights = [1, 1, 1, 1, 5];  // Value 5 has 5x more weight
 * 
 * // Weighted median - will be pulled toward 5 due to its higher weight
 * const median = weightedPercentile(values, weights, 0.5);
 * console.log(median); // ~4.5
 * 
 * // Compare with equal weights (regular percentile behavior)
 * const equalWeights = [1, 1, 1, 1, 1];
 * const regularMedian = weightedPercentile(values, equalWeights, 0.5);
 * console.log(regularMedian); // 3
 * ```
 */
export function weightedPercentile(
  data: ArrayLike<number>,
  weights: ArrayLike<number>,
  p: number
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  const weightsLen = weights.length;

  if (dataLen === 0 || weightsLen === 0 || dataLen !== weightsLen) {
    return NaN;
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const weightsPtr = wasmModule.alloc_f64(weightsLen);
  const dataView = f64View(dataPtr, dataLen);
  const weightsView = f64View(weightsPtr, weightsLen);
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(weights, weightsView);

  const result = wasmModule.weighted_percentile_f64(dataPtr, dataLen, weightsPtr, weightsLen, p);
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(weightsPtr, weightsLen);

  return result;
}

/**
 * Calculate multiple weighted quantiles at once.
 * 
 * More efficient than calling `weightedPercentile` multiple times when you need
 * several weighted quantiles from the same dataset.
 * 
 * @param data - Input array of values
 * @param weights - Array of weights (must be same length as data, all non-negative)
 * @param qs - Array of quantile values between 0.0 and 1.0
 * @returns Array of weighted quantile values in the same order as qs
 * 
 * @example
 * ```js
 * import { init, weightedQuantiles } from '@addmaple/stats';
 * await init();
 * 
 * const income = [20000, 40000, 60000, 80000, 100000];
 * const population = [1000, 800, 500, 300, 100];  // More people earn less
 * 
 * // Calculate weighted quartiles
 * const [q1, median, q3] = weightedQuantiles(income, population, [0.25, 0.5, 0.75]);
 * // Results will be weighted toward lower incomes
 * ```
 */
export function weightedQuantiles(
  data: ArrayLike<number>,
  weights: ArrayLike<number>,
  qs: ArrayLike<number>
): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  const weightsLen = weights.length;
  const qsLen = qs.length;

  if (dataLen === 0 || weightsLen === 0 || qsLen === 0 || dataLen !== weightsLen) {
    return new Float64Array(qsLen).fill(NaN);
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const weightsPtr = wasmModule.alloc_f64(weightsLen);
  const qsPtr = wasmModule.alloc_f64(qsLen);
  const dataView = f64View(dataPtr, dataLen);
  const weightsView = f64View(weightsPtr, weightsLen);
  const qsView = f64View(qsPtr, qsLen);
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(weights, weightsView);
  copyToWasmMemory(qs, qsView);

  const result = wasmModule.weighted_quantiles_f64(
    dataPtr, dataLen,
    weightsPtr, weightsLen,
    qsPtr, qsLen
  );
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(weightsPtr, weightsLen);
  wasmModule.free_f64(qsPtr, qsLen);

  return readWasmArray(result);
}

/**
 * Calculate the weighted median (50th weighted percentile).
 * 
 * The weighted median is the value that divides the total weight in half.
 * This is a convenience function equivalent to `weightedPercentile(data, weights, 0.5)`.
 * 
 * @param data - Input array of values
 * @param weights - Array of weights (must be same length as data)
 * @returns The weighted median value
 * 
 * @example
 * ```js
 * import { init, weightedMedian } from '@addmaple/stats';
 * await init();
 * 
 * // Survey data: respondent ages with sampling weights
 * const ages = [25, 35, 45, 55, 65];
 * const sampleWeights = [100, 150, 200, 120, 80];
 * 
 * const medianAge = weightedMedian(ages, sampleWeights);
 * console.log(medianAge); // Weighted toward middle ages due to higher weights
 * ```
 */
export function weightedMedian(
  data: ArrayLike<number>,
  weights: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  const weightsLen = weights.length;

  if (dataLen === 0 || weightsLen === 0 || dataLen !== weightsLen) {
    return NaN;
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const weightsPtr = wasmModule.alloc_f64(weightsLen);
  const dataView = f64View(dataPtr, dataLen);
  const weightsView = f64View(weightsPtr, weightsLen);
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(weights, weightsView);

  const result = wasmModule.weighted_median_f64(dataPtr, dataLen, weightsPtr, weightsLen);
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(weightsPtr, weightsLen);

  return result;
}

/**
 * Calculate a rich set of descriptive statistics for an array in one call.
 *
 * This helper wraps core vector statistics (mean, variance, quartiles, skewness, etc.)
 * and returns them in a single object, so you don't need to call each function
 * individually.
 *
 * @param data - Input array of numbers
 * @returns An object with common descriptive statistics
 *
 * @example
 * ```js
 * import { init, descriptiveStats } from '@stats/core';
 * await init();
 *
 * const data = [1, 2, 3, 4, 5];
 * const stats = descriptiveStats(data);
 *
 * console.log(stats.mean);   // 3
 * console.log(stats.median); // 3
 * console.log(stats.min);    // 1
 * console.log(stats.max);    // 5
 * ```
 */
export function descriptiveStats(data: ArrayLike<number>): DescriptiveStatsResult {
  const count = data.length;

  if (count === 0) {
    const nan = NaN;
    return {
      count: 0,
      sum: 0,
      mean: nan,
      variance: nan,
      sampleVariance: nan,
      stdev: nan,
      sampleStdev: nan,
      min: nan,
      max: nan,
      range: nan,
      median: nan,
      q1: nan,
      q2: nan,
      q3: nan,
      iqr: nan,
      coeffvar: nan,
      meandev: nan,
      meddev: nan,
      skewness: nan,
      kurtosis: nan,
      standardError: nan,
    };
  }

  const sumVal = sum(data);
  const meanVal = mean(data);
  const varianceVal = variance(data);
  const sampleVarianceVal = sampleVariance(data);
  const stdevVal = stdev(data);
  const sampleStdevVal = sampleStdev(data);
  const minVal = min(data);
  const maxVal = max(data);
  const rangeVal = range(data);
  const [q1, q2, q3] = quartiles(data);
  const medianVal = q2;
  const iqrVal = iqr(data);
  const coeffvarVal = coeffvar(data);
  const meandevVal = meandev(data);
  const meddevVal = meddev(data);
  const skewVal = skewness(data);
  const kurtVal = kurtosis(data);
  const standardError =
    !Number.isNaN(sampleStdevVal) && count > 0 ? sampleStdevVal / Math.sqrt(count) : NaN;

  return {
    count,
    sum: sumVal,
    mean: meanVal,
    variance: varianceVal,
    sampleVariance: sampleVarianceVal,
    stdev: stdevVal,
    sampleStdev: sampleStdevVal,
    min: minVal,
    max: maxVal,
    range: rangeVal,
    median: medianVal,
    q1,
    q2,
    q3,
    iqr: iqrVal,
    coeffvar: coeffvarVal,
    meandev: meandevVal,
    meddev: meddevVal,
    skewness: skewVal,
    kurtosis: kurtVal,
    standardError,
  };
}

// =============================================================================
// Histogram
// =============================================================================

/**
 * Calculate a histogram with automatic bin width.
 * 
 * Groups your data into bins (ranges) and counts how many values fall into each bin.
 * Useful for visualizing data distribution and understanding the shape of your data.
 * 
 * **When to use:** Understand data distribution, create visualizations, or identify 
 * patterns in your data.
 * 
 * @param data - Input array
 * @param binCount - Number of bins to create (default: 4)
 * @returns Array of counts per bin (length equals binCount)
 * 
 * @example
 * ```js
 * import { init, histogram } from '@stats/core';
 * await init();
 * 
 * // Test scores
 * const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
 * const bins = histogram(scores, 5);
 * // Returns: [2, 2, 2, 2, 2] (counts for each of 5 bins)
 * ```
 */
export function histogram(
  data: ArrayLike<number>,
  binCount: number = 4
): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return new Float64Array(binCount).fill(0);
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.histogram_f64(ptr, len, binCount);
  wasmModule.free_f64(ptr, len);

  return readWasmArray(result);
}

/**
 * Calculate a histogram with custom bin edges.
 * 
 * Like `histogram`, but allows you to specify exact bin boundaries. Useful when 
 * you need specific ranges (e.g., age groups, income brackets).
 * 
 * @param data - Input array
 * @param edges - Bin edges (must be sorted, length = num_bins + 1). 
 *                Example: [0, 10, 20, 30] creates bins [0-10), [10-20), [20-30)
 * @returns Array of counts per bin (length equals edges.length - 1)
 * 
 * @example
 * ```js
 * import { init, histogramEdges } from '@stats/core';
 * await init();
 * 
 * const ages = [22, 25, 28, 32, 35, 38, 42, 45];
 * const ageGroups = histogramEdges(ages, [20, 30, 40, 50]);
 * // Returns counts for: [20-30), [30-40), [40-50)
 * ```
 */
export function histogramEdges(
  data: ArrayLike<number>,
  edges: ArrayLike<number>
): Float64Array {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  const edgesLen = edges.length;
  
  if (edgesLen < 2) {
    return new Float64Array(0);
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const edgesPtr = wasmModule.alloc_f64(edgesLen);
  const dataView = f64View(dataPtr, dataLen);
  const edgesView = f64View(edgesPtr, edgesLen);
  copyToWasmMemory(data, dataView);
  copyToWasmMemory(edges, edgesView);

  const result = wasmModule.histogram_edges_f64(dataPtr, dataLen, edgesPtr, edgesLen);
  wasmModule.free_f64(dataPtr, dataLen);
  wasmModule.free_f64(edgesPtr, edgesLen);

  return readWasmArray(result);
}

/**
 * Bin option configuration for advanced histogram binning strategies.
 */
export interface BinOption {
  /** Binning mode: "auto", "equalFrequency", "fixedWidth", "custom" */
  mode: 'auto' | 'equalFrequency' | 'fixedWidth' | 'custom';
  /** Statistical rule for auto mode: "FD" (Freedman-Diaconis), "Scott", "sqrtN" */
  rule?: 'FD' | 'Scott' | 'sqrtN';
  /** Tail collapse settings for auto mode */
  collapseTails?: {
    enabled: boolean;
    /** IQR multiplier for outlier detection (default: 1.5) */
    k?: number;
  };
  /** Number of bins for equalFrequency/fixedWidth modes, or override for auto mode */
  bins?: number;
  /** Custom bin edges for custom mode */
  edges?: number[] | Float64Array;
}

/**
 * Result of histogram binning with edges and counts.
 */
export interface HistogramBinningResult {
  /** Bin edges (length = counts.length + 1) */
  edges: Float64Array;
  /** Counts per bin (length = number of bins) */
  counts: Float64Array;
}

/**
 * Calculate histogram using advanced binning strategies.
 * 
 * Supports multiple binning modes:
 * - **auto**: Automatic binning using statistical rules (FD, Scott, sqrtN)
 * - **equalFrequency**: Quantile-based binning (each bin has roughly equal counts)
 * - **fixedWidth**: Fixed-width bins (linear spacing from min to max)
 * - **custom**: User-defined bin edges
 * 
 * @param data - Input array
 * @param binSettings - Number of bins (legacy) or BinOption object
 * @returns Object with `edges` and `counts` arrays
 * 
 * @example
 * ```js
 * import { init, histogramBinning } from '@stats/core';
 * await init();
 * 
 * const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
 * 
 * // Fixed-width binning
 * const result1 = histogramBinning(data, { mode: 'fixedWidth', bins: 5 });
 * 
 * // Auto binning with Freedman-Diaconis rule
 * const result2 = histogramBinning(data, { mode: 'auto', rule: 'FD' });
 * 
 * // Equal-frequency binning
 * const result3 = histogramBinning(data, { mode: 'equalFrequency', bins: 4 });
 * 
 * // Custom edges
 * const result4 = histogramBinning(data, { 
 *   mode: 'custom', 
 *   edges: [0, 3, 6, 10] 
 * });
 * 
 * // Legacy: number of bins (treats as auto mode)
 * const result5 = histogramBinning(data, 5);
 * ```
 */
export function histogramBinning(
  data: ArrayLike<number>,
  binSettings: number | BinOption
): HistogramBinningResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const dataLen = data.length;
  if (dataLen === 0) {
    return {
      edges: new Float64Array(0),
      counts: new Float64Array(0),
    };
  }

  // Handle legacy numeric input - route to auto mode
  let settings: BinOption;
  if (typeof binSettings === 'number') {
    settings = {
      mode: 'auto',
      rule: 'FD',
      bins: binSettings,
    };
  } else {
    settings = binSettings;
  }

  // Validate settings
  if (!['auto', 'equalFrequency', 'fixedWidth', 'custom'].includes(settings.mode)) {
    throw new Error(`Invalid binning mode: ${settings.mode}`);
  }

  if (settings.mode === 'equalFrequency' || settings.mode === 'fixedWidth') {
    if (!settings.bins || settings.bins <= 0) {
      throw new Error(`${settings.mode} mode requires bins > 0`);
    }
  }

  if (settings.mode === 'custom') {
    if (!settings.edges || settings.edges.length < 2) {
      throw new Error('custom mode requires edges array with at least 2 elements');
    }
  }

  const dataPtr = wasmModule.alloc_f64(dataLen);
  const dataView = f64View(dataPtr, dataLen);
  copyToWasmMemory(data, dataView);

  let result: HistogramWithEdgesResult;
  let edgesPtr: number | null = null;
  let edgesLen = 0;

  try {
    switch (settings.mode) {
      case 'fixedWidth': {
        result = wasmModule.histogram_fixed_width_with_edges_f64(
          dataPtr,
          dataLen,
          settings.bins!
        );
        break;
      }
      case 'equalFrequency': {
        result = wasmModule.histogram_equal_frequency_with_edges_f64(
          dataPtr,
          dataLen,
          settings.bins!
        );
        break;
      }
      case 'auto': {
        const rule = settings.rule || 'FD';
        const ruleCode = rule === 'FD' ? 0 : rule === 'Scott' ? 1 : 2;
        const binsOverride = settings.bins || 0;

        if (settings.collapseTails?.enabled) {
          const k = settings.collapseTails.k ?? 1.5;
          result = wasmModule.histogram_auto_with_edges_collapse_tails_f64(
            dataPtr,
            dataLen,
            ruleCode,
            binsOverride,
            k
          );
        } else {
          result = wasmModule.histogram_auto_with_edges_f64(
            dataPtr,
            dataLen,
            ruleCode,
            binsOverride
          );
        }
        break;
      }
      case 'custom': {
        const edges = settings.edges!;
        // Sort edges if not already sorted
        const sortedEdges = Array.from(edges).sort((a, b) => a - b);
        edgesLen = sortedEdges.length;
        edgesPtr = wasmModule.alloc_f64(edgesLen);
        const edgesView = f64View(edgesPtr, edgesLen);
        copyToWasmMemory(sortedEdges, edgesView);

        result = wasmModule.histogram_custom_with_edges_f64(
          dataPtr,
          dataLen,
          edgesPtr,
          edgesLen,
          false // Don't clamp by default for custom mode
        );
        break;
      }
    }

    const edgesResult = result.edges;
    const countsResult = result.counts;
    const edges = readWasmArray(edgesResult);
    const counts = readWasmArray(countsResult);

    return { edges, counts };
  } finally {
    wasmModule.free_f64(dataPtr, dataLen);
    if (edgesPtr !== null) {
      wasmModule.free_f64(edgesPtr, edgesLen);
    }
  }
}

/**
 * Utility functions to create common binning configurations.
 */
export const BinningPresets = {
  /**
   * Auto binning with Freedman-Diaconis rule
   */
  autoFD: (bins?: number): BinOption => ({
    mode: 'auto',
    rule: 'FD',
    bins,
  }),

  /**
   * Auto binning with Scott's rule
   */
  autoScott: (bins?: number): BinOption => ({
    mode: 'auto',
    rule: 'Scott',
    bins,
  }),

  /**
   * Auto binning with square root rule
   */
  autoSqrt: (bins?: number): BinOption => ({
    mode: 'auto',
    rule: 'sqrtN',
    bins,
  }),

  /**
   * Auto binning with tail collapse
   */
  autoWithTailCollapse: (k: number = 1.5, bins?: number): BinOption => ({
    mode: 'auto',
    rule: 'FD',
    bins,
    collapseTails: {
      enabled: true,
      k,
    },
  }),

  /**
   * Equal frequency (quantile) binning
   */
  equalFrequency: (bins: number = 10): BinOption => ({
    mode: 'equalFrequency',
    bins,
  }),

  /**
   * Fixed width binning
   */
  fixedWidth: (bins: number = 10): BinOption => ({
    mode: 'fixedWidth',
    bins,
  }),

  /**
   * Custom binning with user-defined edges
   */
  custom: (edges: number[] | Float64Array): BinOption => ({
    mode: 'custom',
    edges: [...edges].sort((a, b) => a - b), // Ensure sorted
  }),

  /**
   * Deciles (10 equal frequency bins)
   */
  deciles: (): BinOption => ({
    mode: 'equalFrequency',
    bins: 10,
  }),

  /**
   * Quartiles (4 equal frequency bins)
   */
  quartiles: (): BinOption => ({
    mode: 'equalFrequency',
    bins: 4,
  }),
};

/**
 * Calculate the covariance between two arrays.
 * 
 * Covariance measures how two variables change together:
 * - **Positive**: Variables tend to increase/decrease together
 * - **Negative**: One increases while the other decreases
 * - **Zero**: No linear relationship
 * 
 * **Note:** Covariance is scale-dependent. Use `corrcoeff` for a normalized 
 * measure (-1 to 1) that's easier to interpret.
 * 
 * @param x - First array of numbers
 * @param y - Second array of numbers (must have same length as x)
 * @returns The covariance value, or NaN if arrays are empty or different lengths
 * 
 * @example
 * ```js
 * import { init, covariance } from '@stats/core';
 * await init();
 * 
 * // Height and weight (positive covariance - taller people tend to weigh more)
 * const heights = [65, 68, 70, 72, 74];
 * const weights = [120, 140, 160, 180, 200];
 * const cov = covariance(heights, weights); // Positive value
 * ```
 */
export function covariance(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = x.length;
  if (len === 0 || len !== y.length) {
    return NaN;
  }

  const xPtr = wasmModule.alloc_f64(len);
  const yPtr = wasmModule.alloc_f64(len);
  const xView = f64View(xPtr, len);
  const yView = f64View(yPtr, len);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.covariance_f64(xPtr, len, yPtr, len);
  wasmModule.free_f64(xPtr, len);
  wasmModule.free_f64(yPtr, len);

  return result;
}

/**
 * Calculate the Pearson correlation coefficient between two arrays.
 * 
 * Measures the strength and direction of a linear relationship between two variables.
 * Returns a value between -1 and 1:
 * - **1**: Perfect positive correlation (as one increases, the other increases)
 * - **-1**: Perfect negative correlation (as one increases, the other decreases)
 * - **0**: No linear correlation
 * - **0.7-0.9**: Strong correlation
 * - **0.3-0.7**: Moderate correlation
 * - **0-0.3**: Weak correlation
 * 
 * **When to use:** Measure linear relationships. For non-linear or monotonic 
 * relationships, use `spearmancoeff` instead.
 * 
 * @param x - First array of numbers
 * @param y - Second array of numbers (must have same length as x)
 * @returns Correlation coefficient (-1 to 1), or NaN if arrays are empty or different lengths
 * 
 * @example
 * ```js
 * import { init, corrcoeff } from '@stats/core';
 * await init();
 * 
 * // Study hours vs test scores (likely strong positive correlation)
 * const studyHours = [5, 10, 15, 20, 25];
 * const testScores = [60, 70, 80, 85, 90];
 * const correlation = corrcoeff(studyHours, testScores); // ~0.98 (strong positive)
 * ```
 */
export function corrcoeff(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = x.length;
  if (len === 0 || len !== y.length) {
    return NaN;
  }

  const xPtr = wasmModule.alloc_f64(len);
  const yPtr = wasmModule.alloc_f64(len);
  const xView = f64View(xPtr, len);
  const yView = f64View(yPtr, len);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.corrcoeff_f64(xPtr, len, yPtr, len);
  wasmModule.free_f64(xPtr, len);
  wasmModule.free_f64(yPtr, len);

  return result;
}

/**
 * Calculate the Spearman rank correlation coefficient between two arrays.
 * 
 * Measures monotonic relationships (not just linear). Uses ranks instead of 
 * raw values, making it robust to outliers and non-linear relationships.
 * 
 * **When to use:** 
 * - Non-linear but monotonic relationships
 * - Data with outliers
 * - Ordinal data
 * - When you want a measure that works for any monotonic relationship
 * 
 * Returns a value between -1 and 1, interpreted similarly to Pearson correlation.
 * 
 * @param x - First array of numbers
 * @param y - Second array of numbers (must have same length as x)
 * @returns Spearman correlation coefficient (-1 to 1), or NaN if arrays are empty or different lengths
 * 
 * @example
 * ```js
 * import { init, spearmancoeff, corrcoeff } from '@stats/core';
 * await init();
 * 
 * // Exponential relationship (non-linear but monotonic)
 * const x = [1, 2, 3, 4, 5];
 * const y = [2, 4, 8, 16, 32]; // Exponential growth
 * 
 * const pearson = corrcoeff(x, y);  // Less than 1 (not perfectly linear)
 * const spearman = spearmancoeff(x, y); // 1.0 (perfect monotonic relationship)
 * ```
 */
export function spearmancoeff(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = x.length;
  if (len === 0 || len !== y.length) {
    return NaN;
  }

  const xPtr = wasmModule.alloc_f64(len);
  const yPtr = wasmModule.alloc_f64(len);
  const xView = f64View(xPtr, len);
  const yView = f64View(yPtr, len);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.spearmancoeff_f64(xPtr, len, yPtr, len);
  wasmModule.free_f64(xPtr, len);
  wasmModule.free_f64(yPtr, len);

  return result;
}

/**
 * ANOVA result containing F-score and degrees of freedom
 */
export interface AnovaResult {
  fScore: number;
  dfBetween: number;
  dfWithin: number;
  /** P-value from F-distribution (requires fisherF distribution) */
  pValue?: number;
}

/**
 * Calculate the F-score for one-way ANOVA (Analysis of Variance).
 * 
 * ANOVA tests whether there are statistically significant differences between 
 * the means of multiple groups. The F-score measures the ratio of variance 
 * between groups to variance within groups.
 * 
 * **When to use:** Compare means across 3+ groups (for 2 groups, use a t-test).
 * Common use cases: comparing test scores across different teaching methods, 
 * comparing sales across regions, comparing drug efficacy across dosages.
 * 
 * **Interpretation:**
 * - Higher F-score = more difference between group means
 * - Use `anovaTest` to get p-value for statistical significance
 * 
 * @param groups - Array of groups, where each group is an array of numbers
 * @returns The F-score, or NaN if less than 2 groups or any group is empty
 * 
 * @example
 * ```js
 * import { init, anovaFScore } from '@stats/core';
 * await init();
 * 
 * // Compare test scores across three teaching methods
 * const methodA = [75, 78, 80, 82, 85];
 * const methodB = [70, 72, 75, 77, 80];
 * const methodC = [85, 88, 90, 92, 95];
 * 
 * const fScore = anovaFScore([methodA, methodB, methodC]);
 * // Higher F-score suggests significant differences between methods
 * ```
 */
export function anovaFScore(groups: ArrayLike<number>[]): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const numGroups = groups.length;
  if (numGroups < 2) {
    return NaN;
  }

  // Calculate total length and group lengths
  const groupLens: number[] = [];
  let totalLen = 0;
  for (const group of groups) {
    if (group.length === 0) {
      return NaN;
    }
    groupLens.push(group.length);
    totalLen += group.length;
  }

  // Allocate flat data buffer and lengths buffer
  const dataPtr = wasmModule.alloc_f64(totalLen);
  const lensPtr = wasmModule.alloc_f64(numGroups);

  // Copy all group data into flat buffer
  const dataView = f64View(dataPtr, totalLen);
  let offset = 0;
  for (const group of groups) {
    for (let i = 0; i < group.length; i++) {
      dataView[offset++] = group[i];
    }
  }

  // Copy lengths
  const lensView = f64View(lensPtr, numGroups);
  for (let i = 0; i < numGroups; i++) {
    lensView[i] = groupLens[i];
  }

  const result = wasmModule.anova_f_score_flat(dataPtr, lensPtr, numGroups);

  // Clean up
  wasmModule.free_f64(dataPtr, totalLen);
  wasmModule.free_f64(lensPtr, numGroups);

  return result;
}

/**
 * Perform one-way ANOVA test with full results including p-value.
 * 
 * Complete ANOVA analysis that returns F-score, degrees of freedom, and p-value.
 * The p-value tells you whether the differences between groups are statistically 
 * significant.
 * 
 * **Interpretation:**
 * - **p < 0.05**: Significant difference between groups (reject null hypothesis)
 * - **p >= 0.05**: No significant difference (fail to reject null hypothesis)
 * 
 * **When to use:** When you need both the F-score and statistical significance 
 * (p-value) to make decisions about whether groups differ.
 * 
 * @param groups - Array of groups, where each group is an array of numbers
 * @returns Object with:
 *   - `fScore`: F-statistic
 *   - `dfBetween`: Degrees of freedom between groups
 *   - `dfWithin`: Degrees of freedom within groups  
 *   - `pValue`: P-value (probability of observing this result if groups are equal)
 * 
 * @example
 * ```js
 * import { init, anovaTest } from '@stats/core';
 * await init();
 * 
 * // Compare drug efficacy across three dosages
 * const lowDose = [45, 50, 55, 48, 52];
 * const mediumDose = [60, 65, 70, 63, 67];
 * const highDose = [75, 80, 85, 78, 82];
 * 
 * const result = anovaTest([lowDose, mediumDose, highDose]);
 * 
 * if (result.pValue && result.pValue < 0.05) {
 *   console.log('Significant difference: dosage matters!');
 * } else {
 *   console.log('No significant difference between dosages');
 * }
 * ```
 */
export function anovaTest(groups: ArrayLike<number>[]): AnovaResult {
  const fScore = anovaFScore(groups);
  
  const numGroups = groups.length;
  const totalN = groups.reduce((sum, g) => sum + g.length, 0);
  const dfBetween = numGroups - 1;
  const dfWithin = totalN - numGroups;

  // Calculate p-value using F-distribution
  let pValue: number | undefined;
  if (!isNaN(fScore) && dfBetween > 0 && dfWithin > 0) {
    const f = fisherF({ df1: dfBetween, df2: dfWithin });
    pValue = 1 - f.cdf(fScore);
  }

  return {
    fScore,
    dfBetween,
    dfWithin,
    pValue,
  };
}

/**
 * Chi-square test result containing statistic, p-value, and degrees of freedom
 */
export interface ChiSquareResult {
  statistic: number;
  pValue: number;
  df: number;
}

/**
 * Chi-square test of independence for two categorical variables.
 * 
 * Tests whether two categorical variables are independent.
 * 
 * **When to use:** Test if there's a relationship between two categorical variables.
 * Common use cases: testing if gender is independent of voting preference,
 * testing if treatment type is independent of outcome, etc.
 * 
 * **Interpretation:**
 * - **p < 0.05**: Variables are NOT independent (reject null hypothesis)
 * - **p >= 0.05**: No evidence that variables are dependent (fail to reject null hypothesis)
 * 
 * @param cat1 - First array of categorical values (strings or numbers)
 * @param cat2 - Second array of categorical values (strings or numbers), must be same length as cat1
 * @param options - Optional parameters:
 *   - `cardinality1`: Number of unique categories in cat1 (for optimization)
 *   - `cardinality2`: Number of unique categories in cat2 (for optimization)
 * @returns Object with:
 *   - `statistic`: Chi-square statistic
 *   - `pValue`: P-value (probability of observing this result if variables are independent)
 *   - `df`: Degrees of freedom
 * 
 * @example
 * ```js
 * import { init, chiSquareTest } from '@stats/core';
 * await init();
 * 
 * // Test if gender is independent of voting preference
 * const gender = ["M", "M", "F", "F", "M", "F"];
 * const vote = ["A", "B", "A", "A", "B", "B"];
 * 
 * const result = chiSquareTest(gender, vote);
 * 
 * if (result.pValue < 0.05) {
 *   console.log('Gender and voting preference are NOT independent');
 * } else {
 *   console.log('No evidence that gender affects voting preference');
 * }
 * ```
 * 
 * @example
 * ```js
 * // With cardinality hints for faster performance
 * const result = chiSquareTest(gender, vote, {
 *   cardinality1: 2, // gender has 2 unique values (M, F)
 *   cardinality2: 2  // vote has 2 unique values (A, B)
 * });
 * ```
 */
export function chiSquareTest(
  cat1: ArrayLike<string | number>,
  cat2: ArrayLike<string | number>,
  options?: { cardinality1?: number; cardinality2?: number }
): ChiSquareResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  if (cat1.length !== cat2.length) {
    throw new Error('Categorical arrays must have the same length');
  }

  // Convert to string arrays
  const cat1Str = Array.from(cat1).map(String);
  const cat2Str = Array.from(cat2).map(String);

  // Use optimized version if cardinalities are provided
  if (options?.cardinality1 != null && options?.cardinality2 != null) {
    const result = wasmModule.chi_square_test_with_cardinality(
      cat1Str,
      cat2Str,
      options.cardinality1,
      options.cardinality2
    );
    return {
      statistic: result.statistic,
      pValue: result.p_value,
      df: result.df,
    };
  }

  // Fallback to standard version
  const result = wasmModule.chi_square_test(cat1Str, cat2Str);

  return {
    statistic: result.statistic,
    pValue: result.p_value,
    df: result.df,
  };
}

/**
 * Calculate the F-score for one-way ANOVA using categorical grouping.
 * 
 * This is an alternative interface to `anovaFScore` that accepts:
 * - A categorical array of group labels
 * - A numeric array of values corresponding to each label
 * 
 * **When to use:** When your data is stored as pairs of (group, value) rather than
 * pre-grouped arrays. More convenient when data comes from a table or database.
 * 
 * @param groups - Array of categorical group labels (strings or numbers)
 * @param values - Array of numeric values corresponding to each group label
 * @returns The F-score, or NaN if invalid input
 * 
 * @example
 * ```js
 * import { init, anovaFScoreCategorical } from '@stats/core';
 * await init();
 * 
 * // Compare test scores across three teaching methods
 * const methods = ["A", "A", "A", "B", "B", "B", "C", "C", "C"];
 * const scores = [75, 78, 80, 70, 72, 75, 85, 88, 90];
 * 
 * const fScore = anovaFScoreCategorical(methods, scores);
 * ```
 */
export function anovaFScoreCategorical(
  groups: ArrayLike<string | number>,
  values: ArrayLike<number>
): number {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  if (groups.length !== values.length) {
    throw new Error('Groups and values arrays must have the same length');
  }

  // Convert groups to string array
  const groupsStr = Array.from(groups).map(String);
  const valuesArr = Array.from(values);

  return wasmModule.anova_f_score_categorical(groupsStr, valuesArr);
}

/**
 * Perform one-way ANOVA test with categorical grouping and full results including p-value.
 * 
 * This is an alternative interface to `anovaTest` that accepts:
 * - A categorical array of group labels
 * - A numeric array of values corresponding to each label
 * 
 * **When to use:** When your data is stored as pairs of (group, value) rather than
 * pre-grouped arrays, and you need both F-score and p-value.
 * 
 * @param groups - Array of categorical group labels (strings or numbers)
 * @param values - Array of numeric values corresponding to each group label
 * @returns Object with:
 *   - `fScore`: F-statistic
 *   - `dfBetween`: Degrees of freedom between groups
 *   - `dfWithin`: Degrees of freedom within groups  
 *   - `pValue`: P-value (probability of observing this result if groups are equal)
 * 
 * @example
 * ```js
 * import { init, anovaTestCategorical } from '@stats/core';
 * await init();
 * 
 * // Compare drug efficacy across three dosages
 * const dosages = ["low", "low", "low", "medium", "medium", "medium", "high", "high", "high"];
 * const efficacy = [45, 50, 55, 60, 65, 70, 75, 80, 85];
 * 
 * const result = anovaTestCategorical(dosages, efficacy);
 * 
 * if (result.pValue && result.pValue < 0.05) {
 *   console.log('Significant difference: dosage matters!');
 * } else {
 *   console.log('No significant difference between dosages');
 * }
 * ```
 */
export function anovaTestCategorical(
  groups: ArrayLike<string | number>,
  values: ArrayLike<number>
): AnovaResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  if (groups.length !== values.length) {
    throw new Error('Groups and values arrays must have the same length');
  }

  // Convert groups to string array
  const groupsStr = Array.from(groups).map(String);
  const valuesArr = Array.from(values);

  const result = wasmModule.anova_categorical(groupsStr, valuesArr);

  const fScore = result.f_score;
  const dfBetween = result.df_between;
  const dfWithin = result.df_within;

  // Calculate p-value using F-distribution
  let pValue: number | undefined;
  if (!isNaN(fScore) && dfBetween > 0 && dfWithin > 0) {
    const f = fisherF({ df1: dfBetween, df2: dfWithin });
    pValue = 1 - f.cdf(fScore);
  }

  return {
    fScore,
    dfBetween,
    dfWithin,
    pValue,
  };
}

// -----------------------
// Distribution factories
// -----------------------

export interface NormalParams {
  mean?: number;
  sd?: number;
}

/**
 * Create a normal (Gaussian) distribution.
 * 
 * @param params - Distribution parameters
 * @param params.mean - Mean of the distribution (default: 0)
 * @param params.sd - Standard deviation (default: 1)
 * @returns Distribution handle with pdf, cdf, and inv methods
 * 
 * @example
 * ```js
 * import { init, normal } from '@stats/core';
 * await init();
 * 
 * const dist = normal({ mean: 100, sd: 15 });
 * console.log(dist.pdf(100));  // Density at mean
 * console.log(dist.cdf(115));  // P(X <= 115)
 * console.log(dist.inv(0.95)); // 95th percentile
 * ```
 */
export function normal(params: NormalParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const sd = params.sd ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.normal_pdf_scalar(x, mean, sd),
    cdfScalar: (x: number) => wasm.normal_cdf_scalar(x, mean, sd),
    invScalar: (p: number) => wasm.normal_inv_scalar(p, mean, sd),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.normal_pdf_inplace(inputPtr, len, mean, sd, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.normal_cdf_inplace(inputPtr, len, mean, sd, outputPtr),
  });
}

export interface GammaParams {
  shape?: number;
  rate?: number;
  scale?: number;
}

export function gamma(params: GammaParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const shape = params.shape ?? 1;
  const rate =
    params.rate ??
    (params.scale !== undefined ? 1 / params.scale : 1);

  return buildDistribution({
    pdfScalar: (x: number) => wasm.gamma_pdf_scalar(x, shape, rate),
    cdfScalar: (x: number) => wasm.gamma_cdf_scalar(x, shape, rate),
    invScalar: (p: number) => wasm.gamma_inv_scalar(p, shape, rate),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.gamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.gamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr),
  });
}

export interface BetaParams {
  alpha?: number;
  beta?: number;
}

export function beta(params: BetaParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const alpha = params.alpha ?? 1;
  const betaShape = params.beta ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.beta_pdf_scalar(x, alpha, betaShape),
    cdfScalar: (x: number) => wasm.beta_cdf_scalar(x, alpha, betaShape),
    invScalar: (p: number) => wasm.beta_inv_scalar(p, alpha, betaShape),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.beta_pdf_inplace(inputPtr, len, alpha, betaShape, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.beta_cdf_inplace(inputPtr, len, alpha, betaShape, outputPtr),
  });
}

export interface StudentTParams {
  mean?: number;
  scale?: number;
  dof?: number;
}

export function studentT(
  params: StudentTParams = {}
): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const scale = params.scale ?? 1;
  const dof = params.dof ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) =>
      wasm.student_t_pdf_scalar(x, mean, scale, dof),
    cdfScalar: (x: number) =>
      wasm.student_t_cdf_scalar(x, mean, scale, dof),
    invScalar: (p: number) =>
      wasm.student_t_inv_scalar(p, mean, scale, dof),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.student_t_pdf_inplace(inputPtr, len, mean, scale, dof, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.student_t_cdf_inplace(inputPtr, len, mean, scale, dof, outputPtr),
  });
}

export interface ChiSquaredParams {
  dof?: number;
}

export function chiSquared(
  params: ChiSquaredParams = {}
): DistributionHandle {
  const wasm = requireWasm();
  const dof = params.dof ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.chi_squared_pdf_scalar(x, dof),
    cdfScalar: (x: number) => wasm.chi_squared_cdf_scalar(x, dof),
    invScalar: (p: number) => wasm.chi_squared_inv_scalar(p, dof),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.chi_squared_pdf_inplace(inputPtr, len, dof, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.chi_squared_cdf_inplace(inputPtr, len, dof, outputPtr),
  });
}

export interface FisherFParams {
  df1?: number;
  df2?: number;
}

export function fisherF(params: FisherFParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const df1 = params.df1 ?? 1;
  const df2 = params.df2 ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.fisher_f_pdf_scalar(x, df1, df2),
    cdfScalar: (x: number) => wasm.fisher_f_cdf_scalar(x, df1, df2),
    invScalar: (p: number) => wasm.fisher_f_inv_scalar(p, df1, df2),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.fisher_f_pdf_inplace(inputPtr, len, df1, df2, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.fisher_f_cdf_inplace(inputPtr, len, df1, df2, outputPtr),
  });
}

export interface ExponentialParams {
  rate?: number;
  scale?: number;
}

export function exponential(
  params: ExponentialParams = {}
): DistributionHandle {
  const wasm = requireWasm();
  const rate =
    params.rate ??
    (params.scale !== undefined ? 1 / params.scale : 1);

  return buildDistribution({
    pdfScalar: (x: number) => wasm.exponential_pdf_scalar(x, rate),
    cdfScalar: (x: number) => wasm.exponential_cdf_scalar(x, rate),
    invScalar: (p: number) => wasm.exponential_inv_scalar(p, rate),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.exponential_pdf_inplace(inputPtr, len, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.exponential_cdf_inplace(inputPtr, len, rate, outputPtr),
  });
}

export interface PoissonParams {
  lambda?: number;
}

/**
 * Create a Poisson distribution handle.
 *
 * The Poisson distribution models the number of events occurring in a fixed interval
 * of time or space, given a constant average rate (lambda).
 *
 * @param params - Distribution parameters
 * @param params.lambda - Mean number of events (rate parameter). Default: 1
 * @returns Distribution handle with pdf, cdf, inv, pdfArray, cdfArray methods
 *
 * @example
 * ```js
 * import { init, poisson } from '@stats/core';
 * await init();
 *
 * const dist = poisson({ lambda: 3 });
 * const prob = dist.pdf(2); // Probability of exactly 2 events
 * const cumProb = dist.cdf(5); // Probability of 5 or fewer events
 * ```
 */
export function poisson(params: PoissonParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const lambda = params.lambda ?? 1;

  return buildDistribution({
    pdfScalar: (k: number) => wasm.poisson_pmf_scalar(k, lambda),
    cdfScalar: (k: number) => wasm.poisson_cdf_scalar(k, lambda),
    invScalar: (p: number) => wasm.poisson_inv_scalar(p, lambda),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.poisson_pmf_inplace(inputPtr, len, lambda, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.poisson_cdf_inplace(inputPtr, len, lambda, outputPtr),
  });
}

export interface BinomialParams {
  n?: number;
  p?: number;
}

/**
 * Create a Binomial distribution handle.
 *
 * The Binomial distribution models the number of successes in n independent
 * Bernoulli trials, each with probability p of success.
 *
 * @param params - Distribution parameters
 * @param params.n - Number of trials. Default: 10
 * @param params.p - Probability of success per trial. Default: 0.5
 * @returns Distribution handle with pdf, cdf, inv, pdfArray, cdfArray methods
 *
 * @example
 * ```js
 * import { init, binomial } from '@stats/core';
 * await init();
 *
 * const dist = binomial({ n: 20, p: 0.3 });
 * const prob = dist.pdf(5); // Probability of exactly 5 successes
 * const cumProb = dist.cdf(10); // Probability of 10 or fewer successes
 * ```
 */
export function binomial(params: BinomialParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const n = params.n ?? 10;
  const p = params.p ?? 0.5;

  return buildDistribution({
    pdfScalar: (k: number) => wasm.binomial_pmf_scalar(k, n, p),
    cdfScalar: (k: number) => wasm.binomial_cdf_scalar(k, n, p),
    invScalar: (prob: number) => wasm.binomial_inv_scalar(prob, n, p),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.binomial_pmf_inplace(inputPtr, len, n, p, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.binomial_cdf_inplace(inputPtr, len, n, p, outputPtr),
  });
}

export interface UniformParams {
  min?: number;
  max?: number;
}

/**
 * Create a Uniform distribution handle.
 */
export function uniform(params: UniformParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const min = params.min ?? 0;
  const max = params.max ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.uniform_pdf_scalar(x, min, max),
    cdfScalar: (x: number) => wasm.uniform_cdf_scalar(x, min, max),
    invScalar: (p: number) => wasm.uniform_inv_scalar(p, min, max),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.uniform_pdf_inplace(inputPtr, len, min, max, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.uniform_cdf_inplace(inputPtr, len, min, max, outputPtr),
  });
}

export interface CauchyParams {
  location?: number;
  scale?: number;
}

/**
 * Create a Cauchy distribution handle.
 */
export function cauchy(params: CauchyParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const location = params.location ?? 0;
  const scale = params.scale ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.cauchy_pdf_scalar(x, location, scale),
    cdfScalar: (x: number) => wasm.cauchy_cdf_scalar(x, location, scale),
    invScalar: (p: number) => wasm.cauchy_inv_scalar(p, location, scale),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.cauchy_pdf_inplace(inputPtr, len, location, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.cauchy_cdf_inplace(inputPtr, len, location, scale, outputPtr),
  });
}

export interface LaplaceParams {
  location?: number;
  scale?: number;
}

/**
 * Create a Laplace distribution handle.
 */
export function laplace(params: LaplaceParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const location = params.location ?? 0;
  const scale = params.scale ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.laplace_pdf_scalar(x, location, scale),
    cdfScalar: (x: number) => wasm.laplace_cdf_scalar(x, location, scale),
    invScalar: (p: number) => wasm.laplace_inv_scalar(p, location, scale),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.laplace_pdf_inplace(inputPtr, len, location, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.laplace_cdf_inplace(inputPtr, len, location, scale, outputPtr),
  });
}

export interface LogNormalParams {
  mean?: number;
  sd?: number;
}

/**
 * Create a Log-normal distribution handle.
 */
export function logNormal(params: LogNormalParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const sd = params.sd ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.lognormal_pdf_scalar(x, mean, sd),
    cdfScalar: (x: number) => wasm.lognormal_cdf_scalar(x, mean, sd),
    invScalar: (p: number) => wasm.lognormal_inv_scalar(p, mean, sd),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.lognormal_pdf_inplace(inputPtr, len, mean, sd, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.lognormal_cdf_inplace(inputPtr, len, mean, sd, outputPtr),
  });
}

export interface WeibullParams {
  shape?: number;
  scale?: number;
}

/**
 * Create a Weibull distribution handle.
 */
export function weibull(params: WeibullParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const shape = params.shape ?? 1;
  const scale = params.scale ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.weibull_pdf_scalar(x, shape, scale),
    cdfScalar: (x: number) => wasm.weibull_cdf_scalar(x, shape, scale),
    invScalar: (p: number) => wasm.weibull_inv_scalar(p, shape, scale),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.weibull_pdf_inplace(inputPtr, len, shape, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.weibull_cdf_inplace(inputPtr, len, shape, scale, outputPtr),
  });
}

export interface ParetoParams {
  scale?: number;
  shape?: number;
}

/**
 * Create a Pareto distribution handle.
 */
export function pareto(params: ParetoParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const scale = params.scale ?? 1;
  const shape = params.shape ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.pareto_pdf_scalar(x, scale, shape),
    cdfScalar: (x: number) => wasm.pareto_cdf_scalar(x, scale, shape),
    invScalar: (p: number) => wasm.pareto_inv_scalar(p, scale, shape),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.pareto_pdf_inplace(inputPtr, len, scale, shape, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.pareto_cdf_inplace(inputPtr, len, scale, shape, outputPtr),
  });
}

export interface TriangularParams {
  min?: number;
  max?: number;
  mode?: number;
}

/**
 * Create a Triangular distribution handle.
 */
export function triangular(params: TriangularParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const min = params.min ?? 0;
  const max = params.max ?? 1;
  const mode = params.mode ?? (min + max) / 2;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.triangular_pdf_scalar(x, min, max, mode),
    cdfScalar: (x: number) => wasm.triangular_cdf_scalar(x, min, max, mode),
    invScalar: (p: number) => wasm.triangular_inv_scalar(p, min, max, mode),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.triangular_pdf_inplace(inputPtr, len, min, max, mode, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.triangular_cdf_inplace(inputPtr, len, min, max, mode, outputPtr),
  });
}

export interface InverseGammaParams {
  shape?: number;
  rate?: number;
}

/**
 * Create an Inverse Gamma distribution handle.
 */
export function inverseGamma(params: InverseGammaParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const shape = params.shape ?? 1;
  const rate = params.rate ?? 1;

  return buildDistribution({
    pdfScalar: (x: number) => wasm.invgamma_pdf_scalar(x, shape, rate),
    cdfScalar: (x: number) => wasm.invgamma_cdf_scalar(x, shape, rate),
    invScalar: (p: number) => wasm.invgamma_inv_scalar(p, shape, rate),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.invgamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.invgamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr),
  });
}

export interface NegativeBinomialParams {
  r?: number;
  p?: number;
}

/**
 * Create a Negative Binomial distribution handle.
 */
export function negativeBinomial(params: NegativeBinomialParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const r = params.r ?? 1;
  const p = params.p ?? 0.5;

  return buildDistribution({
    pdfScalar: (k: number) => wasm.negbin_pmf_scalar(k, r, p),
    cdfScalar: (k: number) => wasm.negbin_cdf_scalar(k, r, p),
    invScalar: (prob: number) => wasm.negbin_inv_scalar(prob, r, p),
    pdfKernel: (inputPtr, len, outputPtr) =>
      wasm.negbin_pmf_inplace(inputPtr, len, r, p, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) =>
      wasm.negbin_cdf_inplace(inputPtr, len, r, p, outputPtr),
  });
}

/**
 * One-sample t-test: tests if sample mean equals a hypothesized value
 *
 * @param data - Sample data
 * @param mu0 - Hypothesized population mean
 * @returns Test result with t-statistic, p-value, and degrees of freedom
 *
 * @example
 * ```js
 * import { init, ttest } from '@stats/core';
 * await init();
 *
 * const sample = [1, 2, 3, 4, 5];
 * const result = ttest(sample, 3);
 * console.log(`t=${result.statistic}, p=${result.p_value}`);
 * ```
 */
export function ttest(
  data: ArrayLike<number>,
  mu0: number
): TestResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.ttest_f64(ptr, len, mu0);
  wasmModule.free_f64(ptr, len);

  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df,
  };
}

/**
 * One-sample z-test: tests if sample mean equals a hypothesized value with known population standard deviation
 *
 * @param data - Sample data
 * @param mu0 - Hypothesized population mean
 * @param sigma - Known population standard deviation
 * @returns Test result with z-statistic and p-value
 *
 * @example
 * ```js
 * import { init, ztest } from '@stats/core';
 * await init();
 *
 * const sample = [1, 2, 3, 4, 5];
 * const result = ztest(sample, 3, 1.414);
 * console.log(`z=${result.statistic}, p=${result.p_value}`);
 * ```
 */
export function ztest(
  data: ArrayLike<number>,
  mu0: number,
  sigma: number
): TestResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const len = data.length;
  if (len === 0) {
    return { statistic: NaN, p_value: NaN, df: null };
  }

  const ptr = wasmModule.alloc_f64(len);
  const view = f64View(ptr, len);
  copyToWasmMemory(data, view);

  const result = wasmModule.ztest_f64(ptr, len, mu0, sigma);
  wasmModule.free_f64(ptr, len);

  return {
    statistic: result.statistic,
    p_value: result.p_value,
    df: result.df,
  };
}

/**
 * Simple linear regression: y = slope * x + intercept
 *
 * @param x - Independent variable values
 * @param y - Dependent variable values
 * @returns Regression result with slope, intercept, R², and residuals
 *
 * @example
 * ```js
 * import { init, regress } from '@stats/core';
 * await init();
 *
 * const x = [1, 2, 3, 4, 5];
 * const y = [2, 4, 6, 8, 10];
 * const result = regress(x, y);
 * console.log(`slope=${result.slope}, intercept=${result.intercept}, R²=${result.r_squared}`);
 * ```
 */
export function regress(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): RegressionResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const xLen = x.length;
  const yLen = y.length;

  if (xLen !== yLen || xLen < 2) {
    return {
      slope: NaN,
      intercept: NaN,
      r_squared: NaN,
      residuals: new Float64Array(),
    };
  }

  const xPtr = wasmModule.alloc_f64(xLen);
  const yPtr = wasmModule.alloc_f64(yLen);
  const xView = f64View(xPtr, xLen);
  const yView = f64View(yPtr, yLen);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.regress_f64(xPtr, xLen, yPtr, yLen);
  
  wasmModule.free_f64(xPtr, xLen);
  wasmModule.free_f64(yPtr, yLen);

  // Extract residuals
  const residualsView = f64View(result.residuals.ptr, result.residuals.len);
  const residuals = new Float64Array(result.residuals.len);
  residuals.set(residualsView);
  wasmModule.free_f64(result.residuals.ptr, result.residuals.len);

  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

/**
 * Naive linear regression implementation (scalar, multi-pass).
 * Intentionally non-optimized for performance comparison.
 *
 * @param x - Independent variable values
 * @param y - Dependent variable values
 * @returns Regression result with slope, intercept, R², and residuals
 */
export function regressNaive(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): RegressionResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const xLen = x.length;
  const yLen = y.length;

  if (xLen !== yLen || xLen < 2) {
    return {
      slope: NaN,
      intercept: NaN,
      r_squared: NaN,
      residuals: new Float64Array(),
    };
  }

  const xPtr = wasmModule.alloc_f64(xLen);
  const yPtr = wasmModule.alloc_f64(yLen);
  const xView = f64View(xPtr, xLen);
  const yView = f64View(yPtr, yLen);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.regress_naive_f64(xPtr, xLen, yPtr, yLen);
  
  wasmModule.free_f64(xPtr, xLen);
  wasmModule.free_f64(yPtr, yLen);

  // Extract residuals
  const residualsView = f64View(result.residuals.ptr, result.residuals.len);
  const residuals = new Float64Array(result.residuals.len);
  residuals.set(residualsView);
  wasmModule.free_f64(result.residuals.ptr, result.residuals.len);

  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

/**
 * SIMD-optimized linear regression (fused sums, single-pass for statistics).
 *
 * @param x - Independent variable values
 * @param y - Dependent variable values
 * @returns Regression result with slope, intercept, R², and residuals
 */
export function regressSimd(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): RegressionResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const xLen = x.length;
  const yLen = y.length;

  if (xLen !== yLen || xLen < 2) {
    return {
      slope: NaN,
      intercept: NaN,
      r_squared: NaN,
      residuals: new Float64Array(),
    };
  }

  const xPtr = wasmModule.alloc_f64(xLen);
  const yPtr = wasmModule.alloc_f64(yLen);
  const xView = f64View(xPtr, xLen);
  const yView = f64View(yPtr, yLen);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.regress_simd_f64(xPtr, xLen, yPtr, yLen);
  
  wasmModule.free_f64(xPtr, xLen);
  wasmModule.free_f64(yPtr, yLen);

  // Extract residuals
  const residualsView = f64View(result.residuals.ptr, result.residuals.len);
  const residuals = new Float64Array(result.residuals.len);
  residuals.set(residualsView);
  wasmModule.free_f64(result.residuals.ptr, result.residuals.len);

  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

/**
 * BLAS-like kernels-based linear regression.
 * Uses minimal kernel operations (dot product, sum, axpy-style residuals).
 *
 * @param x - Independent variable values
 * @param y - Dependent variable values
 * @returns Regression result with slope, intercept, R², and residuals
 */
export function regressWasmKernels(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): RegressionResult {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const xLen = x.length;
  const yLen = y.length;

  if (xLen !== yLen || xLen < 2) {
    return {
      slope: NaN,
      intercept: NaN,
      r_squared: NaN,
      residuals: new Float64Array(),
    };
  }

  const xPtr = wasmModule.alloc_f64(xLen);
  const yPtr = wasmModule.alloc_f64(yLen);
  const xView = f64View(xPtr, xLen);
  const yView = f64View(yPtr, yLen);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const result = wasmModule.regress_wasm_kernels_f64(xPtr, xLen, yPtr, yLen);
  
  wasmModule.free_f64(xPtr, xLen);
  wasmModule.free_f64(yPtr, yLen);

  // Extract residuals
  const residualsView = f64View(result.residuals.ptr, result.residuals.len);
  const residuals = new Float64Array(result.residuals.len);
  residuals.set(residualsView);
  wasmModule.free_f64(result.residuals.ptr, result.residuals.len);

  return {
    slope: result.slope,
    intercept: result.intercept,
    r_squared: result.r_squared,
    residuals,
  };
}

function regressCoeffsImpl(
  x: ArrayLike<number>,
  y: ArrayLike<number>,
  wasmFn: (xPtr: number, xLen: number, yPtr: number, yLen: number) => RegressionCoeffs
): RegressionCoeffs {
  const wasm = requireWasm();
  const xLen = x.length;
  const yLen = y.length;

  if (xLen !== yLen || xLen < 2) {
    return { slope: NaN, intercept: NaN, r_squared: NaN };
  }

  const xPtr = wasm.alloc_f64(xLen);
  const yPtr = wasm.alloc_f64(yLen);
  const xView = f64View(xPtr, xLen);
  const yView = f64View(yPtr, yLen);
  copyToWasmMemory(x, xView);
  copyToWasmMemory(y, yView);

  const coeffs = wasmFn(xPtr, xLen, yPtr, yLen);

  wasm.free_f64(xPtr, xLen);
  wasm.free_f64(yPtr, yLen);

  return coeffs;
}

/**
 * Coefficients-only regression (no residual allocation/copy).
 * Best for performance-sensitive workloads and benchmarking.
 */
export function regressCoeffs(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffs {
  return regressCoeffsImpl(x, y, requireWasm().regress_coeffs_f64);
}

export function regressNaiveCoeffs(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffs {
  return regressCoeffsImpl(x, y, requireWasm().regress_naive_coeffs_f64);
}

export function regressSimdCoeffs(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffs {
  return regressCoeffsImpl(x, y, requireWasm().regress_simd_coeffs_f64);
}

export function regressWasmKernelsCoeffs(
  x: ArrayLike<number>,
  y: ArrayLike<number>
): RegressionCoeffs {
  return regressCoeffsImpl(x, y, requireWasm().regress_wasm_kernels_coeffs_f64);
}

/**
 * f32 coefficients-only regression.
 *
 * This is primarily aimed at wasm32 SIMD (f32x4) performance.
 * For best performance, pass `Float32Array` inputs.
 */
export function regressSimdCoeffsF32(x: ArrayLike<number>, y: ArrayLike<number>): RegressionCoeffsF32 {
  const wasm = requireWasm();
  const len = x.length;
  if (len !== y.length || len < 2) {
    return { slope: NaN, intercept: NaN, r_squared: NaN };
  }

  const xPtr = wasm.alloc_f32(len);
  const yPtr = wasm.alloc_f32(len);
  const xView = f32View(xPtr, len);
  const yView = f32View(yPtr, len);
  copyToWasmMemoryF32(x, xView);
  copyToWasmMemoryF32(y, yView);

  const coeffs = wasm.regress_simd_coeffs_f32(xPtr, len, yPtr, len);

  wasm.free_f32(xPtr, len);
  wasm.free_f32(yPtr, len);

  return coeffs;
}

/**
 * A reusable WASM-side regression workspace for f32.
 * Avoids per-call alloc/copy and enables f32x4 SIMD on wasm32.
 */
export class RegressionWorkspaceF32 {
  private wasm: WasmModule;
  private xPtr: number;
  private yPtr: number;
  private len: number;
  private residualsPtr: number | null;

  private constructor(wasm: WasmModule, xPtr: number, yPtr: number, len: number, residualsPtr: number | null) {
    this.wasm = wasm;
    this.xPtr = xPtr;
    this.yPtr = yPtr;
    this.len = len;
    this.residualsPtr = residualsPtr;
  }

  static fromXY(x: ArrayLike<number>, y: ArrayLike<number>, withResiduals = false): RegressionWorkspaceF32 {
    const wasm = requireWasm();
    const len = x.length;
    if (len !== y.length || len < 2) {
      throw new Error('RegressionWorkspaceF32 requires x/y of same length and length >= 2.');
    }

    const xPtr = wasm.alloc_f32(len);
    const yPtr = wasm.alloc_f32(len);
    const xView = f32View(xPtr, len);
    const yView = f32View(yPtr, len);
    copyToWasmMemoryF32(x, xView);
    copyToWasmMemoryF32(y, yView);

    const residualsPtr = withResiduals ? wasm.alloc_f32(len) : null;
    return new RegressionWorkspaceF32(wasm, xPtr, yPtr, len, residualsPtr);
  }

  coeffsSimd(): RegressionCoeffsF32 {
    return this.wasm.regress_simd_coeffs_f32(this.xPtr, this.len, this.yPtr, this.len);
  }

  residualsInPlaceSimd(): RegressionCoeffsF32 {
    if (this.residualsPtr == null) {
      throw new Error('RegressionWorkspaceF32 was created without residual buffer.');
    }
    return this.wasm.regress_simd_residuals_inplace_f32(this.xPtr, this.len, this.yPtr, this.len, this.residualsPtr);
  }

  readResiduals(): Float32Array {
    if (this.residualsPtr == null) {
      return new Float32Array();
    }
    const view = f32View(this.residualsPtr, this.len);
    const out = new Float32Array(this.len);
    out.set(view);
    return out;
  }

  free(): void {
    this.wasm.free_f32(this.xPtr, this.len);
    this.wasm.free_f32(this.yPtr, this.len);
    if (this.residualsPtr != null) {
      this.wasm.free_f32(this.residualsPtr, this.len);
      this.residualsPtr = null;
    }
    this.xPtr = 0;
    this.yPtr = 0;
    this.len = 0;
  }
}

/**
 * A reusable WASM-side regression workspace.
 *
 * This is the fastest way to benchmark/execute regression repeatedly because it:
 * - allocates/copies x/y once into WASM memory
 * - optionally allocates an output residual buffer once
 * - avoids per-iteration alloc/free and JS↔WASM copies
 */
export class RegressionWorkspace {
  private wasm: WasmModule;
  private xPtr: number;
  private yPtr: number;
  private len: number;
  private residualsPtr: number | null;

  private constructor(wasm: WasmModule, xPtr: number, yPtr: number, len: number, residualsPtr: number | null) {
    this.wasm = wasm;
    this.xPtr = xPtr;
    this.yPtr = yPtr;
    this.len = len;
    this.residualsPtr = residualsPtr;
  }

  static fromXY(x: ArrayLike<number>, y: ArrayLike<number>, withResiduals = false): RegressionWorkspace {
    const wasm = requireWasm();
    const len = x.length;
    if (len !== y.length || len < 2) {
      throw new Error('RegressionWorkspace requires x/y of same length and length >= 2.');
    }

    const xPtr = wasm.alloc_f64(len);
    const yPtr = wasm.alloc_f64(len);
    const xView = f64View(xPtr, len);
    const yView = f64View(yPtr, len);
    copyToWasmMemory(x, xView);
    copyToWasmMemory(y, yView);

    const residualsPtr = withResiduals ? wasm.alloc_f64(len) : null;
    return new RegressionWorkspace(wasm, xPtr, yPtr, len, residualsPtr);
  }

  coeffsNaive(): RegressionCoeffs {
    return this.wasm.regress_naive_coeffs_f64(this.xPtr, this.len, this.yPtr, this.len);
  }

  coeffsSimd(): RegressionCoeffs {
    return this.wasm.regress_simd_coeffs_f64(this.xPtr, this.len, this.yPtr, this.len);
  }

  coeffsKernels(): RegressionCoeffs {
    return this.wasm.regress_wasm_kernels_coeffs_f64(this.xPtr, this.len, this.yPtr, this.len);
  }

  /**
   * Compute residuals into a preallocated WASM buffer (no JS copy).
   * You must create the workspace with `withResiduals=true`.
   */
  residualsInPlaceNaive(): RegressionCoeffs {
    if (this.residualsPtr == null) {
      throw new Error('RegressionWorkspace was created without residual buffer.');
    }
    return this.wasm.regress_naive_residuals_inplace_f64(this.xPtr, this.len, this.yPtr, this.len, this.residualsPtr);
  }

  residualsInPlaceSimd(): RegressionCoeffs {
    if (this.residualsPtr == null) {
      throw new Error('RegressionWorkspace was created without residual buffer.');
    }
    return this.wasm.regress_simd_residuals_inplace_f64(this.xPtr, this.len, this.yPtr, this.len, this.residualsPtr);
  }

  residualsInPlaceKernels(): RegressionCoeffs {
    if (this.residualsPtr == null) {
      throw new Error('RegressionWorkspace was created without residual buffer.');
    }
    return this.wasm.regress_wasm_kernels_residuals_inplace_f64(
      this.xPtr,
      this.len,
      this.yPtr,
      this.len,
      this.residualsPtr
    );
  }

  /**
   * Copy residuals out of WASM memory (optional; expensive).
   */
  readResiduals(): Float64Array {
    if (this.residualsPtr == null) {
      return new Float64Array();
    }
    const view = f64View(this.residualsPtr, this.len);
    const out = new Float64Array(this.len);
    out.set(view);
    return out;
  }

  free(): void {
    this.wasm.free_f64(this.xPtr, this.len);
    this.wasm.free_f64(this.yPtr, this.len);
    if (this.residualsPtr != null) {
      this.wasm.free_f64(this.residualsPtr, this.len);
      this.residualsPtr = null;
    }
    // poison pointers
    this.xPtr = 0;
    this.yPtr = 0;
    this.len = 0;
  }
}

/**
 * Normal distribution confidence interval
 *
 * @param alpha - Significance level (e.g., 0.05 for 95% confidence)
 * @param mean - Sample mean
 * @param se - Standard error
 * @returns [lower, upper] confidence interval bounds
 *
 * @example
 * ```js
 * import { init, normalci } from '@stats/core';
 * await init();
 *
 * const ci = normalci(0.05, 100, 10);
 * console.log(`95% CI: [${ci[0]}, ${ci[1]}]`);
 * ```
 */
export function normalci(
  alpha: number,
  mean: number,
  se: number
): [number, number] {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const ci = wasmModule.normalci_f64(alpha, mean, se);
  return [ci[0], ci[1]];
}

/**
 * t-distribution confidence interval
 *
 * @param alpha - Significance level (e.g., 0.05 for 95% confidence)
 * @param mean - Sample mean
 * @param stdev - Sample standard deviation
 * @param n - Sample size
 * @returns [lower, upper] confidence interval bounds
 *
 * @example
 * ```js
 * import { init, tci } from '@stats/core';
 * await init();
 *
 * const ci = tci(0.05, 100, 10, 20);
 * console.log(`95% CI: [${ci[0]}, ${ci[1]}]`);
 * ```
 */
export function tci(
  alpha: number,
  mean: number,
  stdev: number,
  n: number
): [number, number] {
  if (!wasmModule) {
    throw new Error('Wasm module not initialized. Call init() first.');
  }

  const ci = wasmModule.tci_f64(alpha, mean, stdev, n);
  return [ci[0], ci[1]];
}

