import type { PullSearch } from '../PullSearch/PullSearch.ts'

const searches: Record<string, PullSearch> = Object.create(null)

export const get = (id: string): PullSearch => {
  return searches[id]
}

export const set = (id: string, search: PullSearch): void => {
  searches[id] = search
}

export const remove = (id: string): void => {
  delete searches[id]
}
