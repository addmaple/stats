#![allow(clippy::missing_safety_doc, clippy::needless_range_loop)]
#![allow(clippy::not_unsafe_ptr_arg_deref, dead_code)]

use std::alloc::{alloc, dealloc, Layout};
use std::mem;

#[no_mangle]
pub unsafe extern "C" fn alloc_bytes(len: usize) -> *mut u8 {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    alloc(layout)
}

#[no_mangle]
pub unsafe extern "C" fn free_bytes(ptr: *mut u8, len: usize) {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    dealloc(ptr, layout);
}

#[no_mangle]
pub unsafe extern "C" fn alloc_f64(len: usize) -> *mut f64 {
    alloc_bytes(len * 8) as *mut f64
}
#[no_mangle]
pub unsafe extern "C" fn free_f64(ptr: *mut f64, len: usize) {
    free_bytes(ptr as *mut u8, len * 8);
}

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

#[no_mangle]
pub unsafe extern "C" fn sum_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::sum(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn mean_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::mean(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn variance_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::variance(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn sample_variance_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::sample_variance(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn stdev_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::stdev(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn sample_stdev_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::sample_stdev(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn min_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::min(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn max_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::max(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn product_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::product(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn range_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::range(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn median_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::median(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn mode_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::mode(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn geomean_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::geomean(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn skewness_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::skewness(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn kurtosis_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::kurtosis(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn coeffvar_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::coeffvar(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn meandev_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::meandev(slice_from(ptr, len))
}
#[no_mangle]
pub unsafe extern "C" fn meddev_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::meddev(slice_from(ptr, len))
}

#[no_mangle]
pub unsafe extern "C" fn cumsum_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    let result = stat_core::cumsum(slice_from(ptr, len));
    slice_from_mut(out_ptr, len).copy_from_slice(&result);
    len as isize
}
#[no_mangle]
pub unsafe extern "C" fn cumprod_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    let result = stat_core::cumprod(slice_from(ptr, len));
    slice_from_mut(out_ptr, len).copy_from_slice(&result);
    len as isize
}
#[no_mangle]
pub unsafe extern "C" fn diff_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    if len < 1 {
        return 0;
    }
    let result = stat_core::diff(slice_from(ptr, len));
    slice_from_mut(out_ptr, len - 1).copy_from_slice(&result);
    (len - 1) as isize
}
#[no_mangle]
pub unsafe extern "C" fn rank_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    let result = stat_core::rank(slice_from(ptr, len));
    slice_from_mut(out_ptr, len).copy_from_slice(&result);
    len as isize
}
#[no_mangle]
pub unsafe extern "C" fn deviation_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    let result = stat_core::deviation(slice_from(ptr, len));
    slice_from_mut(out_ptr, len).copy_from_slice(&result);
    len as isize
}

#[no_mangle]
pub unsafe extern "C" fn pooledvariance_f64(
    d1p: *const f64,
    d1l: usize,
    d2p: *const f64,
    d2l: usize,
) -> f64 {
    stat_core::pooledvariance(slice_from(d1p, d1l), slice_from(d2p, d2l))
}
#[no_mangle]
pub unsafe extern "C" fn pooledstdev_f64(
    d1p: *const f64,
    d1l: usize,
    d2p: *const f64,
    d2l: usize,
) -> f64 {
    stat_core::pooledstdev(slice_from(d1p, d1l), slice_from(d2p, d2l))
}
#[no_mangle]
pub unsafe extern "C" fn stan_moment_f64(ptr: *const f64, len: usize, k: usize) -> f64 {
    stat_core::stan_moment(slice_from(ptr, len), k)
}

#[no_mangle]
pub unsafe extern "C" fn histogram_f64(
    ptr: *const f64,
    len: usize,
    bc: usize,
    out_ptr: *mut f64,
) -> isize {
    let bins = stat_core::histogram(slice_from(ptr, len), bc);
    let out = slice_from_mut(out_ptr, bc);
    for i in 0..bc {
        out[i] = bins[i] as f64;
    }
    bc as isize
}
