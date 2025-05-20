export interface TextSearchIncrementalOptions {
  readonly searchDir?: string
  readonly maxSearchResults?: number
  readonly ripGrepArgs?: readonly string[]
  readonly id: string
}
