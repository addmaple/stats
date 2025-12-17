/* tslint:disable */
/* eslint-disable */

export class AnovaResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly f_score: number;
  readonly df_between: number;
  readonly df_within: number;
}

export class ArrayResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly ptr: number;
  readonly len: number;
  readonly is_empty: boolean;
}

export class ChiSquareResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly statistic: number;
  readonly p_value: number;
  readonly df: number;
}

export class HistogramWithEdges {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly edges: ArrayResult;
  readonly counts: ArrayResult;
}

export class QuartilesResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly q1: number;
  readonly q2: number;
  readonly q3: number;
}

export class RegressionCoeffs {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
}

export class RegressionCoeffsF32 {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
}

export class RegressionResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
  readonly residuals: ArrayResult;
}

export class TestResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly statistic: number;
  readonly p_value: number;
  readonly df: number | undefined;
}

export class TukeyHsdResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get a specific comparison by index
   */
  get_comparison(index: number): TukeyPairResult | undefined;
  readonly num_groups: number;
  readonly df_within: number;
  readonly msw: number;
  readonly num_comparisons: number;
}

export class TukeyPairResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly group1: number;
  readonly group2: number;
  readonly mean_diff: number;
  readonly q_statistic: number;
  readonly p_value: number;
  readonly ci_lower: number;
  readonly ci_upper: number;
}

export function alloc_f32(len: number): number;

export function alloc_f64(len: number): number;

/**
 * ANOVA with categorical grouping - full result
 */
export function anova_categorical(groups: string[], values: Float64Array): AnovaResult;

/**
 * ANOVA F-score with categorical grouping
 * groups: categorical labels
 * values: numeric values corresponding to each label
 */
export function anova_f_score_categorical(groups: string[], values: Float64Array): number;

/**
 * ANOVA F-score for multiple groups using flat buffer approach
 * data_ptr: pointer to concatenated group data
 * lens_ptr: pointer to array of group lengths (as f64 for simplicity)
 * num_groups: number of groups
 */
export function anova_f_score_flat(data_ptr: number, lens_ptr: number, num_groups: number): number;

/**
 * ANOVA with full result (F-score + degrees of freedom)
 */
export function anova_flat(data_ptr: number, lens_ptr: number, num_groups: number): AnovaResult;

export function beta_cdf_inplace(input_ptr: number, len: number, alpha: number, beta: number, output_ptr: number): void;

export function beta_cdf_scalar(x: number, alpha: number, beta: number): number;

export function beta_inv_scalar(p: number, alpha: number, beta: number): number;

export function beta_pdf_inplace(input_ptr: number, len: number, alpha: number, beta: number, output_ptr: number): void;

export function beta_pdf_scalar(x: number, alpha: number, beta: number): number;

export function binomial_cdf_inplace(input_ptr: number, len: number, n: number, p: number, output_ptr: number): void;

export function binomial_cdf_scalar(x: number, n: number, p: number): number;

export function binomial_inv_scalar(prob: number, n: number, p: number): number;

export function binomial_pmf_inplace(input_ptr: number, len: number, n: number, p: number, output_ptr: number): void;

export function binomial_pmf_scalar(x: number, n: number, p: number): number;

export function cauchy_cdf_inplace(input_ptr: number, len: number, location: number, scale: number, output_ptr: number): void;

export function cauchy_cdf_scalar(x: number, location: number, scale: number): number;

export function cauchy_inv_scalar(p: number, location: number, scale: number): number;

export function cauchy_pdf_inplace(input_ptr: number, len: number, location: number, scale: number, output_ptr: number): void;

export function cauchy_pdf_scalar(x: number, location: number, scale: number): number;

/**
 * Chi-square test of independence for two categorical variables
 */
export function chi_square_test(cat1: string[], cat2: string[]): ChiSquareResult;

/**
 * Chi-square test with optional cardinality hints for optimization
 *
 * If cardinality1 and cardinality2 are provided (number of unique categories),
 * uses a faster array-based algorithm.
 */
