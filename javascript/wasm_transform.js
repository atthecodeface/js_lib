"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmTransformf64 = exports.WasmTransformf32 = void 0;
const quaternion_js_1 = require("./quaternion.js");
class WasmTransformBase {
    constructor() {
        this.transform = new quaternion_js_1.Transform();
    }
    rotate_by(q) {
        this.transform.rotate_by(q._quaternion());
    }
    scale_by(s) {
        this.transform.scale_by(s);
    }
    translate_by(dxyz) {
        this.transform.translate_by(dxyz);
    }
    set_q(q) {
        q._set_quaternion(this.transform.quat);
    }
    set_mat4(mat) {
        this.transform.set_mat4(mat);
    }
}
class WasmTransformf32 extends WasmTransformBase {
}
exports.WasmTransformf32 = WasmTransformf32;
class WasmTransformf64 extends WasmTransformBase {
}
exports.WasmTransformf64 = WasmTransformf64;
//# sourceMappingURL=wasm_transform.js.map