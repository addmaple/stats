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

#[wasm_bindgen]
pub fn alloc_f32(len: usize) -> *mut f32 {
    let mut vec = Vec::<f32>::with_capacity(len);
    let ptr = vec.as_mut_ptr();
    std::mem::forget(vec);
    ptr
}

#[wasm_bindgen]
pub fn free_f32(ptr: *mut f32, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, len, len);
    }
}

fn map_distribution_error(err: stat_core::DistributionError) -> JsValue {
    JsValue::from_str(&err.to_string())
}

// Basic statistics functions (accepting pointers)
#[wasm_bindgen]
pub fn sum_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sum(data)
}

#[wasm_bindgen]
pub fn mean_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::mean(data)
}

#[wasm_bindgen]
pub fn variance_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::variance(data)
}

#[wasm_bindgen]
pub fn sample_variance_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sample_variance(data)
}

#[wasm_bindgen]
pub fn stdev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::stdev(data)
}

#[wasm_bindgen]
pub fn sample_stdev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sample_stdev(data)
}

#[wasm_bindgen]
pub fn min_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::min(data)
}

#[wasm_bindgen]
pub fn max_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::max(data)
}

#[wasm_bindgen]
pub fn product_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::product(data)
}

#[wasm_bindgen]
pub fn range_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::range(data)
}

#[wasm_bindgen]
pub fn median_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::median(data)
}

#[wasm_bindgen]
pub fn mode_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::mode(data)
}

#[wasm_bindgen]
pub fn geomean_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::geomean(data)
}

#[wasm_bindgen]
pub fn skewness_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::skewness(data)
}

#[wasm_bindgen]
pub fn kurtosis_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::kurtosis(data)
}

#[wasm_bindgen]
pub fn covariance_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = unsafe { std::slice::from_raw_parts(x_ptr, x_len) };
    let y = unsafe { std::slice::from_raw_parts(y_ptr, y_len) };
    stat_core::covariance(x, y)
}

#[wasm_bindgen]
pub fn corrcoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = unsafe { std::slice::from_raw_parts(x_ptr, x_len) };
    let y = unsafe { std::slice::from_raw_parts(y_ptr, y_len) };
    stat_core::corrcoeff(x, y)
}

#[wasm_bindgen]
pub fn cumsum_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    vec_to_array_result(stat_core::cumsum(data))
}

#[wasm_bindgen]
pub fn diff_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    vec_to_array_result(stat_core::diff(data))
}

#[wasm_bindgen]
pub fn rank_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    vec_to_array_result(stat_core::rank(data))
}

#[wasm_bindgen]
pub fn cumprod_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    vec_to_array_result(stat_core::cumprod(data))
}

#[wasm_bindgen]
pub fn coeffvar_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::coeffvar(data)
}

#[wasm_bindgen]
pub fn deviation_f64(ptr: *const f64, len: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    vec_to_array_result(stat_core::deviation(data))
}

#[wasm_bindgen]
pub fn meandev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::meandev(data)
}

#[wasm_bindgen]
pub fn meddev_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::meddev(data)
}

#[wasm_bindgen]
pub fn pooledvariance_f64(
    data1_ptr: *const f64,
    data1_len: usize,
    data2_ptr: *const f64,
    data2_len: usize,
) -> f64 {
    let data1 = unsafe { std::slice::from_raw_parts(data1_ptr, data1_len) };
    let data2 = unsafe { std::slice::from_raw_parts(data2_ptr, data2_len) };
    stat_core::pooledvariance(data1, data2)
}

#[wasm_bindgen]
pub fn pooledstdev_f64(
    data1_ptr: *const f64,
    data1_len: usize,
    data2_ptr: *const f64,
    data2_len: usize,
) -> f64 {
    let data1 = unsafe { std::slice::from_raw_parts(data1_ptr, data1_len) };
    let data2 = unsafe { std::slice::from_raw_parts(data2_ptr, data2_len) };
    stat_core::pooledstdev(data1, data2)
}

#[wasm_bindgen]
pub fn stan_moment_f64(ptr: *const f64, len: usize, k: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::stan_moment(data, k)
}

#[wasm_bindgen]
pub fn spearmancoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 {
    if x_len != y_len {
        return f64::NAN;
    }
    let x = unsafe { std::slice::from_raw_parts(x_ptr, x_len) };
    let y = unsafe { std::slice::from_raw_parts(y_ptr, y_len) };
    stat_core::spearmancoeff(x, y)
}

