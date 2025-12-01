# Quick Start

Get up and running with `@stats/core` in minutes.

## Basic Setup

```js
import { init, mean, variance, stdev } from '@stats/core';

// Initialize WASM module (required once before using any functions)
await init();

// Now you can use the statistics functions
const data = [1, 2, 3, 4, 5];
console.log(mean(data));        // 3
console.log(variance(data));    // 2
console.log(stdev(data));       // 1.4142135623730951
```

## Initialization Pattern

The `init()` function must be called once before using any statistics functions. It's safe to call multiple times - it will only initialize once.

### Recommended Pattern

```js
import { init, mean } from '@stats/core';

// Initialize at module level or in your app startup
await init();

// Now use functions throughout your app
export function analyzeData(data) {
  return mean(data);
}
```

### Alternative: Lazy Initialization

```js
import { init, mean } from '@stats/core';

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

export async function analyzeData(data) {
  await ensureInit();
  return mean(data);
}
```

## Basic Statistics

```js
import { init, sum, mean, min, max, range } from '@stats/core';

await init();

const data = [10, 20, 30, 40, 50];

console.log(sum(data));    // 150
console.log(mean(data));   // 30
console.log(min(data));    // 10
console.log(max(data));    // 50
console.log(range(data));  // 40
```

## Advanced Statistics

```js
import { init, median, mode, skewness, kurtosis } from '@stats/core';

await init();

const data = [1, 2, 2, 3, 3, 3, 4, 5];

console.log(median(data));   // 3
console.log(mode(data));      // 3
console.log(skewness(data));  // -0.404...
console.log(kurtosis(data));  // -1.2...
```

## Distributions

```js
import { init, normal } from '@stats/core';

await init();

// Create a normal distribution with mean=0, sd=1
const dist = normal({ mean: 0, sd: 1 });

// Probability density function
console.log(dist.pdf(0));  // 0.3989...

// Cumulative distribution function
console.log(dist.cdf(1.96));  // 0.975...

// Inverse CDF (quantile function)
console.log(dist.inv(0.975));  // 1.96...

// Array operations
const x = [0, 1, 2, 3];
const pdfs = dist.pdfArray(x);
console.log(pdfs);  // Float64Array [0.3989..., 0.2420..., ...]
```

## Next Steps

- Check out the [Examples](/examples/) for more detailed use cases
- Browse the [API Reference](/api/) for all available functions
- Learn about [Performance](/guide/performance) optimizations

