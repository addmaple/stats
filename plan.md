## 1. Overall architecture

**Goal:**

* Pure Rust core (no WebAssembly-specific stuff).
* Ultra-thin Wasm boundary.
* Ergonomic TypeScript/ESM API that feels like modern jStat.

**Workspace layout (monorepo-ish)**

```text
.
├─ crates/
│  ├─ stat-core       # Pure Rust: stats, distributions, LA, regression
│  └─ stat-wasm       # wasm-bindgen exports, tiny glue only
├─ js/
│  ├─ package/        # TypeScript wrapper, ESM build, NPM package
│  └─ bench/          # perf tests vs jstat and friends
└─ tools/             # scripts, wasm-pack config, etc.
```

---

## 2. Rust crate selection

### Core math & statistics

* **Distributions & special functions:**

  * **`statrs`** – robust, well‑tested distributions (normal, gamma, beta, t, etc.) plus gamma/beta/erf special functions.([GitHub][1])
  * This basically covers the whole jStat “Distributions” section (pdf, cdf, inv, mean, var, sample, etc.) with minimal effort.

* **Random numbers:**

  * **`rand`** + **`rand_distr`** – RNG core and some extra distributions; plays nicely with `statrs`.([Docs.rs][2])

* **Vector & matrix operations:**

  * **`nalgebra`** – general-purpose LA crate with dynamic matrices and decompositions (LU/QR/SVD). It explicitly supports wasm targets and even has a section on wasm & embedded.([nalgebra.rs][3])
  * If you later decide you want *really* hardcore numerical LA for big matrices, you can swap or supplement with **`faer`** (high-performance LA, though heavier).([Docs.rs][4])

* **SIMD:**

  * **`wide`** – portable SIMD abstraction that works on **x86, aarch64, and wasm32**, using explicit intrinsics under the hood where available.([crates.io][5])
  * This lets you write vectorised loops once and have them compile to wasm SIMD or scalar as appropriate.

* **Helpers:**

  * `num-traits` – numeric traits, conversions, etc.
  * `approx` – for tolerant float comparisons in tests.

### Wasm & JS bridge

* **Interop:**

  * **`wasm-bindgen`** for Rust ↔ JS bindings. Standard, well-documented, future‑proof for web/Node integration.([wasm-bindgen.github.io][6])
  * **`serde`** + **`serde_wasm_bindgen`** for structured configs when needed (e.g. regression options). Keeps JS⇄Rust serialization efficient without JSON.([Docs.rs][7])

* **Build tooling:**

  * **`wasm-pack`** to produce NPM‑ready packages and manage wasm-bindgen glue.([npm][8])

* **Allocator:**

  * Stick with **default allocator (`dlmalloc`)** for `wasm32-unknown-unknown`; that’s what Rust uses by default and it’s considered solid and tuned for Wasm.([Docs.rs][9])
  * Avoid `wee_alloc` (now considered unmaintained and flagged by RustSec).([GitHub][10])

---

## 3. SIMD strategy (Rust + Wasm)

### Enabling SIMD in Rust for wasm

* Target: `wasm32-unknown-unknown`.

* Enable SIMD at compile time:

  ```toml
  # .cargo/config.toml
  [target.wasm32-unknown-unknown]
  rustflags = ["-C", "target-feature=+simd128"]
  ```

  or via `RUSTFLAGS="-C target-feature=+simd128"` in the build pipeline.([Rust Docs][11])

* For hand‑rolled intrinsics, you can optionally use `core::arch::wasm32` with `#[target_feature(enable = "simd128")]` on the hottest functions, but `wide` lets you mostly avoid this.([Rust Docs][11])

### Runtime detection / dual builds

**Problem:** a SIMD‑enabled Wasm module won’t load on engines without Wasm SIMD.

**Solution plan:**

1. Build **two** `.wasm` artifacts:

   * `stat_core_bg.wasm` – baseline, **no** `+simd128`.
   * `stat_core_simd_bg.wasm` – compiled with `+simd128` and using `wide`.

