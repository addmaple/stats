#![allow(clippy::missing_safety_doc, clippy::needless_range_loop)]
#![allow(clippy::missing_safety_doc)]
#![allow(clippy::not_unsafe_ptr_arg_deref)]

use std::alloc::{alloc, dealloc, Layout};
use std::mem;

#[no_mangle]
pub unsafe extern "C" fn alloc_bytes(len: usize) -> *mut u8 {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    alloc(layout)
}

#[no_mangle]
pub unsafe extern "C" fn free_bytes(ptr: *mut u8, len: usize) {
    let layout = Layout::from_size_align(len, mem::align_of::<u8>()).unwrap();
    dealloc(ptr, layout);
}

#[no_mangle] pub unsafe extern "C" fn alloc_f64(len: usize) -> *mut f64 { alloc_bytes(len * 8) as *mut f64 }
#[no_mangle] pub unsafe extern "C" fn free_f64(ptr: *mut f64, len: usize) { free_bytes(ptr as *mut u8, len * 8); }
#[no_mangle] pub unsafe extern "C" fn alloc_f32(len: usize) -> *mut f32 { alloc_bytes(len * 4) as *mut f32 }
#[no_mangle] pub unsafe extern "C" fn free_f32(ptr: *mut f32, len: usize) { free_bytes(ptr as *mut u8, len * 4); }
#[no_mangle] pub unsafe extern "C" fn alloc_i32(len: usize) -> *mut i32 { alloc_bytes(len * 4) as *mut i32 }
#[no_mangle] pub unsafe extern "C" fn free_i32(ptr: *mut i32, len: usize) { free_bytes(ptr as *mut u8, len * 4); }

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

fn slice_from_f32<'a>(ptr: *const f32, len: usize) -> &'a [f32] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut_f32<'a>(ptr: *mut f32, len: usize) -> &'a mut [f32] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

#[no_mangle] pub unsafe extern "C" fn sum_f64(ptr: *const f64, len: usize) -> f64 { stat_core::sum(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn mean_f64(ptr: *const f64, len: usize) -> f64 { stat_core::mean(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn variance_f64(ptr: *const f64, len: usize) -> f64 { stat_core::variance(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn sample_variance_f64(ptr: *const f64, len: usize) -> f64 { stat_core::sample_variance(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn stdev_f64(ptr: *const f64, len: usize) -> f64 { stat_core::stdev(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn sample_stdev_f64(ptr: *const f64, len: usize) -> f64 { stat_core::sample_stdev(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn min_f64(ptr: *const f64, len: usize) -> f64 { stat_core::min(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn max_f64(ptr: *const f64, len: usize) -> f64 { stat_core::max(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn product_f64(ptr: *const f64, len: usize) -> f64 { stat_core::product(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn range_f64(ptr: *const f64, len: usize) -> f64 { stat_core::range(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn median_f64(ptr: *const f64, len: usize) -> f64 { stat_core::median(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn mode_f64(ptr: *const f64, len: usize) -> f64 { stat_core::mode(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn geomean_f64(ptr: *const f64, len: usize) -> f64 { stat_core::geomean(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn skewness_f64(ptr: *const f64, len: usize) -> f64 { stat_core::skewness(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn kurtosis_f64(ptr: *const f64, len: usize) -> f64 { stat_core::kurtosis(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn coeffvar_f64(ptr: *const f64, len: usize) -> f64 { stat_core::coeffvar(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn meandev_f64(ptr: *const f64, len: usize) -> f64 { stat_core::meandev(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn meddev_f64(ptr: *const f64, len: usize) -> f64 { stat_core::meddev(slice_from(ptr, len)) }

#[no_mangle] pub unsafe extern "C" fn covariance_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::covariance(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }
#[no_mangle] pub unsafe extern "C" fn corrcoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::corrcoeff(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }
#[no_mangle] pub unsafe extern "C" fn spearmancoeff_f64(x_ptr: *const f64, x_len: usize, y_ptr: *const f64, y_len: usize) -> f64 { if x_len != y_len { return f64::NAN; } stat_core::spearmancoeff(slice_from(x_ptr, x_len), slice_from(y_ptr, y_len)) }

