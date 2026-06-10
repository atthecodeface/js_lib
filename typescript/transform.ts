import { LocalArrayType } from "./test_utils.js";
import { WasmVec3 } from "./wasm_vec.js";
import { WasmQuat } from "./wasm_quat.js";

export class Transform<
  A extends LocalArrayType,
  V extends WasmVec3<A>,
  Q extends WasmQuat<A, V>,
> {
  scale: number = 1.0;
  quat: Q;
  t: V;
  q_c: new () => Q;
  v_c: new (x: number, y: number, z: number) => V;
  constructor(
    v_c: new (x: number, y: number, z: number) => V,
    q_c: new () => Q,
  ) {
    this.v_c = v_c;
    this.q_c = q_c;
    this.quat = new q_c();
    this.t = new v_c(0, 0, 0);
  }

  scale_by(s: number) {
    this.scale *= s;
    this.t.set_mulf(s);
  }

  translate_by(dxyz: V) {
    this.t.set_add(dxyz);
  }

  get translation(): V {
    return this.t.clone();
  }

  set translation(v: V) {
    this.t = v.clone();
  }

  get rotation(): Q {
    return this.quat.clone();
  }

  set rotation(q: Q) {
    this.quat.set_array(q.array);
  }

  // Premultiply the transformation
  rotate_by(q: Q) {
    this.quat.set_premul(q);
    q.apply_set_vec(this.translation);
  }

  set_mat4(mat: A) {
    const r = this.quat.r;
    const i = this.quat.i;
    const j = this.quat.j;
    const k = this.quat.k;
    mat.set([
      this.scale * (1 - 2 * (j * j + k * k)),
      this.scale * 2 * (i * j - r * k),
      this.scale * 2 * (i * k + r * j),
      0.0 * this.t.data[0]! /*  */,

      this.scale * 2 * (i * j + r * k),
      this.scale * (1 - 2 * (i * i + k * k)),
      this.scale * 2 * (j * k - r * i),
      0.0 * this.t.data[1]! /*  */,

      this.scale * 2 * (i * k - r * j),
      this.scale * 2 * (j * k + r * i),
      this.scale * (1 - 2 * (i * i + j * j)),
      0.0 * this.t.data[2]! /*  */,

      this.t.data[0]!,
      this.t.data[1]!,
      this.t.data[2]!,
      1,
    ]);
  }
}
