# Examples

Practical code examples demonstrating how to use `@addmaple/stats` for various statistical operations.

## Available Examples

### [Basic Statistics](/examples/basic-statistics)

Fundamental operations like sum, mean, min, max, variance, and standard deviation.

```js
import { init, mean, variance, stdev } from '@addmaple/stats';

await init();
const data = [1, 2, 3, 4, 5];
console.log(mean(data));     // 3
console.log(variance(data)); // 2
console.log(stdev(data));    // 1.414...
```

### [Distributions](/examples/distributions)

Working with probability distributions including normal, gamma, beta, and more.

```js
import { init, normal } from '@addmaple/stats';

await init();
const dist = normal({ mean: 0, sd: 1 });
console.log(dist.pdf(0));   // 0.3989...
console.log(dist.cdf(1.96)); // 0.975...
```

### [Correlation](/examples/correlation)

Measuring relationships between variables using covariance, Pearson, and Spearman correlation.

```js
import { init, corrcoeff, spearmancoeff } from '@addmaple/stats';

await init();
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];
console.log(corrcoeff(x, y)); // 1 (perfect correlation)
```

### [Quantiles](/examples/quantiles)

Calculating single percentiles, vectorized percentiles, quartiles, and interquartile ranges.

```js
import { init, percentile, percentiles, quartiles, iqr } from '@addmaple/stats';

await init();
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log(percentile(data, 0.5));              // 5.5 (median)
console.log(percentiles(data, [0.1, 0.5, 0.9])); // Float64Array [1.9, 5.5, 9.1]
console.log(quartiles(data));                    // { q1: 3.25, q2: 5.5, q3: 7.75 }
```

### [Statistical Tests](/examples/statistical-tests)

Hypothesis testing with ANOVA, t-tests, chi-square tests, and more.

```js
import { init, anovaTest } from '@addmaple/stats';

await init();
const groups = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const result = anovaTest(groups);
console.log(result.f); // F-statistic
```

## Quick Start

All examples assume you've initialized the library first:

```js
import { init } from '@addmaple/stats';

// Initialize once before using any functions
await init();

// Now use any statistics functions
```

For more information, see the [Quick Start Guide](/guide/quick-start) or browse the [API Reference](/api/index).