#[wasm_bindgen]
pub fn percentile_of_score_f64(ptr: *const f64, len: usize, score: f64, strict: bool) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::percentile_of_score(data, score, strict)
}

#[wasm_bindgen]
pub fn qscore_f64(ptr: *const f64, len: usize, score: f64, strict: bool) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::qscore(data, score, strict)
}

#[wasm_bindgen]
pub fn qtest_f64(ptr: *const f64, len: usize, score: f64, q_lower: f64, q_upper: f64) -> bool {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::qtest(data, score, q_lower, q_upper)
}

// Quantile functions
#[wasm_bindgen]
pub fn percentile_f64(ptr: *const f64, len: usize, k: f64, exclusive: bool) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::percentile(data, k, exclusive)
}

#[wasm_bindgen]
pub fn percentile_inclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::percentile_inclusive(data, k)
}

#[wasm_bindgen]
pub fn percentile_exclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::percentile_exclusive(data, k)
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
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let q = stat_core::quartiles(data);
    QuartilesResult {
        q1: q[0],
        q2: q[1],
        q3: q[2],
    }
}

#[wasm_bindgen]
pub fn iqr_f64(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::iqr(data)
}

#[wasm_bindgen]
pub fn quantiles_f64(
    data_ptr: *const f64,
    data_len: usize,
    qs_ptr: *const f64,
    qs_len: usize,
) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(data_ptr, data_len) };
    let qs = unsafe { std::slice::from_raw_parts(qs_ptr, qs_len) };
    vec_to_array_result(stat_core::quantiles(data, qs))
}

// Histogram functions
#[wasm_bindgen]
pub fn histogram_f64(ptr: *const f64, len: usize, bin_count: usize) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let bins = stat_core::histogram(data, bin_count);
    // Convert usize to f64 for JS compatibility (pre-allocate for efficiency)
    let mut bins_f64 = Vec::with_capacity(bins.len());
    bins_f64.extend(bins.iter().map(|&x| x as f64));
    vec_to_array_result(bins_f64)
}

#[wasm_bindgen]
pub fn histogram_edges_f64(
    data_ptr: *const f64,
    data_len: usize,
    edges_ptr: *const f64,
    edges_len: usize,
) -> ArrayResult {
    let data = unsafe { std::slice::from_raw_parts(data_ptr, data_len) };
    let edges = unsafe { std::slice::from_raw_parts(edges_ptr, edges_len) };
    let bins = stat_core::histogram_edges(data, edges);
    let bins_f64: Vec<f64> = bins.into_iter().map(|x| x as f64).collect();
    vec_to_array_result(bins_f64)
}

/// Histogram result with edges and counts
#[wasm_bindgen]
pub struct HistogramWithEdges {
    edges: ArrayResult,
    counts: ArrayResult,
}

#[wasm_bindgen]
impl HistogramWithEdges {
    #[wasm_bindgen(getter)]
    pub fn edges(&self) -> ArrayResult {
        self.edges
    }

    #[wasm_bindgen(getter)]
    pub fn counts(&self) -> ArrayResult {
        self.counts
    }
}

fn vec_to_array_result_usize(data: Vec<usize>) -> ArrayResult {
    let data_f64: Vec<f64> = data.into_iter().map(|x| x as f64).collect();
    vec_to_array_result(data_f64)
}

/// Calculate histogram with fixed-width binning, returning edges and counts.
#[wasm_bindgen]
pub fn histogram_fixed_width_with_edges_f64(
    ptr: *const f64,
    len: usize,
    bins: usize,
) -> HistogramWithEdges {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let result = stat_core::histogram_fixed_width_with_edges(data, bins);
    HistogramWithEdges {
        edges: vec_to_array_result(result.edges),
        counts: vec_to_array_result_usize(result.counts),
    }
}

/// Calculate histogram with equal-frequency binning, returning edges and counts.
#[wasm_bindgen]
pub fn histogram_equal_frequency_with_edges_f64(
    ptr: *const f64,
    len: usize,
    bins: usize,
) -> HistogramWithEdges {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let result = stat_core::histogram_equal_frequency_with_edges(data, bins);
    HistogramWithEdges {
        edges: vec_to_array_result(result.edges),
        counts: vec_to_array_result_usize(result.counts),
    }
}

