#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../../.." && pwd)"
PACKAGE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
WASM_BINDGEN_LITE="$PACKAGE_DIR/node_modules/.bin/wasm-bindgen-lite"

echo "Building WASM modules using wasm-bindgen-lite..."
echo "ROOT_DIR: $ROOT_DIR"
echo "PACKAGE_DIR: $PACKAGE_DIR"

build_module() {
    local crate_name=$1
    local out_dir="$PACKAGE_DIR/pkg/$crate_name"
    echo "Building $crate_name..."
    mkdir -p "$out_dir"
    cd "$ROOT_DIR/crates/$crate_name"
    # wasm-bindgen-lite expects target/ in the crate dir, but it's in the workspace root
    if [ ! -L "target" ]; then
        ln -s ../../target target
    fi
    "$WASM_BINDGEN_LITE" build --crate . --out "$out_dir"
}

build_module "stat-wasm-stats"
build_module "stat-wasm-distributions"
build_module "stat-wasm-quantiles"
build_module "stat-wasm-correlation"
build_module "stat-wasm-tests"
build_module "stat-wasm"

echo "✅ All WASM modules built successfully using wasm-bindgen-lite!"
