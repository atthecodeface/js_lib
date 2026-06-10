"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmVec3f64 = exports.WasmVec3f32 = exports.WasmVec3 = void 0;
const vector_js_1 = require("./vector.js");
class WasmVec3 extends vector_js_1.Vec3 {
}
exports.WasmVec3 = WasmVec3;
class WasmVec3f32 extends WasmVec3 {
    constructor(x, y, z) {
        super();
        this.data = new Float32Array([x, y, z]);
    }
    static zero() {
        return new WasmVec3f32(0, 0, 0);
    }
}
exports.WasmVec3f32 = WasmVec3f32;
class WasmVec3f64 extends WasmVec3 {
    constructor(x, y, z) {
        super();
        this.data = new Float64Array([x, y, z]);
    }
    static zero() {
        return new WasmVec3f64(0, 0, 0);
    }
}
exports.WasmVec3f64 = WasmVec3f64;
//# sourceMappingURL=wasm_vec.js.map