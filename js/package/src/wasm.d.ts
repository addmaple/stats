declare module '../pkg/stat-wasm/stat_wasm.js' {
  export function get_memory(): WebAssembly.Memory;
  export function alloc_f64(len: number): number;
  export function free_f64(ptr: number, len: number): void;
  export function sum_f64(ptr: number, len: number): number;
  export function mean_f64(ptr: number, len: number): number;
  export function variance_f64(ptr: number, len: number): number;
  export function sample_variance_f64(ptr: number, len: number): number;
  export function stdev_f64(ptr: number, len: number): number;
  export function sample_stdev_f64(ptr: number, len: number): number;
}

