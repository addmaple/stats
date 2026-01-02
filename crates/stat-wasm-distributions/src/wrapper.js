import { wasmExports, alloc, free } from './core.js';

export * from './core.js';

export function get_memory() {
  return wasmExports().memory;
}

export function alloc_f64(len) {
  return alloc(len * 8);
}

export function free_f64(ptr, len) {
  free(ptr, len * 8);
}

// Distribution functions
export function normal_pdf_scalar(x, mean, sd) { return wasmExports().normal_pdf_scalar(x, mean, sd); }
export function normal_cdf_scalar(x, mean, sd) { return wasmExports().normal_cdf_scalar(x, mean, sd); }
export function normal_inv_scalar(p, mean, sd) { return wasmExports().normal_inv_scalar(p, mean, sd); }
export function normal_pdf_inplace(inputPtr, len, mean, sd, outputPtr) { wasmExports().normal_pdf_inplace(inputPtr, len, mean, sd, outputPtr); }
export function normal_cdf_inplace(inputPtr, len, mean, sd, outputPtr) { wasmExports().normal_cdf_inplace(inputPtr, len, mean, sd, outputPtr); }

export function gamma_pdf_scalar(x, shape, rate) { return wasmExports().gamma_pdf_scalar(x, shape, rate); }
export function gamma_cdf_scalar(x, shape, rate) { return wasmExports().gamma_cdf_scalar(x, shape, rate); }
export function gamma_inv_scalar(p, shape, rate) { return wasmExports().gamma_inv_scalar(p, shape, rate); }
export function gamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr) { wasmExports().gamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr); }
export function gamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr) { wasmExports().gamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr); }

export function beta_pdf_scalar(x, alpha, beta) { return wasmExports().beta_pdf_scalar(x, alpha, beta); }
export function beta_cdf_scalar(x, alpha, beta) { return wasmExports().beta_cdf_scalar(x, alpha, beta); }
export function beta_inv_scalar(p, alpha, beta) { return wasmExports().beta_inv_scalar(p, alpha, beta); }
export function beta_pdf_inplace(inputPtr, len, alpha, beta, outputPtr) { wasmExports().beta_pdf_inplace(inputPtr, len, alpha, beta, outputPtr); }
export function beta_cdf_inplace(inputPtr, len, alpha, beta, outputPtr) { wasmExports().beta_cdf_inplace(inputPtr, len, alpha, beta, outputPtr); }

export function student_t_pdf_scalar(x, mean, scale, dof) { return wasmExports().student_t_pdf_scalar(x, mean, scale, dof); }
export function student_t_cdf_scalar(x, mean, scale, dof) { return wasmExports().student_t_cdf_scalar(x, mean, scale, dof); }
export function student_t_inv_scalar(p, mean, scale, dof) { return wasmExports().student_t_inv_scalar(p, mean, scale, dof); }
export function student_t_pdf_inplace(inputPtr, len, mean, scale, dof, outputPtr) { wasmExports().student_t_pdf_inplace(inputPtr, len, mean, scale, dof, outputPtr); }
export function student_t_cdf_inplace(inputPtr, len, mean, scale, dof, outputPtr) { wasmExports().student_t_cdf_inplace(inputPtr, len, mean, scale, dof, outputPtr); }

export function chi_squared_pdf_scalar(x, dof) { return wasmExports().chi_squared_pdf_scalar(x, dof); }
export function chi_squared_cdf_scalar(x, dof) { return wasmExports().chi_squared_cdf_scalar(x, dof); }
export function chi_squared_inv_scalar(p, dof) { return wasmExports().chi_squared_inv_scalar(p, dof); }
export function chi_squared_pdf_inplace(inputPtr, len, dof, outputPtr) { wasmExports().chi_squared_pdf_inplace(inputPtr, len, dof, outputPtr); }
export function chi_squared_cdf_inplace(inputPtr, len, dof, outputPtr) { wasmExports().chi_squared_cdf_inplace(inputPtr, len, dof, outputPtr); }

export function fisher_f_pdf_scalar(x, df1, df2) { return wasmExports().fisher_f_pdf_scalar(x, df1, df2); }
export function fisher_f_cdf_scalar(x, df1, df2) { return wasmExports().fisher_f_cdf_scalar(x, df1, df2); }
export function fisher_f_inv_scalar(p, df1, df2) { return wasmExports().fisher_f_inv_scalar(p, df1, df2); }
export function fisher_f_pdf_inplace(inputPtr, len, df1, df2, outputPtr) { wasmExports().fisher_f_pdf_inplace(inputPtr, len, df1, df2, outputPtr); }
export function fisher_f_cdf_inplace(inputPtr, len, df1, df2, outputPtr) { wasmExports().fisher_f_cdf_inplace(inputPtr, len, df1, df2, outputPtr); }

