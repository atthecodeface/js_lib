import { Quaternion } from "./quaternion.js";
export function is_zero(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i] != 0) {
            return false;
        }
    }
    return true;
}
export function dot(xs, oxs) {
    var r = 0.0;
    for (var i = 0; i < xs.length; i++) {
        r += xs[i] * oxs[i];
    }
    return r;
}
export function cross_product(xs, oxs) {
    const i0 = xs[0];
    const j0 = xs[1];
    const k0 = xs[2];
    const i1 = oxs[0];
    const j1 = oxs[1];
    const k1 = oxs[2];
    return [j0 * k1 - k0 * j1, k0 * i1 - i0 * k1, i0 * j1 - j0 * i1];
}
export function set_scale_add_scaled(xs, scale, oxs, oscale) {
    for (var i = 0; i < xs.length; i++) {
        xs[i] = xs[i] * scale + oxs[i] * oscale;
    }
}
export class Vector {
    constructor() {
        this.xyz = [];
    }
    set(array) {
        for (var i = 0; i < this.xyz.length; i++) {
            this.xyz[i] = array[i];
        }
    }
    clone() {
        const x = new this.constructor();
        x.xyz = this.xyz.slice();
        return x;
    }
    is_zero() {
        return is_zero(this.xyz);
    }
    length() {
        return Math.sqrt(this.length_sq());
    }
    length_sq() {
        return dot(this.xyz, this.xyz);
    }
    dot(other) {
        return dot(this.xyz, other.xyz);
    }
    set_normalized() {
        const l = this.length();
        this.set_mulf(1.0 / l);
    }
    set_scale_add_scaled(scale, other, oscale) {
        return set_scale_add_scaled(this.xyz, scale, other.xyz, oscale);
    }
    set_mulf(scale) {
        return set_scale_add_scaled(this.xyz, scale, this.xyz, 0.0);
    }
    distance_sq(other) {
        const x = this.clone();
        x.set_scale_add_scaled(1.0, other, -1.0);
        return x.length_sq();
    }
    mul_assign_q(q) {
        const vq = Quaternion.of_rijk([
            0,
            this.xyz[0],
            this.xyz[1],
            this.xyz[2],
        ]);
        const r = q.clone().mul_assign_q(vq).mul_assign_q(q.clone_conjugate());
        this.xyz = [r.rijk[1], r.rijk[2], r.rijk[3]];
        return this;
    }
}
export class Vec3 extends Vector {
    constructor(x, y, z) {
        super();
        this.xyz = [x, y, z];
    }
    clone() {
        return super.clone.bind(this)();
    }
}
