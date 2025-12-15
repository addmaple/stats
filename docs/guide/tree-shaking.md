# Tree-Shaking Support

`@addmaple/stats` supports tree-shaking through separate WASM modules! Import only what you need to reduce bundle size.

## Usage

### Full Module

Use the full module if you need everything:

```js
import { init, mean, normal } from '@addmaple/stats';
await init(); // Loads full module: 76.74K (gzipped)
```

### Tree-Shakeable Modules

Import only the modules you need:

```js
// Only loads stats module: 20.83K (gzipped) - 73% smaller!
import { init, mean, variance } from '@addmaple/stats/stats';
await init();

// Only loads distributions module: 42.32K (gzipped) - 45% smaller!
import { init, normal, poisson } from '@addmaple/stats/distributions';
await init();

// Only loads quantiles module: 13.18K (gzipped) - 83% smaller!
import { init, percentile, quartiles } from '@addmaple/stats/quantiles';
await init();

// Only loads correlation module: 11.35K (gzipped) - 85% smaller!
import { init, covariance, corrcoeff } from '@addmaple/stats/correlation';
await init();

// Only loads tests module: 19.86K (gzipped) - 74% smaller!
import { init, ttest, regress } from '@addmaple/stats/tests';
await init();
```

*All sizes are minified with esbuild and gzipped*

## Module Breakdown

| Module | Total Size (gzipped) | JS (gzipped) | WASM (gzipped) | Functions Included |
|--------|---------------------|--------------|----------------|-------------------|
| `@addmaple/stats/stats` | **20.83K** | 0.82K | 20.01K | sum, mean, variance, stdev, min, max, median, mode, skewness, kurtosis, cumsum, cumprod, diff, rank, histogram |
| `@addmaple/stats/distributions` | **42.32K** | 1.41K | 40.91K | All 18 distributions (normal, gamma, beta, poisson, binomial, etc.) |
| `@addmaple/stats/quantiles` | **13.18K** | 0.80K | 12.38K | percentile, quartiles, iqr, quantiles, histogram |
| `@addmaple/stats/correlation` | **11.35K** | 0.54K | 10.81K | covariance, corrcoeff, spearmancoeff |
| `@addmaple/stats/tests` | **19.86K** | 0.77K | 19.09K | ttest, ztest, regress, normalci, tci |
| `@addmaple/stats` (full) | **76.74K** | 6.86K | 69.88K | All functions |

*Sizes are minified with esbuild and gzipped*

## Size Comparison

**Full Module:** 76.74K total (gzipped)
- JS: 6.86K (gzipped)
- WASM: 69.88K (gzipped)

**Stats Only:** 20.83K total (gzipped) - **73% smaller!**
- JS: 0.82K (gzipped)
- WASM: 20.01K (gzipped)

**Quantiles Only:** 13.18K total (gzipped) - **83% smaller!**

**Correlation Only:** 11.35K total (gzipped) - **85% smaller!**

## Example: Lightweight Stats App

```js
// Only need basic statistics - loads only 20.83K (gzipped) instead of 76.74K
import { init, mean, stdev, min, max } from '@addmaple/stats/stats';

await init();

const data = [1, 2, 3, 4, 5];
console.log(mean(data)); // 3
console.log(stdev(data)); // ~1.58
```

**Savings: 55.91K (73% reduction)**

## Example: Distribution Analysis

```js
// Only need distributions
import { init, normal, poisson } from '@addmaple/stats/distributions';

await init();

const dist = normal({ mean: 0, sd: 1 });
console.log(dist.pdf(0)); // 0.3989...
```

## Building

The build script automatically builds all WASM modules:

```bash
npm run build
```

Or build individual modules:

```bash
cd crates/stat-wasm-stats
RUSTFLAGS="-C target-feature=+simd128" wasm-pack build --target bundler --out-dir pkg
```

## Notes

- Each module has its own `init()` function - call it before using functions from that module
- Modules are independent - you can use multiple modules in the same app
- Use `@addmaple/stats` for the full module with all functions
- Bundlers (webpack, rollup, esbuild) will automatically tree-shake unused modules




