use crate::stats::*;
use approx::assert_relative_eq;

#[test]
fn test_sum() {
    assert_eq!(sum(&[]), 0.0);
    assert_eq!(sum(&[1.0]), 1.0);
    assert_eq!(sum(&[1.0, 2.0, 3.0]), 6.0);
    assert_eq!(sum(&[1.0, -2.0, 3.0]), 2.0);
    // Test large array to exercise SIMD
    let large: Vec<f64> = (0..1000).map(|i| i as f64).collect();
    assert_eq!(sum(&large), 499500.0);
}

#[test]
fn test_mean() {
    assert!(mean(&[]).is_nan());
    assert_eq!(mean(&[1.0]), 1.0);
    assert_eq!(mean(&[1.0, 2.0, 3.0]), 2.0);
    assert_eq!(mean(&[1.0, 2.0, 3.0, 4.0]), 2.5);
}

#[test]
fn test_variance() {
    assert!(variance(&[]).is_nan());
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let var = variance(&data);
    assert_relative_eq!(var, 2.0, epsilon = 1e-10);
}

#[test]
fn test_sample_variance() {
    assert!(sample_variance(&[]).is_nan());
    assert!(sample_variance(&[1.0]).is_nan());
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let var = sample_variance(&data);
    assert_relative_eq!(var, 2.5, epsilon = 1e-10);
}

#[test]
fn test_stdev() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    assert_relative_eq!(stdev(&data), 2.0_f64.sqrt(), epsilon = 1e-10);
}

#[test]
fn test_coeffvar() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let cv = coeffvar(&data);
    let expected = stdev(&data) / mean(&data);
    assert_relative_eq!(cv, expected, epsilon = 1e-10);

    // Zero mean should return NaN
    assert!(coeffvar(&[0.0, 0.0, 0.0]).is_nan());
}

#[test]
fn test_deviation() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let devs = deviation(&data);
    let mean_val = mean(&data);
    assert_eq!(devs.len(), 5);
    for (i, &dev) in devs.iter().enumerate() {
        assert_relative_eq!(dev, data[i] - mean_val, epsilon = 1e-10);
    }

    assert_eq!(deviation(&[]), Vec::<f64>::new());
}

#[test]
fn test_meandev() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let md = meandev(&data);
    let m = mean(&data);
    let expected: f64 = data.iter().map(|&x| (x - m).abs()).sum::<f64>() / (data.len() as f64);
    assert_relative_eq!(md, expected, epsilon = 1e-10);

    assert!(meandev(&[]).is_nan());
}

#[test]
fn test_meddev() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let md = meddev(&data);
    let med = median(&data);
    // meddev returns the median of absolute deviations, not the mean
    let abs_deviations: Vec<f64> = data.iter().map(|&x| (x - med).abs()).collect();
    let expected = median(&abs_deviations);
    assert_relative_eq!(md, expected, epsilon = 1e-10);

    assert!(meddev(&[]).is_nan());
}

#[test]
fn test_pooledvariance() {
    let data1 = [1.0, 2.0, 3.0, 4.0, 5.0];
    let data2 = [6.0, 7.0, 8.0, 9.0, 10.0];
    let pooled_var = pooledvariance(&data1, &data2);

    let var1 = sample_variance(&data1);
    let var2 = sample_variance(&data2);
    let n1 = data1.len() as f64;
    let n2 = data2.len() as f64;
    let expected = ((n1 - 1.0) * var1 + (n2 - 1.0) * var2) / (n1 + n2 - 2.0);
    assert_relative_eq!(pooled_var, expected, epsilon = 1e-10);

    assert!(pooledvariance(&[1.0], &data2).is_nan());
    assert!(pooledvariance(&data1, &[1.0]).is_nan());
}

#[test]
fn test_pooledstdev() {
    let data1 = [1.0, 2.0, 3.0, 4.0, 5.0];
    let data2 = [6.0, 7.0, 8.0, 9.0, 10.0];
    let pooled_std = pooledstdev(&data1, &data2);
    let pooled_var = pooledvariance(&data1, &data2);
    assert_relative_eq!(pooled_std, pooled_var.sqrt(), epsilon = 1e-10);
}

#[test]
fn test_stan_moment() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];

    // k=1 should always be 0
    assert_relative_eq!(stan_moment(&data, 1), 0.0, epsilon = 1e-10);

    // k=2 should always be 1
    assert_relative_eq!(stan_moment(&data, 2), 1.0, epsilon = 1e-10);

    // k=3 should match skewness
    let skew = skewness(&data);
    let stan_m3 = stan_moment(&data, 3);
    assert_relative_eq!(stan_m3, skew, epsilon = 1e-10);

    // k=4 should match kurtosis (but kurtosis is excess kurtosis, so add 3)
    let kurt = kurtosis(&data);
    let stan_m4 = stan_moment(&data, 4);
    // stan_moment returns raw standardized moment, kurtosis returns excess (raw - 3)
    assert_relative_eq!(stan_m4, kurt + 3.0, epsilon = 1e-10);

    assert!(stan_moment(&[], 1).is_nan());
}
