// jest.config.mjs
export default {
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 100,
      statements: 95,
    },
  },
};
