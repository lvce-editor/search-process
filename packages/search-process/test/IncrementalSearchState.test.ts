import { test, expect } from '@jest/globals'
import type { IncrementalSearch } from '../src/parts/IncrementalSearch/IncrementalSearch.ts'
import { get, set, remove } from '../src/parts/IncrementalSearchState/IncrementalSearchState.js'

const mockSearch: IncrementalSearch = {
  dispose: () => {},
  getItems: () => [],
  getResultCount: () => {},
}

test('set and get IncrementalSearch', () => {
  set('abc', mockSearch)
  expect(get('abc')).toBe(mockSearch)
})

test('remove IncrementalSearch', () => {
  set('def', mockSearch)
  remove('def')
  expect(get('def')).toBeUndefined()
})