/// Calculate histogram with automatic binning, returning edges and counts.
/// rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
/// bins_override: 0 means use rule's default, otherwise override
#[wasm_bindgen]
pub fn histogram_auto_with_edges_f64(
    ptr: *const f64,
    len: usize,
    rule: usize,
    bins_override: usize,
) -> HistogramWithEdges {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let binning_rule = match rule {
        0 => stat_core::BinningRule::FreedmanDiaconis,
        1 => stat_core::BinningRule::Scott,
        2 => stat_core::BinningRule::SqrtN,
        _ => stat_core::BinningRule::FreedmanDiaconis, // Default fallback
    };
    let bins_opt = if bins_override == 0 {
        None
    } else {
        Some(bins_override)
    };
    let result = stat_core::histogram_auto_with_edges(data, binning_rule, bins_opt);
    HistogramWithEdges {
        edges: vec_to_array_result(result.edges),
        counts: vec_to_array_result_usize(result.counts),
    }
}

/// Calculate histogram with automatic binning and tail collapse, returning edges and counts.
/// rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
/// bins_override: 0 means use rule's default, otherwise override
/// k: IQR multiplier for outlier detection (typically 1.5)
#[wasm_bindgen]
pub fn histogram_auto_with_edges_collapse_tails_f64(
    ptr: *const f64,
    len: usize,
    rule: usize,
    bins_override: usize,
    k: f64,
) -> HistogramWithEdges {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    let binning_rule = match rule {
        0 => stat_core::BinningRule::FreedmanDiaconis,
        1 => stat_core::BinningRule::Scott,
        2 => stat_core::BinningRule::SqrtN,
        _ => stat_core::BinningRule::FreedmanDiaconis, // Default fallback
    };
    let bins_opt = if bins_override == 0 {
        None
    } else {
        Some(bins_override)
    };
    let result =
        stat_core::histogram_auto_with_edges_collapse_tails(data, binning_rule, bins_opt, k);
    HistogramWithEdges {
        edges: vec_to_array_result(result.edges),
        counts: vec_to_array_result_usize(result.counts),
    }
}

/// Calculate histogram with custom edges, returning edges and counts.
/// clamp_outside: if true, values outside edges are clamped to first/last bin
#[wasm_bindgen]
pub fn histogram_custom_with_edges_f64(
    data_ptr: *const f64,
    data_len: usize,
    edges_ptr: *const f64,
    edges_len: usize,
    clamp_outside: bool,
) -> HistogramWithEdges {
    let data = unsafe { std::slice::from_raw_parts(data_ptr, data_len) };
    let edges = unsafe { std::slice::from_raw_parts(edges_ptr, edges_len) };
    let result = stat_core::histogram_custom_with_edges(data, edges, clamp_outside);
    HistogramWithEdges {
        edges: vec_to_array_result(result.edges),
        counts: vec_to_array_result_usize(result.counts),
    }
}

/// ANOVA result struct for JS
#[wasm_bindgen]
pub struct AnovaResult {
    f_score: f64,
    df_between: usize,
    df_within: usize,
}

#[wasm_bindgen]
impl AnovaResult {
    #[wasm_bindgen(getter)]
    pub fn f_score(&self) -> f64 {
        self.f_score
    }

    #[wasm_bindgen(getter)]
    pub fn df_between(&self) -> usize {
        self.df_between
    }

    #[wasm_bindgen(getter)]
    pub fn df_within(&self) -> usize {
        self.df_within
    }
}

/// ANOVA F-score for multiple groups using flat buffer approach
/// data_ptr: pointer to concatenated group data
/// lens_ptr: pointer to array of group lengths (as f64 for simplicity)
/// num_groups: number of groups
#[wasm_bindgen]
pub fn anova_f_score_flat(data_ptr: *const f64, lens_ptr: *const f64, num_groups: usize) -> f64 {
    if num_groups < 2 {
        return f64::NAN;
    }

    let lens = unsafe { std::slice::from_raw_parts(lens_ptr, num_groups) };
    let total_len: usize = lens.iter().map(|&l| l as usize).sum();
    let data = unsafe { std::slice::from_raw_parts(data_ptr, total_len) };

    // Split data into groups based on lengths
    let mut groups: Vec<&[f64]> = Vec::with_capacity(num_groups);
    let mut offset = 0;
    for &len in lens {
        let len = len as usize;
        if len == 0 {
            return f64::NAN;
        }
        groups.push(&data[offset..offset + len]);
        offset += len;
    }

    stat_core::anova_f_score(&groups)
}

