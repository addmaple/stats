use crate::stats::basic::sum;
use crate::stats::simd::SimdAccum4;
use core::mem::size_of_val;
#[cfg(not(all(target_arch = "wasm32", target_feature = "simd128")))]
use wide::f32x4;
use wide::f64x4;

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
use core::arch::wasm32::{
    f32x4_add, f32x4_extract_lane, f32x4_mul, f32x4_splat, f32x4_sub, f64x2_add,
    f64x2_extract_lane, f64x2_mul, f64x2_splat, f64x2_sub, v128, v128_load, v128_store,
};

/// Linear regression result
#[derive(Debug, Clone, PartialEq)]
pub struct RegressionResult {
    pub slope: f64,
    pub intercept: f64,
    pub r_squared: f64,
    pub residuals: Vec<f64>,
}

/// Linear regression coefficients (no residual allocation).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct RegressionCoeffs {
    pub slope: f64,
    pub intercept: f64,
    pub r_squared: f64,
}

/// Linear regression coefficients (f32, no residual allocation).
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct RegressionCoeffsF32 {
    pub slope: f32,
    pub intercept: f32,
    pub r_squared: f32,
}

#[inline(always)]
fn regression_invalid() -> RegressionCoeffs {
    RegressionCoeffs {
        slope: f64::NAN,
        intercept: f64::NAN,
        r_squared: f64::NAN,
    }
}

#[inline(always)]
fn regression_invalid_f32() -> RegressionCoeffsF32 {
    RegressionCoeffsF32 {
        slope: f32::NAN,
        intercept: f32::NAN,
        r_squared: f32::NAN,
    }
}

#[inline(always)]
fn regression_result_invalid() -> RegressionResult {
    RegressionResult {
        slope: f64::NAN,
        intercept: f64::NAN,
        r_squared: f64::NAN,
        residuals: vec![],
    }
}

#[inline(always)]
fn ranges_overlap(a_start: usize, a_len: usize, b_start: usize, b_len: usize) -> bool {
    // Half-open ranges: [start, start+len)
    let a_end = a_start.wrapping_add(a_len);
    let b_end = b_start.wrapping_add(b_len);
    a_start < b_end && b_start < a_end
}

/// Compute residuals into an output slice: `out[i] = y[i] - (slope*x[i] + intercept)`.
///
/// ## Safety / aliasing
/// - This function uses `unsafe` SIMD loads/stores with `read_unaligned`/`write_unaligned`
///   (alignment is not required).
/// - **`out` must not overlap** `x` or `y`. Overlap can lead to incorrect results.
#[inline(always)]
pub fn residuals_into(out: &mut [f64], x: &[f64], y: &[f64], slope: f64, intercept: f64) {
    debug_assert_eq!(out.len(), x.len());
    debug_assert_eq!(x.len(), y.len());
    debug_assert!(
        !ranges_overlap(
            out.as_ptr() as usize,
            size_of_val(out),
            x.as_ptr() as usize,
            size_of_val(x)
        ),
        "residuals_into: `out` must not overlap `x`"
    );
    debug_assert!(
        !ranges_overlap(
            out.as_ptr() as usize,
            size_of_val(out),
            y.as_ptr() as usize,
            size_of_val(y)
        ),
        "residuals_into: `out` must not overlap `y`"
    );

    #[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
    {
        return residuals_into_wasm128(out, x, y, slope, intercept);
    }

    #[cfg(not(all(target_arch = "wasm32", target_feature = "simd128")))]
    {
        let len = x.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;

        let slope_v = f64x4::splat(slope);
        let intercept_v = f64x4::splat(intercept);

        unsafe {
            let x_ptr = x.as_ptr() as *const f64x4;
            let y_ptr = y.as_ptr() as *const f64x4;
            let out_ptr = out.as_mut_ptr() as *mut f64x4;

            for i in 0..unrolled {
                let bx = x_ptr.add(i * 4);
                let by = y_ptr.add(i * 4);
                let bo = out_ptr.add(i * 4);

                bo.write_unaligned(
                    by.read_unaligned() - (bx.read_unaligned() * slope_v + intercept_v),
                );
                bo.add(1).write_unaligned(
                    by.add(1).read_unaligned()
                        - (bx.add(1).read_unaligned() * slope_v + intercept_v),
                );
                bo.add(2).write_unaligned(
                    by.add(2).read_unaligned()
                        - (bx.add(2).read_unaligned() * slope_v + intercept_v),
                );
                bo.add(3).write_unaligned(
                    by.add(3).read_unaligned()
                        - (bx.add(3).read_unaligned() * slope_v + intercept_v),
                );
            }

            for i in (unrolled * 4)..chunks {
                let xv = x_ptr.add(i).read_unaligned();
                let yv = y_ptr.add(i).read_unaligned();
                out_ptr
                    .add(i)
                    .write_unaligned(yv - (xv * slope_v + intercept_v));
            }
        }

        for i in (chunks * 4)..len {
            out[i] = y[i] - x[i].mul_add(slope, intercept);
        }
    }
}

