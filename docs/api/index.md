@stats/core API Reference

# @stats/core API Reference - v0.2.3

## Table of contents

### Classes

- [RegressionWorkspaceF32](classes/RegressionWorkspaceF32.md)
- [RegressionWorkspace](classes/RegressionWorkspace.md)

### Interfaces

- [DescriptiveStatsResult](interfaces/DescriptiveStatsResult.md)
- [TestResult](interfaces/TestResult.md)
- [RegressionResult](interfaces/RegressionResult.md)
- [RegressionCoeffs](interfaces/RegressionCoeffs.md)
- [RegressionCoeffsF32](interfaces/RegressionCoeffsF32.md)
- [DistributionHandle](interfaces/DistributionHandle.md)
- [BinOption](interfaces/BinOption.md)
- [HistogramBinningResult](interfaces/HistogramBinningResult.md)
- [WeightedHistogramBinningResult](interfaces/WeightedHistogramBinningResult.md)
- [AnovaResult](interfaces/AnovaResult.md)
- [ChiSquareResult](interfaces/ChiSquareResult.md)
- [NormalParams](interfaces/NormalParams.md)
- [GammaParams](interfaces/GammaParams.md)
- [BetaParams](interfaces/BetaParams.md)
- [StudentTParams](interfaces/StudentTParams.md)
- [ChiSquaredParams](interfaces/ChiSquaredParams.md)
- [FisherFParams](interfaces/FisherFParams.md)
- [ExponentialParams](interfaces/ExponentialParams.md)
- [PoissonParams](interfaces/PoissonParams.md)
- [BinomialParams](interfaces/BinomialParams.md)
- [UniformParams](interfaces/UniformParams.md)
- [CauchyParams](interfaces/CauchyParams.md)
- [LaplaceParams](interfaces/LaplaceParams.md)
- [LogNormalParams](interfaces/LogNormalParams.md)
- [WeibullParams](interfaces/WeibullParams.md)
- [ParetoParams](interfaces/ParetoParams.md)
- [TriangularParams](interfaces/TriangularParams.md)
- [InverseGammaParams](interfaces/InverseGammaParams.md)
- [NegativeBinomialParams](interfaces/NegativeBinomialParams.md)

### Variables

