# Feature Comparison: stats vs jStat

This document compares the current implementation with [jStat v1.9.3](https://jstat.github.io/all.html) to identify missing features.

## ✅ Currently Implemented

### Vector Statistics
- ✅ `sum()` - Sum of array elements
- ✅ `mean()` - Arithmetic mean
- ✅ `variance()` - Population variance
- ✅ `sampleVariance()` - Sample variance (Bessel's correction)
- ✅ `stdev()` - Population standard deviation
- ✅ `sampleStdev()` - Sample standard deviation

---

## ❌ Missing Features

### Vector Functionality (jStat Vector API)

#### Basic Operations
- ❌ `sumsqrd()` - Sum of squares
- ❌ `sumsqerr()` - Sum of squared errors
- ❌ `sumrow()` - Sum of rows (matrix operation)
- ❌ `product()` - Product of array elements
- ❌ `min()` - Minimum value
- ❌ `max()` - Maximum value
- ❌ `range()` - Range (max - min)

#### Advanced Statistics
- ❌ `meansqerr()` - Mean squared error
- ❌ `geomean()` - Geometric mean
- ❌ `median()` - Median value
- ❌ `mode()` - Mode (most frequent value)
- ❌ `skewness()` - Skewness measure
- ❌ `kurtosis()` - Kurtosis measure
- ❌ `coeffvar()` - Coefficient of variation

#### Cumulative Operations
- ❌ `cumsum()` - Cumulative sum
- ❌ `cumprod()` - Cumulative product
- ❌ `diff()` - Differences between consecutive elements

#### Ranking & Ordering
- ❌ `rank()` - Rank of elements

#### Deviation Measures
- ❌ `deviation()` - Deviation from mean
- ❌ `meandev()` - Mean deviation
- ❌ `meddev()` - Median deviation
- ❌ `pooledvariance()` - Pooled variance
- ❌ `pooledstdev()` - Pooled standard deviation

#### Quantiles & Percentiles
- ❌ `quartiles()` - First, second, third quartiles
- ❌ `quantiles()` - Quantiles at specified probabilities
- ❌ `percentile()` - Percentile value
- ❌ `percentileOfScore()` - Percentile rank of a score

#### Binning & Histograms
- ❌ `histogram()` - Histogram binning

#### Correlation & Covariance
- ❌ `covariance()` - Covariance between two arrays
- ❌ `corrcoeff()` - Correlation coefficient

---

### Core Functionality (jStat Matrix/Array API)

#### Matrix Creation
- ❌ `jStat()` - Main constructor for creating jStat objects
- ❌ `create()` - Create matrix from data
- ❌ `zeros()` - Create matrix of zeros
- ❌ `ones()` - Create matrix of ones
- ❌ `rand()` - Create matrix of random numbers
- ❌ `identity()` - Create identity matrix
- ❌ `seq()` - Create sequence
- ❌ `arange()` - Create array range

#### Matrix Operations
- ❌ `rows()` - Get number of rows
- ❌ `rowa()` - Get row as array
- ❌ `cols()` - Get number of columns
- ❌ `cola()` - Get column as array
- ❌ `row()` - Get row (jStat object)
- ❌ `col()` - Get column (jStat object)
- ❌ `slice()` - Slice matrix
- ❌ `sliceAssign()` - Assign to slice
- ❌ `dimensions()` - Get matrix dimensions
- ❌ `diag()` - Get diagonal
- ❌ `antidiag()` - Get anti-diagonal
- ❌ `diagonal()` - Set/get diagonal
- ❌ `transpose()` - Transpose matrix
- ❌ `symmetric()` - Check if symmetric

#### Matrix Transformations
- ❌ `map(func)` - Map function over elements
- ❌ `cumreduce(func)` - Cumulative reduction
- ❌ `alter(func)` - Alter elements in place
- ❌ `copy()` - Copy matrix
- ❌ `clear()` - Clear matrix

---

### Distributions

All distribution functionality is missing. jStat supports the following distributions, each with methods: `pdf()`, `cdf()`, `inv()`, `mean()`, `median()`, `mode()`, `sample()`, `variance()` (where applicable):

#### Continuous Distributions
- ❌ `jStat.beta(alpha, beta)` - Beta distribution
- ❌ `jStat.centralF(df1, df2)` - F-distribution
- ❌ `jStat.cauchy(local, scale)` - Cauchy distribution
- ❌ `jStat.chisquare(dof)` - Chi-square distribution
- ❌ `jStat.exponential(rate)` - Exponential distribution
- ❌ `jStat.gamma(shape, scale)` - Gamma distribution
- ❌ `jStat.invgamma(shape, scale)` - Inverse gamma distribution
- ❌ `jStat.kumaraswamy(alpha, beta)` - Kumaraswamy distribution
- ❌ `jStat.lognormal(mu, sigma)` - Lognormal distribution
- ❌ `jStat.normal(mean, std)` - Normal distribution
- ❌ `jStat.pareto(scale, shape)` - Pareto distribution
- ❌ `jStat.studentt(dof)` - Student's t-distribution
- ❌ `jStat.tukey(nmeans, dof)` - Tukey distribution
- ❌ `jStat.weibull(scale, shape)` - Weibull distribution

#### Discrete Distributions (if applicable)
- Note: jStat documentation doesn't show discrete distributions in the provided content, but common ones would include:
  - ❌ Binomial
  - ❌ Poisson
  - ❌ Negative binomial
  - ❌ Uniform (discrete)

---

### Statistical Tests

#### Z-Tests
- ❌ `zscore(value, mean, sd)` - Z-score calculation
- ❌ `zscore(value, array[, flag])` - Z-score from array
- ❌ `ztest(value, mean, sd, sides)` - Z-test p-value
- ❌ `ztest(zscore, sides)` - Z-test from z-score
- ❌ `ztest(value, array, sides[, flag])` - Z-test from array
- ❌ Instance method: `zscore(value[, flag])`
- ❌ Instance method: `ztest(value, sides[, flag])`

#### T-Tests
- ❌ `tscore(value, mean, sd, n)` - T-score calculation
- ❌ `tscore(value, array)` - T-score from array
- ❌ `ttest(value, mean, sd, n, sides)` - T-test p-value
- ❌ `ttest(tscore, n, sides)` - T-test from t-score
- ❌ `ttest(value, array, sides)` - T-test from array
- ❌ Instance method: `tscore(value)`
- ❌ Instance method: `ttest(value, sides)`

#### F-Tests & ANOVA
- ❌ `anovafscore(array1, array2, ..., arrayn)` - ANOVA F-score
- ❌ `anovafscore([array1, array2, ..., arrayn])` - ANOVA F-score (array form)
- ❌ `anovaftest(array1, array2, ..., arrayn)` - ANOVA F-test p-value
- ❌ `ftest(fscore, df1, df2)` - F-test p-value
- ❌ Instance method: `anovafscore()`
- ❌ Instance method: `anovaftest()`

#### Tukey's Range Test
- ❌ `qscore(mean1, mean2, n1, n2, sd)` - Q-score
- ❌ `qscore(array1, array2, sd)` - Q-score from arrays
- ❌ `qtest(qscore, n, k)` - Q-test p-value
- ❌ `qtest(mean1, mean2, n1, n2, sd, n, k)` - Q-test with parameters
- ❌ `qtest(array1, array2, sd, n, k)` - Q-test from arrays
- ❌ `tukeyhsd(arrays)` - Full Tukey HSD test

#### Confidence Intervals
- ❌ `normalci(value, alpha, sd, n)` - Normal distribution CI
- ❌ `normalci(value, alpha, array)` - Normal CI from array
- ❌ `tci(value, alpha, sd, n)` - T-distribution CI
- ❌ `tci(value, alpha, array)` - T CI from array

#### Proportion Tests
- ❌ `fn.oneSidedDifferenceOfProportions(p1, n1, p2, n2)` - One-sided proportion test
- ❌ `fn.twoSidedDifferenceOfProportions(p1, n1, p2, n2)` - Two-sided proportion test

---

### Utility Methods

- ❌ `utils.calcRdx(num0, num1)` - Calculate rounding decimal places
- ❌ `utils.isArray(arg)` - Check if argument is array
- ❌ `utils.isFunction(arg)` - Check if argument is function
- ❌ `utils.isNumber(arg)` - Check if argument is number

---

## Summary Statistics

### Implementation Status
- **Vector Statistics**: 6/35 implemented (~17%)
- **Core/Matrix Operations**: 0/25 implemented (0%)
- **Distributions**: 0/14+ implemented (0%)
- **Statistical Tests**: 0/20+ implemented (0%)
- **Utilities**: 0/4 implemented (0%)

### Overall Coverage
- **Total Features**: ~98+ features in jStat
- **Implemented**: 6 features
- **Missing**: ~92+ features
- **Coverage**: ~6%

---

## Priority Recommendations

Based on jStat's usage patterns and your plan.md, here are recommended priorities:

### Phase 1 (High Priority - Core Statistics)
1. **Basic vector operations**: `min`, `max`, `product`, `range`
2. **Central tendency**: `median`, `mode`, `geomean`
3. **Shape measures**: `skewness`, `kurtosis`
4. **Quantiles**: `quartiles`, `quantiles`, `percentile`
5. **Correlation**: `covariance`, `corrcoeff`

### Phase 2 (Distributions)
1. **Normal distribution** - Most commonly used
2. **Student's t** - Essential for t-tests
3. **Chi-square** - Common in hypothesis testing
4. **F-distribution** - For ANOVA
5. **Gamma, Beta, Exponential** - Common continuous distributions

### Phase 3 (Statistical Tests)
1. **T-tests** - Most common hypothesis test
2. **Z-tests** - For large samples
3. **ANOVA** - Analysis of variance
4. **Confidence intervals** - Normal and t-based

### Phase 4 (Matrix Operations)
1. Basic matrix creation and manipulation
2. Matrix statistics (row/column operations)
3. Linear algebra operations (as planned)

### Phase 5 (Advanced Features)
1. Histogram binning
2. Tukey's HSD test
3. Proportion tests
4. Advanced matrix operations







