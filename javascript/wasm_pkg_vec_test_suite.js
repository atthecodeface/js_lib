"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.VecTestSuite = void 0;
const wasm_pkg = __importStar(require("./wasm_pkg.js"));
class VecTestSuite extends wasm_pkg.TestSuite {
    test_vec_1(expect) {
        // test clone, length, length_sq, dot, set_add, is_zero, set_neg
        const v0 = new wasm_pkg.WasmVec3f32(3, 4, 12);
        const v1 = new wasm_pkg.WasmVec3f32(1, 2, 3);
        expect(v0.length_sq).toBe(169);
        expect(v0.length).toBe(13);
        const v0_2 = v0.clone();
        expect(v0_2.length_sq).toBe(169);
        expect(v0_2.length).toBe(13);
        expect(v0_2 instanceof wasm_pkg.WasmVec3f32).toBe(true);
        expect(v0_2 instanceof wasm_pkg.WasmVec3f64).toBe(false);
        expect(v0_2.is_zero).toBe(false);
        v0_2.set_neg();
        expect(v0_2.length_sq).toBe(169);
        expect(v0_2.length).toBe(13);
        v0_2.set_add(v0);
        expect(v0_2.length_sq).toBe(0);
        expect(v0_2.length).toBe(0);
        expect(v0_2.is_zero).toBe(true);
        v0_2.set_add(v0);
        expect(v0_2.length_sq).toBe(169);
        expect(v0_2.dot(v1)).toBe(3 * 1 + 4 * 2 + 3 * 12);
    }
    test_vec_2(expect) {
        // test WasmVec3f32 != WasmVec3f64
        const v0 = new wasm_pkg.WasmVec3f64(3, 4, 12);
        expect(v0 instanceof wasm_pkg.WasmVec3f64).toBe(true);
        expect(v0 instanceof wasm_pkg.WasmVec3f32).toBe(false);
        expect(v0.length_sq).toBe(169);
        expect(v0.length).toBe(13);
        const v0_2 = v0.clone();
        expect(v0_2.length_sq).toBe(169);
        expect(v0_2.length).toBe(13);
        expect(v0_2 instanceof wasm_pkg.WasmVec3f64).toBe(true);
        expect(v0_2 instanceof wasm_pkg.WasmVec3f32).toBe(false);
    }
    test_vec_3(expect) {
        // test set_zero, set_normalized, set_sub, set_mulf, set_divf, array
        const v0 = new wasm_pkg.WasmVec3f64(3, 4, 12);
        const v1 = new wasm_pkg.WasmVec3f64(1, 2, 3);
        const v2 = new wasm_pkg.WasmVec3f64(5, 6, 7);
        // Set v2 to be zero and check it did not change anything else
        v2.set_zero();
        expect(v2.length_sq).toBe(0);
        expect(v0.length_sq).toBe(169);
        expect(v0.dot(v1)).toBe(3 * 1 + 4 * 2 + 3 * 12);
        v2.set_add(v0);
        expect(v2.length_sq).toBe(169);
        v2.set_normalized();
        // length_sq is a + epsilon...
        expect(v2.length).toBe(1);
        expect(v2.length_sq).toBeCloseTo(1, 6);
        {
            const v2_f = v2.array;
            expect(v2_f[0] * 13).toBeCloseTo(3, 6);
            expect(v2_f[1] * 13).toBeCloseTo(4, 6);
            expect(v2_f[2] * 13).toBeCloseTo(12, 6);
        }
        v2.set_mulf(13);
        expect(v2.length_sq).toBe(169);
        v2.set_divf(13);
        expect(v2.length_sq).toBeCloseTo(1, 6);
        v2.set_mulf(13);
        v2.set_sub(v1);
        {
            const v2_f = v2.array;
            expect(v2_f[0]).toBeCloseTo(2, 6);
            expect(v2_f[1]).toBeCloseTo(2, 6);
            expect(v2_f[2]).toBeCloseTo(9, 6);
        }
    }
    test_vec_4(expect) {
        // test distance_sq, distance, mix
        const v0 = new wasm_pkg.WasmVec3f64(3, 4, 12);
        const v1 = new wasm_pkg.WasmVec3f64(1, 2, 3);
        const v2 = v1.clone();
        // v2 = v0 + v1
        v2.set_add(v0);
        expect(v2.distance(v1)).toBe(13);
        expect(v2.distance_sq(v1)).toBe(169);
        // v3 = 3/4*v1 + 1/4*v0
        const v3 = v1.mix(v0, 0.25);
        // v2 =
        v3.set_mulf(4);
        v3.set_sub(v1);
        v3.set_sub(v1);
        // v3 = v1 + v0
        expect(v3.distance(v1)).toBe(13);
        expect(v3.distance_sq(v1)).toBe(169);
        // v2 = v0/4 + v1/4 + 3v1/4 = v0/4 + v1
        v2.set_mix(v1, 0.75);
        expect(v2.distance(v1)).toBe(13 / 4.0);
        expect(v2.distance_sq(v1)).toBe(169 / 16.0);
    }
}
exports.VecTestSuite = VecTestSuite;
//# sourceMappingURL=wasm_pkg_vec_test_suite.js.map