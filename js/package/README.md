# @addmaple/stats

High-performance statistics library built with Rust and WebAssembly, designed to be a modern, fast alternative to jStat.

## Installation

```bash
npm install @addmaple/stats
```

## Quick Start

```javascript
import { init, mean, variance, stdev } from '@addmaple/stats';

// Initialize WASM module (required once)
await init();

// Use statistics functions
const data = [1, 2, 3, 4, 5];
const m = mean(data);        // 3
const v = variance(data);     // 2
const s = stdev(data);        // 1.414...
```

## Features

### ✅ Vector Statistics
- Basic operations: `sum`, `mean`, `min`, `max`, `product`, `range`
- Variance & standard deviation: `variance`, `sampleVariance`, `stdev`, `sampleStdev`, `coeffvar`
- Advanced statistics: `median`, `mode`, `geomean`, `skewness`, `kurtosis`
- Transformations: `cumsum`, `cumprod`, `diff`, `rank`, `histogram`

### ✅ Distributions
- Normal, Gamma, Beta, Student's t, Chi-squared, Fisher F, Exponential, Poisson, Binomial, Uniform, Cauchy, Laplace, Log-normal, Weibull, Pareto, Triangular, Inverse Gamma, Negative Binomial
- Each distribution supports: `pdf`, `cdf`, `inv` (inverse CDF)
- Scalar and array operations

### ✅ Quantiles & Percentiles
- `percentile`, `percentileOfScore`, `quartiles`, `iqr`, `quantiles`

### ✅ Correlation & Covariance
- `covariance` - Covariance between two arrays
- `corrcoeff` - Pearson correlation coefficient
- `spearmancoeff` - Spearman rank correlation

### ✅ Statistical Tests
- `ttest`, `ztest`, `regress`, `normalci`, `tci`, `chiSquareTest`, `anovaTest`, and more

## Tree-Shaking Support

Import only what you need to reduce bundle size:

```javascript
// Only loads stats module: ~20KB (gzipped)
import { init, mean, variance } from '@addmaple/stats/stats';
await init();

// Only loads distributions module: ~42KB (gzipped)
import { init, normal, poisson } from '@addmaple/stats/distributions';
await init();

// Only loads quantiles module: ~13KB (gzipped)
import { init, percentile, quartiles } from '@addmaple/stats/quantiles';
await init();

// Only loads correlation module: ~11KB (gzipped)
import { init, covariance, corrcoeff } from '@addmaple/stats/correlation';
await init();

// Only loads tests module: ~20KB (gzipped)
import { init, ttest, regress } from '@addmaple/stats/tests';
await init();

// Full module: ~77KB (gzipped)
import { init, mean, normal } from '@addmaple/stats';
await init();
```

## Examples

### Basic Statistics

```javascript
import { init, mean, variance, stdev, median } from '@addmaple/stats';
await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(mean(data));      // 5.5
console.log(variance(data));   // 8.25
console.log(stdev(data));     // 2.872...
console.log(median(data));    // 5.5
```

### Distributions

```javascript
import { init, normal } from '@addmaple/stats';
await init();

const dist = normal({ mean: 0, sd: 1 });
console.log(dist.pdf(0));     // 0.3989...
console.log(dist.cdf(1.96));  // 0.9750...
console.log(dist.inv(0.975)); // ~1.96
```

### Correlation

```javascript
import { init, corrcoeff } from '@addmaple/stats';
await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
console.log(corrcoeff(x, y)); // 1.0
```

## Performance

This library uses SIMD-optimized Rust code compiled to WebAssembly, delivering exceptional performance compared to pure JavaScript implementations.

### Optimal Input Types

For best performance, pass data as `Float64Array` or plain `Array<number>`:

```javascript
// Fastest - Float64Array (zero-copy to WASM memory)
const data = new Float64Array([1, 2, 3, 4, 5]);
const m = mean(data);

// Fast - plain Array<number>
const data2 = [1, 2, 3, 4, 5];
const m2 = mean(data2);

// Slower - other ArrayLike types may use a fallback loop
const data3 = new Uint8Array([1, 2, 3, 4, 5]);
const m3 = mean(data3); // Works, but slower
```

### SIMD Requirement

This library requires WebAssembly SIMD support. All modern browsers and Node.js 18+ support SIMD. If SIMD is not available, `init()` will throw an error with a clear message.

## Browser Support

Works in all modern browsers that support WebAssembly SIMD:
- Chrome 91+
- Firefox 89+
- Safari 16.4+
- Edge 91+
- Node.js 18+

## License

MIT