/// ANOVA with full result (F-score + degrees of freedom)
#[wasm_bindgen]
pub fn anova_flat(data_ptr: *const f64, lens_ptr: *const f64, num_groups: usize) -> AnovaResult {
    if num_groups < 2 {
        return AnovaResult {
            f_score: f64::NAN,
            df_between: 0,
            df_within: 0,
        };
    }

    let lens = unsafe { std::slice::from_raw_parts(lens_ptr, num_groups) };
    let total_len: usize = lens.iter().map(|&l| l as usize).sum();
    let data = unsafe { std::slice::from_raw_parts(data_ptr, total_len) };

    // Split data into groups based on lengths
    let mut groups: Vec<&[f64]> = Vec::with_capacity(num_groups);
    let mut offset = 0;
    for &len in lens {
        let len = len as usize;
        if len == 0 {
            return AnovaResult {
                f_score: f64::NAN,
                df_between: 0,
                df_within: 0,
            };
        }
        groups.push(&data[offset..offset + len]);
        offset += len;
    }

    let result = stat_core::anova(&groups);
    AnovaResult {
        f_score: result.f_score,
        df_between: result.df_between,
        df_within: result.df_within,
    }
}

/// Chi-square test result struct for JS
#[wasm_bindgen]
pub struct ChiSquareResult {
    statistic: f64,
    p_value: f64,
    df: usize,
}

#[wasm_bindgen]
impl ChiSquareResult {
    #[wasm_bindgen(getter)]
    pub fn statistic(&self) -> f64 {
        self.statistic
    }

    #[wasm_bindgen(getter)]
    pub fn p_value(&self) -> f64 {
        self.p_value
    }

    #[wasm_bindgen(getter)]
    pub fn df(&self) -> usize {
        self.df
    }
}

/// Chi-square test of independence for two categorical variables
#[wasm_bindgen]
pub fn chi_square_test(cat1: Vec<String>, cat2: Vec<String>) -> ChiSquareResult {
    chi_square_test_with_cardinality(cat1, cat2, None, None)
}

/// Chi-square test with optional cardinality hints for optimization
///
/// If cardinality1 and cardinality2 are provided (number of unique categories),
/// uses a faster array-based algorithm.
#[wasm_bindgen]
pub fn chi_square_test_with_cardinality(
    cat1: Vec<String>,
    cat2: Vec<String>,
    cardinality1: Option<usize>,
    cardinality2: Option<usize>,
) -> ChiSquareResult {
    let result =
        stat_core::chi_square_test_with_cardinality(&cat1, &cat2, cardinality1, cardinality2);
    ChiSquareResult {
        statistic: result.statistic,
        p_value: result.p_value,
        df: result.df,
    }
}

/// ANOVA F-score with categorical grouping
/// groups: categorical labels
/// values: numeric values corresponding to each label
#[wasm_bindgen]
pub fn anova_f_score_categorical(groups: Vec<String>, values: Vec<f64>) -> f64 {
    stat_core::anova_f_score_categorical(&groups, &values)
}

/// ANOVA with categorical grouping - full result
#[wasm_bindgen]
pub fn anova_categorical(groups: Vec<String>, values: Vec<f64>) -> AnovaResult {
    let result = stat_core::anova_categorical(&groups, &values);
    AnovaResult {
        f_score: result.f_score,
        df_between: result.df_between,
        df_within: result.df_within,
    }
}

// Optimized functions that work directly with typed arrays (no copying needed)
// These assume the data is already in WASM memory
#[wasm_bindgen]
pub fn sum_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sum(data)
}

#[wasm_bindgen]
pub fn mean_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::mean(data)
}

#[wasm_bindgen]
pub fn variance_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::variance(data)
}

#[wasm_bindgen]
pub fn sample_variance_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sample_variance(data)
}

#[wasm_bindgen]
pub fn stdev_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::stdev(data)
}

#[wasm_bindgen]
pub fn sample_stdev_f64_direct(ptr: *const f64, len: usize) -> f64 {
    let data = unsafe { std::slice::from_raw_parts(ptr, len) };
    stat_core::sample_stdev(data)
}

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

fn slice_from_f32<'a>(ptr: *const f32, len: usize) -> &'a [f32] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut_f32<'a>(ptr: *mut f32, len: usize) -> &'a mut [f32] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

macro_rules! define_scalar_fn {
    ($name:ident, $rust_fn:ident, ($($param:ident : f64),*)) => {
        #[wasm_bindgen]
        pub fn $name(x: f64, $($param: f64),*) -> Result<f64, JsValue> {
            stat_core::$rust_fn(x, $($param),*).map_err(map_distribution_error)
        }
    };
    ($name:ident, $rust_fn:ident, [$($param:ident : f64),*]) => {
        #[wasm_bindgen]
        pub fn $name(p: f64, $($param: f64),*) -> Result<f64, JsValue> {
            stat_core::$rust_fn(p, $($param),*).map_err(map_distribution_error)
        }
    };
}

