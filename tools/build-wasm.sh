#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Building WASM package..."
cd crates/stat-wasm

# Build baseline (no SIMD)
echo "Building baseline (no SIMD)..."
wasm-pack build --target bundler --out-dir pkg

echo "Build complete! Output in crates/stat-wasm/pkg/"









