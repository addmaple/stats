use crate::stats::*;

#[test]
fn test_histogram() {
    let data = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0];
    
    // 4 bins (default-like)
    let bins = histogram(&data, 4);
    assert_eq!(bins.len(), 4);
    assert_eq!(bins.iter().sum::<usize>(), 10);
    
    // 2 bins
    let bins = histogram(&data, 2);
    assert_eq!(bins.len(), 2);
    assert_eq!(bins[0] + bins[1], 10);
    
    // Empty data
    let bins = histogram(&[], 4);
    assert_eq!(bins, vec![0, 0, 0, 0]);
    
    // All same values
    let same = [5.0, 5.0, 5.0];
    let bins = histogram(&same, 4);
    assert_eq!(bins[0], 3);
}

#[test]
fn test_histogram_edges() {
    let data = [1.0, 2.5, 3.5, 5.0, 7.0, 8.0, 9.5];
    let edges = [0.0, 3.0, 6.0, 10.0];
    
    let bins = histogram_edges(&data, &edges);
    assert_eq!(bins.len(), 3);
    assert_eq!(bins[0], 2); // [0, 3): 1.0, 2.5
    assert_eq!(bins[1], 2); // [3, 6): 3.5, 5.0
    assert_eq!(bins[2], 3); // [6, 10]: 7.0, 8.0, 9.5
    
    // Values outside range
    let data = [-1.0, 0.0, 5.0, 10.0, 11.0];
    let edges = [0.0, 5.0, 10.0];
    let bins = histogram_edges(&data, &edges);
    // 0.0 in first bin, 5.0 in second bin (edge goes to next bin), 10.0 in last bin
    assert_eq!(bins[0], 1); // 0.0
    assert_eq!(bins[1], 2); // 5.0, 10.0 (last edge included in last bin)
}





