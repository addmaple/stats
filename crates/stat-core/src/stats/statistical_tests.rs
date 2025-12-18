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

// =============================================================================
// Tukey HSD (Honestly Significant Difference) Test
// =============================================================================

/// Result of a single pairwise comparison in Tukey HSD test.
#[derive(Debug, Clone, PartialEq)]
pub struct TukeyPairResult {
    /// Index of first group
    pub group1: usize,
    /// Index of second group
    pub group2: usize,
    /// Difference in means (group1 - group2)
    pub mean_diff: f64,
    /// Studentized range statistic (q)
    pub q_statistic: f64,
    /// P-value for the comparison
    pub p_value: f64,
    /// 95% confidence interval lower bound
    pub ci_lower: f64,
    /// 95% confidence interval upper bound
    pub ci_upper: f64,
}

/// Complete result of a Tukey HSD test.
#[derive(Debug, Clone)]
pub struct TukeyHsdResult {
    /// All pairwise comparisons
    pub comparisons: Vec<TukeyPairResult>,
    /// Number of groups
    pub num_groups: usize,
    /// Degrees of freedom within groups
    pub df_within: usize,
    /// Mean square within (MSW)
    pub msw: f64,
}

/// Tukey HSD (Honestly Significant Difference) post-hoc test.
///
/// Performs pairwise comparisons between all group means after ANOVA.
/// This test controls the family-wise error rate when making multiple comparisons.
///
/// # Arguments
/// * `groups` - Slice of slices, each containing the data for one group
///
/// # Returns
/// A `TukeyHsdResult` containing all pairwise comparisons with q-statistics and p-values.
///
/// # Example
/// ```
/// use stat_core::tukey_hsd;
///
/// let group_a = [5.0, 6.0, 7.0, 8.0, 9.0];
/// let group_b = [10.0, 11.0, 12.0, 13.0, 14.0];
/// let group_c = [15.0, 16.0, 17.0, 18.0, 19.0];
///
/// let result = tukey_hsd(&[&group_a, &group_b, &group_c]);
/// for comparison in &result.comparisons {
///     println!("Groups {} vs {}: mean_diff={:.2}, p={:.4}",
///         comparison.group1, comparison.group2,
///         comparison.mean_diff, comparison.p_value);
/// }
/// ```
pub fn tukey_hsd(groups: &[&[f64]]) -> TukeyHsdResult {
    let k = groups.len();

    if k < 2 {
        return TukeyHsdResult {
            comparisons: vec![],
            num_groups: k,
            df_within: 0,
            msw: f64::NAN,
        };
    }

    // Calculate group statistics
    let mut group_means = Vec::with_capacity(k);
    let mut group_sizes = Vec::with_capacity(k);
    let mut total_n = 0usize;
    let mut ssw = 0.0; // Sum of squares within

    for group in groups {
        let n = group.len();
        if n == 0 {
            return TukeyHsdResult {
                comparisons: vec![],
                num_groups: k,
                df_within: 0,
                msw: f64::NAN,
            };
        }

        total_n += n;
        let group_mean = sum(group) / (n as f64);
        group_means.push(group_mean);
        group_sizes.push(n);

        // Calculate within-group sum of squares
        ssw += sum_squared_deviations(group, group_mean);
    }

    let df_within = total_n - k;
    if df_within == 0 {
        return TukeyHsdResult {
            comparisons: vec![],
            num_groups: k,
            df_within: 0,
            msw: f64::NAN,
        };
    }

    let msw = ssw / (df_within as f64);
    let root_msw = msw.sqrt();

    // Generate all pairwise comparisons
    let mut comparisons = Vec::with_capacity(k * (k - 1) / 2);

    for i in 0..k {
        for j in (i + 1)..k {
            let mean_diff = group_means[i] - group_means[j];
            let n_i = group_sizes[i] as f64;
            let n_j = group_sizes[j] as f64;

            // Standard error for Tukey HSD (uses harmonic mean for unequal n)
            let se = root_msw * (0.5 * (1.0 / n_i + 1.0 / n_j)).sqrt();

            // Studentized range statistic + p-value.
            // Degenerate case: if within-group variance is 0, then se==0.
            // - If mean_diff==0, the groups are identical -> q=0, p=1
            // - Otherwise -> q=+inf, p=0
            let (q, p_value) = if se == 0.0 {
                if mean_diff == 0.0 {
                    (0.0, 1.0)
                } else {
                    (f64::INFINITY, 0.0)
                }
            } else {
                let q = mean_diff.abs() / se;
                let p_value = studentized_range_p_value(q, k, df_within);
                (q, p_value)
            };

            // 95% confidence interval
            // Critical q value for alpha=0.05 (approximated)
            let q_crit = studentized_range_critical(0.05, k, df_within);
            let margin = q_crit * se;
            let ci_lower = mean_diff - margin;
            let ci_upper = mean_diff + margin;

            comparisons.push(TukeyPairResult {
                group1: i,
                group2: j,
                mean_diff,
                q_statistic: q,
                p_value,
                ci_lower,
                ci_upper,
            });
        }
    }

    TukeyHsdResult {
        comparisons,
        num_groups: k,
        df_within,
        msw,
    }
}

