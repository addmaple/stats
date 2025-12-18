use crate::stats::*;
use approx::assert_relative_eq;

#[test]
fn test_anova_f_score() {
    let control = [2.0, 3.0, 7.0, 2.0, 6.0];
    let test = [10.0, 11.0, 14.0, 13.0, 15.0];
    let f = anova_f_score(&[&control, &test]);
    assert_relative_eq!(f, 37.73469387755101, epsilon = 1e-10);
}

#[test]
fn test_anova_three_groups() {
    let g1 = [1.0, 2.0, 3.0];
    let g2 = [4.0, 5.0, 6.0];
    let g3 = [7.0, 8.0, 9.0];
    let result = anova(&[&g1, &g2, &g3]);
    assert_eq!(result.df_between, 2);
    assert_eq!(result.df_within, 6);
    assert_relative_eq!(result.f_score, 27.0, epsilon = 1e-10);
}

#[test]
fn test_anova_edge_cases() {
    let g1 = [1.0, 2.0, 3.0];
    assert!(anova_f_score(&[&g1]).is_nan());
    let empty: &[f64] = &[];
    assert!(anova_f_score(&[empty, empty]).is_nan());
}

#[test]
fn test_ttest() {
    // Test with known data
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let result = ttest(&data, 3.0);
    // Mean is 3.0, so t-statistic should be close to 0
    assert!(result.statistic.abs() < 0.1);
    assert!(result.p_value > 0.9); // High p-value when null is true
    assert_eq!(result.df, Some(4.0));

    // Test with different null hypothesis
    let result2 = ttest(&data, 0.0);
    assert!(result2.statistic > 0.0);
    assert!(result2.p_value < 0.05); // Low p-value when null is false
}

#[test]
fn test_ztest() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0];
    let result = ztest(&data, 3.0, 1.414);
    // Mean is 3.0, so z-statistic should be close to 0
    assert!(result.statistic.abs() < 0.1);
    assert!(result.p_value > 0.9);
    assert_eq!(result.df, None);
}

#[test]
fn test_normalci() {
    // 95% confidence interval for mean=100, se=10
    let ci = normalci(0.05, 100.0, 10.0);
    // Should be approximately [80.4, 119.6] (100 ± 1.96 * 10)
    assert!(ci[0] > 80.0 && ci[0] < 81.0);
    assert!(ci[1] > 119.0 && ci[1] < 120.0);
    assert!(ci[0] < ci[1]);
}

#[test]
fn test_tci() {
    // 95% confidence interval for mean=100, stdev=10, n=20
    let ci = tci(0.05, 100.0, 10.0, 20.0);
    // Should be approximately [95.3, 104.7] (100 ± t(0.025, 19) * 10/√20)
    assert!(ci[0] > 95.0 && ci[0] < 96.0);
    assert!(ci[1] > 104.0 && ci[1] < 105.0);
    assert!(ci[0] < ci[1]);
}

#[test]
fn test_chi_square_test() {
    // Test with independent variables (should have low chi-square)
    let cat1 = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
    let cat2 = vec!["X".to_string(), "Y".to_string(), "X".to_string(), "Y".to_string()];
    let result = chi_square_test(&cat1, &cat2);
    
    // Should have valid results
    assert!(!result.statistic.is_nan());
    assert!(!result.p_value.is_nan());
    assert_eq!(result.df, 1); // (2-1) * (2-1) = 1
    
    // Test with dependent variables (should have higher chi-square)
    let cat1_dep = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
    let cat2_dep = vec!["X".to_string(), "X".to_string(), "Y".to_string(), "Y".to_string()];
    let result_dep = chi_square_test(&cat1_dep, &cat2_dep);
    
    assert!(!result_dep.statistic.is_nan());
    assert!(!result_dep.p_value.is_nan());
    // Dependent case should have higher chi-square statistic
    assert!(result_dep.statistic > result.statistic);
}

