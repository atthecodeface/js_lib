"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmMemory = void 0;
class WasmMemory {
    constructor(memory) {
        this.memory = memory;
        this.memory_view = new DataView(this.memory.buffer);
    }
    refresh_view() {
        this.memory_view = new DataView(this.memory.buffer);
    }
    float64_array(ptr, num_floats) {
        return new Float64Array(this.memory.buffer, ptr, num_floats);
    }
    float_array_of_vec3f64(vec) {
        return this.float64_array(vec.buffer, 3);
    }
    float32_array(ptr, num_floats) {
        return new Float32Array(this.memory.buffer, ptr, num_floats);
    }
    float_array_of_vec3f32(vec) {
        return this.float32_array(vec.buffer, 3);
    }
}
exports.WasmMemory = WasmMemory;
//# sourceMappingURL=wasm_memory.js.map