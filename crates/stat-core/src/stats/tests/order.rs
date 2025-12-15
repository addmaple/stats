use crate::stats::*;
use approx::assert_relative_eq;

#[test]
fn test_rank() {
    let data = [10.0, 20.0, 20.0, 30.0];
    let expected = vec![1.0, 2.5, 2.5, 4.0];
    assert_eq!(rank(&data), expected);
}

#[test]
fn test_median() {
    assert!(median(&[]).is_nan());
    assert_eq!(median(&[2.0, 1.0, 3.0]), 2.0);
    assert_eq!(median(&[1.0, 2.0, 3.0, 4.0]), 2.5);
}

#[test]
fn test_mode_function() {
    assert!(mode(&[]).is_nan());
    assert_eq!(mode(&[1.0, 2.0, 2.0, 3.0]), 2.0);
    assert!(mode(&[1.0, 2.0, 3.0, 4.0]).is_nan());
    assert_eq!(mode(&[1.0, 1.0, 2.0, 2.0, 3.0]), 1.0);
}

#[test]
fn test_geomean() {
    assert!(geomean(&[]).is_nan());
    assert!(geomean(&[1.0, 0.0, 2.0]).is_nan());
    let data = [1.0, 3.0, 9.0];
    assert_relative_eq!(geomean(&data), 3.0, epsilon = 1e-12);
}

#[test]
fn test_percentile() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

    // Test median (50th percentile)
    assert_relative_eq!(percentile_inclusive(&data, 0.5), 5.5, epsilon = 1e-10);

    // Test quartiles
    assert_relative_eq!(percentile_inclusive(&data, 0.25), 3.25, epsilon = 1e-10);
    assert_relative_eq!(percentile_inclusive(&data, 0.75), 7.75, epsilon = 1e-10);

    // Edge cases
    assert_relative_eq!(percentile_inclusive(&data, 0.0), 1.0, epsilon = 1e-10);
    assert_relative_eq!(percentile_inclusive(&data, 1.0), 10.0, epsilon = 1e-10);

    // Invalid inputs
    assert!(percentile_inclusive(&[], 0.5).is_nan());
    assert!(percentile_inclusive(&data, -0.1).is_nan());
    assert!(percentile_inclusive(&data, 1.1).is_nan());
}

#[test]
fn test_quantiles() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
    let qs = quantiles(&data, &[0.25, 0.5, 0.75]);

    assert_eq!(qs.len(), 3);
    assert_relative_eq!(qs[0], 2.9375, epsilon = 1e-10);
    assert_relative_eq!(qs[1], 5.5, epsilon = 1e-10);
    assert_relative_eq!(qs[2], 8.0625, epsilon = 1e-10);
}

#[test]
fn test_quartiles() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];
    let q = quartiles(&data);

    // jStat uses round-based indexing
    assert_eq!(q[0], 2.0); // Q1
    assert_eq!(q[1], 4.0); // Q2 (median)
    assert_eq!(q[2], 6.0); // Q3
}

#[test]
fn test_iqr() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0];
    let q = quartiles(&data);
    assert_eq!(iqr(&data), q[2] - q[0]);
}

#[test]
fn test_percentile_of_score() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

    // Score at median
    assert_relative_eq!(percentile_of_score(&data, 5.5, false), 0.5, epsilon = 1e-10);

    // Score at first quartile
    assert_relative_eq!(percentile_of_score(&data, 3.0, false), 0.3, epsilon = 1e-10);

    // Score at end
    assert_relative_eq!(
        percentile_of_score(&data, 10.0, false),
        1.0,
        epsilon = 1e-10
    );

    // Score at beginning
    assert_relative_eq!(percentile_of_score(&data, 1.0, false), 0.1, epsilon = 1e-10);

    // Strict mode
    assert_relative_eq!(percentile_of_score(&data, 5.0, true), 0.4, epsilon = 1e-10);
}

#[test]
fn test_qscore() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

    // qscore should match percentile_of_score
    let score = 5.5;
    let qs = qscore(&data, score, false);
    let pos = percentile_of_score(&data, score, false);
    assert_relative_eq!(qs, pos, epsilon = 1e-10);

    assert!(qscore(&[], 5.0, false).is_nan());
}

#[test]
fn test_qtest() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];

    // Score 5.5 should be in middle 50% (0.25 to 0.75)
    assert!(qtest(&data, 5.5, 0.25, 0.75));

    // Score 1.0 should be in bottom 10% (0.0 to 0.1)
    assert!(qtest(&data, 1.0, 0.0, 0.1));

    // Score 10.0 should be in top 10% (0.9 to 1.0)
    assert!(qtest(&data, 10.0, 0.9, 1.0));

    // Score 5.0 should NOT be in top 10%
    assert!(!qtest(&data, 5.0, 0.9, 1.0));

    // Invalid ranges
    assert!(!qtest(&[], 5.0, 0.25, 0.75));
    assert!(!qtest(&data, 5.0, 0.75, 0.25)); // q_lower > q_upper
}

