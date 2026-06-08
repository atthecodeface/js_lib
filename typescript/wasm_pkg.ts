export { WasmVec3f32, WasmVec3f64 } from "./wasm_vec.js";
export { WasmQuatf32, WasmQuatf64 } from "./wasm_quat.js";
export { WasmTransformf32, WasmTransformf64 } from "./wasm_transform.js";

export { WasmBezier3f32, WasmBezier3f64 } from "./wasm_bezier.js";

export class TestSuite {
  tests: Test[] = [];
  consrtuctor() {}
  get_tests(): Test[] {
    return this.tests;
  }
  find_tests(): Test[] {
    const r = [];
    for (const x of Object.getOwnPropertyNames((this as any).__proto__)) {
      if (x.startsWith("test_")) {
        const test_name = x.slice(5);
        r.push(new Test(test_name, (this as any)[x]));
      }
    }
    this.tests = r;
    return r;
  }
}

export class Test {
  name: string;
  invocation: (expect: (e: any) => TestExpectation) => void;
  errors: string[] = [];
  static current_test: Test | null = null;
  constructor(
    name: string,
    invocation: (expect: (e: any) => TestExpectation) => void,
  ) {
    this.name = name;
    this.invocation = invocation;
  }
  invoke(): void {
    console.log(`Starting test ${this.name}`);
    Test.current_test = this;
    this.invocation((v) => new TestExpectation(v));
    console.log(this.errors);
    console.log(`Completed test ${this.name}`);
  }
  expect_to_be(e: TestExpectation, r: any): void {
    if (e.v != r) {
      this.errors.push(`Fail: ${e.v} expected to be ${r}`);
    }
  }
  expect_to_be_close_to(e: TestExpectation, r: number, digits: number): void {
    if (Math.abs(e.v - r) > Math.pow(0.1, digits)) {
      this.errors.push(
        `Fail: ${e.v} not close enough to ${r} (${digits} digits)`,
      );
    }
  }
}

export function test(name: string, invocation: () => void): Test {
  return new Test(name, invocation);
}
export function expect(v: any): TestExpectation {
  return new TestExpectation(v);
}
export class TestExpectation {
  v: any;
  constructor(v: any) {
    this.v = v;
  }
  toBe(r: any): void {
    Test.current_test!.expect_to_be(this, r);
  }
  toBeCloseTo(r: number, digits: number): void {
    Test.current_test!.expect_to_be_close_to(this, r, digits);
  }
}
