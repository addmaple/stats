#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
export RUSTFLAGS="-C target-feature=+simd128"

echo "Building WASM modules for tree-shaking..."
echo "ROOT_DIR: $ROOT_DIR"
echo "PACKAGE_DIR: $PACKAGE_DIR"

# Build stats module
echo "Building stat-wasm-stats..."
cd "$ROOT_DIR/crates/stat-wasm-stats"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-stats"
cp -r "$ROOT_DIR/crates/stat-wasm-stats/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm-stats/"

# Build distributions module
echo "Building stat-wasm-distributions..."
cd "$ROOT_DIR/crates/stat-wasm-distributions"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-distributions"
cp -r "$ROOT_DIR/crates/stat-wasm-distributions/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm-distributions/"

# Build quantiles module
echo "Building stat-wasm-quantiles..."
cd "$ROOT_DIR/crates/stat-wasm-quantiles"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-quantiles"
cp -r "$ROOT_DIR/crates/stat-wasm-quantiles/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm-quantiles/"

# Build correlation module
echo "Building stat-wasm-correlation..."
cd "$ROOT_DIR/crates/stat-wasm-correlation"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-correlation"
cp -r "$ROOT_DIR/crates/stat-wasm-correlation/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm-correlation/"

# Build tests module
echo "Building stat-wasm-tests..."
cd "$ROOT_DIR/crates/stat-wasm-tests"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm-tests"
cp -r "$ROOT_DIR/crates/stat-wasm-tests/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm-tests/"

# Build full module (for index.ts)
echo "Building stat-wasm (full module)..."
cd "$ROOT_DIR/crates/stat-wasm"
wasm-pack build --target web --out-dir pkg
# Copy to package directory
mkdir -p "$PACKAGE_DIR/pkg/stat-wasm"
cp -r "$ROOT_DIR/crates/stat-wasm/pkg/"* "$PACKAGE_DIR/pkg/stat-wasm/"

echo "✅ All WASM modules built and copied successfully!"

