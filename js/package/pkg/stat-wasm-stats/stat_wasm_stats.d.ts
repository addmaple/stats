/* tslint:disable */
/* eslint-disable */

export class ArrayResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly ptr: number;
  readonly len: number;
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
