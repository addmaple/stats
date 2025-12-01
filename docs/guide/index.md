# Introduction

`@addmaple/stats` is a high-performance statistics library built with Rust and WebAssembly, designed to be a modern, fast alternative to jStat.

## Why @addmaple/stats?

- **Performance**: SIMD-optimized Rust code compiled to WebAssembly delivers exceptional speed
- **Modern API**: Clean, functional API with TypeScript support
- **Tree-Shakeable**: Import only what you need, reducing bundle size
- **Browser Compatible**: Works seamlessly in both browser and Node.js environments

## Architecture

The library is built with a clean separation of concerns:

- **Pure Rust core** (`stat-core`) - No WebAssembly-specific code
- **Thin WASM boundary** (`stat-wasm`) - Minimal wasm-bindgen glue
- **Ergonomic JS/TS API** (`js/package`) - Modern, tree-shakeable API

## Quick Example

```js
import { init, mean, variance, stdev } from '@addmaple/stats';

// Initialize WASM module (required once)
await init();

// Use statistics functions
const data = [1, 2, 3, 4, 5];
const m = mean(data);        // 3
const v = variance(data);    // 2
const s = stdev(data);       // 1.414...
```

## What's Included

### ✅ Vector Statistics
- Basic operations: `sum`, `mean`, `min`, `max`, `product`, `range`
- Variance & standard deviation: `variance`, `sampleVariance`, `stdev`, `sampleStdev`, `coeffvar`
- Advanced statistics: `median`, `mode`, `geomean`, `skewness`, `kurtosis`
- Quantiles: `percentile`, `percentiles`, `percentileOfScore`, `quartiles`, `iqr`, `quantiles`
- Transformations: `cumsum`, `cumprod`, `diff`, `rank`, `histogram`

### ✅ Distributions
- Normal, Gamma, Beta, Student's t, Chi-squared, Fisher F, Exponential, Poisson, Binomial, Uniform, Cauchy, Laplace, Log-normal, Weibull, Pareto, Triangular, Inverse Gamma, Negative Binomial
- Each distribution supports: `pdf`, `cdf`, `inv` (inverse CDF)
- Scalar and array operations

### ✅ Correlation & Covariance
- `covariance` - Covariance between two arrays
- `corrcoeff` - Pearson correlation coefficient
- `spearmancoeff` - Spearman rank correlation

### ✅ Statistical Tests
- `anovaFScore` / `anovaTest` - One-way ANOVA
- `chiSquareTest` - Chi-square test
- `ttest` - T-test
- `ztest` - Z-test
- `regress` - Linear regression
- `normalci` / `tci` - Confidence intervals

## Performance

See [Performance Guide](/guide/performance) for detailed benchmarks comparing `@addmaple/stats` to jStat.

