/* tslint:disable */
/* eslint-disable */

export class ArrayResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly ptr: number;
  readonly len: number;
  readonly is_empty: boolean;
}

export function alloc_f64(len: number): number;

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

export function chi_squared_cdf_inplace(input_ptr: number, len: number, dof: number, output_ptr: number): void;

export function chi_squared_cdf_scalar(x: number, dof: number): number;

export function chi_squared_inv_scalar(p: number, dof: number): number;

export function chi_squared_pdf_inplace(input_ptr: number, len: number, dof: number, output_ptr: number): void;

export function chi_squared_pdf_scalar(x: number, dof: number): number;

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

export function get_memory(): any;

export function invgamma_cdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function invgamma_cdf_scalar(x: number, shape: number, rate: number): number;

export function invgamma_inv_scalar(p: number, shape: number, rate: number): number;

export function invgamma_pdf_inplace(input_ptr: number, len: number, shape: number, rate: number, output_ptr: number): void;

export function invgamma_pdf_scalar(x: number, shape: number, rate: number): number;

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

export function pareto_cdf_inplace(input_ptr: number, len: number, scale: number, shape: number, output_ptr: number): void;

export function pareto_cdf_scalar(x: number, scale: number, shape: number): number;

export function pareto_inv_scalar(p: number, scale: number, shape: number): number;

export function pareto_pdf_inplace(input_ptr: number, len: number, scale: number, shape: number, output_ptr: number): void;

export function pareto_pdf_scalar(x: number, scale: number, shape: number): number;

export function poisson_cdf_inplace(input_ptr: number, len: number, lambda: number, output_ptr: number): void;

export function poisson_cdf_scalar(x: number, lambda: number): number;

export function poisson_inv_scalar(p: number, lambda: number): number;

export function poisson_pmf_inplace(input_ptr: number, len: number, lambda: number, output_ptr: number): void;

export function poisson_pmf_scalar(x: number, lambda: number): number;

export function student_t_cdf_inplace(input_ptr: number, len: number, mean: number, scale: number, dof: number, output_ptr: number): void;

export function student_t_cdf_scalar(x: number, mean: number, scale: number, dof: number): number;

export function student_t_inv_scalar(p: number, mean: number, scale: number, dof: number): number;

export function student_t_pdf_inplace(input_ptr: number, len: number, mean: number, scale: number, dof: number, output_ptr: number): void;

export function student_t_pdf_scalar(x: number, mean: number, scale: number, dof: number): number;

export function triangular_cdf_inplace(input_ptr: number, len: number, min: number, max: number, mode: number, output_ptr: number): void;

export function triangular_cdf_scalar(x: number, min: number, max: number, mode: number): number;

export function triangular_inv_scalar(p: number, min: number, max: number, mode: number): number;

export function triangular_pdf_inplace(input_ptr: number, len: number, min: number, max: number, mode: number, output_ptr: number): void;

export function triangular_pdf_scalar(x: number, min: number, max: number, mode: number): number;

export function uniform_cdf_inplace(input_ptr: number, len: number, min: number, max: number, output_ptr: number): void;

export function uniform_cdf_scalar(x: number, min: number, max: number): number;

export function uniform_inv_scalar(p: number, min: number, max: number): number;

export function uniform_pdf_inplace(input_ptr: number, len: number, min: number, max: number, output_ptr: number): void;

export function uniform_pdf_scalar(x: number, min: number, max: number): number;

export function weibull_cdf_inplace(input_ptr: number, len: number, shape: number, scale: number, output_ptr: number): void;

export function weibull_cdf_scalar(x: number, shape: number, scale: number): number;

export function weibull_inv_scalar(p: number, shape: number, scale: number): number;

export function weibull_pdf_inplace(input_ptr: number, len: number, shape: number, scale: number, output_ptr: number): void;

export function weibull_pdf_scalar(x: number, shape: number, scale: number): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_arrayresult_free: (a: number, b: number) => void;
  readonly arrayresult_ptr: (a: number) => number;
  readonly arrayresult_len: (a: number) => number;
  readonly arrayresult_is_empty: (a: number) => number;
  readonly get_memory: () => any;
  readonly alloc_f64: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
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
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
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
