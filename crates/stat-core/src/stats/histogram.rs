use crate::stats::basic::stdev;
use crate::stats::minmax::minmax;
use crate::stats::order::{iqr, quantiles, quartiles};

// =============================================================================
// Histogram
// =============================================================================

/// Calculate a histogram with automatic bin width.
/// Optimized single-pass min/max finding + binning.
///
/// # Arguments
/// * `data` - Input slice
/// * `bin_count` - Number of bins (defaults to 4 if 0)
///
/// # Returns
/// Vector of counts per bin.
pub fn histogram(data: &[f64], bin_count: usize) -> Vec<usize> {
    let bin_count = if bin_count == 0 { 4 } else { bin_count };

    if data.is_empty() {
        return vec![0; bin_count];
    }

    // First pass: find min/max over finite values only.
    // NaN/±Inf are treated as out-of-domain for binning and skipped.
    // This avoids surprising "all-zero histogram" behavior when a single NaN is present.
    let mut min_val = f64::INFINITY;
    let mut max_val = f64::NEG_INFINITY;
    let mut finite_count = 0usize;
    for &v in data {
        if !v.is_finite() {
            continue;
        }
        finite_count += 1;
        if v < min_val {
            min_val = v;
        }
        if v > max_val {
            max_val = v;
        }
    }
    if finite_count == 0 {
        return vec![0; bin_count];
    }

    // Handle edge case where all values are the same
    let range = max_val - min_val;
    let mut bins = vec![0usize; bin_count];
    if range < f64::EPSILON {
        bins[0] = finite_count;
        return bins;
    }

    // Precompute inverse bin width for faster multiplication instead of division
    let inv_bin_width = bin_count as f64 / range;
    let last_bin = bin_count - 1;

    // Second pass: bin the values
    // Note: We already selected finite min/max, so skip non-finite values here too.
    // This loop can't be easily SIMD'd due to random writes to bins array
    unsafe {
        let bins_ptr = bins.as_mut_ptr();
        for &value in data {
            if !value.is_finite() {
                continue;
            }
            // Calculate bin index: multiply by inverse instead of dividing
            // Since (value - min_val) >= 0, casting truncates (same as floor for non-negative)
            let bin_idx = ((value - min_val) * inv_bin_width) as usize;
            // Clamp to last bin (handles max_val edge case) - use min for branch prediction
            let bin_idx = bin_idx.min(last_bin);
            // Unsafe indexing since we know bin_idx is bounded [0, last_bin]
            *bins_ptr.add(bin_idx) += 1;
        }
    }

    bins
}

#[inline]
fn edges_valid(edges: &[f64]) -> bool {
    // Must be totally ordered under partial_cmp (no NaN), and sorted non-decreasing.
    if edges.iter().any(|e| e.is_nan()) {
        return false;
    }
    edges.windows(2).all(|w| w[0] <= w[1])
}

/// Calculate a histogram with custom bin edges.
///
/// # Arguments
/// * `data` - Input slice
/// * `edges` - Bin edges (must be sorted, length = num_bins + 1)
///
/// # Returns
/// Vector of counts per bin. Values outside the range are not counted.
pub fn histogram_edges(data: &[f64], edges: &[f64]) -> Vec<usize> {
    if edges.len() < 2 {
        return vec![];
    }
    if !edges_valid(edges) {
        return vec![];
    }

    let num_bins = edges.len() - 1;
    let mut bins = vec![0usize; num_bins];

    for &value in data {
        if value.is_nan() {
            continue;
        }
        // Find the bin using binary search
        // Value goes in bin i if edges[i] <= value < edges[i+1]
        // (with the last bin being edges[n-1] <= value <= edges[n])
        match edges.binary_search_by(|e| e.partial_cmp(&value).unwrap()) {
            Ok(idx) => {
                // Exact match on an edge
                if idx == 0 {
                    bins[0] += 1;
                } else if idx < edges.len() - 1 {
                    bins[idx] += 1;
                } else {
                    // Value equals the last edge, put in last bin
                    bins[num_bins - 1] += 1;
                }
            }
            Err(idx) => {
                // idx is where value would be inserted
                if idx > 0 && idx <= num_bins {
                    bins[idx - 1] += 1;
                }
                // Values outside range are not counted
            }
        }
    }

    bins
}