2. Use **`wasm-feature-detect`** in the JS wrapper:

   ```ts
   import { simd } from 'wasm-feature-detect'; // tests WASM SIMD support:contentReference[oaicite:12]{index=12}

   export async function loadStat() {
     const supportsSimd = await simd();
     return supportsSimd
       ? import('./pkg-simd/stat_core.js')
       : import('./pkg/stat_core.js');
   }
   ```

   This pattern (two modules + feature detection) is exactly what recent Wasm SIMD guides recommend.([emscripten.org][12])

3. In Rust, keep all vectorized kernels written using `wide` so the same code works in both builds; the non‑SIMD build simply compiles to scalar instructions.

### What gets SIMD-ized?

Use `wide` for the hot paths:

* Vector stats: `mean`, `variance`, `stdev`, `covariance`, `corrcoeff`, `histogram`, etc.
* Batch distribution operations: `normal.pdf(x[])`, `normal.cdf(x[])`, etc.
* Matrix/Vector ops where you control data layout (e.g. dot products in regression, row/column operations).

---

## 4. “Minimal wasm side” design

Interpretation: **Wasm should just be the compute engine**; everything else (API shape, ergonomics) is JS/TS.

Strategy:

1. **Pure Rust core (`stat-core`)**

   * No `wasm-bindgen`. No `js_sys`. No `web-sys`.
   * Only depends on math crates (`statrs`, `nalgebra`, `wide`, etc.).
   * Fully usable as a normal Rust crate (server-side Rust, CLIs, etc).

2. **Thin Wasm wrapper (`stat-wasm`)**

   * Depends on `stat-core` and `wasm-bindgen`.
   * Exports only **coarse‑grained, high-level operations**, not tiny scalar functions:

     * Good: `normal_pdf_inplace(input_ptr, len, mean, sd, output_ptr)`
     * Avoid: `normal_pdf_scalar(x, mean, sd)` being called in a tight JS loop.

3. **Memory interop pattern: typed arrays on wasm memory**

   To get performance and keep glue small:

   * Export allocation helpers:

     ```rust
     #[wasm_bindgen]
     pub fn alloc_f64(len: usize) -> *mut f64 { /* ... */ }

     #[wasm_bindgen]
     pub fn free_f64(ptr: *mut f64, len: usize) { /* ... */ }
     ```

   * JS creates views into **wasm memory**:

     ```ts
     import * as wasm from './pkg/stat_wasm';

     function f64View(ptr: number, len: number): Float64Array {
       return new Float64Array(wasm.memory.buffer, ptr, len);
     }
     ```

   * High‑level operations:

     ```rust
     #[wasm_bindgen]
     pub fn mean_f64(ptr: *const f64, len: usize) -> f64 {
         let data = unsafe { std::slice::from_raw_parts(ptr, len) };
         stat_core::stats::mean(data)
     }

     #[wasm_bindgen]
     pub fn normal_pdf_inplace(
         x_ptr: *const f64,
         len: usize,
         mean: f64,
         sd: f64,
         out_ptr: *mut f64
     ) {
         let xs = unsafe { std::slice::from_raw_parts(x_ptr, len) };
         let ys = unsafe { std::slice::from_raw_parts_mut(out_ptr, len) };
         stat_core::dists::normal_pdf_array(xs, mean, sd, ys);
     }
     ```

   * JS wrapper hides pointers and alloc/free in a nice API (see next section).

   This keeps **Wasm APIs tiny** (just numbers + pointers) and moves all UX/ergonomics into TypeScript.

4. **Optional “simple” JS APIs that accept JS arrays**

   For developer ergonomics, you can layer on top:

   ```ts
   export function mean(data: ArrayLike<number>): number {
     const len = data.length;
     const ptr = wasm.alloc_f64(len);
     const view = f64View(ptr, len);
     for (let i = 0; i < len; i++) view[i] = data[i];
     const result = wasm.mean_f64(ptr, len);
     wasm.free_f64(ptr, len);
     return result;
   }
   ```

   * Easy to use for “normal” sizes.
   * For heavy users, expose a **buffer API** so they can reuse allocations.

---

## 5. JS/TS API shape (modern jStat)

### High-level idea

Make it feel like a modern, tree‑shakeable jStat:

```ts
import {
  mean,
  variance,
  quantiles,
  normal,
  t,
  linreg,
} from '@your-scope/stat';

const m = mean([1, 2, 3]);
const dist = normal({ mean: 0, sd: 1 });

dist.pdf(1.96);             // scalar
dist.pdfArray(xs);          // Float64Array -> Float64Array (SIMD)
dist.sample(10_000);        // RNG-backed
```

**Design notes:**

* **Top-level functions** for vector operations (like jStat’s vector API: `mean`, `stdev`, `histogram`, etc.).([jStat][13])

* **Distribution factories** to mirror jStat’s `jStat.normal(mean, sd)` etc.([jStat][13])

* **Matrix & regression API**:

  ```ts
  import { Matrix, linreg } from '@your-scope/stat';

  const A = Matrix.from2D([[1, x1], [1, x2], ... ]);
  const y = [y1, y2, ...];

  const model = linreg(A, y);
  model.coeffs;         // Float64Array
  model.predict(xNew);  // scalar
  ```

* All exported types get TypeScript definitions generated from `d.ts` produced by wasm‑bindgen, plus hand-polished TS wrappers.

---

## 6. Phase-by-phase development plan

### Phase 0 – Requirements & scope cut

1. Decide **v1 feature subset** from jStat:

   * Vector stats (sum, mean, var, stdev, quantiles, corrcoef, covariance, histogram…).([jStat][13])
   * Distributions: normal, lognormal, t, chi-square, F, gamma, beta, exponential, poisson, binomial, negbin, uniform, weibull, maybe triangular & pareto.([jStat][13])
   * Linear algebra: basic matrix ops + solve (LU/QR).
   * Regression: linear regression (OLS); logistic later.
   * Tests: t-test, chi-square test, etc.

2. Define **performance targets**, e.g.:

   * 2–5x faster than jStat for large vector operations (e.g. 1e6 elements).
   * Acceptable Wasm size budget (e.g. < 300KB compressed).

3. Pick initial crate choices:

   * Start with `statrs + nalgebra + wide`.
   * Keep `faer` as an opt‑in later if LA performance becomes the bottleneck.

---

### Phase 1 – Project scaffolding

1. **Rust workspace**:

   * Create `crates/stat-core` and `crates/stat-wasm`.
   * `stat-core`:

     * `lib` crate, `edition = "2021"`.
   * `stat-wasm`:

     * `crate-type = ["cdylib", "rlib"]` for Wasm with wasm-bindgen.

2. **Wasm config:**

   * Add `wasm32-unknown-unknown` target via `rustup target add wasm32-unknown-unknown`.([Rust Docs][14])
   * `.cargo/config.toml` with basic wasm settings and separate `simd` profile.

3. **JS package scaffold:**

   * `js/package` with:

     * TypeScript (+ ESLint/Prettier).
     * Bundler (Vite/Rollup) configured to not accidentally re‑bundle WASM.
     * Jest / Vitest for unit tests.

4. **Build automation:**

   * `wasm-pack build` scripts for:

     * `stat-wasm` baseline build.
     * `stat-wasm` simd build (with env var to change `RUSTFLAGS`).

---

### Phase 2 – Implement `stat-core` (Rust only)

#### 2.1 Core types

* Define simple aliases:

  ```rust
  pub type VecF64 = Vec<f64>;
  pub type MatrixF64 = nalgebra::DMatrix<f64>;
  ```

* Basic helpers: checks for NaN/Inf, safe index ops, error types.

#### 2.2 Vector statistics (SIMD ready)

* Functions:

  * `sum`, `mean`, `variance`, `stdev`, `skewness`, `kurtosis`, quantiles, histogram, covariance, corrcoef, etc. (mirroring jStat’s vector section).([jStat][13])

* Implementation approach:

  * Normal loops first.
  * Refactor into SIMD kernels using `wide`, e.g. `f64x2` or `f64x4`:

    * Load chunks of `f64` into `wide::f64x2` / `f64x4`.
    * Use vector ops for partial reductions.
    * Tail processing for remaining elements.

* Add micro‑benchmarks (`criterion`) to compare scalar vs SIMD.

#### 2.3 Distributions

