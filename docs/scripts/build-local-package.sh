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

if [ $? -eq 0 ]; then
  echo "✅ Local package built successfully"
else
  echo "⚠️  Local build failed - docs will use npm package"
fi

exit 0  # Always succeed so npm continues