- [BinningPresets](index.md#binningpresets)

### Functions

- [init](index.md#init)
- [sum](index.md#sum)
- [mean](index.md#mean)
- [variance](index.md#variance)
- [sampleVariance](index.md#samplevariance)
- [stdev](index.md#stdev)
- [sampleStdev](index.md#samplestdev)
- [coeffvar](index.md#coeffvar)
- [deviation](index.md#deviation)
- [meandev](index.md#meandev)
- [meddev](index.md#meddev)
- [pooledvariance](index.md#pooledvariance)
- [pooledstdev](index.md#pooledstdev)
- [stanMoment](index.md#stanmoment)
- [median](index.md#median)
- [mode](index.md#mode)
- [geomean](index.md#geomean)
- [skewness](index.md#skewness)
- [kurtosis](index.md#kurtosis)
- [min](index.md#min)
- [max](index.md#max)
- [product](index.md#product)
- [range](index.md#range)
- [cumsum](index.md#cumsum)
- [cumprod](index.md#cumprod)
- [diff](index.md#diff)
- [cumreduce](index.md#cumreduce)
- [rank](index.md#rank)
- [percentile](index.md#percentile)
- [percentileOfScore](index.md#percentileofscore)
- [qscore](index.md#qscore)
- [qtest](index.md#qtest)
- [percentiles](index.md#percentiles)
- [quantiles](index.md#quantiles)
- [quartiles](index.md#quartiles)
- [iqr](index.md#iqr)
- [weightedPercentile](index.md#weightedpercentile)
- [weightedQuantiles](index.md#weightedquantiles)
- [weightedMedian](index.md#weightedmedian)
- [descriptiveStats](index.md#descriptivestats)
- [histogram](index.md#histogram)
- [histogramEdges](index.md#histogramedges)
- [histogramBinning](index.md#histogrambinning)
- [histogramBinningWeighted](index.md#histogrambinningweighted)
- [covariance](index.md#covariance)
- [corrcoeff](index.md#corrcoeff)
- [spearmancoeff](index.md#spearmancoeff)
- [anovaFScore](index.md#anovafscore)
- [anovaTest](index.md#anovatest)
- [chiSquareTest](index.md#chisquaretest)
- [anovaFScoreCategorical](index.md#anovafscorecategorical)
- [anovaTestCategorical](index.md#anovatestcategorical)
- [normal](index.md#normal)
- [gamma](index.md#gamma)
- [beta](index.md#beta)
- [studentT](index.md#studentt)
- [chiSquared](index.md#chisquared)
- [fisherF](index.md#fisherf)
- [exponential](index.md#exponential)
- [poisson](index.md#poisson)
- [binomial](index.md#binomial)
- [uniform](index.md#uniform)
- [cauchy](index.md#cauchy)
- [laplace](index.md#laplace)
- [logNormal](index.md#lognormal)
- [weibull](index.md#weibull)
- [pareto](index.md#pareto)
- [triangular](index.md#triangular)
- [inverseGamma](index.md#inversegamma)
- [negativeBinomial](index.md#negativebinomial)
- [ttest](index.md#ttest)
- [ztest](index.md#ztest)
- [regress](index.md#regress)
- [regressNaive](index.md#regressnaive)
- [regressSimd](index.md#regresssimd)
- [regressWasmKernels](index.md#regresswasmkernels)
- [regressCoeffs](index.md#regresscoeffs)
- [regressNaiveCoeffs](index.md#regressnaivecoeffs)
- [regressSimdCoeffs](index.md#regresssimdcoeffs)
- [regressWasmKernelsCoeffs](index.md#regresswasmkernelscoeffs)
- [regressSimdCoeffsF32](index.md#regresssimdcoeffsf32)
- [normalci](index.md#normalci)
- [tci](index.md#tci)

## Variables

### BinningPresets

• `Const` **BinningPresets**: `Object`

Utility functions to create common binning configurations.

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `autoFD` | (`bins?`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `autoScott` | (`bins?`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `autoSqrt` | (`bins?`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `autoWithTailCollapse` | (`k`: `number`, `bins?`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `equalFrequency` | (`bins`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `fixedWidth` | (`bins`: `number`) => [`BinOption`](interfaces/BinOption.md) | - |
| `custom` | (`edges`: `Float64Array` \| `number`[]) => [`BinOption`](interfaces/BinOption.md) | - |
| `deciles` | () => [`BinOption`](interfaces/BinOption.md) | - |
| `quartiles` | () => [`BinOption`](interfaces/BinOption.md) | - |

#### Defined in

[index.ts:3148](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3148)

## Functions

### init

▸ **init**(): `Promise`\<`void`\>

Initialize the wasm module (SIMD-aware).

This function must be called once before using any statistics functions.
It's safe to call multiple times - it will only initialize once.

#### Returns

`Promise`\<`void`\>

**`Example`**

```js
import { init, mean } from '@stats/core';

await init();
const result = mean([1, 2, 3]);
```

#### Defined in

[index.ts:583](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L583)

___

### sum

▸ **sum**(`data`): `number`

Calculate the sum of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers to sum |

#### Returns

`number`

The sum of all elements

**`Example`**

```js
import { init, sum } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const total = sum(data); // 15
```

#### Defined in

[index.ts:742](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L742)

___

### mean

▸ **mean**(`data`): `number`

Calculate the arithmetic mean (average) of an array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The mean value, or NaN if array is empty

**`Example`**

```js
import { init, mean } from '@stats/core';
await init();

const scores = [85, 90, 78, 92, 88];
const average = mean(scores); // 86.6
```

#### Defined in

[index.ts:784](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L784)

___

### variance

▸ **variance**(`data`): `number`

Calculate the population variance of an array.
Uses the formula: Σ(x - μ)² / N

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The population variance, or NaN if array is empty

**`Example`**

```js
import { init, variance } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const popVar = variance(data); // 2
```

#### Defined in

[index.ts:827](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L827)

___

### sampleVariance

▸ **sampleVariance**(`data`): `number`

Calculate the sample variance of an array (Bessel's correction).
Uses the formula: Σ(x - x̄)² / (N - 1)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers (must have at least 2 elements) |

#### Returns

`number`

The sample variance, or NaN if array has less than 2 elements

**`Example`**

```js
import { init, sampleVariance } from '@stats/core';
await init();

const sample = [1, 2, 3, 4, 5];
const sampVar = sampleVariance(sample); // 2.5
```

#### Defined in

[index.ts:870](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L870)

___

### stdev

▸ **stdev**(`data`): `number`

Calculate the standard deviation (population) of an array.

Standard deviation measures how spread out your data is. A low standard deviation 
means values are close to the mean, while a high standard deviation means values 
are more spread out.

**When to use:** Use this when you have data for the entire population (not a sample).
For sample data, use `sampleStdev` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The population standard deviation, or NaN if array is empty

**`Example`**

```js
import { init, stdev } from '@stats/core';
await init();

// Test scores for entire class (population)
const scores = [85, 90, 78, 92, 88];
const spread = stdev(scores); // ~4.47
// Lower spread = more consistent scores
```

#### Defined in

[index.ts:921](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L921)

___

### sampleStdev

▸ **sampleStdev**(`data`): `number`

Calculate the sample standard deviation of an array.

This is the standard deviation adjusted for sample data (uses N-1 instead of N).
Use this when you have a sample from a larger population and want to estimate 
the population's standard deviation.

**When to use:** Use this for sample data (most common case). Use `stdev` only 
when you have data for the entire population.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers (must have at least 2 elements) |

#### Returns

`number`

The sample standard deviation, or NaN if array has less than 2 elements

**`Example`**

```js
import { init, sampleStdev } from '@stats/core';
await init();

// Sample of 10 people's heights
const heights = [65, 68, 70, 72, 74, 66, 69, 71, 73, 67];
const spread = sampleStdev(heights); // ~3.16 inches
```

#### Defined in

[index.ts:971](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L971)

___

### coeffvar

▸ **coeffvar**(`data`): `number`

Calculate the coefficient of variation (CV).

The coefficient of variation is the ratio of standard deviation to the mean.
It's useful for comparing variability across datasets with different scales.
A higher CV means more relative variability.

**When to use:** Compare variability between datasets with different units or scales.
For example, comparing height variability (inches) vs weight variability (pounds).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The coefficient of variation (stdev / mean), or NaN if array is empty

**`Example`**

```js
import { init, coeffvar } from '@stats/core';
await init();

// Compare variability of two different measurements
const heights = [65, 68, 70, 72, 74]; // inches
const weights = [120, 140, 160, 180, 200]; // pounds

const heightCV = coeffvar(heights); // ~0.05 (5% variability)
const weightCV = coeffvar(weights); // ~0.24 (24% variability)
// Weights are more variable relative to their mean
```

#### Defined in

[index.ts:1025](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1025)

___

### deviation

▸ **deviation**(`data`): `Float64Array`

Calculate deviations from mean (x - mean) for each element.

Returns an array where each element is the deviation from the mean.
Useful for understanding how each value differs from the average.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`Float64Array`

Array of deviations from mean, or empty array if input is empty

**`Example`**

```js
import { init, deviation } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const devs = deviation(data);
// devs = [-2, -1, 0, 1, 2] (mean is 3)
```

#### Defined in

[index.ts:1064](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1064)

___

### meandev

▸ **meandev**(`data`): `number`

Calculate mean deviation (mean absolute deviation from mean).

Mean deviation measures the average distance of data points from the mean.
It's similar to standard deviation but uses absolute values instead of squares.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The mean deviation, or NaN if array is empty

**`Example`**

```js
import { init, meandev } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const md = meandev(data); // ~1.2
```

#### Defined in

[index.ts:1102](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1102)

___

### meddev

▸ **meddev**(`data`): `number`

Calculate median deviation (mean absolute deviation from median).

Median deviation measures the average distance of data points from the median.
More robust to outliers than mean deviation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The median deviation, or NaN if array is empty

**`Example`**

```js
import { init, meddev } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const md = meddev(data); // ~1.2
```

#### Defined in

[index.ts:1140](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1140)

___

### pooledvariance

▸ **pooledvariance**(`data1`, `data2`): `number`

Calculate pooled variance for two groups.

Pooled variance combines the variance estimates from two groups,
weighted by their degrees of freedom. Used in two-sample t-tests.

Formula: ((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data1` | `ArrayLike`\<`number`\> | First group of numbers (must have at least 2 elements) |
| `data2` | `ArrayLike`\<`number`\> | Second group of numbers (must have at least 2 elements) |

#### Returns

`number`

The pooled variance, or NaN if either group has fewer than 2 elements

**`Example`**

```js
import { init, pooledvariance } from '@stats/core';
await init();

const group1 = [1, 2, 3, 4, 5];
const group2 = [6, 7, 8, 9, 10];
const pooledVar = pooledvariance(group1, group2);
```

#### Defined in

[index.ts:1182](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1182)

___

### pooledstdev

▸ **pooledstdev**(`data1`, `data2`): `number`

Calculate pooled standard deviation for two groups.

This is the square root of pooled variance. Used in two-sample t-tests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data1` | `ArrayLike`\<`number`\> | First group of numbers (must have at least 2 elements) |
| `data2` | `ArrayLike`\<`number`\> | Second group of numbers (must have at least 2 elements) |

#### Returns

`number`

The pooled standard deviation, or NaN if either group has fewer than 2 elements

**`Example`**

```js
import { init, pooledstdev } from '@stats/core';
await init();

const group1 = [1, 2, 3, 4, 5];
const group2 = [6, 7, 8, 9, 10];
const pooledStd = pooledstdev(group1, group2);
```

#### Defined in

[index.ts:1230](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1230)

___

### stanMoment

▸ **stanMoment**(`data`, `k`): `number`

Calculate the k-th standardized moment.

Standardized moments are normalized by the standard deviation raised to the k-th power.
- k=1: always 0
- k=2: always 1
- k=3: skewness
- k=4: kurtosis

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |
| `k` | `number` | Moment order (positive integer) |

#### Returns

`number`

The standardized moment, or NaN if data is empty or stdev is zero

**`Example`**

```js
import { init, stanMoment } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const skew = stanMoment(data, 3); // Skewness
const kurt = stanMoment(data, 4); // Kurtosis
```

#### Defined in

[index.ts:1282](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1282)

___

### median

▸ **median**(`data`): `number`

Calculate the median (middle value) of an array.

The median is the value that separates the higher half from the lower half.
Unlike the mean, it's not affected by extreme outliers, making it useful for 
skewed data.

**When to use:** Use median instead of mean when your data has outliers or 
is heavily skewed. For example, income data often uses median because a few 
very high incomes would skew the mean.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The median value, or NaN if array is empty

**`Example`**

```js
import { init, median, mean } from '@stats/core';
await init();

// Data with an outlier
const salaries = [40000, 45000, 50000, 55000, 200000];

console.log(mean(salaries));  // 78000 (skewed by outlier)
console.log(median(salaries)); // 50000 (better representation)
```

#### Defined in

[index.ts:1328](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1328)

___

### mode

▸ **mode**(`data`): `number`

Calculate the mode (most frequent value) of an array.

The mode is the value that appears most often in your data. Unlike mean and median,
mode can be used with categorical data too.

**When to use:** Find the most common value in your dataset. Useful for finding 
the most popular choice, most common score, or most frequent measurement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The mode (most frequent value), or NaN if array is empty

**`Example`**

```js
import { init, mode } from '@stats/core';
await init();

// Most common test score
const scores = [85, 90, 85, 78, 85, 92];
const mostCommon = mode(scores); // 85

// Most common shoe size
const shoeSizes = [8, 9, 9, 10, 9, 8, 11];
const popularSize = mode(shoeSizes); // 9
```

#### Defined in

[index.ts:1374](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1374)

___

### geomean

▸ **geomean**(`data`): `number`

Calculate the geometric mean of an array.

The geometric mean is the nth root of the product of n values. It's useful for 
rates of change, ratios, and percentages. All values must be positive.

**When to use:** Use for growth rates, investment returns, or any multiplicative 
data. For example, calculating average growth rate over multiple periods.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of positive numbers |

#### Returns

`number`

The geometric mean, or NaN if array is empty or contains non-positive values

**`Example`**

```js
import { init, geomean } from '@stats/core';
await init();

// Average annual growth rate over 3 years
const growthRates = [1.05, 1.10, 1.08]; // 5%, 10%, 8% growth
const avgGrowth = geomean(growthRates); // ~1.076 (7.6% average)

// Compare with arithmetic mean (incorrect for growth rates)
// Arithmetic mean would give 1.077, but geometric mean is correct
```

#### Defined in

[index.ts:1419](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1419)

___

### skewness

▸ **skewness**(`data`): `number`

Calculate the skewness (asymmetry) of an array.

Skewness measures how asymmetrical your data distribution is:
- **Zero**: Symmetrical distribution (like a bell curve)
- **Positive**: Right-skewed (tail extends to the right, mean > median)
- **Negative**: Left-skewed (tail extends to the left, mean < median)

**When to use:** Understand the shape of your data distribution. Helps decide 
whether to use mean or median as your measure of center.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers (must have at least 3 elements) |

#### Returns

`number`

The skewness value, or NaN if array has less than 3 elements

**`Example`**

```js
import { init, skewness } from '@stats/core';
await init();

// Right-skewed data (most values low, few very high)
const incomes = [30000, 35000, 40000, 45000, 50000, 200000];
const skew = skewness(incomes); // Positive value (right-skewed)

// Symmetrical data
const symmetric = [1, 2, 3, 4, 5];
const skew2 = skewness(symmetric); // Close to 0
```

#### Defined in

[index.ts:1467](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1467)

___

### kurtosis

▸ **kurtosis**(`data`): `number`

Calculate the kurtosis (tail heaviness) of an array.

Kurtosis measures how heavy the tails of your distribution are compared to a 
normal distribution:
- **Zero**: Normal distribution (mesokurtic)
- **Positive**: Heavy tails, more outliers (leptokurtic)
- **Negative**: Light tails, fewer outliers (platykurtic)

**When to use:** Understand the tail behavior of your data. High kurtosis means 
more extreme values than expected in a normal distribution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers (must have at least 4 elements) |

#### Returns

`number`

The kurtosis value, or NaN if array has less than 4 elements

**`Example`**

```js
import { init, kurtosis } from '@stats/core';
await init();

// Data with many extreme values
const data = [1, 2, 3, 4, 5, 100, 200];
const kurt = kurtosis(data); // Positive (heavy tails)

// Uniform distribution (light tails)
const uniform = [1, 2, 3, 4, 5];
const kurt2 = kurtosis(uniform); // Negative (light tails)
```

#### Defined in

[index.ts:1516](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1516)

___

### min

▸ **min**(`data`): `number`

Find the minimum (smallest) value in an array.

Returns the smallest number in your dataset. Useful for finding the lowest 
score, minimum temperature, smallest measurement, etc.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The minimum value, or NaN if array is empty

**`Example`**

```js
import { init, min } from '@stats/core';
await init();

const temperatures = [72, 68, 75, 80, 65];
const coldest = min(temperatures); // 65

const scores = [85, 90, 78, 92, 88];
const lowestScore = min(scores); // 78
```

#### Defined in

[index.ts:1557](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1557)

___

### max

▸ **max**(`data`): `number`

Find the maximum (largest) value in an array.

Returns the largest number in your dataset. Useful for finding the highest 
score, maximum temperature, largest measurement, etc.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The maximum value, or NaN if array is empty

**`Example`**

```js
import { init, max } from '@stats/core';
await init();

const temperatures = [72, 68, 75, 80, 65];
const hottest = max(temperatures); // 80

const scores = [85, 90, 78, 92, 88];
const highestScore = max(scores); // 92
```

#### Defined in

[index.ts:1589](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1589)

___

### product

▸ **product**(`data`): `number`

Calculate the product (multiplication) of all values in an array.

Multiplies all numbers together. Useful for calculating compound growth, 
probabilities of independent events, or any multiplicative operation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The product of all values, or NaN if array is empty

**`Example`**

```js
import { init, product } from '@stats/core';
await init();

// Compound growth over 3 years
const multipliers = [1.05, 1.10, 1.08];
const totalGrowth = product(multipliers); // 1.2474 (24.74% total)

// Probability of independent events
const probabilities = [0.5, 0.6, 0.7];
const combinedProb = product(probabilities); // 0.21
```

#### Defined in

[index.ts:1623](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1623)

___

### range

▸ **range**(`data`): `number`

Calculate the range (difference between max and min) of an array.

The range shows the spread of your data - how much variation exists between 
the smallest and largest values. Simple but useful for understanding data spread.

**Note:** Range is sensitive to outliers. A single extreme value can make 
the range very large.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`number`

The range (max - min), or NaN if array is empty

**`Example`**

```js
import { init, range } from '@stats/core';
await init();

const temperatures = [72, 68, 75, 80, 65];
const tempRange = range(temperatures); // 15 (80 - 65)

const scores = [85, 90, 78, 92, 88];
const scoreRange = range(scores); // 14 (92 - 78)
```

#### Defined in

[index.ts:1658](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1658)

___

### cumsum

▸ **cumsum**(`data`): `Float64Array`

Calculate the cumulative sum of an array.

Returns an array where each element is the sum of all previous elements plus 
the current element. Useful for tracking running totals, cumulative growth, 
or accumulated values over time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`Float64Array`

Array of cumulative sums

**`Example`**

```js
import { init, cumsum } from '@stats/core';
await init();

// Daily sales
const dailySales = [100, 150, 120, 200, 180];
const cumulative = cumsum(dailySales);
// Result: [100, 250, 370, 570, 750]
// Day 1: 100, Day 2: 250 (100+150), Day 3: 370 (100+150+120), etc.

// Running total of scores
const scores = [10, 20, 15, 25];
const runningTotal = cumsum(scores); // [10, 30, 45, 70]
```

#### Defined in

[index.ts:1698](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1698)

___

### cumprod

▸ **cumprod**(`data`): `Float64Array`

Calculate the cumulative product of an array.

Returns an array where each element is the product of all previous elements 
multiplied by the current element. Useful for tracking compound growth over time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`Float64Array`

Array of cumulative products

**`Example`**

```js
import { init, cumprod } from '@stats/core';
await init();

// Monthly growth multipliers
const growth = [1.02, 1.03, 1.01, 1.04];
const cumulative = cumprod(growth);
// Result: [1.02, 1.0506, 1.0611, 1.1035]
// Shows cumulative growth: 2%, then 5.06%, then 6.11%, then 10.35%
```

#### Defined in

[index.ts:1739](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1739)

___

### diff

▸ **diff**(`data`): `Float64Array`

Calculate differences between consecutive elements.

Returns an array where each element is the difference between the current 
and previous value. Useful for finding changes, growth rates, or deltas over time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers (must have at least 2 elements) |

#### Returns

`Float64Array`

Array of differences (length will be data.length - 1)

**`Example`**

```js
import { init, diff } from '@stats/core';
await init();

// Daily temperature changes
const temps = [72, 75, 73, 78, 80];
const changes = diff(temps); // [3, -2, 5, 2]
// Day 1→2: +3°, Day 2→3: -2°, Day 3→4: +5°, Day 4→5: +2°

// Month-over-month sales growth
const sales = [1000, 1200, 1100, 1500];
const growth = diff(sales); // [200, -100, 400]
```

#### Defined in

[index.ts:1783](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1783)

___

### cumreduce

▸ **cumreduce**(`data`, `init`, `reducer`): `Float64Array`

Cumulative reduction: apply a reduction function cumulatively.

Similar to cumsum/cumprod but with a custom reducer function. Applies the reducer
function to each element along with the accumulated value from previous elements.

**When to use:** When you need cumulative operations beyond sum/product, such as
cumulative maximum, cumulative minimum, or custom cumulative calculations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `init` | `number` | Initial value for the accumulator |
| `reducer` | (`acc`: `number`, `val`: `number`) => `number` | Function that takes (accumulator, value) and returns new accumulator |

#### Returns

`Float64Array`

Array of cumulative results (same length as input)

**`Example`**

```js
import { init, cumreduce } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];

// Cumulative sum of squares
const cumSqSum = cumreduce(data, 0, (acc, x) => acc + x * x);
// [1, 5, 14, 30, 55]

// Cumulative maximum
const cumMax = cumreduce(data, -Infinity, (acc, x) => Math.max(acc, x));
// [1, 2, 3, 4, 5]

// Cumulative product with offset
const cumProd = cumreduce(data, 1, (acc, x) => acc * x);
// [1, 2, 6, 24, 120]
```

#### Defined in

[index.ts:1837](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1837)

___

### rank

▸ **rank**(`data`): `Float64Array`

Calculate the ranks of array values.

Assigns ranks to each value, where 1 is the smallest and N is the largest.
Tied values receive the average of their ranks. Useful for non-parametric 
statistics and converting values to ranks.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Array of numbers |

#### Returns

`Float64Array`

Array of ranks (same length as input)

**`Example`**

```js
import { init, rank } from '@stats/core';
await init();

// Rank test scores
const scores = [85, 90, 78, 92, 85];
const ranks = rank(scores); // [2.5, 4, 1, 5, 2.5]
// 78 gets rank 1 (lowest), 85s get rank 2.5 (average of 2 and 3), etc.

// Rank by performance
const performance = [10, 20, 15, 25];
const performanceRanks = rank(performance); // [1, 3, 2, 4]
```

#### Defined in

[index.ts:1879](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1879)

___

### percentile

▸ **percentile**(`data`, `k`, `exclusive?`): `number`

Calculate a percentile value.

Finds the value below which a given percentage of observations fall.
For example, the 90th percentile is the value below which 90% of the data lies.

**Common percentiles:**
- 0.5 (50th percentile) = median
- 0.25 (25th percentile) = first quartile (Q1)
- 0.75 (75th percentile) = third quartile (Q3)
- 0.95 (95th percentile) = value below which 95% of data falls

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` | Input array |
| `k` | `number` | `undefined` | Percentile value between 0.0 and 1.0 (e.g., 0.5 for median, 0.9 for 90th percentile) |
| `exclusive` | `boolean` | `false` | If true, uses exclusive method (R6); if false, uses inclusive method (R7, default) |

#### Returns

`number`

The percentile value, or NaN if k is out of range or array is empty

**`Example`**

```js
import { init, percentile } from '@stats/core';
await init();

// Test scores
const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];

const p50 = percentile(scores, 0.5);  // 86.5 (median)
const p90 = percentile(scores, 0.9);  // ~95 (90th percentile)
const p25 = percentile(scores, 0.25);  // ~77 (25th percentile)
```

#### Defined in

[index.ts:1933](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1933)

___

### percentileOfScore

▸ **percentileOfScore**(`data`, `score`, `strict?`): `number`

Calculate the percentile rank of a score (inverse of percentile).

Finds what percentile a given value falls into. For example, if a score 
is at the 75th percentile, it means 75% of values are below it.

**When to use:** Determine where a specific value ranks relative to your dataset.
Useful for comparing individual scores to the overall distribution.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` | Input array |
| `score` | `number` | `undefined` | Value to find percentile rank for |
| `strict` | `boolean` | `false` | If true, use strict comparison (< instead of <=). Default: false |

#### Returns

`number`

Percentile rank (0.0 to 1.0), or NaN if array is empty

**`Example`**

```js
import { init, percentileOfScore } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];

// What percentile is score 85?
const rank = percentileOfScore(scores, 85); // ~0.4 (40th percentile)

// What percentile is score 90?
const rank90 = percentileOfScore(scores, 90); // ~0.7 (70th percentile)
```

#### Defined in

[index.ts:1985](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L1985)

___

### qscore

▸ **qscore**(`data`, `score`, `strict?`): `number`

Calculate quantile score (same as percentileOfScore).

Finds what quantile a given value falls into. This is an alias for
percentileOfScore for consistency with naming conventions.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` | Input array |
| `score` | `number` | `undefined` | Value to find quantile rank for |
| `strict` | `boolean` | `false` | If true, use strict comparison (< instead of <=). Default: false |

#### Returns

`number`

Quantile score (0.0 to 1.0), or NaN if array is empty

**`Example`**

```js
import { init, qscore } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
const quantile = qscore(scores, 85); // ~0.4 (40th quantile)
```

#### Defined in

[index.ts:2029](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2029)

___

### qtest

▸ **qtest**(`data`, `score`, `qLower`, `qUpper`): `boolean`

Quantile test: test if a value falls within a given quantile range.

Returns true if the score falls within the specified quantile range [qLower, qUpper].
Useful for filtering or categorizing values based on their quantile position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `score` | `number` | Value to test |
| `qLower` | `number` | Lower quantile bound (0.0 to 1.0) |
| `qUpper` | `number` | Upper quantile bound (0.0 to 1.0) |

#### Returns

`boolean`

True if score falls within the quantile range, false otherwise

**`Example`**

```js
import { init, qtest } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];

// Check if score 85 is in the middle 50% (25th to 75th percentile)
const inMiddle = qtest(scores, 85, 0.25, 0.75); // true

// Check if score 95 is in the top 10%
const inTop10 = qtest(scores, 95, 0.9, 1.0); // true
```

#### Defined in

[index.ts:2079](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2079)

___

### percentiles

▸ **percentiles**(`data`, `ps`): `Float64Array`

Calculate multiple percentiles at once.

This is a convenience wrapper around `quantiles` that accepts an array of
percentile values and returns the corresponding values in the data.

**Note:** Percentiles are expressed as quantiles between 0.0 and 1.0,
matching jStat’s behavior. For example, `[0.1, 0.5, 0.9]` corresponds to
the 10th, 50th, and 90th percentiles.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `ps` | `ArrayLike`\<`number`\> | Array of percentile values between 0.0 and 1.0 |

#### Returns

`Float64Array`

Array of percentile values in the same order as `ps`

#### Defined in

[index.ts:2118](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2118)

___

### quantiles

▸ **quantiles**(`data`, `qs`): `Float64Array`

Calculate multiple quantiles at once.

More efficient than calling `percentile` multiple times. Calculates several 
percentiles in a single operation, which is faster when you need multiple values.

**When to use:** When you need multiple percentiles (e.g., deciles, quartiles) 
from the same dataset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `qs` | `ArrayLike`\<`number`\> | Array of quantile values between 0.0 and 1.0 (e.g., [0.1, 0.5, 0.9] for 10th, 50th, 90th percentiles) |

#### Returns

`Float64Array`

Array of quantile values in the same order as qs

**`Example`**

```js
import { init, quantiles } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];

// Calculate deciles (10th, 20th, ..., 90th percentiles)
const deciles = quantiles(scores, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
// Returns array with 9 values
```

#### Defined in

[index.ts:2150](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2150)

___

### quartiles

▸ **quartiles**(`data`): [`number`, `number`, `number`]

Calculate the quartiles (Q1, Q2/median, Q3) of an array.

Quartiles divide your data into four equal parts:
- **Q1 (25th percentile)**: 25% of values are below this
- **Q2 (50th percentile)**: The median - 50% of values are below this
- **Q3 (75th percentile)**: 75% of values are below this

**When to use:** Understand data distribution, create box plots, or identify outliers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |

#### Returns

[`number`, `number`, `number`]

Array [q1, q2, q3] matching jStat behavior

**`Example`**

```js
import { init, quartiles } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
const [q1, q2, q3] = quartiles(scores);
// q1 ≈ 77, q2 ≈ 86.5 (median), q3 ≈ 92
```

#### Defined in

[index.ts:2201](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2201)

___

### iqr

▸ **iqr**(`data`): `number`

Calculate the interquartile range (IQR).

IQR is the range of the middle 50% of your data (Q3 - Q1). It's a robust 
measure of spread that's not affected by outliers, unlike the regular range.

**When to use:** Measure spread when you have outliers, or identify outliers 
(values outside Q1 - 1.5×IQR or Q3 + 1.5×IQR are typically considered outliers).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |

#### Returns

`number`

The interquartile range (Q3 - Q1), or NaN if array is empty

**`Example`**

```js
import { init, iqr } from '@stats/core';
await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
const spread = iqr(scores); // ~15 (92 - 77)

// Identify outliers: values outside [Q1 - 1.5×IQR, Q3 + 1.5×IQR]
```

#### Defined in

[index.ts:2244](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2244)

___

### weightedPercentile

▸ **weightedPercentile**(`data`, `weights`, `p`): `number`

Calculate a weighted percentile using linear interpolation.

Uses the cumulative weight method: sorts data by value, computes cumulative
weights, normalizes to [0, 1], and interpolates to find the value at the
desired quantile position.

**When to use:** When observations have different importance or frequency weights,
such as survey data with sampling weights, or aggregated data where each value
represents multiple observations.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array of values |
| `weights` | `ArrayLike`\<`number`\> | Array of weights (must be same length as data, all non-negative) |
| `p` | `number` | Percentile value between 0.0 and 1.0 (e.g., 0.5 for weighted median) |

#### Returns

`number`

The interpolated weighted percentile value, or NaN for invalid inputs

**`Example`**

```js
import { init, weightedPercentile } from '@addmaple/stats';
await init();

const values = [1, 2, 3, 4, 5];
const weights = [1, 1, 1, 1, 5];  // Value 5 has 5x more weight

// Weighted median - will be pulled toward 5 due to its higher weight
const median = weightedPercentile(values, weights, 0.5);
console.log(median); // ~4.5

// Compare with equal weights (regular percentile behavior)
const equalWeights = [1, 1, 1, 1, 1];
const regularMedian = weightedPercentile(values, equalWeights, 0.5);
console.log(regularMedian); // 3
```

#### Defined in

[index.ts:2302](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2302)

___

### weightedQuantiles

▸ **weightedQuantiles**(`data`, `weights`, `qs`): `Float64Array`

Calculate multiple weighted quantiles at once.

More efficient than calling `weightedPercentile` multiple times when you need
several weighted quantiles from the same dataset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array of values |
| `weights` | `ArrayLike`\<`number`\> | Array of weights (must be same length as data, all non-negative) |
| `qs` | `ArrayLike`\<`number`\> | Array of quantile values between 0.0 and 1.0 |

#### Returns

`Float64Array`

Array of weighted quantile values in the same order as qs

**`Example`**

```js
import { init, weightedQuantiles } from '@addmaple/stats';
await init();

const income = [20000, 40000, 60000, 80000, 100000];
const population = [1000, 800, 500, 300, 100];  // More people earn less

// Calculate weighted quartiles
const [q1, median, q3] = weightedQuantiles(income, population, [0.25, 0.5, 0.75]);
// Results will be weighted toward lower incomes
```

#### Defined in

[index.ts:2334](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2334)

___

### weightedMedian

▸ **weightedMedian**(`data`, `weights`): `number`

Calculate the weighted median (50th weighted percentile).

The weighted median is the value that divides the total weight in half.
This is a convenience function equivalent to `weightedPercentile(data, weights, 0.5)`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array of values |
| `weights` | `ArrayLike`\<`number`\> | Array of weights (must be same length as data) |

#### Returns

`number`

The weighted median value

**`Example`**

```js
import { init, weightedMedian } from '@addmaple/stats';
await init();

// Survey data: respondent ages with sampling weights
const ages = [25, 35, 45, 55, 65];
const sampleWeights = [100, 150, 200, 120, 80];

const medianAge = weightedMedian(ages, sampleWeights);
console.log(medianAge); // Weighted toward middle ages due to higher weights
```

#### Defined in

[index.ts:2365](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2365)

___

### descriptiveStats

▸ **descriptiveStats**(`data`): [`DescriptiveStatsResult`](interfaces/DescriptiveStatsResult.md)

Calculate a rich set of descriptive statistics for an array in one call.

This helper wraps core vector statistics (mean, variance, quartiles, skewness, etc.)
and returns them in a single object, so you don't need to call each function
individually.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array of numbers |

#### Returns

[`DescriptiveStatsResult`](interfaces/DescriptiveStatsResult.md)

An object with common descriptive statistics

**`Example`**

```js
import { init, descriptiveStats } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5];
const stats = descriptiveStats(data);

console.log(stats.mean);   // 3
console.log(stats.median); // 3
console.log(stats.min);    // 1
console.log(stats.max);    // 5
```

#### Defined in

[index.ts:2396](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2396)

___

### histogram

▸ **histogram**(`data`, `binCount?`): `Float64Array`

Calculate a histogram with automatic bin width.

Groups your data into bins (ranges) and counts how many values fall into each bin.
Useful for visualizing data distribution and understanding the shape of your data.

**When to use:** Understand data distribution, create visualizations, or identify 
patterns in your data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` | Input array |
| `binCount` | `number` | `4` | Number of bins to create (default: 4) |

#### Returns

`Float64Array`

Array of counts per bin (length equals binCount)

**`Example`**

```js
import { init, histogram } from '@stats/core';
await init();

// Test scores
const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];
const bins = histogram(scores, 5);
// Returns: [2, 2, 2, 2, 2] (counts for each of 5 bins)
```

#### Defined in

[index.ts:2499](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2499)

___

### histogramEdges

▸ **histogramEdges**(`data`, `edges`): `Float64Array`

Calculate a histogram with custom bin edges.

Like `histogram`, but allows you to specify exact bin boundaries. Useful when 
you need specific ranges (e.g., age groups, income brackets).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `edges` | `ArrayLike`\<`number`\> | Bin edges (must be sorted, length = num_bins + 1). Example: [0, 10, 20, 30] creates bins [0-10), [10-20), [20-30) |

#### Returns

`Float64Array`

Array of counts per bin (length equals edges.length - 1)

**`Example`**

```js
import { init, histogramEdges } from '@stats/core';
await init();

const ages = [22, 25, 28, 32, 35, 38, 42, 45];
const ageGroups = histogramEdges(ages, [20, 30, 40, 50]);
// Returns counts for: [20-30), [30-40), [40-50)
```

#### Defined in

[index.ts:2543](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2543)

___

### histogramBinning

▸ **histogramBinning**(`data`, `binSettings`): [`HistogramBinningResult`](interfaces/HistogramBinningResult.md)

Calculate histogram using advanced binning strategies.

Supports multiple binning modes:
- **auto**: Automatic binning using statistical rules (FD, Scott, sqrtN)
- **equalFrequency**: Quantile-based binning (each bin has roughly equal counts)
- **fixedWidth**: Fixed-width bins (linear spacing from min to max)
- **custom**: User-defined bin edges

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array |
| `binSettings` | `number` \| [`BinOption`](interfaces/BinOption.md) | Number of bins (legacy) or BinOption object |

#### Returns

[`HistogramBinningResult`](interfaces/HistogramBinningResult.md)

Object with `edges` and `counts` arrays

**`Example`**

```js
import { init, histogramBinning } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Fixed-width binning
const result1 = histogramBinning(data, { mode: 'fixedWidth', bins: 5 });

// Auto binning with Freedman-Diaconis rule
const result2 = histogramBinning(data, { mode: 'auto', rule: 'FD' });

// Equal-frequency binning
const result3 = histogramBinning(data, { mode: 'equalFrequency', bins: 4 });

// Custom edges
const result4 = histogramBinning(data, { 
  mode: 'custom', 
  edges: [0, 3, 6, 10] 
});

// Legacy: number of bins (treats as auto mode)
const result5 = histogramBinning(data, 5);
```

#### Defined in

[index.ts:2655](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2655)

___

### histogramBinningWeighted

▸ **histogramBinningWeighted**(`data`, `weights`, `binSettings`): [`WeightedHistogramBinningResult`](interfaces/WeightedHistogramBinningResult.md)

Weighted histogram binning for aggregated data.

This is designed for inputs like engine’s `[value, count]` pairs:
pass the numeric values as `data`, and their counts as `weights`.

- For **equalFrequency**, edges are computed with `weightedQuantiles`.
- For **auto (FD/Scott/sqrtN)**, bin count uses total weight as \(n\).
- For **custom**, edges are used as-is; you can opt into clamping with `clampOutside`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `weights` | `ArrayLike`\<`number`\> |
| `binSettings` | `number` \| `WeightedBinOption` |

#### Returns

[`WeightedHistogramBinningResult`](interfaces/WeightedHistogramBinningResult.md)

#### Defined in

[index.ts:2943](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L2943)

___

### covariance

▸ **covariance**(`x`, `y`): `number`

Calculate the covariance between two arrays.

Covariance measures how two variables change together:
- **Positive**: Variables tend to increase/decrease together
- **Negative**: One increases while the other decreases
- **Zero**: No linear relationship

**Note:** Covariance is scale-dependent. Use `corrcoeff` for a normalized 
measure (-1 to 1) that's easier to interpret.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | First array of numbers |
| `y` | `ArrayLike`\<`number`\> | Second array of numbers (must have same length as x) |

#### Returns

`number`

The covariance value, or NaN if arrays are empty or different lengths

**`Example`**

```js
import { init, covariance } from '@stats/core';
await init();

// Height and weight (positive covariance - taller people tend to weigh more)
const heights = [65, 68, 70, 72, 74];
const weights = [120, 140, 160, 180, 200];
const cov = covariance(heights, weights); // Positive value
```

#### Defined in

[index.ts:3256](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3256)

___

### corrcoeff

▸ **corrcoeff**(`x`, `y`): `number`

Calculate the Pearson correlation coefficient between two arrays.

Measures the strength and direction of a linear relationship between two variables.
Returns a value between -1 and 1:
- **1**: Perfect positive correlation (as one increases, the other increases)
- **-1**: Perfect negative correlation (as one increases, the other decreases)
- **0**: No linear correlation
- **0.7-0.9**: Strong correlation
- **0.3-0.7**: Moderate correlation
- **0-0.3**: Weak correlation

**When to use:** Measure linear relationships. For non-linear or monotonic 
relationships, use `spearmancoeff` instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | First array of numbers |
| `y` | `ArrayLike`\<`number`\> | Second array of numbers (must have same length as x) |

#### Returns

`number`

Correlation coefficient (-1 to 1), or NaN if arrays are empty or different lengths

**`Example`**

```js
import { init, corrcoeff } from '@stats/core';
await init();

// Study hours vs test scores (likely strong positive correlation)
const studyHours = [5, 10, 15, 20, 25];
const testScores = [60, 70, 80, 85, 90];
const correlation = corrcoeff(studyHours, testScores); // ~0.98 (strong positive)
```

#### Defined in

[index.ts:3313](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3313)

___

### spearmancoeff

▸ **spearmancoeff**(`x`, `y`): `number`

Calculate the Spearman rank correlation coefficient between two arrays.

Measures monotonic relationships (not just linear). Uses ranks instead of 
raw values, making it robust to outliers and non-linear relationships.

**When to use:** 
- Non-linear but monotonic relationships
- Data with outliers
- Ordinal data
- When you want a measure that works for any monotonic relationship

Returns a value between -1 and 1, interpreted similarly to Pearson correlation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | First array of numbers |
| `y` | `ArrayLike`\<`number`\> | Second array of numbers (must have same length as x) |

#### Returns

`number`

Spearman correlation coefficient (-1 to 1), or NaN if arrays are empty or different lengths

**`Example`**

```js
import { init, spearmancoeff, corrcoeff } from '@stats/core';
await init();

// Exponential relationship (non-linear but monotonic)
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 8, 16, 32]; // Exponential growth

const pearson = corrcoeff(x, y);  // Less than 1 (not perfectly linear)
const spearman = spearmancoeff(x, y); // 1.0 (perfect monotonic relationship)
```

#### Defined in

[index.ts:3371](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3371)

___

### anovaFScore

▸ **anovaFScore**(`groups`): `number`

Calculate the F-score for one-way ANOVA (Analysis of Variance).

ANOVA tests whether there are statistically significant differences between 
the means of multiple groups. The F-score measures the ratio of variance 
between groups to variance within groups.

**When to use:** Compare means across 3+ groups (for 2 groups, use a t-test).
Common use cases: comparing test scores across different teaching methods, 
comparing sales across regions, comparing drug efficacy across dosages.

**Interpretation:**
- Higher F-score = more difference between group means
- Use `anovaTest` to get p-value for statistical significance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groups` | `ArrayLike`\<`number`\>[] | Array of groups, where each group is an array of numbers |

#### Returns

`number`

The F-score, or NaN if less than 2 groups or any group is empty

**`Example`**

```js
import { init, anovaFScore } from '@stats/core';
await init();

// Compare test scores across three teaching methods
const methodA = [75, 78, 80, 82, 85];
const methodB = [70, 72, 75, 77, 80];
const methodC = [85, 88, 90, 92, 95];

const fScore = anovaFScore([methodA, methodB, methodC]);
// Higher F-score suggests significant differences between methods
```

#### Defined in

[index.ts:3441](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3441)

___

### anovaTest

▸ **anovaTest**(`groups`): [`AnovaResult`](interfaces/AnovaResult.md)

Perform one-way ANOVA test with full results including p-value.

Complete ANOVA analysis that returns F-score, degrees of freedom, and p-value.
The p-value tells you whether the differences between groups are statistically 
significant.

**Interpretation:**
- **p < 0.05**: Significant difference between groups (reject null hypothesis)
- **p >= 0.05**: No significant difference (fail to reject null hypothesis)

**When to use:** When you need both the F-score and statistical significance 
(p-value) to make decisions about whether groups differ.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groups` | `ArrayLike`\<`number`\>[] | Array of groups, where each group is an array of numbers |

#### Returns

[`AnovaResult`](interfaces/AnovaResult.md)

Object with:
  - `fScore`: F-statistic
  - `dfBetween`: Degrees of freedom between groups
  - `dfWithin`: Degrees of freedom within groups  
  - `pValue`: P-value (probability of observing this result if groups are equal)

**`Example`**

```js
import { init, anovaTest } from '@stats/core';
await init();

// Compare drug efficacy across three dosages
const lowDose = [45, 50, 55, 48, 52];
const mediumDose = [60, 65, 70, 63, 67];
const highDose = [75, 80, 85, 78, 82];

const result = anovaTest([lowDose, mediumDose, highDose]);

if (result.pValue && result.pValue < 0.05) {
  console.log('Significant difference: dosage matters!');
} else {
  console.log('No significant difference between dosages');
}
```

#### Defined in

[index.ts:3530](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3530)

___

### chiSquareTest

▸ **chiSquareTest**(`cat1`, `cat2`, `options?`): [`ChiSquareResult`](interfaces/ChiSquareResult.md)

Chi-square test of independence for two categorical variables.

Tests whether two categorical variables are independent.

**When to use:** Test if there's a relationship between two categorical variables.
Common use cases: testing if gender is independent of voting preference,
testing if treatment type is independent of outcome, etc.

**Interpretation:**
- **p < 0.05**: Variables are NOT independent (reject null hypothesis)
- **p >= 0.05**: No evidence that variables are dependent (fail to reject null hypothesis)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cat1` | `ArrayLike`\<`string` \| `number`\> | First array of categorical values (strings or numbers) |
| `cat2` | `ArrayLike`\<`string` \| `number`\> | Second array of categorical values (strings or numbers), must be same length as cat1 |
| `options?` | `Object` | Optional parameters: - `cardinality1`: Number of unique categories in cat1 (for optimization) - `cardinality2`: Number of unique categories in cat2 (for optimization) |
| `options.cardinality1?` | `number` | - |
| `options.cardinality2?` | `number` | - |

#### Returns

[`ChiSquareResult`](interfaces/ChiSquareResult.md)

Object with:
  - `statistic`: Chi-square statistic
  - `pValue`: P-value (probability of observing this result if variables are independent)
  - `df`: Degrees of freedom

**`Example`**

```js
import { init, chiSquareTest } from '@stats/core';
await init();

// Test if gender is independent of voting preference
const gender = ["M", "M", "F", "F", "M", "F"];
const vote = ["A", "B", "A", "A", "B", "B"];

const result = chiSquareTest(gender, vote);

if (result.pValue < 0.05) {
  console.log('Gender and voting preference are NOT independent');
} else {
  console.log('No evidence that gender affects voting preference');
}
```

**`Example`**

```js
// With cardinality hints for faster performance
const result = chiSquareTest(gender, vote, {
  cardinality1: 2, // gender has 2 unique values (M, F)
  cardinality2: 2  // vote has 2 unique values (A, B)
});
```

#### Defined in

[index.ts:3612](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3612)

___

### anovaFScoreCategorical

▸ **anovaFScoreCategorical**(`groups`, `values`): `number`

Calculate the F-score for one-way ANOVA using categorical grouping.

This is an alternative interface to `anovaFScore` that accepts:
- A categorical array of group labels
- A numeric array of values corresponding to each label

**When to use:** When your data is stored as pairs of (group, value) rather than
pre-grouped arrays. More convenient when data comes from a table or database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groups` | `ArrayLike`\<`string` \| `number`\> | Array of categorical group labels (strings or numbers) |
| `values` | `ArrayLike`\<`number`\> | Array of numeric values corresponding to each group label |

#### Returns

`number`

The F-score, or NaN if invalid input

**`Example`**

```js
import { init, anovaFScoreCategorical } from '@stats/core';
await init();

// Compare test scores across three teaching methods
const methods = ["A", "A", "A", "B", "B", "B", "C", "C", "C"];
const scores = [75, 78, 80, 70, 72, 75, 85, 88, 90];

const fScore = anovaFScoreCategorical(methods, scores);
```

#### Defined in

[index.ts:3680](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3680)

___

### anovaTestCategorical

▸ **anovaTestCategorical**(`groups`, `values`): [`AnovaResult`](interfaces/AnovaResult.md)

Perform one-way ANOVA test with categorical grouping and full results including p-value.

This is an alternative interface to `anovaTest` that accepts:
- A categorical array of group labels
- A numeric array of values corresponding to each label

**When to use:** When your data is stored as pairs of (group, value) rather than
pre-grouped arrays, and you need both F-score and p-value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `groups` | `ArrayLike`\<`string` \| `number`\> | Array of categorical group labels (strings or numbers) |
| `values` | `ArrayLike`\<`number`\> | Array of numeric values corresponding to each group label |

#### Returns

[`AnovaResult`](interfaces/AnovaResult.md)

Object with:
  - `fScore`: F-statistic
  - `dfBetween`: Degrees of freedom between groups
  - `dfWithin`: Degrees of freedom within groups  
  - `pValue`: P-value (probability of observing this result if groups are equal)

**`Example`**

```js
import { init, anovaTestCategorical } from '@stats/core';
await init();

// Compare drug efficacy across three dosages
const dosages = ["low", "low", "low", "medium", "medium", "medium", "high", "high", "high"];
const efficacy = [45, 50, 55, 60, 65, 70, 75, 80, 85];

const result = anovaTestCategorical(dosages, efficacy);

if (result.pValue && result.pValue < 0.05) {
  console.log('Significant difference: dosage matters!');
} else {
  console.log('No significant difference between dosages');
}
```

#### Defined in

[index.ts:3735](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3735)

___

### normal

▸ **normal**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a normal (Gaussian) distribution.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`NormalParams`](interfaces/NormalParams.md) | Distribution parameters |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

Distribution handle with pdf, cdf, and inv methods

**`Example`**

```js
import { init, normal } from '@stats/core';
await init();

const dist = normal({ mean: 100, sd: 15 });
console.log(dist.pdf(100));  // Density at mean
console.log(dist.cdf(115));  // P(X <= 115)
console.log(dist.inv(0.95)); // 95th percentile
```

#### Defined in

[index.ts:3800](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3800)

___

### gamma

▸ **gamma**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`GammaParams`](interfaces/GammaParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3822](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3822)

___

### beta

▸ **beta**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`BetaParams`](interfaces/BetaParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3845](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3845)

___

### studentT

▸ **studentT**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`StudentTParams`](interfaces/StudentTParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3867](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3867)

___

### chiSquared

▸ **chiSquared**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ChiSquaredParams`](interfaces/ChiSquaredParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3893](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3893)

___

### fisherF

▸ **fisherF**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`FisherFParams`](interfaces/FisherFParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3915](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3915)

___

### exponential

▸ **exponential**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ExponentialParams`](interfaces/ExponentialParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:3936](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3936)

___

### poisson

▸ **poisson**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Poisson distribution handle.

The Poisson distribution models the number of events occurring in a fixed interval
of time or space, given a constant average rate (lambda).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`PoissonParams`](interfaces/PoissonParams.md) | Distribution parameters |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

Distribution handle with pdf, cdf, inv, pdfArray, cdfArray methods

**`Example`**

```js
import { init, poisson } from '@stats/core';
await init();

const dist = poisson({ lambda: 3 });
const prob = dist.pdf(2); // Probability of exactly 2 events
const cumProb = dist.cdf(5); // Probability of 5 or fewer events
```

#### Defined in

[index.ts:3979](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L3979)

___

### binomial

▸ **binomial**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Binomial distribution handle.

The Binomial distribution models the number of successes in n independent
Bernoulli trials, each with probability p of success.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`BinomialParams`](interfaces/BinomialParams.md) | Distribution parameters |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

Distribution handle with pdf, cdf, inv, pdfArray, cdfArray methods

**`Example`**

```js
import { init, binomial } from '@stats/core';
await init();

const dist = binomial({ n: 20, p: 0.3 });
const prob = dist.pdf(5); // Probability of exactly 5 successes
const cumProb = dist.cdf(10); // Probability of 10 or fewer successes
```

#### Defined in

[index.ts:4020](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4020)

___

### uniform

▸ **uniform**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Uniform distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`UniformParams`](interfaces/UniformParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4044](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4044)

___

### cauchy

▸ **cauchy**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Cauchy distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CauchyParams`](interfaces/CauchyParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4068](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4068)

___

### laplace

▸ **laplace**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Laplace distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LaplaceParams`](interfaces/LaplaceParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4092](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4092)

___

### logNormal

▸ **logNormal**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Log-normal distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LogNormalParams`](interfaces/LogNormalParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4116](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4116)

___

### weibull

▸ **weibull**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Weibull distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`WeibullParams`](interfaces/WeibullParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4140](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4140)

___

### pareto

▸ **pareto**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Pareto distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ParetoParams`](interfaces/ParetoParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4164](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4164)

___

### triangular

▸ **triangular**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Triangular distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`TriangularParams`](interfaces/TriangularParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4189](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4189)

___

### inverseGamma

▸ **inverseGamma**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create an Inverse Gamma distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`InverseGammaParams`](interfaces/InverseGammaParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4214](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4214)

___

### negativeBinomial

▸ **negativeBinomial**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

Create a Negative Binomial distribution handle.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`NegativeBinomialParams`](interfaces/NegativeBinomialParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[index.ts:4238](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4238)

___

### ttest

▸ **ttest**(`data`, `mu0`): [`TestResult`](interfaces/TestResult.md)

One-sample t-test: tests if sample mean equals a hypothesized value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Sample data |
| `mu0` | `number` | Hypothesized population mean |

#### Returns

[`TestResult`](interfaces/TestResult.md)

Test result with t-statistic, p-value, and degrees of freedom

**`Example`**

```js
import { init, ttest } from '@stats/core';
await init();

const sample = [1, 2, 3, 4, 5];
const result = ttest(sample, 3);
console.log(`t=${result.statistic}, p=${result.p_value}`);
```

#### Defined in

[index.ts:4271](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4271)

___

### ztest

▸ **ztest**(`data`, `mu0`, `sigma`): [`TestResult`](interfaces/TestResult.md)

One-sample z-test: tests if sample mean equals a hypothesized value with known population standard deviation

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Sample data |
| `mu0` | `number` | Hypothesized population mean |
| `sigma` | `number` | Known population standard deviation |

#### Returns

[`TestResult`](interfaces/TestResult.md)

Test result with z-statistic and p-value

**`Example`**

```js
import { init, ztest } from '@stats/core';
await init();

const sample = [1, 2, 3, 4, 5];
const result = ztest(sample, 3, 1.414);
console.log(`z=${result.statistic}, p=${result.p_value}`);
```

#### Defined in

[index.ts:4316](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4316)

___

### regress

▸ **regress**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Simple linear regression: y = slope * x + intercept

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | Independent variable values |
| `y` | `ArrayLike`\<`number`\> | Dependent variable values |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

Regression result with slope, intercept, R², and residuals

**`Example`**

```js
import { init, regress } from '@stats/core';
await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
const result = regress(x, y);
console.log(`slope=${result.slope}, intercept=${result.intercept}, R²=${result.r_squared}`);
```

#### Defined in

[index.ts:4362](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4362)

___

### regressNaive

▸ **regressNaive**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Naive linear regression implementation (scalar, multi-pass).
Intentionally non-optimized for performance comparison.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | Independent variable values |
| `y` | `ArrayLike`\<`number`\> | Dependent variable values |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

Regression result with slope, intercept, R², and residuals

#### Defined in

[index.ts:4416](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4416)

___

### regressSimd

▸ **regressSimd**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

SIMD-optimized linear regression (fused sums, single-pass for statistics).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | Independent variable values |
| `y` | `ArrayLike`\<`number`\> | Dependent variable values |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

Regression result with slope, intercept, R², and residuals

#### Defined in

[index.ts:4469](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4469)

___

### regressWasmKernels

▸ **regressWasmKernels**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

BLAS-like kernels-based linear regression.
Uses minimal kernel operations (dot product, sum, axpy-style residuals).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `ArrayLike`\<`number`\> | Independent variable values |
| `y` | `ArrayLike`\<`number`\> | Dependent variable values |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

Regression result with slope, intercept, R², and residuals

#### Defined in

[index.ts:4523](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4523)

___

### regressCoeffs

▸ **regressCoeffs**(`x`, `y`): [`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

Coefficients-only regression (no residual allocation/copy).
Best for performance-sensitive workloads and benchmarking.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Defined in

[index.ts:4601](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4601)

___

### regressNaiveCoeffs

▸ **regressNaiveCoeffs**(`x`, `y`): [`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Defined in

[index.ts:4605](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4605)

___

### regressSimdCoeffs

▸ **regressSimdCoeffs**(`x`, `y`): [`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Defined in

[index.ts:4609](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4609)

___

### regressWasmKernelsCoeffs

▸ **regressWasmKernelsCoeffs**(`x`, `y`): [`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionCoeffs`](interfaces/RegressionCoeffs.md)

#### Defined in

[index.ts:4613](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4613)

___

### regressSimdCoeffsF32

▸ **regressSimdCoeffsF32**(`x`, `y`): [`RegressionCoeffsF32`](interfaces/RegressionCoeffsF32.md)

f32 coefficients-only regression.

This is primarily aimed at wasm32 SIMD (f32x4) performance.
For best performance, pass `Float32Array` inputs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionCoeffsF32`](interfaces/RegressionCoeffsF32.md)

#### Defined in

[index.ts:4626](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4626)

___

### normalci

▸ **normalci**(`alpha`, `mean`, `se`): [`number`, `number`]

Normal distribution confidence interval

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alpha` | `number` | Significance level (e.g., 0.05 for 95% confidence) |
| `mean` | `number` | Sample mean |
| `se` | `number` | Standard error |

#### Returns

[`number`, `number`]

[lower, upper] confidence interval bounds

**`Example`**

```js
import { init, normalci } from '@stats/core';
await init();

const ci = normalci(0.05, 100, 10);
console.log(`95% CI: [${ci[0]}, ${ci[1]}]`);
```

#### Defined in

[index.ts:4847](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4847)

___

### tci

▸ **tci**(`alpha`, `mean`, `stdev`, `n`): [`number`, `number`]

t-distribution confidence interval

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `alpha` | `number` | Significance level (e.g., 0.05 for 95% confidence) |
| `mean` | `number` | Sample mean |
| `stdev` | `number` | Sample standard deviation |
| `n` | `number` | Sample size |

#### Returns

[`number`, `number`]

[lower, upper] confidence interval bounds

**`Example`**

```js
import { init, tci } from '@stats/core';
await init();

const ci = tci(0.05, 100, 10, 20);
console.log(`95% CI: [${ci[0]}, ${ci[1]}]`);
```

#### Defined in

[index.ts:4878](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L4878)
