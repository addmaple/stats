# Linear Regression Performance

This page documents **real-world** linear regression performance for `@addmaple/stats`, with special attention to **WASM vs native** and to the difference between **compute time** and **JS↔WASM marshalling time**.

All benchmarks use:
- Dataset: `data/diabetes-prediction.csv`
- Rows: **10,000** and **100,000**
- Regression: **x = age**, **y = bmi**

Note: `@addmaple/stats` currently supports **simple linear regression** (single feature \(x\) → target \(y\)). If you need **multivariate** or other more complex regression models, we support those at [addmaple.com](https://addmaple.com).

## TL;DR

- **Native Rust** (`cargo bench`) shows the algorithmic improvements clearly.
- **WASM “high-level API”** (`regress(...)`) can look much slower because it includes:
  - allocating WASM buffers,
  - copying `x` and `y` into WASM memory every call,
  - and (for full regression) copying the residual array back out.
- For fair “WASM compute” comparisons, use **workspace/no-copy** APIs:
  - `RegressionWorkspace` (f64)
  - `RegressionWorkspaceF32` (f32, uses `f32x4` SIMD on wasm32)

---

## Benchmarks: Native (Rust / Criterion)

Run:

```bash
cargo bench --package stat-core --bench stats_bench -- "regress_.*10K|regress_.*100K"
```

### 100,000 rows (full regression)

Measured (Criterion time ranges):

| Implementation | Time (µs) | Notes |
|---|---:|---|
| `regress_naive` | ~323–541 | scalar, multi-pass |
| `regress_simd` | ~94–101 | fused sums + SIMD |
| `regress_kernels` | ~114–141 | multiple passes + SIMD kernels |
| `regress` | ~111–196 | default aliases SIMD; variance/outliers depend on run |

Interpretation:
- **SIMD fused sums wins** primarily by reducing passes and using vectorized accumulation.
- “Kernels” can be competitive when kernels are good, but extra passes still cost memory bandwidth.

---

## Benchmarks: WASM (Node)

### Why the default JS API can look slower than expected

A call like `regress(x, y)` does (for large arrays):
- allocate WASM memory for `x` + `y`
- copy `x` + `y` into WASM
- compute
- allocate + compute residuals
- copy residuals back into JS
- free buffers

For large `n`, the copy/alloc steps can dominate.

### The recommended “compute-only” measurement

Use a workspace so `x` and `y` are copied **once**, and then benchmark compute:

```js
import { init, RegressionWorkspace } from '@addmaple/stats';

await init();
const ws = RegressionWorkspace.fromXY(x, y, false);

// coeffs-only (no residuals)
ws.coeffsSimd();

ws.free();
```

### 100,000 rows: workspace (no per-iteration alloc/copy)

These numbers are representative of **WASM compute** for the regression kernels.

| Implementation | Coeffs-only (µs) | Residuals-in-place (µs) | Notes |
|---|---:|---:|---|
| `RegressionWorkspace` (f64) | ~100 | ~63 | f64 path; avoids JS↔WASM copies |
| `RegressionWorkspaceF32` (f32) | ~41 | ~30 | f32 path; uses wasm `f32x4` SIMD |

Interpretation:
- Switching to **f32 end-to-end** is a large win on wasm32 because:
  - 2× less memory bandwidth,
  - `f32x4` is the natural SIMD shape for `v128`.

---

## Which API should you use?

### If you need residuals
- Prefer **in-place residuals**:

```js
import { init, RegressionWorkspace } from '@addmaple/stats';

await init();
const ws = RegressionWorkspace.fromXY(x, y, true);
ws.residualsInPlaceSimd();
// optionally copy residuals out:
// const r = ws.readResiduals();
ws.free();
```

### If you only need slope/intercept/R²
Use coefficients-only APIs:

```js
import { init, regressSimdCoeffs } from '@addmaple/stats';

await init();
const coeffs = regressSimdCoeffs(x, y);
```

### Fastest WASM option
If your tolerance allows f32:

```js
import { init, RegressionWorkspaceF32 } from '@addmaple/stats';

await init();
const xf32 = new Float32Array(x);
const yf32 = new Float32Array(y);

const ws = RegressionWorkspaceF32.fromXY(xf32, yf32, false);
const coeffs = ws.coeffsSimd();
ws.free();
```

---

## Notes on accuracy

- f64 (`RegressionWorkspace`) matches the library’s existing `regress` semantics.
- f32 (`RegressionWorkspaceF32`) is usually accurate enough for many datasets, but expect small numeric drift.

---

## Appendix: Reproducing the exact data extraction

The benchmark uses the first rows of `data/diabetes-prediction.csv` and reads:
- age = column 2
- bmi = column 6

(0-based indices in JS: `parts[1]` and `parts[5]`)



