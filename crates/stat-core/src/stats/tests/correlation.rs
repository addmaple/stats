use crate::stats::*;
use approx::assert_relative_eq;

#[test]
fn test_covariance() {
    let x = [2.0, 4.0, 6.0];
    let y = [1.0, 3.0, 5.0];
    let cov = covariance(&x, &y);
    assert_relative_eq!(cov, 8.0 / 3.0, epsilon = 1e-12);
}

#[test]
fn test_covariance_invalid() {
    let x = [1.0, 2.0];
    let y = [1.0];
    assert!(covariance(&x, &y).is_nan());
    assert!(covariance(&[], &[]).is_nan());
}

#[test]
fn test_corrcoeff() {
    let x = [2.0, 4.0, 6.0];
    let y = [1.0, 3.0, 5.0];
    let corr = corrcoeff(&x, &y);
    assert_relative_eq!(corr, 1.0, epsilon = 1e-12);
}

#[test]
fn test_corrcoeff_zero_variance() {
    let x = [1.0, 1.0, 1.0];
    let y = [2.0, 3.0, 4.0];
    assert!(corrcoeff(&x, &y).is_nan());
}

#[test]
fn test_corrcoeff_large_offsets_stable() {
    // Stress test: large offset + small variation should still yield corr ~= 1
    let n = 10_000;
    let base = 1.0e12;
    let x: Vec<f64> = (0..n).map(|i| base + i as f64).collect();
    let y: Vec<f64> = (0..n).map(|i| base + 2.0 * i as f64).collect();

    let corr = corrcoeff(&x, &y);
    assert_relative_eq!(corr, 1.0, epsilon = 1e-12);
}

#[test]
fn test_spearmancoeff() {
    let x = [1.0, 2.0, 3.0, 4.0, 5.0];
    let y = [2.0, 4.0, 6.0, 8.0, 10.0];
    // Perfect monotonic relationship
    assert_relative_eq!(spearmancoeff(&x, &y), 1.0, epsilon = 1e-10);

    // Reversed should be -1
    let y_rev = [10.0, 8.0, 6.0, 4.0, 2.0];
    assert_relative_eq!(spearmancoeff(&x, &y_rev), -1.0, epsilon = 1e-10);
}
