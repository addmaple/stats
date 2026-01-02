use crate::stats::simd::SimdAccum4;
use wide::f64x4;

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
        |acc, val| if val < *acc {
            *acc = val
        },
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
        |acc, val| if val > *acc {
            *acc = val
        },
        SimdAccum4::reduce_max
    )
}

/// Calculate min and max in a single pass.
pub(crate) fn minmax(data: &[f64]) -> (f64, f64) {
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
        if value < min_val {
            min_val = value;
        }
        if value > max_val {
            max_val = value;
        }
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
