"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaternion = void 0;
// import { Vec3 } from "./vector.js";
const test_utils_js_1 = require("./test_utils.js");
// import { LocalArrayType } from "./test_utils.js";
class Quaternion {
    constructor() {
        this.rijk = [1, 0, 0, 0];
    }
    clone() {
        const q = new Quaternion();
        q.rijk = [this.rijk[0], this.rijk[1], this.rijk[2], this.rijk[3]];
        return q;
    }
    clone_conjugate() {
        const q = new Quaternion();
        q.rijk = [this.rijk[0], -this.rijk[1], -this.rijk[2], -this.rijk[3]];
        return q;
    }
    length_sq() {
        return (0, test_utils_js_1.dot)(this.rijk, this.rijk);
    }
    set_conjugate() {
        this.rijk[1] = -this.rijk[1];
        this.rijk[2] = -this.rijk[2];
        this.rijk[3] = -this.rijk[3];
    }
    set_scale_add_scaled(scale, other, oscale) {
        (0, test_utils_js_1.set_scale_add_scaled)(this.rijk, scale, other.rijk, oscale);
    }
    distance_sq(other) {
        const r = this.clone_conjugate();
        r.mul_assign_q(other);
        return 1.0 - Math.abs(r.rijk[0]);
    }
    // Axis need not be a unit vector
    set_of_axis_angle(axis, angle) {
        const l = Math.sqrt((0, test_utils_js_1.dot)(axis, axis));
        if (l < 1e-6) {
            this.rijk = [1, 0, 0, 0];
        }
        else {
            const r = Math.cos(angle / 2);
            const s = Math.sin(angle / 2) / l;
            this.rijk = [r, s * axis[0], s * axis[1], s * axis[2]];
        }
    }
    static of_rijk(rijk) {
        const q = new Quaternion();
        q.rijk = [rijk[0], rijk[1], rijk[2], rijk[3]];
        return q;
    }
    normalize() {
        const dsq = this.length_sq();
        this.set_scale_add_scaled(1.0 / Math.sqrt(dsq), this, 0.0);
        return this;
    }
    mul_assign_q(q) {
        const r = this.rijk[0] * q.rijk[0] -
            this.rijk[1] * q.rijk[1] -
            this.rijk[2] * q.rijk[2] -
            this.rijk[3] * q.rijk[3];
        const i = this.rijk[0] * q.rijk[1] +
            this.rijk[1] * q.rijk[0] +
            this.rijk[2] * q.rijk[3] -
            this.rijk[3] * q.rijk[2];
        const j = this.rijk[0] * q.rijk[2] +
            this.rijk[2] * q.rijk[0] +
            this.rijk[3] * q.rijk[1] -
            this.rijk[1] * q.rijk[3];
        const k = this.rijk[0] * q.rijk[3] +
            this.rijk[3] * q.rijk[0] +
            this.rijk[1] * q.rijk[2] -
            this.rijk[2] * q.rijk[1];
        this.rijk = [r, i, j, k];
        return this;
    }
    set_rotation_of_vec_to_vec(v0, v1) {
        const obtuse = (0, test_utils_js_1.dot)(v0, v1) < 0.0;
        const cp = (0, test_utils_js_1.cross_product)(v0, v1);
        const sa = Math.min(Math.sqrt((0, test_utils_js_1.dot)(cp, cp)), 1);
        var angle = Math.asin(sa);
        if (obtuse) {
            angle = Math.PI - angle;
        }
        this.set_of_axis_angle(cp, angle);
    }
    set_mapping_vector_pair_to_vector_pair(di_m, dj_m, di_c, dj_c) {
        const qi_c = new Quaternion();
        const qi_m = new Quaternion();
        qi_c.set_rotation_of_vec_to_vec(di_c, [0, 0, 1]);
        qi_m.set_rotation_of_vec_to_vec(di_m, [0, 0, 1]);
        const dj_c_rotated = qi_c.apply_vec(dj_c);
        const dj_m_rotated = qi_m.apply_vec(dj_m);
        const theta_dj_m = Math.atan2(dj_m_rotated[0], dj_m_rotated[1]);
        const theta_dj_c = Math.atan2(dj_c_rotated[0], dj_c_rotated[1]);
        const q_z = new Quaternion();
        q_z.set_of_axis_angle([0, 0, 1], theta_dj_m - theta_dj_c);
        this.rijk = qi_c.rijk;
        this.set_conjugate();
        this.mul_assign_q(q_z);
        this.mul_assign_q(qi_m);
    }
    apply_vec(v) {
        const r = this.rijk[0];
        const i = this.rijk[1];
        const j = this.rijk[2];
        const k = this.rijk[3];
        const x = (r * r + i * i - j * j - k * k) * v[0] +
            2 * (i * k + r * j) * v[2] +
            2 * (i * j - r * k) * v[1];
        const y = (r * r - i * i + j * j - k * k) * v[1] +
            2 * (j * i + r * k) * v[0] +
            2 * (j * k - r * i) * v[2];
        const z = (r * r - i * i - j * j + k * k) * v[2] +
            2 * (k * j + r * i) * v[1] +
            2 * (k * i - r * j) * v[0];
        return [x, y, z];
    }
    as_mat4() {
        const r = this.rijk[0];
        const i = this.rijk[1];
        const j = this.rijk[2];
        const k = this.rijk[3];
        return [
            1 - 2 * (j * j + k * k),
            2 * (i * j - r * k),
            2 * (i * k + r * j),
            0.0,
            2 * (i * j + r * k),
            1 - 2 * (i * i + k * k),
            2 * (j * k - r * i),
            0.0,
            2 * (i * k - r * j),
            2 * (j * k + r * i),
            1 - 2 * (i * i + j * j),
            0.0,
            0,
            0,
            0,
            1,
        ];
    }
}
exports.Quaternion = Quaternion;
//# sourceMappingURL=quaternion.js.map