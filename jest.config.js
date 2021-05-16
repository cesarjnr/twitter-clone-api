module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/controllers/*.{ts,js}',
    'src/middlewares/*.{ts,js}',
    'src/models/*.{ts,js}',
    'src/scripts/*.{ts,js}',
    'src/services/*.{ts,js}'
  ],
  clearMocks: true
}
