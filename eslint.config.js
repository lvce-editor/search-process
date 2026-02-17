import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'

export default [
  ...config.default,
  ...config.recommendedNode,
  ...actions.default,
  {
    files: ['**/*.ts'],
    rules: {
      'unicorn/prefer-single-call': 'off',
      'jest/no-restricted-jest-methods': 'off',
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
      '@cspell/spellchecker': 'off',
    },
  },
]
