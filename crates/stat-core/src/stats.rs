use statistical::univariate::geometric_mean as statistical_geometric_mean;
use wide::f64x4;
use std::collections::HashMap;

// =============================================================================
// SIMD Infrastructure
// =============================================================================

/// SIMD loop state with 4 accumulators for dependency-chain breaking.
#[derive(Clone, Copy)]
struct SimdAccum4 {
    v1: f64x4,
    v2: f64x4,
    v3: f64x4,
    v4: f64x4,
}

impl SimdAccum4 {
    #[inline(always)]
    fn new(init: f64x4) -> Self {
        Self { v1: init, v2: init, v3: init, v4: init }
    }

    #[inline(always)]
    fn zero() -> Self {
        Self::new(f64x4::ZERO)
    }

    #[inline(always)]
    fn reduce_add(self) -> f64 {
        ((self.v1 + self.v2) + (self.v3 + self.v4)).reduce_add()
    }

    #[inline(always)]
    fn reduce_min(self) -> f64 {
        simd_reduce_min(self.v1.min(self.v2).min(self.v3.min(self.v4)))
    }

    #[inline(always)]
    fn reduce_max(self) -> f64 {
        simd_reduce_max(self.v1.max(self.v2).max(self.v3.max(self.v4)))
    }
}

#[inline(always)]
fn simd_reduce_min(vec: f64x4) -> f64 {
    let arr = vec.to_array();
    arr[0].min(arr[1]).min(arr[2].min(arr[3]))
}

#[inline(always)]
fn simd_reduce_max(vec: f64x4) -> f64 {
    let arr = vec.to_array();
    arr[0].max(arr[1]).max(arr[2].max(arr[3]))
}

/// Zero-overhead SIMD reduction macro.
/// Generates inline code for 4x unrolled SIMD loops.
macro_rules! simd_reduce {
    // Single array reduction: simd_reduce!(data, init, |acc, chunk| body, |acc, val| scalar, reduce_fn)
    ($data:expr, $init:expr, |$acc:ident, $chunk:ident| $body:expr, |$sacc:ident, $val:ident| $scalar:expr, $reduce:expr) => {{
        let data: &[f64] = $data;
        let len = data.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;

        let mut acc = SimdAccum4::new($init);

        unsafe {
            let ptr = data.as_ptr() as *const f64x4;

            for i in 0..unrolled {
                let base = ptr.add(i * 4);
                { let $acc = &mut acc.v1; let $chunk = base.read_unaligned(); $body; }
                { let $acc = &mut acc.v2; let $chunk = base.add(1).read_unaligned(); $body; }
                { let $acc = &mut acc.v3; let $chunk = base.add(2).read_unaligned(); $body; }
                { let $acc = &mut acc.v4; let $chunk = base.add(3).read_unaligned(); $body; }
            }

            for i in (unrolled * 4)..chunks {
                let $acc = &mut acc.v1;
                let $chunk = ptr.add(i).read_unaligned();
                $body;
            }
        }

        #[allow(clippy::redundant_closure_call)]
        let mut result = $reduce(acc);

        for &value in &data[(chunks * 4)..] {
            let $sacc = &mut result;
            let $val = value;
            $scalar;
        }

        result
    }};
}

/// SIMD reduction with a constant (e.g., mean for variance).
macro_rules! simd_reduce_with_const {
    ($data:expr, $init:expr, $const_val:expr, |$acc:ident, $chunk:ident, $cv:ident| $body:expr, |$sacc:ident, $val:ident, $scv:ident| $scalar:expr, $reduce:expr) => {{
        let data: &[f64] = $data;
        let len = data.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;
        let const_vec: f64x4 = $const_val;
        let scalar_const = const_vec.to_array()[0];

        let mut acc = SimdAccum4::new($init);

        unsafe {
            let ptr = data.as_ptr() as *const f64x4;

            for i in 0..unrolled {
                let base = ptr.add(i * 4);
                { let $acc = &mut acc.v1; let $chunk = base.read_unaligned(); let $cv = const_vec; $body; }
                { let $acc = &mut acc.v2; let $chunk = base.add(1).read_unaligned(); let $cv = const_vec; $body; }
                { let $acc = &mut acc.v3; let $chunk = base.add(2).read_unaligned(); let $cv = const_vec; $body; }
                { let $acc = &mut acc.v4; let $chunk = base.add(3).read_unaligned(); let $cv = const_vec; $body; }
            }

            for i in (unrolled * 4)..chunks {
                let $acc = &mut acc.v1;
                let $chunk = ptr.add(i).read_unaligned();
                let $cv = const_vec;
                $body;
            }
        }

        #[allow(clippy::redundant_closure_call)]
        let mut result = $reduce(acc);

        for &value in &data[(chunks * 4)..] {
            let $sacc = &mut result;
            let $val = value;
            let $scv = scalar_const;
            $scalar;
        }

        result
    }};
}

// =============================================================================
// Basic Statistics
// =============================================================================

/// Calculate the sum of a slice of f64 values.
/// Returns 0.0 for empty slices.
pub fn sum(data: &[f64]) -> f64 {
    if data.is_empty() {
        return 0.0;
    }

    simd_reduce!(
        data,
        f64x4::ZERO,
        |acc, chunk| *acc += chunk,
        |acc, val| *acc += val,
        SimdAccum4::reduce_add
    )
}

/// Calculate the mean of a slice of f64 values.
/// Returns NaN for empty slices.
pub fn mean(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    sum(data) / (data.len() as f64)
}

/// Internal: compute sum of squared deviations from mean.
#[inline(always)]
fn sum_squared_deviations(data: &[f64], m: f64) -> f64 {
    simd_reduce_with_const!(
        data,
        f64x4::ZERO,
        f64x4::splat(m),
        |acc, chunk, mean_vec| {
            let diff = chunk - mean_vec;
            *acc += diff * diff;
        },
        |acc, val, mean_val| {
            let diff = val - mean_val;
            *acc += diff * diff;
        },
        SimdAccum4::reduce_add
    )
}

/// Calculate the variance of a slice of f64 values (population variance).
/// Returns NaN for empty slices.
pub fn variance(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    let m = mean(data);
    sum_squared_deviations(data, m) / (data.len() as f64)
}

/// Calculate the variance with a pre-computed mean.
pub fn variance_with_mean(data: &[f64], mean_val: Option<f64>) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    let m = mean_val.unwrap_or_else(|| mean(data));
    sum_squared_deviations(data, m) / (data.len() as f64)
}

/// Calculate the sample variance (Bessel's correction, divides by n-1).
/// Returns NaN for slices with fewer than 2 elements.
pub fn sample_variance(data: &[f64]) -> f64 {
    if data.len() < 2 {
        return f64::NAN;
    }
    let m = mean(data);
    sum_squared_deviations(data, m) / (data.len() as f64 - 1.0)
}

/// Calculate the standard deviation (population).
pub fn stdev(data: &[f64]) -> f64 {
    variance(data).sqrt()
}

/// Calculate the sample standard deviation.
pub fn sample_stdev(data: &[f64]) -> f64 {
    sample_variance(data).sqrt()
}

