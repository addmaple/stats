#!/bin/bash
set -e

cd "$(dirname "$0")/../../.."
ROOT_DIR="$(pwd)"
PACKAGE_DIR="$(dirname "$0")/.."
export RUSTFLAGS="-C target-feature=+simd128"

echo "Building WASM modules for tree-shaking..."

# Build stats module
echo "Building stat-wasm-stats..."
cd crates/stat-wasm-stats
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-stats"
cp -r crates/stat-wasm-stats/pkg/* "$PACKAGE_DIR/pkg/stat-wasm-stats/"

# Build distributions module
echo "Building stat-wasm-distributions..."
cd crates/stat-wasm-distributions
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-distributions"
cp -r crates/stat-wasm-distributions/pkg/* "$PACKAGE_DIR/pkg/stat-wasm-distributions/"

# Build quantiles module
echo "Building stat-wasm-quantiles..."
cd crates/stat-wasm-quantiles
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-quantiles"
cp -r crates/stat-wasm-quantiles/pkg/* "$PACKAGE_DIR/pkg/stat-wasm-quantiles/"

# Build correlation module
echo "Building stat-wasm-correlation..."
cd crates/stat-wasm-correlation
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-correlation"
cp -r crates/stat-wasm-correlation/pkg/* "$PACKAGE_DIR/pkg/stat-wasm-correlation/"

# Build tests module
echo "Building stat-wasm-tests..."
cd crates/stat-wasm-tests
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-tests"
cp -r crates/stat-wasm-tests/pkg/* "$PACKAGE_DIR/pkg/stat-wasm-tests/"

# Build full module (for index.ts)
echo "Building stat-wasm (full module)..."
cd crates/stat-wasm
wasm-pack build --target bundler --out-dir pkg
cd "$ROOT_DIR"
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm"
cp -r crates/stat-wasm/pkg/* "$PACKAGE_DIR/pkg/stat-wasm/"

echo "✅ All WASM modules built and copied successfully!"

