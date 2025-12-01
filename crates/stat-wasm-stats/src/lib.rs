#![allow(clippy::not_unsafe_ptr_arg_deref, dead_code)]

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct ArrayResult {
    ptr: usize,
    len: usize,
}

#[wasm_bindgen]
impl ArrayResult {
    #[wasm_bindgen(getter)]
    pub fn ptr(&self) -> usize {
        self.ptr
    }

    #[wasm_bindgen(getter)]
    pub fn len(&self) -> usize {
        self.len
    }

    #[wasm_bindgen(getter)]
    pub fn is_empty(&self) -> bool {
        self.len == 0
    }
}

fn vec_to_array_result(mut data: Vec<f64>) -> ArrayResult {
    let len = data.len();
    let ptr = data.as_mut_ptr() as usize;
    std::mem::forget(data);
    ArrayResult { ptr, len }
}

// Export memory for typed array views
#[wasm_bindgen]
pub fn get_memory() -> JsValue {
    wasm_bindgen::memory()
}

// Memory allocation helpers
#[wasm_bindgen]
pub fn alloc_f64(len: usize) -> *mut f64 {
    let mut vec = Vec::<f64>::with_capacity(len);
    let ptr = vec.as_mut_ptr();
    std::mem::forget(vec);
    ptr
}

#[wasm_bindgen]
pub fn free_f64(ptr: *mut f64, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, len, len);
    }
}

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

// Basic statistics functions
#[wasm_bindgen]
pub fn sum_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::sum(data)
}

#[wasm_bindgen]
pub fn mean_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::mean(data)
}

#[wasm_bindgen]
pub fn variance_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::variance(data)
}

#[wasm_bindgen]
pub fn sample_variance_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::sample_variance(data)
}

#[wasm_bindgen]
pub fn stdev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::stdev(data)
}

#[wasm_bindgen]
pub fn sample_stdev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::sample_stdev(data)
}

#[wasm_bindgen]
pub fn coeffvar_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::coeffvar(data)
}

#[wasm_bindgen]
pub fn min_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::min(data)
}

#[wasm_bindgen]
pub fn max_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::max(data)
}

#[wasm_bindgen]
pub fn product_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::product(data)
}

#[wasm_bindgen]
pub fn range_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::range(data)
}

#[wasm_bindgen]
pub fn median_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::median(data)
}

#[wasm_bindgen]
pub fn mode_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::mode(data)
}

#[wasm_bindgen]
pub fn geomean_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::geomean(data)
}

#[wasm_bindgen]
pub fn skewness_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::skewness(data)
}

#[wasm_bindgen]
pub fn kurtosis_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::kurtosis(data)
}

#[wasm_bindgen]
pub fn cumsum_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    vec_to_array_result(stat_core::cumsum(data))
}

#[wasm_bindgen]
pub fn cumprod_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    vec_to_array_result(stat_core::cumprod(data))
}

#[wasm_bindgen]
pub fn diff_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    vec_to_array_result(stat_core::diff(data))
}

#[wasm_bindgen]
pub fn rank_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    vec_to_array_result(stat_core::rank(data))
}

#[wasm_bindgen]
pub fn histogram_f64(ptr: *const f64, len: usize, bin_count: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    let bins = stat_core::histogram(data, bin_count);
    // Convert usize to f64 for JS compatibility
    let bins_f64: Vec<f64> = bins.iter().map(|&x| x as f64).collect();
    vec_to_array_result(bins_f64)
}

