export type WasmInput = Uint8Array | ArrayBufferView | ArrayBuffer;

export function setInstance(instance: WebAssembly.Instance): void;
export function wasmExports(): WebAssembly.Exports;
export function memoryU8(): Uint8Array;
export function alloc(len: number): number;
export function free(ptr: number, len: number): void;