/// Compute residuals into an output slice (f32): `out[i] = y[i] - (slope*x[i] + intercept)`.
///
/// ## Safety / aliasing
/// - This function uses `unsafe` SIMD loads/stores with `read_unaligned`/`write_unaligned`
///   (alignment is not required).
/// - **`out` must not overlap** `x` or `y`. Overlap can lead to incorrect results.
#[inline(always)]
pub fn residuals_into_f32(out: &mut [f32], x: &[f32], y: &[f32], slope: f32, intercept: f32) {
    debug_assert_eq!(out.len(), x.len());
    debug_assert_eq!(x.len(), y.len());
    debug_assert!(
        !ranges_overlap(
            out.as_ptr() as usize,
            size_of_val(out),
            x.as_ptr() as usize,
            size_of_val(x)
        ),
        "residuals_into_f32: `out` must not overlap `x`"
    );
    debug_assert!(
        !ranges_overlap(
            out.as_ptr() as usize,
            size_of_val(out),
            y.as_ptr() as usize,
            size_of_val(y)
        ),
        "residuals_into_f32: `out` must not overlap `y`"
    );

    #[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
    {
        return residuals_into_f32_wasm128(out, x, y, slope, intercept);
    }

    #[cfg(not(all(target_arch = "wasm32", target_feature = "simd128")))]
    {
        // wide::f32x4 path (portable SIMD)
        let len = x.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;

        let slope_v = f32x4::splat(slope);
        let intercept_v = f32x4::splat(intercept);

        unsafe {
            let x_ptr = x.as_ptr() as *const f32x4;
            let y_ptr = y.as_ptr() as *const f32x4;
            let out_ptr = out.as_mut_ptr() as *mut f32x4;

            for i in 0..unrolled {
                let bx = x_ptr.add(i * 4);
                let by = y_ptr.add(i * 4);
                let bo = out_ptr.add(i * 4);

                bo.write_unaligned(
                    by.read_unaligned() - (bx.read_unaligned() * slope_v + intercept_v),
                );
                bo.add(1).write_unaligned(
                    by.add(1).read_unaligned()
                        - (bx.add(1).read_unaligned() * slope_v + intercept_v),
                );
                bo.add(2).write_unaligned(
                    by.add(2).read_unaligned()
                        - (bx.add(2).read_unaligned() * slope_v + intercept_v),
                );
                bo.add(3).write_unaligned(
                    by.add(3).read_unaligned()
                        - (bx.add(3).read_unaligned() * slope_v + intercept_v),
                );
            }

            for i in (unrolled * 4)..chunks {
                let xv = x_ptr.add(i).read_unaligned();
                let yv = y_ptr.add(i).read_unaligned();
                out_ptr
                    .add(i)
                    .write_unaligned(yv - (xv * slope_v + intercept_v));
            }
        }

        for i in (chunks * 4)..len {
            out[i] = y[i] - x[i].mul_add(slope, intercept);
        }
    }
}

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
#[inline(always)]
fn residuals_into_f32_wasm128(out: &mut [f32], x: &[f32], y: &[f32], slope: f32, intercept: f32) {
    let len = x.len();
    let chunks = len / 4; // f32x4
    let unrolled = chunks / 4; // 16 elements per iter

    let slope_v = f32x4_splat(slope);
    let intercept_v = f32x4_splat(intercept);

    unsafe {
        let x_ptr = x.as_ptr();
        let y_ptr = y.as_ptr();
        let out_ptr = out.as_mut_ptr();

        for i in 0..unrolled {
            let base = i * 16;

            let xv0 = v128_load(x_ptr.add(base) as *const v128);
            let yv0 = v128_load(y_ptr.add(base) as *const v128);
            let xv1 = v128_load(x_ptr.add(base + 4) as *const v128);
            let yv1 = v128_load(y_ptr.add(base + 4) as *const v128);
            let xv2 = v128_load(x_ptr.add(base + 8) as *const v128);
            let yv2 = v128_load(y_ptr.add(base + 8) as *const v128);
            let xv3 = v128_load(x_ptr.add(base + 12) as *const v128);
            let yv3 = v128_load(y_ptr.add(base + 12) as *const v128);

            let r0 = f32x4_sub(yv0, f32x4_add(f32x4_mul(xv0, slope_v), intercept_v));
            let r1 = f32x4_sub(yv1, f32x4_add(f32x4_mul(xv1, slope_v), intercept_v));
            let r2 = f32x4_sub(yv2, f32x4_add(f32x4_mul(xv2, slope_v), intercept_v));
            let r3 = f32x4_sub(yv3, f32x4_add(f32x4_mul(xv3, slope_v), intercept_v));

            v128_store(out_ptr.add(base) as *mut v128, r0);
            v128_store(out_ptr.add(base + 4) as *mut v128, r1);
            v128_store(out_ptr.add(base + 8) as *mut v128, r2);
            v128_store(out_ptr.add(base + 12) as *mut v128, r3);
        }

        for i in (unrolled * 4)..chunks {
            let base = i * 4;
            let xv = v128_load(x_ptr.add(base) as *const v128);
            let yv = v128_load(y_ptr.add(base) as *const v128);
            let r = f32x4_sub(yv, f32x4_add(f32x4_mul(xv, slope_v), intercept_v));
            v128_store(out_ptr.add(base) as *mut v128, r);
        }
    }

    for i in (chunks * 4)..len {
        out[i] = y[i] - x[i].mul_add(slope, intercept);
    }
}

