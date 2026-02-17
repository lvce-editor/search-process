import { expect, jest, test } from '@jest/globals'
import { Readable } from 'node:stream'
import { collectStdoutPull } from '../src/parts/CollectTextSearchStdoutPull/CollectTextSearchStdoutPull.ts'
import * as PullSearchState from '../src/parts/PullSearchState/PullSearchState.ts'

test('collectStdoutPull - getNewItems drains buffered results', async () => {
  const searchId = 'search-1'
  const stdout = Readable.from([
    '{"type":"begin","data":{"path":{"text":"a.ts"}}}\n',
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
  expect(firstItems).toHaveLength(2)

  const secondItems = search?.getNewItems() || []
  expect(secondItems).toHaveLength(0)

  PullSearchState.remove(searchId)
})
