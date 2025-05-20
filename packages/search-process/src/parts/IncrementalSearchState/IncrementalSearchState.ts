import type { IncrementalSearch } from '../IncrementalSearch/IncrementalSearch.ts'

const searches: Record<string, IncrementalSearch> = Object.create(null)

export const get = (id: string): IncrementalSearch => {
  return searches[id]
}

export const set = (id: string, search: IncrementalSearch): void => {
  searches[id] = search
}

export const remove = (id: string): void => {
  delete searches[id]
}
