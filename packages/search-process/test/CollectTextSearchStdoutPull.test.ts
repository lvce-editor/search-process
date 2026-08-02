import { expect, jest, test } from '@jest/globals'
import { Readable } from 'node:stream'
import { collectStdoutPull } from '../src/parts/CollectTextSearchStdoutPull/CollectTextSearchStdoutPull.ts'
import * as PullSearchState from '../src/parts/PullSearchState/PullSearchState.ts'

test('collectStdoutPull - getNewItems drains buffered results', async () => {
  const searchId = 'search-1'
  const stdout = Readable.from([
    '{"type":"begin","data":{"path":{"text":"a.ts"}}}\n',
    '{"type":"context","data":{"path":{"text":"a.ts"},"lines":{"text":"before\\n"},"line_number":4,"submatches":[]}}\n',
    '{"type":"begin","data":{"path":{"text":"b.ts"}}}\n',
    '{"type":"summary","data":{}}\n',
  ])
  const kill = jest.fn()
  const notifyResultsFound = jest.fn()

  const resultPromise = collectStdoutPull(searchId, stdout, kill, 10, 0, 0, notifyResultsFound)
  const search = PullSearchState.get(searchId)

  expect(search).toBeDefined()

  const result = await resultPromise

  expect(result.limitHit).toBe(false)

  const firstItems = search?.getNewItems() || []
  expect(firstItems).toEqual([
    { end: 0, lineNumber: 0, start: 0, text: 'a.ts', type: 1 },
    { end: 0, lineNumber: 4, start: 0, text: 'before\n', type: 3 },
    { end: 0, lineNumber: 0, start: 0, text: 'b.ts', type: 1 },
  ])
  expect(notifyResultsFound).toHaveBeenCalledTimes(1)

  const secondItems = search?.getNewItems() || []
  expect(secondItems).toHaveLength(0)

  PullSearchState.remove(searchId)
})
