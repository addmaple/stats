use crate::stats::*;

#[test]
fn test_min() {
    assert!(min(&[]).is_nan());
    assert_eq!(min(&[5.0, 2.0, 8.0, 1.0, 9.0]), 1.0);
    assert_eq!(min(&[1.0]), 1.0);
}

#[test]
fn test_max() {
    assert!(max(&[]).is_nan());
    assert_eq!(max(&[5.0, 2.0, 8.0, 1.0, 9.0]), 9.0);
    assert_eq!(max(&[1.0]), 1.0);
}

#[test]
fn test_product() {
    assert!(product(&[]).is_nan());
    assert_eq!(product(&[2.0, 3.0, 4.0]), 24.0);
    assert_eq!(product(&[1.0, 2.0, 0.0, 4.0]), 0.0);
}

#[test]
fn test_range() {
    assert!(range(&[]).is_nan());
    assert_eq!(range(&[1.0, 5.0, 3.0, 9.0, 2.0]), 8.0);
}



