let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
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

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64ArrayMemory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
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

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const AnovaResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_anovaresult_free(ptr >>> 0, 1));

const ArrayResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_arrayresult_free(ptr >>> 0, 1));

const ChiSquareResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chisquareresult_free(ptr >>> 0, 1));

const HistogramWithEdgesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_histogramwithedges_free(ptr >>> 0, 1));

const QuartilesResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_quartilesresult_free(ptr >>> 0, 1));

const RegressionCoeffsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regressioncoeffs_free(ptr >>> 0, 1));

const RegressionCoeffsF32Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regressioncoeffsf32_free(ptr >>> 0, 1));

const RegressionResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_regressionresult_free(ptr >>> 0, 1));

const TestResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_testresult_free(ptr >>> 0, 1));

const TukeyHsdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tukeyhsdresult_free(ptr >>> 0, 1));

const TukeyPairResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tukeypairresult_free(ptr >>> 0, 1));

/**
 * ANOVA result struct for JS
 */
export class AnovaResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AnovaResult.prototype);
        obj.__wbg_ptr = ptr;
        AnovaResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AnovaResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_anovaresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get f_score() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get df_between() {
        const ret = wasm.anovaresult_df_between(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get df_within() {
        const ret = wasm.anovaresult_df_within(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) AnovaResult.prototype[Symbol.dispose] = AnovaResult.prototype.free;

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

/**
 * Chi-square test result struct for JS
 */
export class ChiSquareResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ChiSquareResult.prototype);
        obj.__wbg_ptr = ptr;
        ChiSquareResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChiSquareResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chisquareresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get statistic() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get p_value() {
        const ret = wasm.chisquareresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get df() {
        const ret = wasm.chisquareresult_df(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) ChiSquareResult.prototype[Symbol.dispose] = ChiSquareResult.prototype.free;

/**
 * Histogram result with edges and counts
 */
export class HistogramWithEdges {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HistogramWithEdges.prototype);
        obj.__wbg_ptr = ptr;
        HistogramWithEdgesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HistogramWithEdgesFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_histogramwithedges_free(ptr, 0);
    }
    /**
     * @returns {ArrayResult}
     */
    get edges() {
        const ret = wasm.histogramwithedges_edges(this.__wbg_ptr);
        return ArrayResult.__wrap(ret);
    }
    /**
     * @returns {ArrayResult}
     */
    get counts() {
        const ret = wasm.histogramwithedges_counts(this.__wbg_ptr);
        return ArrayResult.__wrap(ret);
    }
}
if (Symbol.dispose) HistogramWithEdges.prototype[Symbol.dispose] = HistogramWithEdges.prototype.free;

/**
 * Quartiles result struct for JS
 */
export class QuartilesResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QuartilesResult.prototype);
        obj.__wbg_ptr = ptr;
        QuartilesResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QuartilesResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_quartilesresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get q1() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get q2() {
        const ret = wasm.chisquareresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get q3() {
        const ret = wasm.quartilesresult_q3(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) QuartilesResult.prototype[Symbol.dispose] = QuartilesResult.prototype.free;

export class RegressionCoeffs {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegressionCoeffs.prototype);
        obj.__wbg_ptr = ptr;
        RegressionCoeffsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RegressionCoeffsFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regressioncoeffs_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get slope() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get intercept() {
        const ret = wasm.chisquareresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get r_squared() {
        const ret = wasm.quartilesresult_q3(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) RegressionCoeffs.prototype[Symbol.dispose] = RegressionCoeffs.prototype.free;

export class RegressionCoeffsF32 {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RegressionCoeffsF32.prototype);
        obj.__wbg_ptr = ptr;
        RegressionCoeffsF32Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RegressionCoeffsF32Finalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_regressioncoeffsf32_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get slope() {
        const ret = wasm.regressioncoeffsf32_slope(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get intercept() {
        const ret = wasm.regressioncoeffsf32_intercept(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get r_squared() {
        const ret = wasm.regressioncoeffsf32_r_squared(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) RegressionCoeffsF32.prototype[Symbol.dispose] = RegressionCoeffsF32.prototype.free;

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
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get intercept() {
        const ret = wasm.chisquareresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get r_squared() {
        const ret = wasm.quartilesresult_q3(this.__wbg_ptr);
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
        const ret = wasm.quartilesresult_q3(this.__wbg_ptr);
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
 * Complete result of Tukey HSD test
 */
export class TukeyHsdResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TukeyHsdResult.prototype);
        obj.__wbg_ptr = ptr;
        TukeyHsdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TukeyHsdResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tukeyhsdresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get num_groups() {
        const ret = wasm.tukeyhsdresult_num_groups(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get df_within() {
        const ret = wasm.tukeyhsdresult_df_within(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get msw() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get num_comparisons() {
        const ret = wasm.tukeyhsdresult_num_comparisons(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get a specific comparison by index
     * @param {number} index
     * @returns {TukeyPairResult | undefined}
     */
    get_comparison(index) {
        const ret = wasm.tukeyhsdresult_get_comparison(this.__wbg_ptr, index);
        return ret === 0 ? undefined : TukeyPairResult.__wrap(ret);
    }
}
if (Symbol.dispose) TukeyHsdResult.prototype[Symbol.dispose] = TukeyHsdResult.prototype.free;

/**
 * Result of a single pairwise comparison in Tukey HSD test
 */
export class TukeyPairResult {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TukeyPairResult.prototype);
        obj.__wbg_ptr = ptr;
        TukeyPairResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TukeyPairResultFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tukeypairresult_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get group1() {
        const ret = wasm.tukeypairresult_group1(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get group2() {
        const ret = wasm.tukeypairresult_group2(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get mean_diff() {
        const ret = wasm.anovaresult_f_score(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get q_statistic() {
        const ret = wasm.chisquareresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get p_value() {
        const ret = wasm.quartilesresult_q3(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get ci_lower() {
        const ret = wasm.testresult_p_value(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get ci_upper() {
        const ret = wasm.tukeypairresult_ci_upper(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) TukeyPairResult.prototype[Symbol.dispose] = TukeyPairResult.prototype.free;

/**
 * @param {number} len
 * @returns {number}
 */
export function alloc_f32(len) {
    const ret = wasm.alloc_f32(len);
    return ret >>> 0;
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
 * ANOVA with categorical grouping - full result
 * @param {string[]} groups
 * @param {Float64Array} values
 * @returns {AnovaResult}
 */
export function anova_categorical(groups, values) {
    const ptr0 = passArrayJsValueToWasm0(groups, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.anova_categorical(ptr0, len0, ptr1, len1);
    return AnovaResult.__wrap(ret);
}

/**
 * ANOVA F-score with categorical grouping
 * groups: categorical labels
 * values: numeric values corresponding to each label
 * @param {string[]} groups
 * @param {Float64Array} values
 * @returns {number}
 */
export function anova_f_score_categorical(groups, values) {
    const ptr0 = passArrayJsValueToWasm0(groups, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.anova_f_score_categorical(ptr0, len0, ptr1, len1);
    return ret;
}

/**
 * ANOVA F-score for multiple groups using flat buffer approach
 * data_ptr: pointer to concatenated group data
 * lens_ptr: pointer to array of group lengths (as f64 for simplicity)
 * num_groups: number of groups
 * @param {number} data_ptr
 * @param {number} lens_ptr
 * @param {number} num_groups
 * @returns {number}
 */
export function anova_f_score_flat(data_ptr, lens_ptr, num_groups) {
    const ret = wasm.anova_f_score_flat(data_ptr, lens_ptr, num_groups);
    return ret;
}

/**
 * ANOVA with full result (F-score + degrees of freedom)
 * @param {number} data_ptr
 * @param {number} lens_ptr
 * @param {number} num_groups
 * @returns {AnovaResult}
 */
export function anova_flat(data_ptr, lens_ptr, num_groups) {
    const ret = wasm.anova_flat(data_ptr, lens_ptr, num_groups);
    return AnovaResult.__wrap(ret);
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
 * Chi-square test of independence for two categorical variables
 * @param {string[]} cat1
 * @param {string[]} cat2
 * @returns {ChiSquareResult}
 */
export function chi_square_test(cat1, cat2) {
    const ptr0 = passArrayJsValueToWasm0(cat1, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(cat2, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.chi_square_test(ptr0, len0, ptr1, len1);
    return ChiSquareResult.__wrap(ret);
}

/**
 * Chi-square test with optional cardinality hints for optimization
 *
 * If cardinality1 and cardinality2 are provided (number of unique categories),
 * uses a faster array-based algorithm.
 * @param {string[]} cat1
 * @param {string[]} cat2
 * @param {number | null} [cardinality1]
 * @param {number | null} [cardinality2]
 * @returns {ChiSquareResult}
 */
export function chi_square_test_with_cardinality(cat1, cat2, cardinality1, cardinality2) {
    const ptr0 = passArrayJsValueToWasm0(cat1, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayJsValueToWasm0(cat2, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.chi_square_test_with_cardinality(ptr0, len0, ptr1, len1, isLikeNone(cardinality1) ? 0x100000001 : (cardinality1) >>> 0, isLikeNone(cardinality2) ? 0x100000001 : (cardinality2) >>> 0);
    return ChiSquareResult.__wrap(ret);
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
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function coeffvar_f64(ptr, len) {
    const ret = wasm.coeffvar_f64(ptr, len);
    return ret;
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
export function deviation_f64(ptr, len) {
    const ret = wasm.deviation_f64(ptr, len);
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
export function free_f32(ptr, len) {
    wasm.free_f32(ptr, len);
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
 * Calculate histogram with automatic binning and tail collapse, returning edges and counts.
 * rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
 * bins_override: 0 means use rule's default, otherwise override
 * k: IQR multiplier for outlier detection (typically 1.5)
 * @param {number} ptr
 * @param {number} len
 * @param {number} rule
 * @param {number} bins_override
 * @param {number} k
 * @returns {HistogramWithEdges}
 */
export function histogram_auto_with_edges_collapse_tails_f64(ptr, len, rule, bins_override, k) {
    const ret = wasm.histogram_auto_with_edges_collapse_tails_f64(ptr, len, rule, bins_override, k);
    return HistogramWithEdges.__wrap(ret);
}

/**
 * Calculate histogram with automatic binning, returning edges and counts.
 * rule: 0 = FreedmanDiaconis, 1 = Scott, 2 = SqrtN
 * bins_override: 0 means use rule's default, otherwise override
 * @param {number} ptr
 * @param {number} len
 * @param {number} rule
 * @param {number} bins_override
 * @returns {HistogramWithEdges}
 */
export function histogram_auto_with_edges_f64(ptr, len, rule, bins_override) {
    const ret = wasm.histogram_auto_with_edges_f64(ptr, len, rule, bins_override);
    return HistogramWithEdges.__wrap(ret);
}

/**
 * Calculate histogram with custom edges, returning edges and counts.
 * clamp_outside: if true, values outside edges are clamped to first/last bin
 * @param {number} data_ptr
 * @param {number} data_len
 * @param {number} edges_ptr
 * @param {number} edges_len
 * @param {boolean} clamp_outside
 * @returns {HistogramWithEdges}
 */
export function histogram_custom_with_edges_f64(data_ptr, data_len, edges_ptr, edges_len, clamp_outside) {
    const ret = wasm.histogram_custom_with_edges_f64(data_ptr, data_len, edges_ptr, edges_len, clamp_outside);
    return HistogramWithEdges.__wrap(ret);
}

/**
 * @param {number} data_ptr
 * @param {number} data_len
 * @param {number} edges_ptr
 * @param {number} edges_len
 * @returns {ArrayResult}
 */
export function histogram_edges_f64(data_ptr, data_len, edges_ptr, edges_len) {
    const ret = wasm.histogram_edges_f64(data_ptr, data_len, edges_ptr, edges_len);
    return ArrayResult.__wrap(ret);
}

/**
 * Calculate histogram with equal-frequency binning, returning edges and counts.
 * @param {number} ptr
 * @param {number} len
 * @param {number} bins
 * @returns {HistogramWithEdges}
 */
export function histogram_equal_frequency_with_edges_f64(ptr, len, bins) {
    const ret = wasm.histogram_equal_frequency_with_edges_f64(ptr, len, bins);
    return HistogramWithEdges.__wrap(ret);
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
 * Calculate histogram with fixed-width binning, returning edges and counts.
 * @param {number} ptr
 * @param {number} len
 * @param {number} bins
 * @returns {HistogramWithEdges}
 */
export function histogram_fixed_width_with_edges_f64(ptr, len, bins) {
    const ret = wasm.histogram_fixed_width_with_edges_f64(ptr, len, bins);
    return HistogramWithEdges.__wrap(ret);
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
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function iqr_f64(ptr, len) {
    const ret = wasm.iqr_f64(ptr, len);
    return ret;
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
export function mean_f64_direct(ptr, len) {
    const ret = wasm.mean_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function meandev_f64(ptr, len) {
    const ret = wasm.meandev_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function meddev_f64(ptr, len) {
    const ret = wasm.meddev_f64(ptr, len);
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
 * @param {number} ptr
 * @param {number} len
 * @param {number} k
 * @returns {number}
 */
export function percentile_exclusive_f64(ptr, len, k) {
    const ret = wasm.percentile_exclusive_f64(ptr, len, k);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} k
 * @param {boolean} exclusive
 * @returns {number}
 */
export function percentile_f64(ptr, len, k, exclusive) {
    const ret = wasm.percentile_f64(ptr, len, k, exclusive);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} k
 * @returns {number}
 */
export function percentile_inclusive_f64(ptr, len, k) {
    const ret = wasm.percentile_inclusive_f64(ptr, len, k);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} score
 * @param {boolean} strict
 * @returns {number}
 */
export function percentile_of_score_f64(ptr, len, score, strict) {
    const ret = wasm.percentile_of_score_f64(ptr, len, score, strict);
    return ret;
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
 * @param {number} data1_ptr
 * @param {number} data1_len
 * @param {number} data2_ptr
 * @param {number} data2_len
 * @returns {number}
 */
export function pooledstdev_f64(data1_ptr, data1_len, data2_ptr, data2_len) {
    const ret = wasm.pooledstdev_f64(data1_ptr, data1_len, data2_ptr, data2_len);
    return ret;
}

/**
 * @param {number} data1_ptr
 * @param {number} data1_len
 * @param {number} data2_ptr
 * @param {number} data2_len
 * @returns {number}
 */
export function pooledvariance_f64(data1_ptr, data1_len, data2_ptr, data2_len) {
    const ret = wasm.pooledvariance_f64(data1_ptr, data1_len, data2_ptr, data2_len);
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
 * @param {number} score
 * @param {boolean} strict
 * @returns {number}
 */
export function qscore_f64(ptr, len, score, strict) {
    const ret = wasm.qscore_f64(ptr, len, score, strict);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} score
 * @param {number} q_lower
 * @param {number} q_upper
 * @returns {boolean}
 */
export function qtest_f64(ptr, len, score, q_lower, q_upper) {
    const ret = wasm.qtest_f64(ptr, len, score, q_lower, q_upper);
    return ret !== 0;
}

/**
 * @param {number} data_ptr
 * @param {number} data_len
 * @param {number} qs_ptr
 * @param {number} qs_len
 * @returns {ArrayResult}
 */
export function quantiles_f64(data_ptr, data_len, qs_ptr, qs_len) {
    const ret = wasm.quantiles_f64(data_ptr, data_len, qs_ptr, qs_len);
    return ArrayResult.__wrap(ret);
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {QuartilesResult}
 */
export function quartiles_f64(ptr, len) {
    const ret = wasm.quartiles_f64(ptr, len);
    return QuartilesResult.__wrap(ret);
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
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionCoeffs}
 */
export function regress_coeffs_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_coeffs_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionCoeffs.__wrap(ret);
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
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionCoeffs}
 */
export function regress_naive_coeffs_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_naive_coeffs_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionCoeffs.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionResult}
 */
export function regress_naive_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_naive_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionResult.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @param {number} residuals_out_ptr
 * @returns {RegressionCoeffs}
 */
export function regress_naive_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr) {
    const ret = wasm.regress_naive_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr);
    return RegressionCoeffs.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionCoeffsF32}
 */
export function regress_simd_coeffs_f32(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_simd_coeffs_f32(x_ptr, x_len, y_ptr, y_len);
    return RegressionCoeffsF32.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionCoeffs}
 */
export function regress_simd_coeffs_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_coeffs_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionCoeffs.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionResult}
 */
export function regress_simd_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_simd_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionResult.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @param {number} residuals_out_ptr
 * @returns {RegressionCoeffsF32}
 */
export function regress_simd_residuals_inplace_f32(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr) {
    const ret = wasm.regress_simd_residuals_inplace_f32(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr);
    return RegressionCoeffsF32.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @param {number} residuals_out_ptr
 * @returns {RegressionCoeffs}
 */
export function regress_simd_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr) {
    const ret = wasm.regress_simd_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr);
    return RegressionCoeffs.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionCoeffs}
 */
export function regress_wasm_kernels_coeffs_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_wasm_kernels_coeffs_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionCoeffs.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @returns {RegressionResult}
 */
export function regress_wasm_kernels_f64(x_ptr, x_len, y_ptr, y_len) {
    const ret = wasm.regress_wasm_kernels_f64(x_ptr, x_len, y_ptr, y_len);
    return RegressionResult.__wrap(ret);
}

/**
 * @param {number} x_ptr
 * @param {number} x_len
 * @param {number} y_ptr
 * @param {number} y_len
 * @param {number} residuals_out_ptr
 * @returns {RegressionCoeffs}
 */
export function regress_wasm_kernels_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr) {
    const ret = wasm.regress_wasm_kernels_residuals_inplace_f64(x_ptr, x_len, y_ptr, y_len, residuals_out_ptr);
    return RegressionCoeffs.__wrap(ret);
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
export function sample_stdev_f64_direct(ptr, len) {
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
export function sample_variance_f64_direct(ptr, len) {
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

/**
 * @param {number} ptr
 * @param {number} len
 * @param {number} k
 * @returns {number}
 */
export function stan_moment_f64(ptr, len, k) {
    const ret = wasm.stan_moment_f64(ptr, len, k);
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
export function stdev_f64_direct(ptr, len) {
    const ret = wasm.stdev_f64(ptr, len);
    return ret;
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
export function sum_f64_direct(ptr, len) {
    const ret = wasm.sum_f64(ptr, len);
    return ret;
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
 * Tukey HSD test with categorical grouping
 * @param {string[]} groups
 * @param {Float64Array} values
 * @returns {TukeyHsdResult}
 */
export function tukey_hsd_categorical(groups, values) {
    const ptr0 = passArrayJsValueToWasm0(groups, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.tukey_hsd_categorical(ptr0, len0, ptr1, len1);
    return TukeyHsdResult.__wrap(ret);
}

/**
 * Tukey HSD test using flat buffer approach (same as ANOVA)
 * data_ptr: pointer to concatenated group data
 * lens_ptr: pointer to array of group lengths (as f64)
 * num_groups: number of groups
 * @param {number} data_ptr
 * @param {number} lens_ptr
 * @param {number} num_groups
 * @returns {TukeyHsdResult}
 */
export function tukey_hsd_flat(data_ptr, lens_ptr, num_groups) {
    const ret = wasm.tukey_hsd_flat(data_ptr, lens_ptr, num_groups);
    return TukeyHsdResult.__wrap(ret);
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
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function variance_f64(ptr, len) {
    const ret = wasm.variance_f64(ptr, len);
    return ret;
}

/**
 * @param {number} ptr
 * @param {number} len
 * @returns {number}
 */
export function variance_f64_direct(ptr, len) {
    const ret = wasm.variance_f64(ptr, len);
    return ret;
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

export function __wbg___wbindgen_memory_a342e963fbcabd68() {
    const ret = wasm.memory;
    return ret;
};

export function __wbg___wbindgen_string_get_a2a31e16edf96e42(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
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
