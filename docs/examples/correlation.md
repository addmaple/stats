# Correlation Examples

Examples of correlation and covariance calculations with `@stats/core`.

## Covariance

```js
import { init, covariance } from '@stats/core';

await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];

const cov = covariance(x, y);
console.log(cov); // 4 (positive covariance)
```

### Real-World Example: Height and Weight

```js
import { init, covariance } from '@stats/core';

await init();

// Heights (inches) and weights (pounds)
const heights = [65, 68, 70, 72, 74];
const weights = [120, 140, 160, 180, 200];

const cov = covariance(heights, weights);
console.log(cov); // Positive covariance (taller people tend to weigh more)
```

## Pearson Correlation Coefficient

```js
import { init, corrcoeff } from '@stats/core';

await init();

const x = [1, 2, 3, 4, 5];
const y = [2, 4, 6, 8, 10];

const corr = corrcoeff(x, y);
console.log(corr); // 1.0 (perfect positive correlation)
```

### Example: Study Hours vs Test Scores

```js
import { init, corrcoeff } from '@stats/core';

await init();

const studyHours = [5, 10, 15, 20, 25];
const testScores = [60, 70, 80, 85, 90];

const correlation = corrcoeff(studyHours, testScores);
console.log(correlation); // Positive correlation (likely around 0.9+)
```

### Example: Negative Correlation

```js
import { init, corrcoeff } from '@stats/core';

await init();

const temperature = [80, 70, 60, 50, 40];
const heatingCost = [20, 30, 40, 50, 60];

const corr = corrcoeff(temperature, heatingCost);
console.log(corr); // Negative correlation (likely around -1.0)
```

### Example: No Correlation

```js
import { init, corrcoeff } from '@stats/core';

await init();

const x = [1, 2, 3, 4, 5];
const y = [3, 1, 4, 2, 5]; // Random order

const corr = corrcoeff(x, y);
console.log(corr); // Close to 0 (no linear relationship)
```

## Spearman Rank Correlation

Spearman correlation measures monotonic relationships (not just linear):

```js
import { init, spearmancoeff } from '@stats/core';

await init();

const x = [1, 2, 3, 4, 5];
const y = [1, 4, 9, 16, 25]; // Quadratic relationship

const pearson = corrcoeff(x, y);
const spearman = spearmancoeff(x, y);

console.log(pearson);  // Less than 1 (not perfectly linear)
console.log(spearman); // 1.0 (perfect monotonic relationship)
```

### Example: Non-Linear Relationship

```js
import { init, corrcoeff, spearmancoeff } from '@stats/core';

await init();

// Exponential relationship
const x = [1, 2, 3, 4, 5];
const y = [2, 4, 8, 16, 32];

const pearson = corrcoeff(x, y);
const spearman = spearmancoeff(x, y);

console.log(pearson);  // High but not perfect
console.log(spearman); // 1.0 (perfect monotonic)
```

## Comparing Correlation Methods

```js
import { init, corrcoeff, spearmancoeff } from '@stats/core';

await init();

const x = [10, 20, 30, 40, 50];
const y = [15, 25, 35, 45, 55];

// Pearson: measures linear relationship
const pearson = corrcoeff(x, y);
console.log('Pearson:', pearson); // 1.0

// Spearman: measures monotonic relationship
const spearman = spearmancoeff(x, y);
console.log('Spearman:', spearman); // 1.0

// For linear relationships, both give similar results
```

## Correlation Matrix (Manual)

```js
import { init, corrcoeff } from '@stats/core';

await init();

const var1 = [1, 2, 3, 4, 5];
const var2 = [2, 4, 6, 8, 10];
const var3 = [5, 4, 3, 2, 1];

// Calculate pairwise correlations
const corr12 = corrcoeff(var1, var2);
const corr13 = corrcoeff(var1, var3);
const corr23 = corrcoeff(var2, var3);

console.log('Correlation Matrix:');
console.log('var1-var2:', corr12); // 1.0
console.log('var1-var3:', corr13); // -1.0
console.log('var2-var3:', corr23); // -1.0
```

## Error Handling

```js
import { init, corrcoeff } from '@stats/core';

await init();

// Arrays must have same length
const x = [1, 2, 3];
const y = [1, 2]; // Different length

const corr = corrcoeff(x, y);
console.log(corr); // NaN

// Empty arrays
const empty = [];
const corr2 = corrcoeff(empty, empty);
console.log(corr2); // NaN
```

