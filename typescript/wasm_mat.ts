import { Matrix3 } from "./matrix.js";
//import { Matrix2, Matrix3, Matrix4 } from "./matrix.js";
import { WasmVec, WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";

interface WasmMat<A, V extends WasmVec<A>> {
  // static zero(): this;
  // static idemtity(): this;
  // static from_array(f: Float32Array): this;
  // static identity(): this;
  // static look_at(eye: WasmVec3f32, center: WasmVec3f32, up: WasmVec3f32): WasmMat4f32;
  // static perspective(fov: number, aspect: number, near: number, far: number): WasmMat4f32;

  clone(): this;

  // readonly array: Float32Array;
  // readonly buffer: number;
  get is_zero(): boolean;

  determinant(): number;

  invert(): boolean; // change wasm to return boolean
  transpose(): void;
  set_identity(): void;
  set_transpose(other: this): void;
  set_inverse(other: this): boolean;
  set_array(array: A): void; // should be A
  get array(): A;

  set_neg(): void;
  set_add(other: this): void;
  set_sub(other: this): void;
  set_mul(other: this): void; // Add this to wasm
  set_mulf(scale: number): void;
  set_divf(scale: number): void;

  mul_set_vec(v: V): void;
  mul_vec(v: V): V;

  // inverse(): WasmMat4f32;
  // transposed(): WasmMat4f32;
  // add(other: WasmMat4f32): WasmMat4f32;
  // sub(other: WasmMat4f32): WasmMat4f32;
  // mul(other: WasmMat4f32): WasmMat4f32;
  // mulf(f: number): WasmMat4f32;
  // divf(f: number): WasmMat4f32;
  /*
set_look_at(eye: WasmVec3f32, center: WasmVec3f32, up: WasmVec3f32): void;
set_perspective(fov: number, aspect: number, near: number, far: number): void;
set_scale3(by: number): void;
set_translate_by_vec3(by: WasmVec3f32): void;
set_translate_by_vec4(by: WasmVec4f32): void;

*/
}
export interface WasmMat4<
  A,
  V3 extends WasmVec<A>,
  V4 extends WasmVec<A>,
> extends WasmMat<A, V4> {
  set_look_at(eye: V3, center: V3, up: V3): void;
  set_perspective(fov: number, aspect: number, near: number, far: number): void;
  set_scale3(by: number): void;
  set_translate_by_vec3(by: V3): void;
  set_translate_by_vec4(by: V4): void;
}

export class WasmMat3f32
  extends Matrix3<Float32Array, WasmVec3f32>
  implements WasmMat<Float32Array, WasmVec3f32>
{
  constructor() {
    super();
    this.data = new Float32Array(3 * 3);
  }
}

/*
export class WasmMat4f32
  extends Matrix4<Float32Array>
  implements WasmMat<Float32Array, WasmVec4f32>
{
  constructor() {
    super();
    this.data = new Float32Array(4 * 4);
  }
}
*/
/*
export class WasmMat2f64
  extends Matrix2<Float64Array>
  implements WasmMat<Float64Array, WasmVec2f64>
{
  constructor() {
    super();
    this.data = new Float64Array(2 * 2);
  }
}
 */
export class WasmMat3f64
  extends Matrix3<Float64Array, WasmVec3f64>
  implements WasmMat<Float64Array, WasmVec3f64>
{
  constructor() {
    super();
    this.data = new Float64Array(3 * 3);
  }
}

/*
export class WasmMat4f64
  extends Matrix4<Float64Array>
  implements WasmMat<Float64Array, WasmVec4f64>
{
  constructor() {
    super();
    this.data = new Float64Array(4 * 4);
  }
}
 */
