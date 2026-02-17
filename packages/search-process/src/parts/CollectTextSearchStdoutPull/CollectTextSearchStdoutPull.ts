import type { Readable } from 'node:stream'
import type { IncremetalStdoutResult as IncrementalStdoutResult } from '../IncrementalStdoutResult/IncrementalStdoutResult.ts'
import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'
import type { PullSearch } from '../PullSearch/PullSearch.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import { processData } from '../ProcessData/ProcessData.ts'
import * as PullSearchState from '../PullSearchState/PullSearchState.ts'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.ts'

export const collectStdoutPull = async (
  id: string,
  stdout: Readable,
  kill: () => void,
  maxSearchResults: number,
  charsBefore: number,
  charsAfter: number,
  notifyResultsFound: () => void,
): Promise<IncrementalStdoutResult> => {
  const allSearchResults: IncrementalTextSearchResult[] = []
  let buffer = ''
  let stats = {}
  let limitHit = false
  let done = false
  let nextResultIndex = 0
  let hasUnfetchedResults = false
  let numberOfResults = 0

  const maybeNotifyResultsFound = (): void => {
    if (hasUnfetchedResults) {
      return
    }
    hasUnfetchedResults = true
    notifyResultsFound()
  }

  const search: PullSearch = {
    dispose() {
      kill()
    },
    getNewItems() {
      const newItems = allSearchResults.slice(nextResultIndex)
      nextResultIndex = allSearchResults.length
      hasUnfetchedResults = false
      return newItems
    },
    getProgress() {
      return {
        done,
        limitHit,
        resultCount: numberOfResults,
        stats,
      }
    },
  }

  PullSearchState.set(id, search)

  stdout.setEncoding(EncodingType.Utf8)

  const handleLine = (line: string): void => {
    const parsedLine = JSON.parse(line)
    const { data, type } = parsedLine
    switch (type) {
      case RipGrepParsedLineType.Begin:
        allSearchResults.push({
          end: 0,
          lineNumber: 0,
          start: 0,
          text: data.path.text,
          type: TextSearchResultType.File,
        })
        maybeNotifyResultsFound()
        break
      case RipGrepParsedLineType.Match:
        const remaining = maxSearchResults - numberOfResults
        const matches = ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)
        numberOfResults += matches.length
        if (matches.length > 0) {
          allSearchResults.push(...matches)
          maybeNotifyResultsFound()
        }
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
  done = true
  return {
    limitHit,
    stats,
  }
}
