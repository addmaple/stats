import { DescriptiveStatsResult } from './wasm-types.js';
import { sum, mean, variance, sampleVariance, stdev, sampleStdev, min, max, range, skewness, kurtosis, coeffvar, meandev, meddev } from './stats.js';
import { quartiles, iqr } from './quantiles.js';

/**
 * Calculate a rich set of descriptive statistics for an array in one call.
 *
 * This helper wraps core vector statistics (mean, variance, quartiles, skewness, etc.)
 * and returns them in a single object.
 *
 * @param data - Input array of numbers
 * @returns An object with common descriptive statistics
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

