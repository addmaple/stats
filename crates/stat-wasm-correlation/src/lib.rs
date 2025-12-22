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

#[no_mangle] pub unsafe extern "C" fn alloc_f64(len: usize) -> *mut f64 { alloc_bytes(len * 8) as *mut f64 }
#[no_mangle] pub unsafe extern "C" fn free_f64(ptr: *mut f64, len: usize) { free_bytes(ptr as *mut u8, len * 8); }

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

#[no_mangle] pub unsafe extern "C" fn covariance_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::covariance(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }
#[no_mangle] pub unsafe extern "C" fn corrcoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::corrcoeff(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }
#[no_mangle] pub unsafe extern "C" fn spearmancoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::spearmancoeff(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }
