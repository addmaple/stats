#!/bin/bash
# Build local package if possible, but don't fail if it doesn't work
set +e  # Don't exit on error

cd ../js/package

# Check if Rust is available
if ! command -v cargo &> /dev/null; then
  echo "⚠️  Rust not found - skipping local build, will use npm package"
  exit 0
fi

# Check if wasm-pack is available
if ! command -v wasm-pack &> /dev/null; then
  echo "⚠️  wasm-pack not found - skipping local build, will use npm package"
  exit 0
fi

# Try to build
echo "🔨 Building local package..."
npm install && npm run build

# Copy WASM package files to docs public directory for VitePress to serve
echo "📦 Copying WASM files to docs public directory..."
DOCS_DIR="../../docs"
PUBLIC_DIR="$DOCS_DIR/public/assets"
mkdir -p "$PUBLIC_DIR"

if [ $? -eq 0 ] && [ -d "pkg" ]; then
  echo "✅ Local package built successfully"
  # Copy from local build
  cp -r pkg "$PUBLIC_DIR/"
  echo "✅ Copied WASM packages to $PUBLIC_DIR/pkg"
else
  echo "⚠️  Local build failed or pkg not found - using npm package"
  # Fallback: copy from node_modules (npm package)
  if [ -d "node_modules/@addmaple/stats/pkg" ]; then
    echo "📦 Copying WASM packages from node_modules..."
    cp -r node_modules/@addmaple/stats/pkg "$PUBLIC_DIR/"
    echo "✅ Copied WASM packages from node_modules to $PUBLIC_DIR/pkg"
  else
    echo "⚠️  No WASM packages found in node_modules either"
  fi
fi

exit 0  # Always succeed so npm continues









