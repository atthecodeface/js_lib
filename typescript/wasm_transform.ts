import { WasmQuatf32 } from "./wasm_quat.js";
import { Transform } from "./quaternion.js";

class WasmTransformBase {
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
  set_q(q: WasmQuatf32) {
    q._set_quaternion(this.transform.quat);
  }
  set_mat4(mat: Float32Array) {
    this.transform.set_mat4(mat);
  }
}

export class WasmTransformf32 extends WasmTransformBase {}
export class WasmTransformf64 extends WasmTransformBase {}
