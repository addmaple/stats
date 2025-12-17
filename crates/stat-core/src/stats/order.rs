// =============================================================================
// Median, Mode, Rank
// =============================================================================

/// Calculate the median of a slice.
/// Returns NaN for empty slices or if any element is NaN.
pub fn median(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    if data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mut values = data.to_vec();
    let len = values.len();
    let mid = len / 2;

    let (lower, mid_val, _) = values.select_nth_unstable_by(mid, |a, b| a.partial_cmp(b).unwrap());

    if len % 2 == 1 {
        *mid_val
    } else {
        let max_lower = lower.iter().copied().fold(f64::NEG_INFINITY, f64::max);
        (max_lower + *mid_val) / 2.0
    }
}

/// Calculate the mode of a slice (returns NaN if no value appears more than once).
pub fn mode(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    if data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let mut best_val = sorted[0];
    let mut best_count = 1usize;
    let mut current_val = sorted[0];
    let mut current_count = 1usize;

    for &value in sorted.iter().skip(1) {
        if value == current_val {
            current_count += 1;
        } else {
            if current_count > best_count {
                best_count = current_count;
                best_val = current_val;
            }
            current_val = value;
            current_count = 1;
        }
    }

    if current_count > best_count {
        best_count = current_count;
        best_val = current_val;
    }

    if best_count == 1 {
        return f64::NAN;
    }

    best_val
}

/// Calculate the geometric mean of a slice.
/// Returns NaN for empty slices or if any element is non-positive.
pub fn geomean(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    if data.iter().any(|&v| v <= 0.0 || v.is_nan()) {
        return f64::NAN;
    }
    // More stable than multiplying and taking a root: exp(mean(log(x)))
    let n = data.len() as f64;
    let log_mean = data.iter().map(|&v| v.ln()).sum::<f64>() / n;
    log_mean.exp()
}

// =============================================================================
// Quantiles & Percentiles
// =============================================================================

/// Calculate a percentile using linear interpolation.
///
/// # Arguments
/// * `data` - Input slice (will be sorted internally)
/// * `k` - Percentile value between 0.0 and 1.0 (e.g., 0.5 for median, 0.25 for Q1)
/// * `exclusive` - If true, uses exclusive method (R6); if false, uses inclusive (R7)
///
/// # Returns
/// The interpolated percentile value, or NaN for invalid inputs.
pub fn percentile(data: &[f64], k: f64, exclusive: bool) -> f64 {
    if data.is_empty() || !(0.0..=1.0).contains(&k) {
        return f64::NAN;
    }
    if data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let n = sorted.len() as f64;

    // jStat-compatible formula
    let real_index = if exclusive {
        k * (n + 1.0)
    } else {
        k * (n - 1.0) + 1.0
    };

    let index = real_index.floor() as usize;
    let frac = real_index - index as f64;

    if index == 0 {
        return sorted[0];
    }
    if index >= sorted.len() {
        return sorted[sorted.len() - 1];
    }

    // Linear interpolation
    sorted[index - 1] + frac * (sorted[index] - sorted[index - 1])
}

/// Calculate a percentile using the default (inclusive/R7) method.
/// This matches jStat's default behavior.
#[inline]
pub fn percentile_inclusive(data: &[f64], k: f64) -> f64 {
    percentile(data, k, false)
}

/// Calculate a percentile using the exclusive (R6) method.
#[inline]
pub fn percentile_exclusive(data: &[f64], k: f64) -> f64 {
    percentile(data, k, true)
}

/// Calculate multiple quantiles at once (more efficient than calling percentile multiple times).
///
/// # Arguments
/// * `data` - Input slice
/// * `quantiles` - Slice of quantile values between 0.0 and 1.0
///
/// # Returns
/// Vector of interpolated quantile values.
pub fn quantiles(data: &[f64], qs: &[f64]) -> Vec<f64> {
    if data.is_empty() {
        return vec![f64::NAN; qs.len()];
    }
    if data.iter().any(|v| v.is_nan()) {
        return vec![f64::NAN; qs.len()];
    }

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    if sorted.len() == 1 {
        return vec![sorted[0]; qs.len()];
    }

    // jStat-compatible quantiles (Hyndman & Fan type 9):
    //   h = p * (n + 1/4) + 3/8
    // with linear interpolation between surrounding order statistics.
    //
    // Note: jStat's `quantiles()` is *not* the same method as our `percentile_inclusive()`.
    let n = sorted.len() as f64;

    qs.iter()
        .map(|&p| {
            if !(0.0..=1.0).contains(&p) {
                return f64::NAN;
            }

            let h = p.mul_add(n + 0.25, 0.375); // p*(n + 1/4) + 3/8
            if h <= 1.0 {
                return sorted[0];
            }
            if h >= n {
                return sorted[sorted.len() - 1];
            }

            let j = h.floor();
            let g = h - j;

            // 1-indexed order statistics -> 0-indexed vector.
            // Here, h is strictly between 1 and n, so j is in [1, n-1].
            let j_usize = j as usize;
            let lower = sorted[j_usize - 1];
            let upper = sorted[j_usize];
            lower + g * (upper - lower)
        })
        .collect()
}

