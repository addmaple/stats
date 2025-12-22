#![allow(clippy::missing_safety_doc, clippy::needless_range_loop)]
#![allow(clippy::missing_safety_doc)]
#![allow(clippy::not_unsafe_ptr_arg_deref, dead_code)]

use std::alloc::{alloc, dealloc, Layout};
use std::mem;

#[no_mangle]
pub unsafe extern "C" fn alloc_bytes(len: usize) -> *mut u8 {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    alloc(layout)
}

#[no_mangle]
pub unsafe extern "C" fn free_bytes(ptr: *mut u8, len: usize) {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    dealloc(ptr, layout);
}

// Memory allocation helpers for specific types
#[no_mangle]
pub unsafe extern "C" fn alloc_f64(len: usize) -> *mut f64 {
    alloc_bytes(len * 8) as *mut f64
}

#[no_mangle]
pub unsafe extern "C" fn free_f64(ptr: *mut f64, len: usize) {
    free_bytes(ptr as *mut u8, len * 8);
}

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

macro_rules! define_scalar_fn {
    ($name:ident, $rust_fn:ident, ($($param:ident : f64),*)) => {
        #[no_mangle]
        pub unsafe extern "C" fn $name(x: f64, $($param: f64),*) -> f64 {
            stat_core::$rust_fn(x, $($param),*).unwrap_or(f64::NAN)
        }
    };
    ($name:ident, $rust_fn:ident, [$($param:ident : f64),*]) => {
        #[no_mangle]
        pub unsafe extern "C" fn $name(p: f64, $($param: f64),*) -> f64 {
            stat_core::$rust_fn(p, $($param),*).unwrap_or(f64::NAN)
        }
    };
}

macro_rules! define_array_fn {
    ($name:ident, $rust_fn:ident, [$($param:ident : f64),*]) => {
        #[no_mangle]
        pub unsafe extern "C" fn $name(
            input_ptr: *const f64,
            len: usize,
            $($param: f64,)*
            output_ptr: *mut f64,
        ) {
            let input = slice_from(input_ptr, len);
            let output = slice_from_mut(output_ptr, len);
            let _ = stat_core::$rust_fn(input, $($param,)* output);
        }
    };
}

// Normal distribution
define_scalar_fn!(normal_pdf_scalar, normal_pdf, (mean: f64, sd: f64));
define_scalar_fn!(normal_cdf_scalar, normal_cdf, (mean: f64, sd: f64));
define_scalar_fn!(normal_inv_scalar, normal_inv, [mean: f64, sd: f64]);
define_array_fn!(normal_pdf_inplace, normal_pdf_array, [mean: f64, sd: f64]);
define_array_fn!(normal_cdf_inplace, normal_cdf_array, [mean: f64, sd: f64]);

// Gamma distribution (shape, rate)
define_scalar_fn!(gamma_pdf_scalar, gamma_pdf, (shape: f64, rate: f64));
define_scalar_fn!(gamma_cdf_scalar, gamma_cdf, (shape: f64, rate: f64));
define_scalar_fn!(gamma_inv_scalar, gamma_inv, [shape: f64, rate: f64]);
define_array_fn!(gamma_pdf_inplace, gamma_pdf_array, [shape: f64, rate: f64]);
define_array_fn!(gamma_cdf_inplace, gamma_cdf_array, [shape: f64, rate: f64]);

// Beta distribution (alpha, beta)
define_scalar_fn!(beta_pdf_scalar, beta_pdf, (alpha: f64, beta: f64));
define_scalar_fn!(beta_cdf_scalar, beta_cdf, (alpha: f64, beta: f64));
define_scalar_fn!(beta_inv_scalar, beta_inv, [alpha: f64, beta: f64]);
define_array_fn!(beta_pdf_inplace, beta_pdf_array, [alpha: f64, beta: f64]);
define_array_fn!(beta_cdf_inplace, beta_cdf_array, [alpha: f64, beta: f64]);

// Student's t distribution
define_scalar_fn!(
    student_t_pdf_scalar,
    student_t_pdf,
    (mean: f64, scale: f64, dof: f64)
);
define_scalar_fn!(
    student_t_cdf_scalar,
    student_t_cdf,
    (mean: f64, scale: f64, dof: f64)
);
define_scalar_fn!(
    student_t_inv_scalar,
    student_t_inv,
    [mean: f64, scale: f64, dof: f64]
);
define_array_fn!(
    student_t_pdf_inplace,
    student_t_pdf_array,
    [mean: f64, scale: f64, dof: f64]
);
define_array_fn!(
    student_t_cdf_inplace,
    student_t_cdf_array,
    [mean: f64, scale: f64, dof: f64]
);

