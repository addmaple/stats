let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

/**
 * @param {number} len
 * @returns {number}
 */
export function alloc_f64(len) {
    const ret = wasm.alloc_f64(len);
    return ret >>> 0;
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {number}
 */
export function corrcoeff_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.corrcoeff_f64(x_ptr, x_len, y_ptr, y_len);
    return ret;
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {number}
 */
export function covariance_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.covariance_f64(x_ptr, x_len, y_ptr, y_len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 */
export function free_f64(ptr, len) {
    wasm.free_f64(ptr, len);
}

/**
 * @returns {any}
 */
export function get_memory() {
    const ret = wasm.get_memory();
    return ret;
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {number}
 */
export function spearmancoeff_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.spearmancoeff_f64(x_ptr, x_len, y_ptr, y_len);
    return ret;
}

export function __wbg___wbindgen_memory_a342e963fbcabd68() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_externrefs;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
};
