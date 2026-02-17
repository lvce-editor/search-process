export interface TextSearchPullOptions {
  readonly charsAfter: number
  readonly charsBefore: number
  readonly id: string
  readonly maxSearchResults?: number
  readonly resultsFoundMethod: string
  readonly ripGrepArgs?: readonly string[]
  readonly searchDir?: string
  readonly searchId: string
  readonly uid: number
}
