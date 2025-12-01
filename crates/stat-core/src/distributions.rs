use statrs::distribution::{
    Beta, Binomial, Cauchy, ChiSquared, Continuous, ContinuousCDF, Discrete, DiscreteCDF, Exp,
    FisherSnedecor, Gamma, InverseGamma, Laplace, LogNormal, NegativeBinomial, Normal, Pareto,
    Poisson, StudentsT, Triangular, Uniform, Weibull,
};
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum DistributionError {
    InvalidParameters(String),
    LengthMismatch { input: usize, output: usize },
    ProbabilityOutOfRange { value: f64 },
}

impl fmt::Display for DistributionError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            DistributionError::InvalidParameters(msg) => write!(f, "invalid parameters: {msg}"),
            DistributionError::LengthMismatch { input, output } => write!(
                f,
                "input ({input}) and output ({output}) slices must be the same length"
            ),
            DistributionError::ProbabilityOutOfRange { value } => {
                write!(f, "probability must be within [0, 1]; received {value}")
            }
        }
    }
}

impl std::error::Error for DistributionError {}

fn invalid_params<E: fmt::Display>(err: E) -> DistributionError {
    DistributionError::InvalidParameters(err.to_string())
}

fn ensure_probability(p: f64) -> Result<(), DistributionError> {
    if !(0.0..=1.0).contains(&p) || p.is_nan() {
        Err(DistributionError::ProbabilityOutOfRange { value: p })
    } else {
        Ok(())
    }
}

fn apply_unary_op<F>(input: &[f64], output: &mut [f64], mut op: F) -> Result<(), DistributionError>
where
    F: FnMut(f64) -> f64,
{
    if input.len() != output.len() {
        return Err(DistributionError::LengthMismatch {
            input: input.len(),
            output: output.len(),
        });
    }

    for (dst, &value) in output.iter_mut().zip(input.iter()) {
        *dst = op(value);
    }

    Ok(())
}

fn build_normal(mean: f64, sd: f64) -> Result<Normal, DistributionError> {
    Normal::new(mean, sd).map_err(invalid_params)
}

pub fn normal_pdf(x: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    Ok(build_normal(mean, sd)?.pdf(x))
}

pub fn normal_cdf(x: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    Ok(build_normal(mean, sd)?.cdf(x))
}

pub fn normal_inv(p: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_normal(mean, sd)?.inverse_cdf(p))
}

pub fn normal_pdf_array(
    input: &[f64],
    mean: f64,
    sd: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_normal(mean, sd)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn normal_cdf_array(
    input: &[f64],
    mean: f64,
    sd: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_normal(mean, sd)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_gamma(shape: f64, rate: f64) -> Result<Gamma, DistributionError> {
    Gamma::new(shape, rate).map_err(invalid_params)
}

pub fn gamma_pdf(x: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_gamma(shape, rate)?.pdf(x))
}

pub fn gamma_cdf(x: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_gamma(shape, rate)?.cdf(x))
}

pub fn gamma_inv(p: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_gamma(shape, rate)?.inverse_cdf(p))
}

