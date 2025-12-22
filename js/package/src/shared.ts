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
 * Create a Float32Array view into WASM memory.
 */
export function f32View(ptr: number, len: number, memory: WebAssembly.Memory): Float32Array {
  return new Float32Array(memory.buffer, ptr, len);
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
 * Efficiently copy data to WASM memory (f32).
 */
export function copyToWasmMemoryF32(data: ArrayLike<number>, view: Float32Array): void {
  if (data instanceof Float32Array) {
    view.set(data);
  } else if (data instanceof Array) {
    view.set(data as number[]);
  } else {
    const len = data.length;
    try {
      view.set(data as any);
    } catch {
      for (let i = 0; i < len; i++) {
        view[i] = data[i] as number;
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
 * Load a WASM module using wasm-bindgen-lite loaders.
 */
export async function loadWasmModule(moduleDir: string, inline: boolean = false): Promise<any> {
  const isNode =
    typeof process !== 'undefined' &&
    typeof (process as any).versions?.node === 'string';

  const entryPoint = isNode 
    ? (inline ? 'node-inline.js' : 'node.js') 
    : (inline ? 'browser-inline.js' : 'browser.js');
    
  const modulePath = `${moduleDir}/${entryPoint}`;
  console.log(`Loading WASM module from: ${modulePath}`);

  // @ts-ignore - WASM module path resolved at runtime
  const mod = await import(modulePath);
  
  if (typeof mod.init === 'function') {
    await mod.init();
  }
  
  return mod;
}

/**
 * The consistent error message for uninitialized WASM modules.
 */
export const WASM_NOT_INITIALIZED_ERROR = 'Wasm module not initialized. Call init() first.';

/**
 * Global WASM module instance, if using the full build.
 */
let globalWasm: any = null;

export function setGlobalWasm(mod: any): void {
  globalWasm = mod;
}

export function getGlobalWasm(): any | null {
  return globalWasm;
}

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
