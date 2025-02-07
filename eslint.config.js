import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedNode,
  {
    files: ['**/*.ts'],
    rules: {
      'no-console': 'off',
      'n/no-unsupported-features/es-syntax': 'off',
    },
  },
]
