import { Vec3 } from "./vector.js";
export class WasmVec3 extends Vec3 {
}
export class WasmVec3f32 extends WasmVec3 {
    constructor(x, y, z) {
        super();
        this.data = new Float32Array([x, y, z]);
    }
    static zero() {
        return new WasmVec3f32(0, 0, 0);
    }
}
export class WasmVec3f64 extends WasmVec3 {
    constructor(x, y, z) {
        super();
        this.data = new Float64Array([x, y, z]);
    }
    static zero() {
        return new WasmVec3f64(0, 0, 0);
    }
}