#[no_mangle] pub unsafe extern "C" fn cumsum_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { let result = stat_core::cumsum(slice_from(ptr, len)); slice_from_mut(out_ptr, len).copy_from_slice(&result); len as isize }
#[no_mangle] pub unsafe extern "C" fn cumprod_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { let result = stat_core::cumprod(slice_from(ptr, len)); slice_from_mut(out_ptr, len).copy_from_slice(&result); len as isize }
#[no_mangle] pub unsafe extern "C" fn diff_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { if len < 1 { return 0; } let result = stat_core::diff(slice_from(ptr, len)); slice_from_mut(out_ptr, len - 1).copy_from_slice(&result); (len - 1) as isize }
#[no_mangle] pub unsafe extern "C" fn rank_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { let result = stat_core::rank(slice_from(ptr, len)); slice_from_mut(out_ptr, len).copy_from_slice(&result); len as isize }
#[no_mangle] pub unsafe extern "C" fn deviation_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { let result = stat_core::deviation(slice_from(ptr, len)); slice_from_mut(out_ptr, len).copy_from_slice(&result); len as isize }

#[no_mangle] pub unsafe extern "C" fn pooledvariance_f64(d1p: *const f64, d1l: usize, d2p: *const f64, d2l: usize) -> f64 { stat_core::pooledvariance(slice_from(d1p, d1l), slice_from(d2p, d2l)) }
#[no_mangle] pub unsafe extern "C" fn pooledstdev_f64(d1p: *const f64, d1l: usize, d2p: *const f64, d2l: usize) -> f64 { stat_core::pooledstdev(slice_from(d1p, d1l), slice_from(d2p, d2l)) }
#[no_mangle] pub unsafe extern "C" fn stan_moment_f64(ptr: *const f64, len: usize, k: usize) -> f64 { stat_core::stan_moment(slice_from(ptr, len), k) }

#[no_mangle] pub unsafe extern "C" fn percentile_of_score_f64(ptr: *const f64, len: usize, s: f64, st: bool) -> f64 { stat_core::percentile_of_score(slice_from(ptr, len), s, st) }
#[no_mangle] pub unsafe extern "C" fn qscore_f64(ptr: *const f64, len: usize, s: f64, st: bool) -> f64 { stat_core::qscore(slice_from(ptr, len), s, st) }
#[no_mangle] pub unsafe extern "C" fn qtest_f64(ptr: *const f64, len: usize, s: f64, ql: f64, qu: f64) -> bool { stat_core::qtest(slice_from(ptr, len), s, ql, qu) }
#[no_mangle] pub unsafe extern "C" fn percentile_f64(ptr: *const f64, len: usize, k: f64, ex: bool) -> f64 { stat_core::percentile(slice_from(ptr, len), k, ex) }
#[no_mangle] pub unsafe extern "C" fn percentile_inclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 { stat_core::percentile_inclusive(slice_from(ptr, len), k) }
#[no_mangle] pub unsafe extern "C" fn percentile_exclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 { stat_core::percentile_exclusive(slice_from(ptr, len), k) }
#[no_mangle] pub unsafe extern "C" fn iqr_f64(ptr: *const f64, len: usize) -> f64 { stat_core::iqr(slice_from(ptr, len)) }

#[no_mangle] pub unsafe extern "C" fn quartiles_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize { let q = stat_core::quartiles(slice_from(ptr, len)); let out = slice_from_mut(out_ptr, 3); out[0] = q[0]; out[1] = q[1]; out[2] = q[2]; 3 }
#[no_mangle] pub unsafe extern "C" fn quantiles_f64(dp: *const f64, dl: usize, qsp: *const f64, qsl: usize, out_ptr: *mut f64) -> isize { let result = stat_core::quantiles(slice_from(dp, dl), slice_from(qsp, qsl)); slice_from_mut(out_ptr, qsl).copy_from_slice(&result); qsl as isize }

