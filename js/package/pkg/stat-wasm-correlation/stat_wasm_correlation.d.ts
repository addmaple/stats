/* tslint:disable */
/* eslint-disable */

export function alloc_f64(len: number): number;

export function corrcoeff_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export function covariance_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export function free_f64(ptr: number, len: number): void;

export function get_memory(): any;

export function spearmancoeff_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly get_memory: () => any;
  readonly alloc_f64: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
  readonly covariance_f64: (a: number, b: number, c: number, d: number) => number;
  readonly corrcoeff_f64: (a: number, b: number, c: number, d: number) => number;
  readonly spearmancoeff_f64: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
