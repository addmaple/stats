#![allow(clippy::missing_safety_doc, clippy::needless_range_loop)]
#![allow(clippy::not_unsafe_ptr_arg_deref, dead_code)]

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

#[no_mangle]
pub unsafe extern "C" fn alloc_f64(len: usize) -> *mut f64 {
    alloc_bytes(len * 8) as *mut f64
}
#[no_mangle]
pub unsafe extern "C" fn free_f64(ptr: *mut f64, len: usize) {
    free_bytes(ptr as *mut u8, len * 8);
}
#[no_mangle]
pub unsafe extern "C" fn alloc_f32(len: usize) -> *mut f32 {
    alloc_bytes(len * 4) as *mut f32
}
#[no_mangle]
pub unsafe extern "C" fn free_f32(ptr: *mut f32, len: usize) {
    free_bytes(ptr as *mut u8, len * 4);
}
#[no_mangle]
pub unsafe extern "C" fn alloc_i32(len: usize) -> *mut i32 {
    alloc_bytes(len * 4) as *mut i32
}
#[no_mangle]
pub unsafe extern "C" fn free_i32(ptr: *mut i32, len: usize) {
    free_bytes(ptr as *mut u8, len * 4);
}

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

#[no_mangle]
pub unsafe extern "C" fn normalci_f64(a: f64, m: f64, se: f64, o: *mut f64) -> isize {
    let ci = stat_core::normalci(a, m, se);
    let out = slice_from_mut(o, 2);
    out[0] = ci[0];
    out[1] = ci[1];
    2
}
#[no_mangle]
pub unsafe extern "C" fn tci_f64(a: f64, m: f64, s: f64, n: f64, o: *mut f64) -> isize {
    let ci = stat_core::tci(a, m, s, n);
    let out = slice_from_mut(o, 2);
    out[0] = ci[0];
    out[1] = ci[1];
    2
}

#[no_mangle]
pub unsafe extern "C" fn ttest_f64(dp: *const f64, l: usize, mu0: f64, o: *mut f64) -> isize {
    let res = stat_core::ttest(slice_from(dp, l), mu0);
    let out = slice_from_mut(o, 3);
    out[0] = res.statistic;
    out[1] = res.p_value;
    out[2] = res.df.unwrap_or(f64::NAN);
    3
}
#[no_mangle]
pub unsafe extern "C" fn ztest_f64(
    dp: *const f64,
    l: usize,
    mu0: f64,
    s: f64,
    o: *mut f64,
) -> isize {
    let res = stat_core::ztest(slice_from(dp, l), mu0, s);
    let out = slice_from_mut(o, 3);
    out[0] = res.statistic;
    out[1] = res.p_value;
    out[2] = res.df.unwrap_or(f64::NAN);
    3
}

#[no_mangle]
pub unsafe extern "C" fn regress_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    co: *mut f64,
    ro: *mut f64,
) -> isize {
    let res = stat_core::regress(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3);
    c[0] = res.slope;
    c[1] = res.intercept;
    c[2] = res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len());
    r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle]
pub unsafe extern "C" fn regress_naive_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    co: *mut f64,
    ro: *mut f64,
) -> isize {
    let res = stat_core::regress_naive(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3);
    c[0] = res.slope;
    c[1] = res.intercept;
    c[2] = res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len());
    r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle]
pub unsafe extern "C" fn regress_simd_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    co: *mut f64,
    ro: *mut f64,
) -> isize {
    let res = stat_core::regress_simd(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3);
    c[0] = res.slope;
    c[1] = res.intercept;
    c[2] = res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len());
    r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}
#[no_mangle]
pub unsafe extern "C" fn regress_wasm_kernels_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    co: *mut f64,
    ro: *mut f64,
) -> isize {
    let res = stat_core::regress_kernels(slice_from(xp, xl), slice_from(yp, yl));
    let c = slice_from_mut(co, 3);
    c[0] = res.slope;
    c[1] = res.intercept;
    c[2] = res.r_squared;
    let r = slice_from_mut(ro, res.residuals.len());
    r.copy_from_slice(&res.residuals);
    res.residuals.len() as isize
}

