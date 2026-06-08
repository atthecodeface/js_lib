"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmMatBase = exports.Matrix = void 0;
const vector_js_1 = require("./vector.js");
class Matrix {
    constructor() {
        this.data = [];
    }
    set(array) {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i] = array[i];
        }
    }
    clone() {
        const x = new this.constructor();
        x.data = this.data.slice();
        return x;
    }
    is_zero() {
        return (0, vector_js_1.is_zero)(this.data);
    }
    set_scale_add_scaled(scale, other, oscale) {
        return (0, vector_js_1.set_scale_add_scaled)(this.data, scale, other.data, oscale);
    }
}
exports.Matrix = Matrix;
class WasmMatBase {
    constructor() {
        this.m = new Matrix();
    }
    clone() {
        const t = new this.constructor();
        t.m = this.m.clone();
        return t;
    }
    add(other) {
        const r = this.clone();
        r.m.set_scale_add_scaled(1.0, other.m, 1.0);
        return r;
    }
    is_zero() {
        return this.m.is_zero();
    }
}
exports.WasmMatBase = WasmMatBase;
//# sourceMappingURL=wasm_mat.js.map