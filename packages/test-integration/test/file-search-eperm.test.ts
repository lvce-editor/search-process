import { expect, test } from '@jest/globals'
import { join } from 'node:path'
import { root, setup } from '../src/setup.ts'

test.skip('search file handles ripgrep permission error', async () => {
  const fixturePath = join(root, 'packages', 'test-integration', 'fixtures', 'permission-error', 'ripgrep-eperm.js')
  const { testDir, rpc, setFiles } = await setup({
    env: {
      ...process.env,
      RIP_GREP_PATH: fixturePath,
    },
  })
  await setFiles({
    'index.ts': 'let x = 1',
  })
  const result = await rpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files'],
  })

  expect(result).toBe('')
}, 20_000)
