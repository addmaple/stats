use crate::stats::basic::mean;
use crate::stats::simd::SimdAccum4;
use wide::f64x4;

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

    let mut m2_acc = SimdAccum4::zero();
    let mut m3_acc = SimdAccum4::zero();
    let mut m2_tail = 0.0;
    let mut m3_tail = 0.0;

    simd_for_each_unrolled4_f64x4!(
        data,
        |base| {
            let c1 = base.read_unaligned();
            let c2 = base.add(1).read_unaligned();
            let c3 = base.add(2).read_unaligned();
            let c4 = base.add(3).read_unaligned();

            let d1 = c1 - mean_vec;
            let d2 = c2 - mean_vec;
            let d3 = c3 - mean_vec;
            let d4 = c4 - mean_vec;

            let d1_sq = d1 * d1;
            let d2_sq = d2 * d2;
            let d3_sq = d3 * d3;
            let d4_sq = d4 * d4;

            m2_acc.v1 += d1_sq;
            m3_acc.v1 += d1_sq * d1;
            m2_acc.v2 += d2_sq;
            m3_acc.v2 += d2_sq * d2;
            m2_acc.v3 += d3_sq;
            m3_acc.v3 += d3_sq * d3;
            m2_acc.v4 += d4_sq;
            m3_acc.v4 += d4_sq * d4;
        },
        |chunk| {
            let diff = chunk - mean_vec;
            let diff_sq = diff * diff;
            m2_acc.v1 += diff_sq;
            m3_acc.v1 += diff_sq * diff;
        },
        |value| {
            let diff = value - mean_val;
            let diff_sq = diff * diff;
            m2_tail += diff_sq;
            m3_tail += diff_sq * diff;
        }
    );

    let mut m2 = m2_acc.reduce_add() + m2_tail;
    let mut m3 = m3_acc.reduce_add() + m3_tail;

    let n = len as f64;
    m2 /= n;
    m3 /= n;

    if m2 == 0.0 {
        return f64::NAN;
    }

    m3 / m2.sqrt().powi(3)
}

/// Calculate the excess kurtosis of a slice (requires at least 4 elements).
/// Uses population formula: m4 / m2^2 - 3 (matching jStat behavior).
/// Excess kurtosis is 0 for a normal distribution.
pub fn kurtosis(data: &[f64]) -> f64 {
    if data.len() < 4 || data.iter().any(|v| v.is_nan()) {
        return f64::NAN;
    }

    let mean_val = mean(data);
    let mean_vec = f64x4::splat(mean_val);
    let len = data.len();

    let mut m2_acc = SimdAccum4::zero();
    let mut m4_acc = SimdAccum4::zero();
    let mut m2_tail = 0.0;
    let mut m4_tail = 0.0;

    simd_for_each_unrolled4_f64x4!(
        data,
        |base| {
            let c1 = base.read_unaligned();
            let c2 = base.add(1).read_unaligned();
            let c3 = base.add(2).read_unaligned();
            let c4 = base.add(3).read_unaligned();

            let d1 = c1 - mean_vec;
            let d2 = c2 - mean_vec;
            let d3 = c3 - mean_vec;
            let d4 = c4 - mean_vec;

            let d1_sq = d1 * d1;
            let d2_sq = d2 * d2;
            let d3_sq = d3 * d3;
            let d4_sq = d4 * d4;

            m2_acc.v1 += d1_sq;
            m4_acc.v1 += d1_sq * d1_sq;
            m2_acc.v2 += d2_sq;
            m4_acc.v2 += d2_sq * d2_sq;
            m2_acc.v3 += d3_sq;
            m4_acc.v3 += d3_sq * d3_sq;
            m2_acc.v4 += d4_sq;
            m4_acc.v4 += d4_sq * d4_sq;
        },
        |chunk| {
            let diff = chunk - mean_vec;
            let diff_sq = diff * diff;
            m2_acc.v1 += diff_sq;
            m4_acc.v1 += diff_sq * diff_sq;
        },
        |value| {
            let diff = value - mean_val;
            let diff_sq = diff * diff;
            m2_tail += diff_sq;
            m4_tail += diff_sq * diff_sq;
        }
    );

    let mut m2 = m2_acc.reduce_add() + m2_tail;
    let mut m4 = m4_acc.reduce_add() + m4_tail;

    let n = len as f64;
    m2 /= n;
    m4 /= n;

    if m2 == 0.0 {
        return f64::NAN;
    }

    // Return excess kurtosis (subtract 3 from raw kurtosis)
    m4 / (m2 * m2) - 3.0
}
