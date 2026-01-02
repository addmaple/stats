/**
 * Unified WASM type definitions for all modules.
 *
 * This file is the single source of truth for WASM module types.
 * Types are defined to match the wasm-bindgen generated exports.
 */

// Common interface for ArrayResult returned by WASM functions
export interface ArrayResult {
  readonly ptr: number;
  readonly len: number;
  readonly cap?: number;
}

// Common interface for HistogramWithEdges result
export interface HistogramWithEdgesResult {
  readonly edges: ArrayResult;
  readonly counts: ArrayResult;
}

// Common interface for test results
export interface TestResult {
  readonly statistic: number;
  readonly p_value: number;
  readonly df?: number;
}

// Regression coefficients
export interface RegressionCoeffs {
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
}

// Regression coefficients (f32)
export interface RegressionCoeffsF32 {
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
}

// Full regression result with residuals
export interface RegressionResult {
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
  readonly residuals: Float64Array;
}

/**
 * Full descriptive statistics snapshot for a numeric array.
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

// Full regression result with residuals (WASM internal)
export interface WasmRegressionResult {
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
  readonly residuals: ArrayResult;
}

// Quartiles result
export interface QuartilesResult {
  readonly q1: number;
  readonly q2: number;
  readonly q3: number;
}

// ANOVA result
export interface AnovaResult {
  readonly fScore: number;
  readonly dfBetween: number;
  readonly dfWithin: number;
}

// Chi-square result
export interface ChiSquareResult {
  readonly statistic: number;
  readonly pValue: number;
  readonly df: number;
}

// Tukey HSD pair result
export interface TukeyPairResult {
  readonly group1: number;
  readonly group2: number;
  readonly mean_diff: number;
  readonly q_statistic: number;
  readonly p_value: number;
  readonly ci_lower: number;
  readonly ci_upper: number;
}

// Tukey HSD result
export interface TukeyHsdResult {
  readonly num_groups: number;
  readonly df_within: number;
  readonly msw: number;
  readonly comparisons: TukeyPairResult[];
}

/**
 * Stats WASM module interface (stat-wasm-stats).
 * Used by the /stats subpath export.
 */
export interface StatsWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  sum_f64(ptr: number, len: number): number;
  mean_f64(ptr: number, len: number): number;
  variance_f64(ptr: number, len: number): number;
  sample_variance_f64(ptr: number, len: number): number;
  stdev_f64(ptr: number, len: number): number;
  sample_stdev_f64(ptr: number, len: number): number;
  coeffvar_f64(ptr: number, len: number): number;
  min_f64(ptr: number, len: number): number;
  max_f64(ptr: number, len: number): number;
  product_f64(ptr: number, len: number): number;
  range_f64(ptr: number, len: number): number;
  median_f64(ptr: number, len: number): number;
  mode_f64(ptr: number, len: number): number;
  geomean_f64(ptr: number, len: number): number;
  skewness_f64(ptr: number, len: number): number;
  kurtosis_f64(ptr: number, len: number): number;
  meandev_f64(ptr: number, len: number): number;
  meddev_f64(ptr: number, len: number): number;
  pooledvariance_f64(d1p: number, d1l: number, d2p: number, d2l: number): number;
  pooledstdev_f64(d1p: number, d1l: number, d2p: number, d2l: number): number;
  stan_moment_f64(ptr: number, len: number, k: number): number;
  cumsum_f64(ptr: number, len: number): ArrayResult;
  cumprod_f64(ptr: number, len: number): ArrayResult;
  diff_f64(ptr: number, len: number): ArrayResult;
  rank_f64(ptr: number, len: number): ArrayResult;
  deviation_f64(ptr: number, len: number): ArrayResult;
  histogram_f64(ptr: number, len: number, binCount: number): ArrayResult;
}

/**
 * Distributions WASM module interface (stat-wasm-distributions).
 * Used by the /distributions subpath export.
 */
