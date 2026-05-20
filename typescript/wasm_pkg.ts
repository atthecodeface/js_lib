// @ts-nocheck
export class WasmBezier3f32 {
  set_vec_control_pt(vec: WasmVec3f32, index: number): void {}
}

export class WasmVec3f32 {
  constructor(x: number, y: number, z: number) {}
  static zero(): WasmVec3f32 {}
  array: ArrayLike<number>;
  buffer: number;
}

export class WasmVec3f64 {
  constructor(x: number, y: number, z: number) {}
  static zero(): WasmVec3f32 {}
  array: ArrayLike<number>;
  buffer: number;
}
