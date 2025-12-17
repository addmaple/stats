let wasm;

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
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

const RegressionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regressionresult_free(ptr >>> 0, 1));

const TestResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_testresult_free(ptr >>> 0, 1));

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
    /**
     * @returns {boolean}
     */
    get is_empty() {
        const ret = wasm.arrayresult_is_empty(this.__wbg_ptr);
        return ret !== 0;
    }
}
if (Symbol.dispose) ArrayResult.prototype[Symbol.dispose] = ArrayResult.prototype.free;

export class RegressionResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegressionResult.prototype);
        obj.__wbg_ptr = ptr;
        RegressionResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RegressionResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regressionresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get slope() {
        const ret = wasm.regressionresult_slope(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get intercept() {
        const ret = wasm.regressionresult_intercept(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get r_squared() {
        const ret = wasm.regressionresult_r_squared(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {ArrayResult}
     */
    get residuals() {
        const ret = wasm.regressionresult_residuals(this.__wbg_ptr);
        return ArrayResult.__wrap(ret);
    }
}
if (Symbol.dispose) RegressionResult.prototype[Symbol.dispose] = RegressionResult.prototype.free;

export class TestResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TestResult.prototype);
        obj.__wbg_ptr = ptr;
        TestResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TestResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_testresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get statistic() {
        const ret = wasm.regressionresult_r_squared(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get p_value() {
        const ret = wasm.testresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number | undefined}
     */
    get df() {
        const ret = wasm.testresult_df(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
}
if (Symbol.dispose) TestResult.prototype[Symbol.dispose] = TestResult.prototype.free;

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
 * @param {number} alpha
 * @param {number} mean
 * @param {number} se
 * @returns {Float64Array}
 */
export function normalci_f64(alpha, mean, se) {
    const ret = wasm.normalci_f64(alpha, mean, se);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionResult}
 */
export function regress_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionResult.__wrap(ret);
}

/**
 * @param {number} alpha
 * @param {number} mean
 * @param {number} stdev
 * @param {number} n
 * @returns {Float64Array}
 */
export function tci_f64(alpha, mean, stdev, n) {
    const ret = wasm.tci_f64(alpha, mean, stdev, n);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} data_ptr
 * @param {number} len
 * @param {number} mu0
 * @returns {TestResult}
 */
export function ttest_f64(data_ptr, len, mu0) {
    const ret = wasm.ttest_f64(data_ptr, len, mu0);
    return TestResult.__wrap(ret);
}

/**
 * @param {number} data_ptr
 * @param {number} len
 * @param {number} mu0
 * @param {number} sigma
 * @returns {TestResult}
 */
export function ztest_f64(data_ptr, len, mu0, sigma) {
    const ret = wasm.ztest_f64(data_ptr, len, mu0, sigma);
    return TestResult.__wrap(ret);
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
    cachedFloat64ArrayMemory0 = null;
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
        module_or_path = new URL('stat_wasm_tests_bg.wasm', import.meta.url);
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
