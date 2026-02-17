export interface TextSearchIncrementalOptions {
  readonly id: string
  readonly maxSearchResults?: number
  readonly ripGrepArgs?: readonly string[]
  readonly searchDir?: string
}
