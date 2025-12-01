# Stats - High-Performance Statistics Library

A high-performance statistics library built with Rust and WebAssembly, designed to be a modern, fast alternative to jStat.

## Architecture

- **Pure Rust core** (`stat-core`) - No WebAssembly-specific code
- **Thin WASM boundary** (`stat-wasm`) - Minimal wasm-bindgen glue
- **Ergonomic JS/TS API** (`js/package`) - Modern, tree-shakeable API

## Current Status

### ✅ Implemented

- Basic vector statistics:
  - `sum` - Sum of array elements
  - `mean` - Arithmetic mean
  - `variance` - Population variance
  - `sampleVariance` - Sample variance (Bessel's correction)
  - `stdev` - Population standard deviation
  - `sampleStdev` - Sample standard deviation

- SIMD-optimized implementations using `wide` crate
- WASM bindings with memory-efficient typed array views
- Benchmark suite comparing against jStat

### 🚧 Coming Soon

- Distributions (normal, t, chi-square, etc.)
- Linear algebra operations
- Statistical tests
- SIMD builds with runtime detection

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

```bash
# Build WASM package
cd crates/stat-wasm
wasm-pack build --target bundler --out-dir pkg
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

📚 **[View Full Documentation](docs/)** - Comprehensive guides, examples, and API reference

The documentation includes:
- **Getting Started Guide** - Installation and quick start
- **Examples** - Multiple examples for each feature category
- **API Reference** - Auto-generated from TypeScript source
- **Performance Guide** - Optimization tips and benchmarks

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
│  ├─ stat-core       # Pure Rust statistics library
│  └─ stat-wasm       # WASM bindings
├─ js/
│  ├─ package/        # TypeScript wrapper and NPM package
│  └─ bench/          # Performance benchmarks vs jStat
└─ tools/             # Build scripts
```

