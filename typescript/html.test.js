/**
 * @jest-environment jsdom
 */

const x = require("./html");
test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});