/// SIMD-optimized regression coefficients for f32 input.
/// On wasm32+simd128 uses f32x4; otherwise uses wide::f32x4.
pub fn regress_simd_coeffs_f32(x: &[f32], y: &[f32]) -> RegressionCoeffsF32 {
    if x.len() != y.len() || x.len() < 2 {
        return regression_invalid_f32();
    }

    #[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
    {
        return regress_simd_coeffs_f32_wasm128(x, y);
    }

    #[cfg(not(all(target_arch = "wasm32", target_feature = "simd128")))]
    {
        let len = x.len();
        let n = len as f32;
        let chunks = len / 4;
        let unrolled = chunks / 4;

        let mut sx = f32x4::splat(0.0);
        let mut sy = f32x4::splat(0.0);
        let mut sxx = f32x4::splat(0.0);
        let mut syy = f32x4::splat(0.0);
        let mut sxy = f32x4::splat(0.0);

        unsafe {
            let x_ptr = x.as_ptr() as *const f32x4;
            let y_ptr = y.as_ptr() as *const f32x4;

            for i in 0..unrolled {
                let bx = x_ptr.add(i * 4);
                let by = y_ptr.add(i * 4);

                let x0 = bx.read_unaligned();
                let y0 = by.read_unaligned();
                let x1 = bx.add(1).read_unaligned();
                let y1 = by.add(1).read_unaligned();
                let x2 = bx.add(2).read_unaligned();
                let y2 = by.add(2).read_unaligned();
                let x3 = bx.add(3).read_unaligned();
                let y3 = by.add(3).read_unaligned();

                sx += x0 + x1 + x2 + x3;
                sy += y0 + y1 + y2 + y3;
                sxx += x0 * x0 + x1 * x1 + x2 * x2 + x3 * x3;
                syy += y0 * y0 + y1 * y1 + y2 * y2 + y3 * y3;
                sxy += x0 * y0 + x1 * y1 + x2 * y2 + x3 * y3;
            }

            for i in (unrolled * 4)..chunks {
                let xv = x_ptr.add(i).read_unaligned();
                let yv = y_ptr.add(i).read_unaligned();
                sx += xv;
                sy += yv;
                sxx += xv * xv;
                syy += yv * yv;
                sxy += xv * yv;
            }
        }

        let sx_a = sx.to_array();
        let sy_a = sy.to_array();
        let sxx_a = sxx.to_array();
        let syy_a = syy.to_array();
        let sxy_a = sxy.to_array();

        let mut sum_x = sx_a[0] + sx_a[1] + sx_a[2] + sx_a[3];
        let mut sum_y = sy_a[0] + sy_a[1] + sy_a[2] + sy_a[3];
        let mut sum_xx = sxx_a[0] + sxx_a[1] + sxx_a[2] + sxx_a[3];
        let mut sum_yy = syy_a[0] + syy_a[1] + syy_a[2] + syy_a[3];
        let mut sum_xy = sxy_a[0] + sxy_a[1] + sxy_a[2] + sxy_a[3];

        for i in (chunks * 4)..len {
            let xi = x[i];
            let yi = y[i];
            sum_x += xi;
            sum_y += yi;
            sum_xx = xi.mul_add(xi, sum_xx);
            sum_yy = yi.mul_add(yi, sum_yy);
            sum_xy = xi.mul_add(yi, sum_xy);
        }

        let numerator = n.mul_add(sum_xy, -(sum_x * sum_y));
        let denom_x = n.mul_add(sum_xx, -(sum_x * sum_x));
        if denom_x <= 0.0 || denom_x.is_nan() {
            return regression_invalid_f32();
        }

        let slope = numerator / denom_x;
        let intercept = (sum_y - slope * sum_x) / n;

        let denom_y = n.mul_add(sum_yy, -(sum_y * sum_y));
        let r_squared = if denom_y > 0.0 && !denom_y.is_nan() {
            (numerator * numerator) / (denom_x * denom_y)
        } else {
            f32::NAN
        };

        RegressionCoeffsF32 {
            slope,
            intercept,
            r_squared,
        }
    }
}

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
#[inline(always)]
fn regress_simd_coeffs_f32_wasm128(x: &[f32], y: &[f32]) -> RegressionCoeffsF32 {
    let len = x.len();
    let n = len as f32;
    let chunks = len / 4;
    let unrolled = chunks / 4; // 16 elements per iter

    let mut sx: v128 = f32x4_splat(0.0);
    let mut sy: v128 = f32x4_splat(0.0);
    let mut sxx: v128 = f32x4_splat(0.0);
    let mut syy: v128 = f32x4_splat(0.0);
    let mut sxy: v128 = f32x4_splat(0.0);

    unsafe {
        let x_ptr = x.as_ptr();
        let y_ptr = y.as_ptr();

        for i in 0..unrolled {
            let base = i * 16;
            let xv0 = v128_load(x_ptr.add(base) as *const v128);
            let yv0 = v128_load(y_ptr.add(base) as *const v128);
            let xv1 = v128_load(x_ptr.add(base + 4) as *const v128);
            let yv1 = v128_load(y_ptr.add(base + 4) as *const v128);
            let xv2 = v128_load(x_ptr.add(base + 8) as *const v128);
            let yv2 = v128_load(y_ptr.add(base + 8) as *const v128);
            let xv3 = v128_load(x_ptr.add(base + 12) as *const v128);
            let yv3 = v128_load(y_ptr.add(base + 12) as *const v128);

            sx = f32x4_add(sx, f32x4_add(xv0, f32x4_add(xv1, f32x4_add(xv2, xv3))));
            sy = f32x4_add(sy, f32x4_add(yv0, f32x4_add(yv1, f32x4_add(yv2, yv3))));

            sxx = f32x4_add(
                sxx,
                f32x4_add(
                    f32x4_mul(xv0, xv0),
                    f32x4_add(
                        f32x4_mul(xv1, xv1),
                        f32x4_add(f32x4_mul(xv2, xv2), f32x4_mul(xv3, xv3)),
                    ),
                ),
            );
            syy = f32x4_add(
                syy,
                f32x4_add(
                    f32x4_mul(yv0, yv0),
                    f32x4_add(
                        f32x4_mul(yv1, yv1),
                        f32x4_add(f32x4_mul(yv2, yv2), f32x4_mul(yv3, yv3)),
                    ),
                ),
            );
            sxy = f32x4_add(
                sxy,
                f32x4_add(
                    f32x4_mul(xv0, yv0),
                    f32x4_add(
                        f32x4_mul(xv1, yv1),
                        f32x4_add(f32x4_mul(xv2, yv2), f32x4_mul(xv3, yv3)),
                    ),
                ),
            );
        }

        for i in (unrolled * 4)..chunks {
            let base = i * 4;
            let xv = v128_load(x_ptr.add(base) as *const v128);
            let yv = v128_load(y_ptr.add(base) as *const v128);
            sx = f32x4_add(sx, xv);
            sy = f32x4_add(sy, yv);
            sxx = f32x4_add(sxx, f32x4_mul(xv, xv));
            syy = f32x4_add(syy, f32x4_mul(yv, yv));
            sxy = f32x4_add(sxy, f32x4_mul(xv, yv));
        }
    }

    let mut sum_x = f32x4_extract_lane::<0>(sx)
        + f32x4_extract_lane::<1>(sx)
        + f32x4_extract_lane::<2>(sx)
        + f32x4_extract_lane::<3>(sx);
    let mut sum_y = f32x4_extract_lane::<0>(sy)
        + f32x4_extract_lane::<1>(sy)
        + f32x4_extract_lane::<2>(sy)
        + f32x4_extract_lane::<3>(sy);
    let mut sum_xx = f32x4_extract_lane::<0>(sxx)
        + f32x4_extract_lane::<1>(sxx)
        + f32x4_extract_lane::<2>(sxx)
        + f32x4_extract_lane::<3>(sxx);
    let mut sum_yy = f32x4_extract_lane::<0>(syy)
        + f32x4_extract_lane::<1>(syy)
        + f32x4_extract_lane::<2>(syy)
        + f32x4_extract_lane::<3>(syy);
    let mut sum_xy = f32x4_extract_lane::<0>(sxy)
        + f32x4_extract_lane::<1>(sxy)
        + f32x4_extract_lane::<2>(sxy)
        + f32x4_extract_lane::<3>(sxy);

    for i in (chunks * 4)..len {
        let xi = x[i];
        let yi = y[i];
        sum_x += xi;
        sum_y += yi;
        sum_xx = xi.mul_add(xi, sum_xx);
        sum_yy = yi.mul_add(yi, sum_yy);
        sum_xy = xi.mul_add(yi, sum_xy);
    }

    let numerator = n.mul_add(sum_xy, -(sum_x * sum_y));
    let denom_x = n.mul_add(sum_xx, -(sum_x * sum_x));
    if denom_x <= 0.0 || denom_x.is_nan() {
        return regression_invalid_f32();
    }

    let slope = numerator / denom_x;
    let intercept = (sum_y - slope * sum_x) / n;

    let denom_y = n.mul_add(sum_yy, -(sum_y * sum_y));
    let r_squared = if denom_y > 0.0 && !denom_y.is_nan() {
        (numerator * numerator) / (denom_x * denom_y)
    } else {
        f32::NAN
    };

    RegressionCoeffsF32 {
        slope,
        intercept,
        r_squared,
    }
}

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
#[inline(always)]
fn residuals_into_wasm128(out: &mut [f64], x: &[f64], y: &[f64], slope: f64, intercept: f64) {
    let len = x.len();
    let chunks = len / 2; // f64x2
    let unrolled = chunks / 4; // 8 elements per iter

    let slope_v = f64x2_splat(slope);
    let intercept_v = f64x2_splat(intercept);

    unsafe {
        let x_ptr = x.as_ptr();
        let y_ptr = y.as_ptr();
        let out_ptr = out.as_mut_ptr();

        for i in 0..unrolled {
            let base = i * 8;

            let xv0 = v128_load(x_ptr.add(base) as *const v128);
            let yv0 = v128_load(y_ptr.add(base) as *const v128);
            let xv1 = v128_load(x_ptr.add(base + 2) as *const v128);
            let yv1 = v128_load(y_ptr.add(base + 2) as *const v128);
            let xv2 = v128_load(x_ptr.add(base + 4) as *const v128);
            let yv2 = v128_load(y_ptr.add(base + 4) as *const v128);
            let xv3 = v128_load(x_ptr.add(base + 6) as *const v128);
            let yv3 = v128_load(y_ptr.add(base + 6) as *const v128);

            let r0 = f64x2_sub(yv0, f64x2_add(f64x2_mul(xv0, slope_v), intercept_v));
            let r1 = f64x2_sub(yv1, f64x2_add(f64x2_mul(xv1, slope_v), intercept_v));
            let r2 = f64x2_sub(yv2, f64x2_add(f64x2_mul(xv2, slope_v), intercept_v));
            let r3 = f64x2_sub(yv3, f64x2_add(f64x2_mul(xv3, slope_v), intercept_v));

            v128_store(out_ptr.add(base) as *mut v128, r0);
            v128_store(out_ptr.add(base + 2) as *mut v128, r1);
            v128_store(out_ptr.add(base + 4) as *mut v128, r2);
            v128_store(out_ptr.add(base + 6) as *mut v128, r3);
        }

        for i in (unrolled * 4)..chunks {
            let base = i * 2;
            let xv = v128_load(x_ptr.add(base) as *const v128);
            let yv = v128_load(y_ptr.add(base) as *const v128);
            let r = f64x2_sub(yv, f64x2_add(f64x2_mul(xv, slope_v), intercept_v));
            v128_store(out_ptr.add(base) as *mut v128, r);
        }
    }

    for i in (chunks * 2)..len {
        out[i] = y[i] - x[i].mul_add(slope, intercept);
    }
}

