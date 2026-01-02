use criterion::{black_box, criterion_group, criterion_main, Criterion};
use ndarray::ArrayView1;
use stat_core::*;
use std::fs;

fn generate_data(n: usize) -> Vec<f64> {
    (0..n).map(|i| (i as f64) * 0.1).collect()
}

fn regress_ndarray(x: &[f64], y: &[f64]) -> RegressionResult {
    if x.len() != y.len() || x.len() < 2 {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    let xa = ArrayView1::from(x);
    let ya = ArrayView1::from(y);

    let x_mean = xa.mean().unwrap_or(f64::NAN);
    let y_mean = ya.mean().unwrap_or(f64::NAN);

    // centered
    let dx = &xa - x_mean;
    let dy = &ya - y_mean;

    let num = (&dx * &dy).sum();
    let den = (&dx * &dx).sum();
    if den == 0.0 || den.is_nan() {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    let slope = num / den;
    let intercept = y_mean - slope * x_mean;

    let y_pred = xa.mapv(|xi| xi.mul_add(slope, intercept));
    let residuals_arr = &ya - &y_pred;
    let residuals = residuals_arr.to_vec();

    let ss_res = (&residuals_arr * &residuals_arr).sum();
    let ss_tot = (&dy * &dy).sum();
    let r_squared = if ss_tot > 0.0 && !ss_tot.is_nan() {
        1.0 - (ss_res / ss_tot)
    } else {
        f64::NAN
    };

    RegressionResult {
        slope,
        intercept,
        r_squared,
        residuals,
    }
}

fn regress_faer_normal_eq(x: &[f64], y: &[f64]) -> RegressionResult {
    use faer::linalg::solvers::Solve;

    if x.len() != y.len() || x.len() < 2 {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    let n = x.len() as f64;

    // Compute the normal equation terms in one pass
    let mut sum_x = 0.0;
    let mut sum_y = 0.0;
    let mut sum_xx = 0.0;
    let mut sum_xy = 0.0;
    for i in 0..x.len() {
        let xi = x[i];
        let yi = y[i];
        sum_x += xi;
        sum_y += yi;
        sum_xx = xi.mul_add(xi, sum_xx);
        sum_xy = xi.mul_add(yi, sum_xy);
    }

    // Solve:
    // [ n      sum_x  ] [ intercept ] = [ sum_y  ]
    // [ sum_x  sum_xx ] [ slope     ]   [ sum_xy ]
    let a = faer::mat![[n, sum_x], [sum_x, sum_xx]];
    let b = faer::col![sum_y, sum_xy];
    let sol = a.full_piv_lu().solve(&b);

    // faer returns a column; lane 0 is intercept, lane 1 is slope
    let intercept = sol[0];
    let slope = sol[1];
    if slope.is_nan() || intercept.is_nan() {
        return RegressionResult {
            slope: f64::NAN,
            intercept: f64::NAN,
            r_squared: f64::NAN,
            residuals: vec![],
        };
    }

    // Residuals + R² (scalar loops to avoid additional faer allocations)
    let y_mean = sum_y / n;
    let mut residuals = Vec::<f64>::with_capacity(x.len());
    let mut ss_res = 0.0;
    let mut ss_tot = 0.0;
    for i in 0..x.len() {
        let y_pred = x[i].mul_add(slope, intercept);
        let r = y[i] - y_pred;
        residuals.push(r);
        ss_res = r.mul_add(r, ss_res);
        let dy = y[i] - y_mean;
        ss_tot = dy.mul_add(dy, ss_tot);
    }

    let r_squared = if ss_tot > 0.0 && !ss_tot.is_nan() {
        1.0 - (ss_res / ss_tot)
    } else {
        f64::NAN
    };

    RegressionResult {
        slope,
        intercept,
        r_squared,
        residuals,
    }
}

fn load_diabetes_data_rows(rows: usize) -> (Vec<f64>, Vec<f64>) {
    // Load first N rows from diabetes-prediction.csv
    // x = age, y = bmi
    let path = "../../data/diabetes-prediction.csv";
    let contents = fs::read_to_string(path).expect("Failed to read diabetes-prediction.csv");

    let mut x = Vec::with_capacity(rows);
    let mut y = Vec::with_capacity(rows);

    for line in contents.lines().skip(1).take(rows) {
        let mut it = line.split(',');
        // Columns: gender,age,hypertension,heart_disease,smoking_history,bmi,...
        let _gender = it.next();
        let age = it.next();
        // Skip hypertension, heart_disease, smoking_history
        let _h = it.next();
        let _hd = it.next();
        let _sm = it.next();
        let bmi = it.next();

        if let (Some(age), Some(bmi)) = (age, bmi) {
            if let (Ok(age), Ok(bmi)) = (age.parse::<f64>(), bmi.parse::<f64>()) {
                x.push(age);
                y.push(bmi);
            }
        }
    }

    assert_eq!(
        x.len(),
        rows,
        "Expected {rows} rows, got {} (x) / {} (y).",
        x.len(),
        y.len()
    );

    (x, y)
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
    c.bench_function("histogram 1M (10 bins)", |b| {
        b.iter(|| histogram(black_box(&data), 10))
    });

    let data = generate_data(10_000);
    c.bench_function("histogram 10K (10 bins)", |b| {
        b.iter(|| histogram(black_box(&data), 10))
    });

    let data = generate_data(1_000);
    c.bench_function("histogram 1K (10 bins)", |b| {
        b.iter(|| histogram(black_box(&data), 10))
    });
}

fn bench_regress(c: &mut Criterion) {
    let (x, y) = load_diabetes_data_rows(10_000);
    let x_ref = &x;
    let y_ref = &y;

    c.bench_function("regress_naive 10K (diabetes)", |b| {
        b.iter(|| regress_naive(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_simd 10K (diabetes)", |b| {
        b.iter(|| regress_simd(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_kernels 10K (diabetes)", |b| {
        b.iter(|| regress_kernels(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress 10K (diabetes)", |b| {
        b.iter(|| regress(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_ndarray 10K (diabetes)", |b| {
        b.iter(|| regress_ndarray(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_faer_normal_eq 10K (diabetes)", |b| {
        b.iter(|| regress_faer_normal_eq(black_box(x_ref), black_box(y_ref)))
    });
}

fn bench_regress_100k(c: &mut Criterion) {
    let (x, y) = load_diabetes_data_rows(100_000);
    let x_ref = &x;
    let y_ref = &y;

    c.bench_function("regress_naive 100K (diabetes)", |b| {
        b.iter(|| regress_naive(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_simd 100K (diabetes)", |b| {
        b.iter(|| regress_simd(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_kernels 100K (diabetes)", |b| {
        b.iter(|| regress_kernels(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress 100K (diabetes)", |b| {
        b.iter(|| regress(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_ndarray 100K (diabetes)", |b| {
        b.iter(|| regress_ndarray(black_box(x_ref), black_box(y_ref)))
    });

    c.bench_function("regress_faer_normal_eq 100K (diabetes)", |b| {
        b.iter(|| regress_faer_normal_eq(black_box(x_ref), black_box(y_ref)))
    });
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
    bench_histogram,
    bench_regress,
    bench_regress_100k
);
criterion_main!(benches);
