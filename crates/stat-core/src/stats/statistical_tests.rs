use crate::stats::basic::{mean, sample_stdev, sum, sum_squared_deviations};
use std::collections::HashMap;

#[inline(always)]
fn test_result_nan(df: Option<f64>) -> TestResult {
    TestResult {
        statistic: f64::NAN,
        p_value: f64::NAN,
        df,
    }
}

#[inline(always)]
fn any_nan(data: &[f64]) -> bool {
    data.iter().any(|v| v.is_nan())
}

// =============================================================================
// ANOVA
// =============================================================================

/// ANOVA result containing F-score and degrees of freedom.
#[derive(Debug, Clone, Copy)]
pub struct AnovaResult {
    pub f_score: f64,
    pub df_between: usize,
    pub df_within: usize,
}

/// Calculate the ANOVA F-score for multiple groups.
/// Uses SIMD for efficient computation of group statistics.
pub fn anova_f_score(groups: &[&[f64]]) -> f64 {
    if groups.len() < 2 {
        return f64::NAN;
    }

    let total_n: usize = groups.iter().map(|g| g.len()).sum();
    if total_n == 0 || groups.iter().any(|g| g.is_empty()) {
        return f64::NAN;
    }

    let k = groups.len();

    // Grand mean
    let grand_sum: f64 = groups.iter().map(|g| sum(g)).sum();
    let grand_mean = grand_sum / (total_n as f64);

    // Between-group sum of squares
    let mut ss_between = 0.0;
    let mut group_means = Vec::with_capacity(k);

    for group in groups {
        let group_mean = sum(group) / (group.len() as f64);
        group_means.push(group_mean);
        let diff = group_mean - grand_mean;
        ss_between += (group.len() as f64) * diff * diff;
    }

    // Within-group sum of squares (using our SIMD helper)
    let mut ss_within = 0.0;
    for (group, &group_mean) in groups.iter().zip(group_means.iter()) {
        ss_within += sum_squared_deviations(group, group_mean);
    }

    let df_between = k - 1;
    let df_within = total_n - k;

    if df_within == 0 {
        return f64::NAN;
    }

    let ms_between = ss_between / (df_between as f64);
    let ms_within = ss_within / (df_within as f64);

    if ms_within == 0.0 {
        return f64::NAN;
    }

    ms_between / ms_within
}

/// Strict version of [`anova_f_score`] that explicitly rejects `NaN` inputs.
pub fn anova_f_score_strict(groups: &[&[f64]]) -> f64 {
    if groups.iter().any(|g| any_nan(g)) {
        return f64::NAN;
    }
    anova_f_score(groups)
}

/// Calculate full ANOVA result including F-score and degrees of freedom.
pub fn anova(groups: &[&[f64]]) -> AnovaResult {
    let f_score = anova_f_score(groups);

    let k = groups.len();
    let total_n: usize = groups.iter().map(|g| g.len()).sum();

    AnovaResult {
        f_score,
        df_between: if k > 0 { k - 1 } else { 0 },
        df_within: total_n.saturating_sub(k),
    }
}

/// Strict version of [`anova`] that explicitly rejects `NaN` inputs.
pub fn anova_strict(groups: &[&[f64]]) -> AnovaResult {
    let f_score = anova_f_score_strict(groups);
    let k = groups.len();
    let total_n: usize = groups.iter().map(|g| g.len()).sum();

    AnovaResult {
        f_score,
        df_between: if k > 0 { k - 1 } else { 0 },
        df_within: total_n.saturating_sub(k),
    }
}

// =============================================================================
// Statistical Tests
// =============================================================================

/// Result of a statistical test
#[derive(Debug, Clone, PartialEq)]
pub struct TestResult {
    pub statistic: f64,
    pub p_value: f64,
    pub df: Option<f64>,
}