// Chi-squared distribution
define_scalar_fn!(chi_squared_pdf_scalar, chi_squared_pdf, (dof: f64));
define_scalar_fn!(chi_squared_cdf_scalar, chi_squared_cdf, (dof: f64));
define_scalar_fn!(chi_squared_inv_scalar, chi_squared_inv, [dof: f64]);
define_array_fn!(chi_squared_pdf_inplace, chi_squared_pdf_array, [dof: f64]);
define_array_fn!(chi_squared_cdf_inplace, chi_squared_cdf_array, [dof: f64]);

// Fisher F distribution
define_scalar_fn!(fisher_f_pdf_scalar, fisher_f_pdf, (df1: f64, df2: f64));
define_scalar_fn!(fisher_f_cdf_scalar, fisher_f_cdf, (df1: f64, df2: f64));
define_scalar_fn!(fisher_f_inv_scalar, fisher_f_inv, [df1: f64, df2: f64]);
define_array_fn!(
    fisher_f_pdf_inplace,
    fisher_f_pdf_array,
    [df1: f64, df2: f64]
);
define_array_fn!(
    fisher_f_cdf_inplace,
    fisher_f_cdf_array,
    [df1: f64, df2: f64]
);

// Exponential distribution
define_scalar_fn!(exponential_pdf_scalar, exponential_pdf, (rate: f64));
define_scalar_fn!(exponential_cdf_scalar, exponential_cdf, (rate: f64));
define_scalar_fn!(exponential_inv_scalar, exponential_inv, [rate: f64]);
define_array_fn!(
    exponential_pdf_inplace,
    exponential_pdf_array,
    [rate: f64]
);
define_array_fn!(
    exponential_cdf_inplace,
    exponential_cdf_array,
    [rate: f64]
);

// Poisson distribution (discrete - uses pmf instead of pdf)
define_scalar_fn!(poisson_pmf_scalar, poisson_pmf, (lambda: f64));
define_scalar_fn!(poisson_cdf_scalar, poisson_cdf, (lambda: f64));
define_scalar_fn!(poisson_inv_scalar, poisson_inv, [lambda: f64]);
define_array_fn!(poisson_pmf_inplace, poisson_pmf_array, [lambda: f64]);
define_array_fn!(poisson_cdf_inplace, poisson_cdf_array, [lambda: f64]);

// Binomial distribution (discrete - uses pmf instead of pdf)
define_scalar_fn!(binomial_pmf_scalar, binomial_pmf, (n: f64, p: f64));
define_scalar_fn!(binomial_cdf_scalar, binomial_cdf, (n: f64, p: f64));

#[no_mangle]
pub unsafe extern "C" fn binomial_inv_scalar(prob: f64, n: f64, p: f64) -> f64 {
    stat_core::binomial_inv(prob, n, p).unwrap_or(f64::NAN)
}
define_array_fn!(binomial_pmf_inplace, binomial_pmf_array, [n: f64, p: f64]);
define_array_fn!(binomial_cdf_inplace, binomial_cdf_array, [n: f64, p: f64]);

// Uniform distribution
define_scalar_fn!(uniform_pdf_scalar, uniform_pdf, (min: f64, max: f64));
define_scalar_fn!(uniform_cdf_scalar, uniform_cdf, (min: f64, max: f64));
define_scalar_fn!(uniform_inv_scalar, uniform_inv, [min: f64, max: f64]);
define_array_fn!(uniform_pdf_inplace, uniform_pdf_array, [min: f64, max: f64]);
define_array_fn!(uniform_cdf_inplace, uniform_cdf_array, [min: f64, max: f64]);

// Cauchy distribution
define_scalar_fn!(cauchy_pdf_scalar, cauchy_pdf, (location: f64, scale: f64));
define_scalar_fn!(cauchy_cdf_scalar, cauchy_cdf, (location: f64, scale: f64));
define_scalar_fn!(cauchy_inv_scalar, cauchy_inv, [location: f64, scale: f64]);
define_array_fn!(cauchy_pdf_inplace, cauchy_pdf_array, [location: f64, scale: f64]);
define_array_fn!(cauchy_cdf_inplace, cauchy_cdf_array, [location: f64, scale: f64]);

