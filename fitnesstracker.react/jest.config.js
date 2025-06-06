/** @type {import('jest').Config} */
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            diagnostics: {
                ignoreCodes: [1343]
            }
        }]
    }
};