/// Calculate a histogram with custom bin edges, clamping values outside range.
///
/// Unlike `histogram_edges`, values < edges[0] are counted in the first bin,
/// and values > edges[last] are counted in the last bin.
///
/// # Arguments
/// * `data` - Input slice
/// * `edges` - Bin edges (must be sorted, length = num_bins + 1)
///
/// # Returns
/// Vector of counts per bin. Values outside the range are clamped to first/last bin.
pub fn histogram_edges_clamped(data: &[f64], edges: &[f64]) -> Vec<usize> {
    if edges.len() < 2 {
        return vec![];
    }
    if !edges_valid(edges) {
        return vec![];
    }

    let num_bins = edges.len() - 1;
    let mut bins = vec![0usize; num_bins];

    let min_edge = edges[0];
    let max_edge = edges[edges.len() - 1];

    for &value in data {
        if value.is_nan() {
            continue;
        }

        // Clamp to first bin
        if value <= min_edge {
            bins[0] += 1;
            continue;
        }

        // Clamp to last bin
        if value >= max_edge {
            bins[num_bins - 1] += 1;
            continue;
        }

        // Find the bin using binary search for values within range
        match edges.binary_search_by(|e| e.partial_cmp(&value).unwrap()) {
            Ok(idx) => {
                // Exact match on an edge
                if idx == 0 {
                    bins[0] += 1;
                } else if idx < edges.len() - 1 {
                    bins[idx] += 1;
                } else {
                    bins[num_bins - 1] += 1;
                }
            }
            Err(idx) => {
                // idx is where value would be inserted
                if idx > 0 && idx <= num_bins {
                    bins[idx - 1] += 1;
                }
            }
        }
    }

    bins
}

// =============================================================================
// Advanced Binning Strategies
// =============================================================================

/// Binning rule for automatic binning strategies
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum BinningRule {
    /// Freedman-Diaconis rule: width = 2*IQR / n^(1/3)
    FreedmanDiaconis,
    /// Scott's rule: width = 3.5*stdev / n^(1/3)
    Scott,
    /// Square root rule: bins = ceil(sqrt(n))
    SqrtN,
}

/// Calculate bin edges using fixed-width binning (linear spacing).
///
/// # Arguments
/// * `data` - Input slice
/// * `bins` - Number of bins
///
/// # Returns
/// Vector of bin edges (length = bins + 1) from min to max
pub fn bin_edges_fixed_width(data: &[f64], bins: usize) -> Vec<f64> {
    if data.is_empty() || bins == 0 {
        return vec![];
    }

    let (min_val, max_val) = minmax(data);

    if min_val.is_nan() || max_val.is_nan() {
        return vec![];
    }

    let range = max_val - min_val;

    // Handle edge case where all values are the same
    if range < f64::EPSILON {
        let mut edges = vec![min_val; bins + 1];
        edges[bins] = max_val;
        return edges;
    }

    let mut edges = Vec::with_capacity(bins + 1);
    let bin_width = range / bins as f64;

    // Build edges [min, ..., max]. Force the last edge to equal max_val exactly to avoid
    // floating-point roundoff leaving max_val slightly outside the final edge (which would
    // cause histogram_edges() to drop the max element).
    for i in 0..bins {
        edges.push(min_val + i as f64 * bin_width);
    }
    edges.push(max_val);

    edges
}