pub fn gamma_pdf_array(
    input: &[f64],
    shape: f64,
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_gamma(shape, rate)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn gamma_cdf_array(
    input: &[f64],
    shape: f64,
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_gamma(shape, rate)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_beta(alpha: f64, beta: f64) -> Result<Beta, DistributionError> {
    Beta::new(alpha, beta).map_err(invalid_params)
}

pub fn beta_pdf(x: f64, alpha: f64, beta: f64) -> Result<f64, DistributionError> {
    Ok(build_beta(alpha, beta)?.pdf(x))
}

pub fn beta_cdf(x: f64, alpha: f64, beta: f64) -> Result<f64, DistributionError> {
    Ok(build_beta(alpha, beta)?.cdf(x))
}

pub fn beta_inv(p: f64, alpha: f64, beta: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_beta(alpha, beta)?.inverse_cdf(p))
}

pub fn beta_pdf_array(
    input: &[f64],
    alpha: f64,
    beta: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_beta(alpha, beta)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn beta_cdf_array(
    input: &[f64],
    alpha: f64,
    beta: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_beta(alpha, beta)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_students_t(mean: f64, scale: f64, dof: f64) -> Result<StudentsT, DistributionError> {
    StudentsT::new(mean, scale, dof).map_err(invalid_params)
}

pub fn student_t_pdf(x: f64, mean: f64, scale: f64, dof: f64) -> Result<f64, DistributionError> {
    Ok(build_students_t(mean, scale, dof)?.pdf(x))
}

pub fn student_t_cdf(x: f64, mean: f64, scale: f64, dof: f64) -> Result<f64, DistributionError> {
    Ok(build_students_t(mean, scale, dof)?.cdf(x))
}

pub fn student_t_inv(p: f64, mean: f64, scale: f64, dof: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_students_t(mean, scale, dof)?.inverse_cdf(p))
}

pub fn student_t_pdf_array(
    input: &[f64],
    mean: f64,
    scale: f64,
    dof: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_students_t(mean, scale, dof)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn student_t_cdf_array(
    input: &[f64],
    mean: f64,
    scale: f64,
    dof: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_students_t(mean, scale, dof)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_chi_squared(dof: f64) -> Result<ChiSquared, DistributionError> {
    ChiSquared::new(dof).map_err(invalid_params)
}

pub fn chi_squared_pdf(x: f64, dof: f64) -> Result<f64, DistributionError> {
    Ok(build_chi_squared(dof)?.pdf(x))
}

pub fn chi_squared_cdf(x: f64, dof: f64) -> Result<f64, DistributionError> {
    Ok(build_chi_squared(dof)?.cdf(x))
}

pub fn chi_squared_inv(p: f64, dof: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_chi_squared(dof)?.inverse_cdf(p))
}

pub fn chi_squared_pdf_array(
    input: &[f64],
    dof: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_chi_squared(dof)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn chi_squared_cdf_array(
    input: &[f64],
    dof: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_chi_squared(dof)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_f_distribution(df1: f64, df2: f64) -> Result<FisherSnedecor, DistributionError> {
    FisherSnedecor::new(df1, df2).map_err(invalid_params)
}

pub fn fisher_f_pdf(x: f64, df1: f64, df2: f64) -> Result<f64, DistributionError> {
    Ok(build_f_distribution(df1, df2)?.pdf(x))
}

pub fn fisher_f_cdf(x: f64, df1: f64, df2: f64) -> Result<f64, DistributionError> {
    Ok(build_f_distribution(df1, df2)?.cdf(x))
}

pub fn fisher_f_inv(p: f64, df1: f64, df2: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_f_distribution(df1, df2)?.inverse_cdf(p))
}

pub fn fisher_f_pdf_array(
    input: &[f64],
    df1: f64,
    df2: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_f_distribution(df1, df2)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn fisher_f_cdf_array(
    input: &[f64],
    df1: f64,
    df2: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_f_distribution(df1, df2)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

fn build_exponential(rate: f64) -> Result<Exp, DistributionError> {
    Exp::new(rate).map_err(invalid_params)
}

pub fn exponential_pdf(x: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_exponential(rate)?.pdf(x))
}

pub fn exponential_cdf(x: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_exponential(rate)?.cdf(x))
}

pub fn exponential_inv(p: f64, rate: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_exponential(rate)?.inverse_cdf(p))
}

pub fn exponential_pdf_array(
    input: &[f64],
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_exponential(rate)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn exponential_cdf_array(
    input: &[f64],
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_exponential(rate)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Poisson distribution (discrete)
fn build_poisson(lambda: f64) -> Result<Poisson, DistributionError> {
    Poisson::new(lambda).map_err(invalid_params)
}

pub fn poisson_pmf(k: f64, lambda: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_poisson(lambda)?.pmf(k_int))
}

pub fn poisson_cdf(k: f64, lambda: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_poisson(lambda)?.cdf(k_int))
}

pub fn poisson_inv(p: f64, lambda: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_poisson(lambda)?.inverse_cdf(p) as f64)
}

pub fn poisson_pmf_array(
    input: &[f64],
    lambda: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_poisson(lambda)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.pmf(k_int)
    })
}

