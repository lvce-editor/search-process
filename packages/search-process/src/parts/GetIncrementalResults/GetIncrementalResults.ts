import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'
import * as IncrementalSearchState from '../IncrementalSearchState/IncrementalSearchState.ts'

export const getIncrementalResults = (id: string, minLineY: number, maxLineY: number): readonly IncrementalTextSearchResult[] => {
  const item = IncrementalSearchState.get(id)
  const visibleItems = item.getItems(minLineY, maxLineY)
  return visibleItems
}