/// Calculate the quartiles (Q1, Q2/median, Q3) of a slice.
/// Uses the same method as jStat.quartiles.
pub fn quartiles(data: &[f64]) -> [f64; 3] {
    if data.is_empty() {
        return [f64::NAN, f64::NAN, f64::NAN];
    }
    if data.iter().any(|v| v.is_nan()) {
        return [f64::NAN, f64::NAN, f64::NAN];
    }

    let mut sorted = data.to_vec();
    sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let n = sorted.len();

    // jStat uses round-based indexing for quartiles
    let q1_idx = ((n as f64) / 4.0).round() as usize;
    let q2_idx = ((n as f64) / 2.0).round() as usize;
    let q3_idx = ((n as f64) * 3.0 / 4.0).round() as usize;

    [
        sorted[q1_idx.saturating_sub(1).min(n - 1)],
        sorted[q2_idx.saturating_sub(1).min(n - 1)],
        sorted[q3_idx.saturating_sub(1).min(n - 1)],
    ]
}

/// Calculate the interquartile range (IQR = Q3 - Q1).
pub fn iqr(data: &[f64]) -> f64 {
    let q = quartiles(data);
    if q[0].is_nan() || q[2].is_nan() {
        f64::NAN
    } else {
        q[2] - q[0]
    }
}

/// Calculate the percentile rank of a score (inverse of percentile).
/// Returns the proportion of values <= score (or < score if strict=true).
///
/// # Arguments
/// * `data` - Input slice
/// * `score` - Value to find percentile rank for
/// * `strict` - If true, use strict comparison (< instead of <=)
pub fn percentile_of_score(data: &[f64], score: f64, strict: bool) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    if score.is_nan() {
        return f64::NAN;
    }

    // Simple iterator-based counting - compiler can optimize this well
    let count = if strict {
        data.iter().filter(|&&v| v < score).count()
    } else {
        data.iter().filter(|&&v| v <= score).count()
    };

    count as f64 / data.len() as f64
}

/// Calculate quantile score (same as percentile_of_score, but returns quantile between 0 and 1).
/// This is an alias for percentile_of_score for consistency with naming conventions.
pub fn qscore(data: &[f64], score: f64, strict: bool) -> f64 {
    percentile_of_score(data, score, strict)
}

// =============================================================================
// Weighted Quantiles
// =============================================================================

/// Calculate a weighted percentile using linear interpolation.
///
/// Uses the cumulative weight method: sorts data by value, computes cumulative
/// weights, normalizes to [0, 1], and interpolates to find the value at the
/// desired quantile position.
///
/// # Arguments
/// * `data` - Input values
/// * `weights` - Corresponding weights (must be same length as data, all non-negative)
/// * `p` - Percentile value between 0.0 and 1.0 (e.g., 0.5 for median)
///
/// # Returns
/// The interpolated weighted percentile value, or NaN for invalid inputs.
///
/// # Example
/// ```rust
/// use stat_core::weighted_percentile;
/// let data = [1.0, 2.0, 3.0, 4.0, 5.0];
/// let weights = [1.0, 1.0, 1.0, 1.0, 1.0];  // Equal weights = regular percentile
/// let median = weighted_percentile(&data, &weights, 0.5);
/// ```
pub fn weighted_percentile(data: &[f64], weights: &[f64], p: f64) -> f64 {
    if data.is_empty() || weights.is_empty() || data.len() != weights.len() {
        return f64::NAN;
    }
    if !(0.0..=1.0).contains(&p) {
        return f64::NAN;
    }
    if data.iter().any(|v| v.is_nan()) || weights.iter().any(|w| w.is_nan() || *w < 0.0) {
        return f64::NAN;
    }

    let total_weight: f64 = weights.iter().sum();
    if total_weight <= 0.0 {
        return f64::NAN;
    }

    // Create sorted (value, weight) pairs
    let mut pairs: Vec<(f64, f64)> = data.iter().copied().zip(weights.iter().copied()).collect();
    pairs.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

    // Build cumulative weight array (normalized to [0, 1])
    // We use the center of each weight interval for interpolation
    let n = pairs.len();
    let mut cum_weights = Vec::with_capacity(n);
    let mut running = 0.0;

    for (_, w) in &pairs {
        // Place the quantile position at the center of this observation's weight
        cum_weights.push((running + w / 2.0) / total_weight);
        running += w;
    }

    // Handle edge cases
    if p <= cum_weights[0] {
        return pairs[0].0;
    }
    if p >= cum_weights[n - 1] {
        return pairs[n - 1].0;
    }

    // Find the interval and interpolate
    for i in 0..n - 1 {
        if p >= cum_weights[i] && p <= cum_weights[i + 1] {
            let frac = (p - cum_weights[i]) / (cum_weights[i + 1] - cum_weights[i]);
            return pairs[i].0 + frac * (pairs[i + 1].0 - pairs[i].0);
        }
    }

    // Fallback (shouldn't reach here)
    pairs[n - 1].0
}

