module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/*.ts',
    '!src/graphql/*.ts',
    '!src/graphql/typedefs/*.graphql',
    '!src/graphql/resolvers/*.ts',
    '!src/graphql/resolvers/**/index.ts',
    '!src/utils/logger.ts'
  ]
}
