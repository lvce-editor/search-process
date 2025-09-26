import { expect, test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test('text search', async () => {
  const { testDir, rpc, setFiles } = await setup({})
  await setFiles({
    'index.ts': 'let x = 1',
  })
  const id = '1'
  const result = await rpc.invoke('TextSearch.search', {
    id,
    searchDir: testDir,
    maxSearchResults: 100,
    ripGrepArgs: [
      '--hidden',
      '--no-require-git',
      '--smart-case',
      '--stats',
      '--json',
      '--threads',
      '1',
      '--ignore-case',
      '--fixed-strings',
      '--',
      'x',
      '.',
    ],
  })
  expect(result).toEqual({
    limitHit: false,
    stats: expect.anything(),
    results: [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: 'index.ts',
        type: 1,
      },
      {
        end: 5,
        lineNumber: 1,
        start: 4,
        text: 'let x = 1',
        type: 2,
      },
    ],
  })
})