#[test]
fn test_chi_square_test_edge_cases() {
    // Empty arrays
    let empty: Vec<String> = vec![];
    let result = chi_square_test(&empty, &empty);
    assert!(result.statistic.is_nan());
    assert!(result.df == 0);
    
    // Mismatched lengths
    let cat1 = vec!["A".to_string(), "B".to_string()];
    let cat2 = vec!["X".to_string()];
    let result = chi_square_test(&cat1, &cat2);
    assert!(result.statistic.is_nan());
    
    // Single category (should return NaN)
    let cat1_single = vec!["A".to_string(), "A".to_string()];
    let cat2_single = vec!["X".to_string(), "X".to_string()];
    let result = chi_square_test(&cat1_single, &cat2_single);
    assert!(result.statistic.is_nan());
}

#[test]
fn test_chi_square_test_with_cardinality() {
    // Test that optimized version produces same results as standard version
    let cat1 = vec!["A".to_string(), "A".to_string(), "B".to_string(), "B".to_string()];
    let cat2 = vec!["X".to_string(), "Y".to_string(), "X".to_string(), "Y".to_string()];
    
    let result_standard = chi_square_test(&cat1, &cat2);
    let result_optimized = chi_square_test_with_cardinality(&cat1, &cat2, Some(2), Some(2));
    
    // Should produce identical results
    assert_relative_eq!(result_standard.statistic, result_optimized.statistic, epsilon = 1e-10);
    assert_relative_eq!(result_standard.p_value, result_optimized.p_value, epsilon = 1e-10);
    assert_eq!(result_standard.df, result_optimized.df);
    
    // Test with wrong cardinality (should fall back to standard)
    let result_wrong_card = chi_square_test_with_cardinality(&cat1, &cat2, Some(10), Some(10));
    assert_relative_eq!(result_standard.statistic, result_wrong_card.statistic, epsilon = 1e-10);
    
    // Test with None cardinalities (should use standard)
    let result_none = chi_square_test_with_cardinality(&cat1, &cat2, None, None);
    assert_relative_eq!(result_standard.statistic, result_none.statistic, epsilon = 1e-10);
}

#[test]
fn test_anova_f_score_categorical() {
    // Test equivalent to regular anova_f_score
    let groups = vec![
        "A".to_string(), "A".to_string(), "A".to_string(),
        "B".to_string(), "B".to_string(), "B".to_string(),
    ];
    let values = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0];
    
    let f_categorical = anova_f_score_categorical(&groups, &values);
    
    // Compare with regular anova_f_score
    let group_a = [1.0, 2.0, 3.0];
    let group_b = [4.0, 5.0, 6.0];
    let f_regular = anova_f_score(&[&group_a, &group_b]);
    
    assert_relative_eq!(f_categorical, f_regular, epsilon = 1e-10);
}

#[test]
fn test_anova_categorical() {
    let groups = vec![
        "Group1".to_string(), "Group1".to_string(), "Group1".to_string(),
        "Group2".to_string(), "Group2".to_string(), "Group2".to_string(),
        "Group3".to_string(), "Group3".to_string(), "Group3".to_string(),
    ];
    let values = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0];
    
    let result = anova_categorical(&groups, &values);
    
    assert!(!result.f_score.is_nan());
    assert_eq!(result.df_between, 2); // 3 groups - 1
    assert_eq!(result.df_within, 6); // 9 total - 3 groups
    
    // Compare with regular anova
    let g1 = [1.0, 2.0, 3.0];
    let g2 = [4.0, 5.0, 6.0];
    let g3 = [7.0, 8.0, 9.0];
    let result_regular = anova(&[&g1, &g2, &g3]);
    
    assert_relative_eq!(result.f_score, result_regular.f_score, epsilon = 1e-10);
    assert_eq!(result.df_between, result_regular.df_between);
    assert_eq!(result.df_within, result_regular.df_within);
}

#[test]
fn test_anova_categorical_edge_cases() {
    // Empty arrays
    let empty_groups: Vec<String> = vec![];
    let empty_values: Vec<f64> = vec![];
    let result = anova_categorical(&empty_groups, &empty_values);
    assert!(result.f_score.is_nan());
    
    // Mismatched lengths
    let groups = vec!["A".to_string(), "B".to_string()];
    let values = vec![1.0];
    let result = anova_categorical(&groups, &values);
    assert!(result.f_score.is_nan());
    
    // Single group
    let single_group = vec!["A".to_string(), "A".to_string()];
    let single_values = vec![1.0, 2.0];
    let result = anova_categorical(&single_group, &single_values);
    assert!(result.f_score.is_nan());
}




