# Bundle Size Comparison (Minified with esbuild)

## JavaScript + WASM Total Sizes

| Module | JS (minified) | JS (gzipped) | WASM | WASM (gzipped) | **Total** | **Total (gzipped)** | Savings vs Full |
|--------|---------------|--------------|------|----------------|-----------|---------------------|-----------------|
| **stats** | 2.24K | 0.82K | 50.51K | 20.01K | **52.75K** | **20.83K** | **70% smaller** |
| **distributions** | 6.44K | 1.41K | 113.04K | 40.91K | **119.48K** | **42.32K** | **39% smaller** |
| **quantiles** | 3.16K | 0.80K | 37.74K | 12.38K | **40.90K** | **13.18K** | **81% smaller** |
| **correlation** | 1.01K | 0.54K | 25.03K | 10.81K | **26.04K** | **11.35K** | **84% smaller** |
| **tests** | 2.08K | 0.77K | 43.48K | 19.09K | **45.56K** | **19.86K** | **72% smaller** |
| **full (index)** | 37.84K | 6.86K | 209.27K | 69.88K | **247.11K** | **76.74K** | - |

## JavaScript Only (Minified)

| Module | Uncompressed | Gzipped |
|--------|--------------|---------|
| stats | 2.24K | 0.82K |
| distributions | 6.44K | 1.41K |
| quantiles | 3.16K | 0.80K |
| correlation | 1.01K | 0.54K |
| tests | 2.08K | 0.77K |
| full (index) | 37.84K | 6.86K |

## WASM Only

| Module | Uncompressed | Gzipped |
|--------|--------------|---------|
| stats | 50.51K | 20.01K |
| distributions | 113.04K | 40.91K |
| quantiles | 37.74K | 12.38K |
| correlation | 25.03K | 10.81K |
| tests | 43.48K | 19.09K |
| full | 209.27K | 69.88K |

## Key Insights

- **Stats module** is 70% smaller than full module (20.83K vs 76.74K gzipped)
- **Quantiles module** is 81% smaller (13.18K vs 76.74K gzipped)
- **Correlation module** is 84% smaller (11.35K vs 76.74K gzipped)
- **Distributions** is the largest module (42.32K gzipped) but still 39% smaller than full
- JavaScript bundles are very small (0.5-1.5K gzipped) - most of the size is WASM

## Real-World Example

If you only need basic statistics:

```js
// Instead of loading 76.74K (full module)
import { init, mean, variance } from '@stats/core';

// Load only 20.83K (stats module)
import { init, mean, variance } from '@stats/core/stats';
```

**Savings: 55.91K (73% reduction)**
