"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestExpectation = exports.Test = exports.TestSuite = void 0;
exports.test = test;
exports.expect = expect;
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
//# sourceMappingURL=test_suite.js.map