//! Statistics primitives and helpers.
//!
//! ## NaN / empty-input semantics
//! - **Empty inputs**: most functions return `NaN` for empty inputs; a few return an identity
//!   (e.g. `sum(&[]) == 0.0`, cumulative ops return empty vectors).
//! - **NaN inputs**: by default, most functions **do not pre-scan** for `NaN`.
//!   `NaN` typically propagates through the arithmetic and yields `NaN` outputs.
//!   Some functions explicitly reject `NaN` (for example, order-statistics that rely on sorting).
//! - If you want **explicit NaN rejection** (fail-fast) for statistical tests, use the provided
//!   `*_strict` variants in `statistical_tests`.
//!
//! This module is performance-oriented: hot paths avoid extra passes unless needed for numerical
//! stability (e.g. centered correlation).

// Make SIMD macros available to all submodules
#[macro_use]
mod simd;

mod basic;
mod correlation;
mod histogram;
mod minmax;
mod moments;
mod order;
mod regression;
mod statistical_tests;
mod transform;

// Re-export all public items to maintain the same public API
pub use basic::*;
pub use correlation::*;
pub use histogram::*;
pub use minmax::*;
pub use moments::*;
pub use order::*;
pub use regression::*;
pub use statistical_tests::*;
pub use transform::*;

#[cfg(test)]
mod tests;





