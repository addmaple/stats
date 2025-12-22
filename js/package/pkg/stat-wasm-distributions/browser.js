import { setInstance, registerInit } from "./core.js";
import { instantiateWithFallback } from "./util.js";

const simdUrl = new URL("./wasm/stat_wasm_distributions.simd.wasm", import.meta.url);
const baseUrl = new URL("./wasm/stat_wasm_distributions.base.wasm", import.meta.url);

async function getWasmBytes() {
  const [simdRes, baseRes] = await Promise.all([fetch(simdUrl), fetch(baseUrl)]);
  const [simdBytes, baseBytes] = await Promise.all([simdRes.arrayBuffer(), baseRes.arrayBuffer()]);
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
