import { Matrix3 } from "./matrix.js";
export class WasmMat3f32 extends Matrix3 {
    constructor() {
        super();
        this.data = new Float32Array(3 * 3);
    }
    static zero() {
        return new WasmMat3f32();
    }
    static identity() {
        const x = WasmMat3f32.zero();
        x.set_identity();
        return x;
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
export class WasmMat3f64 extends Matrix3 {
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
