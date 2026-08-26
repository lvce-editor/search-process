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
        endColumnIndex: 5,
        lineNumber: 1,
        rowIndex: 0,
        start: 4,
        startColumnIndex: 4,
        text: 'let x = 1',
        type: 2,
      },
    ],
  })
})

test('text search left cuts result previews at a natural seam', async () => {
  const { testDir, rpc, setFiles } = await setup({})
  await setFiles({
    'ParseMemory.test.ts': `  expect(ParseMemory.parseMemory('41700 2023 1199 224 0 5027 0')).toBe(`,
  })
  const result = await rpc.invoke('TextSearch.search', {
    id: '1',
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
      '24',
      '.',
    ],
  })
  expect(result).toMatchObject({
    limitHit: false,
    results: [
      {
        text: 'ParseMemory.test.ts',
        type: 1,
      },
      {
        end: 35,
        endColumnIndex: 53,
        lineNumber: 1,
        rowIndex: 0,
        start: 33,
        startColumnIndex: 51,
        text: `...parseMemory('41700 2023 1199 224 0 5027 0')).toBe(`,
        type: 2,
      },
    ],
  })
})
