# Histogram Binning Strategies

The `histogramBinning` function supports multiple strategies for automatically determining optimal bin edges. This guide explains when and how to use each strategy.

## Quick Reference

| Strategy | Best For | Key Feature |
|----------|----------|-------------|
| **Freedman-Diaconis (FD)** | Most real-world data, datasets with outliers | Robust to outliers (uses IQR) |
| **Scott's Rule** | Normal distributions, clean data | Optimal for Gaussian data |
| **Square Root (sqrtN)** | Quick estimates, exploration | Simple: bins ≈ √n |
| **Equal Frequency** | Comparing distributions, non-uniform data | Each bin has roughly equal counts |
| **Fixed Width** | Custom ranges, known bin widths | Linear spacing from min to max |
| **Custom** | Specific requirements, domain knowledge | User-defined bin edges |

## Auto Binning Rules

### Freedman-Diaconis (FD) - Recommended Default

The **Freedman-Diaconis rule** is the recommended default for most use cases.

**Formula:** `bin_width = 2 × IQR / n^(1/3)`

**When to use:**
- ✅ Default choice for most datasets
- ✅ Data with outliers or skewed distributions
- ✅ Unknown data distribution
- ✅ General-purpose exploratory data analysis

**Example:**
```js
import { init, histogramBinning, BinningPresets } from '@stats/core';
await init();

const data = [1, 2, 3, 4, 5, 10, 15, 20, 100, 200]; // Has outliers

// Use FD rule (default recommendation)
const result = histogramBinning(data, { mode: 'auto', rule: 'FD' });

// Or use the preset
const result2 = histogramBinning(data, BinningPresets.autoFD());
```

**Why FD is robust:**
- Uses **Interquartile Range (IQR)** instead of standard deviation
- IQR is less sensitive to outliers than standard deviation
- Handles skewed and non-normal distributions well
- Widely used in statistical practice (e.g., pandas, matplotlib)

---

### Scott's Rule

**Scott's rule** is optimal for normally distributed data.

**Formula:** `bin_width = 3.5 × σ / n^(1/3)` where σ is the standard deviation

**When to use:**
- ✅ Data is approximately normally distributed
- ✅ Data is free of outliers
- ✅ Theoretical optimality for Gaussian data is important

**When NOT to use:**
- ❌ Data with outliers (sensitive to extremes)
- ❌ Skewed or multimodal distributions
- ❌ Unknown distribution shape

**Example:**
```js
// Normally distributed data (e.g., heights, IQ scores)
const heights = [/* normally distributed values */];

const result = histogramBinning(heights, { mode: 'auto', rule: 'Scott' });
```

**Trade-offs:**
- **Pro:** Mathematically optimal for normal distributions
- **Con:** Can produce too many bins for skewed data
- **Con:** Sensitive to outliers

---

### Square Root (sqrtN) Rule

The **square root rule** is the simplest automatic binning method.

**Formula:** `bins = ⌈√n⌉`

**When to use:**
- ✅ Quick data exploration
- ✅ Very large datasets (simple computation)
- ✅ When bin count is more important than optimal width
- ✅ Educational purposes (easy to understand)

**When NOT to use:**
- ❌ Small datasets (may over-bin)
- ❌ When optimal bin width matters

**Example:**
```js
// Quick exploration
const result = histogramBinning(data, { mode: 'auto', rule: 'sqrtN' });

// For 1000 points, produces ~32 bins
// For 100 points, produces ~10 bins
```

**Characteristics:**
- **Pro:** Very fast and simple
- **Pro:** Predictable bin count
- **Con:** Doesn't account for data distribution
- **Con:** Can under-bin large datasets or over-bin small ones

---

## Comparison Example

Here's how the three rules compare on the same dataset:

```js
import { init, histogramBinning } from '@stats/core';
await init();

// Dataset with some outliers
const data = [
  ...Array.from({ length: 100 }, (_, i) => i + 1), // Normal range
  -1000, -500, 5000, 6000 // Outliers
];

const fdResult = histogramBinning(data, { mode: 'auto', rule: 'FD' });
const scottResult = histogramBinning(data, { mode: 'auto', rule: 'Scott' });
const sqrtResult = histogramBinning(data, { mode: 'auto', rule: 'sqrtN' });

console.log('FD bins:', fdResult.counts.length);      // Fewer, robust to outliers
console.log('Scott bins:', scottResult.counts.length); // More, sensitive to outliers
console.log('sqrtN bins:', sqrtResult.counts.length);  // Predictable: ~√104 ≈ 10-11
```

**Expected behavior:**
- **FD:** Produces fewer bins, focusing on the main data distribution
- **Scott:** May produce more bins due to outlier sensitivity
- **sqrtN:** Produces predictable number regardless of distribution

