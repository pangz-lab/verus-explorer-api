module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
};