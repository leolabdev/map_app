import { defaults } from 'jest-config'

const root = '<rootDir>'
const codeDir = `${root}/server/util`;
const testDir = `${root}/server/test/util`;

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
    ]
}

export default config;