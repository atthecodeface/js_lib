import { QuatTestSuite } from "./wasm_pkg_quat_test_suite.js";
import { VecTestSuite } from "./wasm_pkg_vec_test_suite.js";

describe.each([0, 1, 2, 3, 4, 5, 6, 7, 8])("Quaternions", (test_num) => {
  test(`${test_num}`, () => {
    const test = new QuatTestSuite().find_tests()[test_num];
    test.invocation(expect);
  });
});

describe.each([0, 1, 2, 3])("Vectors", (test_num) => {
  test(`${test_num}`, () => {
    const test = new VecTestSuite().find_tests()[test_num];
    test.invocation(expect);
  });
});
