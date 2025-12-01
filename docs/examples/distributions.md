# Distribution Examples

Examples of working with probability distributions in `@addmaple/stats`.

## Normal Distribution

### Basic Usage

```js
import { init, normal } from '@addmaple/stats';

await init();

// Standard normal distribution (mean=0, sd=1)
const stdNormal = normal();

console.log(stdNormal.pdf(0));  // 0.3989... (density at 0)
console.log(stdNormal.cdf(1.96));  // 0.975... (P(X <= 1.96))
console.log(stdNormal.inv(0.975));  // 1.96... (97.5th percentile)
```

### Custom Parameters

```js
import { init, normal } from '@addmaple/stats';

await init();

// Normal distribution with mean=100, sd=15
const dist = normal({ mean: 100, sd: 15 });

console.log(dist.pdf(100));  // Density at mean
console.log(dist.cdf(115));  // P(X <= 115) ≈ 0.8413
console.log(dist.inv(0.95));  // 95th percentile ≈ 124.67
```

### Array Operations

```js
import { init, normal } from '@addmaple/stats';

await init();

const dist = normal({ mean: 0, sd: 1 });
const x = [-2, -1, 0, 1, 2];

// Probability density for each value
const pdfs = dist.pdfArray(x);
console.log(pdfs);
// Float64Array [0.0539..., 0.2420..., 0.3989..., 0.2420..., 0.0539...]

// Cumulative probabilities
const cdfs = dist.cdfArray(x);
console.log(cdfs);
// Float64Array [0.0227..., 0.1586..., 0.5, 0.8413..., 0.9772...]
```

### Real-World Example: Test Scores

```js
import { init, normal } from '@addmaple/stats';

await init();

// Test scores: mean=75, sd=10
const testScores = normal({ mean: 75, sd: 10 });

// Probability of scoring above 90
const probAbove90 = 1 - testScores.cdf(90);
console.log(probAbove90); // ≈ 0.0668 (6.68%)

// 90th percentile score
const score90th = testScores.inv(0.90);
console.log(score90th); // ≈ 87.82
```

## Gamma Distribution

```js
import { init, gamma } from '@addmaple/stats';

await init();

// Gamma distribution with shape=2, rate=1
const dist = gamma({ shape: 2, rate: 1 });

console.log(dist.pdf(1));  // Density at x=1
console.log(dist.cdf(2));  // P(X <= 2)
console.log(dist.inv(0.5));  // Median

// Using scale parameter (scale = 1/rate)
const dist2 = gamma({ shape: 2, scale: 2 });
```

## Beta Distribution

```js
import { init, beta } from '@addmaple/stats';

await init();

// Beta distribution with alpha=2, beta=5
const dist = beta({ alpha: 2, beta: 5 });

console.log(dist.pdf(0.3));  // Density at x=0.3
console.log(dist.cdf(0.5));  // P(X <= 0.5)
console.log(dist.inv(0.95));  // 95th percentile
```

## Student's t Distribution

```js
import { init, studentT } from '@addmaple/stats';

await init();

// t-distribution with 10 degrees of freedom
const dist = studentT({ dof: 10 });

console.log(dist.pdf(0));  // Density at 0
console.log(dist.cdf(1.96));  // P(X <= 1.96)
console.log(dist.inv(0.975));  // 97.5th percentile

// With location and scale
const dist2 = studentT({ mean: 0, scale: 1, dof: 10 });
```

## Chi-Squared Distribution

```js
import { init, chiSquared } from '@addmaple/stats';

await init();

// Chi-squared with 5 degrees of freedom
const dist = chiSquared({ dof: 5 });

console.log(dist.pdf(3));  // Density at x=3
console.log(dist.cdf(10));  // P(X <= 10)
console.log(dist.inv(0.95));  // 95th percentile
```

## Fisher F Distribution

```js
import { init, fisherF } from '@addmaple/stats';

await init();

// F-distribution with df1=3, df2=10
const dist = fisherF({ df1: 3, df2: 10 });

console.log(dist.pdf(2));  // Density at x=2
console.log(dist.cdf(5));  // P(X <= 5)
console.log(dist.inv(0.95));  // 95th percentile
```

## Exponential Distribution

```js
import { init, exponential } from '@addmaple/stats';

await init();

// Exponential with rate=0.5 (mean=2)
const dist = exponential({ rate: 0.5 });

console.log(dist.pdf(1));  // Density at x=1
console.log(dist.cdf(2));  // P(X <= 2)
console.log(dist.inv(0.632));  // ≈ mean (1 - 1/e)

// Using scale parameter (scale = 1/rate)
const dist2 = exponential({ scale: 2 });
```

## Plotting Distributions

```js
import { init, normal } from '@addmaple/stats';

await init();

const dist = normal({ mean: 0, sd: 1 });

// Generate x values
const x = [];
for (let i = -3; i <= 3; i += 0.1) {
  x.push(i);
}

// Calculate PDF values
const y = dist.pdfArray(x);

// Now you can plot x vs y using your favorite plotting library
console.log('x values:', x);
console.log('PDF values:', y);
```

## Confidence Intervals

```js
import { init, normal } from '@addmaple/stats';

await init();

// 95% confidence interval for a normal distribution
const dist = normal({ mean: 100, sd: 15 });
const alpha = 0.05;
const lower = dist.inv(alpha / 2);
const upper = dist.inv(1 - alpha / 2);

console.log(`95% CI: [${lower}, ${upper}]`);
// 95% CI: [70.6..., 129.4...]
```