/// Naive linear regression implementation (scalar, multi-pass).
/// Intentionally non-optimized for performance comparison.
pub fn regress_naive_coeffs(x: &[f64], y: &[f64]) -> RegressionCoeffs {
    if x.len() != y.len() || x.len() < 2 {
        return regression_invalid();
    }

    // Pass 1: Compute means (scalar)
    let n = x.len() as f64;
    let mut sum_x = 0.0;
    let mut sum_y = 0.0;
    for i in 0..x.len() {
        sum_x += x[i];
        sum_y += y[i];
    }
    let x_mean = sum_x / n;
    let y_mean = sum_y / n;

    // Pass 2: Compute slope numerator and denominator (scalar, centered)
    let mut num = 0.0;
    let mut den = 0.0;
    for i in 0..x.len() {
        let dx = x[i] - x_mean;
        let dy = y[i] - y_mean;
        num = dx.mul_add(dy, num);
        den = dx.mul_add(dx, den);
    }

    if den == 0.0 || den.is_nan() {
        return regression_invalid();
    }

    let slope = num / den;
    let intercept = y_mean - slope * x_mean;

    // Pass 3: Compute R² via sum of squares (scalar)
    let mut ss_res = 0.0;
    let mut ss_tot = 0.0;
    for i in 0..x.len() {
        let y_pred = x[i].mul_add(slope, intercept);
        let residual = y[i] - y_pred;
        ss_res = residual.mul_add(residual, ss_res);
        let dy = y[i] - y_mean;
        ss_tot = dy.mul_add(dy, ss_tot);
    }

    let r_squared = if ss_tot > 0.0 && !ss_tot.is_nan() {
        1.0 - (ss_res / ss_tot)
    } else {
        f64::NAN
    };

    RegressionCoeffs {
        slope,
        intercept,
        r_squared,
    }
}

