// =============================================================================
// Cumulative & Transformations
// =============================================================================

/// Calculate the cumulative sum of a slice.
pub fn cumsum(data: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    let mut running_total = 0.0;

    for &value in data {
        running_total += value;
        result.push(running_total);
    }

    result
}

/// Calculate the cumulative product of a slice.
pub fn cumprod(data: &[f64]) -> Vec<f64> {
    let mut result = Vec::with_capacity(data.len());
    let mut running_product = 1.0;

    for &value in data {
        running_product *= value;
        result.push(running_product);
    }

    result
}

/// Calculate the difference between consecutive elements.
pub fn diff(data: &[f64]) -> Vec<f64> {
    if data.len() < 2 {
        return Vec::new();
    }

    data.windows(2).map(|w| w[1] - w[0]).collect()
}

/// Cumulative reduction: apply a reduction function cumulatively.
/// Similar to cumsum/cumprod but with a custom reducer function.
///
/// Note: This function cannot be directly exposed to WASM due to closure limitations.
/// For WASM, use specific cumulative functions like cumsum, cumprod, etc.
///
/// # Arguments
/// * `data` - Input slice
/// * `init` - Initial value for the accumulator
/// * `reducer` - Function that takes (accumulator, value) and returns new accumulator
///
/// # Example
/// ```rust
/// use stat_core::cumreduce;
/// let data = [1.0, 2.0, 3.0];
/// let result = cumreduce(&data, 0.0, |acc, x| acc + x * x);
/// // result = [1.0, 5.0, 14.0] (cumulative sum of squares)
/// ```
pub fn cumreduce<F>(data: &[f64], init: f64, reducer: F) -> Vec<f64>
where
    F: Fn(f64, f64) -> f64,
{
    let mut result = Vec::with_capacity(data.len());
    let mut acc = init;

    for &value in data {
        acc = reducer(acc, value);
        result.push(acc);
    }

    result
}





