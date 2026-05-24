export class WasmBezier3f32 {
    set_vec_control_pt(_vec, _index) { }
}
export class WasmVec3f32 {
    constructor(x, y, z) {
        this.v = new Vec3(x, y, z);
    }
    static zero() {
        return new WasmVec3f32(0, 0, 0);
    }
    add(other) {
        const r = new WasmVec3f32(0, 0, 0);
        r.v.add_assign(other.v.xyz);
        return r;
    }
    _v() {
        return this.v;
    }
}
export class WasmVec3f64 {
    constructor(x, y, z) {
        this.v = new Vec3(x, y, z);
    }
    static zero() {
        return new WasmVec3f64(0, 0, 0);
    }
    add(other) {
        const r = new WasmVec3f64(0, 0, 0);
        r.v.add_assign(other.v.xyz);
        return r;
    }
    _v() {
        return this.v;
    }
}
export class WasmQuatf32 {
    constructor(i, j, k, r, q = null) {
        if (q !== null) {
            this.q = q;
        }
        else {
            this.q = Quaternion.of_rijk([r, i, j, k]);
        }
    }
    static unit() {
        return new WasmQuatf32(0, 0, 0, 1);
    }
    static of_axis_angle(axis, angle) {
        return new WasmQuatf32(0, 0, 0, 0, Quaternion.of_axis_angle(axis._v(), angle));
    }
    conjugate() {
        return new WasmQuatf32(0, 0, 0, 0, this.q.clone_conjugate());
    }
    set(i, j, k, r) {
        this.q = Quaternion.of_rijk([r, i, j, k]);
    }
    mul(other) {
        return new WasmQuatf32(0, 0, 0, 0, this.q.clone().mul_assign_q(other.q));
    }
    div(other) {
        return new WasmQuatf32(0, 0, 0, 0, this.q.clone().mul_assign_q(other.q.clone_conjugate()));
    }
    _quaternion() {
        return this.q;
    }
}
export class WasmTransformf32 {
    constructor() {
        this.transform = new Transform();
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
    set_mat4(mat) {
        this.transform.set_mat4(mat);
    }
}
class Vec3 {
    constructor(x, y, z) {
        this.xyz = [x, y, z];
    }
    mul_assign_f(s) {
        this.xyz[0] *= s;
        this.xyz[1] *= s;
        this.xyz[2] *= s;
        return this;
    }
    mul_assign_q(q) {
        const vq = Quaternion.of_rijk([0, this.xyz[0], this.xyz[1], this.xyz[2]]);
        const r = q.clone().mul_assign_q(vq).mul_assign_q(q.clone_conjugate());
        this.xyz = [r.rijk[1], r.rijk[2], r.rijk[3]];
        return this;
    }
    add_assign(dxyz) {
        this.xyz[0] += dxyz[0];
        this.xyz[1] += dxyz[1];
        this.xyz[2] += dxyz[2];
        return this;
    }
}
class Quaternion {
    constructor() {
        this.rijk = [1, 0, 0, 0];
    }
    r() {
        return this.rijk[0];
    }
    i() {
        return this.rijk[1];
    }
    j() {
        return this.rijk[2];
    }
    k() {
        return this.rijk[3];
    }
    static of_axis_angle(axis, angle) {
        const r = Math.cos(angle / 2);
        const s = Math.sin(angle / 2);
        return Quaternion.of_rijk([
            r,
            s * axis.xyz[0],
            s * axis.xyz[1],
            s * axis.xyz[2],
        ]);
    }
    static of_rijk(rijk) {
        const q = new Quaternion();
        q.rijk = [rijk[0], rijk[1], rijk[2], rijk[3]];
        return q;
    }
    normalize() {
        const dsq = this.rijk[0] * this.rijk[0] +
            this.rijk[1] * this.rijk[1] +
            this.rijk[2] * this.rijk[2] +
            this.rijk[3] * this.rijk[3];
        const d = Math.sqrt(dsq);
        this.rijk = [
            this.rijk[0] / d,
            this.rijk[1] / d,
            this.rijk[2] / d,
            this.rijk[3] / d,
        ];
        return this;
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
}
class Transform {
    constructor() {
        this.scale = 1.0;
        this.quat = new Quaternion();
        this.translation = new Vec3(0, 0, 0);
    }
    scale_by(s) {
        this.scale *= s;
        this.translation.mul_assign_f(s);
    }
    translate_by(dxyz) {
        this.translation.add_assign(dxyz);
    }
    rotate_by(q) {
        // this.quat = q.clone().mul_assign_q(this.quat);
        this.quat.mul_assign_q(q);
        // this.translation.mul_assign_q(q);
    }
    set_mat4(mat) {
        const r = this.quat.r();
        const i = this.quat.i();
        const j = this.quat.j();
        const k = this.quat.k();
        mat.set([
            this.scale * (1 - 2 * (j * j + k * k)),
            this.scale * 2 * (i * j - r * k),
            this.scale * 2 * (i * k + r * j),
            0.0 * this.translation.xyz[0] /*  */,
            this.scale * 2 * (i * j + r * k),
            this.scale * (1 - 2 * (i * i + k * k)),
            this.scale * 2 * (j * k - r * i),
            0.0 * this.translation.xyz[1] /*  */,
            this.scale * 2 * (i * k - r * j),
            this.scale * 2 * (j * k + r * i),
            this.scale * (1 - 2 * (i * i + j * j)),
            0.0 * this.translation.xyz[2] /*  */,
            this.translation.xyz[0],
            this.translation.xyz[1],
            this.translation.xyz[2],
            1,
        ]);
    }
}