export function exponential_pdf_scalar(x, rate) { return wasmExports().exponential_pdf_scalar(x, rate); }
export function exponential_cdf_scalar(x, rate) { return wasmExports().exponential_cdf_scalar(x, rate); }
export function exponential_inv_scalar(p, rate) { return wasmExports().exponential_inv_scalar(p, rate); }
export function exponential_pdf_inplace(inputPtr, len, rate, outputPtr) { wasmExports().exponential_pdf_inplace(inputPtr, len, rate, outputPtr); }
export function exponential_cdf_inplace(inputPtr, len, rate, outputPtr) { wasmExports().exponential_cdf_inplace(inputPtr, len, rate, outputPtr); }

export function poisson_pmf_scalar(k, lambda) { return wasmExports().poisson_pmf_scalar(k, lambda); }
export function poisson_cdf_scalar(k, lambda) { return wasmExports().poisson_cdf_scalar(k, lambda); }
export function poisson_inv_scalar(p, lambda) { return wasmExports().poisson_inv_scalar(p, lambda); }
export function poisson_pmf_inplace(inputPtr, len, lambda, outputPtr) { wasmExports().poisson_pmf_inplace(inputPtr, len, lambda, outputPtr); }
export function poisson_cdf_inplace(inputPtr, len, lambda, outputPtr) { wasmExports().poisson_cdf_inplace(inputPtr, len, lambda, outputPtr); }

export function binomial_pmf_scalar(k, n, p) { return wasmExports().binomial_pmf_scalar(k, n, p); }
export function binomial_cdf_scalar(k, n, p) { return wasmExports().binomial_cdf_scalar(k, n, p); }
export function binomial_inv_scalar(prob, n, p) { return wasmExports().binomial_inv_scalar(prob, n, p); }
export function binomial_pmf_inplace(inputPtr, len, n, p, outputPtr) { wasmExports().binomial_pmf_inplace(inputPtr, len, n, p, outputPtr); }
export function binomial_cdf_inplace(inputPtr, len, n, p, outputPtr) { wasmExports().binomial_cdf_inplace(inputPtr, len, n, p, outputPtr); }

export function uniform_pdf_scalar(x, min, max) { return wasmExports().uniform_pdf_scalar(x, min, max); }
export function uniform_cdf_scalar(x, min, max) { return wasmExports().uniform_cdf_scalar(x, min, max); }
export function uniform_inv_scalar(p, min, max) { return wasmExports().uniform_inv_scalar(p, min, max); }
export function uniform_pdf_inplace(inputPtr, len, min, max, outputPtr) { wasmExports().uniform_pdf_inplace(inputPtr, len, min, max, outputPtr); }
export function uniform_cdf_inplace(inputPtr, len, min, max, outputPtr) { wasmExports().uniform_cdf_inplace(inputPtr, len, min, max, outputPtr); }

export function cauchy_pdf_scalar(x, location, scale) { return wasmExports().cauchy_pdf_scalar(x, location, scale); }
export function cauchy_cdf_scalar(x, location, scale) { return wasmExports().cauchy_cdf_scalar(x, location, scale); }
export function cauchy_inv_scalar(p, location, scale) { return wasmExports().cauchy_inv_scalar(p, location, scale); }
export function cauchy_pdf_inplace(inputPtr, len, location, scale, outputPtr) { wasmExports().cauchy_pdf_inplace(inputPtr, len, location, scale, outputPtr); }
export function cauchy_cdf_inplace(inputPtr, len, location, scale, outputPtr) { wasmExports().cauchy_cdf_inplace(inputPtr, len, location, scale, outputPtr); }

export function laplace_pdf_scalar(x, location, scale) { return wasmExports().laplace_pdf_scalar(x, location, scale); }
export function laplace_cdf_scalar(x, location, scale) { return wasmExports().laplace_cdf_scalar(x, location, scale); }
export function laplace_inv_scalar(p, location, scale) { return wasmExports().laplace_inv_scalar(p, location, scale); }
export function laplace_pdf_inplace(inputPtr, len, location, scale, outputPtr) { wasmExports().laplace_pdf_inplace(inputPtr, len, location, scale, outputPtr); }
export function laplace_cdf_inplace(inputPtr, len, location, scale, outputPtr) { wasmExports().laplace_cdf_inplace(inputPtr, len, location, scale, outputPtr); }

