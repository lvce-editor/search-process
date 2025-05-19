import { expect, test } from '@jest/globals'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { setup } from '../src/setup.ts'

test.skip('search process works with electron messageport', async () => {
  const { testDir, setFiles, root } = await setup()
  await setFiles({
    'index.ts': 'let x = 1',
  })
  const fixturePath = join(root, 'packages', 'test-integration', 'fixtures', 'electron-message-port')
  const child = spawn('electron', ['--no-sandbox', fixturePath, `--test-dir`, testDir], {
    stdio: 'inherit',
  })
  const { resolve, promise } = Promise.withResolvers<number>()
  child.on('exit', resolve)
  const code = await promise
  expect(code).toBe(0)
}, 30_000)
