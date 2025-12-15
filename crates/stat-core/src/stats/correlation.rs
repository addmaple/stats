use crate::stats::basic::mean;
use crate::stats::order::rank;
use crate::stats::simd::SimdAccum4;
use wide::f64x4;

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
    let mut acc = SimdAccum4::zero();
    let mut tail_sum = 0.0;

    simd_for_each_unrolled4_f64x4_zip!(
        x,
        y,
        |bx, by| {
            acc.v1 += (bx.read_unaligned() - mean_x_vec) * (by.read_unaligned() - mean_y_vec);
            acc.v2 += (bx.add(1).read_unaligned() - mean_x_vec)
                * (by.add(1).read_unaligned() - mean_y_vec);
            acc.v3 += (bx.add(2).read_unaligned() - mean_x_vec)
                * (by.add(2).read_unaligned() - mean_y_vec);
            acc.v4 += (bx.add(3).read_unaligned() - mean_x_vec)
                * (by.add(3).read_unaligned() - mean_y_vec);
        },
        |xv, yv| {
            acc.v1 += (xv - mean_x_vec) * (yv - mean_y_vec);
        },
        |xs, ys| {
            tail_sum += (xs - mean_x) * (ys - mean_y);
        }
    );

    (acc.reduce_add() + tail_sum) / (len as f64)
}

/// Calculate the Pearson correlation coefficient between two slices.
/// Uses a centered (mean-based) two-pass algorithm for numerical stability.
pub fn corrcoeff(x: &[f64], y: &[f64]) -> f64 {
    if x.len() != y.len() || x.is_empty() {
        return f64::NAN;
    }

    let mean_x = mean(x);
    let mean_y = mean(y);
    let mean_x_vec = f64x4::splat(mean_x);
    let mean_y_vec = f64x4::splat(mean_y);

    let mut sxx = SimdAccum4::zero();
    let mut syy = SimdAccum4::zero();
    let mut sxy = SimdAccum4::zero();
    let mut tail_xx = 0.0;
    let mut tail_yy = 0.0;
    let mut tail_xy = 0.0;

    simd_for_each_unrolled4_f64x4_zip!(
        x,
        y,
        |bx, by| {
            let x1 = bx.read_unaligned() - mean_x_vec;
            let y1 = by.read_unaligned() - mean_y_vec;
            let x2 = bx.add(1).read_unaligned() - mean_x_vec;
            let y2 = by.add(1).read_unaligned() - mean_y_vec;
            let x3 = bx.add(2).read_unaligned() - mean_x_vec;
            let y3 = by.add(2).read_unaligned() - mean_y_vec;
            let x4 = bx.add(3).read_unaligned() - mean_x_vec;
            let y4 = by.add(3).read_unaligned() - mean_y_vec;

            sxx.v1 += x1 * x1;
            syy.v1 += y1 * y1;
            sxy.v1 += x1 * y1;
            sxx.v2 += x2 * x2;
            syy.v2 += y2 * y2;
            sxy.v2 += x2 * y2;
            sxx.v3 += x3 * x3;
            syy.v3 += y3 * y3;
            sxy.v3 += x3 * y3;
            sxx.v4 += x4 * x4;
            syy.v4 += y4 * y4;
            sxy.v4 += x4 * y4;
        },
        |xv, yv| {
            let dx = xv - mean_x_vec;
            let dy = yv - mean_y_vec;
            sxx.v1 += dx * dx;
            syy.v1 += dy * dy;
            sxy.v1 += dx * dy;
        },
        |xs, ys| {
            let dx = xs - mean_x;
            let dy = ys - mean_y;
            tail_xx = dx.mul_add(dx, tail_xx);
            tail_yy = dy.mul_add(dy, tail_yy);
            tail_xy = dx.mul_add(dy, tail_xy);
        }
    );

    let sum_xx = sxx.reduce_add() + tail_xx;
    let sum_yy = syy.reduce_add() + tail_yy;
    let sum_xy = sxy.reduce_add() + tail_xy;

    if sum_xx <= 0.0 || sum_yy <= 0.0 {
        return f64::NAN;
    }

    sum_xy / (sum_xx * sum_yy).sqrt()
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
