/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: true,
          },
          transform: {
            '^.+\\.(ts|tsx)$': 'babel-jest',
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/tests/**/*.spec.{js,jsx,ts,tsx}',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/cypress/', '/.next/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/types.ts',

    '!src/**/?(*.)+(test|spec).{ts,tsx}',
    '!src/**/__tests__/**',

    '!src/components/ui/**',

    '!src/app/**/layout.tsx',
    '!src/app/**/loading.tsx',
    '!src/app/**/error.tsx',
    '!src/app/**/not-found.tsx',

    '!src/lib/utils.ts',
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/cypress/',
    '/.next/',
    '<rootDir>/src/components/ui/',
    'layout\\.tsx$',
    'loading\\.tsx$',
    'error\\.tsx$',
    'not-found\\.tsx$',
    '<rootDir>/src/lib/utils\\.ts$',
  ],
  coverageThreshold: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50,
    },
  },
}

module.exports = createJestConfig(config)
