let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const ArrayResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_arrayresult_free(ptr >>> 0, 1));

export class ArrayResult {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ArrayResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_arrayresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get ptr() {
        const ret = wasm.arrayresult_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get len() {
        const ret = wasm.arrayresult_len(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) ArrayResult.prototype[Symbol.dispose] = ArrayResult.prototype.free;

/**
 * @param {number} len
 * @returns {number}
 */
export function alloc_f64(len) {
    const ret = wasm.alloc_f64(len);
    return ret >>> 0;
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} alpha
 * @param {number} beta
 * @param {number} output_ptr
 */
export function beta_cdf_inplace(input_ptr, len, alpha, beta, output_ptr) {
    const ret = wasm.beta_cdf_inplace(input_ptr, len, alpha, beta, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} alpha
 * @param {number} beta
 * @returns {number}
 */
export function beta_cdf_scalar(x, alpha, beta) {
    const ret = wasm.beta_cdf_scalar(x, alpha, beta);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} alpha
 * @param {number} beta
 * @returns {number}
 */
export function beta_inv_scalar(p, alpha, beta) {
    const ret = wasm.beta_inv_scalar(p, alpha, beta);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} alpha
 * @param {number} beta
 * @param {number} output_ptr
 */
export function beta_pdf_inplace(input_ptr, len, alpha, beta, output_ptr) {
    const ret = wasm.beta_pdf_inplace(input_ptr, len, alpha, beta, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} alpha
 * @param {number} beta
 * @returns {number}
 */
export function beta_pdf_scalar(x, alpha, beta) {
    const ret = wasm.beta_pdf_scalar(x, alpha, beta);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} n
 * @param {number} p
 * @param {number} output_ptr
 */
export function binomial_cdf_inplace(input_ptr, len, n, p, output_ptr) {
    const ret = wasm.binomial_cdf_inplace(input_ptr, len, n, p, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
export function binomial_cdf_scalar(x, n, p) {
    const ret = wasm.binomial_cdf_scalar(x, n, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} prob
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
export function binomial_inv_scalar(prob, n, p) {
    const ret = wasm.binomial_inv_scalar(prob, n, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} n
 * @param {number} p
 * @param {number} output_ptr
 */
export function binomial_pmf_inplace(input_ptr, len, n, p, output_ptr) {
    const ret = wasm.binomial_pmf_inplace(input_ptr, len, n, p, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} n
 * @param {number} p
 * @returns {number}
 */
export function binomial_pmf_scalar(x, n, p) {
    const ret = wasm.binomial_pmf_scalar(x, n, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} location
 * @param {number} scale
 * @param {number} output_ptr
 */
export function cauchy_cdf_inplace(input_ptr, len, location, scale, output_ptr) {
    const ret = wasm.cauchy_cdf_inplace(input_ptr, len, location, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function cauchy_cdf_scalar(x, location, scale) {
    const ret = wasm.cauchy_cdf_scalar(x, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function cauchy_inv_scalar(p, location, scale) {
    const ret = wasm.cauchy_inv_scalar(p, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} location
 * @param {number} scale
 * @param {number} output_ptr
 */
export function cauchy_pdf_inplace(input_ptr, len, location, scale, output_ptr) {
    const ret = wasm.cauchy_pdf_inplace(input_ptr, len, location, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function cauchy_pdf_scalar(x, location, scale) {
    const ret = wasm.cauchy_pdf_scalar(x, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} dof
 * @param {number} output_ptr
 */
export function chi_squared_cdf_inplace(input_ptr, len, dof, output_ptr) {
    const ret = wasm.chi_squared_cdf_inplace(input_ptr, len, dof, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} dof
 * @returns {number}
 */
export function chi_squared_cdf_scalar(x, dof) {
    const ret = wasm.chi_squared_cdf_scalar(x, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} dof
 * @returns {number}
 */
export function chi_squared_inv_scalar(p, dof) {
    const ret = wasm.chi_squared_inv_scalar(p, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} dof
 * @param {number} output_ptr
 */
export function chi_squared_pdf_inplace(input_ptr, len, dof, output_ptr) {
    const ret = wasm.chi_squared_pdf_inplace(input_ptr, len, dof, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} dof
 * @returns {number}
 */
export function chi_squared_pdf_scalar(x, dof) {
    const ret = wasm.chi_squared_pdf_scalar(x, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} rate
 * @param {number} output_ptr
 */
export function exponential_cdf_inplace(input_ptr, len, rate, output_ptr) {
    const ret = wasm.exponential_cdf_inplace(input_ptr, len, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} rate
 * @returns {number}
 */
export function exponential_cdf_scalar(x, rate) {
    const ret = wasm.exponential_cdf_scalar(x, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} rate
 * @returns {number}
 */
export function exponential_inv_scalar(p, rate) {
    const ret = wasm.exponential_inv_scalar(p, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} rate
 * @param {number} output_ptr
 */
export function exponential_pdf_inplace(input_ptr, len, rate, output_ptr) {
    const ret = wasm.exponential_pdf_inplace(input_ptr, len, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} rate
 * @returns {number}
 */
export function exponential_pdf_scalar(x, rate) {
    const ret = wasm.exponential_pdf_scalar(x, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} df1
 * @param {number} df2
 * @param {number} output_ptr
 */
export function fisher_f_cdf_inplace(input_ptr, len, df1, df2, output_ptr) {
    const ret = wasm.fisher_f_cdf_inplace(input_ptr, len, df1, df2, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} df1
 * @param {number} df2
 * @returns {number}
 */
export function fisher_f_cdf_scalar(x, df1, df2) {
    const ret = wasm.fisher_f_cdf_scalar(x, df1, df2);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} df1
 * @param {number} df2
 * @returns {number}
 */
export function fisher_f_inv_scalar(p, df1, df2) {
    const ret = wasm.fisher_f_inv_scalar(p, df1, df2);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} df1
 * @param {number} df2
 * @param {number} output_ptr
 */
export function fisher_f_pdf_inplace(input_ptr, len, df1, df2, output_ptr) {
    const ret = wasm.fisher_f_pdf_inplace(input_ptr, len, df1, df2, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} df1
 * @param {number} df2
 * @returns {number}
 */
export function fisher_f_pdf_scalar(x, df1, df2) {
    const ret = wasm.fisher_f_pdf_scalar(x, df1, df2);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} ptr
 * @param {number} len
 */
export function free_f64(ptr, len) {
    wasm.free_f64(ptr, len);
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} rate
 * @param {number} output_ptr
 */
export function gamma_cdf_inplace(input_ptr, len, shape, rate, output_ptr) {
    const ret = wasm.gamma_cdf_inplace(input_ptr, len, shape, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function gamma_cdf_scalar(x, shape, rate) {
    const ret = wasm.gamma_cdf_scalar(x, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function gamma_inv_scalar(p, shape, rate) {
    const ret = wasm.gamma_inv_scalar(p, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} rate
 * @param {number} output_ptr
 */
export function gamma_pdf_inplace(input_ptr, len, shape, rate, output_ptr) {
    const ret = wasm.gamma_pdf_inplace(input_ptr, len, shape, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function gamma_pdf_scalar(x, shape, rate) {
    const ret = wasm.gamma_pdf_scalar(x, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @returns {any}
 */
export function get_memory() {
    const ret = wasm.get_memory();
    return ret;
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} rate
 * @param {number} output_ptr
 */
export function invgamma_cdf_inplace(input_ptr, len, shape, rate, output_ptr) {
    const ret = wasm.invgamma_cdf_inplace(input_ptr, len, shape, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function invgamma_cdf_scalar(x, shape, rate) {
    const ret = wasm.invgamma_cdf_scalar(x, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function invgamma_inv_scalar(p, shape, rate) {
    const ret = wasm.invgamma_inv_scalar(p, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} rate
 * @param {number} output_ptr
 */
export function invgamma_pdf_inplace(input_ptr, len, shape, rate, output_ptr) {
    const ret = wasm.invgamma_pdf_inplace(input_ptr, len, shape, rate, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} rate
 * @returns {number}
 */
export function invgamma_pdf_scalar(x, shape, rate) {
    const ret = wasm.invgamma_pdf_scalar(x, shape, rate);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} location
 * @param {number} scale
 * @param {number} output_ptr
 */
export function laplace_cdf_inplace(input_ptr, len, location, scale, output_ptr) {
    const ret = wasm.laplace_cdf_inplace(input_ptr, len, location, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function laplace_cdf_scalar(x, location, scale) {
    const ret = wasm.laplace_cdf_scalar(x, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function laplace_inv_scalar(p, location, scale) {
    const ret = wasm.laplace_inv_scalar(p, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} location
 * @param {number} scale
 * @param {number} output_ptr
 */
export function laplace_pdf_inplace(input_ptr, len, location, scale, output_ptr) {
    const ret = wasm.laplace_pdf_inplace(input_ptr, len, location, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} location
 * @param {number} scale
 * @returns {number}
 */
export function laplace_pdf_scalar(x, location, scale) {
    const ret = wasm.laplace_pdf_scalar(x, location, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} sd
 * @param {number} output_ptr
 */
export function lognormal_cdf_inplace(input_ptr, len, mean, sd, output_ptr) {
    const ret = wasm.lognormal_cdf_inplace(input_ptr, len, mean, sd, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function lognormal_cdf_scalar(x, mean, sd) {
    const ret = wasm.lognormal_cdf_scalar(x, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function lognormal_inv_scalar(p, mean, sd) {
    const ret = wasm.lognormal_inv_scalar(p, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} sd
 * @param {number} output_ptr
 */
export function lognormal_pdf_inplace(input_ptr, len, mean, sd, output_ptr) {
    const ret = wasm.lognormal_pdf_inplace(input_ptr, len, mean, sd, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function lognormal_pdf_scalar(x, mean, sd) {
    const ret = wasm.lognormal_pdf_scalar(x, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} r
 * @param {number} p
 * @param {number} output_ptr
 */
export function negbin_cdf_inplace(input_ptr, len, r, p, output_ptr) {
    const ret = wasm.negbin_cdf_inplace(input_ptr, len, r, p, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} r
 * @param {number} p
 * @returns {number}
 */
export function negbin_cdf_scalar(x, r, p) {
    const ret = wasm.negbin_cdf_scalar(x, r, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} prob
 * @param {number} r
 * @param {number} p
 * @returns {number}
 */
export function negbin_inv_scalar(prob, r, p) {
    const ret = wasm.negbin_inv_scalar(prob, r, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} r
 * @param {number} p
 * @param {number} output_ptr
 */
export function negbin_pmf_inplace(input_ptr, len, r, p, output_ptr) {
    const ret = wasm.negbin_pmf_inplace(input_ptr, len, r, p, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} r
 * @param {number} p
 * @returns {number}
 */
export function negbin_pmf_scalar(x, r, p) {
    const ret = wasm.negbin_pmf_scalar(x, r, p);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} sd
 * @param {number} output_ptr
 */
export function normal_cdf_inplace(input_ptr, len, mean, sd, output_ptr) {
    const ret = wasm.normal_cdf_inplace(input_ptr, len, mean, sd, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function normal_cdf_scalar(x, mean, sd) {
    const ret = wasm.normal_cdf_scalar(x, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function normal_inv_scalar(p, mean, sd) {
    const ret = wasm.normal_inv_scalar(p, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} sd
 * @param {number} output_ptr
 */
export function normal_pdf_inplace(input_ptr, len, mean, sd, output_ptr) {
    const ret = wasm.normal_pdf_inplace(input_ptr, len, mean, sd, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} sd
 * @returns {number}
 */
export function normal_pdf_scalar(x, mean, sd) {
    const ret = wasm.normal_pdf_scalar(x, mean, sd);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} scale
 * @param {number} shape
 * @param {number} output_ptr
 */
export function pareto_cdf_inplace(input_ptr, len, scale, shape, output_ptr) {
    const ret = wasm.pareto_cdf_inplace(input_ptr, len, scale, shape, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} scale
 * @param {number} shape
 * @returns {number}
 */
export function pareto_cdf_scalar(x, scale, shape) {
    const ret = wasm.pareto_cdf_scalar(x, scale, shape);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} scale
 * @param {number} shape
 * @returns {number}
 */
export function pareto_inv_scalar(p, scale, shape) {
    const ret = wasm.pareto_inv_scalar(p, scale, shape);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} scale
 * @param {number} shape
 * @param {number} output_ptr
 */
export function pareto_pdf_inplace(input_ptr, len, scale, shape, output_ptr) {
    const ret = wasm.pareto_pdf_inplace(input_ptr, len, scale, shape, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} scale
 * @param {number} shape
 * @returns {number}
 */
export function pareto_pdf_scalar(x, scale, shape) {
    const ret = wasm.pareto_pdf_scalar(x, scale, shape);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} lambda
 * @param {number} output_ptr
 */
export function poisson_cdf_inplace(input_ptr, len, lambda, output_ptr) {
    const ret = wasm.poisson_cdf_inplace(input_ptr, len, lambda, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} lambda
 * @returns {number}
 */
export function poisson_cdf_scalar(x, lambda) {
    const ret = wasm.poisson_cdf_scalar(x, lambda);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} lambda
 * @returns {number}
 */
export function poisson_inv_scalar(p, lambda) {
    const ret = wasm.poisson_inv_scalar(p, lambda);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} lambda
 * @param {number} output_ptr
 */
export function poisson_pmf_inplace(input_ptr, len, lambda, output_ptr) {
    const ret = wasm.poisson_pmf_inplace(input_ptr, len, lambda, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} lambda
 * @returns {number}
 */
export function poisson_pmf_scalar(x, lambda) {
    const ret = wasm.poisson_pmf_scalar(x, lambda);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} scale
 * @param {number} dof
 * @param {number} output_ptr
 */
export function student_t_cdf_inplace(input_ptr, len, mean, scale, dof, output_ptr) {
    const ret = wasm.student_t_cdf_inplace(input_ptr, len, mean, scale, dof, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} scale
 * @param {number} dof
 * @returns {number}
 */
export function student_t_cdf_scalar(x, mean, scale, dof) {
    const ret = wasm.student_t_cdf_scalar(x, mean, scale, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} mean
 * @param {number} scale
 * @param {number} dof
 * @returns {number}
 */
export function student_t_inv_scalar(p, mean, scale, dof) {
    const ret = wasm.student_t_inv_scalar(p, mean, scale, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} mean
 * @param {number} scale
 * @param {number} dof
 * @param {number} output_ptr
 */
export function student_t_pdf_inplace(input_ptr, len, mean, scale, dof, output_ptr) {
    const ret = wasm.student_t_pdf_inplace(input_ptr, len, mean, scale, dof, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} mean
 * @param {number} scale
 * @param {number} dof
 * @returns {number}
 */
export function student_t_pdf_scalar(x, mean, scale, dof) {
    const ret = wasm.student_t_pdf_scalar(x, mean, scale, dof);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} min
 * @param {number} max
 * @param {number} mode
 * @param {number} output_ptr
 */
export function triangular_cdf_inplace(input_ptr, len, min, max, mode, output_ptr) {
    const ret = wasm.triangular_cdf_inplace(input_ptr, len, min, max, mode, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @param {number} mode
 * @returns {number}
 */
export function triangular_cdf_scalar(x, min, max, mode) {
    const ret = wasm.triangular_cdf_scalar(x, min, max, mode);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} min
 * @param {number} max
 * @param {number} mode
 * @returns {number}
 */
export function triangular_inv_scalar(p, min, max, mode) {
    const ret = wasm.triangular_inv_scalar(p, min, max, mode);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} min
 * @param {number} max
 * @param {number} mode
 * @param {number} output_ptr
 */
export function triangular_pdf_inplace(input_ptr, len, min, max, mode, output_ptr) {
    const ret = wasm.triangular_pdf_inplace(input_ptr, len, min, max, mode, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @param {number} mode
 * @returns {number}
 */
export function triangular_pdf_scalar(x, min, max, mode) {
    const ret = wasm.triangular_pdf_scalar(x, min, max, mode);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} min
 * @param {number} max
 * @param {number} output_ptr
 */
export function uniform_cdf_inplace(input_ptr, len, min, max, output_ptr) {
    const ret = wasm.uniform_cdf_inplace(input_ptr, len, min, max, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function uniform_cdf_scalar(x, min, max) {
    const ret = wasm.uniform_cdf_scalar(x, min, max);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function uniform_inv_scalar(p, min, max) {
    const ret = wasm.uniform_inv_scalar(p, min, max);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} min
 * @param {number} max
 * @param {number} output_ptr
 */
export function uniform_pdf_inplace(input_ptr, len, min, max, output_ptr) {
    const ret = wasm.uniform_pdf_inplace(input_ptr, len, min, max, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function uniform_pdf_scalar(x, min, max) {
    const ret = wasm.uniform_pdf_scalar(x, min, max);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} scale
 * @param {number} output_ptr
 */
export function weibull_cdf_inplace(input_ptr, len, shape, scale, output_ptr) {
    const ret = wasm.weibull_cdf_inplace(input_ptr, len, shape, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} scale
 * @returns {number}
 */
export function weibull_cdf_scalar(x, shape, scale) {
    const ret = wasm.weibull_cdf_scalar(x, shape, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} p
 * @param {number} shape
 * @param {number} scale
 * @returns {number}
 */
export function weibull_inv_scalar(p, shape, scale) {
    const ret = wasm.weibull_inv_scalar(p, shape, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

/**
 * @param {number} input_ptr
 * @param {number} len
 * @param {number} shape
 * @param {number} scale
 * @param {number} output_ptr
 */
export function weibull_pdf_inplace(input_ptr, len, shape, scale, output_ptr) {
    const ret = wasm.weibull_pdf_inplace(input_ptr, len, shape, scale, output_ptr);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

/**
 * @param {number} x
 * @param {number} shape
 * @param {number} scale
 * @returns {number}
 */
export function weibull_pdf_scalar(x, shape, scale) {
    const ret = wasm.weibull_pdf_scalar(x, shape, scale);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return ret[0];
}

export function __wbg___wbindgen_memory_a342e963fbcabd68() {
    const ret = wasm.memory;
    return ret;
};

export function __wbg___wbindgen_throw_dd24417ed36fc46e(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_cast_2241b6af4c4b2941(arg0, arg1) {
    // Cast intrinsic for `Ref(String) -> Externref`.
    const ret = getStringFromWasm0(arg0, arg1);
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