* Create traits:

  ```rust
  pub trait Distribution1D {
      fn pdf(&self, x: f64) -> f64;
      fn cdf(&self, x: f64) -> f64;
      fn inv(&self, p: f64) -> f64;
      fn mean(&self) -> f64;
      fn variance(&self) -> f64;
      fn sample(&mut self, rng: &mut impl Rng) -> f64;
  }
  ```

* Implement wrappers around `statrs::distribution::Normal`, `Gamma`, `Beta`, etc.([Docs.rs][2])

* Add **array versions** that are SIMD‑friendly, like:

  ```rust
  fn pdf_array(&self, xs: &[f64], out: &mut [f64]);
  ```

* Validate against jStat outputs (we’ll do cross‑lang tests later).

#### 2.4 Linear algebra & regression

* Use `nalgebra`:

  * Matrix creation from row-major slices.
  * LU / QR decompositions for solving linear systems.([nalgebra.rs][3])

* Regression:

  * Linear regression via least squares (`A^T A` or QR).
  * Optionally regularised regression (ridge) later.

* Expose in `stat-core` as:

  ```rust
  pub fn linreg(X: &MatrixF64, y: &[f64]) -> LinRegModel { /* ... */ }
  ```

#### 2.5 Statistical tests

* Implement classic tests using `statrs` distributions: t-test, chi-square, F-test, etc. (p-values via cdf/inv of relevant distributions).([jStat][13])

* Reuse vector stats and distribution traits.

---

### Phase 3 – `stat-wasm`: Wasm bindings

1. **Basic exports**

   * Export memory for typed array views:

     ```rust
     #[wasm_bindgen]
     extern "C" {
         pub static memory: wasm_bindgen::JsValue; // or via generated JS
     }
     ```

   * Allocation helpers for `f64`, `i32` etc.

2. **High-level stat APIs**

   For each vector operation:

   ```rust
   #[wasm_bindgen]
   pub fn mean_f64(ptr: *const f64, len: usize) -> f64 {
       let data = unsafe { std::slice::from_raw_parts(ptr, len) };
       stat_core::mean(data)
   }
   ```

   For distribution operations:

   ```rust
   #[wasm_bindgen]
   pub fn normal_pdf_inplace(
       x_ptr: *const f64,
       len: usize,
       mean: f64,
       sd: f64,
       out_ptr: *mut f64,
   ) {
       let xs = unsafe { std::slice::from_raw_parts(x_ptr, len) };
       let ys = unsafe { std::slice::from_raw_parts_mut(out_ptr, len) };

       let dist = stat_core::dists::Normal::new(mean, sd);
       dist.pdf_array(xs, ys); // SIMD inside stat-core
   }
   ```

3. **Complex configs via `serde_wasm_bindgen` (optional)**

   For regression/test options, define Rust structs and transparently decode/encode from JS objects.

---

### Phase 4 – JS/TS API & ergonomics

1. **Type-safe wrapper**

   In `js/package/src/index.ts`:

   * Keep the user away from pointers; expose:

     ```ts
     export async function mean(data: ArrayLike<number>): Promise<number> { ... }
     export function normal(params: { mean: number; sd: number }): NormalDist { ... }
     ```

   * `NormalDist` can internally hold:

     * A handle to a Rust distribution instance (if you model that), or
     * Just parameters, and call stat-wasm functions with them.

2. **Buffer/advanced API** (for heavy users)

   ```ts
   export class F64Buffer {
     readonly len: number;
     private ptr: number;
     private view: Float64Array;

     static create(len: number): F64Buffer { ... }

     fillFrom(array: ArrayLike<number>): void { ... }
     toArray(): Float64Array { ... }
   }

   // Usage:
   const buf = F64Buffer.create(n);
   buf.fillFrom(myData);
   stats.meanBuffer(buf);  // no re-allocation, in-wasm loop
   ```

3. **SIMD-aware loader**

   * Implement `loadStat()` that uses `wasm-feature-detect` to pick the SIMD or non‑SIMD module.([wasm-feature-detect.surma.technology][15])

4. **DX improvements**

   * Provide auto‑generated `.d.ts` plus hand‑written TS types for distribution classes, regression results, etc.
   * Document mapping from jStat to new API in Markdown docs.

---

