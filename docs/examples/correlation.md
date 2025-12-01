# Correlation Examples

Real-world scenarios using correlation and covariance functions from `@addmaple/stats`.

## Study Hours vs Test Scores Analysis

Complete analysis of the relationship between study hours and test scores:

```js
import { init, corrcoeff, spearmancoeff, covariance, mean, stdev } from '@addmaple/stats';

await init();

const studyHours = [5, 10, 15, 20, 25, 30, 8, 12, 18, 22];
const testScores = [60, 70, 80, 85, 90, 92, 65, 72, 82, 87];

// Pearson correlation (linear relationship)
const pearson = corrcoeff(studyHours, testScores);
console.log(`Pearson correlation: ${pearson.toFixed(3)}`);

// Spearman correlation (monotonic relationship)
const spearman = spearmancoeff(studyHours, testScores);
console.log(`Spearman correlation: ${spearman.toFixed(3)}`);

// Covariance
const cov = covariance(studyHours, testScores);
console.log(`Covariance: ${cov.toFixed(2)}`);

// Interpretation
if (pearson > 0.7) {
  console.log('✅ Strong positive relationship: more study hours → higher scores');
} else if (pearson > 0.3) {
  console.log('⚠️ Moderate relationship');
} else {
  console.log('❌ Weak or no relationship');
}

// Additional insights
const avgHours = mean(studyHours);
const avgScore = mean(testScores);
console.log(`\nAverage study hours: ${avgHours.toFixed(1)}`);
console.log(`Average test score: ${avgScore.toFixed(1)}`);
```

## Price vs Demand Analysis

Analyzing the relationship between price and demand for a product:

```js
import { init, corrcoeff, regress } from '@addmaple/stats';

await init();

// Product prices (dollars)
const prices = [10, 15, 20, 25, 30, 35, 40];
// Units sold
const demand = [1000, 800, 600, 500, 400, 350, 300];

// Correlation
const correlation = corrcoeff(prices, demand);
console.log(`Price-Demand correlation: ${correlation.toFixed(3)}`);

// Linear regression for prediction
const regression = regress(prices, demand);
console.log(`\nRegression equation: demand = ${regression.intercept.toFixed(0)} + (${regression.slope.toFixed(1)} × price)`);
console.log(`R-squared: ${regression.rSquared.toFixed(3)}`);

// Predict demand at different prices
const predictPrice = 22;
const predictedDemand = regression.intercept + regression.slope * predictPrice;
console.log(`\nPredicted demand at $${predictPrice}: ${predictedDemand.toFixed(0)} units`);

// Business insight
if (Math.abs(correlation) > 0.7) {
  console.log('\n💡 Strong relationship: price changes significantly affect demand');
} else {
  console.log('\n💡 Weak relationship: demand is less sensitive to price changes');
}
```

## Temperature and Energy Consumption

Analyzing the relationship between temperature and energy costs:

```js
import { init, corrcoeff, spearmancoeff } from '@addmaple/stats';

await init();

// Monthly average temperatures (Fahrenheit)
const temperatures = [40, 45, 55, 65, 75, 85, 90, 88, 80, 70, 55, 42];
// Monthly energy costs (dollars)
const energyCosts = [250, 220, 180, 150, 120, 140, 160, 155, 130, 160, 190, 240];

// Pearson correlation
const pearson = corrcoeff(temperatures, energyCosts);
console.log(`Pearson correlation: ${pearson.toFixed(3)}`);

// Spearman (for potential non-linear relationship)
const spearman = spearmancoeff(temperatures, energyCosts);
console.log(`Spearman correlation: ${spearman.toFixed(3)}`);

// Interpretation
if (pearson < -0.5) {
  console.log('✅ Strong negative relationship: colder months = higher energy costs');
} else if (Math.abs(pearson) < 0.3) {
  console.log('⚠️ Weak relationship: temperature has limited impact on costs');
}

// Find optimal temperature range
const minCost = Math.min(...energyCosts);
const minCostIndex = energyCosts.indexOf(minCost);
const optimalTemp = temperatures[minCostIndex];
console.log(`\nOptimal temperature range: ~${optimalTemp}°F (cost: $${minCost})`);
```

## Comparing Pearson vs Spearman

When to use which correlation measure:

```js
import { init, corrcoeff, spearmancoeff } from '@addmaple/stats';

await init();

// Scenario 1: Linear relationship
const x1 = [1, 2, 3, 4, 5];
const y1 = [2, 4, 6, 8, 10];

const pearson1 = corrcoeff(x1, y1);
const spearman1 = spearmancoeff(x1, y1);
console.log('Linear relationship:');
console.log(`  Pearson: ${pearson1.toFixed(3)}`);
console.log(`  Spearman: ${spearman1.toFixed(3)}`);
console.log('  → Both similar for linear relationships');

// Scenario 2: Non-linear but monotonic relationship
const x2 = [1, 2, 3, 4, 5];
const y2 = [1, 4, 9, 16, 25]; // Quadratic

const pearson2 = corrcoeff(x2, y2);
const spearman2 = spearmancoeff(x2, y2);
console.log('\nNon-linear monotonic (quadratic):');
console.log(`  Pearson: ${pearson2.toFixed(3)} (lower - not perfectly linear)`);
console.log(`  Spearman: ${spearman2.toFixed(3)} (perfect - monotonic)`);
console.log('  → Spearman captures the relationship better');

// Scenario 3: Data with outliers
const x3 = [1, 2, 3, 4, 5, 100]; // Outlier
const y3 = [2, 4, 6, 8, 10, 12];

const pearson3 = corrcoeff(x3, y3);
const spearman3 = spearmancoeff(x3, y3);
console.log('\nData with outliers:');
console.log(`  Pearson: ${pearson3.toFixed(3)} (affected by outlier)`);
console.log(`  Spearman: ${spearman3.toFixed(3)} (more robust)`);
console.log('  → Spearman is more robust to outliers');
```

## Multi-Variable Correlation Analysis

Analyzing relationships between multiple variables:

```js
import { init, corrcoeff } from '@addmaple/stats';

await init();

// Student data
const studyHours = [5, 10, 15, 20, 25, 30, 8, 12, 18, 22];
const testScores = [60, 70, 80, 85, 90, 92, 65, 72, 82, 87];
const sleepHours = [6, 7, 8, 7, 6, 8, 7, 8, 7, 6];

// Calculate correlation matrix
const studyScore = corrcoeff(studyHours, testScores);
const studySleep = corrcoeff(studyHours, sleepHours);
const scoreSleep = corrcoeff(testScores, sleepHours);

console.log('Correlation Matrix:');
console.log('                    Study Hours  Test Scores  Sleep Hours');
console.log(`Study Hours           1.000        ${studyScore.toFixed(3)}       ${studySleep.toFixed(3)}`);
console.log(`Test Scores           ${studyScore.toFixed(3)}        1.000        ${scoreSleep.toFixed(3)}`);
console.log(`Sleep Hours           ${studySleep.toFixed(3)}        ${scoreSleep.toFixed(3)}        1.000`);

// Insights
console.log('\nInsights:');
if (studyScore > 0.7) {
  console.log('✅ Strong positive: More study hours → Higher test scores');
}
if (scoreSleep > 0.3) {
  console.log('✅ Moderate positive: More sleep → Higher test scores');
}
if (Math.abs(studySleep) < 0.2) {
  console.log('⚠️ Weak: Study hours and sleep are independent');
}
```

## Height and Weight Relationship

Classic example of positive correlation:

```js
import { init, corrcoeff, covariance, regress } from '@addmaple/stats';

await init();

// Heights (inches) and weights (pounds)
const heights = [65, 68, 70, 72, 74, 66, 69, 71, 73, 67];
const weights = [120, 140, 160, 180, 200, 125, 145, 165, 185, 130];

const correlation = corrcoeff(heights, weights);
const cov = covariance(heights, weights);
const regression = regress(heights, weights);

console.log(`Correlation: ${correlation.toFixed(3)}`);
console.log(`Covariance: ${cov.toFixed(2)}`);
console.log(`\nRegression: weight = ${regression.intercept.toFixed(1)} + (${regression.slope.toFixed(2)} × height)`);
console.log(`R-squared: ${regression.rSquared.toFixed(3)}`);

// Predict weight for a given height
const predictHeight = 70;
const predictedWeight = regression.intercept + regression.slope * predictHeight;
console.log(`\nPredicted weight for ${predictHeight}" person: ${predictedWeight.toFixed(1)} lbs`);

// Interpretation
if (correlation > 0.8) {
  console.log('\n✅ Very strong positive relationship');
  console.log('   On average, each inch of height corresponds to about', regression.slope.toFixed(1), 'pounds');
}
```