export function chi_square_test_with_cardinality(cat1: string[], cat2: string[], cardinality1?: number | null, cardinality2?: number | null): ChiSquareResult;

export function chi_squared_cdf_inplace(input_ptr: number, len: number, dof: number, output_ptr: number): void;

export function chi_squared_cdf_scalar(x: number, dof: number): number;

export function chi_squared_inv_scalar(p: number, dof: number): number;

export function chi_squared_pdf_inplace(input_ptr: number, len: number, dof: number, output_ptr: number): void;

export function chi_squared_pdf_scalar(x: number, dof: number): number;

export function coeffvar_f64(ptr: number, len: number): number;

export function corrcoeff_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export function covariance_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export function cumprod_f64(ptr: number, len: number): ArrayResult;

export function cumsum_f64(ptr: number, len: number): ArrayResult;

export function deviation_f64(ptr: number, len: number): ArrayResult;

export function diff_f64(ptr: number, len: number): ArrayResult;

export function exponential_cdf_inplace(input_ptr: number, len: number, rate: number, output_ptr: number): void;

export function exponential_cdf_scalar(x: number, rate: number): number;

export function exponential_inv_scalar(p: number, rate: number): number;

export function exponential_pdf_inplace(input_ptr: number, len: number, rate: number, output_ptr: number): void;

export function exponential_pdf_scalar(x: number, rate: number): number;

export function fisher_f_cdf_inplace(input_ptr: number, len: number, df1: number, df2: number, output_ptr: number): void;

export function fisher_f_cdf_scalar(x: number, df1: number, df2: number): number;

export function fisher_f_inv_scalar(p: number, df1: number, df2: number): number;

export function fisher_f_pdf_inplace(input_ptr: number, len: number, df1: number, df2: number, output_ptr: number): void;

export function fisher_f_pdf_scalar(x: number, df1: number, df2: number): number;

export function free_f32(ptr: number, len: number): void;

export function free_f64(ptr: number, len: number): void;

export function gamma_cdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function gamma_cdf_scalar(x: number, shape: number, rate: number): number;

export function gamma_inv_scalar(p: number, shape: number, rate: number): number;

export function gamma_pdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function gamma_pdf_scalar(x: number, shape: number, rate: number): number;

export function geomean_f64(ptr: number, len: number): number;

export function get_memory(): any;

/**
 * Calculate histogram with automatic binning and tail collapse, returning edges and counts.
 * rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
 * bins_override: 0 means use rule's default, otherwise override
 * k: IQR multiplier for outlier detection (typically 1.5)
 */
export function histogram_auto_with_edges_collapse_tails_f64(ptr: number, len: number, rule: number, bins_override: number, k: number): HistogramWithEdges;

/**
 * Calculate histogram with automatic binning, returning edges and counts.
 * rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
 * bins_override: 0 means use rule's default, otherwise override
 */
export function histogram_auto_with_edges_f64(ptr: number, len: number, rule: number, bins_override: number): HistogramWithEdges;

/**
 * Calculate histogram with custom edges, returning edges and counts.
 * clamp_outside: if true, values outside edges are clamped to first/last bin
 */
export function histogram_custom_with_edges_f64(data_ptr: number, data_len: number, edges_ptr: number, edges_len: number, clamp_outside: boolean): HistogramWithEdges;

export function histogram_edges_f64(data_ptr: number, data_len: number, edges_ptr: number, edges_len: number): ArrayResult;

/**
 * Calculate histogram with equal-frequency binning, returning edges and counts.
 */
export function histogram_equal_frequency_with_edges_f64(ptr: number, len: number, bins: number): HistogramWithEdges;

export function histogram_f64(ptr: number, len: number, bin_count: number): ArrayResult;

/**
 * Calculate histogram with fixed-width binning, returning edges and counts.
 */
export function histogram_fixed_width_with_edges_f64(ptr: number, len: number, bins: number): HistogramWithEdges;

