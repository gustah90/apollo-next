/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('jest').Config} */
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  transformIgnorePatterns: ['node_modules/(?!@azure/msal-react)', 'node_modules/(?!(antd)/)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '@azure/msal-react': '<rootDir>/mocked/module.js',
  },
}
const asyncConfig = createJestConfig(customJestConfig)

// and wrap it...
module.exports = async () => {
  const config = await asyncConfig()
  config.transformIgnorePatterns = [
    // ...your ignore patterns
  ]
  return config
}