// Laplace distribution
define_scalar_fn!(laplace_pdf_scalar, laplace_pdf, (location: f64, scale: f64));
define_scalar_fn!(laplace_cdf_scalar, laplace_cdf, (location: f64, scale: f64));
define_scalar_fn!(laplace_inv_scalar, laplace_inv, [location: f64, scale: f64]);
define_array_fn!(laplace_pdf_inplace, laplace_pdf_array, [location: f64, scale: f64]);
define_array_fn!(laplace_cdf_inplace, laplace_cdf_array, [location: f64, scale: f64]);

// Log-normal distribution
define_scalar_fn!(lognormal_pdf_scalar, lognormal_pdf, (mean: f64, sd: f64));
define_scalar_fn!(lognormal_cdf_scalar, lognormal_cdf, (mean: f64, sd: f64));
define_scalar_fn!(lognormal_inv_scalar, lognormal_inv, [mean: f64, sd: f64]);
define_array_fn!(lognormal_pdf_inplace, lognormal_pdf_array, [mean: f64, sd: f64]);
define_array_fn!(lognormal_cdf_inplace, lognormal_cdf_array, [mean: f64, sd: f64]);

// Weibull distribution
define_scalar_fn!(weibull_pdf_scalar, weibull_pdf, (shape: f64, scale: f64));
define_scalar_fn!(weibull_cdf_scalar, weibull_cdf, (shape: f64, scale: f64));
define_scalar_fn!(weibull_inv_scalar, weibull_inv, [shape: f64, scale: f64]);
define_array_fn!(weibull_pdf_inplace, weibull_pdf_array, [shape: f64, scale: f64]);
define_array_fn!(weibull_cdf_inplace, weibull_cdf_array, [shape: f64, scale: f64]);

// Pareto distribution
define_scalar_fn!(pareto_pdf_scalar, pareto_pdf, (scale: f64, shape: f64));
define_scalar_fn!(pareto_cdf_scalar, pareto_cdf, (scale: f64, shape: f64));
define_scalar_fn!(pareto_inv_scalar, pareto_inv, [scale: f64, shape: f64]);
define_array_fn!(pareto_pdf_inplace, pareto_pdf_array, [scale: f64, shape: f64]);
define_array_fn!(pareto_cdf_inplace, pareto_cdf_array, [scale: f64, shape: f64]);

// Triangular distribution
define_scalar_fn!(triangular_pdf_scalar, triangular_pdf, (min: f64, max: f64, mode: f64));
define_scalar_fn!(triangular_cdf_scalar, triangular_cdf, (min: f64, max: f64, mode: f64));
define_scalar_fn!(triangular_inv_scalar, triangular_inv, [min: f64, max: f64, mode: f64]);
define_array_fn!(triangular_pdf_inplace, triangular_pdf_array, [min: f64, max: f64, mode: f64]);
define_array_fn!(triangular_cdf_inplace, triangular_cdf_array, [min: f64, max: f64, mode: f64]);

// Inverse gamma distribution
define_scalar_fn!(invgamma_pdf_scalar, invgamma_pdf, (shape: f64, rate: f64));
define_scalar_fn!(invgamma_cdf_scalar, invgamma_cdf, (shape: f64, rate: f64));
define_scalar_fn!(invgamma_inv_scalar, invgamma_inv, [shape: f64, rate: f64]);
define_array_fn!(invgamma_pdf_inplace, invgamma_pdf_array, [shape: f64, rate: f64]);
define_array_fn!(invgamma_cdf_inplace, invgamma_cdf_array, [shape: f64, rate: f64]);

// Negative binomial distribution (discrete)
define_scalar_fn!(negbin_pmf_scalar, negbin_pmf, (r: f64, p: f64));
define_scalar_fn!(negbin_cdf_scalar, negbin_cdf, (r: f64, p: f64));

#[no_mangle]
pub unsafe extern "C" fn negbin_inv_scalar(prob: f64, r: f64, p: f64) -> f64 {
    stat_core::negbin_inv(prob, r, p).unwrap_or(f64::NAN)
}
define_array_fn!(negbin_pmf_inplace, negbin_pmf_array, [r: f64, p: f64]);
define_array_fn!(negbin_cdf_inplace, negbin_cdf_array, [r: f64, p: f64]);