export function lognormal_pdf_scalar(x, mean, sd) { return wasmExports().lognormal_pdf_scalar(x, mean, sd); }
export function lognormal_cdf_scalar(x, mean, sd) { return wasmExports().lognormal_cdf_scalar(x, mean, sd); }
export function lognormal_inv_scalar(p, mean, sd) { return wasmExports().lognormal_inv_scalar(p, mean, sd); }
export function lognormal_pdf_inplace(inputPtr, len, mean, sd, outputPtr) { wasmExports().lognormal_pdf_inplace(inputPtr, len, mean, sd, outputPtr); }
export function lognormal_cdf_inplace(inputPtr, len, mean, sd, outputPtr) { wasmExports().lognormal_cdf_inplace(inputPtr, len, mean, sd, outputPtr); }

export function weibull_pdf_scalar(x, shape, scale) { return wasmExports().weibull_pdf_scalar(x, shape, scale); }
export function weibull_cdf_scalar(x, shape, scale) { return wasmExports().weibull_cdf_scalar(x, shape, scale); }
export function weibull_inv_scalar(p, shape, scale) { return wasmExports().weibull_inv_scalar(p, shape, scale); }
export function weibull_pdf_inplace(inputPtr, len, shape, scale, outputPtr) { wasmExports().weibull_pdf_inplace(inputPtr, len, shape, scale, outputPtr); }
export function weibull_cdf_inplace(inputPtr, len, shape, scale, outputPtr) { wasmExports().weibull_cdf_inplace(inputPtr, len, shape, scale, outputPtr); }

export function pareto_pdf_scalar(x, scale, shape) { return wasmExports().pareto_pdf_scalar(x, scale, shape); }
export function pareto_cdf_scalar(x, scale, shape) { return wasmExports().pareto_cdf_scalar(x, scale, shape); }
export function pareto_inv_scalar(p, scale, shape) { return wasmExports().pareto_inv_scalar(p, scale, shape); }
export function pareto_pdf_inplace(inputPtr, len, scale, shape, outputPtr) { wasmExports().pareto_pdf_inplace(inputPtr, len, scale, shape, outputPtr); }
export function pareto_cdf_inplace(inputPtr, len, scale, shape, outputPtr) { wasmExports().pareto_cdf_inplace(inputPtr, len, scale, shape, outputPtr); }

export function triangular_pdf_scalar(x, min, max, mode) { return wasmExports().triangular_pdf_scalar(x, min, max, mode); }
export function triangular_cdf_scalar(x, min, max, mode) { return wasmExports().triangular_cdf_scalar(x, min, max, mode); }
export function triangular_inv_scalar(p, min, max, mode) { return wasmExports().triangular_inv_scalar(p, min, max, mode); }
export function triangular_pdf_inplace(inputPtr, len, min, max, mode, outputPtr) { wasmExports().triangular_pdf_inplace(inputPtr, len, min, max, mode, outputPtr); }
export function triangular_cdf_inplace(inputPtr, len, min, max, mode, outputPtr) { wasmExports().triangular_cdf_inplace(inputPtr, len, min, max, mode, outputPtr); }

export function invgamma_pdf_scalar(x, shape, rate) { return wasmExports().invgamma_pdf_scalar(x, shape, rate); }
export function invgamma_cdf_scalar(x, shape, rate) { return wasmExports().invgamma_cdf_scalar(x, shape, rate); }
export function invgamma_inv_scalar(p, shape, rate) { return wasmExports().invgamma_inv_scalar(p, shape, rate); }
export function invgamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr) { wasmExports().invgamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr); }
export function invgamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr) { wasmExports().invgamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr); }

export function negbin_pmf_scalar(k, r, p) { return wasmExports().negbin_pmf_scalar(k, r, p); }
export function negbin_cdf_scalar(k, r, p) { return wasmExports().negbin_cdf_scalar(k, r, p); }
export function negbin_inv_scalar(prob, r, p) { return wasmExports().negbin_inv_scalar(prob, r, p); }
export function negbin_pmf_inplace(inputPtr, len, r, p, outputPtr) { wasmExports().negbin_pmf_inplace(inputPtr, len, r, p, outputPtr); }
export function negbin_cdf_inplace(inputPtr, len, r, p, outputPtr) { wasmExports().negbin_cdf_inplace(inputPtr, len, r, p, outputPtr); }

