import { expect, test } from '@jest/globals'
import type { PullSearch } from '../src/parts/PullSearch/PullSearch.ts'
import { get, remove, set } from '../src/parts/PullSearchState/PullSearchState.ts'

const mockSearch: PullSearch = {
  dispose: () => {},
  getNewItems: () => [],
  getProgress: () => ({
    done: false,
    limitHit: false,
    resultCount: 0,
    stats: {},
  }),
}

test('set and get PullSearch', () => {
  set('abc', mockSearch)
  expect(get('abc')).toBe(mockSearch)
})

test('remove PullSearch', () => {
  set('def', mockSearch)
  remove('def')
  expect(get('def')).toBeUndefined()
})
