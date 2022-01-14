module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/*.ts',
    'src/middlewares/*.ts',
    'src/models/*.ts}',
    'src/scripts/*.ts',
    'src/services/*.ts',
    'src/utils/*.ts',
    '!src/utils/logger.ts'
  ],
  clearMocks: true
}