pub fn regress_naive(x: &[f64], y: &[f64]) -> RegressionResult {
    let coeffs = regress_naive_coeffs(x, y);
    if coeffs.slope.is_nan() {
        return regression_result_invalid();
    }

    let mut residuals = vec![0.0; x.len()];
    residuals_into(&mut residuals, x, y, coeffs.slope, coeffs.intercept);

    RegressionResult {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
        residuals,
    }
}

/// SIMD-optimized linear regression (fused sums, single-pass for statistics).
/// Uses the same SIMD pattern as corrcoeff for maximum efficiency.
pub fn regress_simd_coeffs(x: &[f64], y: &[f64]) -> RegressionCoeffs {
    if x.len() != y.len() || x.len() < 2 {
        return regression_invalid();
    }

    #[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
    {
        return regress_simd_coeffs_wasm128(x, y);
    }

    #[cfg(not(all(target_arch = "wasm32", target_feature = "simd128")))]
    {
        let len = x.len();
        let n = len as f64;
        let chunks = len / 4;
        let unrolled = chunks / 4;

        // Single-pass SIMD accumulation of all needed sums
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

                let x1 = bx.read_unaligned();
                let y1 = by.read_unaligned();
                let x2 = bx.add(1).read_unaligned();
                let y2 = by.add(1).read_unaligned();
                let x3 = bx.add(2).read_unaligned();
                let y3 = by.add(2).read_unaligned();
                let x4 = bx.add(3).read_unaligned();
                let y4 = by.add(3).read_unaligned();

                sx.v1 += x1;
                sy.v1 += y1;
                sxx.v1 += x1 * x1;
                syy.v1 += y1 * y1;
                sxy.v1 += x1 * y1;

                sx.v2 += x2;
                sy.v2 += y2;
                sxx.v2 += x2 * x2;
                syy.v2 += y2 * y2;
                sxy.v2 += x2 * y2;

                sx.v3 += x3;
                sy.v3 += y3;
                sxx.v3 += x3 * x3;
                syy.v3 += y3 * y3;
                sxy.v3 += x3 * y3;

                sx.v4 += x4;
                sy.v4 += y4;
                sxx.v4 += x4 * x4;
                syy.v4 += y4 * y4;
                sxy.v4 += x4 * y4;
            }

            for i in (unrolled * 4)..chunks {
                let xv = x_ptr.add(i).read_unaligned();
                let yv = y_ptr.add(i).read_unaligned();
                sx.v1 += xv;
                sy.v1 += yv;
                sxx.v1 += xv * xv;
                syy.v1 += yv * yv;
                sxy.v1 += xv * yv;
            }
        }

        let mut sum_x = sx.reduce_add();
        let mut sum_y = sy.reduce_add();
        let mut sum_xx = sxx.reduce_add();
        let mut sum_yy = syy.reduce_add();
        let mut sum_xy = sxy.reduce_add();

        // Handle remaining elements
        for i in (chunks * 4)..len {
            let xi = x[i];
            let yi = y[i];
            sum_x += xi;
            sum_y += yi;
            sum_xx = xi.mul_add(xi, sum_xx);
            sum_yy = yi.mul_add(yi, sum_yy);
            sum_xy = xi.mul_add(yi, sum_xy);
        }

        // Compute slope and intercept using closed-form OLS
        let numerator = n * sum_xy - sum_x * sum_y;
        let denom_x = n * sum_xx - sum_x * sum_x;

        if denom_x <= 0.0 || denom_x.is_nan() {
            return regression_invalid();
        }

        let slope = numerator / denom_x;
        let intercept = (sum_y - slope * sum_x) / n;

        // Compute R² from the same sums (no need for corrcoeff)
        let denom_y = n * sum_yy - sum_y * sum_y;
        let r_squared = if denom_y > 0.0 && !denom_y.is_nan() {
            (numerator * numerator) / (denom_x * denom_y)
        } else {
            f64::NAN
        };

        RegressionCoeffs {
            slope,
            intercept,
            r_squared,
        }
    }
}

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
#[inline(always)]
fn regress_simd_coeffs_wasm128(x: &[f64], y: &[f64]) -> RegressionCoeffs {
    let len = x.len();
    let n = len as f64;
    let chunks = len / 2; // f64x2
    let unrolled = chunks / 4; // 8 elements per iter

    // Two accumulators per sum to reduce dependency chains.
    let mut sx0: v128 = f64x2_splat(0.0);
    let mut sx1: v128 = f64x2_splat(0.0);
    let mut sy0: v128 = f64x2_splat(0.0);
    let mut sy1: v128 = f64x2_splat(0.0);
    let mut sxx0: v128 = f64x2_splat(0.0);
    let mut sxx1: v128 = f64x2_splat(0.0);
    let mut syy0: v128 = f64x2_splat(0.0);
    let mut syy1: v128 = f64x2_splat(0.0);
    let mut sxy0: v128 = f64x2_splat(0.0);
    let mut sxy1: v128 = f64x2_splat(0.0);

    unsafe {
        let x_ptr = x.as_ptr();
        let y_ptr = y.as_ptr();

        for i in 0..unrolled {
            let base = i * 8;

            let xv0 = v128_load(x_ptr.add(base) as *const v128);
            let yv0 = v128_load(y_ptr.add(base) as *const v128);
            let xv1 = v128_load(x_ptr.add(base + 2) as *const v128);
            let yv1 = v128_load(y_ptr.add(base + 2) as *const v128);
            let xv2 = v128_load(x_ptr.add(base + 4) as *const v128);
            let yv2 = v128_load(y_ptr.add(base + 4) as *const v128);
            let xv3 = v128_load(x_ptr.add(base + 6) as *const v128);
            let yv3 = v128_load(y_ptr.add(base + 6) as *const v128);

            // Interleave updates across 2 accumulators.
            sx0 = f64x2_add(sx0, xv0);
            sy0 = f64x2_add(sy0, yv0);
            sxx0 = f64x2_add(sxx0, f64x2_mul(xv0, xv0));
            syy0 = f64x2_add(syy0, f64x2_mul(yv0, yv0));
            sxy0 = f64x2_add(sxy0, f64x2_mul(xv0, yv0));

            sx1 = f64x2_add(sx1, xv1);
            sy1 = f64x2_add(sy1, yv1);
            sxx1 = f64x2_add(sxx1, f64x2_mul(xv1, xv1));
            syy1 = f64x2_add(syy1, f64x2_mul(yv1, yv1));
            sxy1 = f64x2_add(sxy1, f64x2_mul(xv1, yv1));

            sx0 = f64x2_add(sx0, xv2);
            sy0 = f64x2_add(sy0, yv2);
            sxx0 = f64x2_add(sxx0, f64x2_mul(xv2, xv2));
            syy0 = f64x2_add(syy0, f64x2_mul(yv2, yv2));
            sxy0 = f64x2_add(sxy0, f64x2_mul(xv2, yv2));

            sx1 = f64x2_add(sx1, xv3);
            sy1 = f64x2_add(sy1, yv3);
            sxx1 = f64x2_add(sxx1, f64x2_mul(xv3, xv3));
            syy1 = f64x2_add(syy1, f64x2_mul(yv3, yv3));
            sxy1 = f64x2_add(sxy1, f64x2_mul(xv3, yv3));
        }

        let mut sx = f64x2_add(sx0, sx1);
        let mut sy = f64x2_add(sy0, sy1);
        let mut sxx = f64x2_add(sxx0, sxx1);
        let mut syy = f64x2_add(syy0, syy1);
        let mut sxy = f64x2_add(sxy0, sxy1);

        for i in (unrolled * 4)..chunks {
            let base = i * 2;
            let xv = v128_load(x_ptr.add(base) as *const v128);
            let yv = v128_load(y_ptr.add(base) as *const v128);
            sx = f64x2_add(sx, xv);
            sy = f64x2_add(sy, yv);
            sxx = f64x2_add(sxx, f64x2_mul(xv, xv));
            syy = f64x2_add(syy, f64x2_mul(yv, yv));
            sxy = f64x2_add(sxy, f64x2_mul(xv, yv));
        }
        // write back combined accumulators to outer scope by shadowing vars below

        let mut sum_x = f64x2_extract_lane::<0>(sx) + f64x2_extract_lane::<1>(sx);
        let mut sum_y = f64x2_extract_lane::<0>(sy) + f64x2_extract_lane::<1>(sy);
        let mut sum_xx = f64x2_extract_lane::<0>(sxx) + f64x2_extract_lane::<1>(sxx);
        let mut sum_yy = f64x2_extract_lane::<0>(syy) + f64x2_extract_lane::<1>(syy);
        let mut sum_xy = f64x2_extract_lane::<0>(sxy) + f64x2_extract_lane::<1>(sxy);

        for i in (chunks * 2)..len {
            let xi = x[i];
            let yi = y[i];
            sum_x += xi;
            sum_y += yi;
            sum_xx = xi.mul_add(xi, sum_xx);
            sum_yy = yi.mul_add(yi, sum_yy);
            sum_xy = xi.mul_add(yi, sum_xy);
        }

        let numerator = n * sum_xy - sum_x * sum_y;
        let denom_x = n * sum_xx - sum_x * sum_x;
        if denom_x <= 0.0 || denom_x.is_nan() {
            return regression_invalid();
        }

        let slope = numerator / denom_x;
        let intercept = (sum_y - slope * sum_x) / n;

        let denom_y = n * sum_yy - sum_y * sum_y;
        let r_squared = if denom_y > 0.0 && !denom_y.is_nan() {
            (numerator * numerator) / (denom_x * denom_y)
        } else {
            f64::NAN
        };

        return RegressionCoeffs {
            slope,
            intercept,
            r_squared,
        };
    }
}

