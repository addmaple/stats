use crate::stats::*;
use approx::assert_relative_eq;
use ndarray::Array1;
use ndarray_stats::SummaryStatisticsExt;

#[test]
fn test_skewness_matches_ndarray() {
    let data = [1.0, 2.0, 4.0, 8.0, 16.0];
    let arr = Array1::from_vec(data.to_vec());
    let expected = arr.skewness().unwrap();
    assert_relative_eq!(skewness(&data), expected, epsilon = 1e-12);
}

#[test]
fn test_kurtosis_matches_ndarray() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
    let arr = Array1::from_vec(data.to_vec());
    // ndarray returns raw kurtosis, our function returns excess kurtosis (raw - 3)
    let expected = arr.kurtosis().unwrap();
    assert_relative_eq!(kurtosis(&data) + 3.0, expected, epsilon = 1e-12);
}

#[test]
fn test_moments_degenerate_and_non_finite() {
    // Too-short inputs
    assert!(skewness(&[1.0, 2.0]).is_nan());
    assert!(kurtosis(&[1.0, 2.0, 3.0]).is_nan());

    // Constant series -> undefined (division by 0 variance)
    assert!(skewness(&[5.0, 5.0, 5.0]).is_nan());
    assert!(kurtosis(&[5.0, 5.0, 5.0, 5.0]).is_nan());

    // Non-finite values
    assert!(skewness(&[1.0, f64::INFINITY, 2.0]).is_nan());
    assert!(kurtosis(&[1.0, 2.0, 3.0, f64::NEG_INFINITY]).is_nan());
}