#[no_mangle] pub unsafe extern "C" fn histogram_f64(ptr: *const f64, len: usize, bc: usize, out_ptr: *mut f64) -> isize { let bins = stat_core::histogram(slice_from(ptr, len), bc); let out = slice_from_mut(out_ptr, bc); for i in 0..bc { out[i] = bins[i] as f64; } bc as isize }
#[no_mangle] pub unsafe extern "C" fn histogram_edges_f64(dp: *const f64, dl: usize, ep: *const f64, el: usize, out_ptr: *mut f64) -> isize { let bins = stat_core::histogram_edges(slice_from(dp, dl), slice_from(ep, el)); let bc = bins.len(); let out = slice_from_mut(out_ptr, bc); for i in 0..bc { out[i] = bins[i] as f64; } bc as isize }

#[no_mangle] pub unsafe extern "C" fn histogram_fixed_width_with_edges_f64(ptr: *const f64, len: usize, bins: usize, e_out: *mut f64, c_out: *mut f64) -> isize {
    let res = stat_core::histogram_fixed_width_with_edges(slice_from(ptr, len), bins);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() { cout[i] = res.counts[i] as f64; }
    res.counts.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn histogram_equal_frequency_with_edges_f64(ptr: *const f64, len: usize, bins: usize, e_out: *mut f64, c_out: *mut f64) -> isize {
    let res = stat_core::histogram_equal_frequency_with_edges(slice_from(ptr, len), bins);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() { cout[i] = res.counts[i] as f64; }
    res.counts.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn histogram_auto_with_edges_f64(ptr: *const f64, len: usize, rule: usize, bo: usize, e_out: *mut f64, c_out: *mut f64) -> isize {
    let r = match rule { 0 => stat_core::BinningRule::FreedmanDiaconis, 1 => stat_core::BinningRule::Scott, 2 => stat_core::BinningRule::SqrtN, _ => stat_core::BinningRule::FreedmanDiaconis };
    let res = stat_core::histogram_auto_with_edges(slice_from(ptr, len), r, if bo == 0 { None } else { Some(bo) });
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() { cout[i] = res.counts[i] as f64; }
    res.counts.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn histogram_auto_with_edges_collapse_tails_f64(ptr: *const f64, len: usize, rule: usize, bo: usize, k: f64, e_out: *mut f64, c_out: *mut f64) -> isize {
    let r = match rule { 0 => stat_core::BinningRule::FreedmanDiaconis, 1 => stat_core::BinningRule::Scott, 2 => stat_core::BinningRule::SqrtN, _ => stat_core::BinningRule::FreedmanDiaconis };
    let res = stat_core::histogram_auto_with_edges_collapse_tails(slice_from(ptr, len), r, if bo == 0 { None } else { Some(bo) }, k);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() { cout[i] = res.counts[i] as f64; }
    res.counts.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn histogram_custom_with_edges_f64(dp: *const f64, dl: usize, ep: *const f64, el: usize, co: bool, e_out: *mut f64, c_out: *mut f64) -> isize {
    let res = stat_core::histogram_custom_with_edges(slice_from(dp, dl), slice_from(ep, el), co);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() { cout[i] = res.counts[i] as f64; }
    res.counts.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn anova_f_score_flat(dp: *const f64, lp: *const f64, ng: usize) -> f64 {
    let lens = slice_from(lp, ng);
    let total: usize = lens.iter().map(|&l| l as usize).sum();
    let data = slice_from(dp, total);
    let mut groups = Vec::with_capacity(ng);
    let mut off = 0;
    for &l in lens { let l = l as usize; groups.push(&data[off..off+l]); off += l; }
    stat_core::anova_f_score(&groups)
}

#[no_mangle] pub unsafe extern "C" fn anova_flat(dp: *const f64, lp: *const f64, ng: usize, out: *mut f64) -> isize {
    let lens = slice_from(lp, ng);
    let total: usize = lens.iter().map(|&l| l as usize).sum();
    let data = slice_from(dp, total);
    let mut groups = Vec::with_capacity(ng);
    let mut off = 0;
    for &l in lens { let l = l as usize; groups.push(&data[off..off+l]); off += l; }
    let res = stat_core::anova(&groups);
    let o = slice_from_mut(out, 3);
    o[0] = res.f_score; o[1] = res.df_between as f64; o[2] = res.df_within as f64;
    3
}

#[no_mangle] pub unsafe extern "C" fn tukey_hsd_flat(dp: *const f64, lp: *const f64, ng: usize, out: *mut f64) -> isize {
    let lens = slice_from(lp, ng);
    let total: usize = lens.iter().map(|&l| l as usize).sum();
    let data = slice_from(dp, total);
    let mut groups = Vec::with_capacity(ng);
    let mut off = 0;
    for &l in lens { let l = l as usize; groups.push(&data[off..off+l]); off += l; }
    let res = stat_core::tukey_hsd(&groups);
    let nc = res.comparisons.len();
    let o = slice_from_mut(out, 3 + nc * 7);
    o[0] = res.num_groups as f64; o[1] = res.df_within as f64; o[2] = res.msw;
    for (i, c) in res.comparisons.iter().enumerate() {
        let b = 3 + i * 7;
        o[b]=c.group1 as f64; o[b+1]=c.group2 as f64; o[b+2]=c.mean_diff; o[b+3]=c.q_statistic; o[b+4]=c.p_value; o[b+5]=c.ci_lower; o[b+6]=c.ci_upper;
    }
    nc as isize
}

#[no_mangle] pub unsafe extern "C" fn sum_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::sum(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn mean_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::mean(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn variance_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::variance(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn sample_variance_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::sample_variance(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn stdev_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::stdev(slice_from(ptr, len)) }
#[no_mangle] pub unsafe extern "C" fn sample_stdev_f64_direct(ptr: *const f64, len: usize) -> f64 { stat_core::sample_stdev(slice_from(ptr, len)) }

macro_rules! def_sd {
    ($n:ident, $rf:ident, ($($p:ident : f64),*)) => { #[no_mangle] pub unsafe extern "C" fn $n(x: f64, $($p: f64),*) -> f64 { stat_core::$rf(x, $($p),*).unwrap_or(f64::NAN) } };
    ($n:ident, $rf:ident, [$($p:ident : f64),*]) => { #[no_mangle] pub unsafe extern "C" fn $n(p: f64, $($p: f64),*) -> f64 { stat_core::$rf(p, $($p),*).unwrap_or(f64::NAN) } };
}
macro_rules! def_ad {
    ($n:ident, $rf:ident, [$($p:ident : f64),*]) => { #[no_mangle] pub unsafe extern "C" fn $n(ip: *const f64, l: usize, $($p: f64,)* op: *mut f64) { let _ = stat_core::$rf(slice_from(ip, l), $($p,)* slice_from_mut(op, l)); } };
}

def_sd!(normal_pdf_scalar, normal_pdf, (m: f64, s: f64));
def_sd!(normal_cdf_scalar, normal_cdf, (m: f64, s: f64));
def_sd!(normal_inv_scalar, normal_inv, [m: f64, s: f64]);
def_ad!(normal_pdf_inplace, normal_pdf_array, [m: f64, s: f64]);
def_ad!(normal_cdf_inplace, normal_cdf_array, [m: f64, s: f64]);
def_sd!(gamma_pdf_scalar, gamma_pdf, (s: f64, r: f64));
def_sd!(gamma_cdf_scalar, gamma_cdf, (s: f64, r: f64));
def_sd!(gamma_inv_scalar, gamma_inv, [s: f64, r: f64]);
def_ad!(gamma_pdf_inplace, gamma_pdf_array, [s: f64, r: f64]);
def_ad!(gamma_cdf_inplace, gamma_cdf_array, [s: f64, r: f64]);
def_sd!(beta_pdf_scalar, beta_pdf, (a: f64, b: f64));
def_sd!(beta_cdf_scalar, beta_cdf, (a: f64, b: f64));
def_sd!(beta_inv_scalar, beta_inv, [a: f64, b: f64]);
def_ad!(beta_pdf_inplace, beta_pdf_array, [a: f64, b: f64]);
def_ad!(beta_cdf_inplace, beta_cdf_array, [a: f64, b: f64]);
def_sd!(student_t_pdf_scalar, student_t_pdf, (m: f64, s: f64, d: f64));
def_sd!(student_t_cdf_scalar, student_t_cdf, (m: f64, s: f64, d: f64));
def_sd!(student_t_inv_scalar, student_t_inv, [m: f64, s: f64, d: f64]);
def_ad!(student_t_pdf_inplace, student_t_pdf_array, [m: f64, s: f64, d: f64]);
def_ad!(student_t_cdf_inplace, student_t_cdf_array, [m: f64, s: f64, d: f64]);
def_sd!(chi_squared_pdf_scalar, chi_squared_pdf, (d: f64));
def_sd!(chi_squared_cdf_scalar, chi_squared_cdf, (d: f64));
def_sd!(chi_squared_inv_scalar, chi_squared_inv, [d: f64]);
def_ad!(chi_squared_pdf_inplace, chi_squared_pdf_array, [d: f64]);
def_ad!(chi_squared_cdf_inplace, chi_squared_cdf_array, [d: f64]);
def_sd!(fisher_f_pdf_scalar, fisher_f_pdf, (d1: f64, d2: f64));
def_sd!(fisher_f_cdf_scalar, fisher_f_cdf, (d1: f64, d2: f64));
def_sd!(fisher_f_inv_scalar, fisher_f_inv, [d1: f64, d2: f64]);
def_ad!(fisher_f_pdf_inplace, fisher_f_pdf_array, [d1: f64, d2: f64]);
def_ad!(fisher_f_cdf_inplace, fisher_f_cdf_array, [d1: f64, d2: f64]);
def_sd!(exponential_pdf_scalar, exponential_pdf, (r: f64));
def_sd!(exponential_cdf_scalar, exponential_cdf, (r: f64));
def_sd!(exponential_inv_scalar, exponential_inv, [r: f64]);
def_ad!(exponential_pdf_inplace, exponential_pdf_array, [r: f64]);
def_ad!(exponential_cdf_inplace, exponential_cdf_array, [r: f64]);
def_sd!(poisson_pmf_scalar, poisson_pmf, (l: f64));
def_sd!(poisson_cdf_scalar, poisson_cdf, (l: f64));
def_sd!(poisson_inv_scalar, poisson_inv, [l: f64]);
def_ad!(poisson_pmf_inplace, poisson_pmf_array, [l: f64]);
def_ad!(poisson_cdf_inplace, poisson_cdf_array, [l: f64]);
def_sd!(binomial_pmf_scalar, binomial_pmf, (n: f64, p: f64));
def_sd!(binomial_cdf_scalar, binomial_cdf, (n: f64, p: f64));
#[no_mangle] pub unsafe extern "C" fn binomial_inv_scalar(prob: f64, n: f64, p: f64) -> f64 { stat_core::binomial_inv(prob, n, p).unwrap_or(f64::NAN) }
def_ad!(binomial_pmf_inplace, binomial_pmf_array, [n: f64, p: f64]);
def_ad!(binomial_cdf_inplace, binomial_cdf_array, [n: f64, p: f64]);
def_sd!(uniform_pdf_scalar, uniform_pdf, (mi: f64, ma: f64));
def_sd!(uniform_cdf_scalar, uniform_cdf, (mi: f64, ma: f64));
def_sd!(uniform_inv_scalar, uniform_inv, [mi: f64, ma: f64]);
def_ad!(uniform_pdf_inplace, uniform_pdf_array, [mi: f64, ma: f64]);
def_ad!(uniform_cdf_inplace, uniform_cdf_array, [mi: f64, ma: f64]);
def_sd!(cauchy_pdf_scalar, cauchy_pdf, (lo: f64, sc: f64));
def_sd!(cauchy_cdf_scalar, cauchy_cdf, (lo: f64, sc: f64));
def_sd!(cauchy_inv_scalar, cauchy_inv, [lo: f64, sc: f64]);
def_ad!(cauchy_pdf_inplace, cauchy_pdf_array, [lo: f64, sc: f64]);
def_ad!(cauchy_cdf_inplace, cauchy_cdf_array, [lo: f64, sc: f64]);
def_sd!(laplace_pdf_scalar, laplace_pdf, (lo: f64, sc: f64));
def_sd!(laplace_cdf_scalar, laplace_cdf, (lo: f64, sc: f64));
def_sd!(laplace_inv_scalar, laplace_inv, [lo: f64, sc: f64]);
def_ad!(laplace_pdf_inplace, laplace_pdf_array, [lo: f64, sc: f64]);
def_ad!(laplace_cdf_inplace, laplace_cdf_array, [lo: f64, sc: f64]);
def_sd!(lognormal_pdf_scalar, lognormal_pdf, (m: f64, s: f64));
def_sd!(lognormal_cdf_scalar, lognormal_cdf, (m: f64, s: f64));
def_sd!(lognormal_inv_scalar, lognormal_inv, [m: f64, s: f64]);
def_ad!(lognormal_pdf_inplace, lognormal_pdf_array, [m: f64, s: f64]);
def_ad!(lognormal_cdf_inplace, lognormal_cdf_array, [m: f64, s: f64]);
def_sd!(weibull_pdf_scalar, weibull_pdf, (sh: f64, sc: f64));
def_sd!(weibull_cdf_scalar, weibull_cdf, (sh: f64, sc: f64));
def_sd!(weibull_inv_scalar, weibull_inv, [sh: f64, sc: f64]);
def_ad!(weibull_pdf_inplace, weibull_pdf_array, [sh: f64, sc: f64]);
def_ad!(weibull_cdf_inplace, weibull_cdf_array, [sh: f64, sc: f64]);
def_sd!(pareto_pdf_scalar, pareto_pdf, (sc: f64, sh: f64));
def_sd!(pareto_cdf_scalar, pareto_cdf, (sc: f64, sh: f64));
def_sd!(pareto_inv_scalar, pareto_inv, [sc: f64, sh: f64]);
def_ad!(pareto_pdf_inplace, pareto_pdf_array, [sc: f64, sh: f64]);
def_ad!(pareto_cdf_inplace, pareto_cdf_array, [sc: f64, sh: f64]);
def_sd!(triangular_pdf_scalar, triangular_pdf, (mi: f64, ma: f64, mo: f64));
def_sd!(triangular_cdf_scalar, triangular_cdf, (mi: f64, ma: f64, mo: f64));
def_sd!(triangular_inv_scalar, triangular_inv, [mi: f64, ma: f64, mo: f64]);
def_ad!(triangular_pdf_inplace, triangular_pdf_array, [mi: f64, ma: f64, mo: f64]);
def_ad!(triangular_cdf_inplace, triangular_cdf_array, [mi: f64, ma: f64, mo: f64]);
def_sd!(invgamma_pdf_scalar, invgamma_pdf, (sh: f64, r: f64));
def_sd!(invgamma_cdf_scalar, invgamma_cdf, (sh: f64, r: f64));
def_sd!(invgamma_inv_scalar, invgamma_inv, [sh: f64, r: f64]);
def_ad!(invgamma_pdf_inplace, invgamma_pdf_array, [sh: f64, r: f64]);
def_ad!(invgamma_cdf_inplace, invgamma_cdf_array, [sh: f64, r: f64]);
def_sd!(negbin_pmf_scalar, negbin_pmf, (r: f64, p: f64));
def_sd!(negbin_cdf_scalar, negbin_cdf, (r: f64, p: f64));
#[no_mangle] pub unsafe extern "C" fn negbin_inv_scalar(prob: f64, r: f64, p: f64) -> f64 { stat_core::negbin_inv(prob, r, p).unwrap_or(f64::NAN) }
def_ad!(negbin_pmf_inplace, negbin_pmf_array, [r: f64, p: f64]);
def_ad!(negbin_cdf_inplace, negbin_cdf_array, [r: f64, p: f64]);

#[no_mangle] pub unsafe extern "C" fn normalci_f64(a: f64, m: f64, se: f64, o: *mut f64) -> isize { let ci = stat_core::normalci(a, m, se); let out = slice_from_mut(o, 2); out[0] = ci[0]; out[1] = ci[1]; 2 }
#[no_mangle] pub unsafe extern "C" fn tci_f64(a: f64, m: f64, s: f64, n: f64, o: *mut f64) -> isize { let ci = stat_core::tci(a, m, s, n); let out = slice_from_mut(o, 2); out[0] = ci[0]; out[1] = ci[1]; 2 }

#[no_mangle] pub unsafe extern "C" fn ttest_f64(dp: *const f64, l: usize, mu0: f64, o: *mut f64) -> isize {
    let res = stat_core::ttest(slice_from(dp, l), mu0);
    let out = slice_from_mut(o, 3);
    out[0] = res.statistic; out[1] = res.p_value; out[2] = res.df.unwrap_or(f64::NAN);
    3
}
#[no_mangle] pub unsafe extern "C" fn ztest_f64(dp: *const f64, l: usize, mu0: f64, s: f64, o: *mut f64) -> isize {
    let res = stat_core::ztest(slice_from(dp, l), mu0, s);
    let out = slice_from_mut(o, 3);
    out[0] = res.statistic; out[1] = res.p_value; out[2] = res.df.unwrap_or(f64::NAN);
    3
}

#[no_mangle] pub unsafe extern "C" fn regress_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, co: *mut f64, ro: *mut f64) -> isize {
    let res = stat_core::regress(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3); c[0]=res.slope; c[1]=res.intercept; c[2]=res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len()); r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle] pub unsafe extern "C" fn regress_naive_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, co: *mut f64, ro: *mut f64) -> isize {
    let res = stat_core::regress_naive(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3); c[0]=res.slope; c[1]=res.intercept; c[2]=res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len()); r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle] pub unsafe extern "C" fn regress_simd_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, co: *mut f64, ro: *mut f64) -> isize {
    let res = stat_core::regress_simd(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3); c[0]=res.slope; c[1]=res.intercept; c[2]=res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len()); r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle] pub unsafe extern "C" fn regress_wasm_kernels_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, co: *mut f64, ro: *mut f64) -> isize {
    let res = stat_core::regress_kernels(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3); c[0]=res.slope; c[1]=res.intercept; c[2]=res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len()); r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}