/// Calculate bin edges using equal-frequency (quantile) binning.
///
/// Each bin contains approximately the same number of observations.
///
/// # Arguments
/// * `data` - Input slice
/// * `bins` - Number of bins
///
/// # Returns
/// Vector of bin edges (length = bins + 1) using quantiles
pub fn bin_edges_equal_frequency(data: &[f64], bins: usize) -> Vec<f64> {
    if data.is_empty() || bins == 0 {
        return vec![];
    }

    // Handle single value case
    if data.len() == 1 {
        let val = data[0];
        return vec![val; bins + 1];
    }

    // Build quantile points: 0, 1/bins, 2/bins, ..., 1.0
    let mut quantile_points = Vec::with_capacity(bins + 1);
    quantile_points.push(0.0);

    for i in 1..bins {
        quantile_points.push(i as f64 / bins as f64);
    }
    quantile_points.push(1.0);

    // Get quantile values
    let mut edges = quantiles(data, &quantile_points);

    // Ensure edges[0] = min and edges[last] = max for exact bounds
    let (min_val, max_val) = minmax(data);
    if !min_val.is_nan() {
        edges[0] = min_val;
    }
    if !max_val.is_nan() {
        edges[bins] = max_val;
    }

    edges
}

/// Calculate bin edges using automatic binning strategy.
///
/// # Arguments
/// * `data` - Input slice
/// * `rule` - Binning rule to use
/// * `bins_override` - Optional override for number of bins (for FD/Scott rules)
///
/// # Returns
/// Vector of bin edges (length = bins + 1)
pub fn bin_edges_auto(data: &[f64], rule: BinningRule, bins_override: Option<usize>) -> Vec<f64> {
    if data.is_empty() {
        return vec![];
    }

    let n = data.len() as f64;

    let (min_val, max_val) = minmax(data);
    if min_val.is_nan() || max_val.is_nan() {
        return vec![];
    }

    let range = max_val - min_val;

    // Handle edge case where all values are the same
    if range < f64::EPSILON {
        let bins = bins_override.unwrap_or(1);
        let mut edges = vec![min_val; bins + 1];
        edges[bins] = max_val;
        return edges;
    }

    let bins = match rule {
        BinningRule::SqrtN => bins_override.unwrap_or_else(|| (n.sqrt().ceil() as usize).max(1)),
        BinningRule::FreedmanDiaconis => {
            if let Some(override_bins) = bins_override {
                override_bins
            } else {
                let iqr_val = iqr(data);
                if iqr_val.is_nan() || iqr_val <= 0.0 {
                    // Fallback to sqrtN if IQR is invalid
                    (n.sqrt().ceil() as usize).max(1)
                } else {
                    let bin_width = 2.0 * iqr_val / n.powf(1.0 / 3.0);
                    if bin_width.is_nan() || bin_width <= 0.0 || bin_width > range {
                        // Fallback to sqrtN
                        (n.sqrt().ceil() as usize).max(1)
                    } else {
                        let computed_bins = ((range / bin_width).ceil() as usize).max(1);
                        // Clamp to reasonable range
                        computed_bins.clamp(1, 2048)
                    }
                }
            }
        }
        BinningRule::Scott => {
            if let Some(override_bins) = bins_override {
                override_bins
            } else {
                let stdev_val = stdev(data);
                if stdev_val.is_nan() || stdev_val <= 0.0 {
                    // Fallback to sqrtN if stdev is invalid
                    (n.sqrt().ceil() as usize).max(1)
                } else {
                    let bin_width = 3.5 * stdev_val / n.powf(1.0 / 3.0);
                    if bin_width.is_nan() || bin_width <= 0.0 || bin_width > range {
                        // Fallback to sqrtN
                        (n.sqrt().ceil() as usize).max(1)
                    } else {
                        let computed_bins = ((range / bin_width).ceil() as usize).max(1);
                        // Clamp to reasonable range
                        computed_bins.clamp(1, 2048)
                    }
                }
            }
        }
    };

    // Use fixed-width binning with computed number of bins
    bin_edges_fixed_width(data, bins)
}

/// Result of histogram computation with edges
#[derive(Debug, Clone)]
pub struct HistogramWithEdges {
    pub edges: Vec<f64>,
    pub counts: Vec<usize>,
}

