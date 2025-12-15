# Initialization

The `init()` function must be called before using any statistics functions. This function loads and initializes the WebAssembly module.

## Basic Usage

```js
import { init, mean } from '@addmaple/stats';

await init();

// Now you can use functions
const result = mean([1, 2, 3]);
```

## Why Initialization is Required

The library uses WebAssembly for performance. The `init()` function:

1. Detects SIMD support in the runtime
2. Loads the appropriate WASM module
3. Sets up memory management

## Initialization is Idempotent

It's safe to call `init()` multiple times - it will only initialize once:

```js
import { init } from '@addmaple/stats';

await init();
await init(); // Does nothing, already initialized
await init(); // Still does nothing
```

## Error Handling

If initialization fails (e.g., WASM not supported), `init()` will throw:

```js
import { init } from '@addmaple/stats';

try {
  await init();
} catch (error) {
  console.error('Failed to initialize:', error);
  // Handle error - maybe fall back to a JS implementation
}
```

## Best Practices

### 1. Initialize Early

Initialize as early as possible in your application:

```js
// app.js
import { init } from '@addmaple/stats';

// Initialize immediately
await init();

// Import and use functions
import { mean, variance } from '@addmaple/stats';
```

### 2. Module-Level Initialization

For modules that export statistics functions:

```js
// stats-utils.js
import { init, mean, variance } from '@addmaple/stats';

let ready = false;

// Initialize on first import
init().then(() => {
  ready = true;
});

export function getMean(data) {
  if (!ready) {
    throw new Error('Module not initialized yet');
  }
  return mean(data);
}
```

### 3. React/Component Initialization

For React applications:

```js
import { useEffect, useState } from 'react';
import { init, mean } from '@addmaple/stats';

function StatsComponent() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    init().then(() => setReady(true));
  }, []);
  
  if (!ready) return <div>Loading...</div>;
  
  return <div>{mean([1, 2, 3])}</div>;
}
```

### 4. Check Before Use

If you're not sure if initialization has completed:

```js
import { init, mean } from '@addmaple/stats';

async function safeMean(data) {
  await init(); // Safe to call multiple times
  return mean(data);
}
```

## Performance Notes

- Initialization is fast (~1-10ms typically)
- The WASM module is small (~50-100KB gzipped)
- Once initialized, function calls are extremely fast