macro_rules! define_array_fn {
    ($name:ident, $rust_fn:ident, [$($param:ident : f64),*]) => {
        #[wasm_bindgen]
        pub fn $name(
            input_ptr: *const f64,
            len: usize,
            $($param: f64,)*
            output_ptr: *mut f64,
        ) -> Result<(), JsValue> {
            let input = slice_from(input_ptr, len);
            let output = slice_from_mut(output_ptr, len);
            stat_core::$rust_fn(input, $($param,)* output).map_err(map_distribution_error)
        }
    };
}

// Normal distribution
define_scalar_fn!(normal_pdf_scalar, normal_pdf, (mean: f64, sd: f64));
define_scalar_fn!(normal_cdf_scalar, normal_cdf, (mean: f64, sd: f64));
define_scalar_fn!(normal_inv_scalar, normal_inv, [mean: f64, sd: f64]);
define_array_fn!(normal_pdf_inplace, normal_pdf_array, [mean: f64, sd: f64]);
define_array_fn!(normal_cdf_inplace, normal_cdf_array, [mean: f64, sd: f64]);

// Gamma distribution (shape, rate)
define_scalar_fn!(gamma_pdf_scalar, gamma_pdf, (shape: f64, rate: f64));
define_scalar_fn!(gamma_cdf_scalar, gamma_cdf, (shape: f64, rate: f64));
define_scalar_fn!(gamma_inv_scalar, gamma_inv, [shape: f64, rate: f64]);
define_array_fn!(gamma_pdf_inplace, gamma_pdf_array, [shape: f64, rate: f64]);
define_array_fn!(gamma_cdf_inplace, gamma_cdf_array, [shape: f64, rate: f64]);

// Beta distribution (alpha, beta)
define_scalar_fn!(beta_pdf_scalar, beta_pdf, (alpha: f64, beta: f64));
define_scalar_fn!(beta_cdf_scalar, beta_cdf, (alpha: f64, beta: f64));
define_scalar_fn!(beta_inv_scalar, beta_inv, [alpha: f64, beta: f64]);
define_array_fn!(beta_pdf_inplace, beta_pdf_array, [alpha: f64, beta: f64]);
define_array_fn!(beta_cdf_inplace, beta_cdf_array, [alpha: f64, beta: f64]);

// Student's t distribution
define_scalar_fn!(
    student_t_pdf_scalar,
    student_t_pdf,
    (mean: f64, scale: f64, dof: f64)
);
define_scalar_fn!(
    student_t_cdf_scalar,
    student_t_cdf,
    (mean: f64, scale: f64, dof: f64)
);
define_scalar_fn!(
    student_t_inv_scalar,
    student_t_inv,
    [mean: f64, scale: f64, dof: f64]
);
define_array_fn!(
    student_t_pdf_inplace,
    student_t_pdf_array,
    [mean: f64, scale: f64, dof: f64]
);
define_array_fn!(
    student_t_cdf_inplace,
    student_t_cdf_array,
    [mean: f64, scale: f64, dof: f64]
);

// Chi-squared distribution
define_scalar_fn!(chi_squared_pdf_scalar, chi_squared_pdf, (dof: f64));
define_scalar_fn!(chi_squared_cdf_scalar, chi_squared_cdf, (dof: f64));
define_scalar_fn!(chi_squared_inv_scalar, chi_squared_inv, [dof: f64]);
define_array_fn!(chi_squared_pdf_inplace, chi_squared_pdf_array, [dof: f64]);
define_array_fn!(chi_squared_cdf_inplace, chi_squared_cdf_array, [dof: f64]);

// Fisher F distribution
define_scalar_fn!(fisher_f_pdf_scalar, fisher_f_pdf, (df1: f64, df2: f64));
define_scalar_fn!(fisher_f_cdf_scalar, fisher_f_cdf, (df1: f64, df2: f64));
define_scalar_fn!(fisher_f_inv_scalar, fisher_f_inv, [df1: f64, df2: f64]);
define_array_fn!(
    fisher_f_pdf_inplace,
    fisher_f_pdf_array,
    [df1: f64, df2: f64]
);
define_array_fn!(
    fisher_f_cdf_inplace,
    fisher_f_cdf_array,
    [df1: f64, df2: f64]
);