export interface DistributionsWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  // Normal distribution
  normal_pdf_scalar(x: number, mean: number, sd: number): number;
  normal_cdf_scalar(x: number, mean: number, sd: number): number;
  normal_inv_scalar(p: number, mean: number, sd: number): number;
  normal_pdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  normal_cdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  // Gamma distribution
  gamma_pdf_scalar(x: number, shape: number, rate: number): number;
  gamma_cdf_scalar(x: number, shape: number, rate: number): number;
  gamma_inv_scalar(p: number, shape: number, rate: number): number;
  gamma_pdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  gamma_cdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  // Beta distribution
  beta_pdf_scalar(x: number, alpha: number, beta: number): number;
  beta_cdf_scalar(x: number, alpha: number, beta: number): number;
  beta_inv_scalar(p: number, alpha: number, beta: number): number;
  beta_pdf_inplace(inputPtr: number, len: number, alpha: number, beta: number, outputPtr: number): void;
  beta_cdf_inplace(inputPtr: number, len: number, alpha: number, beta: number, outputPtr: number): void;
  // Student's t distribution
  student_t_pdf_scalar(x: number, mean: number, scale: number, dof: number): number;
  student_t_cdf_scalar(x: number, mean: number, scale: number, dof: number): number;
  student_t_inv_scalar(p: number, mean: number, scale: number, dof: number): number;
  student_t_pdf_inplace(inputPtr: number, len: number, mean: number, scale: number, dof: number, outputPtr: number): void;
  student_t_cdf_inplace(inputPtr: number, len: number, mean: number, scale: number, dof: number, outputPtr: number): void;
  // Chi-squared distribution
  chi_squared_pdf_scalar(x: number, dof: number): number;
  chi_squared_cdf_scalar(x: number, dof: number): number;
  chi_squared_inv_scalar(p: number, dof: number): number;
  chi_squared_pdf_inplace(inputPtr: number, len: number, dof: number, outputPtr: number): void;
  chi_squared_cdf_inplace(inputPtr: number, len: number, dof: number, outputPtr: number): void;
  // Fisher F distribution
  fisher_f_pdf_scalar(x: number, df1: number, df2: number): number;
  fisher_f_cdf_scalar(x: number, df1: number, df2: number): number;
  fisher_f_inv_scalar(p: number, df1: number, df2: number): number;
  fisher_f_pdf_inplace(inputPtr: number, len: number, df1: number, df2: number, outputPtr: number): void;
  fisher_f_cdf_inplace(inputPtr: number, len: number, df1: number, df2: number, outputPtr: number): void;
  // Exponential distribution
  exponential_pdf_scalar(x: number, rate: number): number;
  exponential_cdf_scalar(x: number, rate: number): number;
  exponential_inv_scalar(p: number, rate: number): number;
  exponential_pdf_inplace(inputPtr: number, len: number, rate: number, outputPtr: number): void;
  exponential_cdf_inplace(inputPtr: number, len: number, rate: number, outputPtr: number): void;
  // Poisson distribution
  poisson_pmf_scalar(k: number, lambda: number): number;
  poisson_cdf_scalar(k: number, lambda: number): number;
  poisson_inv_scalar(p: number, lambda: number): number;
  poisson_pmf_inplace(inputPtr: number, len: number, lambda: number, outputPtr: number): void;
  poisson_cdf_inplace(inputPtr: number, len: number, lambda: number, outputPtr: number): void;
  // Binomial distribution
  binomial_pmf_scalar(k: number, n: number, p: number): number;
  binomial_cdf_scalar(k: number, n: number, p: number): number;
  binomial_inv_scalar(prob: number, n: number, p: number): number;
  binomial_pmf_inplace(inputPtr: number, len: number, n: number, p: number, outputPtr: number): void;
  binomial_cdf_inplace(inputPtr: number, len: number, n: number, p: number, outputPtr: number): void;
  // Uniform distribution
  uniform_pdf_scalar(x: number, min: number, max: number): number;
  uniform_cdf_scalar(x: number, min: number, max: number): number;
  uniform_inv_scalar(p: number, min: number, max: number): number;
  uniform_pdf_inplace(inputPtr: number, len: number, min: number, max: number, outputPtr: number): void;
  uniform_cdf_inplace(inputPtr: number, len: number, min: number, max: number, outputPtr: number): void;
  // Cauchy distribution
  cauchy_pdf_scalar(x: number, location: number, scale: number): number;
  cauchy_cdf_scalar(x: number, location: number, scale: number): number;
  cauchy_inv_scalar(p: number, location: number, scale: number): number;
  cauchy_pdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  cauchy_cdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  // Laplace distribution
  laplace_pdf_scalar(x: number, location: number, scale: number): number;
  laplace_cdf_scalar(x: number, location: number, scale: number): number;
  laplace_inv_scalar(p: number, location: number, scale: number): number;
  laplace_pdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  laplace_cdf_inplace(inputPtr: number, len: number, location: number, scale: number, outputPtr: number): void;
  // Log-normal distribution
  lognormal_pdf_scalar(x: number, mean: number, sd: number): number;
  lognormal_cdf_scalar(x: number, mean: number, sd: number): number;
  lognormal_inv_scalar(p: number, mean: number, sd: number): number;
  lognormal_pdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  lognormal_cdf_inplace(inputPtr: number, len: number, mean: number, sd: number, outputPtr: number): void;
  // Weibull distribution
  weibull_pdf_scalar(x: number, shape: number, scale: number): number;
  weibull_cdf_scalar(x: number, shape: number, scale: number): number;
  weibull_inv_scalar(p: number, shape: number, scale: number): number;
  weibull_pdf_inplace(inputPtr: number, len: number, shape: number, scale: number, outputPtr: number): void;
  weibull_cdf_inplace(inputPtr: number, len: number, shape: number, scale: number, outputPtr: number): void;
  // Pareto distribution
  pareto_pdf_scalar(x: number, scale: number, shape: number): number;
  pareto_cdf_scalar(x: number, scale: number, shape: number): number;
  pareto_inv_scalar(p: number, scale: number, shape: number): number;
  pareto_pdf_inplace(inputPtr: number, len: number, scale: number, shape: number, outputPtr: number): void;
  pareto_cdf_inplace(inputPtr: number, len: number, scale: number, shape: number, outputPtr: number): void;
  // Triangular distribution
  triangular_pdf_scalar(x: number, min: number, max: number, mode: number): number;
  triangular_cdf_scalar(x: number, min: number, max: number, mode: number): number;
  triangular_inv_scalar(p: number, min: number, max: number, mode: number): number;
  triangular_pdf_inplace(inputPtr: number, len: number, min: number, max: number, mode: number, outputPtr: number): void;
  triangular_cdf_inplace(inputPtr: number, len: number, min: number, max: number, mode: number, outputPtr: number): void;
  // Inverse gamma distribution
  invgamma_pdf_scalar(x: number, shape: number, rate: number): number;
  invgamma_cdf_scalar(x: number, shape: number, rate: number): number;
  invgamma_inv_scalar(p: number, shape: number, rate: number): number;
  invgamma_pdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  invgamma_cdf_inplace(inputPtr: number, len: number, shape: number, rate: number, outputPtr: number): void;
  // Negative binomial distribution
  negbin_pmf_scalar(k: number, r: number, p: number): number;
  negbin_cdf_scalar(k: number, r: number, p: number): number;
  negbin_inv_scalar(prob: number, r: number, p: number): number;
  negbin_pmf_inplace(inputPtr: number, len: number, r: number, p: number, outputPtr: number): void;
  negbin_cdf_inplace(inputPtr: number, len: number, r: number, p: number, outputPtr: number): void;
}

