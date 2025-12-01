import { simd } from 'wasm-feature-detect';

export interface ArrayResult {
  ptr: number;
  len: number;
}

export function f64View(ptr: number, len: number, memory: WebAssembly.Memory): Float64Array {
  return new Float64Array(memory.buffer, ptr, len);
}

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

export function runUnaryArrayOp(
  data: ArrayLike<number>,
  kernel: ArrayKernel,
  wasm: any,
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

export async function loadWasmModule(modulePath: string): Promise<any> {
  const supportsSimd = await simd();
  // @ts-ignore - WASM module path resolved at runtime
  const mod = await import(modulePath);
  return mod;
}

