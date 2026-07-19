import type { TextSearchResult } from '../TextSearchResult/TextSearchResult.ts'
import * as GetStringIndexFromByteOffset from '../GetStringIndexFromByteOffset/GetStringIndexFromByteOffset.ts'
import * as ParseRipGrepLines from '../ParseRipGrepLines/ParseRipGrepLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

export const toTextSearchResult = (
  parsedLine: any,
  remaining: any,
  charsBefore: number,
  charsAfter: number,
): readonly TextSearchResult[] => {
  const results: TextSearchResult[] = []
  const parsedLineData = parsedLine.data
  const lines = ParseRipGrepLines.parseRipGrepLines(parsedLineData)
  const lineNumber = parsedLineData.line_number
  const { submatches } = parsedLineData
  for (const submatch of submatches) {
    const startColumnIndex = GetStringIndexFromByteOffset.getStringIndexFromByteOffset(lines, submatch.start)
    const endColumnIndex = GetStringIndexFromByteOffset.getStringIndexFromByteOffset(lines, submatch.end)
    const previewStart = Math.max(startColumnIndex - charsBefore, 0)
    const previewEnd = Math.min(endColumnIndex + charsAfter, lines.length)
    const previewText = lines.slice(previewStart, previewEnd)
    results.push({
      end: endColumnIndex - previewStart,
      endColumnIndex,
      lineNumber,
      start: startColumnIndex - previewStart,
      startColumnIndex,
      text: previewText,
      type: TextSearchResultType.Match,
    })
  }
  return results
}
