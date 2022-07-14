/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom : [
    // 'src/**/*.ts'
    'src/**/{!(interface),}.ts',
  ],
  coveragePathIgnorePatterns: [
    'helper.ts',
  ],
  // transformIgnorePatterns: ['^.+\\.js$'],
  bail: 1,
  verbose: true,
  // automock: false,
  setupFilesAfterEnv: ['./jest-setup.ts'],
  coverageReporters: ['json-summary', 'json-summary', 'text', 'lcov']
};
