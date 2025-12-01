# Feature Comparison: @stats/core vs jStat

This document compares the features available in `@stats/core` versus `jStat`.

## Summary

| Category | Implemented | Missing | Total |
|----------|-------------|---------|-------|
| **Vector Statistics** | 35 | 0 | 35 |
| **Distributions** | 18 | 3 | 21 |
| **Statistical Tests** | 7 | 3 | 10 |
| **Matrix Operations** | 0 | 22 | 22 |
| **Linear Algebra** | 0 | 13 | 13 |
| **Other** | 0 | 82 | 82 |
| **Total** | **51** | **126** | **177** |

---

## ✅ Implemented Features

### Vector Statistics (26/29)

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
- ✅ `coeffvar` - Coefficient of variation
- ✅ `deviation` - Deviation from mean (array of deviations)
- ✅ `meandev` - Mean deviation (mean absolute deviation from mean)
- ✅ `meddev` - Median deviation (mean absolute deviation from median)
- ✅ `pooledvariance` - Pooled variance for two groups
- ✅ `pooledstdev` - Pooled standard deviation for two groups
- ✅ `stanMoment` - Standardized moment (k-th standardized moment)

#### Quantiles & Percentiles
- ✅ `percentile` - Percentile with linear interpolation
- ✅ `percentileOfScore` - Find percentile rank of a value
- ✅ `quartiles` - First, second (median), third quartiles
- ✅ `iqr` - Interquartile range
- ✅ `quantiles` - Multiple quantiles at once
- ✅ `qscore` - Quantile score (alias for percentileOfScore)
- ✅ `qtest` - Quantile test (check if value falls within quantile range)

#### Correlation
- ✅ `covariance` - Covariance between two arrays
- ✅ `corrcoeff` - Pearson correlation coefficient
- ✅ `spearmancoeff` - Spearman rank correlation coefficient

#### Transformations
- ✅ `cumsum` - Cumulative sum
- ✅ `cumprod` - Cumulative product
- ✅ `diff` - Differences between consecutive elements
- ✅ `rank` - Rank values (with tie handling)
- ✅ `histogram` - Histogram with auto or custom bins
- ✅ `cumreduce` - Cumulative reduction with custom reducer function

#### Statistical Tests
- ✅ `anovaFScore` / `anovaTest` - One-way ANOVA
- ✅ `chiSquareTest` - Chi-square test
- ✅ `ttest` - T-test
- ✅ `ztest` - Z-test
- ✅ `regress` - Linear regression
- ✅ `normalci` - Normal confidence interval
- ✅ `tci` - T-distribution confidence interval

### Distributions (18/21)

- ✅ `normal` - Normal/Gaussian distribution (pdf, cdf, inv)
- ✅ `gamma` - Gamma distribution (pdf, cdf, inv)
- ✅ `beta` - Beta distribution (pdf, cdf, inv)
- ✅ `fisherF` - Fisher's F-distribution (pdf, cdf, inv)
- ✅ `studentT` - Student's t-distribution (pdf, cdf, inv)
- ✅ `chiSquared` - Chi-square distribution (pdf, cdf, inv)
- ✅ `exponential` - Exponential distribution (pdf, cdf, inv)
- ✅ `poisson` - Poisson distribution (pdf, cdf, inv)
- ✅ `binomial` - Binomial distribution (pdf, cdf, inv)
- ✅ `uniform` - Uniform distribution (pdf, cdf, inv)
- ✅ `cauchy` - Cauchy distribution (pdf, cdf, inv)
- ✅ `laplace` - Laplace distribution (pdf, cdf, inv)
- ✅ `logNormal` - Log-normal distribution (pdf, cdf, inv)
- ✅ `weibull` - Weibull distribution (pdf, cdf, inv)
- ✅ `pareto` - Pareto distribution (pdf, cdf, inv)
- ✅ `triangular` - Triangular distribution (pdf, cdf, inv)
- ✅ `inverseGamma` - Inverse gamma distribution (pdf, cdf, inv)
- ✅ `negativeBinomial` - Negative binomial distribution (pdf, cdf, inv)

---

## ❌ Missing Features

### Vector Statistics (0 missing)

All core vector statistics functions are now implemented!

### Distributions (3 missing)

- ❌ `kumaraswamy` - Kumaraswamy distribution
- ❌ `arcsine` - Arcsine distribution
- ❌ `noncentralt` - Non-central t-distribution
- ❌ `centralF` - Central F-distribution (we have Fisher F, but not central F)

### Statistical Tests (3 missing)

- ❌ `ftest` - F-test
- ❌ `tukey` - Tukey test
- ❌ `tukeyhsd` - Tukey HSD (Honestly Significant Difference)

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

### Medium Priority (Remaining Distributions)

1. **Kumaraswamy Distribution** - Useful for bounded random variables
2. **Arcsine Distribution** - Specialized distribution
3. **Non-central t-distribution** - Advanced statistical distribution

### Low Priority (Remaining Features)

1. **F-test** - Additional statistical test
4. **Tukey Tests** (`tukey`, `tukeyhsd`) - Post-hoc analysis
5. **Matrix Operations** - If linear algebra is needed
6. **Linear Algebra** - For advanced statistical computing
7. **Interpolation** - For data smoothing/interpolation
8. **Combinatorics** - For probability calculations

### Low Priority (Advanced Features)

1. **Matrix Operations** - If linear algebra is needed
2. **Linear Algebra** - For advanced statistical computing
3. **Interpolation** - For data smoothing/interpolation
4. **Combinatorics** - For probability calculations

---

## Notes

- **Focus**: `@stats/core` focuses on **high-performance vector statistics** with SIMD optimizations
- **Distributions**: Currently supports 18 distributions with full pdf/cdf/inv support
- **Matrix Operations**: Not currently implemented (jStat has extensive matrix support)
- **Performance**: Implemented functions are significantly faster than jStat (see [Performance Guide](/guide/performance))

---

*Last updated: Based on jStat API comparison*