/// Calculate the coefficient of variation (stdev / mean).
/// Returns NaN for empty slices or if mean is zero.
pub fn coeffvar(data: &[f64]) -> f64 {
    let m = mean(data);
    if m == 0.0 || m.is_nan() {
        return f64::NAN;
    }
    stdev(data) / m
}

/// Calculate deviations from mean (x - mean) for each element.
/// Returns a vector of deviations.
pub fn deviation(data: &[f64]) -> Vec<f64> {
    if data.is_empty() {
        return Vec::new();
    }
    let m = mean(data);
    data.iter().map(|&x| x - m).collect()
}

/// Calculate mean deviation (mean absolute deviation from mean).
/// Returns NaN for empty slices.
pub fn meandev(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    let m = mean(data);
    let abs_deviations: f64 = data.iter().map(|&x| (x - m).abs()).sum();
    abs_deviations / (data.len() as f64)
}

/// Calculate median deviation (mean absolute deviation from median).
/// Returns NaN for empty slices.
pub fn meddev(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }
    let med = median(data);
    if med.is_nan() {
        return f64::NAN;
    }
    let abs_deviations: f64 = data.iter().map(|&x| (x - med).abs()).sum();
    abs_deviations / (data.len() as f64)
}

/// Calculate pooled variance for two groups.
/// Uses the formula: ((n1-1)*var1 + (n2-1)*var2) / (n1+n2-2)
/// Returns NaN if either group has fewer than 2 elements.
pub fn pooledvariance(data1: &[f64], data2: &[f64]) -> f64 {
    if data1.len() < 2 || data2.len() < 2 {
        return f64::NAN;
    }
    let var1 = sample_variance(data1);
    let var2 = sample_variance(data2);
    if var1.is_nan() || var2.is_nan() {
        return f64::NAN;
    }
    let n1 = data1.len() as f64;
    let n2 = data2.len() as f64;
    let pooled = ((n1 - 1.0) * var1 + (n2 - 1.0) * var2) / (n1 + n2 - 2.0);
    pooled
}

/// Calculate pooled standard deviation for two groups.
/// This is the square root of pooled variance.
pub fn pooledstdev(data1: &[f64], data2: &[f64]) -> f64 {
    pooledvariance(data1, data2).sqrt()
}

/// Calculate the k-th standardized moment.
/// Standardized moment = E[(X - μ)^k] / σ^k
/// For k=1: always 0, k=2: always 1, k=3: skewness, k=4: kurtosis
/// Returns NaN if data is empty or if stdev is zero.
pub fn stan_moment(data: &[f64], k: usize) -> f64 {
    if data.is_empty() || k == 0 {
        return f64::NAN;
    }
    let m = mean(data);
    let sd = stdev(data);
    if sd == 0.0 || sd.is_nan() || m.is_nan() {
        return f64::NAN;
    }
    
    // For k=1, standardized moment is always 0
    if k == 1 {
        return 0.0;
    }
    
    // For k=2, standardized moment is always 1
    if k == 2 {
        return 1.0;
    }
    
    // Calculate k-th central moment
    let central_moment = data.iter()
        .map(|&x| (x - m).powi(k as i32))
        .sum::<f64>() / (data.len() as f64);
    
    // Standardize by dividing by σ^k
    central_moment / sd.powi(k as i32)
}

// =============================================================================
// Min / Max / Range
// =============================================================================

/// Calculate the minimum value in a slice.
/// Returns NaN for empty slices.
pub fn min(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }

    simd_reduce!(
        data,
        f64x4::splat(f64::INFINITY),
        |acc, chunk| *acc = acc.min(chunk),
        |acc, val| if val < *acc { *acc = val },
        SimdAccum4::reduce_min
    )
}

/// Calculate the maximum value in a slice.
/// Returns NaN for empty slices.
pub fn max(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }

    simd_reduce!(
        data,
        f64x4::splat(f64::NEG_INFINITY),
        |acc, chunk| *acc = acc.max(chunk),
        |acc, val| if val > *acc { *acc = val },
        SimdAccum4::reduce_max
    )
}

/// Calculate min and max in a single pass.
fn minmax(data: &[f64]) -> (f64, f64) {
    if data.is_empty() {
        return (f64::NAN, f64::NAN);
    }

    let len = data.len();
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut min_acc = SimdAccum4::new(f64x4::splat(f64::INFINITY));
    let mut max_acc = SimdAccum4::new(f64x4::splat(f64::NEG_INFINITY));

    unsafe {
        let ptr = data.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let base = ptr.add(i * 4);
            let c1 = base.read_unaligned();
            let c2 = base.add(1).read_unaligned();
            let c3 = base.add(2).read_unaligned();
            let c4 = base.add(3).read_unaligned();

            min_acc.v1 = min_acc.v1.min(c1);
            min_acc.v2 = min_acc.v2.min(c2);
            min_acc.v3 = min_acc.v3.min(c3);
            min_acc.v4 = min_acc.v4.min(c4);

            max_acc.v1 = max_acc.v1.max(c1);
            max_acc.v2 = max_acc.v2.max(c2);
            max_acc.v3 = max_acc.v3.max(c3);
            max_acc.v4 = max_acc.v4.max(c4);
        }

        for i in (unrolled * 4)..chunks {
            let c = ptr.add(i).read_unaligned();
            min_acc.v1 = min_acc.v1.min(c);
            max_acc.v1 = max_acc.v1.max(c);
        }
    }

    let mut min_val = min_acc.reduce_min();
    let mut max_val = max_acc.reduce_max();

    for &value in &data[(chunks * 4)..] {
        if value < min_val { min_val = value; }
        if value > max_val { max_val = value; }
    }

    (min_val, max_val)
}

/// Calculate the product of all values in a slice.
/// Returns NaN for empty slices.
pub fn product(data: &[f64]) -> f64 {
    if data.is_empty() {
        return f64::NAN;
    }

    simd_reduce!(
        data,
        f64x4::splat(1.0),
        |acc, chunk| *acc *= chunk,
        |acc, val| *acc *= val,
        |acc: SimdAccum4| {
            let combined = acc.v1 * acc.v2 * acc.v3 * acc.v4;
            let arr = combined.to_array();
            arr[0] * arr[1] * arr[2] * arr[3]
        }
    )
}