## Other Binning Modes

### Equal Frequency (Quantile) Binning

Each bin contains approximately the same number of observations.

**When to use:**
- Comparing distributions with different scales
- Non-uniform data where you want balanced bin counts
- Creating deciles, quartiles, or other quantile-based bins

**Example:**
```js
// Create deciles (10 equal-frequency bins)
const result = histogramBinning(data, { mode: 'equalFrequency', bins: 10 });

// Or use preset
const result2 = histogramBinning(data, BinningPresets.deciles());
```

### Fixed Width Binning

Linear spacing from minimum to maximum value.

**When to use:**
- You need specific bin widths or ranges
- Comparing histograms with the same bin widths
- Domain-specific requirements (e.g., age groups, income brackets)

**Example:**
```js
const result = histogramBinning(data, { mode: 'fixedWidth', bins: 20 });
```

### Custom Edges

Define your own bin boundaries.

**When to use:**
- Domain knowledge about meaningful boundaries
- Specific visualization requirements
- Comparing with external data sources

**Example:**
```js
// Age groups: 0-18, 18-65, 65+
const result = histogramBinning(ages, { 
  mode: 'custom', 
  edges: [0, 18, 65, 120] 
});
```

## Tail Collapse (Outlier Handling)

For auto binning, you can enable tail collapse to handle outliers:

```js
const result = histogramBinning(data, {
  mode: 'auto',
  rule: 'FD',
  collapseTails: {
    enabled: true,
    k: 1.5  // IQR multiplier (default: 1.5)
  }
});
```

**How it works:**
- Detects outliers using `k × IQR` rule
- Computes bins based on inner data (excluding outliers)
- Outliers are placed in first/last bins
- Useful when you want to see the main distribution while still counting outliers

## Recommendations

### Default Choice
**Use Freedman-Diaconis (FD)** as your default:
- Robust to outliers
- Works well across many distribution types
- Mathematically sound and widely used

```js
// Recommended default
const result = histogramBinning(data, BinningPresets.autoFD());
```

### Data-Specific Recommendations

| Data Type | Recommended Rule | Alternative |
|-----------|------------------|-------------|
| Unknown distribution | FD | sqrtN (exploration) |
| Normal/Gaussian | Scott | FD |
| Skewed data | FD | Equal Frequency |
| With outliers | FD (with tail collapse) | FD |
| Very large dataset | sqrtN or FD | - |
| Small dataset (< 50) | Fixed Width (3-7 bins) | sqrtN |

### Rule of Thumb

1. **Start with FD** - Works well for most cases
2. **Use Scott** - If you know data is normal and outlier-free
3. **Use sqrtN** - For quick exploration or when you need predictable bin count
4. **Use Equal Frequency** - When bin counts matter more than bin widths
5. **Use Fixed Width** - When you need specific bin boundaries
6. **Use Custom** - When you have domain knowledge

## Presets

The library provides convenient presets:

```js
import { BinningPresets } from '@stats/core';

// Auto binning
histogramBinning(data, BinningPresets.autoFD());        // Freedman-Diaconis
histogramBinning(data, BinningPresets.autoScott());     // Scott's rule
histogramBinning(data, BinningPresets.autoSqrt());      // Square root

// With tail collapse
histogramBinning(data, BinningPresets.autoWithTailCollapse(1.5));

// Other strategies
histogramBinning(data, BinningPresets.equalFrequency(10));
histogramBinning(data, BinningPresets.fixedWidth(20));
histogramBinning(data, BinningPresets.deciles());       // 10 equal-frequency bins
histogramBinning(data, BinningPresets.quartiles());     // 4 equal-frequency bins
```

## Mathematical Details

### Freedman-Diaconis
- **Reference:** Freedman, D. & Diaconis, P. (1981). "On the histogram as a density estimator: L2 theory"
- **Optimal for:** Minimizing integrated mean squared error across distributions
- **Robustness:** Uses IQR (75th - 25th percentile), which ignores extreme values

### Scott's Rule
- **Reference:** Scott, D. W. (1979). "On optimal and data-based histograms"
- **Optimal for:** Normal distributions (minimizes mean integrated squared error)
- **Assumption:** Data follows normal distribution

### Square Root Rule
- **Origin:** Sturges' rule simplified
- **Use case:** Rule of thumb for bin count
- **Limitation:** Doesn't adapt to data distribution

## Performance

All binning strategies are implemented in Rust and optimized for performance:

- **Auto rules:** Compute in O(n) time
- **Equal frequency:** O(n log n) due to sorting for quantiles
- **Fixed width:** O(n) time
- **Custom:** O(n log k) where k is number of bins (binary search)

For large datasets (millions of points), all strategies remain fast due to the Rust/WASM implementation.





