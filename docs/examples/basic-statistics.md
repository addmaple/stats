# Basic Statistics Examples

Real-world scenarios using basic statistical functions from `@addmaple/stats`.

## Analyzing Sales Data

Complete analysis of monthly sales data combining multiple statistical functions:

```js
import { init, sum, mean, median, stdev, sampleStdev, min, max, range } from '@addmaple/stats';

await init();

// Monthly sales for the year
const monthlySales = [12000, 13500, 12800, 14200, 15100, 16800, 17500, 18200, 16500, 14800, 13200, 15800];

// Basic summary
const totalSales = sum(monthlySales);
const avgSales = mean(monthlySales);
const medSales = median(monthlySales);
const stdDev = sampleStdev(monthlySales); // Use sample for real-world data

console.log(`Total sales: $${totalSales.toLocaleString()}`);
console.log(`Average monthly sales: $${avgSales.toLocaleString()}`);
console.log(`Median sales: $${medSales.toLocaleString()}`);
console.log(`Standard deviation: $${stdDev.toLocaleString()}`);

// Range and spread
const minSales = min(monthlySales);
const maxSales = max(monthlySales);
const salesRange = range(monthlySales);

console.log(`Best month: $${maxSales.toLocaleString()}`);
console.log(`Worst month: $${minSales.toLocaleString()}`);
console.log(`Variation: $${salesRange.toLocaleString()}`);
```

## Quality Control: Product Dimensions

Checking manufacturing consistency using variance and standard deviation:

```js
import { init, mean, variance, stdev, min, max } from '@addmaple/stats';

await init();

// Product dimensions (should be 100mm ± 0.5mm)
const measurements = [
  100.1, 100.2, 99.9, 100.0, 100.1,
  100.3, 99.8, 100.1, 100.0, 99.9,
  100.2, 100.1, 100.0, 99.9, 100.1
];

const avg = mean(measurements);
const varValue = variance(measurements);
const stdDev = stdev(measurements); // Population variance for all products
const spread = max(measurements) - min(measurements);

console.log(`Target: 100.0mm`);
console.log(`Average: ${avg.toFixed(2)}mm`);
console.log(`Standard deviation: ${stdDev.toFixed(3)}mm`);
console.log(`Range: ${spread.toFixed(1)}mm`);

// Quality check
const tolerance = 0.5;
if (stdDev < tolerance) {
  console.log('✅ Quality within tolerance');
} else {
  console.log('⚠️ Standard deviation exceeds tolerance');
}
```

## Test Score Analysis

Comprehensive test score analysis for a class:

```js
import { init, mean, median, mode, stdev, sampleStdev, min, max } from '@addmaple/stats';

await init();

const scores = [85, 90, 78, 92, 88, 75, 95, 85, 82, 90, 88, 91, 87, 85, 93];

// Central tendencies
const avgScore = mean(scores);
const medScore = median(scores);
const modeScore = mode(scores);
const stdDev = sampleStdev(scores);

console.log(`Average: ${avgScore.toFixed(1)}`);
console.log(`Median: ${medScore}`);
console.log(`Mode: ${modeScore}`);
console.log(`Standard deviation: ${stdDev.toFixed(2)}`);

// Spread analysis
const highest = max(scores);
const lowest = min(scores);
const spread = highest - lowest;

console.log(`\nHighest score: ${highest}`);
console.log(`Lowest score: ${lowest}`);
console.log(`Spread: ${spread} points`);

// Performance insights
if (avgScore > medScore) {
  console.log('\nDistribution: Right-skewed (some high outliers)');
} else if (avgScore < medScore) {
  console.log('\nDistribution: Left-skewed (some low outliers)');
} else {
  console.log('\nDistribution: Approximately symmetric');
}
```

## Temperature Analysis

Daily temperature tracking and analysis:

```js
import { init, mean, stdev, min, max, range, descriptiveStats } from '@addmaple/stats';

await init();

// Weekly temperatures (Fahrenheit)
const temps = [72, 68, 75, 80, 65, 70, 73];

const avgTemp = mean(temps);
const tempStdDev = stdev(temps);
const coldest = min(temps);
const hottest = max(temps);
const tempRange = range(temps);

console.log(`Average temperature: ${avgTemp.toFixed(1)}°F`);
console.log(`Temperature variation: ${tempStdDev.toFixed(1)}°F`);
console.log(`Coldest day: ${coldest}°F`);
console.log(`Hottest day: ${hottest}°F`);
console.log(`Temperature range: ${tempRange}°F`);

// Comfort analysis
const comfortableRange = [68, 75];
const daysInRange = temps.filter(t => t >= comfortableRange[0] && t <= comfortableRange[1]).length;
console.log(`\nDays in comfort zone (68-75°F): ${daysInRange}/${temps.length}`);

// One-shot descriptive snapshot
const stats = descriptiveStats(temps);
console.log('\nDescriptive stats:', {
  mean: stats.mean,
  median: stats.median,
  min: stats.min,
  max: stats.max,
  stdev: stats.sampleStdev,
  q1: stats.q1,
  q3: stats.q3,
});
```

## Population vs Sample Statistics

Understanding when to use population vs sample statistics:

```js
import { init, variance, sampleVariance, stdev, sampleStdev } from '@addmaple/stats';

await init();

// Data: Heights of students in a small class
const heights = [65, 68, 70, 72, 74, 66, 69, 71, 73, 67];

console.log('Scenario 1: All students in class (POPULATION)');
const popVar = variance(heights);
const popStdDev = stdev(heights);
console.log(`Population variance: ${popVar.toFixed(2)}`);
console.log(`Population std dev: ${popStdDev.toFixed(2)}`);

console.log('\nScenario 2: Sample from larger school (SAMPLE)');
const sampVar = sampleVariance(heights);
const sampStdDev = sampleStdev(heights);
console.log(`Sample variance: ${sampVar.toFixed(2)} (larger - Bessel's correction)`);
console.log(`Sample std dev: ${sampStdDev.toFixed(2)}`);

console.log('\n💡 Tip: Use sample statistics when you have a sample from a larger population');
console.log('   Use population statistics only when you have ALL the data');
```

## Combining Statistics for Insights

Using multiple statistics together for deeper analysis:

```js
import { init, mean, median, stdev, min, max, range } from '@addmaple/stats';

await init();

// Customer wait times (seconds)
const waitTimes = [45, 52, 38, 61, 55, 48, 42, 58, 51, 49];

const stats = {
  average: mean(waitTimes),
  median: median(waitTimes),
  stdDev: stdev(waitTimes),
  min: min(waitTimes),
  max: max(waitTimes),
  range: range(waitTimes)
};

console.log('Wait Time Analysis:');
console.log(`Average: ${stats.average.toFixed(1)}s`);
console.log(`Median: ${stats.median}s`);
console.log(`Std Dev: ${stats.stdDev.toFixed(1)}s`);
console.log(`Range: ${stats.range}s (${stats.min}s - ${stats.max}s)`);

// Insights
const difference = Math.abs(stats.average - stats.median);
if (difference < stats.stdDev) {
  console.log('\n✅ Distribution is fairly symmetric');
} else {
  console.log('\n⚠️ Distribution is skewed - median is more representative');
}

// Service level assessment
const targetWait = 50;
const aboveTarget = waitTimes.filter(t => t > targetWait).length;
console.log(`\nCustomers waiting > ${targetWait}s: ${aboveTarget}/${waitTimes.length} (${(aboveTarget/waitTimes.length*100).toFixed(0)}%)`);
```
