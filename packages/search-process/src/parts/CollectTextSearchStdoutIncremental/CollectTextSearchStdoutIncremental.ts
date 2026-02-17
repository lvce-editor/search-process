import type { Readable } from 'node:stream'
import type { IncrementalSearch } from '../IncrementalSearch/IncrementalSearch.ts'
import type { IncremetalStdoutResult as IncrementalStdoutResult } from '../IncrementalStdoutResult/IncrementalStdoutResult.ts'
import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import * as IncrementalSearchState from '../IncrementalSearchState/IncrementalSearchState.ts'
import { processData } from '../ProcessData/ProcessData.ts'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.ts'

export const collectStdoutIncremental = async (
  id: string,
  stdout: Readable,
  kill: () => void,
  maxSearchResults: number,
  charsBefore: number,
  charsAfter: number,
): Promise<IncrementalStdoutResult> => {
  const allSearchResults: Record<string, IncrementalTextSearchResult[]> = Object.create(null)
  let buffer = ''
  let stats = {}
  let limitHit = false
  let numberOfResults = 0

  const search: IncrementalSearch = {
    dispose() {
      kill()
    },
    getItems(minLineY, maxLineY) {
      const results = Object.values(allSearchResults).flat()
      return results.slice(minLineY, maxLineY)
    },
    getResultCount() {
      return numberOfResults
    },
  }

  IncrementalSearchState.set(id, search)

  stdout.setEncoding(EncodingType.Utf8)

  const handleLine = (line: string): void => {
    const parsedLine = JSON.parse(line)
    const { data, type } = parsedLine
    switch (type) {
      case RipGrepParsedLineType.Begin:
        allSearchResults[data.path.text] = [
          {
            end: 0,
            lineNumber: 0,
            start: 0,
            text: data.path.text,
            type: TextSearchResultType.File,
          },
        ]
        break
      case RipGrepParsedLineType.Match:
        const remaining = maxSearchResults - numberOfResults
        const matches = ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)
        numberOfResults += matches.length
        allSearchResults[data.path.text].push(...matches)
        break
      case RipGrepParsedLineType.Summary:
        stats = data
        break
      default:
        break
    }
  }

  const handleData = (chunk: any): void => {
    let newLineIndex = GetNewLineIndex.getNewLineIndex(chunk)
    const dataString = buffer + chunk
    if (newLineIndex === -1) {
      buffer = dataString
      return
    }
    newLineIndex += buffer.length
    let previousIndex = 0
    while (newLineIndex >= 0) {
      const line = dataString.slice(previousIndex, newLineIndex)
      handleLine(line)
      previousIndex = newLineIndex + 1
      newLineIndex = GetNewLineIndex.getNewLineIndex(dataString, previousIndex)
    }
    buffer = dataString.slice(previousIndex)

    if (numberOfResults > maxSearchResults) {
      limitHit = true
      kill()
    }
  }

  await processData(stdout, handleData)
  return {
    limitHit,
    stats,
  }
}