/// Calculate the range (max - min) of a slice.
/// Returns NaN for empty slices.
pub fn range(data: &[f64]) -> f64 {
    let (min_val, max_val) = minmax(data);
    if min_val.is_nan() || max_val.is_nan() {
        f64::NAN
    } else {
        max_val - min_val
    }
}

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

    let (lower, mid_val, _) =
        values.select_nth_unstable_by(mid, |a, b| a.partial_cmp(b).unwrap());

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
    statistical_geometric_mean(data)
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
    if data.is_empty() || k < 0.0 || k > 1.0 {
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

    const ALPHAP: f64 = 3.0 / 8.0;
    const BETAP: f64 = 3.0 / 8.0;
    let n = sorted.len() as f64;

    qs.iter()
        .map(|&p| {
            if !(0.0..=1.0).contains(&p) {
                return f64::NAN;
            }

            let m = ALPHAP + p * (1.0 - ALPHAP - BETAP);
            let aleph = n * p + m;

            // jStat: k = floor(clip(aleph, 1, n-1))
            let k = aleph.clamp(1.0, n - 1.0).floor() as usize;
            // jStat: gamma = clip(aleph - k, 0, 1)
            let gamma = (aleph - k as f64).clamp(0.0, 1.0);

            // jStat uses 0-based indexing: sorted[k-1] and sorted[k]
            let lower = sorted[k - 1];
            let upper = sorted[k];

            (1.0 - gamma) * lower + gamma * upper
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

// =============================================================================
// Histogram
// =============================================================================

/// Calculate a histogram with automatic bin width.
/// Optimized single-pass min/max finding + binning.
/// 
/// # Arguments
/// * `data` - Input slice
/// * `bin_count` - Number of bins (defaults to 4 if 0)
/// 
/// # Returns
/// Vector of counts per bin.
pub fn histogram(data: &[f64], bin_count: usize) -> Vec<usize> {
    let bin_count = if bin_count == 0 { 4 } else { bin_count };
    
    if data.is_empty() {
        return vec![0; bin_count];
    }
    
    // First pass: find min/max using SIMD-optimized minmax
    let (min_val, max_val) = minmax(data);
    
    if min_val.is_nan() || max_val.is_nan() {
        return vec![0; bin_count];
    }
    
    // Handle edge case where all values are the same
    let range = max_val - min_val;
    let mut bins = vec![0usize; bin_count];
    if range < f64::EPSILON {
        bins[0] = data.len();
        return bins;
    }
    
    // Precompute inverse bin width for faster multiplication instead of division
    let inv_bin_width = bin_count as f64 / range;
    let last_bin = bin_count - 1;
    
    // Second pass: bin the values
    // Note: We already checked for NaN in minmax, so we can skip NaN checks here
    // This loop can't be easily SIMD'd due to random writes to bins array
    unsafe {
        let bins_ptr = bins.as_mut_ptr();
        for &value in data {
            // Calculate bin index: multiply by inverse instead of dividing
            // Since (value - min_val) >= 0, casting truncates (same as floor for non-negative)
            let bin_idx = ((value - min_val) * inv_bin_width) as usize;
            // Clamp to last bin (handles max_val edge case) - use min for branch prediction
            let bin_idx = bin_idx.min(last_bin);
            // Unsafe indexing since we know bin_idx is bounded [0, last_bin]
            *bins_ptr.add(bin_idx) += 1;
        }
    }
    
    bins
}

/// Calculate a histogram with custom bin edges.
/// 
/// # Arguments
/// * `data` - Input slice
/// * `edges` - Bin edges (must be sorted, length = num_bins + 1)
/// 
/// # Returns
/// Vector of counts per bin. Values outside the range are not counted.
pub fn histogram_edges(data: &[f64], edges: &[f64]) -> Vec<usize> {
    if edges.len() < 2 {
        return vec![];
    }
    
    let num_bins = edges.len() - 1;
    let mut bins = vec![0usize; num_bins];
    
    for &value in data {
        if value.is_nan() {
            continue;
        }
        // Find the bin using binary search
        // Value goes in bin i if edges[i] <= value < edges[i+1]
        // (with the last bin being edges[n-1] <= value <= edges[n])
        match edges.binary_search_by(|e| e.partial_cmp(&value).unwrap()) {
            Ok(idx) => {
                // Exact match on an edge
                if idx == 0 {
                    bins[0] += 1;
                } else if idx < edges.len() - 1 {
                    bins[idx] += 1;
                } else {
                    // Value equals the last edge, put in last bin
                    bins[num_bins - 1] += 1;
                }
            }
            Err(idx) => {
                // idx is where value would be inserted
                if idx > 0 && idx <= num_bins {
                    bins[idx - 1] += 1;
                }
                // Values outside range are not counted
            }
        }
    }
    
    bins
}

// =============================================================================
// Higher Moments: Skewness & Kurtosis
// =============================================================================

/// Calculate the skewness of a slice (requires at least 3 elements).
/// Uses population formula: m3 / m2^(3/2).
pub fn skewness(data: &[f64]) -> f64 {
    if data.len() < 3 || data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mean_val = mean(data);
    let mean_vec = f64x4::splat(mean_val);
    let len = data.len();
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut m2_acc = SimdAccum4::zero();
    let mut m3_acc = SimdAccum4::zero();

    unsafe {
        let ptr = data.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let base = ptr.add(i * 4);
            for j in 0..4 {
                let chunk = base.add(j).read_unaligned();
                let diff = chunk - mean_vec;
                let diff_sq = diff * diff;
                match j {
                    0 => { m2_acc.v1 += diff_sq; m3_acc.v1 += diff_sq * diff; }
                    1 => { m2_acc.v2 += diff_sq; m3_acc.v2 += diff_sq * diff; }
                    2 => { m2_acc.v3 += diff_sq; m3_acc.v3 += diff_sq * diff; }
                    _ => { m2_acc.v4 += diff_sq; m3_acc.v4 += diff_sq * diff; }
                }
            }
        }

        for i in (unrolled * 4)..chunks {
            let chunk = ptr.add(i).read_unaligned();
            let diff = chunk - mean_vec;
            let diff_sq = diff * diff;
            m2_acc.v1 += diff_sq;
            m3_acc.v1 += diff_sq * diff;
        }
    }

    let mut m2 = m2_acc.reduce_add();
    let mut m3 = m3_acc.reduce_add();

    for &value in &data[(chunks * 4)..] {
        let diff = value - mean_val;
        let diff_sq = diff * diff;
        m2 += diff_sq;
        m3 += diff_sq * diff;
    }

    let n = len as f64;
    m2 /= n;
    m3 /= n;

    if m2 == 0.0 {
        return f64::NAN;
    }

    m3 / m2.sqrt().powi(3)
}

/// Calculate the kurtosis of a slice (requires at least 4 elements).
/// Uses population formula (raw kurtosis, not excess): m4 / m2^2.
pub fn kurtosis(data: &[f64]) -> f64 {
    if data.len() < 4 || data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mean_val = mean(data);
    let mean_vec = f64x4::splat(mean_val);
    let len = data.len();
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut m2_acc = SimdAccum4::zero();
    let mut m4_acc = SimdAccum4::zero();

    unsafe {
        let ptr = data.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let base = ptr.add(i * 4);
            for j in 0..4 {
                let chunk = base.add(j).read_unaligned();
                let diff = chunk - mean_vec;
                let diff_sq = diff * diff;
                match j {
                    0 => { m2_acc.v1 += diff_sq; m4_acc.v1 += diff_sq * diff_sq; }
                    1 => { m2_acc.v2 += diff_sq; m4_acc.v2 += diff_sq * diff_sq; }
                    2 => { m2_acc.v3 += diff_sq; m4_acc.v3 += diff_sq * diff_sq; }
                    _ => { m2_acc.v4 += diff_sq; m4_acc.v4 += diff_sq * diff_sq; }
                }
            }
        }

        for i in (unrolled * 4)..chunks {
            let chunk = ptr.add(i).read_unaligned();
            let diff = chunk - mean_vec;
            let diff_sq = diff * diff;
            m2_acc.v1 += diff_sq;
            m4_acc.v1 += diff_sq * diff_sq;
        }
    }

    let mut m2 = m2_acc.reduce_add();
    let mut m4 = m4_acc.reduce_add();

    for &value in &data[(chunks * 4)..] {
        let diff = value - mean_val;
        let diff_sq = diff * diff;
        m2 += diff_sq;
        m4 += diff_sq * diff_sq;
    }

    let n = len as f64;
    m2 /= n;
    m4 /= n;

    if m2 == 0.0 {
        return f64::NAN;
    }

    m4 / (m2 * m2)
}

// =============================================================================
// Cumulative & Transformations
// =============================================================================

/// Calculate the cumulative sum of a slice.
pub fn cumsum(data: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    let mut running_total = 0.0;

    for &value in data {
        running_total += value;
        result.push(running_total);
    }

    result
}

/// Calculate the cumulative product of a slice.
pub fn cumprod(data: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    let mut running_product = 1.0;

    for &value in data {
        running_product *= value;
        result.push(running_product);
    }

    result
}

/// Calculate the difference between consecutive elements.
pub fn diff(data: &[f64]) -> Vec<f64> {
    if data.len() < 2 {
        return Vec::new();
    }

    data.windows(2).map(|w| w[1] - w[0]).collect()
}

/// Cumulative reduction: apply a reduction function cumulatively.
/// Similar to cumsum/cumprod but with a custom reducer function.
/// 
/// Note: This function cannot be directly exposed to WASM due to closure limitations.
/// For WASM, use specific cumulative functions like cumsum, cumprod, etc.
/// 
/// # Arguments
/// * `data` - Input slice
/// * `init` - Initial value for the accumulator
/// * `reducer` - Function that takes (accumulator, value) and returns new accumulator
/// 
/// # Example
/// ```rust
/// let data = [1.0, 2.0, 3.0];
/// let result = cumreduce(&data, 0.0, |acc, x| acc + x * x);
/// // result = [1.0, 5.0, 14.0] (cumulative sum of squares)
/// ```
pub fn cumreduce<F>(data: &[f64], init: f64, reducer: F) -> Vec<f64>
where
    F: Fn(f64, f64) -> f64,
{
    let mut result = Vec::with_capacity(data.len());
    let mut acc = init;

    for &value in data {
        acc = reducer(acc, value);
        result.push(acc);
    }

    result
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

// =============================================================================
// Correlation & Covariance
// =============================================================================

/// Calculate the population covariance between two slices.
pub fn covariance(x: &[f64], y: &[f64]) -> f64 {
    if x.len() != y.len() || x.is_empty() {
        return f64::NAN;
    }

    let mean_x = mean(x);
    let mean_y = mean(y);
    let mean_x_vec = f64x4::splat(mean_x);
    let mean_y_vec = f64x4::splat(mean_y);

    let len = x.len();
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut acc = SimdAccum4::zero();

    unsafe {
        let x_ptr = x.as_ptr() as *const f64x4;
        let y_ptr = y.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let bx = x_ptr.add(i * 4);
            let by = y_ptr.add(i * 4);

            acc.v1 += (bx.read_unaligned() - mean_x_vec) * (by.read_unaligned() - mean_y_vec);
            acc.v2 += (bx.add(1).read_unaligned() - mean_x_vec) * (by.add(1).read_unaligned() - mean_y_vec);
            acc.v3 += (bx.add(2).read_unaligned() - mean_x_vec) * (by.add(2).read_unaligned() - mean_y_vec);
            acc.v4 += (bx.add(3).read_unaligned() - mean_x_vec) * (by.add(3).read_unaligned() - mean_y_vec);
        }

        for i in (unrolled * 4)..chunks {
            acc.v1 += (x_ptr.add(i).read_unaligned() - mean_x_vec) * (y_ptr.add(i).read_unaligned() - mean_y_vec);
        }
    }

    let mut sum = acc.reduce_add();

    for i in (chunks * 4)..len {
        sum += (x[i] - mean_x) * (y[i] - mean_y);
    }

    sum / (len as f64)
}

/// Calculate the Pearson correlation coefficient between two slices.
/// Uses single-pass algorithm for efficiency.
pub fn corrcoeff(x: &[f64], y: &[f64]) -> f64 {
    if x.len() != y.len() || x.is_empty() {
        return f64::NAN;
    }

    let len = x.len();
    let n = len as f64;
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut sx = SimdAccum4::zero();
    let mut sy = SimdAccum4::zero();
    let mut sxx = SimdAccum4::zero();
    let mut syy = SimdAccum4::zero();
    let mut sxy = SimdAccum4::zero();

    unsafe {
        let x_ptr = x.as_ptr() as *const f64x4;
        let y_ptr = y.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let bx = x_ptr.add(i * 4);
            let by = y_ptr.add(i * 4);

            let x1 = bx.read_unaligned(); let y1 = by.read_unaligned();
            let x2 = bx.add(1).read_unaligned(); let y2 = by.add(1).read_unaligned();
            let x3 = bx.add(2).read_unaligned(); let y3 = by.add(2).read_unaligned();
            let x4 = bx.add(3).read_unaligned(); let y4 = by.add(3).read_unaligned();

            sx.v1 += x1; sy.v1 += y1; sxx.v1 += x1 * x1; syy.v1 += y1 * y1; sxy.v1 += x1 * y1;
            sx.v2 += x2; sy.v2 += y2; sxx.v2 += x2 * x2; syy.v2 += y2 * y2; sxy.v2 += x2 * y2;
            sx.v3 += x3; sy.v3 += y3; sxx.v3 += x3 * x3; syy.v3 += y3 * y3; sxy.v3 += x3 * y3;
            sx.v4 += x4; sy.v4 += y4; sxx.v4 += x4 * x4; syy.v4 += y4 * y4; sxy.v4 += x4 * y4;
        }

        for i in (unrolled * 4)..chunks {
            let xv = x_ptr.add(i).read_unaligned();
            let yv = y_ptr.add(i).read_unaligned();
            sx.v1 += xv; sy.v1 += yv; sxx.v1 += xv * xv; syy.v1 += yv * yv; sxy.v1 += xv * yv;
        }
    }

    let mut sum_x = sx.reduce_add();
    let mut sum_y = sy.reduce_add();
    let mut sum_xx = sxx.reduce_add();
    let mut sum_yy = syy.reduce_add();
    let mut sum_xy = sxy.reduce_add();

    for i in (chunks * 4)..len {
        let xi = x[i];
        let yi = y[i];
        sum_x += xi; sum_y += yi;
        sum_xx += xi * xi; sum_yy += yi * yi;
        sum_xy += xi * yi;
    }

    let numerator = n * sum_xy - sum_x * sum_y;
    let denom_x = n * sum_xx - sum_x * sum_x;
    let denom_y = n * sum_yy - sum_y * sum_y;

    if denom_x <= 0.0 || denom_y <= 0.0 {
        return f64::NAN;
    }

    numerator / (denom_x * denom_y).sqrt()
}

