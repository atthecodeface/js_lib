"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestExpectation = exports.Test = exports.TestSuite = exports.WasmBezier3f64 = exports.WasmBezier3f32 = exports.WasmTransformf64 = exports.WasmTransformf32 = exports.WasmQuatf64 = exports.WasmQuatf32 = exports.WasmVec3f64 = exports.WasmVec3f32 = void 0;
exports.test = test;
exports.expect = expect;
var wasm_vec_js_1 = require("./wasm_vec.js");
Object.defineProperty(exports, "WasmVec3f32", { enumerable: true, get: function () { return wasm_vec_js_1.WasmVec3f32; } });
Object.defineProperty(exports, "WasmVec3f64", { enumerable: true, get: function () { return wasm_vec_js_1.WasmVec3f64; } });
var wasm_quat_js_1 = require("./wasm_quat.js");
Object.defineProperty(exports, "WasmQuatf32", { enumerable: true, get: function () { return wasm_quat_js_1.WasmQuatf32; } });
Object.defineProperty(exports, "WasmQuatf64", { enumerable: true, get: function () { return wasm_quat_js_1.WasmQuatf64; } });
var wasm_transform_js_1 = require("./wasm_transform.js");
Object.defineProperty(exports, "WasmTransformf32", { enumerable: true, get: function () { return wasm_transform_js_1.WasmTransformf32; } });
Object.defineProperty(exports, "WasmTransformf64", { enumerable: true, get: function () { return wasm_transform_js_1.WasmTransformf64; } });
var wasm_bezier_js_1 = require("./wasm_bezier.js");
Object.defineProperty(exports, "WasmBezier3f32", { enumerable: true, get: function () { return wasm_bezier_js_1.WasmBezier3f32; } });
Object.defineProperty(exports, "WasmBezier3f64", { enumerable: true, get: function () { return wasm_bezier_js_1.WasmBezier3f64; } });
class TestSuite {
    constructor() {
        this.tests = [];
    }
    consrtuctor() { }
    get_tests() {
        return this.tests;
    }
    find_tests() {
        const r = [];
        for (const x of Object.getOwnPropertyNames(this.__proto__)) {
            if (x.startsWith("test_")) {
                const test_name = x.slice(5);
                r.push(new Test(test_name, this[x]));
            }
        }
        this.tests = r;
        return r;
    }
}
exports.TestSuite = TestSuite;
class Test {
    constructor(name, invocation) {
        this.errors = [];
        this.name = name;
        this.invocation = invocation;
    }
    invoke() {
        console.log(`Starting test ${this.name}`);
        Test.current_test = this;
        this.invocation((v) => new TestExpectation(v));
        console.log(this.errors);
        console.log(`Completed test ${this.name}`);
    }
    expect_to_be(e, r) {
        if (e.v != r) {
            this.errors.push(`Fail: ${e.v} expected to be ${r}`);
        }
    }
    expect_to_be_close_to(e, r, digits) {
        if (Math.abs(e.v - r) > Math.pow(0.1, digits)) {
            this.errors.push(`Fail: ${e.v} not close enough to ${r} (${digits} digits)`);
        }
    }
}
exports.Test = Test;
Test.current_test = null;
function test(name, invocation) {
    return new Test(name, invocation);
}
function expect(v) {
    return new TestExpectation(v);
}
class TestExpectation {
    constructor(v) {
        this.v = v;
    }
    toBe(r) {
        Test.current_test.expect_to_be(this, r);
    }
    toBeCloseTo(r, digits) {
        Test.current_test.expect_to_be_close_to(this, r, digits);
    }
}
exports.TestExpectation = TestExpectation;
//# sourceMappingURL=wasm_pkg.js.map