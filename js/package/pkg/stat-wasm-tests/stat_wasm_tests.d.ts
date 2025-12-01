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
  readonly statistic: number;
  readonly p_value: number;
  readonly df: number | undefined;
}

export function alloc_f64(len: number): number;

export function free_f64(ptr: number, len: number): void;

export function get_memory(): any;

export function normalci_f64(alpha: number, mean: number, se: number): Float64Array;

export function regress_f64(x_ptr: number, x_len: number, y_ptr: number, y_len: number): RegressionResult;

export function tci_f64(alpha: number, mean: number, stdev: number, n: number): Float64Array;

export function ttest_f64(data_ptr: number, len: number, mu0: number): TestResult;

export function ztest_f64(data_ptr: number, len: number, mu0: number, sigma: number): TestResult;
