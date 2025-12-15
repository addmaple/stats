use crate::stats::*;
use approx::assert_relative_eq;

#[test]
fn test_regress() {
    // Perfect linear relationship
    let x = [1.0, 2.0, 3.0, 4.0, 5.0];
    let y = [2.0, 4.0, 6.0, 8.0, 10.0];
    let result = regress(&x, &y);
    assert_relative_eq!(result.slope, 2.0, epsilon = 1e-10);
    assert_relative_eq!(result.intercept, 0.0, epsilon = 1e-10);
    assert_relative_eq!(result.r_squared, 1.0, epsilon = 1e-10);
    assert_eq!(result.residuals.len(), 5);
    // All residuals should be close to 0
    for &residual in &result.residuals {
        assert!(residual.abs() < 1e-10);
    }
}

#[test]
fn test_regress_variants_match() {
    // Test that all three regression variants produce the same results
    // Use a realistic dataset with some noise
    let x: Vec<f64> = (0..100).map(|i| i as f64 * 0.1).collect();
    let y: Vec<f64> = x.iter().map(|&xi| 2.5 * xi + 1.0 + (xi * 0.01)).collect();

    let result_naive = regress_naive(&x, &y);
    let result_simd = regress_simd(&x, &y);
    let result_kernels = regress_kernels(&x, &y);
    let result_default = regress(&x, &y);

    // All variants should match within reasonable epsilon (1e-9 for f64)
    assert_relative_eq!(result_naive.slope, result_simd.slope, epsilon = 1e-9);
    assert_relative_eq!(
        result_naive.intercept,
        result_simd.intercept,
        epsilon = 1e-9
    );
    assert_relative_eq!(
        result_naive.r_squared,
        result_simd.r_squared,
        epsilon = 1e-9
    );

    assert_relative_eq!(result_naive.slope, result_kernels.slope, epsilon = 1e-9);
    assert_relative_eq!(
        result_naive.intercept,
        result_kernels.intercept,
        epsilon = 1e-9
    );
    assert_relative_eq!(
        result_naive.r_squared,
        result_kernels.r_squared,
        epsilon = 1e-9
    );

    // Default should match SIMD (since it's an alias)
    assert_relative_eq!(result_default.slope, result_simd.slope, epsilon = 1e-9);
    assert_relative_eq!(
        result_default.intercept,
        result_simd.intercept,
        epsilon = 1e-9
    );
    assert_relative_eq!(
        result_default.r_squared,
        result_simd.r_squared,
        epsilon = 1e-9
    );

    // Residuals should match
    assert_eq!(result_naive.residuals.len(), result_simd.residuals.len());
    assert_eq!(result_naive.residuals.len(), result_kernels.residuals.len());
    for i in 0..result_naive.residuals.len() {
        assert_relative_eq!(
            result_naive.residuals[i],
            result_simd.residuals[i],
            epsilon = 1e-9
        );
        assert_relative_eq!(
            result_naive.residuals[i],
            result_kernels.residuals[i],
            epsilon = 1e-9
        );
    }
}

#[test]
fn test_regress_variants_edge_cases() {
    // Test edge cases: all variants should handle them the same way
    let empty_x: Vec<f64> = vec![];
    let empty_y: Vec<f64> = vec![];

    let result_naive = regress_naive(&empty_x, &empty_y);
    let result_simd = regress_simd(&empty_x, &empty_y);
    let result_kernels = regress_kernels(&empty_x, &empty_y);

    assert!(result_naive.slope.is_nan());
    assert!(result_simd.slope.is_nan());
    assert!(result_kernels.slope.is_nan());

    // Test with constant x (zero variance)
    let const_x = [1.0, 1.0, 1.0, 1.0, 1.0];
    let y = [2.0, 3.0, 4.0, 5.0, 6.0];

    let result_naive = regress_naive(&const_x, &y);
    let result_simd = regress_simd(&const_x, &y);
    let result_kernels = regress_kernels(&const_x, &y);

    assert!(result_naive.slope.is_nan());
    assert!(result_simd.slope.is_nan());
    assert!(result_kernels.slope.is_nan());
}
