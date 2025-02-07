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
      // 'n/no-unsupported-features/node-builtins': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
    },
  },
]
