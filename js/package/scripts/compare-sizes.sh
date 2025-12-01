#!/bin/bash
set -e

cd "$(dirname "$0")/.."
DIST_DIR="dist"
OUTPUT_DIR="size-comparison"

echo "Minifying and comparing bundle sizes..."

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to minify and get size
minify_and_size() {
  local input="$1"
  local output="$2"
  local name="$3"
  
  if [ ! -f "$input" ]; then
    echo "⚠️  $name: File not found: $input"
    return
  fi
  
  # Bundle and minify with esbuild
  # Use external for WASM imports (they're loaded at runtime)
  npx esbuild "$input" \
    --bundle \
    --minify \
    --format=esm \
    --platform=browser \
    --target=es2020 \
    --external:"*.wasm" \
    --external:"wasm-feature-detect" \
    --outfile="$output" \
    2>/dev/null || {
    # Fallback: just minify without bundling
    npx esbuild "$input" --minify --outfile="$output" 2>/dev/null
  }
  
  if [ -f "$output" ]; then
    local size=$(wc -c < "$output" | tr -d ' ')
    local size_kb=$(echo "scale=2; $size / 1024" | bc)
    local gzip_size=$(gzip -c "$output" | wc -c | tr -d ' ')
    local gzip_kb=$(echo "scale=2; $gzip_size / 1024" | bc)
    echo "$name: ${size_kb}K (gzipped: ${gzip_kb}K)"
  fi
}

# Minify each module
echo ""
echo "=== JavaScript Bundle Sizes (Minified) ==="
echo ""

minify_and_size "$DIST_DIR/stats.js" "$OUTPUT_DIR/stats.min.js" "stats"
minify_and_size "$DIST_DIR/distributions.js" "$OUTPUT_DIR/distributions.min.js" "distributions"
minify_and_size "$DIST_DIR/quantiles.js" "$OUTPUT_DIR/quantiles.min.js" "quantiles"
minify_and_size "$DIST_DIR/correlation.js" "$OUTPUT_DIR/correlation.min.js" "correlation"
minify_and_size "$DIST_DIR/tests.js" "$OUTPUT_DIR/tests.min.js" "tests"
minify_and_size "$DIST_DIR/index.js" "$OUTPUT_DIR/index.min.js" "full (index)"

# Check WASM sizes
echo ""
echo "=== WASM Binary Sizes ==="
echo ""

check_wasm_size() {
  local wasm_path="$1"
  local name="$2"
  
  if [ -f "$wasm_path" ]; then
    local size=$(wc -c < "$wasm_path" | tr -d ' ')
    local size_kb=$(echo "scale=2; $size / 1024" | bc)
    local gzip_size=$(gzip -c "$wasm_path" | wc -c | tr -d ' ')
    local gzip_kb=$(echo "scale=2; $gzip_size / 1024" | bc)
    echo "$name: ${size_kb}K (gzipped: ${gzip_kb}K)"
  else
    echo "⚠️  $name: WASM file not found: $wasm_path"
  fi
}

# Check WASM files (they should be in the crate pkg directories)
cd ../..
check_wasm_size "crates/stat-wasm-stats/pkg/stat_wasm_stats_bg.wasm" "stats WASM"
check_wasm_size "crates/stat-wasm-distributions/pkg/stat_wasm_distributions_bg.wasm" "distributions WASM"
check_wasm_size "crates/stat-wasm-quantiles/pkg/stat_wasm_quantiles_bg.wasm" "quantiles WASM"
check_wasm_size "crates/stat-wasm-correlation/pkg/stat_wasm_correlation_bg.wasm" "correlation WASM"
check_wasm_size "crates/stat-wasm-tests/pkg/stat_wasm_tests_bg.wasm" "tests WASM"
check_wasm_size "crates/stat-wasm/pkg/stat_wasm_bg.wasm" "full WASM"

echo ""
echo "✅ Size comparison complete!"
echo "Results saved to: js/package/$OUTPUT_DIR/"

