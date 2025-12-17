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

export class RegressionResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly slope: number;
  readonly intercept: number;
  readonly r_squared: number;
  readonly residuals: ArrayResult;
}

export class TestResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly df: number | undefined;
  readonly p_value: number;
  readonly statistic: number;
}

export function alloc_f64(len: number): number;

export function free_f64(ptr: number, len: number): void;

export function get_memory(): any;

export function normalci_f64(alpha: number, mean: number, se: number): Float64Array;

export function regress_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function tci_f64(alpha: number, mean: number, stdev: number, n: number): Float64Array;

export function ttest_f64(data_ptr: number, len: number, mu0: number): TestResult;

export function ztest_f64(data_ptr: number, len: number, mu0: number, sigma: number): TestResult;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_arrayresult_free: (a: number, b: number) => void;
  readonly __wbg_regressionresult_free: (a: number, b: number) => void;
  readonly alloc_f64: (a: number) => number;
  readonly arrayresult_is_empty: (a: number) => number;
  readonly arrayresult_len: (a: number) => number;
  readonly arrayresult_ptr: (a: number) => number;
  readonly free_f64: (a: number, b: number) => void;
  readonly get_memory: () => any;
  readonly normalci_f64: (a: number, b: number, c: number) => [number, number];
  readonly regress_f64: (a: number, b: number, c: number, d: number) => number;
  readonly regressionresult_intercept: (a: number) => number;
  readonly regressionresult_r_squared: (a: number) => number;
  readonly regressionresult_residuals: (a: number) => number;
  readonly regressionresult_slope: (a: number) => number;
  readonly tci_f64: (a: number, b: number, c: number, d: number) => [number, number];
  readonly testresult_df: (a: number) => [number, number];
  readonly testresult_p_value: (a: number) => number;
  readonly ttest_f64: (a: number, b: number, c: number) => number;
  readonly ztest_f64: (a: number, b: number, c: number, d: number) => number;
  readonly testresult_statistic: (a: number) => number;
  readonly __wbg_testresult_free: (a: number, b: number) => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
