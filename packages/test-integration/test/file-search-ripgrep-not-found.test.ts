import { expect, test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test.skip('ripgrep not found', async () => {
  process.env.RIP_GREP_PATH = '/test/not-found'
  const { testDir, rpc, setFiles } = await setup()

  await setFiles({
    'index.ts': 'let x = 1',
  })

  const result = await rpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files'],
  })

  expect(result).toBe('index.ts')
  // TODO maybe throw error
})
