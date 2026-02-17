import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'
import * as PullSearchState from '../PullSearchState/PullSearchState.ts'

export const getPullResults = (id: string): readonly IncrementalTextSearchResult[] => {
  const item = PullSearchState.get(id)
  const newItems = item.getNewItems()
  return newItems
}
