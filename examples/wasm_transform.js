import { WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";
import { WasmQuatf32, WasmQuatf64 } from "./wasm_quat.js";
import { Transform } from "./transform.js";
class WasmTransformBase extends Transform {
}
export class WasmTransformf32 extends WasmTransformBase {
    constructor() {
        super(WasmVec3f32, WasmQuatf32);
    }
}
export class WasmTransformf64 extends WasmTransformBase {
    constructor() {
        super(WasmVec3f64, WasmQuatf64);
    }
}
