/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.(t|j)s", "**/*.spec.(t|j)s"],
  transform: {
    "^.+.(t|j)sx?$": ["ts-jest", {}],
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};
