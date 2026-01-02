@addmaple/stats API Reference

# @addmaple/stats API Reference - v0.2.4

## Table of contents

### Classes

- [RegressionWorkspace](classes/RegressionWorkspace.md)

### Interfaces

- [DistributionHandle](interfaces/DistributionHandle.md)
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
- [ArrayResult](interfaces/ArrayResult.md)
- [HistogramWithEdgesResult](interfaces/HistogramWithEdgesResult.md)
- [TestResult](interfaces/TestResult.md)
- [RegressionCoeffs](interfaces/RegressionCoeffs.md)
- [RegressionCoeffsF32](interfaces/RegressionCoeffsF32.md)
- [RegressionResult](interfaces/RegressionResult.md)
- [DescriptiveStatsResult](interfaces/DescriptiveStatsResult.md)
- [WasmRegressionResult](interfaces/WasmRegressionResult.md)
- [QuartilesResult](interfaces/QuartilesResult.md)
- [AnovaResult](interfaces/AnovaResult.md)
- [ChiSquareResult](interfaces/ChiSquareResult.md)
- [TukeyPairResult](interfaces/TukeyPairResult.md)
- [TukeyHsdResult](interfaces/TukeyHsdResult.md)
- [StatsWasmModule](interfaces/StatsWasmModule.md)
- [DistributionsWasmModule](interfaces/DistributionsWasmModule.md)
- [QuantilesWasmModule](interfaces/QuantilesWasmModule.md)
- [CorrelationWasmModule](interfaces/CorrelationWasmModule.md)
- [TestsWasmModule](interfaces/TestsWasmModule.md)
- [FullWasmModule](interfaces/FullWasmModule.md)

### Variables