pub fn poisson_cdf_array(
    input: &[f64],
    lambda: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_poisson(lambda)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.cdf(k_int)
    })
}

// Binomial distribution (discrete)
fn build_binomial(n: f64, p: f64) -> Result<Binomial, DistributionError> {
    let n_int = n as u64;
    Binomial::new(p, n_int).map_err(invalid_params)
}

pub fn binomial_pmf(k: f64, n: f64, p: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_binomial(n, p)?.pmf(k_int))
}

pub fn binomial_cdf(k: f64, n: f64, p: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_binomial(n, p)?.cdf(k_int))
}

pub fn binomial_inv(prob: f64, n: f64, p: f64) -> Result<f64, DistributionError> {
    ensure_probability(prob)?;
    Ok(build_binomial(n, p)?.inverse_cdf(prob) as f64)
}

pub fn binomial_pmf_array(
    input: &[f64],
    n: f64,
    p: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_binomial(n, p)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.pmf(k_int)
    })
}

pub fn binomial_cdf_array(
    input: &[f64],
    n: f64,
    p: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_binomial(n, p)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.cdf(k_int)
    })
}

// Uniform distribution
fn build_uniform(min: f64, max: f64) -> Result<Uniform, DistributionError> {
    Uniform::new(min, max).map_err(invalid_params)
}

pub fn uniform_pdf(x: f64, min: f64, max: f64) -> Result<f64, DistributionError> {
    Ok(build_uniform(min, max)?.pdf(x))
}

pub fn uniform_cdf(x: f64, min: f64, max: f64) -> Result<f64, DistributionError> {
    Ok(build_uniform(min, max)?.cdf(x))
}

pub fn uniform_inv(p: f64, min: f64, max: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_uniform(min, max)?.inverse_cdf(p))
}

pub fn uniform_pdf_array(
    input: &[f64],
    min: f64,
    max: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_uniform(min, max)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn uniform_cdf_array(
    input: &[f64],
    min: f64,
    max: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_uniform(min, max)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Cauchy distribution
fn build_cauchy(location: f64, scale: f64) -> Result<Cauchy, DistributionError> {
    Cauchy::new(location, scale).map_err(invalid_params)
}

pub fn cauchy_pdf(x: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_cauchy(location, scale)?.pdf(x))
}

pub fn cauchy_cdf(x: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_cauchy(location, scale)?.cdf(x))
}

pub fn cauchy_inv(p: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_cauchy(location, scale)?.inverse_cdf(p))
}

pub fn cauchy_pdf_array(
    input: &[f64],
    location: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_cauchy(location, scale)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn cauchy_cdf_array(
    input: &[f64],
    location: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_cauchy(location, scale)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Laplace distribution
fn build_laplace(location: f64, scale: f64) -> Result<Laplace, DistributionError> {
    Laplace::new(location, scale).map_err(invalid_params)
}

pub fn laplace_pdf(x: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_laplace(location, scale)?.pdf(x))
}

pub fn laplace_cdf(x: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_laplace(location, scale)?.cdf(x))
}

pub fn laplace_inv(p: f64, location: f64, scale: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_laplace(location, scale)?.inverse_cdf(p))
}