// Exponential distribution
define_scalar_fn!(exponential_pdf_scalar, exponential_pdf, (rate: f64));
define_scalar_fn!(exponential_cdf_scalar, exponential_cdf, (rate: f64));
define_scalar_fn!(exponential_inv_scalar, exponential_inv, [rate: f64]);
define_array_fn!(
    exponential_pdf_inplace,
    exponential_pdf_array,
    [rate: f64]
);
define_array_fn!(
    exponential_cdf_inplace,
    exponential_cdf_array,
    [rate: f64]
);

// Poisson distribution (discrete - uses pmf instead of pdf)
define_scalar_fn!(poisson_pmf_scalar, poisson_pmf, (lambda: f64));
define_scalar_fn!(poisson_cdf_scalar, poisson_cdf, (lambda: f64));
define_scalar_fn!(poisson_inv_scalar, poisson_inv, [lambda: f64]);
define_array_fn!(poisson_pmf_inplace, poisson_pmf_array, [lambda: f64]);
define_array_fn!(poisson_cdf_inplace, poisson_cdf_array, [lambda: f64]);

// Binomial distribution (discrete - uses pmf instead of pdf)
define_scalar_fn!(binomial_pmf_scalar, binomial_pmf, (n: f64, p: f64));
define_scalar_fn!(binomial_cdf_scalar, binomial_cdf, (n: f64, p: f64));
// Manual definition to avoid parameter name conflict (p for probability vs p for success probability)
#[wasm_bindgen]
pub fn binomial_inv_scalar(prob: f64, n: f64, p: f64) -> Result<f64, JsValue> {
    stat_core::binomial_inv(prob, n, p).map_err(map_distribution_error)
}
define_array_fn!(binomial_pmf_inplace, binomial_pmf_array, [n: f64, p: f64]);
define_array_fn!(binomial_cdf_inplace, binomial_cdf_array, [n: f64, p: f64]);

// Uniform distribution
define_scalar_fn!(uniform_pdf_scalar, uniform_pdf, (min: f64, max: f64));
define_scalar_fn!(uniform_cdf_scalar, uniform_cdf, (min: f64, max: f64));
define_scalar_fn!(uniform_inv_scalar, uniform_inv, [min: f64, max: f64]);
define_array_fn!(uniform_pdf_inplace, uniform_pdf_array, [min: f64, max: f64]);
define_array_fn!(uniform_cdf_inplace, uniform_cdf_array, [min: f64, max: f64]);

// Cauchy distribution
define_scalar_fn!(cauchy_pdf_scalar, cauchy_pdf, (location: f64, scale: f64));
define_scalar_fn!(cauchy_cdf_scalar, cauchy_cdf, (location: f64, scale: f64));
define_scalar_fn!(cauchy_inv_scalar, cauchy_inv, [location: f64, scale: f64]);
define_array_fn!(cauchy_pdf_inplace, cauchy_pdf_array, [location: f64, scale: f64]);
define_array_fn!(cauchy_cdf_inplace, cauchy_cdf_array, [location: f64, scale: f64]);

// Laplace distribution
define_scalar_fn!(laplace_pdf_scalar, laplace_pdf, (location: f64, scale: f64));
define_scalar_fn!(laplace_cdf_scalar, laplace_cdf, (location: f64, scale: f64));
define_scalar_fn!(laplace_inv_scalar, laplace_inv, [location: f64, scale: f64]);
define_array_fn!(laplace_pdf_inplace, laplace_pdf_array, [location: f64, scale: f64]);
define_array_fn!(laplace_cdf_inplace, laplace_cdf_array, [location: f64, scale: f64]);

// Log-normal distribution
define_scalar_fn!(lognormal_pdf_scalar, lognormal_pdf, (mean: f64, sd: f64));
define_scalar_fn!(lognormal_cdf_scalar, lognormal_cdf, (mean: f64, sd: f64));
define_scalar_fn!(lognormal_inv_scalar, lognormal_inv, [mean: f64, sd: f64]);
define_array_fn!(lognormal_pdf_inplace, lognormal_pdf_array, [mean: f64, sd: f64]);
define_array_fn!(lognormal_cdf_inplace, lognormal_cdf_array, [mean: f64, sd: f64]);

// Weibull distribution
define_scalar_fn!(weibull_pdf_scalar, weibull_pdf, (shape: f64, scale: f64));
define_scalar_fn!(weibull_cdf_scalar, weibull_cdf, (shape: f64, scale: f64));
define_scalar_fn!(weibull_inv_scalar, weibull_inv, [shape: f64, scale: f64]);
define_array_fn!(weibull_pdf_inplace, weibull_pdf_array, [shape: f64, scale: f64]);
define_array_fn!(weibull_cdf_inplace, weibull_cdf_array, [shape: f64, scale: f64]);

