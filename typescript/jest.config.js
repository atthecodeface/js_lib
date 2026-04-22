const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  /* This maps import 'module.js' to import 'module' which works with jest */
  moduleNameMapper: {
    "(.+)\\.js": "$1",
  },
};