#[no_mangle] pub unsafe extern "C" fn regress_coeffs_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, o: *mut f64) -> isize {
    let c = stat_core::regress_simd_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3); out[0]=c.slope; out[1]=c.intercept; out[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_naive_coeffs_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, o: *mut f64) -> isize {
    let c = stat_core::regress_naive_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3); out[0]=c.slope; out[1]=c.intercept; out[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_simd_coeffs_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, o: *mut f64) -> isize {
    let c = stat_core::regress_simd_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3); out[0]=c.slope; out[1]=c.intercept; out[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_wasm_kernels_coeffs_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, o: *mut f64) -> isize {
    let c = stat_core::regress_kernels_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3); out[0]=c.slope; out[1]=c.intercept; out[2]=c.r_squared; 3
}

#[no_mangle] pub unsafe extern "C" fn regress_simd_residuals_inplace_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, ro: *mut f64, co: *mut f64) -> isize {
    let x = slice_from(xp, xl); let y = slice_from(yp, yl); let c = stat_core::regress_simd_coeffs(x, y);
    if xl != yl || c.slope.is_nan() { return 0; }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3); cout[0]=c.slope; cout[1]=c.intercept; cout[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_wasm_kernels_residuals_inplace_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, ro: *mut f64, co: *mut f64) -> isize {
    let x = slice_from(xp, xl); let y = slice_from(yp, yl); let c = stat_core::regress_kernels_coeffs(x, y);
    if xl != yl || c.slope.is_nan() { return 0; }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3); cout[0]=c.slope; cout[1]=c.intercept; cout[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_naive_residuals_inplace_f64(xp: *const f64, xl: usize, yp: *const f64, yl: usize, ro: *mut f64, co: *mut f64) -> isize {
    let x = slice_from(xp, xl); let y = slice_from(yp, yl); let c = stat_core::regress_naive_coeffs(x, y);
    if xl != yl || c.slope.is_nan() { return 0; }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3); cout[0]=c.slope; cout[1]=c.intercept; cout[2]=c.r_squared; 3
}

