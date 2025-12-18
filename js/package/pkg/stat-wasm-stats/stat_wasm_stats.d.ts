/* tslint:disable */
/* eslint-disable */

export class ArrayResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly ptr: number;
  readonly len: number;
  readonly is_empty: boolean;
}

export function alloc_f64(len: number): number;

export function coeffvar_f64(ptr: number, len: number): number;

export function cumprod_f64(ptr: number, len: number): ArrayResult;

export function cumsum_f64(ptr: number, len: number): ArrayResult;

export function diff_f64(ptr: number, len: number): ArrayResult;

export function free_f64(ptr: number, len: number): void;

export function geomean_f64(ptr: number, len: number): number;

export function get_memory(): any;

export function histogram_f64(ptr: number, len: number, bin_count: number): ArrayResult;

export function kurtosis_f64(ptr: number, len: number): number;

export function max_f64(ptr: number, len: number): number;

export function mean_f64(ptr: number, len: number): number;

export function median_f64(ptr: number, len: number): number;

export function min_f64(ptr: number, len: number): number;

export function mode_f64(ptr: number, len: number): number;

export function product_f64(ptr: number, len: number): number;

export function range_f64(ptr: number, len: number): number;

export function rank_f64(ptr: number, len: number): ArrayResult;

export function sample_stdev_f64(ptr: number, len: number): number;

export function sample_variance_f64(ptr: number, len: number): number;

export function skewness_f64(ptr: number, len: number): number;

export function stdev_f64(ptr: number, len: number): number;

export function sum_f64(ptr: number, len: number): number;

export function variance_f64(ptr: number, len: number): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_arrayresult_free: (a: number, b: number) => void;
  readonly arrayresult_ptr: (a: number) => number;
  readonly arrayresult_len: (a: number) => number;
  readonly arrayresult_is_empty: (a: number) => number;
  readonly get_memory: () => any;
  readonly alloc_f64: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
  readonly sum_f64: (a: number, b: number) => number;
  readonly mean_f64: (a: number, b: number) => number;
  readonly variance_f64: (a: number, b: number) => number;
  readonly sample_variance_f64: (a: number, b: number) => number;
  readonly stdev_f64: (a: number, b: number) => number;
  readonly sample_stdev_f64: (a: number, b: number) => number;
  readonly coeffvar_f64: (a: number, b: number) => number;
  readonly min_f64: (a: number, b: number) => number;
  readonly max_f64: (a: number, b: number) => number;
  readonly product_f64: (a: number, b: number) => number;
  readonly range_f64: (a: number, b: number) => number;
  readonly median_f64: (a: number, b: number) => number;
  readonly mode_f64: (a: number, b: number) => number;
  readonly geomean_f64: (a: number, b: number) => number;
  readonly skewness_f64: (a: number, b: number) => number;
  readonly kurtosis_f64: (a: number, b: number) => number;
  readonly cumsum_f64: (a: number, b: number) => number;
  readonly cumprod_f64: (a: number, b: number) => number;
  readonly diff_f64: (a: number, b: number) => number;
  readonly rank_f64: (a: number, b: number) => number;
  readonly histogram_f64: (a: number, b: number, c: number) => number;
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