// Pareto distribution
define_scalar_fn!(pareto_pdf_scalar, pareto_pdf, (scale: f64, shape: f64));
define_scalar_fn!(pareto_cdf_scalar, pareto_cdf, (scale: f64, shape: f64));
define_scalar_fn!(pareto_inv_scalar, pareto_inv, [scale: f64, shape: f64]);
define_array_fn!(pareto_pdf_inplace, pareto_pdf_array, [scale: f64, shape: f64]);
define_array_fn!(pareto_cdf_inplace, pareto_cdf_array, [scale: f64, shape: f64]);

// Triangular distribution
define_scalar_fn!(triangular_pdf_scalar, triangular_pdf, (min: f64, max: f64, mode: f64));
define_scalar_fn!(triangular_cdf_scalar, triangular_cdf, (min: f64, max: f64, mode: f64));
define_scalar_fn!(triangular_inv_scalar, triangular_inv, [min: f64, max: f64, mode: f64]);
define_array_fn!(triangular_pdf_inplace, triangular_pdf_array, [min: f64, max: f64, mode: f64]);
define_array_fn!(triangular_cdf_inplace, triangular_cdf_array, [min: f64, max: f64, mode: f64]);

// Inverse gamma distribution
define_scalar_fn!(invgamma_pdf_scalar, invgamma_pdf, (shape: f64, rate: f64));
define_scalar_fn!(invgamma_cdf_scalar, invgamma_cdf, (shape: f64, rate: f64));
define_scalar_fn!(invgamma_inv_scalar, invgamma_inv, [shape: f64, rate: f64]);
define_array_fn!(invgamma_pdf_inplace, invgamma_pdf_array, [shape: f64, rate: f64]);
define_array_fn!(invgamma_cdf_inplace, invgamma_cdf_array, [shape: f64, rate: f64]);

// Negative binomial distribution (discrete)
define_scalar_fn!(negbin_pmf_scalar, negbin_pmf, (r: f64, p: f64));
define_scalar_fn!(negbin_cdf_scalar, negbin_cdf, (r: f64, p: f64));
// Manual definition to avoid parameter name conflict (p for probability vs p for success probability)
#[wasm_bindgen]
pub fn negbin_inv_scalar(prob: f64, r: f64, p: f64) -> Result<f64, JsValue> {
    stat_core::negbin_inv(prob, r, p).map_err(map_distribution_error)
}
define_array_fn!(negbin_pmf_inplace, negbin_pmf_array, [r: f64, p: f64]);
define_array_fn!(negbin_cdf_inplace, negbin_cdf_array, [r: f64, p: f64]);

// =============================================================================
// Statistical Tests
// =============================================================================

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
pub struct RegressionCoeffs {
    slope: f64,
    intercept: f64,
    r_squared: f64,
}

#[wasm_bindgen]
impl RegressionCoeffs {
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
}

#[wasm_bindgen]
pub struct RegressionCoeffsF32 {
    slope: f32,
    intercept: f32,
    r_squared: f32,
}

#[wasm_bindgen]
impl RegressionCoeffsF32 {
    #[wasm_bindgen(getter)]
    pub fn slope(&self) -> f32 {
        self.slope
    }

    #[wasm_bindgen(getter)]
    pub fn intercept(&self) -> f32 {
        self.intercept
    }

