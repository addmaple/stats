let _inst = null;
let _memU8 = null;
let _initFn = null;

function refreshViews() {
  _memU8 = new Uint8Array(_inst.exports.memory.buffer);
}

export function setInstance(instance) {
  _inst = instance;
  refreshViews();
}

export function wasmExports() {
  return _inst.exports;
}

let _ready = null;
export function registerInit(fn) { _initFn = fn; }

async function ensureReady() {
  if (_ready) return _ready;
  if (!_initFn) throw new Error("init not registered");
  _ready = _initFn();
  return _ready;
}

export function memoryU8() {
  if (_memU8 && _memU8.buffer !== _inst.exports.memory.buffer) refreshViews();
  return _memU8;
}

export function alloc(len) {
  return _inst.exports.alloc_bytes(len) >>> 0;
}

export function free(ptr, len) {
  _inst.exports.free_bytes(ptr >>> 0, len >>> 0);
}

function toBytes(input) {
  if (input instanceof Uint8Array) return input;
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  throw new TypeError("Expected a TypedArray or ArrayBuffer");
}

function callWasm(abi, input, outLen, reuse) {
  if (!_inst) throw new Error("WASM instance not initialized");
  const view = toBytes(input);
  const len = view.byteLength;

  let inPtr, outPtr;
  if (reuse) {
    if (reuse.in.len < len) {
      if (reuse.in.ptr) free(reuse.in.ptr, reuse.in.len);
      reuse.in.ptr = alloc(len);
      reuse.in.len = len;
    }
    if (reuse.out.len < outLen) {
      if (reuse.out.ptr) free(reuse.out.ptr, reuse.out.len);
      reuse.out.ptr = alloc(outLen);
      reuse.out.len = outLen;
    }
    inPtr = reuse.in.ptr;
    outPtr = reuse.out.ptr;
  } else {
    inPtr = alloc(len);
    outPtr = alloc(outLen);
  }

  memoryU8().set(view, inPtr);
  const written = _inst.exports[abi](inPtr, len, outPtr, outLen);
  if (written < 0) {
    if (!reuse) { free(inPtr, len); free(outPtr, outLen); }
    throw new Error(abi + " failed: " + written);
  }

  return { inPtr, outPtr, len, outLen, written };
}
