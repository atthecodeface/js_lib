import { dot } from "./test_utils.js";
import { Quaternion } from "./quaternion.js";
class WasmQuatBase {
    constructor(i = 0, j = 0, k = 0, r = 1) {
        this.q = Quaternion.of_rijk([r, i, j, k]);
    }
    // Must override this
    get array() {
        return null;
    }
    get buffer() {
        return 0;
    }
    clone() {
        const q = new this.constructor();
        q.q = this.q.clone();
        return q;
    }
    get r() {
        return this.q.rijk[0];
    }
    get i() {
        return this.q.rijk[1];
    }
    get j() {
        return this.q.rijk[2];
    }
    get k() {
        return this.q.rijk[3];
    }
    set r(v) {
        this.q.rijk[0] = v;
    }
    set i(v) {
        this.q.rijk[1] = v;
    }
    set j(v) {
        this.q.rijk[2] = v;
    }
    set k(v) {
        this.q.rijk[3] = v;
    }
    get rijk() {
        return this.q.rijk;
    }
    set rijk(v) {
        this.q.rijk = v;
    }
    set_array(a) {
        this._quaternion().rijk = [a[0], a[1], a[2], a[3]];
    }
    get length_sq() {
        return this.q.length_sq();
    }
    get length() {
        return Math.sqrt(this.q.length_sq());
    }
    set(i, j, k, r) {
        this.q.rijk = [r, i, j, k];
    }
    set_unit() {
        this.set(0, 0, 0, 1);
    }
    set_neg() {
        this.q.set_scale_add_scaled(-1.0, this.q, 0.0);
    }
    set_normalized() {
        this.q.normalize();
    }
    set_conjugate() {
        this.q.set_conjugate();
    }
    set_add(other) {
        this.q.set_scale_add_scaled(1.0, other.q, 1.0);
    }
    set_sub(other) {
        this.q.set_scale_add_scaled(1.0, other.q, -1.0);
    }
    set_mul(other) {
        this.q.mul_assign_q(other.q);
    }
    set_div(other) {
        const qc = other.q.clone_conjugate();
        this.q.mul_assign_q(qc);
    }
    set_premul(other) {
        const q = other.q.clone();
        q.mul_assign_q(this.q);
        this.q = q;
    }
    set_prediv(other) {
        const q = other.q.clone();
        q.mul_assign_q(this.q.clone_conjugate());
        this.q = q;
    }
    set_mulf(scale) {
        this.q.set_scale_add_scaled(scale, this.q, 0.0);
    }
    set_divf(scale) {
        this.q.set_scale_add_scaled(1.0 / scale, this.q, 0.0);
    }
    set_mul_rotate_x(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([1, 0, 0], angle);
        this.q.mul_assign_q(q);
    }
    set_mul_rotate_y(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([0, 1, 0], angle);
        this.q.mul_assign_q(q);
    }
    set_mul_rotate_z(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([0, 0, 1], angle);
        this.q.mul_assign_q(q);
    }
    // self <- rotate(Axis, angle) * self
    // This is the one you usually want
    set_premul_rotate_x(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([1, 0, 0], angle);
        q.mul_assign_q(this.q);
        this.q = q;
    }
    set_premul_rotate_y(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([0, 1, 0], angle);
        q.mul_assign_q(this.q);
        this.q = q;
    }
    set_premul_rotate_z(angle) {
        const q = this.q.clone();
        q.set_of_axis_angle([0, 0, 1], angle);
        q.mul_assign_q(this.q);
        this.q = q;
    }
    dot(other) {
        return dot(this.q.rijk, other.q.rijk);
    }
    distance_sq(other) {
        return this.q.distance_sq(other.q);
    }
    distance(other) {
        return Math.sqrt(this.distance_sq(other));
    }
    apply_set_vec(v) {
        const [x, y, z] = this.q.apply_vec(v.data);
        v.data.set([x, y, z]);
    }
    apply_vec(v) {
        const r = v.clone();
        this.apply_set_vec(r);
        return r;
    }
    set_of_axis_angle(v, angle) {
        this.q.set_of_axis_angle([v.data[0], v.data[1], v.data[2]], angle);
    }
    set_rotation_of_vec_to_vec(v0, v1) {
        this.q.set_rotation_of_vec_to_vec(v0.data, v1.data);
    }
    set_mapping_vector_pair_to_vector_pair(di_m, dj_m, di_c, dj_c) {
        this.q.set_mapping_vector_pair_to_vector_pair(di_m.data, dj_m.data, di_c.data, dj_c.data);
    }
    // Try not to use these...
    conjugate() {
        const q = this.clone();
        q.q = this.q.clone_conjugate();
        return q;
    }
    mul(other) {
        const q = this.clone();
        q.q = this.q.clone().mul_assign_q(other.q);
        return q;
    }
    div(other) {
        const q = this.clone();
        q.q = this.q.clone().mul_assign_q(other.q.clone_conjugate());
        return q;
    }
    set_mat4(mat) {
        mat.set(this.q.as_mat4());
    }
    _quaternion() {
        return this.q;
    }
    _set_quaternion(q) {
        this.q = q;
    }
}
export class WasmQuatf32 extends WasmQuatBase {
    static unit() {
        return new WasmQuatf32();
    }
    static of_axis_angle(axis, angle) {
        const q = new WasmQuatf32();
        q.set_of_axis_angle(axis, angle);
        return q;
    }
    get array() {
        return new Float32Array(this._quaternion().rijk);
    }
}
export class WasmQuatf64 extends WasmQuatBase {
    get array() {
        return new Float64Array(this._quaternion().rijk);
    }
}