// =============================================================================
// Weighted Quantile Tests
// =============================================================================

#[test]
fn test_weighted_percentile_equal_weights() {
    // With equal weights, weighted percentile should behave like regular percentile
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let weights = [1.0, 1.0, 1.0, 1.0, 1.0];

    let result = weighted_percentile(&data, &weights, 0.5);
    assert_relative_eq!(result, 3.0, epsilon = 1e-10);

    // Extremes
    let result_0 = weighted_percentile(&data, &weights, 0.0);
    assert_relative_eq!(result_0, 1.0, epsilon = 1e-10);

    let result_1 = weighted_percentile(&data, &weights, 1.0);
    assert_relative_eq!(result_1, 5.0, epsilon = 1e-10);
}

#[test]
fn test_weighted_percentile_unequal_weights() {
    // Higher weight on larger values should shift median upward
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let weights = [1.0, 1.0, 1.0, 1.0, 5.0]; // 5 has 5x more weight

    let result = weighted_percentile(&data, &weights, 0.5);
    // Total weight = 9, half = 4.5
    // Cum weights (centers): 0.5/9, 1.5/9, 2.5/9, 3.5/9, 6.5/9
    // = 0.0556, 0.1667, 0.2778, 0.3889, 0.7222
    // 0.5 is between 0.3889 (at 4) and 0.7222 (at 5)
    assert!(result > 4.0 && result < 5.0);
}

#[test]
fn test_weighted_percentile_single_dominant_weight() {
    // One value has all the weight
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let weights = [0.0, 0.0, 1.0, 0.0, 0.0]; // Only 3 has weight

    let result = weighted_percentile(&data, &weights, 0.5);
    assert_relative_eq!(result, 3.0, epsilon = 1e-10);
}

#[test]
fn test_weighted_percentile_edge_cases() {
    // Empty data
    assert!(weighted_percentile(&[], &[], 0.5).is_nan());

    // Mismatched lengths
    let data = [1.0, 2.0, 3.0];
    let weights = [1.0, 1.0];
    assert!(weighted_percentile(&data, &weights, 0.5).is_nan());

    // Invalid percentile
    let weights_ok = [1.0, 1.0, 1.0];
    assert!(weighted_percentile(&data, &weights_ok, -0.1).is_nan());
    assert!(weighted_percentile(&data, &weights_ok, 1.1).is_nan());

    // Negative weight
    let neg_weights = [1.0, -1.0, 1.0];
    assert!(weighted_percentile(&data, &neg_weights, 0.5).is_nan());

    // All zero weights
    let zero_weights = [0.0, 0.0, 0.0];
    assert!(weighted_percentile(&data, &zero_weights, 0.5).is_nan());

    // NaN in data
    let nan_data = [1.0, f64::NAN, 3.0];
    assert!(weighted_percentile(&nan_data, &weights_ok, 0.5).is_nan());

    // NaN in weights
    let nan_weights = [1.0, f64::NAN, 1.0];
    assert!(weighted_percentile(&data, &nan_weights, 0.5).is_nan());
}

#[test]
fn test_weighted_quantiles() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let weights = [1.0, 1.0, 1.0, 1.0, 1.0];
    let qs = [0.25, 0.5, 0.75];

    let result = weighted_quantiles(&data, &weights, &qs);
    assert_eq!(result.len(), 3);

    // With equal weights, should be close to regular quantiles
    assert!(result[0] > 1.5 && result[0] < 2.5);
    assert_relative_eq!(result[1], 3.0, epsilon = 1e-10);
    assert!(result[2] > 3.5 && result[2] < 4.5);
}

#[test]
fn test_weighted_quantiles_empty() {
    let result = weighted_quantiles(&[], &[], &[0.5]);
    assert_eq!(result.len(), 1);
    assert!(result[0].is_nan());
}

#[test]
fn test_weighted_median() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let weights = [1.0, 1.0, 1.0, 1.0, 1.0];

    let result = weighted_median(&data, &weights);
    assert_relative_eq!(result, 3.0, epsilon = 1e-10);

    // Verify it matches weighted_percentile at 0.5
    let percentile_result = weighted_percentile(&data, &weights, 0.5);
    assert_relative_eq!(result, percentile_result, epsilon = 1e-10);
}