export function invgamma_cdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function invgamma_cdf_scalar(x: number, shape: number, rate: number): number;

export function invgamma_inv_scalar(p: number, shape: number, rate: number): number;

export function invgamma_pdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function invgamma_pdf_scalar(x: number, shape: number, rate: number): number;

export function iqr_f64(ptr: number, len: number): number;

export function kurtosis_f64(ptr: number, len: number): number;

export function laplace_cdf_inplace(input_ptr: number, len: number, location: number, scale: number, output_ptr: number): void;

export function laplace_cdf_scalar(x: number, location: number, scale: number): number;

export function laplace_inv_scalar(p: number, location: number, scale: number): number;

export function laplace_pdf_inplace(input_ptr: number, len: number, location: number, scale: number, output_ptr: number): void;

export function laplace_pdf_scalar(x: number, location: number, scale: number): number;

export function lognormal_cdf_inplace(input_ptr: number, len: number, mean: number, sd: number, output_ptr: number): void;

export function lognormal_cdf_scalar(x: number, mean: number, sd: number): number;

export function lognormal_inv_scalar(p: number, mean: number, sd: number): number;

export function lognormal_pdf_inplace(input_ptr: number, len: number, mean: number, sd: number, output_ptr: number): void;

export function lognormal_pdf_scalar(x: number, mean: number, sd: number): number;

export function max_f64(ptr: number, len: number): number;

export function mean_f64(ptr: number, len: number): number;

export function mean_f64_direct(ptr: number, len: number): number;

export function meandev_f64(ptr: number, len: number): number;

export function meddev_f64(ptr: number, len: number): number;

export function median_f64(ptr: number, len: number): number;

export function min_f64(ptr: number, len: number): number;

export function mode_f64(ptr: number, len: number): number;

export function negbin_cdf_inplace(input_ptr: number, len: number, r: number, p: number, output_ptr: number): void;

export function negbin_cdf_scalar(x: number, r: number, p: number): number;

export function negbin_inv_scalar(prob: number, r: number, p: number): number;

export function negbin_pmf_inplace(input_ptr: number, len: number, r: number, p: number, output_ptr: number): void;

export function negbin_pmf_scalar(x: number, r: number, p: number): number;

export function normal_cdf_inplace(input_ptr: number, len: number, mean: number, sd: number, output_ptr: number): void;

export function normal_cdf_scalar(x: number, mean: number, sd: number): number;

export function normal_inv_scalar(p: number, mean: number, sd: number): number;

export function normal_pdf_inplace(input_ptr: number, len: number, mean: number, sd: number, output_ptr: number): void;

export function normal_pdf_scalar(x: number, mean: number, sd: number): number;

export function normalci_f64(alpha: number, mean: number, se: number): Float64Array;

export function pareto_cdf_inplace(input_ptr: number, len: number, scale: number, shape: number, output_ptr: number): void;

export function pareto_cdf_scalar(x: number, scale: number, shape: number): number;

export function pareto_inv_scalar(p: number, scale: number, shape: number): number;

export function pareto_pdf_inplace(input_ptr: number, len: number, scale: number, shape: number, output_ptr: number): void;

export function pareto_pdf_scalar(x: number, scale: number, shape: number): number;

export function percentile_exclusive_f64(ptr: number, len: number, k: number): number;

export function percentile_f64(ptr: number, len: number, k: number, exclusive: boolean): number;

export function percentile_inclusive_f64(ptr: number, len: number, k: number): number;

export function percentile_of_score_f64(ptr: number, len: number, score: number, strict: boolean): number;

export function poisson_cdf_inplace(input_ptr: number, len: number, lambda: number, output_ptr: number): void;

export function poisson_cdf_scalar(x: number, lambda: number): number;

export function poisson_inv_scalar(p: number, lambda: number): number;

export function poisson_pmf_inplace(input_ptr: number, len: number, lambda: number, output_ptr: number): void;

export function poisson_pmf_scalar(x: number, lambda: number): number;

export function pooledstdev_f64(data1_ptr: number, data1_len: number, data2_ptr: number, data2_len: number): number;

