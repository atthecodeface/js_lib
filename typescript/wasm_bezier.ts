import { WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";

class WasmBezierBase<V> {
  set_vec_control_pt(_vec: V, _index: number): void {}
}

export class WasmBezier3f32 extends WasmBezierBase<WasmVec3f32> {}

export class WasmBezier3f64 extends WasmBezierBase<WasmVec3f64> {}
