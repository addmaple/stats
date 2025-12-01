use wasm_bindgen::prelude::*;

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

// Correlation functions
#[wasm_bindgen]
pub fn covariance_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    stat_core::covariance(x, y)
}

#[wasm_bindgen]
pub fn corrcoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    stat_core::corrcoeff(x, y)
}

#[wasm_bindgen]
pub fn spearmancoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    stat_core::spearmancoeff(x, y)
}