/**
 * Quantiles WASM module interface (stat-wasm-quantiles).
 * Used by the /quantiles subpath export.
 */
export interface QuantilesWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  percentile_f64(ptr: number, len: number, k: number, exclusive: boolean): number;
  percentile_inclusive_f64(ptr: number, len: number, k: number): number;
  percentile_exclusive_f64(ptr: number, len: number, k: number): number;
  percentile_of_score_f64(ptr: number, len: number, score: number, strict: boolean): number;
  qscore_f64(ptr: number, len: number, score: number, strict: boolean): number;
  qtest_f64(ptr: number, len: number, score: number, q_lower: number, q_upper: number): boolean;
  quartiles_f64(ptr: number, len: number): QuartilesResult;
  iqr_f64(ptr: number, len: number): number;
  quantiles_f64(dataPtr: number, dataLen: number, qsPtr: number, qsLen: number): ArrayResult;
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
  histogram_edges_f64(dataPtr: number, dataLen: number, edgesPtr: number, edgesLen: number): ArrayResult;
  histogram_fixed_width_with_edges_f64(ptr: number, len: number, bins: number): HistogramWithEdgesResult;
  histogram_equal_frequency_with_edges_f64(ptr: number, len: number, bins: number): HistogramWithEdgesResult;
  histogram_auto_with_edges_f64(ptr: number, len: number, rule: number, binsOverride: number): HistogramWithEdgesResult;
  histogram_auto_with_edges_collapse_tails_f64(ptr: number, len: number, rule: number, binsOverride: number, k: number): HistogramWithEdgesResult;
  histogram_custom_with_edges_f64(dataPtr: number, dataLen: number, edgesPtr: number, edgesLen: number, clampOutside: boolean): HistogramWithEdgesResult;
}