/// Calculate the Spearman rank correlation coefficient between two slices.
/// This is Pearson correlation applied to the ranks of the values.
pub fn spearmancoeff(x: &[f64], y: &[f64]) -> f64 {
    if x.len() != y.len() || x.is_empty() {
        return f64::NAN;
    }
    
    let x_ranks = rank(x);
    let y_ranks = rank(y);
    
    corrcoeff(&x_ranks, &y_ranks)
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

/// Calculate full ANOVA result including F-score and degrees of freedom.
pub fn anova(groups: &[&[f64]]) -> AnovaResult {
    let f_score = anova_f_score(groups);

    let k = groups.len();
    let total_n: usize = groups.iter().map(|g| g.len()).sum();

    AnovaResult {
        f_score,
        df_between: if k > 0 { k - 1 } else { 0 },
        df_within: if total_n > k { total_n - k } else { 0 },
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
        return TestResult {
            statistic: f64::NAN,
            p_value: f64::NAN,
            df: None,
        };
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

/// One-sample z-test: tests if sample mean equals a hypothesized value with known population standard deviation
///
/// Returns a TestResult with z-statistic and p-value.
/// The p-value is two-tailed.
pub fn ztest(data: &[f64], mu0: f64, sigma: f64) -> TestResult {
    if data.is_empty() || sigma <= 0.0 || sigma.is_nan() {
        return TestResult {
            statistic: f64::NAN,
            p_value: f64::NAN,
            df: None,
        };
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

/// Linear regression result
#[derive(Debug, Clone, PartialEq)]
pub struct RegressionResult {
    pub slope: f64,
    pub intercept: f64,
    pub r_squared: f64,
    pub residuals: Vec<f64>,
}

/// Simple linear regression: y = slope * x + intercept
///
/// Returns regression coefficients, R², and residuals.
pub fn regress(x: &[f64], y: &[f64]) -> RegressionResult {
    if x.len() != y.len() || x.len() < 2 {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    let x_mean = mean(x);
    let y_mean = mean(y);

    // Calculate slope: cov(x,y) / var(x)
    let cov_xy = covariance(x, y);
    let var_x = variance(x);

    if var_x == 0.0 || var_x.is_nan() {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    let slope = cov_xy / var_x;
    let intercept = y_mean - slope * x_mean;

    // Calculate R²
    let r = corrcoeff(x, y);
    let r_squared = if r.is_nan() { f64::NAN } else { r * r };

    // Calculate residuals
    let residuals: Vec<f64> = x
        .iter()
        .zip(y.iter())
        .map(|(&xi, &yi)| yi - (slope * xi + intercept))
        .collect();

    RegressionResult {
        slope,
        intercept,
        r_squared,
        residuals,
    }
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
            for c_idx in 0..num_cols {
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
        grouped_values
            .entry(group.clone())
            .or_insert_with(Vec::new)
            .push(value);
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
        df_within: if total_n > k { total_n - k } else { 0 },
    }
}

// =============================================================================
// Tests
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;
    use ndarray::Array1;
    use ndarray_stats::SummaryStatisticsExt;

    #[test]
    fn test_sum() {
        assert_eq!(sum(&[]), 0.0);
        assert_eq!(sum(&[1.0]), 1.0);
        assert_eq!(sum(&[1.0, 2.0, 3.0]), 6.0);
        assert_eq!(sum(&[1.0, -2.0, 3.0]), 2.0);
        // Test large array to exercise SIMD
        let large: Vec<f64> = (0..1000).map(|i| i as f64).collect();
        assert_eq!(sum(&large), 499500.0);
    }

    #[test]
    fn test_mean() {
        assert!(mean(&[]).is_nan());
        assert_eq!(mean(&[1.0]), 1.0);
        assert_eq!(mean(&[1.0, 2.0, 3.0]), 2.0);
        assert_eq!(mean(&[1.0, 2.0, 3.0, 4.0]), 2.5);
    }

    #[test]
    fn test_variance() {
        assert!(variance(&[]).is_nan());
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let var = variance(&data);
        assert_relative_eq!(var, 2.0, epsilon = 1e-10);
    }

    #[test]
    fn test_sample_variance() {
        assert!(sample_variance(&[]).is_nan());
        assert!(sample_variance(&[1.0]).is_nan());
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let var = sample_variance(&data);
        assert_relative_eq!(var, 2.5, epsilon = 1e-10);
    }

    #[test]
    fn test_stdev() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        assert_relative_eq!(stdev(&data), 2.0_f64.sqrt(), epsilon = 1e-10);
    }

    #[test]
    fn test_min() {
        assert!(min(&[]).is_nan());
        assert_eq!(min(&[5.0, 2.0, 8.0, 1.0, 9.0]), 1.0);
        assert_eq!(min(&[1.0]), 1.0);
    }

    #[test]
    fn test_max() {
        assert!(max(&[]).is_nan());
        assert_eq!(max(&[5.0, 2.0, 8.0, 1.0, 9.0]), 9.0);
        assert_eq!(max(&[1.0]), 1.0);
    }

    #[test]
    fn test_product() {
        assert!(product(&[]).is_nan());
        assert_eq!(product(&[2.0, 3.0, 4.0]), 24.0);
        assert_eq!(product(&[1.0, 2.0, 0.0, 4.0]), 0.0);
    }

    #[test]
    fn test_range() {
        assert!(range(&[]).is_nan());
        assert_eq!(range(&[1.0, 5.0, 3.0, 9.0, 2.0]), 8.0);
    }

    #[test]
    fn test_covariance() {
        let x = [2.0, 4.0, 6.0];
        let y = [1.0, 3.0, 5.0];
        let cov = covariance(&x, &y);
        assert_relative_eq!(cov, 8.0 / 3.0, epsilon = 1e-12);
    }

    #[test]
    fn test_covariance_invalid() {
        let x = [1.0, 2.0];
        let y = [1.0];
        assert!(covariance(&x, &y).is_nan());
        assert!(covariance(&[], &[]).is_nan());
    }

    #[test]
    fn test_corrcoeff() {
        let x = [2.0, 4.0, 6.0];
        let y = [1.0, 3.0, 5.0];
        let corr = corrcoeff(&x, &y);
        assert_relative_eq!(corr, 1.0, epsilon = 1e-12);
    }

    #[test]
    fn test_corrcoeff_zero_variance() {
        let x = [1.0, 1.0, 1.0];
        let y = [2.0, 3.0, 4.0];
        assert!(corrcoeff(&x, &y).is_nan());
    }

    #[test]
    fn test_cumsum() {
        assert_eq!(cumsum(&[]), Vec::<f64>::new());
        assert_eq!(cumsum(&[1.0, 2.0, 3.0]), vec![1.0, 3.0, 6.0]);
    }

    #[test]
    fn test_diff() {
        assert_eq!(diff(&[1.0]), Vec::<f64>::new());
        assert_eq!(diff(&[1.0, 4.0, 9.0]), vec![3.0, 5.0]);
    }

    #[test]
    fn test_rank() {
        let data = [10.0, 20.0, 20.0, 30.0];
        let expected = vec![1.0, 2.5, 2.5, 4.0];
        assert_eq!(rank(&data), expected);
    }

    #[test]
    fn test_median() {
        assert!(median(&[]).is_nan());
        assert_eq!(median(&[2.0, 1.0, 3.0]), 2.0);
        assert_eq!(median(&[1.0, 2.0, 3.0, 4.0]), 2.5);
    }

    #[test]
    fn test_mode_function() {
        assert!(mode(&[]).is_nan());
        assert_eq!(mode(&[1.0, 2.0, 2.0, 3.0]), 2.0);
        assert!(mode(&[1.0, 2.0, 3.0, 4.0]).is_nan());
        assert_eq!(mode(&[1.0, 1.0, 2.0, 2.0, 3.0]), 1.0);
    }

    #[test]
    fn test_geomean() {
        assert!(geomean(&[]).is_nan());
        assert!(geomean(&[1.0, 0.0, 2.0]).is_nan());
        let data = [1.0, 3.0, 9.0];
        assert_relative_eq!(geomean(&data), 3.0, epsilon = 1e-12);
    }

    #[test]
    fn test_percentile() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        
        // Test median (50th percentile)
        assert_relative_eq!(percentile_inclusive(&data, 0.5), 5.5, epsilon = 1e-10);
        
        // Test quartiles
        assert_relative_eq!(percentile_inclusive(&data, 0.25), 3.25, epsilon = 1e-10);
        assert_relative_eq!(percentile_inclusive(&data, 0.75), 7.75, epsilon = 1e-10);
        
        // Edge cases
        assert_relative_eq!(percentile_inclusive(&data, 0.0), 1.0, epsilon = 1e-10);
        assert_relative_eq!(percentile_inclusive(&data, 1.0), 10.0, epsilon = 1e-10);
        
        // Invalid inputs
        assert!(percentile_inclusive(&[], 0.5).is_nan());
        assert!(percentile_inclusive(&data, -0.1).is_nan());
        assert!(percentile_inclusive(&data, 1.1).is_nan());
    }

    #[test]
    fn test_quantiles() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        let qs = quantiles(&data, &[0.25, 0.5, 0.75]);
        
        assert_eq!(qs.len(), 3);
        assert_relative_eq!(qs[0], 2.9375, epsilon = 1e-10);
        assert_relative_eq!(qs[1], 5.5, epsilon = 1e-10);
        assert_relative_eq!(qs[2], 8.0625, epsilon = 1e-10);
    }

    #[test]
    fn test_quartiles() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];
        let q = quartiles(&data);
        
        // jStat uses round-based indexing
        assert_eq!(q[0], 2.0); // Q1
        assert_eq!(q[1], 4.0); // Q2 (median)
        assert_eq!(q[2], 6.0); // Q3
    }

    #[test]
    fn test_iqr() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];
        let q = quartiles(&data);
        assert_eq!(iqr(&data), q[2] - q[0]);
    }

    #[test]
    fn test_cumprod() {
        assert_eq!(cumprod(&[]), Vec::<f64>::new());
        assert_eq!(cumprod(&[1.0, 2.0, 3.0]), vec![1.0, 2.0, 6.0]);
        assert_eq!(cumprod(&[2.0, 3.0, 4.0]), vec![2.0, 6.0, 24.0]);
    }

    #[test]
    fn test_coeffvar() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let cv = coeffvar(&data);
        let expected = stdev(&data) / mean(&data);
        assert_relative_eq!(cv, expected, epsilon = 1e-10);
        
        // Zero mean should return NaN
        assert!(coeffvar(&[0.0, 0.0, 0.0]).is_nan());
    }

    #[test]
    fn test_spearmancoeff() {
        let x = [1.0, 2.0, 3.0, 4.0, 5.0];
        let y = [2.0, 4.0, 6.0, 8.0, 10.0];
        // Perfect monotonic relationship
        assert_relative_eq!(spearmancoeff(&x, &y), 1.0, epsilon = 1e-10);
        
        // Reversed should be -1
        let y_rev = [10.0, 8.0, 6.0, 4.0, 2.0];
        assert_relative_eq!(spearmancoeff(&x, &y_rev), -1.0, epsilon = 1e-10);
    }

    #[test]
    fn test_percentile_of_score() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        
        // Score at median
        assert_relative_eq!(percentile_of_score(&data, 5.5, false), 0.5, epsilon = 1e-10);
        
        // Score at first quartile
        assert_relative_eq!(percentile_of_score(&data, 3.0, false), 0.3, epsilon = 1e-10);
        
        // Score at end
        assert_relative_eq!(percentile_of_score(&data, 10.0, false), 1.0, epsilon = 1e-10);
        
        // Score at beginning
        assert_relative_eq!(percentile_of_score(&data, 1.0, false), 0.1, epsilon = 1e-10);
        
        // Strict mode
        assert_relative_eq!(percentile_of_score(&data, 5.0, true), 0.4, epsilon = 1e-10);
    }

    #[test]
    fn test_histogram() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        
        // 4 bins (default-like)
        let bins = histogram(&data, 4);
        assert_eq!(bins.len(), 4);
        assert_eq!(bins.iter().sum::<usize>(), 10);
        
        // 2 bins
        let bins = histogram(&data, 2);
        assert_eq!(bins.len(), 2);
        assert_eq!(bins[0] + bins[1], 10);
        
        // Empty data
        let bins = histogram(&[], 4);
        assert_eq!(bins, vec![0, 0, 0, 0]);
        
        // All same values
        let same = [5.0, 5.0, 5.0];
        let bins = histogram(&same, 4);
        assert_eq!(bins[0], 3);
    }

    #[test]
    fn test_histogram_edges() {
        let data = [1.0, 2.5, 3.5, 5.0, 7.0, 8.0, 9.5];
        let edges = [0.0, 3.0, 6.0, 10.0];
        
        let bins = histogram_edges(&data, &edges);
        assert_eq!(bins.len(), 3);
        assert_eq!(bins[0], 2); // [0, 3): 1.0, 2.5
        assert_eq!(bins[1], 2); // [3, 6): 3.5, 5.0
        assert_eq!(bins[2], 3); // [6, 10]: 7.0, 8.0, 9.5
        
        // Values outside range
        let data = [-1.0, 0.0, 5.0, 10.0, 11.0];
        let edges = [0.0, 5.0, 10.0];
        let bins = histogram_edges(&data, &edges);
        // 0.0 in first bin, 5.0 in second bin (edge goes to next bin), 10.0 in last bin
        assert_eq!(bins[0], 1); // 0.0
        assert_eq!(bins[1], 2); // 5.0, 10.0 (last edge included in last bin)
    }

    #[test]
    fn test_skewness_matches_ndarray() {
        let data = [1.0, 2.0, 4.0, 8.0, 16.0];
        let arr = Array1::from_vec(data.to_vec());
        let expected = arr.skewness().unwrap();
        assert_relative_eq!(skewness(&data), expected, epsilon = 1e-12);
    }

    #[test]
    fn test_kurtosis_matches_ndarray() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
        let arr = Array1::from_vec(data.to_vec());
        let expected = arr.kurtosis().unwrap();
        assert_relative_eq!(kurtosis(&data), expected, epsilon = 1e-12);
    }

    #[test]
    fn test_anova_f_score() {
        let control = [2.0, 3.0, 7.0, 2.0, 6.0];
        let test = [10.0, 11.0, 14.0, 13.0, 15.0];
        let f = anova_f_score(&[&control, &test]);
        assert_relative_eq!(f, 37.73469387755101, epsilon = 1e-10);
    }

    #[test]
    fn test_anova_three_groups() {
        let g1 = [1.0, 2.0, 3.0];
        let g2 = [4.0, 5.0, 6.0];
        let g3 = [7.0, 8.0, 9.0];
        let result = anova(&[&g1, &g2, &g3]);
        assert_eq!(result.df_between, 2);
        assert_eq!(result.df_within, 6);
        assert_relative_eq!(result.f_score, 27.0, epsilon = 1e-10);
    }

    #[test]
    fn test_anova_edge_cases() {
        let g1 = [1.0, 2.0, 3.0];
        assert!(anova_f_score(&[&g1]).is_nan());
        let empty: &[f64] = &[];
        assert!(anova_f_score(&[empty, empty]).is_nan());
    }

    #[test]
    fn test_ttest() {
        // Test with known data
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let result = ttest(&data, 3.0);
        // Mean is 3.0, so t-statistic should be close to 0
        assert!(result.statistic.abs() < 0.1);
        assert!(result.p_value > 0.9); // High p-value when null is true
        assert_eq!(result.df, Some(4.0));

        // Test with different null hypothesis
        let result2 = ttest(&data, 0.0);
        assert!(result2.statistic > 0.0);
        assert!(result2.p_value < 0.05); // Low p-value when null is false
    }

    #[test]
    fn test_ztest() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let result = ztest(&data, 3.0, 1.414);
        // Mean is 3.0, so z-statistic should be close to 0
        assert!(result.statistic.abs() < 0.1);
        assert!(result.p_value > 0.9);
        assert_eq!(result.df, None);
    }

    #[test]
    fn test_regress() {
        // Perfect linear relationship
        let x = [1.0, 2.0, 3.0, 4.0, 5.0];
        let y = [2.0, 4.0, 6.0, 8.0, 10.0];
        let result = regress(&x, &y);
        assert_relative_eq!(result.slope, 2.0, epsilon = 1e-10);
        assert_relative_eq!(result.intercept, 0.0, epsilon = 1e-10);
        assert_relative_eq!(result.r_squared, 1.0, epsilon = 1e-10);
        assert_eq!(result.residuals.len(), 5);
        // All residuals should be close to 0
        for &residual in &result.residuals {
            assert!(residual.abs() < 1e-10);
        }
    }

    #[test]
    fn test_normalci() {
        // 95% confidence interval for mean=100, se=10
        let ci = normalci(0.05, 100.0, 10.0);
        // Should be approximately [80.4, 119.6] (100 ± 1.96 * 10)
        assert!(ci[0] > 80.0 && ci[0] < 81.0);
        assert!(ci[1] > 119.0 && ci[1] < 120.0);
        assert!(ci[0] < ci[1]);
    }

    #[test]
    fn test_tci() {
        // 95% confidence interval for mean=100, stdev=10, n=20
        let ci = tci(0.05, 100.0, 10.0, 20.0);
        // Should be approximately [95.3, 104.7] (100 ± t(0.025, 19) * 10/√20)
        assert!(ci[0] > 95.0 && ci[0] < 96.0);
        assert!(ci[1] > 104.0 && ci[1] < 105.0);
        assert!(ci[0] < ci[1]);
    }

    #[test]
    fn test_chi_square_test() {
        // Test with independent variables (should have low chi-square)
        let cat1 = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
        let cat2 = vec!["X".to_string(), "Y".to_string(), "X".to_string(), "Y".to_string()];
        let result = chi_square_test(&cat1, &cat2);
        
        // Should have valid results
        assert!(!result.statistic.is_nan());
        assert!(!result.p_value.is_nan());
        assert_eq!(result.df, 1); // (2-1) * (2-1) = 1
        
        // Test with dependent variables (should have higher chi-square)
        let cat1_dep = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
        let cat2_dep = vec!["X".to_string(), "X".to_string(), "Y".to_string(), "Y".to_string()];
        let result_dep = chi_square_test(&cat1_dep, &cat2_dep);
        
        assert!(!result_dep.statistic.is_nan());
        assert!(!result_dep.p_value.is_nan());
        // Dependent case should have higher chi-square statistic
        assert!(result_dep.statistic > result.statistic);
    }

    #[test]
    fn test_chi_square_test_edge_cases() {
        // Empty arrays
        let empty: Vec<String> = vec![];
        let result = chi_square_test(&empty, &empty);
        assert!(result.statistic.is_nan());
        assert!(result.df == 0);
        
        // Mismatched lengths
        let cat1 = vec!["A".to_string(), "B".to_string()];
        let cat2 = vec!["X".to_string()];
        let result = chi_square_test(&cat1, &cat2);
        assert!(result.statistic.is_nan());
        
        // Single category (should return NaN)
        let cat1_single = vec!["A".to_string(), "A".to_string()];
        let cat2_single = vec!["X".to_string(), "X".to_string()];
        let result = chi_square_test(&cat1_single, &cat2_single);
        assert!(result.statistic.is_nan());
    }

    #[test]
    fn test_chi_square_test_with_cardinality() {
        // Test that optimized version produces same results as standard version
        let cat1 = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
        let cat2 = vec!["X".to_string(), "Y".to_string(), "X".to_string(), "Y".to_string()];
        
        let result_standard = chi_square_test(&cat1, &cat2);
        let result_optimized = chi_square_test_with_cardinality(&cat1, &cat2, Some(2), Some(2));
        
        // Should produce identical results
        assert_relative_eq!(result_standard.statistic, result_optimized.statistic, epsilon = 1e-10);
        assert_relative_eq!(result_standard.p_value, result_optimized.p_value, epsilon = 1e-10);
        assert_eq!(result_standard.df, result_optimized.df);
        
        // Test with wrong cardinality (should fall back to standard)
        let result_wrong_card = chi_square_test_with_cardinality(&cat1, &cat2, Some(10), Some(10));
        assert_relative_eq!(result_standard.statistic, result_wrong_card.statistic, epsilon = 1e-10);
        
        // Test with None cardinalities (should use standard)
        let result_none = chi_square_test_with_cardinality(&cat1, &cat2, None, None);
        assert_relative_eq!(result_standard.statistic, result_none.statistic, epsilon = 1e-10);
    }

    #[test]
    fn test_anova_f_score_categorical() {
        // Test equivalent to regular anova_f_score
        let groups = vec![
            "A".to_string(), "A".to_string(), "A".to_string(),
            "B".to_string(), "B".to_string(), "B".to_string(),
        ];
        let values = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
        
        let f_categorical = anova_f_score_categorical(&groups, &values);
        
        // Compare with regular anova_f_score
        let group_a = [1.0, 2.0, 3.0];
        let group_b = [4.0, 5.0, 6.0];
        let f_regular = anova_f_score(&[&group_a, &group_b]);
        
        assert_relative_eq!(f_categorical, f_regular, epsilon = 1e-10);
    }

    #[test]
    fn test_anova_categorical() {
        let groups = vec![
            "Group1".to_string(), "Group1".to_string(), "Group1".to_string(),
            "Group2".to_string(), "Group2".to_string(), "Group2".to_string(),
            "Group3".to_string(), "Group3".to_string(), "Group3".to_string(),
        ];
        let values = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0];
        
        let result = anova_categorical(&groups, &values);
        
        assert!(!result.f_score.is_nan());
        assert_eq!(result.df_between, 2); // 3 groups - 1
        assert_eq!(result.df_within, 6); // 9 total - 3 groups
        
        // Compare with regular anova
        let g1 = [1.0, 2.0, 3.0];
        let g2 = [4.0, 5.0, 6.0];
        let g3 = [7.0, 8.0, 9.0];
        let result_regular = anova(&[&g1, &g2, &g3]);
        
        assert_relative_eq!(result.f_score, result_regular.f_score, epsilon = 1e-10);
        assert_eq!(result.df_between, result_regular.df_between);
        assert_eq!(result.df_within, result_regular.df_within);
    }

    #[test]
    fn test_anova_categorical_edge_cases() {
        // Empty arrays
        let empty_groups: Vec<String> = vec![];
        let empty_values: Vec<f64> = vec![];
        let result = anova_categorical(&empty_groups, &empty_values);
        assert!(result.f_score.is_nan());
        
        // Mismatched lengths
        let groups = vec!["A".to_string(), "B".to_string()];
        let values = vec![1.0];
        let result = anova_categorical(&groups, &values);
        assert!(result.f_score.is_nan());
        
        // Single group
        let single_group = vec!["A".to_string(), "A".to_string()];
        let single_values = vec![1.0, 2.0];
        let result = anova_categorical(&single_group, &single_values);
        assert!(result.f_score.is_nan());
    }

    #[test]
    fn test_deviation() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let devs = deviation(&data);
        let mean_val = mean(&data);
        assert_eq!(devs.len(), 5);
        for (i, &dev) in devs.iter().enumerate() {
            assert_relative_eq!(dev, data[i] - mean_val, epsilon = 1e-10);
        }
        
        assert_eq!(deviation(&[]), Vec::<f64>::new());
    }

    #[test]
    fn test_meandev() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let md = meandev(&data);
        let m = mean(&data);
        let expected: f64 = data.iter().map(|&x| (x - m).abs()).sum::<f64>() / (data.len() as f64);
        assert_relative_eq!(md, expected, epsilon = 1e-10);
        
        assert!(meandev(&[]).is_nan());
    }

    #[test]
    fn test_meddev() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        let md = meddev(&data);
        let med = median(&data);
        let expected: f64 = data.iter().map(|&x| (x - med).abs()).sum::<f64>() / 5.0;
        assert_relative_eq!(md, expected, epsilon = 1e-10);
        
        assert!(meddev(&[]).is_nan());
    }

    #[test]
    fn test_pooledvariance() {
        let data1 = [1.0, 2.0, 3.0, 4.0, 5.0];
        let data2 = [6.0, 7.0, 8.0, 9.0, 10.0];
        let pooled_var = pooledvariance(&data1, &data2);
        
        let var1 = sample_variance(&data1);
        let var2 = sample_variance(&data2);
        let n1 = data1.len() as f64;
        let n2 = data2.len() as f64;
        let expected = ((n1 - 1.0) * var1 + (n2 - 1.0) * var2) / (n1 + n2 - 2.0);
        assert_relative_eq!(pooled_var, expected, epsilon = 1e-10);
        
        assert!(pooledvariance(&[1.0], &data2).is_nan());
        assert!(pooledvariance(&data1, &[1.0]).is_nan());
    }

    #[test]
    fn test_pooledstdev() {
        let data1 = [1.0, 2.0, 3.0, 4.0, 5.0];
        let data2 = [6.0, 7.0, 8.0, 9.0, 10.0];
        let pooled_std = pooledstdev(&data1, &data2);
        let pooled_var = pooledvariance(&data1, &data2);
        assert_relative_eq!(pooled_std, pooled_var.sqrt(), epsilon = 1e-10);
    }

    #[test]
    fn test_stan_moment() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0];
        
        // k=1 should always be 0
        assert_relative_eq!(stan_moment(&data, 1), 0.0, epsilon = 1e-10);
        
        // k=2 should always be 1
        assert_relative_eq!(stan_moment(&data, 2), 1.0, epsilon = 1e-10);
        
        // k=3 should match skewness
        let skew = skewness(&data);
        let stan_m3 = stan_moment(&data, 3);
        assert_relative_eq!(stan_m3, skew, epsilon = 1e-10);
        
        // k=4 should match kurtosis
        let kurt = kurtosis(&data);
        let stan_m4 = stan_moment(&data, 4);
        assert_relative_eq!(stan_m4, kurt, epsilon = 1e-10);
        
        assert!(stan_moment(&[], 1).is_nan());
    }

    #[test]
    fn test_qscore() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        
        // qscore should match percentile_of_score
        let score = 5.5;
        let qs = qscore(&data, score, false);
        let pos = percentile_of_score(&data, score, false);
        assert_relative_eq!(qs, pos, epsilon = 1e-10);
        
        assert!(qscore(&[], 5.0, false).is_nan());
    }

    #[test]
    fn test_qtest() {
        let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
        
        // Score 5.5 should be in middle 50% (0.25 to 0.75)
        assert!(qtest(&data, 5.5, 0.25, 0.75));
        
        // Score 1.0 should be in bottom 10% (0.0 to 0.1)
        assert!(qtest(&data, 1.0, 0.0, 0.1));
        
        // Score 10.0 should be in top 10% (0.9 to 1.0)
        assert!(qtest(&data, 10.0, 0.9, 1.0));
        
        // Score 5.0 should NOT be in top 10%
        assert!(!qtest(&data, 5.0, 0.9, 1.0));
        
        // Invalid ranges
        assert!(!qtest(&[], 5.0, 0.25, 0.75));
        assert!(!qtest(&data, 5.0, 0.75, 0.25)); // q_lower > q_upper
    }

    #[test]
    fn test_cumreduce() {
        let data = [1.0, 2.0, 3.0];
        
        // Cumulative sum
        let cum_sum = cumreduce(&data, 0.0, |acc, x| acc + x);
        assert_eq!(cum_sum, vec![1.0, 3.0, 6.0]);
        
        // Cumulative product
        let cum_prod = cumreduce(&data, 1.0, |acc, x| acc * x);
        assert_eq!(cum_prod, vec![1.0, 2.0, 6.0]);
        
        // Cumulative sum of squares
        let cum_sq = cumreduce(&data, 0.0, |acc, x| acc + x * x);
        assert_eq!(cum_sq, vec![1.0, 5.0, 14.0]);
        
        // Empty data
        assert_eq!(cumreduce(&[], 0.0, |acc, x| acc + x), Vec::<f64>::new());
    }
}
