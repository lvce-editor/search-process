import { expect, test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test('search file no results', async () => {
  const { testDir, rpc, setFiles } = await setup()

  await setFiles({
    'a.ts': 'let x = 1',
    'b.ts': 'let b = 1',
  })

  const result = await rpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files'],
  })

  expect(result).toBe('a.ts\nb.ts')
})
