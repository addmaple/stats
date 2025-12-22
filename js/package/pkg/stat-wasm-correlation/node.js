import { setInstance, registerInit } from "./core.js";
import { instantiateWithFallback } from "./util.js";

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const simdPath = fileURLToPath(new URL("./wasm/stat_wasm_correlation.simd.wasm", import.meta.url));
const basePath = fileURLToPath(new URL("./wasm/stat_wasm_correlation.base.wasm", import.meta.url));

async function getWasmBytes() {
  const [simdBytes, baseBytes] = await Promise.all([
    readFile(simdPath).catch(() => null),
    readFile(basePath).catch(() => null)
  ]);
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
