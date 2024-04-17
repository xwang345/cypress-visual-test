module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'babel-jest',
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
      isolatedModules: true
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!@angular|@ngx-translate)'
  ]
};