export function pooledvariance_f64(data1_ptr: number, data1_len: number, data2_ptr: number, data2_len: number): number;

export function product_f64(ptr: number, len: number): number;

export function qscore_f64(ptr: number, len: number, score: number, strict: boolean): number;

export function qtest_f64(ptr: number, len: number, score: number, q_lower: number, q_upper: number): boolean;

export function quantiles_f64(data_ptr: number, data_len: number, qs_ptr: number, qs_len: number): ArrayResult;

export function quartiles_f64(ptr: number, len: number): QuartilesResult;

export function range_f64(ptr: number, len: number): number;

export function rank_f64(ptr: number, len: number): ArrayResult;

export function regress_coeffs_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionCoeffs;

export function regress_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function regress_naive_coeffs_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionCoeffs;

export function regress_naive_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function regress_naive_residuals_inplace_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number, residuals_out_ptr: number): RegressionCoeffs;

export function regress_simd_coeffs_f32(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionCoeffsF32;

export function regress_simd_coeffs_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionCoeffs;

export function regress_simd_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function regress_simd_residuals_inplace_f32(x_ptr: number, x_len: number, y_ptr: number, y_len: number, residuals_out_ptr: number): RegressionCoeffsF32;

export function regress_simd_residuals_inplace_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number, residuals_out_ptr: number): RegressionCoeffs;

export function regress_wasm_kernels_coeffs_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionCoeffs;

export function regress_wasm_kernels_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function regress_wasm_kernels_residuals_inplace_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number, residuals_out_ptr: number): RegressionCoeffs;

export function sample_stdev_f64(ptr: number, len: number): number;

export function sample_stdev_f64_direct(ptr: number, len: number): number;

export function sample_variance_f64(ptr: number, len: number): number;

export function sample_variance_f64_direct(ptr: number, len: number): number;

export function skewness_f64(ptr: number, len: number): number;

export function spearmancoeff_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export function stan_moment_f64(ptr: number, len: number, k: number): number;

export function stdev_f64(ptr: number, len: number): number;

export function stdev_f64_direct(ptr: number, len: number): number;

export function student_t_cdf_inplace(input_ptr: number, len: number, mean: number, scale: number, dof: number, output_ptr: number): void;

export function student_t_cdf_scalar(x: number, mean: number, scale: number, dof: number): number;

export function student_t_inv_scalar(p: number, mean: number, scale: number, dof: number): number;

export function student_t_pdf_inplace(input_ptr: number, len: number, mean: number, scale: number, dof: number, output_ptr: number): void;

export function student_t_pdf_scalar(x: number, mean: number, scale: number, dof: number): number;

export function sum_f64(ptr: number, len: number): number;

export function sum_f64_direct(ptr: number, len: number): number;

export function tci_f64(alpha: number, mean: number, stdev: number, n: number): Float64Array;

export function triangular_cdf_inplace(input_ptr: number, len: number, min: number, max: number, mode: number, output_ptr: number): void;

export function triangular_cdf_scalar(x: number, min: number, max: number, mode: number): number;

export function triangular_inv_scalar(p: number, min: number, max: number, mode: number): number;

export function triangular_pdf_inplace(input_ptr: number, len: number, min: number, max: number, mode: number, output_ptr: number): void;

export function triangular_pdf_scalar(x: number, min: number, max: number, mode: number): number;

export function ttest_f64(data_ptr: number, len: number, mu0: number): TestResult;

/**
 * Tukey HSD test with categorical grouping
 */
export function tukey_hsd_categorical(groups: string[], values: Float64Array): TukeyHsdResult;

/**
 * Tukey HSD test using flat buffer approach (same as ANOVA)
 * data_ptr: pointer to concatenated group data
 * lens_ptr: pointer to array of group lengths (as f64)
 * num_groups: number of groups
 */
export function tukey_hsd_flat(data_ptr: number, lens_ptr: number, num_groups: number): TukeyHsdResult;

