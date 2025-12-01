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
}

export class ChiSquareResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly statistic: number;
  readonly p_value: number;
  readonly df: number;
}

export class QuartilesResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly q1: number;
  readonly q2: number;
  readonly q3: number;
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

export function free_f64(ptr: number, len: number): void;

export function gamma_cdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function gamma_cdf_scalar(x: number, shape: number, rate: number): number;

export function gamma_inv_scalar(p: number, shape: number, rate: number): number;

export function gamma_pdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function gamma_pdf_scalar(x: number, shape: number, rate: number): number;

export function geomean_f64(ptr: number, len: number): number;

export function get_memory(): any;

export function histogram_edges_f64(data_ptr: number, data_len: number, edges_ptr: number, edges_len: number): ArrayResult;

export function histogram_f64(ptr: number, len: number, bin_count: number): ArrayResult;

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

export function regress_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

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
