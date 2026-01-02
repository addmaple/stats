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

fn slice_from<'a>(ptr: *const f64, len: usize) -> &'a [f64] {
    unsafe { std::slice::from_raw_parts(ptr, len) }
}

fn slice_from_mut<'a>(ptr: *mut f64, len: usize) -> &'a mut [f64] {
    unsafe { std::slice::from_raw_parts_mut(ptr, len) }
}

#[no_mangle]
pub unsafe extern "C" fn percentile_f64(ptr: *const f64, len: usize, k: f64, ex: bool) -> f64 {
    stat_core::percentile(slice_from(ptr, len), k, ex)
}
#[no_mangle]
pub unsafe extern "C" fn percentile_inclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    stat_core::percentile_inclusive(slice_from(ptr, len), k)
}
#[no_mangle]
pub unsafe extern "C" fn percentile_exclusive_f64(ptr: *const f64, len: usize, k: f64) -> f64 {
    stat_core::percentile_exclusive(slice_from(ptr, len), k)
}
#[no_mangle]
pub unsafe extern "C" fn percentile_of_score_f64(
    ptr: *const f64,
    len: usize,
    s: f64,
    st: bool,
) -> f64 {
    stat_core::percentile_of_score(slice_from(ptr, len), s, st)
}

#[no_mangle]
pub unsafe extern "C" fn iqr_f64(ptr: *const f64, len: usize) -> f64 {
    stat_core::iqr(slice_from(ptr, len))
}

#[no_mangle]
pub unsafe extern "C" fn quartiles_f64(ptr: *const f64, len: usize, out_ptr: *mut f64) -> isize {
    let q = stat_core::quartiles(slice_from(ptr, len));
    let out = slice_from_mut(out_ptr, 3);
    out[0] = q[0];
    out[1] = q[1];
    out[2] = q[2];
    3
}
#[no_mangle]
pub unsafe extern "C" fn quantiles_f64(
    dp: *const f64,
    dl: usize,
    qsp: *const f64,
    qsl: usize,
    out_ptr: *mut f64,
) -> isize {
    let result = stat_core::quantiles(slice_from(dp, dl), slice_from(qsp, qsl));
    slice_from_mut(out_ptr, qsl).copy_from_slice(&result);
    qsl as isize
}

#[no_mangle]
pub unsafe extern "C" fn weighted_percentile_f64(
    dp: *const f64,
    dl: usize,
    wp: *const f64,
    wl: usize,
    p: f64,
) -> f64 {
    stat_core::weighted_percentile(slice_from(dp, dl), slice_from(wp, wl), p)
}

#[no_mangle]
pub unsafe extern "C" fn weighted_quantiles_f64(
    dp: *const f64,
    dl: usize,
    wp: *const f64,
    wl: usize,
    qsp: *const f64,
    qsl: usize,
    out_ptr: *mut f64,
) -> isize {
    let res =
        stat_core::weighted_quantiles(slice_from(dp, dl), slice_from(wp, wl), slice_from(qsp, qsl));
    slice_from_mut(out_ptr, qsl).copy_from_slice(&res);
    qsl as isize
}

#[no_mangle]
pub unsafe extern "C" fn weighted_median_f64(
    dp: *const f64,
    dl: usize,
    wp: *const f64,
    wl: usize,
) -> f64 {
    stat_core::weighted_median(slice_from(dp, dl), slice_from(wp, wl))
}

#[no_mangle]
pub unsafe extern "C" fn qscore_f64(ptr: *const f64, len: usize, s: f64, st: bool) -> f64 {
    stat_core::qscore(slice_from(ptr, len), s, st)
}
#[no_mangle]
pub unsafe extern "C" fn qtest_f64(ptr: *const f64, len: usize, s: f64, ql: f64, qu: f64) -> bool {
    stat_core::qtest(slice_from(ptr, len), s, ql, qu)
}

