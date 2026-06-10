import { WasmVec3, WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";
import { WasmQuat, WasmQuatf32, WasmQuatf64 } from "./wasm_quat.js";
import { Transform } from "./transform.js";
import { LocalArrayType } from "./test_utils.js";

class WasmTransformBase<
  A extends LocalArrayType,
  V extends WasmVec3<A>,
  Q extends WasmQuat<A, V>,
> extends Transform<A, V, Q> {}

export class WasmTransformf32 extends WasmTransformBase<
  Float32Array,
  WasmVec3f32,
  WasmQuatf32
> {
  constructor() {
    super(WasmVec3f32, WasmQuatf32);
  }
}

export class WasmTransformf64 extends WasmTransformBase<
  Float64Array,
  WasmVec3f64,
  WasmQuatf64
> {
  constructor() {
    super(WasmVec3f64, WasmQuatf64);
  }
}
