import { expect, test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test.skip('search file io error', async () => {
  const { testDir, rpc } = await setup()

  const result = await rpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files', 'abc'],
  })

  expect(result).toBe('')
})