/**
 * Correlation WASM module interface (stat-wasm-correlation).
 * Used by the /correlation subpath export.
 */
export interface CorrelationWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
  covariance_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
  corrcoeff_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
  spearmancoeff_f64(xPtr: number, xLen: number, yPtr: number, yLen: number): number;
}

/**
 * Tests WASM module interface (stat-wasm-tests).
 * Used by the /tests subpath export.
 */
export interface TestsWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
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
  regress_naive_residuals_inplace_f64(xPtr: number, xLen: number, yPtr: number, yLen: number, residualsOutPtr: number): RegressionCoeffs;
  regress_simd_residuals_inplace_f64(xPtr: number, xLen: number, yPtr: number, yLen: number, residualsOutPtr: number): RegressionCoeffs;
  regress_wasm_kernels_residuals_inplace_f64(xPtr: number, xLen: number, yPtr: number, yLen: number, residualsOutPtr: number): RegressionCoeffs;
  normalci_f64(alpha: number, mean: number, se: number): Float64Array;
  tci_f64(alpha: number, mean: number, stdev: number, n: number): Float64Array;
  anova_f_score_flat(dataPtr: number, lensPtr: number, numGroups: number): number;
  anova_flat(dataPtr: number, lensPtr: number, numGroups: number, outPtr: number): AnovaResult;
  chi_square_test(p1: number, p2: number, len: number, card1: number, card2: number, outPtr: number): ChiSquareResult;
  anova_f_score_categorical(gp: number, pv: number, len: number): number;
  anova_categorical(gp: number, vp: number, len: number, outPtr: number): AnovaResult;
  tukey_hsd_categorical(gp: number, vp: number, len: number, outPtr: number): number;
  alloc_f32(len: number): number;
  free_f32(ptr: number, len: number): void;
  alloc_i32(len: number): number;
  free_i32(ptr: number, len: number): void;
  regress_coeffs_f32(xPtr: number, xLen: number, yPtr: number, yLen: number): RegressionCoeffsF32;
  regress_simd_residuals_inplace_f32(xPtr: number, xLen: number, yPtr: number, yLen: number, residualsOutPtr: number): RegressionCoeffsF32;
}

/**
 * Full WASM module interface (stat-wasm).
 * Used by the root index.ts export.
 * Includes all functionality from all submodules.
 */
export interface FullWasmModule extends
  StatsWasmModule,
  Omit<DistributionsWasmModule, 'get_memory' | 'alloc_f64' | 'free_f64'>,
  Omit<
    QuantilesWasmModule,
    | 'get_memory'
    | 'alloc_f64'
    | 'free_f64'
    | 'histogram_f64'
  >,
  Omit<CorrelationWasmModule, 'get_memory' | 'alloc_f64' | 'free_f64'>,
  Omit<TestsWasmModule, 'get_memory' | 'alloc_f64' | 'free_f64' | 'alloc_f32' | 'free_f32'> {
  alloc_f32(len: number): number;
  free_f32(ptr: number, len: number): void;
  alloc_i32(len: number): number;
  free_i32(ptr: number, len: number): void;
}
