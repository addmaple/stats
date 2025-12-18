/* tslint:disable */
/* eslint-disable */

export class ArrayResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly len: number;
  readonly ptr: number;
  readonly is_empty: boolean;
}

export class QuartilesResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly q1: number;
  readonly q2: number;
  readonly q3: number;
}

export function alloc_f64(len: number): number;

export function free_f64(ptr: number, len: number): void;

export function get_memory(): any;

export function histogram_edges_f64(data_ptr: number, data_len: number, edges_ptr: number, edges_len: number): ArrayResult;

export function histogram_f64(ptr: number, len: number, bin_count: number): ArrayResult;

export function iqr_f64(ptr: number, len: number): number;

export function percentile_exclusive_f64(ptr: number, len: number, k: number): number;

export function percentile_f64(ptr: number, len: number, k: number, exclusive: boolean): number;

export function percentile_inclusive_f64(ptr: number, len: number, k: number): number;

export function percentile_of_score_f64(ptr: number, len: number, score: number, strict: boolean): number;

export function quantiles_f64(data_ptr: number, data_len: number, qs_ptr: number, qs_len: number): ArrayResult;

export function quartiles_f64(ptr: number, len: number): QuartilesResult;

export function weighted_median_f64(data_ptr: number, data_len: number, weights_ptr: number, weights_len: number): number;

export function weighted_percentile_f64(data_ptr: number, data_len: number, weights_ptr: number, weights_len: number, p: number): number;

export function weighted_quantiles_f64(data_ptr: number, data_len: number, weights_ptr: number, weights_len: number, qs_ptr: number, qs_len: number): ArrayResult;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_arrayresult_free: (a: number, b: number) => void;
  readonly __wbg_quartilesresult_free: (a: number, b: number) => void;
  readonly alloc_f64: (a: number) => number;
  readonly arrayresult_is_empty: (a: number) => number;
  readonly arrayresult_len: (a: number) => number;
  readonly arrayresult_ptr: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
  readonly get_memory: () => any;
  readonly histogram_edges_f64: (a: number, b: number, c: number, d: number) => number;
  readonly histogram_f64: (a: number, b: number, c: number) => number;
  readonly iqr_f64: (a: number, b: number) => number;
  readonly percentile_exclusive_f64: (a: number, b: number, c: number) => number;
  readonly percentile_f64: (a: number, b: number, c: number, d: number) => number;
  readonly percentile_inclusive_f64: (a: number, b: number, c: number) => number;
  readonly percentile_of_score_f64: (a: number, b: number, c: number, d: number) => number;
  readonly quantiles_f64: (a: number, b: number, c: number, d: number) => number;
  readonly quartiles_f64: (a: number, b: number) => number;
  readonly quartilesresult_q1: (a: number) => number;
  readonly quartilesresult_q2: (a: number) => number;
  readonly quartilesresult_q3: (a: number) => number;
  readonly weighted_median_f64: (a: number, b: number, c: number, d: number) => number;
  readonly weighted_percentile_f64: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly weighted_quantiles_f64: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
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
