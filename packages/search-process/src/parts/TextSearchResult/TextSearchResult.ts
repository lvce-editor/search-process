export interface TextSearchResult {
  readonly end: number
  readonly endColumnIndex?: number
  readonly lineNumber: number
  readonly start: number
  readonly startColumnIndex?: number
  readonly text: string
  readonly type: number
}
