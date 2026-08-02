import type { TextSearchResult } from '../TextSearchResult/TextSearchResult.ts'
import * as ParseRipGrepLines from '../ParseRipGrepLines/ParseRipGrepLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const toTextSearchContext = (parsedLine: any): TextSearchResult => {
  const { data } = parsedLine
  return {
    end: 0,
    lineNumber: data.line_number,
    start: 0,
    text: ParseRipGrepLines.parseRipGrepLines(data),
    type: TextSearchResultType.Context,
  }
}
