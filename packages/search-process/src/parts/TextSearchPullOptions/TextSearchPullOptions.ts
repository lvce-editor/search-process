export interface TextSearchPullOptions {
  readonly maxSearchResults?: number
  readonly resultsFoundMethod: string
  readonly ripGrepArgs?: readonly string[]
  readonly searchDir?: string
  readonly searchId: string
}
