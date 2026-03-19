module.exports = {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/src/__mocks__/react-router-dom.tsx',
  },

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
