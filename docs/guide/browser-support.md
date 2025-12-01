# Browser Support

`@stats/core` works in all modern browsers that support WebAssembly.

## Supported Browsers

- **Chrome/Edge**: 57+ (WebAssembly support)
- **Firefox**: 52+ (WebAssembly support)
- **Safari**: 11+ (WebAssembly support)
- **Node.js**: 18+ (for ESM support)

## WebAssembly Support

The library requires WebAssembly support. All modern browsers support WebAssembly, but if you need to support older browsers, you'll need a polyfill or fallback.

## Checking Support

```js
// Check if WebAssembly is supported
if (typeof WebAssembly === 'object') {
  // WebAssembly is supported
  import('@stats/core').then(async ({ init, mean }) => {
    await init();
    console.log(mean([1, 2, 3]));
  });
} else {
  // Fallback to pure JS implementation
  console.warn('WebAssembly not supported');
}
```

## Bundler Configuration

### Vite

No special configuration needed. Vite handles WASM modules automatically.

### Webpack

Webpack 5+ handles WASM modules automatically. For Webpack 4, you may need:

```js
// webpack.config.js
module.exports = {
  experiments: {
    asyncWebAssembly: true
  }
};
```

### Rollup

Rollup handles WASM modules automatically with the appropriate plugins.

## CDN Usage

You can use the library directly from a CDN:

```html
<script type="module">
  import { init, mean } from 'https://cdn.jsdelivr.net/npm/@stats/core/dist/index.js';
  
  await init();
  console.log(mean([1, 2, 3]));
</script>
```

## TypeScript Support

TypeScript definitions are included. No additional configuration needed:

```ts
import { init, mean } from '@stats/core';
```

