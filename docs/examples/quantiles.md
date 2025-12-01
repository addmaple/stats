# Quantiles and Percentiles Examples

Examples of working with quantiles, percentiles, and quartiles in `@stats/core`.

## Percentiles

### Basic Percentile Calculation

```js
import { init, percentile } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 50th percentile (median)
const median = percentile(data, 0.5);
console.log(median); // 5.5

// 90th percentile
const p90 = percentile(data, 0.9);
console.log(p90); // 9.1

// 25th percentile (Q1)
const q1 = percentile(data, 0.25);
console.log(q1); // 3.25
```

### Exclusive vs Inclusive Method

```js
import { init, percentile } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5];

// Inclusive method (default, R7)
const inclusive = percentile(data, 0.5, false);
console.log(inclusive); // 3

// Exclusive method (R6)
const exclusive = percentile(data, 0.5, true);
console.log(exclusive); // 3
```

### Real-World Example: Test Scores

```js
import { init, percentile } from '@stats/core';

await init();

const scores = [65, 72, 78, 82, 85, 88, 90, 92, 95, 98];

// What score is at the 75th percentile?
const p75 = percentile(scores, 0.75);
console.log(`75th percentile: ${p75}`); // ~92

// What score is at the 25th percentile?
const p25 = percentile(scores, 0.25);
console.log(`25th percentile: ${p25}`); // ~78
```

## Quartiles

### Basic Quartile Calculation

```js
import { init, quartiles } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const { q1, q2, q3 } = quartiles(data);
console.log(`Q1: ${q1}`); // 3.25
console.log(`Q2 (median): ${q2}`); // 5.5
console.log(`Q3: ${q3}`); // 7.75
```

### Interquartile Range (IQR)

```js
import { init, quartiles, iqr } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Calculate IQR directly
const range = iqr(data);
console.log(`IQR: ${range}`); // 4.5

// Or calculate from quartiles
const { q1, q3 } = quartiles(data);
const manualIqr = q3 - q1;
console.log(`Manual IQR: ${manualIqr}`); // 4.5
```

### Outlier Detection Using IQR

```js
import { init, quartiles, iqr } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 50]; // 50 is an outlier

const { q1, q3 } = quartiles(data);
const iqrValue = iqr(data);

const lowerBound = q1 - 1.5 * iqrValue;
const upperBound = q3 + 1.5 * iqrValue;

const outliers = data.filter(x => x < lowerBound || x > upperBound);
console.log('Outliers:', outliers); // [50]
```

## Multiple Quantiles

### Calculate Multiple Quantiles at Once

```js
import { init, quantiles } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Calculate deciles (10th, 20th, ..., 90th percentiles)
const deciles = [];
for (let i = 1; i < 10; i++) {
  deciles.push(i / 10);
}

const decileValues = quantiles(data, deciles);
console.log('Deciles:', decileValues);
// Float64Array [1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3, 8.2, 9.1]
```

### Percentiles of Score

```js
import { init, percentileOfScore } from '@stats/core';

await init();

const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// What percentile is score 75?
const percentile = percentileOfScore(data, 75);
console.log(`75 is at the ${percentile * 100}th percentile`); // ~70th percentile

// Strict comparison (< instead of <=)
const strict = percentileOfScore(data, 75, true);
console.log(`Strict: ${strict * 100}th percentile`);
```

## Real-World Examples

### Income Distribution Analysis

```js
import { init, quartiles, iqr, percentile } from '@stats/core';

await init();

const incomes = [
  25000, 30000, 35000, 40000, 45000,
  50000, 55000, 60000, 70000, 80000,
  90000, 100000, 120000, 150000, 200000
];

const { q1, q2, q3 } = quartiles(incomes);
const iqrValue = iqr(incomes);

console.log(`Median income: $${q2.toLocaleString()}`);
console.log(`Q1: $${q1.toLocaleString()}`);
console.log(`Q3: $${q3.toLocaleString()}`);
console.log(`IQR: $${iqrValue.toLocaleString()}`);

// Top 10% income
const top10 = percentile(incomes, 0.9);
console.log(`Top 10%: $${top10.toLocaleString()}`);
```

### Test Score Analysis

```js
import { init, percentile, quartiles } from '@stats/core';

await init();

const scores = [45, 52, 58, 62, 65, 68, 72, 75, 78, 82, 85, 88, 92, 95, 98];

// Grade boundaries
const aMin = percentile(scores, 0.9); // Top 10%
const bMin = percentile(scores, 0.7); // Top 30%
const cMin = percentile(scores, 0.5); // Top 50%

console.log(`A grade: >= ${aMin}`);
console.log(`B grade: >= ${bMin}`);
console.log(`C grade: >= ${cMin}`);

// Quartiles for box plot
const { q1, q2, q3 } = quartiles(scores);
console.log(`Box plot: [${q1}, ${q2}, ${q3}]`);
```

### Performance Metrics

```js
import { init, percentile, quartiles } from '@stats/core';

await init();

const responseTimes = [10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50];

// P50, P95, P99 percentiles
const p50 = percentile(responseTimes, 0.5);
const p95 = percentile(responseTimes, 0.95);
const p99 = percentile(responseTimes, 0.99);

console.log(`P50: ${p50}ms`);
console.log(`P95: ${p95}ms`);
console.log(`P99: ${p99}ms`);

// Quartiles for distribution understanding
const { q1, q2, q3 } = quartiles(responseTimes);
console.log(`Distribution: Q1=${q1}, Median=${q2}, Q3=${q3}`);
```