#[no_mangle]
pub unsafe extern "C" fn histogram_f64(
    ptr: *const f64,
    len: usize,
    bc: usize,
    out_ptr: *mut f64,
) -> isize {
    let bins = stat_core::histogram(slice_from(ptr, len), bc);
    let out = slice_from_mut(out_ptr, bc);
    for i in 0..bc {
        out[i] = bins[i] as f64;
    }
    bc as isize
}
#[no_mangle]
pub unsafe extern "C" fn histogram_edges_f64(
    dp: *const f64,
    dl: usize,
    ep: *const f64,
    el: usize,
    out_ptr: *mut f64,
) -> isize {
    let bins = stat_core::histogram_edges(slice_from(dp, dl), slice_from(ep, el));
    let bc = bins.len();
    let out = slice_from_mut(out_ptr, bc);
    for i in 0..bc {
        out[i] = bins[i] as f64;
    }
    bc as isize
}

#[no_mangle]
pub unsafe extern "C" fn histogram_fixed_width_with_edges_f64(
    ptr: *const f64,
    len: usize,
    bins: usize,
    e_out: *mut f64,
    c_out: *mut f64,
) -> isize {
    let res = stat_core::histogram_fixed_width_with_edges(slice_from(ptr, len), bins);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() {
        cout[i] = res.counts[i] as f64;
    }
    res.counts.len() as isize
}

#[no_mangle]
pub unsafe extern "C" fn histogram_equal_frequency_with_edges_f64(
    ptr: *const f64,
    len: usize,
    bins: usize,
    e_out: *mut f64,
    c_out: *mut f64,
) -> isize {
    let res = stat_core::histogram_equal_frequency_with_edges(slice_from(ptr, len), bins);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() {
        cout[i] = res.counts[i] as f64;
    }
    res.counts.len() as isize
}

#[no_mangle]
pub unsafe extern "C" fn histogram_auto_with_edges_f64(
    ptr: *const f64,
    len: usize,
    rule: usize,
    bo: usize,
    e_out: *mut f64,
    c_out: *mut f64,
) -> isize {
    let r = match rule {
        0 => stat_core::BinningRule::FreedmanDiaconis,
        1 => stat_core::BinningRule::Scott,
        2 => stat_core::BinningRule::SqrtN,
        _ => stat_core::BinningRule::FreedmanDiaconis,
    };
    let res = stat_core::histogram_auto_with_edges(
        slice_from(ptr, len),
        r,
        if bo == 0 { None } else { Some(bo) },
    );
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() {
        cout[i] = res.counts[i] as f64;
    }
    res.counts.len() as isize
}

#[no_mangle]
pub unsafe extern "C" fn histogram_auto_with_edges_collapse_tails_f64(
    ptr: *const f64,
    len: usize,
    rule: usize,
    bo: usize,
    k: f64,
    e_out: *mut f64,
    c_out: *mut f64,
) -> isize {
    let r = match rule {
        0 => stat_core::BinningRule::FreedmanDiaconis,
        1 => stat_core::BinningRule::Scott,
        2 => stat_core::BinningRule::SqrtN,
        _ => stat_core::BinningRule::FreedmanDiaconis,
    };
    let res = stat_core::histogram_auto_with_edges_collapse_tails(
        slice_from(ptr, len),
        r,
        if bo == 0 { None } else { Some(bo) },
        k,
    );
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() {
        cout[i] = res.counts[i] as f64;
    }
    res.counts.len() as isize
}

#[no_mangle]
pub unsafe extern "C" fn histogram_custom_with_edges_f64(
    dp: *const f64,
    dl: usize,
    ep: *const f64,
    el: usize,
    co: bool,
    e_out: *mut f64,
    c_out: *mut f64,
) -> isize {
    let res = stat_core::histogram_custom_with_edges(slice_from(dp, dl), slice_from(ep, el), co);
    slice_from_mut(e_out, res.edges.len()).copy_from_slice(&res.edges);
    let cout = slice_from_mut(c_out, res.counts.len());
    for i in 0..res.counts.len() {
        cout[i] = res.counts[i] as f64;
    }
    res.counts.len() as isize
}
