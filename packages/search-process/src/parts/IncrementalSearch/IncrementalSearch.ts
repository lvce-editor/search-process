import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'

export interface IncrementalSearch {
  readonly dispose: () => void
  readonly getResultCount: () => void
  readonly getItems: (minLineY: number, maxLineY: number) => readonly IncrementalTextSearchResult[]
}
