# Feature Comparison: @stats/core vs jStat

This document compares the features available in `@stats/core` versus `jStat`.

## Summary

| Category | Implemented | Missing | Total |
|----------|-------------|---------|-------|
| **Vector Statistics** | 22 | 7 | 29 |
| **Distributions** | 4 | 17 | 21 |
| **Statistical Tests** | 1 | 9 | 10 |
| **Matrix Operations** | 0 | 22 | 22 |
| **Linear Algebra** | 0 | 13 | 13 |
| **Other** | 0 | 82 | 82 |
| **Total** | **27** | **150** | **177** |

---

## ✅ Implemented Features

### Vector Statistics (22/29)

#### Basic Operations
- ✅ `sum` - Sum of array elements
- ✅ `mean` - Arithmetic mean
- ✅ `min` - Minimum value
- ✅ `max` - Maximum value
- ✅ `product` - Product of array elements
- ✅ `range` - Range (max - min)

#### Variance & Standard Deviation
- ✅ `variance` - Population variance
- ✅ `sampleVariance` - Sample variance (Bessel's correction)
- ✅ `stdev` - Population standard deviation
- ✅ `sampleStdev` - Sample standard deviation

#### Advanced Statistics
- ✅ `median` - Median value
- ✅ `mode` - Mode (most frequent value)
- ✅ `geomean` - Geometric mean
- ✅ `skewness` - Skewness (third moment)
- ✅ `kurtosis` - Kurtosis (fourth moment)

#### Quantiles & Percentiles
- ✅ `percentile` - Percentile with linear interpolation
- ✅ `quartiles` - First, second (median), third quartiles
- ✅ `iqr` - Interquartile range
- ✅ `quantiles` - Multiple quantiles at once

#### Correlation
- ✅ `covariance` - Covariance between two arrays
- ✅ `corrcoeff` - Pearson correlation coefficient

#### Transformations
- ✅ `cumsum` - Cumulative sum
- ✅ `diff` - Differences between consecutive elements
- ✅ `rank` - Rank values (with tie handling)
- ✅ `histogram` - Histogram with auto or custom bins

#### Statistical Tests
- ✅ `anovaFScore` / `anovaTest` - One-way ANOVA

### Distributions (4/21)

- ✅ `normal` - Normal/Gaussian distribution (pdf, cdf, inv)
- ✅ `gamma` - Gamma distribution (pdf, cdf, inv)
- ✅ `beta` - Beta distribution (pdf, cdf, inv)
- ✅ `fisherF` - Fisher's F-distribution (pdf, cdf, inv)

---

## ❌ Missing Features

### Vector Statistics (7 missing)

#### Basic Statistics
- ❌ `coeffvar` - Coefficient of variation
- ❌ `deviation` - Deviation from mean
- ❌ `meandev` - Mean deviation
- ❌ `meddev` - Median deviation
- ❌ `pooledstdev` - Pooled standard deviation
- ❌ `pooledvariance` - Pooled variance
- ❌ `stanMoment` - Standardized moment

#### Quantiles/Percentiles
- ❌ `percentileOfScore` - Find percentile rank of a value
- ❌ `qscore` - Quantile score
- ❌ `qtest` - Quantile test

#### Correlation
- ❌ `spearmancoeff` - Spearman rank correlation coefficient

#### Transformations
- ❌ `cumprod` - Cumulative product
- ❌ `cumreduce` - Cumulative reduction

### Distributions (17 missing)

- ❌ `binomial` - Binomial distribution
- ❌ `cauchy` - Cauchy distribution
- ❌ `chisquare` - Chi-square distribution
- ❌ `exponential` - Exponential distribution
- ❌ `invgamma` - Inverse gamma distribution
- ❌ `laplace` - Laplace distribution
- ❌ `lognormal` - Log-normal distribution
- ❌ `negbin` - Negative binomial distribution
- ❌ `pareto` - Pareto distribution
- ❌ `poisson` - Poisson distribution
- ❌ `studentt` - Student's t-distribution
- ❌ `triangular` - Triangular distribution
- ❌ `uniform` - Uniform distribution
- ❌ `weibull` - Weibull distribution
- ❌ `kumaraswamy` - Kumaraswamy distribution
- ❌ `arcsine` - Arcsine distribution
- ❌ `noncentralt` - Non-central t-distribution
- ❌ `centralF` - Central F-distribution (we have Fisher F, but not central F)

### Statistical Tests (9 missing)

- ❌ `ztest` - Z-test
- ❌ `ttest` - T-test
- ❌ `ftest` - F-test
- ❌ `tukey` - Tukey test
- ❌ `tukeyhsd` - Tukey HSD (Honestly Significant Difference)
- ❌ `regress` - Linear regression
- ❌ `regresst` - Linear regression with t-statistics
- ❌ `normalci` - Normal confidence interval
- ❌ `tci` - T-distribution confidence interval

#### Regression Utilities
- ❌ `sse` - Sum of squared errors
- ❌ `ssr` - Sum of squares regression
- ❌ `sst` - Total sum of squares
- ❌ `sumsqerr` - Sum of squared errors
- ❌ `meansqerr` - Mean squared error
- ❌ `residuals` - Regression residuals

#### Distribution Utilities
- ❌ `zscore` - Z-score
- ❌ `tscore` - T-score

### Matrix Operations (22 missing)

#### Basic Operations
- ❌ `matrixmult` - Matrix multiplication
- ❌ `matrixsubtract` - Matrix subtraction
- ❌ `transpose` - Matrix transpose
- ❌ `inv` - Matrix inverse
- ❌ `det` - Matrix determinant
- ❌ `dot` - Dot product

#### Matrix Creation
- ❌ `identity` - Identity matrix
- ❌ `ones` - Matrix of ones
- ❌ `zeros` - Matrix of zeros
- ❌ `diag` - Diagonal matrix
- ❌ `antidiag` - Anti-diagonal matrix

#### Matrix Access
- ❌ `cols` - Number of columns
- ❌ `rows` - Number of rows
- ❌ `col` - Get column
- ❌ `row` - Get row
- ❌ `cola` - Get column as array
- ❌ `rowa` - Get row as array
- ❌ `slice` - Matrix slice
- ❌ `sliceAssign` - Assign to matrix slice

#### Matrix Utilities
- ❌ `copy` - Copy matrix
- ❌ `extend` - Extend matrix
- ❌ `dimensions` - Matrix dimensions
- ❌ `sumrow` - Sum rows

### Linear Algebra (13 missing)

- ❌ `QR` - QR decomposition
- ❌ `SOR` - Successive Over-Relaxation
- ❌ `cholesky` - Cholesky decomposition
- ❌ `lu` - LU decomposition
- ❌ `gauss_elimination` - Gaussian elimination
- ❌ `gauss_jordan` - Gauss-Jordan elimination
- ❌ `gauss_jacobi` - Gauss-Jacobi method
- ❌ `gauss_seidel` - Gauss-Seidel method
- ❌ `householder` - Householder transformation
- ❌ `jacobi` - Jacobi method
- ❌ `lstsq` - Least squares
- ❌ `triaLowSolve` - Solve lower triangular system
- ❌ `triaUpSolve` - Solve upper triangular system

### Interpolation (3 missing)

- ❌ `cubic_spline` - Cubic spline interpolation
- ❌ `lagrange` - Lagrange interpolation
- ❌ `hermite` - Hermite interpolation

### Numerical Methods (5 missing)

- ❌ `gauss_quadrature` - Gauss quadrature
- ❌ `simpson` - Simpson's rule
- ❌ `romberg` - Romberg integration
- ❌ `richardson` - Richardson extrapolation
- ❌ `rungekutta` - Runge-Kutta method

### Matrix Builders (10 missing)

- ❌ `builddxmatrix` - Build design matrix
- ❌ `buildjxmatrix` - Build J matrix
- ❌ `buildjymatrix` - Build JY matrix
- ❌ `buildxmatrix` - Build X matrix
- ❌ `buildymatrix` - Build Y matrix
- ❌ `jMatYBar` - J matrix Y bar
- ❌ `xtranspx` - X transpose X
- ❌ `xtranspxinv` - (X transpose X) inverse
- ❌ `aug` - Augment matrix
- ❌ `alter` - Alter matrix

### Combinatorics (5 missing)

- ❌ `factorial` - Factorial
- ❌ `factorialln` - Natural log of factorial
- ❌ `combination` - Combinations (n choose k)
- ❌ `combinationln` - Natural log of combinations
- ❌ `permutation` - Permutations

### Special Functions (14 missing)

#### Gamma Functions
- ❌ `gammafn` - Gamma function
- ❌ `gammaln` - Natural log of gamma function
- ❌ `gammap` - Incomplete gamma function
- ❌ `gammapinv` - Inverse incomplete gamma function
- ❌ `loggam` - Log gamma function
- ❌ `lowRegGamma` - Lower regularized gamma function

#### Beta Functions
- ❌ `betafn` - Beta function
- ❌ `betaln` - Natural log of beta function
- ❌ `betacf` - Beta continued fraction
- ❌ `ibeta` - Incomplete beta function
- ❌ `ibetainv` - Inverse incomplete beta function

#### Error Functions
- ❌ `erf` - Error function
- ❌ `erfc` - Complementary error function
- ❌ `erfcinv` - Inverse complementary error function

### Array Utilities (16 missing)

#### Element-wise Operations
- ❌ `abs` - Absolute value
- ❌ `exp` - Exponential
- ❌ `log` - Natural logarithm
- ❌ `pow` - Power
- ❌ `add` - Element-wise addition
- ❌ `subtract` - Element-wise subtraction
- ❌ `multiply` - Element-wise multiplication
- ❌ `divide` - Element-wise division

#### Array Creation & Manipulation
- ❌ `map` - Map function over array
- ❌ `unique` - Unique values
- ❌ `arange` - Array range
- ❌ `seq` - Sequence generation

#### Random Number Generation
- ❌ `rand` - Random numbers
- ❌ `randn` - Random normal distribution
- ❌ `randg` - Random gamma distribution
- ❌ `setRandom` - Set random seed

### Other (4 missing)

- ❌ `angle` - Angle between vectors
- ❌ `symmetric` - Check if matrix is symmetric
- ❌ `significant` - Significant digits
- ❌ `clear` - Clear matrix/data

---

## Priority Recommendations

### High Priority (Core Statistics)

1. **Spearman Correlation** (`spearmancoeff`) - Important alternative to Pearson correlation
2. **Cumulative Product** (`cumprod`) - Common transformation
3. **Coefficient of Variation** (`coeffvar`) - Useful normalized measure
4. **Percentile of Score** (`percentileOfScore`) - Inverse of percentile
5. **Additional Distributions**: `studentt`, `exponential`, `poisson`, `binomial` - Most commonly used

### Medium Priority (Statistical Tests)

1. **T-test** (`ttest`) - Very common statistical test
2. **Z-test** (`ztest`) - Common statistical test
3. **Linear Regression** (`regress`) - Fundamental statistical tool
4. **Confidence Intervals** (`normalci`, `tci`) - Important inference tools

### Low Priority (Advanced Features)

1. **Matrix Operations** - If linear algebra is needed
2. **Linear Algebra** - For advanced statistical computing
3. **Interpolation** - For data smoothing/interpolation
4. **Combinatorics** - For probability calculations

---

## Notes

- **Focus**: `@stats/core` focuses on **high-performance vector statistics** with SIMD optimizations
- **Distributions**: Currently supports 4 distributions (normal, gamma, beta, fisherF) with full pdf/cdf/inv support
- **Matrix Operations**: Not currently implemented (jStat has extensive matrix support)
- **Performance**: Implemented functions are significantly faster than jStat (see PERFORMANCE.md)

---

*Last updated: Based on jStat API comparison*