pub fn regress_simd(x: &[f64], y: &[f64]) -> RegressionResult {
    let coeffs = regress_simd_coeffs(x, y);
    if coeffs.slope.is_nan() {
        return regression_result_invalid();
    }

    let mut residuals = vec![0.0; x.len()];
    residuals_into(&mut residuals, x, y, coeffs.slope, coeffs.intercept);

    RegressionResult {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
        residuals,
    }
}

/// BLAS-like kernels-based linear regression.
/// Uses minimal kernel operations (dot product, sum, axpy-style residuals).
pub fn regress_kernels_coeffs(x: &[f64], y: &[f64]) -> RegressionCoeffs {
    if x.len() != y.len() || x.len() < 2 {
        return regression_invalid();
    }

    let n = x.len() as f64;

    // Kernel 1: Dot products and sums (SIMD inside sum/dot_product)
    let sum_x = sum(x);
    let sum_y = sum(y);
    let sum_xx = dot_product(x, x);
    let sum_yy = dot_product(y, y);
    let sum_xy = dot_product(x, y);

    let numerator = n * sum_xy - sum_x * sum_y;
    let denom_x = n * sum_xx - sum_x * sum_x;
    if denom_x <= 0.0 || denom_x.is_nan() {
        return regression_invalid();
    }

    let slope = numerator / denom_x;
    let intercept = (sum_y - slope * sum_x) / n;

    let denom_y = n * sum_yy - sum_y * sum_y;
    let r_squared = if denom_y > 0.0 && !denom_y.is_nan() {
        (numerator * numerator) / (denom_x * denom_y)
    } else {
        f64::NAN
    };

    RegressionCoeffs {
        slope,
        intercept,
        r_squared,
    }
}

