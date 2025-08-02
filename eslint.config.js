import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedNode,
  {
    files: ['**/*.ts'],
    rules: {
      'n/no-unsupported-features/es-syntax': 'off',
      'unicorn/prefer-single-call': 'off',
      'jest/no-restricted-jest-methods': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['**/Logger.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
]
