import {
  runUnaryArrayOp,
  loadWasmModule,
  createRequireWasm,
  ArrayKernel,
} from './shared.js';
import type { DistributionsWasmModule } from './wasm-types.js';

let wasmModule: DistributionsWasmModule | null = null;

/**
 * Get the current WASM module instance.
 */
export function getDistributionsWasm(): DistributionsWasmModule | null {
  return wasmModule;
}

/**
 * Set the WASM module instance.
 */
export function setDistributionsWasm(mod: DistributionsWasmModule): void {
  wasmModule = mod;
}

const requireWasm = createRequireWasm(() => wasmModule);

/**
 * Initialize the distributions wasm module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (wasmModule) {
    return;
  }
  const mod = await loadWasmModule('../pkg/stat-wasm-distributions', options.inline);
  wasmModule = mod as unknown as DistributionsWasmModule;
}

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

function buildDistribution(bindings: DistributionBindings): DistributionHandle {
  return {
    pdf: bindings.pdfScalar,
    cdf: bindings.cdfScalar,
    inv: bindings.invScalar,
    pdfArray(data: ArrayLike<number>) {
      const wasm = requireWasm();
      return runUnaryArrayOp(data, bindings.pdfKernel, wasm, wasm.get_memory());
    },
    cdfArray(data: ArrayLike<number>) {
      const wasm = requireWasm();
      return runUnaryArrayOp(data, bindings.cdfKernel, wasm, wasm.get_memory());
    },
  };
}

// Distribution parameter interfaces and functions
export interface NormalParams {
  mean?: number;
  sd?: number;
}

export function normal(params: NormalParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const sd = params.sd ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.normal_pdf_scalar(x, mean, sd),
    cdfScalar: (x: number) => wasm.normal_cdf_scalar(x, mean, sd),
    invScalar: (p: number) => wasm.normal_inv_scalar(p, mean, sd),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.normal_pdf_inplace(inputPtr, len, mean, sd, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.normal_cdf_inplace(inputPtr, len, mean, sd, outputPtr),
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
  const rate = params.rate ?? (params.scale !== undefined ? 1 / params.scale : 1);
  return buildDistribution({
    pdfScalar: (x: number) => wasm.gamma_pdf_scalar(x, shape, rate),
    cdfScalar: (x: number) => wasm.gamma_cdf_scalar(x, shape, rate),
    invScalar: (p: number) => wasm.gamma_inv_scalar(p, shape, rate),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.gamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.gamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr),
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
    pdfKernel: (inputPtr, len, outputPtr) => wasm.beta_pdf_inplace(inputPtr, len, alpha, betaShape, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.beta_cdf_inplace(inputPtr, len, alpha, betaShape, outputPtr),
  });
}

export interface StudentTParams {
  mean?: number;
  scale?: number;
  dof?: number;
}

export function studentT(params: StudentTParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const scale = params.scale ?? 1;
  const dof = params.dof ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.student_t_pdf_scalar(x, mean, scale, dof),
    cdfScalar: (x: number) => wasm.student_t_cdf_scalar(x, mean, scale, dof),
    invScalar: (p: number) => wasm.student_t_inv_scalar(p, mean, scale, dof),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.student_t_pdf_inplace(inputPtr, len, mean, scale, dof, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.student_t_cdf_inplace(inputPtr, len, mean, scale, dof, outputPtr),
  });
}

export interface ChiSquaredParams {
  dof?: number;
}

export function chiSquared(params: ChiSquaredParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const dof = params.dof ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.chi_squared_pdf_scalar(x, dof),
    cdfScalar: (x: number) => wasm.chi_squared_cdf_scalar(x, dof),
    invScalar: (p: number) => wasm.chi_squared_inv_scalar(p, dof),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.chi_squared_pdf_inplace(inputPtr, len, dof, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.chi_squared_cdf_inplace(inputPtr, len, dof, outputPtr),
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
    pdfKernel: (inputPtr, len, outputPtr) => wasm.fisher_f_pdf_inplace(inputPtr, len, df1, df2, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.fisher_f_cdf_inplace(inputPtr, len, df1, df2, outputPtr),
  });
}

export interface ExponentialParams {
  rate?: number;
  scale?: number;
}

export function exponential(params: ExponentialParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const rate = params.rate ?? (params.scale !== undefined ? 1 / params.scale : 1);
  return buildDistribution({
    pdfScalar: (x: number) => wasm.exponential_pdf_scalar(x, rate),
    cdfScalar: (x: number) => wasm.exponential_cdf_scalar(x, rate),
    invScalar: (p: number) => wasm.exponential_inv_scalar(p, rate),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.exponential_pdf_inplace(inputPtr, len, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.exponential_cdf_inplace(inputPtr, len, rate, outputPtr),
  });
}

export interface PoissonParams {
  lambda?: number;
}

export function poisson(params: PoissonParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const lambda = params.lambda ?? 1;
  return buildDistribution({
    pdfScalar: (k: number) => wasm.poisson_pmf_scalar(k, lambda),
    cdfScalar: (k: number) => wasm.poisson_cdf_scalar(k, lambda),
    invScalar: (p: number) => wasm.poisson_inv_scalar(p, lambda),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.poisson_pmf_inplace(inputPtr, len, lambda, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.poisson_cdf_inplace(inputPtr, len, lambda, outputPtr),
  });
}

export interface BinomialParams {
  n?: number;
  p?: number;
}

export function binomial(params: BinomialParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const n = params.n ?? 10;
  const p = params.p ?? 0.5;
  return buildDistribution({
    pdfScalar: (k: number) => wasm.binomial_pmf_scalar(k, n, p),
    cdfScalar: (k: number) => wasm.binomial_cdf_scalar(k, n, p),
    invScalar: (prob: number) => wasm.binomial_inv_scalar(prob, n, p),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.binomial_pmf_inplace(inputPtr, len, n, p, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.binomial_cdf_inplace(inputPtr, len, n, p, outputPtr),
  });
}

export interface UniformParams {
  min?: number;
  max?: number;
}

export function uniform(params: UniformParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const min = params.min ?? 0;
  const max = params.max ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.uniform_pdf_scalar(x, min, max),
    cdfScalar: (x: number) => wasm.uniform_cdf_scalar(x, min, max),
    invScalar: (p: number) => wasm.uniform_inv_scalar(p, min, max),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.uniform_pdf_inplace(inputPtr, len, min, max, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.uniform_cdf_inplace(inputPtr, len, min, max, outputPtr),
  });
}

export interface CauchyParams {
  location?: number;
  scale?: number;
}

export function cauchy(params: CauchyParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const location = params.location ?? 0;
  const scale = params.scale ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.cauchy_pdf_scalar(x, location, scale),
    cdfScalar: (x: number) => wasm.cauchy_cdf_scalar(x, location, scale),
    invScalar: (p: number) => wasm.cauchy_inv_scalar(p, location, scale),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.cauchy_pdf_inplace(inputPtr, len, location, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.cauchy_cdf_inplace(inputPtr, len, location, scale, outputPtr),
  });
}

export interface LaplaceParams {
  location?: number;
  scale?: number;
}

export function laplace(params: LaplaceParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const location = params.location ?? 0;
  const scale = params.scale ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.laplace_pdf_scalar(x, location, scale),
    cdfScalar: (x: number) => wasm.laplace_cdf_scalar(x, location, scale),
    invScalar: (p: number) => wasm.laplace_inv_scalar(p, location, scale),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.laplace_pdf_inplace(inputPtr, len, location, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.laplace_cdf_inplace(inputPtr, len, location, scale, outputPtr),
  });
}

export interface LogNormalParams {
  mean?: number;
  sd?: number;
}

export function logNormal(params: LogNormalParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const mean = params.mean ?? 0;
  const sd = params.sd ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.lognormal_pdf_scalar(x, mean, sd),
    cdfScalar: (x: number) => wasm.lognormal_cdf_scalar(x, mean, sd),
    invScalar: (p: number) => wasm.lognormal_inv_scalar(p, mean, sd),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.lognormal_pdf_inplace(inputPtr, len, mean, sd, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.lognormal_cdf_inplace(inputPtr, len, mean, sd, outputPtr),
  });
}

export interface WeibullParams {
  shape?: number;
  scale?: number;
}

export function weibull(params: WeibullParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const shape = params.shape ?? 1;
  const scale = params.scale ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.weibull_pdf_scalar(x, shape, scale),
    cdfScalar: (x: number) => wasm.weibull_cdf_scalar(x, shape, scale),
    invScalar: (p: number) => wasm.weibull_inv_scalar(p, shape, scale),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.weibull_pdf_inplace(inputPtr, len, shape, scale, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.weibull_cdf_inplace(inputPtr, len, shape, scale, outputPtr),
  });
}

export interface ParetoParams {
  scale?: number;
  shape?: number;
}

export function pareto(params: ParetoParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const scale = params.scale ?? 1;
  const shape = params.shape ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.pareto_pdf_scalar(x, scale, shape),
    cdfScalar: (x: number) => wasm.pareto_cdf_scalar(x, scale, shape),
    invScalar: (p: number) => wasm.pareto_inv_scalar(p, scale, shape),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.pareto_pdf_inplace(inputPtr, len, scale, shape, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.pareto_cdf_inplace(inputPtr, len, scale, shape, outputPtr),
  });
}

export interface TriangularParams {
  min?: number;
  max?: number;
  mode?: number;
}

export function triangular(params: TriangularParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const min = params.min ?? 0;
  const max = params.max ?? 1;
  const mode = params.mode ?? (min + max) / 2;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.triangular_pdf_scalar(x, min, max, mode),
    cdfScalar: (x: number) => wasm.triangular_cdf_scalar(x, min, max, mode),
    invScalar: (p: number) => wasm.triangular_inv_scalar(p, min, max, mode),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.triangular_pdf_inplace(inputPtr, len, min, max, mode, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.triangular_cdf_inplace(inputPtr, len, min, max, mode, outputPtr),
  });
}

export interface InverseGammaParams {
  shape?: number;
  rate?: number;
}

export function inverseGamma(params: InverseGammaParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const shape = params.shape ?? 1;
  const rate = params.rate ?? 1;
  return buildDistribution({
    pdfScalar: (x: number) => wasm.invgamma_pdf_scalar(x, shape, rate),
    cdfScalar: (x: number) => wasm.invgamma_cdf_scalar(x, shape, rate),
    invScalar: (p: number) => wasm.invgamma_inv_scalar(p, shape, rate),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.invgamma_pdf_inplace(inputPtr, len, shape, rate, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.invgamma_cdf_inplace(inputPtr, len, shape, rate, outputPtr),
  });
}

export interface NegativeBinomialParams {
  r?: number;
  p?: number;
}

export function negativeBinomial(params: NegativeBinomialParams = {}): DistributionHandle {
  const wasm = requireWasm();
  const r = params.r ?? 1;
  const p = params.p ?? 0.5;
  return buildDistribution({
    pdfScalar: (k: number) => wasm.negbin_pmf_scalar(k, r, p),
    cdfScalar: (k: number) => wasm.negbin_cdf_scalar(k, r, p),
    invScalar: (prob: number) => wasm.negbin_inv_scalar(prob, r, p),
    pdfKernel: (inputPtr, len, outputPtr) => wasm.negbin_pmf_inplace(inputPtr, len, r, p, outputPtr),
    cdfKernel: (inputPtr, len, outputPtr) => wasm.negbin_cdf_inplace(inputPtr, len, r, p, outputPtr),
  });
}