#[no_mangle]
pub unsafe extern "C" fn regress_coeffs_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    o: *mut f64,
) -> isize {
    let c = stat_core::regress_simd_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3);
    out[0] = c.slope;
    out[1] = c.intercept;
    out[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_naive_coeffs_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    o: *mut f64,
) -> isize {
    let c = stat_core::regress_naive_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3);
    out[0] = c.slope;
    out[1] = c.intercept;
    out[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_simd_coeffs_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    o: *mut f64,
) -> isize {
    let c = stat_core::regress_simd_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3);
    out[0] = c.slope;
    out[1] = c.intercept;
    out[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_wasm_kernels_coeffs_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    o: *mut f64,
) -> isize {
    let c = stat_core::regress_kernels_coeffs(slice_from(xp, xl), slice_from(yp, yl));
    let out = slice_from_mut(o, 3);
    out[0] = c.slope;
    out[1] = c.intercept;
    out[2] = c.r_squared;
    3
}

#[no_mangle]
pub unsafe extern "C" fn regress_simd_residuals_inplace_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    ro: *mut f64,
    co: *mut f64,
) -> isize {
    let x = slice_from(xp, xl);
    let y = slice_from(yp, yl);
    let c = stat_core::regress_simd_coeffs(x, y);
    if xl != yl || c.slope.is_nan() {
        return 0;
    }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3);
    cout[0] = c.slope;
    cout[1] = c.intercept;
    cout[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_wasm_kernels_residuals_inplace_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    ro: *mut f64,
    co: *mut f64,
) -> isize {
    let x = slice_from(xp, xl);
    let y = slice_from(yp, yl);
    let c = stat_core::regress_kernels_coeffs(x, y);
    if xl != yl || c.slope.is_nan() {
        return 0;
    }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3);
    cout[0] = c.slope;
    cout[1] = c.intercept;
    cout[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_naive_residuals_inplace_f64(
    xp: *const f64,
    xl: usize,
    yp: *const f64,
    yl: usize,
    ro: *mut f64,
    co: *mut f64,
) -> isize {
    let x = slice_from(xp, xl);
    let y = slice_from(yp, yl);
    let c = stat_core::regress_naive_coeffs(x, y);
    if xl != yl || c.slope.is_nan() {
        return 0;
    }
    stat_core::residuals_into(slice_from_mut(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut(co, 3);
    cout[0] = c.slope;
    cout[1] = c.intercept;
    cout[2] = c.r_squared;
    3
}

#[no_mangle]
pub unsafe extern "C" fn regress_simd_coeffs_f32(
    xp: *const f32,
    xl: usize,
    yp: *const f32,
    yl: usize,
    o: *mut f32,
) -> isize {
    let c = stat_core::regress_simd_coeffs_f32(slice_from_f32(xp, xl), slice_from_f32(yp, yl));
    let out = slice_from_mut_f32(o, 3);
    out[0] = c.slope;
    out[1] = c.intercept;
    out[2] = c.r_squared;
    3
}
#[no_mangle]
pub unsafe extern "C" fn regress_simd_residuals_inplace_f32(
    xp: *const f32,
    xl: usize,
    yp: *const f32,
    yl: usize,
    ro: *mut f32,
    co: *mut f32,
) -> isize {
    let x = slice_from_f32(xp, xl);
    let y = slice_from_f32(yp, yl);
    let c = stat_core::regress_simd_coeffs_f32(x, y);
    if xl != yl || c.slope.is_nan() {
        return 0;
    }
    stat_core::residuals_into_f32(slice_from_mut_f32(ro, xl), x, y, c.slope, c.intercept);
    let cout = slice_from_mut_f32(co, 3);
    cout[0] = c.slope;
    cout[1] = c.intercept;
    cout[2] = c.r_squared;
    3
}

#[no_mangle]
pub unsafe extern "C" fn anova_f_score_flat(dp: *const f64, lp: *const f64, ng: usize) -> f64 {
    let lens = slice_from(lp, ng);
    let total: usize = lens.iter().map(|&l| l as usize).sum();
    let data = slice_from(dp, total);
    let mut groups = Vec::with_capacity(ng);
    let mut off = 0;
    for &l in lens {
        let l = l as usize;
        groups.push(&data[off..off + l]);
        off += l;
    }
    stat_core::anova_f_score(&groups)
}

#[no_mangle]
pub unsafe extern "C" fn anova_flat(
    dp: *const f64,
    lp: *const f64,
    ng: usize,
    out: *mut f64,
) -> isize {
    let lens = slice_from(lp, ng);
    let total: usize = lens.iter().map(|&l| l as usize).sum();
    let data = slice_from(dp, total);
    let mut groups = Vec::with_capacity(ng);
    let mut off = 0;
    for &l in lens {
        let l = l as usize;
        groups.push(&data[off..off + l]);
        off += l;
    }
    let res = stat_core::anova(&groups);
    let o = slice_from_mut(out, 3);
    o[0] = res.f_score;
    o[1] = res.df_between as f64;
    o[2] = res.df_within as f64;
    3
}

#[no_mangle]
pub unsafe extern "C" fn chi_square_test(
    cp1: *const i32,
    cp2: *const i32,
    l: usize,
    c1: usize,
    c2: usize,
    out: *mut f64,
) -> isize {
    let s1: Vec<String> = unsafe { std::slice::from_raw_parts(cp1, l) }
        .iter()
        .map(|x| x.to_string())
        .collect();
    let s2: Vec<String> = unsafe { std::slice::from_raw_parts(cp2, l) }
        .iter()
        .map(|x| x.to_string())
        .collect();
    let res = stat_core::chi_square_test_with_cardinality(&s1, &s2, Some(c1), Some(c2));
    let o = slice_from_mut(out, 3);
    o[0] = res.statistic;
    o[1] = res.p_value;
    o[2] = res.df as f64;
    3
}

#[no_mangle]
pub unsafe extern "C" fn anova_f_score_categorical(
    gp: *const i32,
    vp: *const f64,
    l: usize,
) -> f64 {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }
        .iter()
        .map(|x| x.to_string())
        .collect();
    stat_core::anova_f_score_categorical(&s, slice_from(vp, l))
}

#[no_mangle]
pub unsafe extern "C" fn anova_categorical(
    gp: *const i32,
    vp: *const f64,
    l: usize,
    out: *mut f64,
) -> isize {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }
        .iter()
        .map(|x| x.to_string())
        .collect();
    let res = stat_core::anova_categorical(&s, slice_from(vp, l));
    let o = slice_from_mut(out, 3);
    o[0] = res.f_score;
    o[1] = res.df_between as f64;
    o[2] = res.df_within as f64;
    3
}

#[no_mangle]
pub unsafe extern "C" fn tukey_hsd_categorical(
    gp: *const i32,
    vp: *const f64,
    l: usize,
    out: *mut f64,
) -> isize {
    let s: Vec<String> = unsafe { std::slice::from_raw_parts(gp, l) }
        .iter()
        .map(|x| x.to_string())
        .collect();
    let res = stat_core::tukey_hsd_categorical(&s, slice_from(vp, l));
    let nc = res.comparisons.len();
    let o = slice_from_mut(out, 3 + nc * 7);
    o[0] = res.num_groups as f64;
    o[1] = res.df_within as f64;
    o[2] = res.msw;
    for (i, c) in res.comparisons.iter().enumerate() {
        let b = 3 + i * 7;
        o[b] = c.group1 as f64;
        o[b + 1] = c.group2 as f64;
        o[b + 2] = c.mean_diff;
        o[b + 3] = c.q_statistic;
        o[b + 4] = c.p_value;
        o[b + 5] = c.ci_lower;
        o[b + 6] = c.ci_upper;
    }
    nc as isize
}