- [BinningPresets](index.md#binningpresets)
- [WASM\_NOT\_INITIALIZED\_ERROR](index.md#wasm_not_initialized_error)

### Functions

- [covariance](index.md#covariance)
- [corrcoeff](index.md#corrcoeff)
- [spearmancoeff](index.md#spearmancoeff)
- [descriptiveStats](index.md#descriptivestats)
- [getDistributionsWasm](index.md#getdistributionswasm)
- [setDistributionsWasm](index.md#setdistributionswasm)
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
- [init](index.md#init)
- [percentile](index.md#percentile)
- [percentileInclusive](index.md#percentileinclusive)
- [percentileExclusive](index.md#percentileexclusive)
- [percentileOfScore](index.md#percentileofscore)
- [qscore](index.md#qscore)
- [qtest](index.md#qtest)
- [quartiles](index.md#quartiles)
- [iqr](index.md#iqr)
- [percentiles](index.md#percentiles)
- [quantiles](index.md#quantiles)
- [weightedPercentile](index.md#weightedpercentile)
- [weightedQuantiles](index.md#weightedquantiles)
- [weightedMedian](index.md#weightedmedian)
- [histogramEdges](index.md#histogramedges)
- [histogramBinning](index.md#histogrambinning)
- [f64View](index.md#f64view)
- [f32View](index.md#f32view)
- [copyToWasmMemory](index.md#copytowasmmemory)
- [copyToWasmMemoryF32](index.md#copytowasmmemoryf32)
- [readWasmArray](index.md#readwasmarray)
- [runUnaryArrayOp](index.md#rununaryarrayop)
- [loadWasmModule](index.md#loadwasmmodule)
- [sum](index.md#sum)
- [mean](index.md#mean)
- [variance](index.md#variance)
- [sampleVariance](index.md#samplevariance)
- [stdev](index.md#stdev)
- [sampleStdev](index.md#samplestdev)
- [min](index.md#min)
- [max](index.md#max)
- [product](index.md#product)
- [range](index.md#range)
- [median](index.md#median)
- [mode](index.md#mode)
- [geomean](index.md#geomean)
- [skewness](index.md#skewness)
- [kurtosis](index.md#kurtosis)
- [stanMoment](index.md#stanmoment)
- [coeffvar](index.md#coeffvar)
- [meandev](index.md#meandev)
- [meddev](index.md#meddev)
- [pooledvariance](index.md#pooledvariance)
- [pooledstdev](index.md#pooledstdev)
- [cumsum](index.md#cumsum)
- [cumprod](index.md#cumprod)
- [diff](index.md#diff)
- [rank](index.md#rank)
- [deviation](index.md#deviation)
- [histogram](index.md#histogram)
- [cumreduce](index.md#cumreduce)
- [ttest](index.md#ttest)
- [ztest](index.md#ztest)
- [normalci](index.md#normalci)
- [tci](index.md#tci)
- [regress](index.md#regress)
- [regressNaive](index.md#regressnaive)
- [regressSimd](index.md#regresssimd)
- [regressWasmKernels](index.md#regresswasmkernels)
- [anovaFScore](index.md#anovafscore)
- [anovaTest](index.md#anovatest)
- [chiSquareTest](index.md#chisquaretest)
- [anovaFScoreCategorical](index.md#anovafscorecategorical)
- [anovaTestCategorical](index.md#anovatestcategorical)
- [tukeyHsdCategorical](index.md#tukeyhsdcategorical)

## Variables

### BinningPresets

• `Const` **BinningPresets**: `Object`

Presets for common histogram binning strategies.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `autoFD` | (`bins?`: `number`) => `HistogramBinningOptions` |
| `autoScott` | (`bins?`: `number`) => `HistogramBinningOptions` |
| `autoSqrt` | (`bins?`: `number`) => `HistogramBinningOptions` |
| `autoWithTailCollapse` | (`k`: `number`, `bins?`: `number`) => `HistogramBinningOptions` |
| `equalFrequency` | (`bins`: `number`) => `HistogramBinningOptions` |
| `fixedWidth` | (`bins`: `number`) => `HistogramBinningOptions` |
| `deciles` | () => `HistogramBinningOptions` |
| `quartiles` | () => `HistogramBinningOptions` |
| `custom` | (`edges`: `Float64Array` \| `number`[]) => `HistogramBinningOptions` |

#### Defined in

[quantiles.ts:394](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L394)

___

### WASM\_NOT\_INITIALIZED\_ERROR

• `Const` **WASM\_NOT\_INITIALIZED\_ERROR**: ``"Wasm module not initialized. Call init() first."``

The consistent error message for uninitialized WASM modules.

#### Defined in

[shared.ts:149](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L149)

## Functions

### covariance

▸ **covariance**(`x`, `y`): `number`

Calculate the covariance between two arrays.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[correlation.ts:66](https://github.com/addmaple/stats/blob/main/js/package/src/correlation.ts#L66)

___

### corrcoeff

▸ **corrcoeff**(`x`, `y`): `number`

Calculate the Pearson correlation coefficient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[correlation.ts:73](https://github.com/addmaple/stats/blob/main/js/package/src/correlation.ts#L73)

___

### spearmancoeff

▸ **spearmancoeff**(`x`, `y`): `number`

Calculate the Spearman rank correlation coefficient.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[correlation.ts:80](https://github.com/addmaple/stats/blob/main/js/package/src/correlation.ts#L80)

___

### descriptiveStats

▸ **descriptiveStats**(`data`): [`DescriptiveStatsResult`](interfaces/DescriptiveStatsResult.md)

Calculate a rich set of descriptive statistics for an array in one call.

This helper wraps core vector statistics (mean, variance, quartiles, skewness, etc.)
and returns them in a single object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | Input array of numbers |

#### Returns

[`DescriptiveStatsResult`](interfaces/DescriptiveStatsResult.md)

An object with common descriptive statistics

#### Defined in

[descriptive.ts:14](https://github.com/addmaple/stats/blob/main/js/package/src/descriptive.ts#L14)

___

### getDistributionsWasm

▸ **getDistributionsWasm**(): [`DistributionsWasmModule`](interfaces/DistributionsWasmModule.md) \| ``null``

Get the current WASM module instance.

#### Returns

[`DistributionsWasmModule`](interfaces/DistributionsWasmModule.md) \| ``null``

#### Defined in

[distributions.ts:14](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L14)

___

### setDistributionsWasm

▸ **setDistributionsWasm**(`mod`): `void`

Set the WASM module instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mod` | [`DistributionsWasmModule`](interfaces/DistributionsWasmModule.md) |

#### Returns

`void`

#### Defined in

[distributions.ts:21](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L21)

___

### normal

▸ **normal**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`NormalParams`](interfaces/NormalParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:76](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L76)

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

[distributions.ts:95](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L95)

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

[distributions.ts:113](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L113)

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

[distributions.ts:132](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L132)

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

[distributions.ts:150](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L150)

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

[distributions.ts:167](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L167)

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

[distributions.ts:185](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L185)

___

### poisson

▸ **poisson**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`PoissonParams`](interfaces/PoissonParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:201](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L201)

___

### binomial

▸ **binomial**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`BinomialParams`](interfaces/BinomialParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:218](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L218)

___

### uniform

▸ **uniform**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`UniformParams`](interfaces/UniformParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:236](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L236)

___

### cauchy

▸ **cauchy**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`CauchyParams`](interfaces/CauchyParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:254](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L254)

___

### laplace

▸ **laplace**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LaplaceParams`](interfaces/LaplaceParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:272](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L272)

___

### logNormal

▸ **logNormal**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`LogNormalParams`](interfaces/LogNormalParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:290](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L290)

___

### weibull

▸ **weibull**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`WeibullParams`](interfaces/WeibullParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:308](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L308)

___

### pareto

▸ **pareto**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`ParetoParams`](interfaces/ParetoParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:326](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L326)

___

### triangular

▸ **triangular**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`TriangularParams`](interfaces/TriangularParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:345](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L345)

___

### inverseGamma

▸ **inverseGamma**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`InverseGammaParams`](interfaces/InverseGammaParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:364](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L364)

___

### negativeBinomial

▸ **negativeBinomial**(`params?`): [`DistributionHandle`](interfaces/DistributionHandle.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`NegativeBinomialParams`](interfaces/NegativeBinomialParams.md) |

#### Returns

[`DistributionHandle`](interfaces/DistributionHandle.md)

#### Defined in

[distributions.ts:382](https://github.com/addmaple/stats/blob/main/js/package/src/distributions.ts#L382)

___

### init

▸ **init**(`options?`): `Promise`\<`void`\>

Initialize the full wasm module (SIMD-aware).

This function must be called once before using any statistics functions.
It's safe to call multiple times - it will only initialize once.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | Initialization options |
| `options.inline?` | `boolean` | If true, use the inline (base64) version of the WASM module. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.ts:54](https://github.com/addmaple/stats/blob/main/js/package/src/index.ts#L54)

___

### percentile

▸ **percentile**(`data`, `k`, `exclusive?`): `number`

Calculate a percentile of an array.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` | Sorted or unsorted array |
| `k` | `number` | `undefined` | Percentile (0 to 1) |
| `exclusive` | `boolean` | `false` | If true, use exclusive percentile calculation |

#### Returns

`number`

#### Defined in

[quantiles.ts:58](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L58)

___

### percentileInclusive

▸ **percentileInclusive**(`data`, `k`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `k` | `number` |

#### Returns

`number`

#### Defined in

[quantiles.ts:72](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L72)

___

### percentileExclusive

▸ **percentileExclusive**(`data`, `k`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `k` | `number` |

#### Returns

`number`

#### Defined in

[quantiles.ts:86](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L86)

___

### percentileOfScore

▸ **percentileOfScore**(`data`, `score`, `strict?`): `number`

Calculate the percentile rank of a score.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` |
| `score` | `number` | `undefined` |
| `strict` | `boolean` | `false` |

#### Returns

`number`

#### Defined in

[quantiles.ts:103](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L103)

___

### qscore

▸ **qscore**(`data`, `score`, `strict?`): `number`

Calculate the Q-score (quantile score) of a value.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` |
| `score` | `number` | `undefined` |
| `strict` | `boolean` | `false` |

#### Returns

`number`

#### Defined in

[quantiles.ts:120](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L120)

___

### qtest

▸ **qtest**(`data`, `score`, `qLower`, `qUpper`): `boolean`

Perform a quantile test.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `score` | `number` |
| `qLower` | `number` |
| `qUpper` | `number` |

#### Returns

`boolean`

#### Defined in

[quantiles.ts:127](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L127)

___

### quartiles

▸ **quartiles**(`data`): [`number`, `number`, `number`]

Calculate quartiles (Q1, Q2, Q3).

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

[`number`, `number`, `number`]

#### Defined in

[quantiles.ts:144](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L144)

___

### iqr

▸ **iqr**(`data`): `number`

Calculate interquartile range (IQR).

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[quantiles.ts:161](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L161)

___

### percentiles

▸ **percentiles**(`data`, `ps`): `Float64Array`

Calculate multiple percentiles at once.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `ps` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[quantiles.ts:178](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L178)

___

### quantiles

▸ **quantiles**(`data`, `qs`): `Float64Array`

Calculate multiple quantiles at once.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `qs` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[quantiles.ts:185](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L185)

___

### weightedPercentile

▸ **weightedPercentile**(`data`, `weights`, `p`): `number`

Calculate a weighted percentile.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `weights` | `ArrayLike`\<`number`\> |
| `p` | `number` |

#### Returns

`number`

#### Defined in

[quantiles.ts:211](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L211)

___

### weightedQuantiles

▸ **weightedQuantiles**(`data`, `weights`, `qs`): `Float64Array`

Calculate multiple weighted quantiles at once.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `weights` | `ArrayLike`\<`number`\> |
| `qs` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[quantiles.ts:233](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L233)

___

### weightedMedian

▸ **weightedMedian**(`data`, `weights`): `number`

Calculate the weighted median.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `weights` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[quantiles.ts:263](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L263)

___

### histogramEdges

▸ **histogramEdges**(`data`, `edges`): `Float64Array`

Calculate a histogram with specified bin edges.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `edges` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[quantiles.ts:304](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L304)

___

### histogramBinning

▸ **histogramBinning**(`data`, `options`): `HistogramBinningResult`

Advanced histogram binning function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `options` | `number` \| `HistogramBinningOptions` |

#### Returns

`HistogramBinningResult`

#### Defined in

[quantiles.ts:341](https://github.com/addmaple/stats/blob/main/js/package/src/quantiles.ts#L341)

___

### f64View

▸ **f64View**(`ptr`, `len`, `memory`): `Float64Array`

Create a Float64Array view into WASM memory.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ptr` | `number` |
| `len` | `number` |
| `memory` | `Memory` |

#### Returns

`Float64Array`

#### Defined in

[shared.ts:9](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L9)

___

### f32View

▸ **f32View**(`ptr`, `len`, `memory`): `Float32Array`

Create a Float32Array view into WASM memory.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ptr` | `number` |
| `len` | `number` |
| `memory` | `Memory` |

#### Returns

`Float32Array`

#### Defined in

[shared.ts:16](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L16)

___

### copyToWasmMemory

▸ **copyToWasmMemory**(`data`, `view`): `void`

Efficiently copy data to WASM memory.

Performance note: `Float64Array` and plain `Array<number>` are fastest.
Other array-likes may use a fallback loop which is slower.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `view` | `Float64Array` |

#### Returns

`void`

#### Defined in

[shared.ts:26](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L26)

___

### copyToWasmMemoryF32

▸ **copyToWasmMemoryF32**(`data`, `view`): `void`

Efficiently copy data to WASM memory (f32).

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `view` | `Float32Array` |

#### Returns

`void`

#### Defined in

[shared.ts:52](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L52)

___

### readWasmArray

▸ **readWasmArray**(`result`, `memory`): `Float64Array`

Read an array from WASM memory and return a copy.

#### Parameters

| Name | Type |
| :------ | :------ |
| `result` | [`ArrayResult`](interfaces/ArrayResult.md) |
| `memory` | `Memory` |

#### Returns

`Float64Array`

#### Defined in

[shared.ts:72](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L72)

___

### runUnaryArrayOp

▸ **runUnaryArrayOp**(`data`, `kernel`, `wasm`, `memory`): `Float64Array`

Run a unary array operation using a WASM kernel.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `kernel` | `ArrayKernel` |
| `wasm` | `BaseWasmModule` |
| `memory` | `Memory` |

#### Returns

`Float64Array`

#### Defined in

[shared.ts:96](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L96)

___

### loadWasmModule

▸ **loadWasmModule**(`moduleDir`, `inline?`): `Promise`\<`any`\>

Load a WASM module using wasm-bindgen-lite loaders.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `moduleDir` | `string` | `undefined` |
| `inline` | `boolean` | `false` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[shared.ts:124](https://github.com/addmaple/stats/blob/main/js/package/src/shared.ts#L124)

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

#### Defined in

[stats.ts:78](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L78)

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

#### Defined in

[stats.ts:88](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L88)

___

### variance

▸ **variance**(`data`): `number`

Calculate the population variance of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:95](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L95)

___

### sampleVariance

▸ **sampleVariance**(`data`): `number`

Calculate the sample variance of an array (Bessel's correction).

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:102](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L102)

___

### stdev

▸ **stdev**(`data`): `number`

Calculate the standard deviation (population) of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:111](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L111)

___

### sampleStdev

▸ **sampleStdev**(`data`): `number`

Calculate the sample standard deviation of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:118](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L118)

___

### min

▸ **min**(`data`): `number`

Calculate the minimum value in an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:127](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L127)

___

### max

▸ **max**(`data`): `number`

Calculate the maximum value in an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:134](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L134)

___

### product

▸ **product**(`data`): `number`

Calculate the product of all elements in an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:141](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L141)

___

### range

▸ **range**(`data`): `number`

Calculate the range (max - min) of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:148](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L148)

___

### median

▸ **median**(`data`): `number`

Calculate the median of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:155](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L155)

___

### mode

▸ **mode**(`data`): `number`

Calculate the mode of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:162](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L162)

___

### geomean

▸ **geomean**(`data`): `number`

Calculate the geometric mean of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:169](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L169)

___

### skewness

▸ **skewness**(`data`): `number`

Calculate the skewness of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:176](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L176)

___

### kurtosis

▸ **kurtosis**(`data`): `number`

Calculate the kurtosis of an array.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:183](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L183)

___

### stanMoment

▸ **stanMoment**(`data`, `k`): `number`

Calculate the k-th standardized moment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `k` | `number` |

#### Returns

`number`

#### Defined in

[stats.ts:190](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L190)

___

### coeffvar

▸ **coeffvar**(`data`): `number`

Calculate the coefficient of variation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:197](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L197)

___

### meandev

▸ **meandev**(`data`): `number`

Calculate the mean absolute deviation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:204](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L204)

___

### meddev

▸ **meddev**(`data`): `number`

Calculate the median absolute deviation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:211](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L211)

___

### pooledvariance

▸ **pooledvariance**(`data1`, `data2`): `number`

Calculate the pooled variance of two arrays.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data1` | `ArrayLike`\<`number`\> |
| `data2` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:218](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L218)

___

### pooledstdev

▸ **pooledstdev**(`data1`, `data2`): `number`

Calculate the pooled standard deviation of two arrays.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data1` | `ArrayLike`\<`number`\> |
| `data2` | `ArrayLike`\<`number`\> |

#### Returns

`number`

#### Defined in

[stats.ts:240](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L240)

___

### cumsum

▸ **cumsum**(`data`): `Float64Array`

Calculate the cumulative sum.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:262](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L262)

___

### cumprod

▸ **cumprod**(`data`): `Float64Array`

Calculate the cumulative product.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:279](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L279)

___

### diff

▸ **diff**(`data`): `Float64Array`

Calculate the difference between consecutive elements.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:296](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L296)

___

### rank

▸ **rank**(`data`): `Float64Array`

Calculate the rank of each element.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:313](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L313)

___

### deviation

▸ **deviation**(`data`): `Float64Array`

Calculate the deviation from the mean for each element.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:330](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L330)

___

### histogram

▸ **histogram**(`data`, `binCount?`): `Float64Array`

Calculate a histogram with specified number of bins.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `data` | `ArrayLike`\<`number`\> | `undefined` |
| `binCount` | `number` | `4` |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:347](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L347)

___

### cumreduce

▸ **cumreduce**(`data`, `initialValue`, `reducer`): `Float64Array`

Cumulative reduction using a custom reducer function.

Note: This is implemented in JS to allow custom reducers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `initialValue` | `number` |
| `reducer` | (`acc`: `number`, `val`: `number`) => `number` |

#### Returns

`Float64Array`

#### Defined in

[stats.ts:366](https://github.com/addmaple/stats/blob/main/js/package/src/stats.ts#L366)

___

### ttest

▸ **ttest**(`data`, `mu0`): [`TestResult`](interfaces/TestResult.md)

Perform a one-sample t-test.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `mu0` | `number` |

#### Returns

[`TestResult`](interfaces/TestResult.md)

#### Defined in

[tests.ts:54](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L54)

___

### ztest

▸ **ztest**(`data`, `mu0`, `sigma`): [`TestResult`](interfaces/TestResult.md)

Perform a one-sample Z-test.

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `ArrayLike`\<`number`\> |
| `mu0` | `number` |
| `sigma` | `number` |

#### Returns

[`TestResult`](interfaces/TestResult.md)

#### Defined in

[tests.ts:75](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L75)

___

### normalci

▸ **normalci**(`alpha`, `mean`, `se`): `number`[]

Calculate a confidence interval for a normal distribution.

#### Parameters

| Name | Type |
| :------ | :------ |
| `alpha` | `number` |
| `mean` | `number` |
| `se` | `number` |

#### Returns

`number`[]

#### Defined in

[tests.ts:96](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L96)

___

### tci

▸ **tci**(`alpha`, `mean`, `stdev`, `n`): `number`[]

Calculate a confidence interval for a Student's t-distribution.

#### Parameters

| Name | Type |
| :------ | :------ |
| `alpha` | `number` |
| `mean` | `number` |
| `stdev` | `number` |
| `n` | `number` |

#### Returns

`number`[]

#### Defined in

[tests.ts:105](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L105)

___

### regress

▸ **regress**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Perform simple linear regression.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

#### Defined in

[tests.ts:114](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L114)

___

### regressNaive

▸ **regressNaive**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Perform regression using the naive implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

#### Defined in

[tests.ts:149](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L149)

___

### regressSimd

▸ **regressSimd**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Perform regression using the SIMD implementation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

#### Defined in

[tests.ts:172](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L172)

___

### regressWasmKernels

▸ **regressWasmKernels**(`x`, `y`): [`RegressionResult`](interfaces/RegressionResult.md)

Perform regression using WASM kernels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `ArrayLike`\<`number`\> |
| `y` | `ArrayLike`\<`number`\> |

#### Returns

[`RegressionResult`](interfaces/RegressionResult.md)

#### Defined in

[tests.ts:195](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L195)

___

### anovaFScore

▸ **anovaFScore**(`groups`): `number`

Perform one-way ANOVA and return the F-score.

#### Parameters

| Name | Type |
| :------ | :------ |
| `groups` | `ArrayLike`\<`number`\>[] |

#### Returns

`number`

#### Defined in

[tests.ts:298](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L298)

___

### anovaTest

▸ **anovaTest**(`groups`): [`AnovaResult`](interfaces/AnovaResult.md)

Perform one-way ANOVA and return full results.

#### Parameters

| Name | Type |
| :------ | :------ |
| `groups` | `ArrayLike`\<`number`\>[] |

#### Returns

[`AnovaResult`](interfaces/AnovaResult.md)

#### Defined in

[tests.ts:331](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L331)

___

### chiSquareTest

▸ **chiSquareTest**(`cat1`, `cat2`, `options?`): [`ChiSquareResult`](interfaces/ChiSquareResult.md)

Perform Chi-Square test of independence.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cat1` | `string`[] |
| `cat2` | `string`[] |
| `options` | `Object` |
| `options.cardinality1?` | `number` |
| `options.cardinality2?` | `number` |

#### Returns

[`ChiSquareResult`](interfaces/ChiSquareResult.md)

#### Defined in

[tests.ts:390](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L390)

___

### anovaFScoreCategorical

▸ **anovaFScoreCategorical**(`groups`, `values`): `number`

Perform ANOVA with categorical labels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `groups` | `string`[] |
| `values` | `number`[] |

#### Returns

`number`

#### Defined in

[tests.ts:426](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L426)

___

### anovaTestCategorical

▸ **anovaTestCategorical**(`groups`, `values`): [`AnovaResult`](interfaces/AnovaResult.md)

Perform full ANOVA test with categorical labels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `groups` | `string`[] |
| `values` | `number`[] |

#### Returns

[`AnovaResult`](interfaces/AnovaResult.md)

#### Defined in

[tests.ts:445](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L445)

___

### tukeyHsdCategorical

▸ **tukeyHsdCategorical**(`groups`, `values`): [`TukeyHsdResult`](interfaces/TukeyHsdResult.md)

Perform Tukey HSD test with categorical labels.

#### Parameters

| Name | Type |
| :------ | :------ |
| `groups` | `string`[] |
| `values` | `number`[] |

#### Returns

[`TukeyHsdResult`](interfaces/TukeyHsdResult.md)

#### Defined in

[tests.ts:471](https://github.com/addmaple/stats/blob/main/js/package/src/tests.ts#L471)
