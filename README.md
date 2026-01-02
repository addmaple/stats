# Stats - High-Performance Statistics Library

A high-performance statistics library built with Rust and WebAssembly, designed to be a modern, fast alternative to jStat.

📚 **[📖 View Full Documentation →](https://addmaple.github.io/stats/)** - Interactive examples, guides, and complete API reference

## Architecture

- **Pure Rust core** (`stat-core`) - No WebAssembly-specific code
- **Thin WASM boundary** (`stat-wasm-*`) - Minimal wasm-bindgen-lite bindings
- **Ergonomic JS/TS API** (`js/package`) - Modern, tree-shakeable API

## Current Status

### ✅ Implemented

- **Basic vector statistics**: `sum`, `mean`, `variance`, `stdev`, `min`, `max`, `median`, `mode`, etc.
- **Distributions**: Normal, Gamma, Beta, Student's T, Chi-Squared, Poisson, Binomial, and more.
- **Statistical Tests**: T-Test, Z-Test, ANOVA, Chi-Square, Tukey HSD.
- **Correlation**: Covariance, Pearson Correlation, Spearman Rank Correlation.
- **Regression**: Fast linear regression with SIMD support.
- **Quantiles**: Percentiles, Quartiles, IQR, and advanced Histogram Binning.
- **SIMD-optimized** implementations using `wide` crate.
- **WASM-powered** with memory-efficient typed array views.
- **Tree-shakeable** modular architecture.

### 🚧 Future Work

- Matrix operations
- Linear algebra routines
- Native multi-dimensional array support (ndarray integration)
- GPU-accelerated kernels via WebGPU

## Building

### Rust

```bash
# Build and test
cargo build
cargo test

# Run benchmarks
cargo bench
```

### WebAssembly

The project uses `wasm-bindgen-lite` for high-performance, size-optimized bindings.

```bash
# Build all WASM modules
cd js/package
npm run build:wasm
```

### JavaScript Package

```bash
cd js/package
npm install
npm run build
```

## Running Benchmarks

```bash
cd js/bench
npm install
npm run bench
```

## Installation

```bash
npm install @addmaple/stats
```

## Usage

```javascript
import { init, mean, variance, stdev } from '@addmaple/stats';

// Initialize WASM module
await init();

// Use statistics functions
const data = [1, 2, 3, 4, 5];
const m = mean(data);
const v = variance(data);
const s = stdev(data);
```

## Documentation

📚 **[View Full Documentation →](https://addmaple.github.io/stats/)** - Comprehensive guides, examples, and API reference

The documentation includes:
- **Getting Started Guide** - Installation and quick start
- **Interactive Examples** - Try out functions directly in your browser
- **API Reference** - Auto-generated from TypeScript source
- **Performance Guide** - Optimization tips and benchmarks

> 💡 **Tip**: The documentation site includes interactive code examples you can run directly in your browser!

### Local Development

```bash
cd docs
npm install
npm run dev
```

## Project Structure

```
.
├─ crates/
│  ├─ stat-core              # Pure Rust statistics library
│  ├─ stat-wasm              # Main WASM bindings
│  ├─ stat-wasm-stats        # Statistics module WASM bindings
│  ├─ stat-wasm-distributions # Distributions module WASM bindings
│  ├─ stat-wasm-quantiles    # Quantiles module WASM bindings
│  ├─ stat-wasm-correlation  # Correlation module WASM bindings
│  └─ stat-wasm-tests        # Statistical tests module WASM bindings
├─ js/
│  ├─ package/        # TypeScript wrapper and NPM package
│  ├─ bench/          # Performance benchmarks vs jStat
│  └─ tests/          # Test suite
├─ docs/              # Documentation site (VitePress)
└─ tools/             # Build scripts
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

