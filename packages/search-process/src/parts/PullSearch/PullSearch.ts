import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'

export interface PullSearchProgress {
  readonly done: boolean
  readonly limitHit: boolean
  readonly resultCount: number
  readonly stats: any
}

export interface PullSearch {
  readonly dispose: () => void
  readonly getNewItems: () => readonly IncrementalTextSearchResult[]
  readonly getProgress: () => PullSearchProgress
}
