# Basic Statistics Examples

Examples of basic statistical operations with `@stats/core`.

## Basic Operations

### Sum

```js
import { init, sum } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5];
const total = sum(data);
console.log(total); // 15
```

### Mean

```js
import { init, mean } from '@stats/core';

await init();

const scores = [85, 90, 78, 92, 88];
const average = mean(scores);
console.log(average); // 87
```

### Min and Max

```js
import { init, min, max } from '@stats/core';

await init();

const temperatures = [72, 68, 75, 80, 65];
console.log(min(temperatures)); // 65
console.log(max(temperatures)); // 80
```

### Range

```js
import { init, range } from '@stats/core';

await init();

const values = [10, 25, 30, 45, 50];
const spread = range(values);
console.log(spread); // 40
```

## Variance and Standard Deviation

### Population Variance

```js
import { init, variance } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5];
const popVariance = variance(data);
console.log(popVariance); // 2
```

### Sample Variance

```js
import { init, sampleVariance } from '@stats/core';

await init();

const sample = [1, 2, 3, 4, 5];
const sampVariance = sampleVariance(sample);
console.log(sampVariance); // 2.5
```

### Standard Deviation

```js
import { init, stdev, sampleStdev } from '@stats/core';

await init();

const data = [10, 20, 30, 40, 50];

// Population standard deviation
const popStd = stdev(data);
console.log(popStd); // 14.142...

// Sample standard deviation
const sampStd = sampleStdev(data);
console.log(sampStd); // 15.811...
```

## Advanced Statistics

### Median

```js
import { init, median } from '@stats/core';

await init();

const oddData = [1, 3, 5, 7, 9];
console.log(median(oddData)); // 5

const evenData = [1, 2, 3, 4, 5, 6];
console.log(median(evenData)); // 3.5
```

### Mode

```js
import { init, mode } from '@stats/core';

await init();

const data = [1, 2, 2, 3, 3, 3, 4];
const mostFrequent = mode(data);
console.log(mostFrequent); // 3
```

### Geometric Mean

```js
import { init, geomean } from '@stats/core';

await init();

// Geometric mean requires positive values
const growthRates = [1.05, 1.10, 1.08, 1.12];
const avgGrowth = geomean(growthRates);
console.log(avgGrowth); // 1.087...
```

### Skewness

```js
import { init, skewness } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5, 100]; // Right-skewed
const skew = skewness(data);
console.log(skew); // Positive value indicating right skew
```

### Kurtosis

```js
import { init, kurtosis } from '@stats/core';

await init();

const data = [1, 2, 3, 4, 5];
const kurt = kurtosis(data);
console.log(kurt); // -1.2 (negative = platykurtic)
```

## Coefficient of Variation

```js
import { init, coeffvar } from '@stats/core';

await init();

// Coefficient of variation = stdev / mean
const data = [10, 20, 30, 40, 50];
const cv = coeffvar(data);
console.log(cv); // 0.471...
```

## Working with Different Array Types

The library accepts any `ArrayLike<number>`:

```js
import { init, mean } from '@stats/core';

await init();

// Regular arrays
const arr1 = [1, 2, 3];
console.log(mean(arr1)); // 2

// Typed arrays
const arr2 = new Float64Array([1, 2, 3]);
console.log(mean(arr2)); // 2

// Array-like objects
const arr3 = { 0: 1, 1: 2, 2: 3, length: 3 };
console.log(mean(arr3)); // 2
```

