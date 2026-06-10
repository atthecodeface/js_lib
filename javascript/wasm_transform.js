"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmTransformf64 = exports.WasmTransformf32 = void 0;
const wasm_vec_js_1 = require("./wasm_vec.js");
const wasm_quat_js_1 = require("./wasm_quat.js");
const transform_js_1 = require("./transform.js");
class WasmTransformBase extends transform_js_1.Transform {
}
class WasmTransformf32 extends WasmTransformBase {
    constructor() {
        super(wasm_vec_js_1.WasmVec3f32, wasm_quat_js_1.WasmQuatf32);
    }
}
exports.WasmTransformf32 = WasmTransformf32;
class WasmTransformf64 extends WasmTransformBase {
    constructor() {
        super(wasm_vec_js_1.WasmVec3f64, wasm_quat_js_1.WasmQuatf64);
    }
}
exports.WasmTransformf64 = WasmTransformf64;
//# sourceMappingURL=wasm_transform.js.map