### Phase 5 – Testing, benchmarking, and polishing

1. **Correctness:**

   * Rust tests in `stat-core` using `cargo test`.
   * wasm tests using `wasm-bindgen-test`.
   * JS tests using Jest/Vitest, with cross-checks vs original `jstat` for:

     * distribution pdf/cdf/inv at known points,
     * regression coefficients,
     * test p-values.([jStat][13])

2. **Performance benchmarks:**

   * Node benchmarks:

     * Compare `@your-scope/stat` vs `jstat` on:

       * 1D stats over arrays of size `1e3, 1e5, 1e6`.
       * pdf/cdf on large arrays.
       * matrix multiply/regression.
   * Browser benchmarks (optional) using a simple page + Performance API.

3. **Size & optimization:**

   * Use `opt-level = "s"` or `"z"` for wasm release builds.
   * Enable `lto = true` for release.
   * Use `wasm-opt` (`-O3` or `-Oz`) on the final `.wasm` to minimize size.

4. **Package & publish:**

   * Use `wasm-pack build --target bundler` and wrap with JS package.
   * Add `pack` & `publish` scripts to publish to NPM.([drager.github.io][16])

---

## 7. Summary of recommended crates

* **Math / stats**

  * `statrs` – distributions & special functions.
  * `rand`, `rand_distr` – RNG.
  * `nalgebra` – matrices & LA (can swap/add `faer` later).
  * `wide` – portable SIMD everywhere including wasm32.

* **Wasm / interop**

  * `wasm-bindgen`, `wasm-bindgen-test`
  * `wasm-pack`
  * `serde`, `serde_wasm_bindgen`

* **Misc**

  * `criterion` – benchmarks.
  * `approx` – numeric testing.


[1]: https://github.com/statrs-dev/statrs?utm_source=chatgpt.com "GitHub - statrs-dev/statrs: Statistical computation library for Rust"
[2]: https://docs.rs/statrs/latest/statrs/?utm_source=chatgpt.com "statrs - Rust - Docs.rs"
[3]: https://nalgebra.rs/docs/user_guide/wasm_and_embedded_targets/?utm_source=chatgpt.com "WebAssembly and embedded targets | nalgebra"
[4]: https://docs.rs/faer/latest/faer/?utm_source=chatgpt.com "faer - Rust - Docs.rs"
[5]: https://crates.io/crates/wide?utm_source=chatgpt.com "wide - crates.io: Rust Package Registry"
[6]: https://wasm-bindgen.github.io/wasm-bindgen/?utm_source=chatgpt.com "Introduction - The `wasm-bindgen` Guide"
[7]: https://docs.rs/serde-wasm-bindgen/latest/serde_wasm_bindgen/?utm_source=chatgpt.com "serde_wasm_bindgen - Rust - Docs.rs"
[8]: https://www.npmjs.com/package/wasm-pack?utm_source=chatgpt.com "wasm-pack - npm"
[9]: https://docs.rs/dlmalloc/latest/dlmalloc/?utm_source=chatgpt.com "dlmalloc - Rust - Docs.rs"
[10]: https://github.com/rustwasm/wasm-pack-template/issues/70?utm_source=chatgpt.com "Remove unmaintained wee_alloc · Issue #70 · rustwasm/wasm ... - GitHub"
[11]: https://doc.rust-lang.org/stable/core/arch/wasm32/index.html?utm_source=chatgpt.com "core::arch::wasm32 - Rust"
[12]: https://emscripten.org/docs/porting/simd.html?utm_source=chatgpt.com "Using SIMD with WebAssembly - Emscripten"
[13]: https://jstat.github.io/all.html "All - jStat Documentation"
[14]: https://doc.rust-lang.org/nightly/rustc/platform-support/wasm32-unknown-unknown.html?utm_source=chatgpt.com "wasm32-unknown-unknown - The rustc book - Learn Rust"
[15]: https://wasm-feature-detect.surma.technology/?utm_source=chatgpt.com "Wasm Feature Detect"
[16]: https://drager.github.io/wasm-pack/book/commands/pack-and-publish.html?utm_source=chatgpt.com "pack and publish - Hello wasm-pack! - drager.github.io"
