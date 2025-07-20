
// jest.config.mjs
export default {
  transform: {},
  "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 100,
      statements: 95,
    },
  },
};
