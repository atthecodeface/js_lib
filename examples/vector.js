import { set_scale_add_scaled, dot, is_zero } from "./test_utils.js";
import { Quaternion } from "./quaternion.js";
export class Vector {
    constructor() {
        this.dims = 1;
    }
    get array() {
        return this.data;
    }
    set_array(array) {
        this.data = array.slice();
    }
    clone() {
        const x = new this.constructor();
        x.data = this.data.slice();
        return x;
    }
    set_scale_add_scaled(scale, other, oscale) {
        return set_scale_add_scaled(this.data, scale, other.data, oscale);
    }
    get is_zero() {
        return is_zero(this.data);
    }
    get length_sq() {
        return dot(this.data, this.data);
    }
    get length() {
        return Math.sqrt(this.length_sq);
    }
    dot(other) {
        return dot(this.data, other.data);
    }
    set_normalized() {
        const l = this.length;
        this.set_mulf(1.0 / l);
    }
    set_zero() {
        return this.set_scale_add_scaled(0.0, this, 0.0);
    }
    set_neg() {
        return this.set_scale_add_scaled(-1.0, this, 0.0);
    }
    set_add(other) {
        return this.set_scale_add_scaled(1.0, other, 1.0);
    }
    set_sub(other) {
        return this.set_scale_add_scaled(1.0, other, -1.0);
    }
    set_mulf(scale) {
        return this.set_scale_add_scaled(scale, this, 0.0);
    }
    set_divf(scale) {
        return this.set_scale_add_scaled(1.0 / scale, this, 0.0);
    }
    distance_sq(other) {
        const x = this.clone();
        x.set_scale_add_scaled(1.0, other, -1.0);
        return x.length_sq;
    }
    distance(other) {
        return Math.sqrt(this.distance_sq(other));
    }
    set_mix(other, t) {
        this.set_scale_add_scaled(1.0 - t, other, t);
    }
    mix(other, t) {
        const r = this.clone();
        r.set_mix(other, t);
        return r;
    }
    // was mul_assign_q
    set_premul_q(q) {
        const vq = Quaternion.of_rijk([
            0,
            this.data[0],
            this.data[1],
            this.data[2],
        ]);
        const r = q.clone().mul_assign_q(vq).mul_assign_q(q.clone_conjugate());
        this.data[0] = r.rijk[1];
        this.data[1] = r.rijk[2];
        this.data[2] = r.rijk[3];
    }
    add(other) {
        const r = this.clone();
        r.set_add(other);
        return r;
    }
}
export class Vec3 extends Vector {
}
