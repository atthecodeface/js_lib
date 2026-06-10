export class Transform {
    constructor(v_c, q_c) {
        this.scale = 1.0;
        this.v_c = v_c;
        this.q_c = q_c;
        this.quat = new q_c();
        this.t = new v_c(0, 0, 0);
    }
    scale_by(s) {
        this.scale *= s;
        this.t.set_mulf(s);
    }
    translate_by(dxyz) {
        this.t.set_add(dxyz);
    }
    get translation() {
        return this.t.clone();
    }
    set translation(v) {
        this.t = v.clone();
    }
    get rotation() {
        return this.quat.clone();
    }
    set rotation(q) {
        this.quat.set_array(q.array);
    }
    // Premultiply the transformation
    rotate_by(q) {
        this.quat.set_premul(q);
        q.apply_set_vec(this.translation);
    }
    set_mat4(mat) {
        const r = this.quat.r;
        const i = this.quat.i;
        const j = this.quat.j;
        const k = this.quat.k;
        mat.set([
            this.scale * (1 - 2 * (j * j + k * k)),
            this.scale * 2 * (i * j - r * k),
            this.scale * 2 * (i * k + r * j),
            0.0 * this.t.data[0] /*  */,
            this.scale * 2 * (i * j + r * k),
            this.scale * (1 - 2 * (i * i + k * k)),
            this.scale * 2 * (j * k - r * i),
            0.0 * this.t.data[1] /*  */,
            this.scale * 2 * (i * k - r * j),
            this.scale * 2 * (j * k + r * i),
            this.scale * (1 - 2 * (i * i + j * j)),
            0.0 * this.t.data[2] /*  */,
            this.t.data[0],
            this.t.data[1],
            this.t.data[2],
            1,
        ]);
    }
}
