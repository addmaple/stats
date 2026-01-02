# @addmaple/stats

High-performance statistics library built with Rust and WebAssembly, designed to be a modern, fast alternative to jStat. Optimized for execution speed and minimal binary size.

## Features

- **Blazing Fast**: Uses SIMD-optimized Rust kernels for heavy computations.
- **Small Footprint**: Monolithic build is only **249KB** (Execution-First strategy).
- **Tree-Shakeable**: Import only the sub-modules you need to save even more space.
- **Dual-Mode WASM**: Support for separate `.wasm` fetching or **inline** base64 embedding.
- **TypeScript First**: Full type definitions included.

## Installation

```bash
npm install @addmaple/stats
```

## Quick Start

```javascript
import { init, mean, variance } from '@addmaple/stats';

// Initialize WASM module (required once)
await init();

// Use statistics functions
const data = [1, 2, 3, 4, 5];
console.log(mean(data));     // 3
console.log(variance(data)); // 2
```

## Importing & Usage Modes

### 1. Standard (Separate WASM)
Recommended for most projects using modern bundlers (Vite, Webpack, etc.) or Node.js. The WASM file is fetched separately when `init()` is called.

```javascript
import { init, mean } from '@addmaple/stats';
await init();
```

### 2. Inline WASM (No Fetching)
If you want to avoid a separate network request for the WASM file, you can use the inline mode. This embeds the WASM as a base64 string inside the JavaScript bundle.

```javascript
import { init, mean } from '@addmaple/stats';
// Embeds WASM in JS - larger JS bundle but no extra fetch
await init({ inline: true });
```

### 3. Sub-modules (Tree-Shaking)
For minimal bundle size, import from specialized sub-modules. Each sub-module has its own smaller WASM binary.

```javascript
// Basic Vector Stats (~50KB WASM)
import { init, mean } from '@addmaple/stats/stats';
await init();

// Distributions (~113KB WASM)
import { init, normal } from '@addmaple/stats/distributions';
await init();

// Others: @addmaple/stats/quantiles, correlation, tests
```

### 4. CDN / Browser Direct
You can use the library directly in the browser via a CDN like ESM.sh or Unpkg.

```html
<script type="module">
  import { init, mean } from 'https://esm.sh/@addmaple/stats';
  await init();
  console.log(mean([1, 2, 3]));
</script>
```

## API Overview

### ✅ Vector Statistics (`@addmaple/stats/stats`)
`sum`, `mean`, `min`, `max`, `product`, `range`, `variance`, `sampleVariance`, `stdev`, `sampleStdev`, `coeffvar`, `median`, `mode`, `geomean`, `skewness`, `kurtosis`, `cumsum`, `cumprod`, `diff`, `rank`, `histogram`

### ✅ Distributions (`@addmaple/stats/distributions`)
- Normal, Poisson, Binomial, Gamma, Beta, Student's t, Chi-squared, Fisher F, Exponential, etc.
- Methods: `pdf(x)`, `cdf(x)`, `inv(p)`, `pdfArray(data)`, `cdfArray(data)`

### ✅ Quantiles & Percentiles (`@addmaple/stats/quantiles`)
`percentile`, `percentileOfScore`, `quartiles`, `iqr`, `quantiles`, `weightedPercentile`, `histogramEdges`

### ✅ Correlation & Covariance (`@addmaple/stats/correlation`)
`covariance`, `corrcoeff` (Pearson), `spearmancoeff` (Spearman Rank)

### ✅ Statistical Tests (`@addmaple/stats/tests`)
`ttest`, `ztest`, `regress` (Linear Regression), `RegressionWorkspace` (High-performance reusable workspace)

## Performance

This library is built with an **Execution-First** strategy. We force `opt-level = 3` and use SIMD-optimized kernels, ensuring that operations like Spearman Rank and Linear Regression are up to **100x-150x faster** than naive JavaScript implementations.

| Metric | Achievement |
|--------|-------------|
| **Monolithic Size** | 249 KB |
| **Spearman (10K)** | 113 µs |
| **Rank (10K)** | 68 µs |

## License

MIT
