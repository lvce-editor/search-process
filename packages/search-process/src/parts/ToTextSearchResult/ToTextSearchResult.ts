import type { TextSearchResult } from '../TextSearchResult/TextSearchResult.ts'
import * as GetStringIndexFromByteOffset from '../GetStringIndexFromByteOffset/GetStringIndexFromByteOffset.ts'
import * as ParseRipGrepLines from '../ParseRipGrepLines/ParseRipGrepLines.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'

const ellipsis = '...'
const seamSearchRadius = 8

const isNaturalSeam = (character: string): boolean => {
  return /[\s./\\_:;,()[\]{}'"-]/.test(character)
}

const getPreviewStart = (text: string, matchStart: number, charsBefore: number): number => {
  const preferredStart = Math.max(matchStart - charsBefore, 0)
  if (preferredStart === 0) {
    return 0
  }
  const minimumSeamIndex = Math.max(preferredStart - seamSearchRadius, 0)
  for (let seamIndex = preferredStart - 1; seamIndex >= minimumSeamIndex; seamIndex--) {
    if (isNaturalSeam(text[seamIndex])) {
      return seamIndex + 1
    }
  }
  const maximumSeamIndex = Math.min(preferredStart + seamSearchRadius, matchStart - 1)
  for (let seamIndex = preferredStart; seamIndex <= maximumSeamIndex; seamIndex++) {
    if (isNaturalSeam(text[seamIndex])) {
      return seamIndex + 1
    }
  }
  return preferredStart
}

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
    const previewStart = getPreviewStart(lines, startColumnIndex, charsBefore)
    const previewEnd = Math.min(endColumnIndex + charsAfter, lines.length)
    const prefix = previewStart === 0 ? '' : ellipsis
    const previewText = prefix + lines.slice(previewStart, previewEnd)
    results.push({
      end: endColumnIndex - previewStart + prefix.length,
      endColumnIndex,
      lineNumber,
      rowIndex: lineNumber - 1,
      start: startColumnIndex - previewStart + prefix.length,
      startColumnIndex,
      text: previewText,
      type: TextSearchResultType.Match,
    })
  }
  return results
}
