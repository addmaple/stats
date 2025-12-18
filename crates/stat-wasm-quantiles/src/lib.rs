#![allow(clippy::not_unsafe_ptr_arg_deref)]

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

fn vec_to_array_result(data: Vec<f64>) -> ArrayResult {
    // IMPORTANT: JS frees these buffers via `free_f64(ptr, len)` which assumes
    // the allocation is exactly `len` elements. A `Vec` may have `capacity > len`,
    // so we first convert it into a boxed slice (always sized to `len`).
    let len = data.len();
    let boxed: Box<[f64]> = data.into_boxed_slice();
    let ptr = Box::into_raw(boxed) as *mut f64 as usize;
    ArrayResult { ptr, len }
}

#[wasm_bindgen]
pub fn get_memory() -> JsValue {
    wasm_bindgen::memory()
}

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

// Quantile functions
#[wasm_bindgen]
pub fn percentile_f64(ptr: *const f64, len: usize, k: f64, exclusive: bool) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::percentile(data, k, exclusive)
}

#[wasm_bindgen]
pub fn percentile_inclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::percentile_inclusive(data, k)
}

#[wasm_bindgen]
pub fn percentile_exclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::percentile_exclusive(data, k)
}

#[wasm_bindgen]
pub fn percentile_of_score_f64(ptr: *const f64, len: usize, score: f64, strict: bool) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::percentile_of_score(data, score, strict)
}

/// Quartiles result struct for JS
#[wasm_bindgen]
pub struct QuartilesResult {
    q1: f64,
    q2: f64,
    q3: f64,
}

#[wasm_bindgen]
impl QuartilesResult {
    #[wasm_bindgen(getter)]
    pub fn q1(&self) -> f64 {
        self.q1
    }

    #[wasm_bindgen(getter)]
    pub fn q2(&self) -> f64 {
        self.q2
    }

    #[wasm_bindgen(getter)]
    pub fn q3(&self) -> f64 {
        self.q3
    }
}

#[wasm_bindgen]
pub fn quartiles_f64(ptr: *const f64, len: usize) -> QuartilesResult {
    let data = slice_from(ptr, len);
    let q = stat_core::quartiles(data);
    QuartilesResult {
        q1: q[0],
        q2: q[1],
        q3: q[2],
    }
}

#[wasm_bindgen]
pub fn iqr_f64(ptr: *const f64, len: usize) -> f64 {
    let data = slice_from(ptr, len);
    stat_core::iqr(data)
}

#[wasm_bindgen]
pub fn quantiles_f64(
    data_ptr: *const f64,
    data_len: usize,
    qs_ptr: *const f64,
    qs_len: usize,
) -> ArrayResult {
    let data = slice_from(data_ptr, data_len);
    let qs = slice_from(qs_ptr, qs_len);
    vec_to_array_result(stat_core::quantiles(data, qs))
}

// Weighted quantile functions
#[wasm_bindgen]
pub fn weighted_percentile_f64(
    data_ptr: *const f64,
    data_len: usize,
    weights_ptr: *const f64,
    weights_len: usize,
    p: f64,
) -> f64 {
    let data = slice_from(data_ptr, data_len);
    let weights = slice_from(weights_ptr, weights_len);
    stat_core::weighted_percentile(data, weights, p)
}

#[wasm_bindgen]
pub fn weighted_quantiles_f64(
    data_ptr: *const f64,
    data_len: usize,
    weights_ptr: *const f64,
    weights_len: usize,
    qs_ptr: *const f64,
    qs_len: usize,
) -> ArrayResult {
    let data = slice_from(data_ptr, data_len);
    let weights = slice_from(weights_ptr, weights_len);
    let qs = slice_from(qs_ptr, qs_len);
    vec_to_array_result(stat_core::weighted_quantiles(data, weights, qs))
}

#[wasm_bindgen]
pub fn weighted_median_f64(
    data_ptr: *const f64,
    data_len: usize,
    weights_ptr: *const f64,
    weights_len: usize,
) -> f64 {
    let data = slice_from(data_ptr, data_len);
    let weights = slice_from(weights_ptr, weights_len);
    stat_core::weighted_median(data, weights)
}

// Histogram functions
#[wasm_bindgen]
pub fn histogram_f64(ptr: *const f64, len: usize, bin_count: usize) -> ArrayResult {
    let data = slice_from(ptr, len);
    let bins = stat_core::histogram(data, bin_count);
    let bins_f64: Vec<f64> = bins.iter().map(|&x| x as f64).collect();
    vec_to_array_result(bins_f64)
}

#[wasm_bindgen]
pub fn histogram_edges_f64(
    data_ptr: *const f64,
    data_len: usize,
    edges_ptr: *const f64,
    edges_len: usize,
) -> ArrayResult {
    let data = slice_from(data_ptr, data_len);
    let edges = slice_from(edges_ptr, edges_len);
    let bins = stat_core::histogram_edges(data, edges);
    let bins_f64: Vec<f64> = bins.into_iter().map(|x| x as f64).collect();
    vec_to_array_result(bins_f64)
}
