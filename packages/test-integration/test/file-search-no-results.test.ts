import { expect, test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test('search file no results', async () => {
  const { testDir, rpc } = await setup()

  const result = await rpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files'],
  })

  expect(result).toBe('')
}, 20_000)
