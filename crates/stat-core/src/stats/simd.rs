use wide::f64x4;

#[cfg(all(target_arch = "wasm32", target_feature = "simd128"))]
use core::arch::wasm32::{
    f32x4_add, f32x4_extract_lane, f32x4_mul, f32x4_splat, f32x4_sub, f64x2_add,
    f64x2_extract_lane, f64x2_mul, f64x2_splat, f64x2_sub, v128, v128_load, v128_store,
};

// =============================================================================
// SIMD Infrastructure
// =============================================================================

/// SIMD loop state with 4 accumulators for dependency-chain breaking.
#[derive(Clone, Copy)]
pub(crate) struct SimdAccum4 {
    pub(crate) v1: f64x4,
    pub(crate) v2: f64x4,
    pub(crate) v3: f64x4,
    pub(crate) v4: f64x4,
}

impl SimdAccum4 {
    #[inline(always)]
    pub(crate) fn new(init: f64x4) -> Self {
        Self {
            v1: init,
            v2: init,
            v3: init,
            v4: init,
        }
    }

    #[inline(always)]
    pub(crate) fn zero() -> Self {
        Self::new(f64x4::ZERO)
    }

    #[inline(always)]
    pub(crate) fn reduce_add(self) -> f64 {
        ((self.v1 + self.v2) + (self.v3 + self.v4)).reduce_add()
    }

    #[inline(always)]
    pub(crate) fn reduce_min(self) -> f64 {
        simd_reduce_min(self.v1.min(self.v2).min(self.v3.min(self.v4)))
    }

    #[inline(always)]
    pub(crate) fn reduce_max(self) -> f64 {
        simd_reduce_max(self.v1.max(self.v2).max(self.v3.max(self.v4)))
    }
}

#[inline(always)]
pub(crate) fn simd_reduce_min(vec: f64x4) -> f64 {
    let arr = vec.to_array();
    arr[0].min(arr[1]).min(arr[2].min(arr[3]))
}

#[inline(always)]
pub(crate) fn simd_reduce_max(vec: f64x4) -> f64 {
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
                {
                    let $acc = &mut acc.v1;
                    let $chunk = base.read_unaligned();
                    $body;
                }
                {
                    let $acc = &mut acc.v2;
                    let $chunk = base.add(1).read_unaligned();
                    $body;
                }
                {
                    let $acc = &mut acc.v3;
                    let $chunk = base.add(2).read_unaligned();
                    $body;
                }
                {
                    let $acc = &mut acc.v4;
                    let $chunk = base.add(3).read_unaligned();
                    $body;
                }
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
                {
                    let $acc = &mut acc.v1;
                    let $chunk = base.read_unaligned();
                    let $cv = const_vec;
                    $body;
                }
                {
                    let $acc = &mut acc.v2;
                    let $chunk = base.add(1).read_unaligned();
                    let $cv = const_vec;
                    $body;
                }
                {
                    let $acc = &mut acc.v3;
                    let $chunk = base.add(2).read_unaligned();
                    let $cv = const_vec;
                    $body;
                }
                {
                    let $acc = &mut acc.v4;
                    let $chunk = base.add(3).read_unaligned();
                    let $cv = const_vec;
                    $body;
                }
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

/// Iterate a `&[f64]` as `f64x4` with 4× unrolling and a scalar tail.
///
/// This is a building block for performance-sensitive routines that need custom
/// accumulation logic beyond a single reduction.
macro_rules! simd_for_each_unrolled4_f64x4 {
    ($data:expr, |$base:ident| $unrolled_body:expr, |$chunk:ident| $chunk_body:expr, |$val:ident| $tail_body:expr) => {{
        let data: &[f64] = $data;
        let len = data.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;

        unsafe {
            let ptr = data.as_ptr() as *const f64x4;

            for i in 0..unrolled {
                let $base = ptr.add(i * 4);
                $unrolled_body;
            }

            for i in (unrolled * 4)..chunks {
                let $chunk = ptr.add(i).read_unaligned();
                $chunk_body;
            }
        }

        for &$val in &data[(chunks * 4)..] {
            $tail_body;
        }
    }};
}

/// Iterate two equally-sized `&[f64]` slices as zipped `f64x4` with 4× unrolling and a scalar tail.
macro_rules! simd_for_each_unrolled4_f64x4_zip {
    ($x:expr, $y:expr, |$bx:ident, $by:ident| $unrolled_body:expr, |$xv:ident, $yv:ident| $chunk_body:expr, |$xs:ident, $ys:ident| $tail_body:expr) => {{
        let x: &[f64] = $x;
        let y: &[f64] = $y;
        let len = x.len();
        let chunks = len / 4;
        let unrolled = chunks / 4;

        unsafe {
            let x_ptr = x.as_ptr() as *const f64x4;
            let y_ptr = y.as_ptr() as *const f64x4;

            for i in 0..unrolled {
                let $bx = x_ptr.add(i * 4);
                let $by = y_ptr.add(i * 4);
                $unrolled_body;
            }

            for i in (unrolled * 4)..chunks {
                let $xv = x_ptr.add(i).read_unaligned();
                let $yv = y_ptr.add(i).read_unaligned();
                $chunk_body;
            }
        }

        for i in (chunks * 4)..len {
            let $xs = x[i];
            let $ys = y[i];
            $tail_body;
        }
    }};
}
