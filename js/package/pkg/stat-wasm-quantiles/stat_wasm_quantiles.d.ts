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
