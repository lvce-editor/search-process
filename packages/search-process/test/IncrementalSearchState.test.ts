import { test, expect } from '@jest/globals'
import { get, set, remove } from '../src/parts/IncrementalSearchState/IncrementalSearchState.js'
import { IncrementalSearch } from '../src/parts/IncrementalSearch/IncrementalSearch.ts'

const mockSearch: IncrementalSearch = {
  dispose: () => {},
  getResultCount: () => {},
  getItems: () => [],
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