pub fn laplace_pdf_array(
    input: &[f64],
    location: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_laplace(location, scale)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn laplace_cdf_array(
    input: &[f64],
    location: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_laplace(location, scale)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Log-normal distribution
fn build_lognormal(mean: f64, sd: f64) -> Result<LogNormal, DistributionError> {
    LogNormal::new(mean, sd).map_err(invalid_params)
}

pub fn lognormal_pdf(x: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    Ok(build_lognormal(mean, sd)?.pdf(x))
}

pub fn lognormal_cdf(x: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    Ok(build_lognormal(mean, sd)?.cdf(x))
}

pub fn lognormal_inv(p: f64, mean: f64, sd: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_lognormal(mean, sd)?.inverse_cdf(p))
}

pub fn lognormal_pdf_array(
    input: &[f64],
    mean: f64,
    sd: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_lognormal(mean, sd)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn lognormal_cdf_array(
    input: &[f64],
    mean: f64,
    sd: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_lognormal(mean, sd)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Weibull distribution
fn build_weibull(shape: f64, scale: f64) -> Result<Weibull, DistributionError> {
    Weibull::new(shape, scale).map_err(invalid_params)
}

pub fn weibull_pdf(x: f64, shape: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_weibull(shape, scale)?.pdf(x))
}

pub fn weibull_cdf(x: f64, shape: f64, scale: f64) -> Result<f64, DistributionError> {
    Ok(build_weibull(shape, scale)?.cdf(x))
}

pub fn weibull_inv(p: f64, shape: f64, scale: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_weibull(shape, scale)?.inverse_cdf(p))
}

pub fn weibull_pdf_array(
    input: &[f64],
    shape: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_weibull(shape, scale)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn weibull_cdf_array(
    input: &[f64],
    shape: f64,
    scale: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_weibull(shape, scale)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Pareto distribution
fn build_pareto(scale: f64, shape: f64) -> Result<Pareto, DistributionError> {
    Pareto::new(scale, shape).map_err(invalid_params)
}

pub fn pareto_pdf(x: f64, scale: f64, shape: f64) -> Result<f64, DistributionError> {
    Ok(build_pareto(scale, shape)?.pdf(x))
}

pub fn pareto_cdf(x: f64, scale: f64, shape: f64) -> Result<f64, DistributionError> {
    Ok(build_pareto(scale, shape)?.cdf(x))
}

pub fn pareto_inv(p: f64, scale: f64, shape: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_pareto(scale, shape)?.inverse_cdf(p))
}

pub fn pareto_pdf_array(
    input: &[f64],
    scale: f64,
    shape: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_pareto(scale, shape)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn pareto_cdf_array(
    input: &[f64],
    scale: f64,
    shape: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_pareto(scale, shape)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Triangular distribution
fn build_triangular(min: f64, max: f64, mode: f64) -> Result<Triangular, DistributionError> {
    Triangular::new(min, max, mode).map_err(invalid_params)
}

pub fn triangular_pdf(x: f64, min: f64, max: f64, mode: f64) -> Result<f64, DistributionError> {
    Ok(build_triangular(min, max, mode)?.pdf(x))
}

pub fn triangular_cdf(x: f64, min: f64, max: f64, mode: f64) -> Result<f64, DistributionError> {
    Ok(build_triangular(min, max, mode)?.cdf(x))
}

pub fn triangular_inv(p: f64, min: f64, max: f64, mode: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_triangular(min, max, mode)?.inverse_cdf(p))
}

pub fn triangular_pdf_array(
    input: &[f64],
    min: f64,
    max: f64,
    mode: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_triangular(min, max, mode)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn triangular_cdf_array(
    input: &[f64],
    min: f64,
    max: f64,
    mode: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_triangular(min, max, mode)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Inverse gamma distribution
fn build_inverse_gamma(shape: f64, rate: f64) -> Result<InverseGamma, DistributionError> {
    InverseGamma::new(shape, rate).map_err(invalid_params)
}

pub fn invgamma_pdf(x: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_inverse_gamma(shape, rate)?.pdf(x))
}

pub fn invgamma_cdf(x: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    Ok(build_inverse_gamma(shape, rate)?.cdf(x))
}

pub fn invgamma_inv(p: f64, shape: f64, rate: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_inverse_gamma(shape, rate)?.inverse_cdf(p))
}

pub fn invgamma_pdf_array(
    input: &[f64],
    shape: f64,
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_inverse_gamma(shape, rate)?;
    apply_unary_op(input, output, |x| dist.pdf(x))
}

pub fn invgamma_cdf_array(
    input: &[f64],
    shape: f64,
    rate: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_inverse_gamma(shape, rate)?;
    apply_unary_op(input, output, |x| dist.cdf(x))
}

// Negative binomial distribution (discrete)
fn build_negative_binomial(r: f64, p: f64) -> Result<NegativeBinomial, DistributionError> {
    NegativeBinomial::new(r, p).map_err(invalid_params)
}

pub fn negbin_pmf(k: f64, r: f64, p: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_negative_binomial(r, p)?.pmf(k_int))
}

pub fn negbin_cdf(k: f64, r: f64, p: f64) -> Result<f64, DistributionError> {
    let k_int = k as u64;
    Ok(build_negative_binomial(r, p)?.cdf(k_int))
}

pub fn negbin_inv(p: f64, r: f64, prob: f64) -> Result<f64, DistributionError> {
    ensure_probability(p)?;
    Ok(build_negative_binomial(r, prob)?.inverse_cdf(p) as f64)
}

pub fn negbin_pmf_array(
    input: &[f64],
    r: f64,
    p: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_negative_binomial(r, p)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.pmf(k_int)
    })
}

