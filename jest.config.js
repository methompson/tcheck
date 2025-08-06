/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: 'node',
  testMatch: ['**/*.test.(t|j)s', '**/*.spec.(t|j)s'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+.(t|j)sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json',
  //   },
  // },
};