#[no_mangle] pub unsafe extern "C" fn regress_simd_coeffs_f32(xp: *const f32, xl: usize, yp: *const f32, yl: usize, o: *mut f32) -> isize {
    let c = stat_core::regress_simd_coeffs_f32(slice_from_f32(xp, xl), slice_from_f32(yp, yl));
    let out = slice_from_mut_f32(o, 3); out[0]=c.slope; out[1]=c.intercept; out[2]=c.r_squared; 3
}
#[no_mangle] pub unsafe extern "C" fn regress_simd_residuals_inplace_f32(xp: *const f32, xl: usize, yp: *const f32, yl: usize, ro: *mut f32, co: *mut f32) -> isize {
    let x = slice_from_f32(xp, xl); let y = slice_from_f32(yp, yl); let c = stat_core::regress_simd_coeffs_f32(x, y);
    if xl != yl || c.slope.is_nan() { return 0; }
    stat_core::residuals_into_f32(slice_from_mut_f32(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut_f32(co, 3); cout[0]=c.slope; cout[1]=c.intercept; cout[2]=c.r_squared; 3
}

#[no_mangle] pub unsafe extern "C" fn chi_square_test(cp1: *const i32, cp2: *const i32, l: usize, c1: usize, c2: usize, out: *mut f64) -> isize {
    let s1: Vec<String> = unsafe { std::slice::from_raw_parts(cp1, l) }.iter().map(|x| x.to_string()).collect();
    let s2: Vec<String> = unsafe { std::slice::from_raw_parts(cp2, l) }.iter().map(|x| x.to_string()).collect();
    let res = stat_core::chi_square_test_with_cardinality(&s1, &s2, Some(c1), Some(c2));
    let o = slice_from_mut(out, 3);
    o[0] = res.statistic; o[1] = res.p_value; o[2] = res.df as f64;
    3
}