    #[wasm_bindgen(getter)]
    pub fn r_squared(&self) -> f32 {
        self.r_squared
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

#[wasm_bindgen]
pub fn regress_naive_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionResult {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let result = stat_core::regress_naive(x, y);

    RegressionResult {
        slope: result.slope,
        intercept: result.intercept,
        r_squared: result.r_squared,
        residuals: vec_to_array_result(result.residuals),
    }
}

#[wasm_bindgen]
pub fn regress_simd_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionResult {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let result = stat_core::regress_simd(x, y);

    RegressionResult {
        slope: result.slope,
        intercept: result.intercept,
        r_squared: result.r_squared,
        residuals: vec_to_array_result(result.residuals),
    }
}

#[wasm_bindgen]
pub fn regress_wasm_kernels_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionResult {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let result = stat_core::regress_kernels(x, y);

    RegressionResult {
        slope: result.slope,
        intercept: result.intercept,
        r_squared: result.r_squared,
        residuals: vec_to_array_result(result.residuals),
    }
}

// -----------------------------------------------------------------------------
// Coefficients-only regression (no residual allocation)
// -----------------------------------------------------------------------------

#[wasm_bindgen]
pub fn regress_coeffs_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let c = stat_core::regress_simd_coeffs(x, y);
    RegressionCoeffs {
        slope: c.slope,
        intercept: c.intercept,
        r_squared: c.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_naive_coeffs_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let c = stat_core::regress_naive_coeffs(x, y);
    RegressionCoeffs {
        slope: c.slope,
        intercept: c.intercept,
        r_squared: c.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_simd_coeffs_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let c = stat_core::regress_simd_coeffs(x, y);
    RegressionCoeffs {
        slope: c.slope,
        intercept: c.intercept,
        r_squared: c.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_wasm_kernels_coeffs_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let c = stat_core::regress_kernels_coeffs(x, y);
    RegressionCoeffs {
        slope: c.slope,
        intercept: c.intercept,
        r_squared: c.r_squared,
    }
}

// -----------------------------------------------------------------------------
// In-place residuals (caller provides output buffer)
// -----------------------------------------------------------------------------

#[wasm_bindgen]
pub fn regress_simd_residuals_inplace_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
    residuals_out_ptr: *mut f64,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let coeffs = stat_core::regress_simd_coeffs(x, y);
    if x_len != y_len || coeffs.slope.is_nan() {
        return RegressionCoeffs {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
        };
    }
    let out = slice_from_mut(residuals_out_ptr, x_len);
    stat_core::residuals_into(out, x, y, coeffs.slope, coeffs.intercept);
    RegressionCoeffs {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_wasm_kernels_residuals_inplace_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
    residuals_out_ptr: *mut f64,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let coeffs = stat_core::regress_kernels_coeffs(x, y);
    if x_len != y_len || coeffs.slope.is_nan() {
        return RegressionCoeffs {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
        };
    }
    let out = slice_from_mut(residuals_out_ptr, x_len);
    stat_core::residuals_into(out, x, y, coeffs.slope, coeffs.intercept);
    RegressionCoeffs {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_naive_residuals_inplace_f64(
    x_ptr: *const f64,
    x_len: usize,
    y_ptr: *const f64,
    y_len: usize,
    residuals_out_ptr: *mut f64,
) -> RegressionCoeffs {
    let x = slice_from(x_ptr, x_len);
    let y = slice_from(y_ptr, y_len);
    let coeffs = stat_core::regress_naive_coeffs(x, y);
    if x_len != y_len || coeffs.slope.is_nan() {
        return RegressionCoeffs {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
        };
    }
    let out = slice_from_mut(residuals_out_ptr, x_len);
    stat_core::residuals_into(out, x, y, coeffs.slope, coeffs.intercept);
    RegressionCoeffs {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
    }
}

// -----------------------------------------------------------------------------
// f32 regression (SIMD-focused, wasm-friendly)
// -----------------------------------------------------------------------------

#[wasm_bindgen]
pub fn regress_simd_coeffs_f32(
    x_ptr: *const f32,
    x_len: usize,
    y_ptr: *const f32,
    y_len: usize,
) -> RegressionCoeffsF32 {
    let x = slice_from_f32(x_ptr, x_len);
    let y = slice_from_f32(y_ptr, y_len);
    let c = stat_core::regress_simd_coeffs_f32(x, y);
    RegressionCoeffsF32 {
        slope: c.slope,
        intercept: c.intercept,
        r_squared: c.r_squared,
    }
}

#[wasm_bindgen]
pub fn regress_simd_residuals_inplace_f32(
    x_ptr: *const f32,
    x_len: usize,
    y_ptr: *const f32,
    y_len: usize,
    residuals_out_ptr: *mut f32,
) -> RegressionCoeffsF32 {
    let x = slice_from_f32(x_ptr, x_len);
    let y = slice_from_f32(y_ptr, y_len);
    let coeffs = stat_core::regress_simd_coeffs_f32(x, y);
    if x_len != y_len || coeffs.slope.is_nan() {
        return RegressionCoeffsF32 {
            slope: f32::NAN,
            intercept: f32::NAN,
            r_squared: f32::NAN,
        };
    }
    let out = slice_from_mut_f32(residuals_out_ptr, x_len);
    stat_core::residuals_into_f32(out, x, y, coeffs.slope, coeffs.intercept);
    RegressionCoeffsF32 {
        slope: coeffs.slope,
        intercept: coeffs.intercept,
        r_squared: coeffs.r_squared,
    }
}

// =============================================================================
// Confidence Intervals
// =============================================================================

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
