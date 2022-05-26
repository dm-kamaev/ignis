/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  // testEnvironment: 'jsdom',
  testEnvironment: './test/testEnvironment.js',
  // transformIgnorePatterns: ['^.+\\.js$'],
  bail: 1,
  verbose: true,
  // automock: false,
  // setupFilesAfterEnv: ['./test/jest-setup.ts'],
};