pub fn negbin_cdf_array(
    input: &[f64],
    r: f64,
    p: f64,
    output: &mut [f64],
) -> Result<(), DistributionError> {
    let dist = build_negative_binomial(r, p)?;
    apply_unary_op(input, output, |k| {
        let k_int = k as u64;
        dist.cdf(k_int)
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    const EPS: f64 = 1e-10;

    fn approx_eq(a: f64, b: f64) -> bool {
        (a - b).abs() < EPS
    }

    #[test]
    fn normal_basics() {
        let pdf = normal_pdf(0.0, 0.0, 1.0).unwrap();
        assert!(approx_eq(pdf, 0.3989422804014327));

        let cdf = normal_cdf(1.96, 0.0, 1.0).unwrap();
        assert!(approx_eq(cdf, 0.9750021048517795));

        let inv = normal_inv(0.975, 0.0, 1.0).unwrap();
        assert!(approx_eq(inv, 1.959963984540054));
    }

    #[test]
    fn gamma_matches_known_values() {
        let pdf = gamma_pdf(2.0, 3.0, 1.0).unwrap();
        assert!(approx_eq(pdf, 0.2706705664732254));

        let cdf = gamma_cdf(2.0, 3.0, 1.0).unwrap();
        assert!(approx_eq(cdf, 0.32332358381693654));
    }

    #[test]
    fn beta_quantiles() {
        let inv = beta_inv(0.5, 2.0, 2.0).unwrap();
        assert!(approx_eq(inv, 0.5));
    }

    #[test]
    fn array_ops_write_results() {
        let mut out = vec![0.0; 3];
        normal_pdf_array(&[0.0, 1.0, 2.0], 0.0, 1.0, &mut out).unwrap();
        assert!(out.iter().all(|v| *v > 0.0));
    }

    #[test]
    fn poisson_basics() {
        // Poisson with lambda=2
        let pmf = poisson_pmf(2.0, 2.0).unwrap();
        assert!(approx_eq(pmf, 0.2706705664732254)); // e^-2 * 2^2 / 2!

        let cdf = poisson_cdf(3.0, 2.0).unwrap();
        assert!(cdf > 0.8 && cdf < 0.9); // Should be around 0.857

        let inv = poisson_inv(0.5, 2.0).unwrap();
        assert!(inv >= 1.0 && inv <= 3.0); // Median should be around 2
    }

    #[test]
    fn binomial_basics() {
        // Binomial with n=10, p=0.5
        let pmf = binomial_pmf(5.0, 10.0, 0.5).unwrap();
        assert!(pmf > 0.24 && pmf < 0.25); // Should be around 0.246

        let cdf = binomial_cdf(5.0, 10.0, 0.5).unwrap();
        assert!(cdf > 0.62 && cdf < 0.63); // Should be around 0.623

        let inv = binomial_inv(0.5, 10.0, 0.5).unwrap();
        assert!(inv >= 4.0 && inv <= 6.0); // Median should be around 5
    }
}
