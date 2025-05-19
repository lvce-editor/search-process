import pluginTypeScript from '@babel/preset-typescript'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { join } from 'path'
import { rollup } from 'rollup'
import { root } from './root.js'
import { copyFileSync } from 'fs'
import { mkdir } from 'fs/promises'

/**
 * @type {import('rollup').RollupOptions}
 */
const options = {
  input: join(root, 'packages/search-process/src/searchProcessMain.ts'),
  preserveEntrySignatures: 'strict',
  treeshake: {
    propertyReadSideEffects: false,
  },
  output: {
    file: join(root, '.tmp/dist/dist/index.js'),
    format: 'es',
    freeze: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    inlineDynamicImports: true,
  },
  external: ['@lvce-editor/ripgrep', 'electron', 'execa', 'ws'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      presets: [pluginTypeScript],
    }),
    nodeResolve(),
  ],
}

export const bundleJs = async () => {
  const input = await rollup(options)
  // @ts-ignore
  await input.write(options.output)
  await mkdir(join(root, 'packages', 'search-process', 'dist'), { recursive: true })
  copyFileSync(join(root, '.tmp/dist/dist/index.js'), join(root, 'packages/search-process/dist/index.js'))
}
