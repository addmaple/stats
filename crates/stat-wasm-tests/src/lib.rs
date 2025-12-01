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

fn vec_to_array_result(mut data: Vec<f64>) -> ArrayResult {
    let len = data.len();
    let ptr = data.as_mut_ptr() as usize;
    std::mem::forget(data);
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

// Statistical Tests
#[wasm_bindgen]
pub struct TestResult {
    statistic: f64,
    p_value: f64,
    df: Option<f64>,
}

#[wasm_bindgen]
impl TestResult {
    #[wasm_bindgen(getter)]
    pub fn statistic(&self) -> f64 {
        self.statistic
    }

    #[wasm_bindgen(getter)]
    pub fn p_value(&self) -> f64 {
        self.p_value
    }

    #[wasm_bindgen(getter)]
    pub fn df(&self) -> Option<f64> {
        self.df
    }
}

#[wasm_bindgen]
pub fn ttest_f64(data_ptr: *const f64, len: usize, mu0: f64) -> TestResult {
    let data = slice_from(data_ptr, len);
    let result = stat_core::ttest(data, mu0);
    TestResult {
        statistic: result.statistic,
        p_value: result.p_value,
        df: result.df,
    }
}

#[wasm_bindgen]
pub fn ztest_f64(data_ptr: *const f64, len: usize, mu0: f64, sigma: f64) -> TestResult {
    let data = slice_from(data_ptr, len);
    let result = stat_core::ztest(data, mu0, sigma);
    TestResult {
        statistic: result.statistic,
        p_value: result.p_value,
        df: result.df,
    }
}

#[wasm_bindgen]
pub struct RegressionResult {
    slope: f64,
    intercept: f64,
    r_squared: f64,
    residuals: ArrayResult,
}

#[wasm_bindgen]
impl RegressionResult {
    #[wasm_bindgen(getter)]
    pub fn slope(&self) -> f64 {
        self.slope
    }

    #[wasm_bindgen(getter)]
    pub fn intercept(&self) -> f64 {
        self.intercept
    }

    #[wasm_bindgen(getter)]
    pub fn r_squared(&self) -> f64 {
        self.r_squared
    }

    #[wasm_bindgen(getter)]
    pub fn residuals(&self) -> ArrayResult {
        ArrayResult {
            ptr: self.residuals.ptr,
            len: self.residuals.len,
        }
    }
}

#[wasm_bindgen]
pub fn regress_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionResult {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let result = stat_core::regress(x, y);

    RegressionResult {
        slope: result.slope,
        intercept: result.intercept,
        r_squared: result.r_squared,
        residuals: vec_to_array_result(result.residuals),
    }
}

// Confidence Intervals
#[wasm_bindgen]
pub fn normalci_f64(alpha: f64, mean: f64, se: f64) -> Vec<f64> {
    let ci = stat_core::normalci(alpha, mean, se);
    vec![ci[0], ci[1]]
}

#[wasm_bindgen]
pub fn tci_f64(alpha: f64, mean: f64, stdev: f64, n: f64) -> Vec<f64> {
    let ci = stat_core::tci(alpha, mean, stdev, n);
    vec![ci[0], ci[1]]
}

