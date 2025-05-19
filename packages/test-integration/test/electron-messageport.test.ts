import { expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { setup } from '../src/setup.ts'
import { createRequire } from 'node:module'

test('search process works with electron messageport', async () => {
  if (process.platform === 'linux') {
    // TODO
    return
  }
  const { testDir, setFiles, root } = await setup()
  await setFiles({
    'index.ts': 'let x = 1',
  })
  const fixturePath = join(root, 'packages', 'test-integration', 'fixtures', 'electron-message-port')
  const require = createRequire(import.meta.url)
  const electronModulePath = require.resolve('electron')
  const electronModule = await import(electronModulePath)
  const electronPath = electronModule.default
  const child = spawn(electronPath, ['--no-sandbox', fixturePath, `--test-dir`, testDir], {
    stdio: 'inherit',
  })
  const { resolve, promise } = Promise.withResolvers<number>()
  child.on('exit', resolve)
  const code = await promise
  expect(code).toBe(0)
}, 30_000)
