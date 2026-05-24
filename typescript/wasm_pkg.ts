export class WasmBezier3f32 {
  set_vec_control_pt(_vec: WasmVec3f32, _index: number): void {}
}

export class WasmVec3f32 {
  // @ts-ignore
  array: ArrayLike<number>;
  // @ts-ignore
  buffer: number;
  private v: Vec3;
  constructor(x: number, y: number, z: number) {
    this.v = new Vec3(x, y, z);
  }
  static zero(): WasmVec3f32 {
    return new WasmVec3f32(0, 0, 0);
  }
  add(other: WasmVec3f32): WasmVec3f32 {
    const r = new WasmVec3f32(0, 0, 0);
    r.v.add_assign(other.v.xyz);
    return r;
  }
  _v(): Vec3 {
    return this.v;
  }
}

export class WasmVec3f64 {
  // @ts-ignore
  array: ArrayLike<number>;
  // @ts-ignore
  buffer: number;
  private v: Vec3;
  constructor(x: number, y: number, z: number) {
    this.v = new Vec3(x, y, z);
  }
  static zero(): WasmVec3f64 {
    return new WasmVec3f64(0, 0, 0);
  }
  add(other: WasmVec3f64): WasmVec3f64 {
    const r = new WasmVec3f64(0, 0, 0);
    r.v.add_assign(other.v.xyz);
    return r;
  }
  _v(): Vec3 {
    return this.v;
  }
}

export class WasmQuatf32 {
  private q: Quaternion;

  constructor(
    i: number,
    j: number,
    k: number,
    r: number,
    q: Quaternion | null = null,
  ) {
    if (q !== null) {
      this.q = q;
    } else {
      this.q = Quaternion.of_rijk([r, i, j, k]);
    }
  }
  static unit(): WasmQuatf32 {
    return new WasmQuatf32(0, 0, 0, 1);
  }
  static of_axis_angle(axis: WasmVec3f32, angle: number): WasmQuatf32 {
    return new WasmQuatf32(
      0,
      0,
      0,
      0,
      Quaternion.of_axis_angle(axis._v(), angle),
    );
  }
  conjugate(): WasmQuatf32 {
    return new WasmQuatf32(0, 0, 0, 0, this.q.clone_conjugate());
  }

  set(i: number, j: number, k: number, r: number) {
    this.q = Quaternion.of_rijk([r, i, j, k]);
  }
  mul(other: WasmQuatf32): WasmQuatf32 {
    return new WasmQuatf32(0, 0, 0, 0, this.q.clone().mul_assign_q(other.q));
  }
  div(other: WasmQuatf32): WasmQuatf32 {
    return new WasmQuatf32(
      0,
      0,
      0,
      0,
      this.q.clone().mul_assign_q(other.q.clone_conjugate()),
    );
  }
  _quaternion(): Quaternion {
    return this.q;
  }
}

export class WasmTransformf32 {
  private transform: Transform;
  constructor() {
    this.transform = new Transform();
  }
  rotate_by(q: WasmQuatf32) {
    this.transform.rotate_by(q._quaternion());
  }
  scale_by(s: number) {
    this.transform.scale_by(s);
  }
  translate_by(dxyz: [number, number, number]) {
    this.transform.translate_by(dxyz);
  }

  set_mat4(mat: Float32Array) {
    this.transform.set_mat4(mat);
  }
}

class Vec3 {
  xyz: [number, number, number];
  constructor(x: number, y: number, z: number) {
    this.xyz = [x, y, z];
  }
  mul_assign_f(s: number): Vec3 {
    this.xyz[0] *= s;
    this.xyz[1] *= s;
    this.xyz[2] *= s;
    return this;
  }
  mul_assign_q(q: Quaternion): Vec3 {
    const vq = Quaternion.of_rijk([0, this.xyz[0], this.xyz[1], this.xyz[2]]);
    const r = q.clone().mul_assign_q(vq).mul_assign_q(q.clone_conjugate());
    this.xyz = [r.rijk[1], r.rijk[2], r.rijk[3]];
    return this;
  }
  add_assign(dxyz: [number, number, number]): Vec3 {
    this.xyz[0] += dxyz[0];
    this.xyz[1] += dxyz[1];
    this.xyz[2] += dxyz[2];
    return this;
  }
}

class Quaternion {
  rijk: [number, number, number, number];
  constructor() {
    this.rijk = [1, 0, 0, 0];
  }
  r(): number {
    return this.rijk[0];
  }
  i(): number {
    return this.rijk[1];
  }
  j(): number {
    return this.rijk[2];
  }
  k(): number {
    return this.rijk[3];
  }

  static of_axis_angle(axis: Vec3, angle: number): Quaternion {
    const r = Math.cos(angle / 2);
    const s = Math.sin(angle / 2);

    return Quaternion.of_rijk([
      r,
      s * axis.xyz[0],
      s * axis.xyz[1],
      s * axis.xyz[2],
    ]);
  }

  static of_rijk(rijk: [number, number, number, number]): Quaternion {
    const q = new Quaternion();
    q.rijk = [rijk[0], rijk[1], rijk[2], rijk[3]];
    return q;
  }

  normalize(): Quaternion {
    const dsq =
      this.rijk[0] * this.rijk[0] +
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

  clone(): Quaternion {
    const q = new Quaternion();
    q.rijk = [this.rijk[0], this.rijk[1], this.rijk[2], this.rijk[3]];
    return q;
  }

  clone_conjugate(): Quaternion {
    const q = new Quaternion();
    q.rijk = [this.rijk[0], -this.rijk[1], -this.rijk[2], -this.rijk[3]];
    return q;
  }

  mul_assign_q(q: Quaternion): Quaternion {
    const r =
      this.rijk[0] * q.rijk[0] -
      this.rijk[1] * q.rijk[1] -
      this.rijk[2] * q.rijk[2] -
      this.rijk[3] * q.rijk[3];
    const i =
      this.rijk[0] * q.rijk[1] +
      this.rijk[1] * q.rijk[0] +
      this.rijk[2] * q.rijk[3] -
      this.rijk[3] * q.rijk[2];
    const j =
      this.rijk[0] * q.rijk[2] +
      this.rijk[2] * q.rijk[0] +
      this.rijk[3] * q.rijk[1] -
      this.rijk[1] * q.rijk[3];
    const k =
      this.rijk[0] * q.rijk[3] +
      this.rijk[3] * q.rijk[0] +
      this.rijk[1] * q.rijk[2] -
      this.rijk[2] * q.rijk[1];
    this.rijk = [r, i, j, k];
    return this;
  }
}

class Transform {
  scale: number = 1.0;
  quat: Quaternion;
  translation: Vec3;
  constructor() {
    this.quat = new Quaternion();
    this.translation = new Vec3(0, 0, 0);
  }
  scale_by(s: number) {
    this.scale *= s;
    this.translation.mul_assign_f(s);
  }
  translate_by(dxyz: [number, number, number]) {
    this.translation.add_assign(dxyz);
  }
  rotate_by(q: Quaternion) {
    // this.quat = q.clone().mul_assign_q(this.quat);
    this.quat.mul_assign_q(q);
    // this.translation.mul_assign_q(q);
  }

  set_mat4(mat: Float32Array) {
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