/// Calculate multiple weighted quantiles at once (more efficient than calling weighted_percentile multiple times).
///
/// # Arguments
/// * `data` - Input values
/// * `weights` - Corresponding weights (must be same length as data, all non-negative)
/// * `qs` - Slice of quantile values between 0.0 and 1.0
///
/// # Returns
/// Vector of interpolated weighted quantile values.
pub fn weighted_quantiles(data: &[f64], weights: &[f64], qs: &[f64]) -> Vec<f64> {
    if data.is_empty() || weights.is_empty() || data.len() != weights.len() {
        return vec![f64::NAN; qs.len()];
    }
    if data.iter().any(|v| v.is_nan()) || weights.iter().any(|w| w.is_nan() || *w < 0.0) {
        return vec![f64::NAN; qs.len()];
    }

    let total_weight: f64 = weights.iter().sum();
    if total_weight <= 0.0 {
        return vec![f64::NAN; qs.len()];
    }

    // Create sorted (value, weight) pairs
    let mut pairs: Vec<(f64, f64)> = data.iter().copied().zip(weights.iter().copied()).collect();
    pairs.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

    let n = pairs.len();
    
    // Build cumulative weight array
    let mut cum_weights = Vec::with_capacity(n);
    let mut running = 0.0;

    for (_, w) in &pairs {
        cum_weights.push((running + w / 2.0) / total_weight);
        running += w;
    }

    // Calculate each quantile
    qs.iter()
        .map(|&p| {
            if !(0.0..=1.0).contains(&p) {
                return f64::NAN;
            }

            if p <= cum_weights[0] {
                return pairs[0].0;
            }
            if p >= cum_weights[n - 1] {
                return pairs[n - 1].0;
            }

            for i in 0..n - 1 {
                if p >= cum_weights[i] && p <= cum_weights[i + 1] {
                    let frac = (p - cum_weights[i]) / (cum_weights[i + 1] - cum_weights[i]);
                    return pairs[i].0 + frac * (pairs[i + 1].0 - pairs[i].0);
                }
            }

            pairs[n - 1].0
        })
        .collect()
}

/// Calculate the weighted median (50th weighted percentile).
///
/// # Arguments
/// * `data` - Input values
/// * `weights` - Corresponding weights (must be same length as data)
///
/// # Returns
/// The weighted median value.
#[inline]
pub fn weighted_median(data: &[f64], weights: &[f64]) -> f64 {
    weighted_percentile(data, weights, 0.5)
}

/// Quantile test: test if a value falls within a given quantile range.
/// Returns true if score falls within [q_lower, q_upper] quantile range.
///
/// # Arguments
/// * `data` - Input slice
/// * `score` - Value to test
/// * `q_lower` - Lower quantile bound (0.0 to 1.0)
/// * `q_upper` - Upper quantile bound (0.0 to 1.0)
pub fn qtest(data: &[f64], score: f64, q_lower: f64, q_upper: f64) -> bool {
    if data.is_empty() || q_lower < 0.0 || q_upper > 1.0 || q_lower > q_upper || score.is_nan() {
        return false;
    }

    let quantile_score = percentile_of_score(data, score, false);
    quantile_score >= q_lower && quantile_score <= q_upper
}

/// Calculate the ranks of elements, averaging ties.
pub fn rank(data: &[f64]) -> Vec<f64> {
    let len = data.len();
    if len == 0 {
        return Vec::new();
    }

    let mut indexed: Vec<(usize, f64)> = data.iter().copied().enumerate().collect();
    indexed.sort_by(|a, b| a.1.total_cmp(&b.1));

    let mut ranks = vec![0.0; len];
    let mut i = 0;

    while i < len {
        let value = indexed[i].1;
        let mut j = i + 1;
        while j < len && indexed[j].1 == value {
            j += 1;
        }
        let avg_rank = ((i + j - 1) as f64) / 2.0 + 1.0;
        for k in i..j {
            ranks[indexed[k].0] = avg_rank;
        }
        i = j;
    }

    ranks
}

