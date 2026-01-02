export {
  f64View, f32View, copyToWasmMemory, copyToWasmMemoryF32,
  readWasmArray, runUnaryArrayOp, loadWasmModule,
  WASM_NOT_INITIALIZED_ERROR
} from './shared.js';
export * from './wasm-types.js';

// Explicitly re-export public API from sub-modules
export {
  sum, mean, variance, sampleVariance, stdev, sampleStdev, min, max, product,
  range, median, mode, geomean, skewness, kurtosis, coeffvar, meandev, meddev,
  cumsum, cumprod, diff, rank, stanMoment, pooledvariance, pooledstdev,
  deviation, histogram, cumreduce
} from './stats.js';

export {
  percentile, percentileInclusive, percentileExclusive, percentileOfScore,
  quartiles, iqr, percentiles, quantiles,
  weightedPercentile, weightedQuantiles, weightedMedian,
  histogramEdges, qscore, qtest, histogramBinning, BinningPresets
} from './quantiles.js';

export { covariance, corrcoeff, spearmancoeff } from './correlation.js';

export {
  ttest, ztest, normalci, tci, regress, regressNaive, regressSimd,
  regressWasmKernels, RegressionWorkspace, anovaFScore, anovaTest,
  chiSquareTest, anovaFScoreCategorical, anovaTestCategorical,
  tukeyHsdCategorical
} from './tests.js';

export { descriptiveStats } from './descriptive.js';

// Distributions is already clean as it mostly exports types + a few functions
export * from './distributions.js';

import { loadWasmModule, setGlobalWasm } from './shared.js';
import * as stats from './stats.js';
import * as distributions from './distributions.js';
import * as quantiles from './quantiles.js';
import * as correlation from './correlation.js';
import * as tests from './tests.js';
import type { FullWasmModule } from './wasm-types.js';

/**
 * Initialize the full wasm module (SIMD-aware).
 * 
 * This function must be called once before using any statistics functions.
 * It's safe to call multiple times - it will only initialize once.
 * 
 * @param options - Initialization options
 * @param options.inline - If true, use the inline (base64) version of the WASM module.
 */
export async function init(options: { inline?: boolean } = {}): Promise<void> {
  if (stats.getStatsWasm()) {
    return;
  }

  // Load the full "monolithic" WASM module
  const fullMod = await loadWasmModule('../pkg/stat-wasm', options.inline) as FullWasmModule;

  // Set it as the global instance so all sub-modules use the same memory and functions
  setGlobalWasm(fullMod);

  // Mark sub-modules as initialized
  stats.setStatsWasm(fullMod);
  distributions.setDistributionsWasm(fullMod as any);
  quantiles.setQuantilesWasm(fullMod as any);
  correlation.setCorrelationWasm(fullMod as any);
  tests.setTestsWasm(fullMod as any);
}