#[no_mangle] pub unsafe extern "C" fn anova_f_score_categorical(gp: *const i32, vp: *const f64, l: usize) -> f64 {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }.iter().map(|x| x.to_string()).collect();
    stat_core::anova_f_score_categorical(&s, slice_from(vp, l))
}

#[no_mangle] pub unsafe extern "C" fn anova_categorical(gp: *const i32, vp: *const f64, l: usize, out: *mut f64) -> isize {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }.iter().map(|x| x.to_string()).collect();
    let res = stat_core::anova_categorical(&s, slice_from(vp, l));
    let o = slice_from_mut(out, 3);
    o[0] = res.f_score; o[1] = res.df_between as f64; o[2] = res.df_within as f64;
    3
}

#[no_mangle] pub unsafe extern "C" fn tukey_hsd_categorical(gp: *const i32, vp: *const f64, l: usize, out: *mut f64) -> isize {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }.iter().map(|x| x.to_string()).collect();
    let res = stat_core::tukey_hsd_categorical(&s, slice_from(vp, l));
    let nc = res.comparisons.len();
    let o = slice_from_mut(out, 3 + nc * 7);
    o[0] = res.num_groups as f64; o[1] = res.df_within as f64; o[2] = res.msw;
    for (i, c) in res.comparisons.iter().enumerate() {
        let b = 3 + i * 7;
        o[b]=c.group1 as f64; o[b+1]=c.group2 as f64; o[b+2]=c.mean_diff; o[b+3]=c.q_statistic; o[b+4]=c.p_value; o[b+5]=c.ci_lower; o[b+6]=c.ci_upper;
    }
    nc as isize
}

#[no_mangle] pub unsafe extern "C" fn weighted_percentile_f64(dp: *const f64, dl: usize, wp: *const f64, wl: usize, p: f64) -> f64 {
    stat_core::weighted_percentile(slice_from(dp, dl), slice_from(wp, wl), p)
}

#[no_mangle] pub unsafe extern "C" fn weighted_quantiles_f64(dp: *const f64, dl: usize, wp: *const f64, wl: usize, qsp: *const f64, qsl: usize, out_ptr: *mut f64) -> isize {
    let res = stat_core::weighted_quantiles(slice_from(dp, dl), slice_from(wp, wl), slice_from(qsp, qsl));
    slice_from_mut(out_ptr, qsl).copy_from_slice(&res);
    qsl as isize
}

#[no_mangle] pub unsafe extern "C" fn weighted_median_f64(dp: *const f64, dl: usize, wp: *const f64, wl: usize) -> f64 {
    stat_core::weighted_median(slice_from(dp, dl), slice_from(wp, wl))
}