/// One-sample t-test: tests if sample mean equals a hypothesized value
///
/// Returns a TestResult with t-statistic, p-value, and degrees of freedom.
/// The p-value is two-tailed.
pub fn ttest(data: &[f64], mu0: f64) -> TestResult {
    if data.len() < 2 {
        return test_result_nan(None);
    }

    let n = data.len() as f64;
    let sample_mean = mean(data);
    let sample_stdev = sample_stdev(data);

    if sample_stdev == 0.0 || sample_stdev.is_nan() {
        return TestResult {
            statistic: f64::NAN,
            p_value: f64::NAN,
            df: Some(n - 1.0),
        };
    }

    let se = sample_stdev / n.sqrt();
    let t_stat = (sample_mean - mu0) / se;
    let df = n - 1.0;

    // Two-tailed p-value using Student's t-distribution
    // We need to use the distributions module for the CDF
    let p_value = match crate::distributions::student_t_cdf(t_stat.abs(), 0.0, 1.0, df) {
        Ok(cdf) => 2.0 * (1.0 - cdf),
        Err(_) => f64::NAN,
    };

    TestResult {
        statistic: t_stat,
        p_value,
        df: Some(df),
    }
}

/// Strict version of [`ttest`] that explicitly rejects `NaN` inputs.
pub fn ttest_strict(data: &[f64], mu0: f64) -> TestResult {
    if data.len() < 2 {
        return test_result_nan(None);
    }
    if any_nan(data) {
        return test_result_nan(Some(data.len() as f64 - 1.0));
    }
    ttest(data, mu0)
}

/// One-sample z-test: tests if sample mean equals a hypothesized value with known population standard deviation
///
/// Returns a TestResult with z-statistic and p-value.
/// The p-value is two-tailed.
pub fn ztest(data: &[f64], mu0: f64, sigma: f64) -> TestResult {
    if data.is_empty() || sigma <= 0.0 || sigma.is_nan() {
        return test_result_nan(None);
    }

    let n = data.len() as f64;
    let sample_mean = mean(data);

    let se = sigma / n.sqrt();
    let z_stat = (sample_mean - mu0) / se;

    // Two-tailed p-value using standard normal distribution
    let p_value = match crate::distributions::normal_cdf(z_stat.abs(), 0.0, 1.0) {
        Ok(cdf) => 2.0 * (1.0 - cdf),
        Err(_) => f64::NAN,
    };

    TestResult {
        statistic: z_stat,
        p_value,
        df: None,
    }
}

/// Strict version of [`ztest`] that explicitly rejects `NaN` inputs.
pub fn ztest_strict(data: &[f64], mu0: f64, sigma: f64) -> TestResult {
    if data.is_empty() || sigma <= 0.0 || sigma.is_nan() {
        return test_result_nan(None);
    }
    if any_nan(data) {
        return test_result_nan(None);
    }
    ztest(data, mu0, sigma)
}

// =============================================================================
// Confidence Intervals
// =============================================================================

/// Normal distribution confidence interval
///
/// Returns [lower, upper] bounds for a confidence interval.
/// alpha is the significance level (e.g., 0.05 for 95% confidence).
pub fn normalci(alpha: f64, mean: f64, se: f64) -> [f64; 2] {
    if alpha <= 0.0 || alpha >= 1.0 || se <= 0.0 || se.is_nan() || mean.is_nan() {
        return [f64::NAN, f64::NAN];
    }

    // z-score for (1 - alpha/2) quantile
    let z = match crate::distributions::normal_inv(1.0 - alpha / 2.0, 0.0, 1.0) {
        Ok(z) => z,
        Err(_) => return [f64::NAN, f64::NAN],
    };

    let margin = z * se;
    [mean - margin, mean + margin]
}

/// t-distribution confidence interval
///
/// Returns [lower, upper] bounds for a confidence interval using t-distribution.
/// alpha is the significance level (e.g., 0.05 for 95% confidence).
/// n is the sample size (for degrees of freedom).
pub fn tci(alpha: f64, mean: f64, stdev: f64, n: f64) -> [f64; 2] {
    if alpha <= 0.0 || alpha >= 1.0 || stdev <= 0.0 || stdev.is_nan() || mean.is_nan() || n < 2.0 {
        return [f64::NAN, f64::NAN];
    }

    let df = n - 1.0;
    let se = stdev / n.sqrt();

    // t-score for (1 - alpha/2) quantile
    let t = match crate::distributions::student_t_inv(1.0 - alpha / 2.0, 0.0, 1.0, df) {
        Ok(t) => t,
        Err(_) => return [f64::NAN, f64::NAN],
    };

    let margin = t * se;
    [mean - margin, mean + margin]
}

