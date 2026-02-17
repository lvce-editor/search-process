export interface TextSearchPullOptions {
  readonly id: string
  readonly maxSearchResults?: number
  readonly resultsFoundMethod: string
  readonly ripGrepArgs?: readonly string[]
  readonly searchDir?: string
}