/// Calculate histogram with fixed-width binning, returning edges and counts.
pub fn histogram_fixed_width_with_edges(data: &[f64], bins: usize) -> HistogramWithEdges {
    let edges = bin_edges_fixed_width(data, bins);
    let counts = if edges.is_empty() {
        vec![]
    } else {
        histogram_edges(data, &edges)
    };
    HistogramWithEdges { edges, counts }
}

/// Calculate histogram with equal-frequency binning, returning edges and counts.
pub fn histogram_equal_frequency_with_edges(data: &[f64], bins: usize) -> HistogramWithEdges {
    let edges = bin_edges_equal_frequency(data, bins);
    let counts = if edges.is_empty() {
        vec![]
    } else {
        histogram_edges(data, &edges)
    };
    HistogramWithEdges { edges, counts }
}

/// Calculate histogram with automatic binning, returning edges and counts.
pub fn histogram_auto_with_edges(
    data: &[f64],
    rule: BinningRule,
    bins_override: Option<usize>,
) -> HistogramWithEdges {
    let edges = bin_edges_auto(data, rule, bins_override);
    let counts = if edges.is_empty() {
        vec![]
    } else {
        histogram_edges(data, &edges)
    };
    HistogramWithEdges { edges, counts }
}

/// Calculate histogram with automatic binning and tail collapse, returning edges and counts.
///
/// Tail collapse uses IQR-based outlier detection (k * IQR) to collapse extreme values
/// into the first and last bins.
pub fn histogram_auto_with_edges_collapse_tails(
    data: &[f64],
    rule: BinningRule,
    bins_override: Option<usize>,
    k: f64,
) -> HistogramWithEdges {
    if data.is_empty() {
        return HistogramWithEdges {
            edges: vec![],
            counts: vec![],
        };
    }

    // Compute IQR for outlier detection
    let iqr_val = iqr(data);
    let q = quartiles(data);
    let q1 = q[0];
    let q3 = q[2];

    if iqr_val.is_nan() || q1.is_nan() || q3.is_nan() {
        // Fallback to non-collapsed version
        return histogram_auto_with_edges(data, rule, bins_override);
    }

    // Calculate outlier bounds
    let lower_bound = q1 - k * iqr_val;
    let upper_bound = q3 + k * iqr_val;

    // Filter data to inner range (excluding outliers) for bin edge computation
    let inner_data: Vec<f64> = data
        .iter()
        .filter(|&&x| !x.is_nan() && x >= lower_bound && x <= upper_bound)
        .copied()
        .collect();

    if inner_data.is_empty() {
        // Fallback to non-collapsed version
        return histogram_auto_with_edges(data, rule, bins_override);
    }

    // Compute edges based on inner data
    let inner_edges = bin_edges_auto(&inner_data, rule, bins_override);

    if inner_edges.is_empty() {
        // Fallback to non-collapsed version
        return histogram_auto_with_edges(data, rule, bins_override);
    }

    // Extend edges to include outlier bins
    let mut edges = Vec::with_capacity(inner_edges.len() + 2);
    edges.push(f64::NEG_INFINITY); // For values < lower_bound
    edges.extend_from_slice(&inner_edges);
    edges.push(f64::INFINITY); // For values > upper_bound

    // Use clamped histogram to count outliers in first/last bins
    let counts = histogram_edges_clamped(data, &edges);

    HistogramWithEdges { edges, counts }
}

/// Calculate histogram with custom edges, returning edges and counts.
pub fn histogram_custom_with_edges(
    data: &[f64],
    edges: &[f64],
    clamp_outside: bool,
) -> HistogramWithEdges {
    let edges_vec = edges.to_vec();
    let counts = if clamp_outside {
        histogram_edges_clamped(data, edges)
    } else {
        histogram_edges(data, edges)
    };
    HistogramWithEdges {
        edges: edges_vec,
        counts,
    }
}
