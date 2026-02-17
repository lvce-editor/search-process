import type { PullSearchProgress } from '../PullSearch/PullSearch.ts'
import * as PullSearchState from '../PullSearchState/PullSearchState.ts'

export const getPullProgress = (id: string): PullSearchProgress => {
  const item = PullSearchState.get(id)
  return item.getProgress()
}