/// Chi-square test result
#[derive(Debug, Clone, PartialEq)]
pub struct ChiSquareResult {
    pub statistic: f64,
    pub p_value: f64,
    pub df: usize,
}

/// Chi-square test of independence for two categorical variables
///
/// Tests whether two categorical variables are independent.
/// Returns chi-square statistic, p-value, and degrees of freedom.
///
/// If `cardinality1` and `cardinality2` are provided (number of unique categories),
/// uses an optimized array-based algorithm instead of HashMap lookups.
pub fn chi_square_test(cat1: &[String], cat2: &[String]) -> ChiSquareResult {
    chi_square_test_with_cardinality(cat1, cat2, None, None)
}

/// Chi-square test with optional cardinality hints for optimization
///
/// If cardinalities are provided, uses a faster array-based algorithm.
/// Otherwise falls back to the HashMap-based approach.
pub fn chi_square_test_with_cardinality(
    cat1: &[String],
    cat2: &[String],
    cardinality1: Option<usize>,
    cardinality2: Option<usize>,
) -> ChiSquareResult {
    if cat1.len() != cat2.len() || cat1.is_empty() {
        return ChiSquareResult {
            statistic: f64::NAN,
            p_value: f64::NAN,
            df: 0,
        };
    }

    let n = cat1.len() as f64;

    // Use optimized path if both cardinalities are provided
    if let (Some(num_rows), Some(num_cols)) = (cardinality1, cardinality2) {
        if num_rows < 2 || num_cols < 2 {
            return ChiSquareResult {
                statistic: f64::NAN,
                p_value: f64::NAN,
                df: 0,
            };
        }

        // Build category -> index mappings
        let mut row_map: HashMap<String, usize> = HashMap::with_capacity(num_rows);
        let mut col_map: HashMap<String, usize> = HashMap::with_capacity(num_cols);
        let mut row_idx = 0;
        let mut col_idx = 0;

        // Pre-allocate contingency table
        let mut table = vec![vec![0usize; num_cols]; num_rows];
        let mut row_counts = vec![0usize; num_rows];
        let mut col_counts = vec![0usize; num_cols];

        // Build contingency table using array indices
        for (c1, c2) in cat1.iter().zip(cat2.iter()) {
            let r_idx = *row_map.entry(c1.clone()).or_insert_with(|| {
                let idx = row_idx;
                row_idx += 1;
                idx
            });
            let c_idx = *col_map.entry(c2.clone()).or_insert_with(|| {
                let idx = col_idx;
                col_idx += 1;
                idx
            });

            table[r_idx][c_idx] += 1;
            row_counts[r_idx] += 1;
            col_counts[c_idx] += 1;
        }

        // Verify we didn't exceed expected cardinalities
        if row_idx > num_rows || col_idx > num_cols {
            // Fall back to standard algorithm if cardinality was wrong
            return chi_square_test_with_cardinality(cat1, cat2, None, None);
        }

        // Calculate chi-square statistic
        let mut chi_sq = 0.0;
        for r_idx in 0..num_rows {
            for (c_idx, _) in col_counts.iter().enumerate().take(num_cols) {
                let observed = table[r_idx][c_idx] as f64;
                if observed > 0.0 {
                    let row_total = row_counts[r_idx] as f64;
                    let col_total = col_counts[c_idx] as f64;
                    let expected = (row_total * col_total) / n;

                    if expected > 0.0 {
                        let diff = observed - expected;
                        chi_sq += (diff * diff) / expected;
                    }
                }
            }
        }

        let df = (num_rows - 1) * (num_cols - 1);

        // Calculate p-value using chi-squared distribution
        let p_value = match crate::distributions::chi_squared_cdf(chi_sq, df as f64) {
            Ok(cdf) => 1.0 - cdf,
            Err(_) => f64::NAN,
        };

        return ChiSquareResult {
            statistic: chi_sq,
            p_value,
            df,
        };
    }

    // Fallback to HashMap-based algorithm
    let mut table: HashMap<(String, String), usize> = HashMap::new();
    let mut row_counts: HashMap<String, usize> = HashMap::new();
    let mut col_counts: HashMap<String, usize> = HashMap::new();

    for (c1, c2) in cat1.iter().zip(cat2.iter()) {
        *table.entry((c1.clone(), c2.clone())).or_insert(0) += 1;
        *row_counts.entry(c1.clone()).or_insert(0) += 1;
        *col_counts.entry(c2.clone()).or_insert(0) += 1;
    }

    let num_rows = row_counts.len();
    let num_cols = col_counts.len();

    if num_rows < 2 || num_cols < 2 {
        return ChiSquareResult {
            statistic: f64::NAN,
            p_value: f64::NAN,
            df: 0,
        };
    }

    // Calculate chi-square statistic
    let mut chi_sq = 0.0;
    for ((r, c), observed) in table.iter() {
        let row_total = *row_counts.get(r).unwrap_or(&0) as f64;
        let col_total = *col_counts.get(c).unwrap_or(&0) as f64;
        let expected = (row_total * col_total) / n;

        if expected > 0.0 {
            let diff = *observed as f64 - expected;
            chi_sq += (diff * diff) / expected;
        }
    }

    let df = (num_rows - 1) * (num_cols - 1);

    // Calculate p-value using chi-squared distribution
    let p_value = match crate::distributions::chi_squared_cdf(chi_sq, df as f64) {
        Ok(cdf) => 1.0 - cdf,
        Err(_) => f64::NAN,
    };

    ChiSquareResult {
        statistic: chi_sq,
        p_value,
        df,
    }
}

