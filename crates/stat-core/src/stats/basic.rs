use crate::stats::simd::SimdAccum4;
use wide::f64x4;

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
pub(crate) fn sum_squared_deviations(data: &[f64], m: f64) -> f64 {
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
/// Calculate the Median Absolute Deviation (MAD) of a slice.
/// This is the median of the absolute deviations from the median.
/// Matches jStat's meddev behavior.
pub fn meddev(data: &[f64]) -> f64 {
    use crate::stats::order::median;
    if data.is_empty() {
        return f64::NAN;
    }
    let med = median(data);
    if med.is_nan() {
        return f64::NAN;
    }
    // Compute absolute deviations from median
    let abs_deviations: Vec<f64> = data.iter().map(|&x| (x - med).abs()).collect();
    // Return the median of absolute deviations (not mean)
    median(&abs_deviations)
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
    ((n1 - 1.0) * var1 + (n2 - 1.0) * var2) / (n1 + n2 - 2.0)
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
    let central_moment =
        data.iter().map(|&x| (x - m).powi(k as i32)).sum::<f64>() / (data.len() as f64);

    // Standardize by dividing by σ^k
    central_moment / sd.powi(k as i32)
}



