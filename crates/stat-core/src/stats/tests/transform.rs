use crate::stats::*;

#[test]
fn test_cumsum() {
    assert_eq!(cumsum(&[]), Vec::<f64>::new());
    assert_eq!(cumsum(&[1.0, 2.0, 3.0]), vec![1.0, 3.0, 6.0]);
}

#[test]
fn test_diff() {
    assert_eq!(diff(&[1.0]), Vec::<f64>::new());
    assert_eq!(diff(&[1.0, 4.0, 9.0]), vec![3.0, 5.0]);
}

#[test]
fn test_cumprod() {
    assert_eq!(cumprod(&[]), Vec::<f64>::new());
    assert_eq!(cumprod(&[1.0, 2.0, 3.0]), vec![1.0, 2.0, 6.0]);
    assert_eq!(cumprod(&[2.0, 3.0, 4.0]), vec![2.0, 6.0, 24.0]);
}

#[test]
fn test_cumreduce() {
    let data = [1.0, 2.0, 3.0];

    // Cumulative sum
    let cum_sum = cumreduce(&data, 0.0, |acc, x| acc + x);
    assert_eq!(cum_sum, vec![1.0, 3.0, 6.0]);

    // Cumulative product
    let cum_prod = cumreduce(&data, 1.0, |acc, x| acc * x);
    assert_eq!(cum_prod, vec![1.0, 2.0, 6.0]);

    // Cumulative sum of squares
    let cum_sq = cumreduce(&data, 0.0, |acc, x| acc + x * x);
    assert_eq!(cum_sq, vec![1.0, 5.0, 14.0]);

    // Empty data
    assert_eq!(cumreduce(&[], 0.0, |acc, x| acc + x), Vec::<f64>::new());
}