export function uniform_cdf_inplace(input_ptr: number, len: number, min: number, max: number, output_ptr: number): void;

export function uniform_cdf_scalar(x: number, min: number, max: number): number;

export function uniform_inv_scalar(p: number, min: number, max: number): number;

export function uniform_pdf_inplace(input_ptr: number, len: number, min: number, max: number, output_ptr: number): void;

export function uniform_pdf_scalar(x: number, min: number, max: number): number;

export function variance_f64(ptr: number, len: number): number;

export function variance_f64_direct(ptr: number, len: number): number;

export function weibull_cdf_inplace(input_ptr: number, len: number, shape: number, scale: number, output_ptr: number): void;

export function weibull_cdf_scalar(x: number, shape: number, scale: number): number;

export function weibull_inv_scalar(p: number, shape: number, scale: number): number;

export function weibull_pdf_inplace(input_ptr: number, len: number, shape: number, scale: number, output_ptr: number): void;

export function weibull_pdf_scalar(x: number, shape: number, scale: number): number;

export function ztest_f64(data_ptr: number, len: number, mu0: number, sigma: number): TestResult;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_arrayresult_free: (a: number, b: number) => void;
  readonly arrayresult_ptr: (a: number) => number;
  readonly arrayresult_len: (a: number) => number;
  readonly arrayresult_is_empty: (a: number) => number;
  readonly alloc_f64: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
  readonly alloc_f32: (a: number) => number;
  readonly free_f32: (a: number, b: number) => void;
  readonly sum_f64: (a: number, b: number) => number;
  readonly mean_f64: (a: number, b: number) => number;
  readonly variance_f64: (a: number, b: number) => number;
  readonly sample_variance_f64: (a: number, b: number) => number;
  readonly stdev_f64: (a: number, b: number) => number;
  readonly sample_stdev_f64: (a: number, b: number) => number;
  readonly min_f64: (a: number, b: number) => number;
  readonly max_f64: (a: number, b: number) => number;
  readonly product_f64: (a: number, b: number) => number;
  readonly range_f64: (a: number, b: number) => number;
  readonly median_f64: (a: number, b: number) => number;
  readonly mode_f64: (a: number, b: number) => number;
  readonly geomean_f64: (a: number, b: number) => number;
  readonly skewness_f64: (a: number, b: number) => number;
  readonly kurtosis_f64: (a: number, b: number) => number;
  readonly covariance_f64: (a: number, b: number, c: number, d: number) => number;
  readonly corrcoeff_f64: (a: number, b: number, c: number, d: number) => number;
  readonly cumsum_f64: (a: number, b: number) => number;
  readonly diff_f64: (a: number, b: number) => number;
  readonly rank_f64: (a: number, b: number) => number;
  readonly cumprod_f64: (a: number, b: number) => number;
  readonly coeffvar_f64: (a: number, b: number) => number;
  readonly deviation_f64: (a: number, b: number) => number;
  readonly meandev_f64: (a: number, b: number) => number;
  readonly meddev_f64: (a: number, b: number) => number;
  readonly pooledvariance_f64: (a: number, b: number, c: number, d: number) => number;
  readonly pooledstdev_f64: (a: number, b: number, c: number, d: number) => number;
  readonly stan_moment_f64: (a: number, b: number, c: number) => number;
  readonly spearmancoeff_f64: (a: number, b: number, c: number, d: number) => number;
  readonly percentile_of_score_f64: (a: number, b: number, c: number, d: number) => number;
  readonly qscore_f64: (a: number, b: number, c: number, d: number) => number;
  readonly qtest_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly percentile_f64: (a: number, b: number, c: number, d: number) => number;
  readonly percentile_inclusive_f64: (a: number, b: number, c: number) => number;
  readonly percentile_exclusive_f64: (a: number, b: number, c: number) => number;
  readonly quartilesresult_q3: (a: number) => number;
  readonly quartiles_f64: (a: number, b: number) => number;
  readonly iqr_f64: (a: number, b: number) => number;
  readonly quantiles_f64: (a: number, b: number, c: number, d: number) => number;
  readonly histogram_f64: (a: number, b: number, c: number) => number;
  readonly histogram_edges_f64: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_histogramwithedges_free: (a: number, b: number) => void;
  readonly histogramwithedges_edges: (a: number) => number;
  readonly histogramwithedges_counts: (a: number) => number;
  readonly histogram_fixed_width_with_edges_f64: (a: number, b: number, c: number) => number;
  readonly histogram_equal_frequency_with_edges_f64: (a: number, b: number, c: number) => number;
  readonly histogram_auto_with_edges_f64: (a: number, b: number, c: number, d: number) => number;
  readonly histogram_auto_with_edges_collapse_tails_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly histogram_custom_with_edges_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly __wbg_anovaresult_free: (a: number, b: number) => void;
  readonly anovaresult_f_score: (a: number) => number;
  readonly anovaresult_df_between: (a: number) => number;
  readonly anovaresult_df_within: (a: number) => number;
  readonly anova_f_score_flat: (a: number, b: number, c: number) => number;
  readonly anova_flat: (a: number, b: number, c: number) => number;
  readonly __wbg_chisquareresult_free: (a: number, b: number) => void;
  readonly chisquareresult_p_value: (a: number) => number;
  readonly chisquareresult_df: (a: number) => number;
  readonly chi_square_test: (a: number, b: number, c: number, d: number) => number;
  readonly chi_square_test_with_cardinality: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly anova_f_score_categorical: (a: number, b: number, c: number, d: number) => number;
  readonly anova_categorical: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_tukeypairresult_free: (a: number, b: number) => void;
  readonly tukeypairresult_group1: (a: number) => number;
  readonly tukeypairresult_group2: (a: number) => number;
  readonly tukeypairresult_ci_upper: (a: number) => number;
  readonly __wbg_tukeyhsdresult_free: (a: number, b: number) => void;
  readonly tukeyhsdresult_num_groups: (a: number) => number;
  readonly tukeyhsdresult_df_within: (a: number) => number;
  readonly tukeyhsdresult_num_comparisons: (a: number) => number;
  readonly tukeyhsdresult_get_comparison: (a: number, b: number) => number;
  readonly tukey_hsd_flat: (a: number, b: number, c: number) => number;
  readonly tukey_hsd_categorical: (a: number, b: number, c: number, d: number) => number;
  readonly normal_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly normal_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly normal_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly normal_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly normal_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly gamma_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly gamma_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly gamma_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly gamma_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly gamma_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly beta_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly beta_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly beta_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly beta_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly beta_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly student_t_pdf_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly student_t_cdf_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly student_t_inv_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly student_t_pdf_inplace: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly student_t_cdf_inplace: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly chi_squared_pdf_scalar: (a: number, b: number) => [number, number, number];
  readonly chi_squared_cdf_scalar: (a: number, b: number) => [number, number, number];
  readonly chi_squared_inv_scalar: (a: number, b: number) => [number, number, number];
  readonly chi_squared_pdf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly chi_squared_cdf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly fisher_f_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly fisher_f_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly fisher_f_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly fisher_f_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly fisher_f_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly exponential_pdf_scalar: (a: number, b: number) => [number, number, number];
  readonly exponential_cdf_scalar: (a: number, b: number) => [number, number, number];
  readonly exponential_inv_scalar: (a: number, b: number) => [number, number, number];
  readonly exponential_pdf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly exponential_cdf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly poisson_pmf_scalar: (a: number, b: number) => [number, number, number];
  readonly poisson_cdf_scalar: (a: number, b: number) => [number, number, number];
  readonly poisson_inv_scalar: (a: number, b: number) => [number, number, number];
  readonly poisson_pmf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly poisson_cdf_inplace: (a: number, b: number, c: number, d: number) => [number, number];
  readonly binomial_pmf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly binomial_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly binomial_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly binomial_pmf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly binomial_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly uniform_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly uniform_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly uniform_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly uniform_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly uniform_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly cauchy_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly cauchy_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly cauchy_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly cauchy_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly cauchy_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly laplace_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly laplace_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly laplace_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly laplace_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly laplace_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly lognormal_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly lognormal_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly lognormal_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly lognormal_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly lognormal_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly weibull_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly weibull_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly weibull_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly weibull_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly weibull_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly pareto_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly pareto_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly pareto_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly pareto_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly pareto_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly triangular_pdf_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly triangular_cdf_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly triangular_inv_scalar: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly triangular_pdf_inplace: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly triangular_cdf_inplace: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
  readonly invgamma_pdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly invgamma_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly invgamma_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly invgamma_pdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly invgamma_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly negbin_pmf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly negbin_cdf_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly negbin_inv_scalar: (a: number, b: number, c: number) => [number, number, number];
  readonly negbin_pmf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly negbin_cdf_inplace: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly testresult_p_value: (a: number) => number;
  readonly testresult_df: (a: number) => [number, number];
  readonly ttest_f64: (a: number, b: number, c: number) => number;
  readonly ztest_f64: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_regressionresult_free: (a: number, b: number) => void;
  readonly regressionresult_residuals: (a: number) => number;
  readonly __wbg_regressioncoeffsf32_free: (a: number, b: number) => void;
  readonly regressioncoeffsf32_slope: (a: number) => number;
  readonly regressioncoeffsf32_intercept: (a: number) => number;
  readonly regressioncoeffsf32_r_squared: (a: number) => number;
  readonly regress_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_naive_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_simd_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_wasm_kernels_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_coeffs_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_naive_coeffs_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_wasm_kernels_coeffs_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regress_simd_residuals_inplace_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly regress_wasm_kernels_residuals_inplace_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly regress_naive_residuals_inplace_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly regress_simd_coeffs_f32: (a: number, b: number, c: number, d: number) => number;
  readonly regress_simd_residuals_inplace_f32: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly normalci_f64: (a: number, b: number, c: number) => [number, number];
  readonly tci_f64: (a: number, b: number, c: number, d: number) => [number, number];
  readonly regress_simd_coeffs_f64: (a: number, b: number, c: number, d: number) => number;
  readonly get_memory: () => any;
  readonly sum_f64_direct: (a: number, b: number) => number;
  readonly mean_f64_direct: (a: number, b: number) => number;
  readonly variance_f64_direct: (a: number, b: number) => number;
  readonly sample_variance_f64_direct: (a: number, b: number) => number;
  readonly stdev_f64_direct: (a: number, b: number) => number;
  readonly sample_stdev_f64_direct: (a: number, b: number) => number;
  readonly quartilesresult_q1: (a: number) => number;
  readonly chisquareresult_statistic: (a: number) => number;
  readonly quartilesresult_q2: (a: number) => number;
  readonly tukeypairresult_mean_diff: (a: number) => number;
  readonly tukeypairresult_q_statistic: (a: number) => number;
  readonly tukeypairresult_p_value: (a: number) => number;
  readonly tukeyhsdresult_msw: (a: number) => number;
  readonly testresult_statistic: (a: number) => number;
  readonly tukeypairresult_ci_lower: (a: number) => number;
  readonly regressionresult_slope: (a: number) => number;
  readonly regressionresult_intercept: (a: number) => number;
  readonly regressionresult_r_squared: (a: number) => number;
  readonly regressioncoeffs_slope: (a: number) => number;
  readonly regressioncoeffs_intercept: (a: number) => number;
  readonly regressioncoeffs_r_squared: (a: number) => number;
  readonly __wbg_quartilesresult_free: (a: number, b: number) => void;
  readonly __wbg_testresult_free: (a: number, b: number) => void;
  readonly __wbg_regressioncoeffs_free: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_alloc: () => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
