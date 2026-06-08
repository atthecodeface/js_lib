"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmVec3f64 = exports.WasmVec3f32 = exports.WasmVecBase = void 0;
const vector_js_1 = require("./vector.js");
class WasmVecBase {
    constructor() {
        this.v = new vector_js_1.Vector();
    }
    clone() {
        const t = new this.constructor();
        t.v = this.v.clone();
        return t;
    }
    add(other) {
        const r = this.clone();
        r.v.set_scale_add_scaled(1.0, other.v, 1.0);
        return r;
    }
    is_zero() {
        return this.v.is_zero();
    }
    get length() {
        return this.v.length();
    }
    get length_sq() {
        return this.v.length_sq();
    }
    set_zero() {
        return this.v.set_mulf(0.0);
    }
    set_neg() {
        return this.v.set_mulf(-1.0);
    }
    set_normalized() {
        return this.v.set_normalized();
    }
    set_add(other) {
        return this.v.set_scale_add_scaled(1.0, other.v, 1.0);
    }
    set_sub(other) {
        return this.v.set_scale_add_scaled(1.0, other.v, -1.0);
    }
    set_mulf(scale) {
        return this.v.set_mulf(scale);
    }
    set_divf(scale) {
        return this.v.set_mulf(1.0 / scale);
    }
    dot(other) {
        return this.v.dot(other.v);
    }
    distance_sq(other) {
        return this.v.distance_sq(other.v);
    }
    distance(other) {
        return Math.sqrt(this.distance_sq(other));
    }
    mix(other, t) {
        const r = this.clone();
        r.set_mix(other, t);
        return r;
    }
    set_mix(other, t) {
        this.v.set_scale_add_scaled(1.0 - t, other.v, t);
    }
    _v() {
        return this.v;
    }
    _set_v(v) {
        this.v = v;
    }
}
exports.WasmVecBase = WasmVecBase;
class WasmVec3f32 extends WasmVecBase {
    constructor(x, y, z) {
        super();
        this._set_v(new vector_js_1.Vec3(x, y, z));
    }
    static zero() {
        return new WasmVec3f32(0, 0, 0);
    }
    set(array) {
        this._v().set(array);
    }
    get array() {
        return new Float32Array(this._v().xyz);
    }
}
exports.WasmVec3f32 = WasmVec3f32;
class WasmVec3f64 extends WasmVecBase {
    constructor(x, y, z) {
        super();
        this._set_v(new vector_js_1.Vec3(x, y, z));
    }
    static zero() {
        return new WasmVec3f64(0, 0, 0);
    }
    set(array) {
        this._v().set(array);
    }
    get array() {
        return new Float64Array(this._v().xyz);
    }
}
exports.WasmVec3f64 = WasmVec3f64;
//# sourceMappingURL=wasm_vec.js.map