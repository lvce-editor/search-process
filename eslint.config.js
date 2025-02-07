import * as config from '@lvce-editor/eslint-config'

export default [
  ...config.default,
  ...config.recommendedNode,
  {
    ignores: ['scripts', 'rollup.config.js', 'eslint.config.js', 'packages/build'],
  },
  {
    files: ['**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
]