/// Tukey HSD with categorical grouping.
///
/// Alternative interface that accepts categorical group labels and corresponding values.
///
/// # Arguments
/// * `labels` - Array of group labels (one per observation)
/// * `values` - Array of numeric values (one per observation)
///
/// # Returns
/// A `TukeyHsdResult` containing all pairwise comparisons.
/// Group indices in results correspond to the order groups were first encountered.
pub fn tukey_hsd_categorical(labels: &[String], values: &[f64]) -> TukeyHsdResult {
    if labels.len() != values.len() || labels.is_empty() {
        return TukeyHsdResult {
            comparisons: vec![],
            num_groups: 0,
            df_within: 0,
            msw: f64::NAN,
        };
    }

    // Group values by category
    let mut grouped_values: HashMap<String, Vec<f64>> = HashMap::new();
    for (label, &value) in labels.iter().zip(values.iter()) {
        grouped_values.entry(label.clone()).or_default().push(value);
    }

    let num_groups = grouped_values.len();
    if num_groups < 2 {
        return TukeyHsdResult {
            comparisons: vec![],
            num_groups,
            df_within: 0,
            msw: f64::NAN,
        };
    }

    // Convert to format expected by tukey_hsd
    let group_vecs: Vec<Vec<f64>> = grouped_values.into_values().collect();
    let group_refs: Vec<&[f64]> = group_vecs.iter().map(|v| v.as_slice()).collect();

    tukey_hsd(&group_refs)
}

/// Approximate p-value from studentized range distribution.
///
/// Uses a combination of methods for accuracy across different parameter ranges:
/// - For large df, uses normal approximation
/// - For smaller df, uses relationship with t-distribution and Sidak correction
fn studentized_range_p_value(q: f64, k: usize, df: usize) -> f64 {
    if q.is_nan() {
        return f64::NAN;
    }
    if q <= 0.0 {
        return 1.0;
    }
    if q.is_infinite() {
        return 0.0;
    }

    let k_f = k as f64;
    let df_f = df as f64;

    // For large degrees of freedom, use asymptotic normal approximation
    // The studentized range approaches a scaled maximum of k standard normals
    if df > 120 {
        // Use the relationship: q ≈ t * sqrt(2) for two groups
        // For k groups, we use a Bonferroni-like adjustment
        let num_comparisons = k_f * (k_f - 1.0) / 2.0;

        // Convert q to equivalent z-score and apply Sidak correction
        let t = q / 2.0_f64.sqrt();
        let single_p = 2.0 * (1.0 - normal_cdf_approx(t));

        // Sidak correction: 1 - (1 - alpha)^m
        let family_p = 1.0 - (1.0 - single_p).powf(num_comparisons);
        return family_p.clamp(0.0, 1.0);
    }

    // For smaller df, use the relationship with Student's t
    // q ≈ sqrt(2) * t, and adjust for multiple comparisons
    let num_comparisons = k_f * (k_f - 1.0) / 2.0;

    // Convert q to t-statistic
    let t = q / 2.0_f64.sqrt();

    // Get single comparison p-value from t-distribution
    let single_p = match crate::distributions::student_t_cdf(t, 0.0, 1.0, df_f) {
        Ok(cdf) => 2.0 * (1.0 - cdf),
        Err(_) => 2.0 * (1.0 - normal_cdf_approx(t)),
    };

    // Apply Sidak correction for family-wise error rate
    let family_p = 1.0 - (1.0 - single_p).powf(num_comparisons);
    family_p.clamp(0.0, 1.0)
}

/// Approximate critical value from studentized range distribution.
///
/// Uses interpolation and approximation for the critical q value.
fn studentized_range_critical(alpha: f64, k: usize, df: usize) -> f64 {
    if alpha <= 0.0 || alpha >= 1.0 {
        return f64::NAN;
    }

    let k_f = k as f64;
    let df_f = df as f64;

    // For large df, use asymptotic approximation
    // Based on Studentized Range Table approximations
    if df > 120 {
        // Asymptotic critical values for alpha=0.05
        // q_crit ≈ sqrt(2) * z_crit * adjustment_factor
        let z_crit =
            crate::distributions::normal_inv(1.0 - alpha / 2.0, 0.0, 1.0).unwrap_or(1.96);

        // Adjustment for number of groups (empirical formula)
        let group_factor = 1.0 + 0.1 * (k_f - 2.0).max(0.0);
        return 2.0_f64.sqrt() * z_crit * group_factor;
    }

    // For finite df, use t-distribution with adjustment
    let t_crit = crate::distributions::student_t_inv(1.0 - alpha / (2.0 * k_f), 0.0, 1.0, df_f)
        .unwrap_or(2.0);

    // Convert t to q with adjustment for multiple comparisons
    let group_factor = 1.0 + 0.05 * (k_f - 2.0).max(0.0);
    2.0_f64.sqrt() * t_crit * group_factor
}

/// Simple normal CDF approximation for internal use.
fn normal_cdf_approx(x: f64) -> f64 {
    // Abramowitz & Stegun approximation
    let a1 = 0.254829592;
    let a2 = -0.284496736;
    let a3 = 1.421413741;
    let a4 = -1.453152027;
    let a5 = 1.061405429;
    let p = 0.3275911;

    let sign = if x < 0.0 { -1.0 } else { 1.0 };
    let x_abs = x.abs() / 2.0_f64.sqrt();
    let t = 1.0 / (1.0 + p * x_abs);
    let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * (-x_abs * x_abs).exp();
    0.5 * (1.0 + sign * y)
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