pub fn regress_kernels(x: &[f64], y: &[f64]) -> RegressionResult {
    let coeffs = regress_kernels_coeffs(x, y);
    if coeffs.slope.is_nan() {
        return regression_result_invalid();
    }

    let mut residuals = vec![0.0; x.len()];
    residuals_into(&mut residuals, x, y, coeffs.slope, coeffs.intercept);

    RegressionResult {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
        residuals,
    }
}

/// Helper: dot product of two slices (uses SIMD internally)
#[inline(always)]
fn dot_product(a: &[f64], b: &[f64]) -> f64 {
    if a.len() != b.len() {
        return f64::NAN;
    }
    // Use SIMD-optimized sum for the element-wise products
    // This is a kernel operation - compute products then sum with SIMD
    let len = a.len();
    let chunks = len / 4;
    let unrolled = chunks / 4;

    let mut acc = SimdAccum4::zero();

    unsafe {
        let a_ptr = a.as_ptr() as *const f64x4;
        let b_ptr = b.as_ptr() as *const f64x4;

        for i in 0..unrolled {
            let ba = a_ptr.add(i * 4);
            let bb = b_ptr.add(i * 4);

            acc.v1 += ba.read_unaligned() * bb.read_unaligned();
            acc.v2 += ba.add(1).read_unaligned() * bb.add(1).read_unaligned();
            acc.v3 += ba.add(2).read_unaligned() * bb.add(2).read_unaligned();
            acc.v4 += ba.add(3).read_unaligned() * bb.add(3).read_unaligned();
        }

        for i in (unrolled * 4)..chunks {
            acc.v1 += a_ptr.add(i).read_unaligned() * b_ptr.add(i).read_unaligned();
        }
    }

    let mut result = acc.reduce_add();

    for i in (chunks * 4)..len {
        result = a[i].mul_add(b[i], result);
    }

    result
}

/// Simple linear regression: y = slope * x + intercept
///
/// Returns regression coefficients, R², and residuals.
/// This is an alias for regress_simd (the optimized default).
pub fn regress(x: &[f64], y: &[f64]) -> RegressionResult {
    regress_simd(x, y)
}



