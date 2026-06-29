/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          module: "commonjs",
          target: "ES2022",
          moduleResolution: "node",
          allowImportingTsExtensions: false,
          verbatimModuleSyntax: false,
          noEmit: false,
          types: ["jest"],
          paths: {
            "@/*": ["./src/*"],
          },
        },
      },
    ],
  },
  testMatch: ["**/tests/**/*.test.{ts,tsx}"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/models/**/*.ts",
    "src/services/**/*.ts",
    "src/view-models/**/*.ts",
    "src/hooks/**/*.ts",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      lines: 75,
      functions: 75,
      branches: 75,
      statements: 75,
    },
  },
};
