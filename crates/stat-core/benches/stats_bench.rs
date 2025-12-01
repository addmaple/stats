use criterion::{black_box, criterion_group, criterion_main, Criterion};
use stat_core::*;

fn generate_data(n: usize) -> Vec<f64> {
    (0..n).map(|i| (i as f64) * 0.1).collect()
}

fn bench_sum(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("sum 1M", |b| b.iter(|| sum(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("sum 10K", |b| b.iter(|| sum(black_box(&data))));
}

fn bench_mean(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("mean 1M", |b| b.iter(|| mean(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("mean 10K", |b| b.iter(|| mean(black_box(&data))));
}

fn bench_variance(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("variance 1M", |b| b.iter(|| variance(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("variance 10K", |b| b.iter(|| variance(black_box(&data))));
}

fn bench_stdev(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("stdev 1M", |b| b.iter(|| stdev(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("stdev 10K", |b| b.iter(|| stdev(black_box(&data))));
}

fn bench_min(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("min 1M", |b| b.iter(|| min(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("min 10K", |b| b.iter(|| min(black_box(&data))));
}

fn bench_max(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("max 1M", |b| b.iter(|| max(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("max 10K", |b| b.iter(|| max(black_box(&data))));
}

fn bench_product(c: &mut Criterion) {
    let data = generate_data(100_000); // avoid overflow with smaller set
    c.bench_function("product 100K", |b| b.iter(|| product(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("product 10K", |b| b.iter(|| product(black_box(&data))));
}

fn bench_range(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("range 1M", |b| b.iter(|| range(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("range 10K", |b| b.iter(|| range(black_box(&data))));
}

fn bench_covariance(c: &mut Criterion) {
    let data_x = generate_data(1_000_000);
    let data_y: Vec<f64> = data_x.iter().map(|v| v * 1.5 + 1.0).collect();
    c.bench_function("covariance 1M", |b| {
        b.iter(|| covariance(black_box(&data_x), black_box(&data_y)))
    });

    let data_x = generate_data(10_000);
    let data_y: Vec<f64> = data_x.iter().map(|v| v * 1.5 + 1.0).collect();
    c.bench_function("covariance 10K", |b| {
        b.iter(|| covariance(black_box(&data_x), black_box(&data_y)))
    });
}

fn bench_corrcoeff(c: &mut Criterion) {
    let data_x = generate_data(1_000_000);
    let data_y: Vec<f64> = data_x.iter().map(|v| v * -0.5 + 3.0).collect();
    c.bench_function("corrcoeff 1M", |b| {
        b.iter(|| corrcoeff(black_box(&data_x), black_box(&data_y)))
    });

    let data_x = generate_data(10_000);
    let data_y: Vec<f64> = data_x.iter().map(|v| v * -0.5 + 3.0).collect();
    c.bench_function("corrcoeff 10K", |b| {
        b.iter(|| corrcoeff(black_box(&data_x), black_box(&data_y)))
    });
}

fn bench_cumsum(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("cumsum 1M", |b| b.iter(|| cumsum(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("cumsum 10K", |b| b.iter(|| cumsum(black_box(&data))));
}

fn bench_diff(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("diff 1M", |b| b.iter(|| diff(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("diff 10K", |b| b.iter(|| diff(black_box(&data))));
}

fn bench_rank(c: &mut Criterion) {
    let data = generate_data(100_000);
    c.bench_function("rank 100K", |b| b.iter(|| rank(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("rank 10K", |b| b.iter(|| rank(black_box(&data))));
}

fn bench_median(c: &mut Criterion) {
    let mut data = generate_data(1_000_000);
    c.bench_function("median 1M", |b| b.iter(|| median(black_box(&data))));

    data = generate_data(10_000);
    c.bench_function("median 10K", |b| b.iter(|| median(black_box(&data))));
}

fn bench_mode(c: &mut Criterion) {
    let mut data = generate_data(1_000_000);
    c.bench_function("mode 1M", |b| b.iter(|| mode(black_box(&data))));

    data = generate_data(10_000);
    c.bench_function("mode 10K", |b| b.iter(|| mode(black_box(&data))));
}

fn bench_geomean(c: &mut Criterion) {
    let mut data = generate_data(1_000_000);
    for v in data.iter_mut() {
        *v += 5.0;
    }
    c.bench_function("geomean 1M", |b| b.iter(|| geomean(black_box(&data))));

    let mut data_small = generate_data(10_000);
    for v in data_small.iter_mut() {
        *v += 5.0;
    }
    c.bench_function("geomean 10K", |b| {
        b.iter(|| geomean(black_box(&data_small)))
    });
}

fn bench_skewness(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("skewness 1M", |b| b.iter(|| skewness(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("skewness 10K", |b| b.iter(|| skewness(black_box(&data))));
}

fn bench_kurtosis(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("kurtosis 1M", |b| b.iter(|| kurtosis(black_box(&data))));

    let data = generate_data(10_000);
    c.bench_function("kurtosis 10K", |b| b.iter(|| kurtosis(black_box(&data))));
}

fn bench_histogram(c: &mut Criterion) {
    let data = generate_data(1_000_000);
    c.bench_function("histogram 1M (10 bins)", |b| b.iter(|| histogram(black_box(&data), 10)));

    let data = generate_data(10_000);
    c.bench_function("histogram 10K (10 bins)", |b| b.iter(|| histogram(black_box(&data), 10)));
    
    let data = generate_data(1_000);
    c.bench_function("histogram 1K (10 bins)", |b| b.iter(|| histogram(black_box(&data), 10)));
}

criterion_group!(
    benches,
    bench_sum,
    bench_mean,
    bench_variance,
    bench_stdev,
    bench_min,
    bench_max,
    bench_product,
    bench_range,
    bench_covariance,
    bench_corrcoeff,
    bench_cumsum,
    bench_diff,
    bench_rank,
    bench_median,
    bench_mode,
    bench_geomean,
    bench_skewness,
    bench_kurtosis,
    bench_histogram
);
criterion_main!(benches);
