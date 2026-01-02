# Statistical Tests Examples

Examples of statistical tests with `@addmaple/stats`.

## ANOVA (Analysis of Variance)

### Basic ANOVA F-Score

```js
import { init, anovaFScore } from '@addmaple/stats';

await init();

// Three groups with different means
const group1 = [2, 3, 7, 2, 6];
const group2 = [10, 11, 14, 13, 15];
const group3 = [20, 21, 24, 23, 25];

const fScore = anovaFScore([group1, group2, group3]);
console.log(`F-score: ${fScore}`); // High F-score indicates significant difference
```

### Full ANOVA Test with P-Value

```js
import { init, anovaTest, fisherF } from '@addmaple/stats';

await init();

// Control group and treatment group
const control = [2, 3, 7, 2, 6];
const treatment = [10, 11, 14, 13, 15];

const result = anovaTest([control, treatment]);
console.log(`F-score: ${result.fScore}`);
console.log(`DF between: ${result.dfBetween}`);
console.log(`DF within: ${result.dfWithin}`);
console.log(`P-value: ${result.pValue}`);

// Interpret results
if (result.pValue && result.pValue < 0.05) {
  console.log('Significant difference between groups (p < 0.05)');
} else {
  console.log('No significant difference');
}
```

### Real-World Example: Drug Efficacy

```js
import { init, anovaTest } from '@addmaple/stats';

await init();

// Three different drug dosages
const lowDose = [45, 50, 55, 48, 52];
const mediumDose = [60, 65, 70, 63, 67];
const highDose = [75, 80, 85, 78, 82];

const result = anovaTest([lowDose, mediumDose, highDose]);

console.log('ANOVA Results:');
console.log(`F-score: ${result.fScore.toFixed(2)}`);
console.log(`Degrees of freedom (between): ${result.dfBetween}`);
console.log(`Degrees of freedom (within): ${result.dfWithin}`);
console.log(`P-value: ${result.pValue?.toFixed(4)}`);

if (result.pValue && result.pValue < 0.05) {
  console.log('Conclusion: Dosage has a significant effect');
} else {
  console.log('Conclusion: No significant effect of dosage');
}
```

### Example: Teaching Methods

```js
import { init, anovaTest } from '@addmaple/stats';

await init();

// Test scores from three different teaching methods
const methodA = [75, 78, 80, 82, 85];
const methodB = [70, 72, 75, 77, 80];
const methodC = [85, 88, 90, 92, 95];

const result = anovaTest([methodA, methodB, methodC]);

console.log('Teaching Method Comparison:');
console.log(`F-score: ${result.fScore.toFixed(2)}`);
console.log(`P-value: ${result.pValue?.toFixed(4)}`);

// Effect size (eta-squared approximation)
const ssBetween = result.fScore * result.dfBetween;
const ssWithin = result.dfWithin;
const etaSquared = ssBetween / (ssBetween + ssWithin);
console.log(`Effect size (η²): ${etaSquared.toFixed(3)}`);
```

### Multiple Groups Comparison

```js
import { init, anovaTest } from '@addmaple/stats';

await init();

// Comparing performance across 4 different regions
const region1 = [100, 105, 110, 108, 112];
const region2 = [95, 98, 102, 100, 104];
const region3 = [110, 115, 120, 118, 122];
const region4 = [90, 92, 95, 93, 97];

const result = anovaTest([region1, region2, region3, region4]);

console.log('Regional Performance Analysis:');
console.log(`F-score: ${result.fScore.toFixed(2)}`);
console.log(`DF between: ${result.dfBetween} (groups - 1)`);
console.log(`DF within: ${result.dfWithin} (total - groups)`);
console.log(`P-value: ${result.pValue?.toFixed(4)}`);

if (result.pValue && result.pValue < 0.05) {
  console.log('Significant regional differences detected');
} else {
  console.log('No significant regional differences');
}
```

### Error Handling

```js
import { init, anovaFScore } from '@addmaple/stats';

await init();

// Need at least 2 groups
const singleGroup = [1, 2, 3];
const fScore = anovaFScore([singleGroup]);
console.log(fScore); // NaN

// Groups must have data
const emptyGroup = [];
const fScore2 = anovaFScore([emptyGroup, [1, 2, 3]]);
console.log(fScore2); // NaN
```

## Interpreting ANOVA Results

```js
import { init, anovaTest } from '@addmaple/stats';

await init();

function interpretAnova(groups) {
  const result = anovaTest(groups);
  
  console.log('=== ANOVA Results ===');
  console.log(`F-statistic: ${result.fScore.toFixed(3)}`);
  console.log(`Degrees of freedom: ${result.dfBetween}, ${result.dfWithin}`);
  console.log(`P-value: ${result.pValue?.toFixed(4)}`);
  
  if (!result.pValue) {
    console.log('Could not calculate p-value');
    return;
  }
  
  // Interpretation
  if (result.pValue < 0.001) {
    console.log('Interpretation: Highly significant (p < 0.001)');
  } else if (result.pValue < 0.01) {
    console.log('Interpretation: Very significant (p < 0.01)');
  } else if (result.pValue < 0.05) {
    console.log('Interpretation: Significant (p < 0.05)');
  } else {
    console.log('Interpretation: Not significant (p >= 0.05)');
  }
  
  return result;
}

// Example usage
const group1 = [10, 12, 14, 11, 13];
const group2 = [20, 22, 24, 21, 23];
interpretAnova([group1, group2]);
```