/// ANOVA with categorical grouping
///
/// Performs ANOVA test where numeric values are grouped by categorical labels.
/// This is an alternative interface to `anova_f_score` that accepts:
/// - `groups`: Array of categorical labels (e.g., ["A", "A", "B", "B", "C", "C"])
/// - `values`: Array of numeric values corresponding to each label
///
/// Returns the F-score, or NaN if invalid input.
pub fn anova_f_score_categorical(groups: &[String], values: &[f64]) -> f64 {
    if groups.len() != values.len() || groups.is_empty() {
        return f64::NAN;
    }

    // Group values by category
    let mut grouped_values: HashMap<String, Vec<f64>> = HashMap::new();
    for (group, &value) in groups.iter().zip(values.iter()) {
        grouped_values.entry(group.clone()).or_default().push(value);
    }

    let num_groups = grouped_values.len();
    if num_groups < 2 {
        return f64::NAN;
    }

    // Convert to format expected by anova_f_score
    let group_vecs: Vec<Vec<f64>> = grouped_values.into_values().collect();
    let group_refs: Vec<&[f64]> = group_vecs.iter().map(|v| v.as_slice()).collect();

    anova_f_score(&group_refs)
}

/// ANOVA with categorical grouping - full result
///
/// Performs ANOVA test where numeric values are grouped by categorical labels.
/// Returns full ANOVA result including F-score and degrees of freedom.
pub fn anova_categorical(groups: &[String], values: &[f64]) -> AnovaResult {
    let f_score = anova_f_score_categorical(groups, values);

    if f_score.is_nan() {
        return AnovaResult {
            f_score: f64::NAN,
            df_between: 0,
            df_within: 0,
        };
    }

    // Count groups and total observations
    let mut group_counts: HashMap<String, usize> = HashMap::new();
    for group in groups.iter() {
        *group_counts.entry(group.clone()).or_insert(0) += 1;
    }

    let k = group_counts.len();
    let total_n: usize = group_counts.values().sum();

    AnovaResult {
        f_score,
        df_between: if k > 0 { k - 1 } else { 0 },
        df_within: total_n.saturating_sub(k),
    }
}
