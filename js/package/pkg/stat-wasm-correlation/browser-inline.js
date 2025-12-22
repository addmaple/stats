import { setInstance, registerInit } from "./core.js";
import { instantiateWithFallback } from "./util.js";

import { wasmBytes as simdBytes } from "./wasm-inline/stat_wasm_correlation.simd.wasm.js";
import { wasmBytes as baseBytes } from "./wasm-inline/stat_wasm_correlation.base.wasm.js";

async function getWasmBytes() {
  return { simdBytes, baseBytes };
}


let _ready = null;
export function init(imports = {}) {
  return (_ready ??= (async () => {
    const { simdBytes, baseBytes } = await getWasmBytes();
    const { instance } = await instantiateWithFallback(simdBytes, baseBytes, imports);
    setInstance(instance);
  })());
}

registerInit(init);
export * from "./custom.js";
