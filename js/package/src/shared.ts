import { simd } from 'wasm-feature-detect';
import type { ArrayResult } from './wasm-types.js';

export type { ArrayResult };

/**
 * Create a Float64Array view into WASM memory.
 */
export function f64View(ptr: number, len: number, memory: WebAssembly.Memory): Float64Array {
  return new Float64Array(memory.buffer, ptr, len);
}

/**
 * Efficiently copy data to WASM memory.
 *
 * Performance note: `Float64Array` and plain `Array<number>` are fastest.
 * Other array-likes may use a fallback loop which is slower.
 */
export function copyToWasmMemory(data: ArrayLike<number>, view: Float64Array): void {
  if (data instanceof Float64Array) {
    view.set(data);
  } else if (data instanceof Array) {
    view.set(data as number[]);
  } else {
    const len = data.length;
    if (len > 0 && typeof (data as any)[0] === 'number') {
      try {
        view.set(data as any);
      } catch {
        for (let i = 0; i < len; i++) {
          view[i] = data[i];
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        view[i] = data[i];
      }
    }
  }
}

/**
 * Read an array from WASM memory and return a copy.
 */
export function readWasmArray(
  result: ArrayResult,
  memory: WebAssembly.Memory
): Float64Array {
  const view = f64View(result.ptr, result.len, memory);
  const copy = new Float64Array(result.len);
  copy.set(view);
  return copy;
}

export type ArrayKernel = (inputPtr: number, len: number, outputPtr: number) => void;

/**
 * Base interface for any WASM module that provides memory management.
 */
export interface BaseWasmModule {
  get_memory(): WebAssembly.Memory;
  alloc_f64(len: number): number;
  free_f64(ptr: number, len: number): void;
}

/**
 * Run a unary array operation using a WASM kernel.
 */
export function runUnaryArrayOp(
  data: ArrayLike<number>,
  kernel: ArrayKernel,
  wasm: BaseWasmModule,
  memory: WebAssembly.Memory
): Float64Array {
  const len = data.length;
  if (len === 0) {
    return new Float64Array();
  }

  const inputPtr = wasm.alloc_f64(len);
  const outputPtr = wasm.alloc_f64(len);
  const inputView = f64View(inputPtr, len, memory);
  const outputView = f64View(outputPtr, len, memory);
  copyToWasmMemory(data, inputView);
  kernel(inputPtr, len, outputPtr);

  const copy = new Float64Array(len);
  copy.set(outputView);
  wasm.free_f64(inputPtr, len);
  wasm.free_f64(outputPtr, len);
  return copy;
}

/**
 * Load a WASM module with SIMD feature detection.
 * Throws if SIMD is not supported.
 */
export async function loadWasmModule(modulePath: string): Promise<any> {
  const supportsSimd = await simd();
  if (!supportsSimd) {
    throw new Error(
      'WebAssembly SIMD is not supported in this environment. ' +
      'The @addmaple/stats library requires SIMD support. ' +
      'Please use a modern browser or Node.js 18+ with SIMD enabled.'
    );
  }
  // @ts-ignore - WASM module path resolved at runtime
  const mod = await import(modulePath);
  // wasm-pack `--target web` (and some other targets) generate a default async
  // initializer that must be called before exports are usable. Without this,
  // the generated JS will keep an internal `wasm` reference as `undefined`,
  // leading to runtime crashes like "Cannot read properties of undefined".
  if (typeof (mod as any).default === 'function') {
    const init = (mod as any).default as (input?: any) => Promise<any>;

    // In browsers, the default init uses `fetch(new URL(..., import.meta.url))`.
    // In Node, `fetch(file://...)` is not reliably supported, so we pass the
    // raw wasm bytes instead.
    const isNode =
      typeof process !== 'undefined' &&
      typeof (process as any).versions?.node === 'string';

    if (isNode) {
      const { readFile } = await import('node:fs/promises');
      const wasmUrl = new URL(modulePath.replace(/\.js$/i, '_bg.wasm'), import.meta.url);
      const wasmBytes = await readFile(wasmUrl);
      await init({ module_or_path: wasmBytes });
    } else {
      await init();
    }
  }
  return mod;
}

/**
 * The consistent error message for uninitialized WASM modules.
 */
export const WASM_NOT_INITIALIZED_ERROR = 'Wasm module not initialized. Call init() first.';

/**
 * Create a requireWasm function for a module.
 * This ensures consistent error messaging across all modules.
 */
export function createRequireWasm<T>(
  getModule: () => T | null
): () => T {
  return () => {
    const mod = getModule();
    if (!mod) {
      throw new Error(WASM_NOT_INITIALIZED_ERROR);
    }
    return mod;
  };
}
