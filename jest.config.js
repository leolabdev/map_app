import { defaults } from 'jest-config'

const root = '<rootDir>'
const codeDir = `${root}/server/util`;
const testDir = `${root}/server/test`;

/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',
    verbose: true,
    //Get test coverage
    // collectCoverage: true,
    // collectCoverageFrom: [
    //     `${codeDir}/**/*.ts`
    // ],

    //Run test from this folder(s) only
    testMatch: [
        `${testDir}/**/*.test.js`
    ],
    transform: {
      "^.+\\.[t|j]sx?$": "babel-jest"
    },
    setupFiles: [
      '<rootDir>/server/test/test_utils/env.js',
      '<rootDir>/server/test/test_utils/disable-console-log.js'
    ],
    setupFilesAfterEnv: [
      '<rootDir>/server/test/test_utils/connect-to-db.js'
    ]
}

export default config;