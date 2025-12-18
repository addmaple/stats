let wasm;

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
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ArrayResult.prototype);
        obj.__wbg_ptr = ptr;
        ArrayResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
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
    get len() {
        const ret = wasm.arrayresult_len(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get ptr() {
        const ret = wasm.arrayresult_ptr(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    get is_empty() {
        const ret = wasm.arrayresult_is_empty(this.__wbg_ptr);
        return ret !== 0;
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
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function coeffvar_f64(ptr, len) {
    const ret = wasm.coeffvar_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {ArrayResult}
 */
export function cumprod_f64(ptr, len) {
    const ret = wasm.cumprod_f64(ptr, len);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {ArrayResult}
 */
export function cumsum_f64(ptr, len) {
    const ret = wasm.cumsum_f64(ptr, len);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {ArrayResult}
 */
export function diff_f64(ptr, len) {
    const ret = wasm.diff_f64(ptr, len);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 */
export function free_f64(ptr, len) {
    wasm.free_f64(ptr, len);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function geomean_f64(ptr, len) {
    const ret = wasm.geomean_f64(ptr, len);
    return ret;
}

/**
 * @returns {any}
 */
export function get_memory() {
    const ret = wasm.get_memory();
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} bin_count
 * @returns {ArrayResult}
 */
export function histogram_f64(ptr, len, bin_count) {
    const ret = wasm.histogram_f64(ptr, len, bin_count);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function kurtosis_f64(ptr, len) {
    const ret = wasm.kurtosis_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function max_f64(ptr, len) {
    const ret = wasm.max_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function mean_f64(ptr, len) {
    const ret = wasm.mean_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function median_f64(ptr, len) {
    const ret = wasm.median_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function min_f64(ptr, len) {
    const ret = wasm.min_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function mode_f64(ptr, len) {
    const ret = wasm.mode_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function product_f64(ptr, len) {
    const ret = wasm.product_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function range_f64(ptr, len) {
    const ret = wasm.range_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {ArrayResult}
 */
export function rank_f64(ptr, len) {
    const ret = wasm.rank_f64(ptr, len);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function sample_stdev_f64(ptr, len) {
    const ret = wasm.sample_stdev_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function sample_variance_f64(ptr, len) {
    const ret = wasm.sample_variance_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function skewness_f64(ptr, len) {
    const ret = wasm.skewness_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function stdev_f64(ptr, len) {
    const ret = wasm.stdev_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function sum_f64(ptr, len) {
    const ret = wasm.sum_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function variance_f64(ptr, len) {
    const ret = wasm.variance_f64(ptr, len);
    return ret;
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_memory_a342e963fbcabd68 = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('stat_wasm_stats_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
