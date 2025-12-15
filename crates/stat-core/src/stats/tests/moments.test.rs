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
