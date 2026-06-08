import { Transform } from "./quaternion.js";
class WasmTransformBase {
    constructor() {
        this.transform = new Transform();
    }
    rotate_by(q) {
        this.transform.rotate_by(q._quaternion());
    }
    scale_by(s) {
        this.transform.scale_by(s);
    }
    translate_by(dxyz) {
        this.transform.translate_by(dxyz);
    }
    set_q(q) {
        q._set_quaternion(this.transform.quat);
    }
    set_mat4(mat) {
        this.transform.set_mat4(mat);
    }
}
export class WasmTransformf32 extends WasmTransformBase {
}
export class WasmTransformf64 extends WasmTransformBase {
}
