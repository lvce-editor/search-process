import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'
import type { IncrementalSearch } from '../IncrementalSearch/IncrementalSearch.ts'
import type { IncremetalStdoutResult as IncrementalStdoutResult } from '../IncrementalStdoutResult/IncrementalStdoutResult.ts'
import type { IncrementalTextSearchResult } from '../IncrementalTextSearchResult/IncrementalTextSearchResult.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import * as IncrementalSearchState from '../IncrementalSearchState/IncrementalSearchState.ts'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.ts'

export const collectStdoutIncremental = async (
  id: string,
  childProcess: BaseChildProcess,
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
      childProcess.kill()
    },
    getResultCount() {
      return numberOfResults
    },
    getItems(minLineY, maxLineY) {
      const results = Object.values(allSearchResults).flat()
      return results.slice(minLineY, maxLineY)
    },
  }

  IncrementalSearchState.set(id, search)

  childProcess.stdout.setEncoding(EncodingType.Utf8)

  const handleLine = (line: string): void => {
    const parsedLine = JSON.parse(line)
    const { type, data } = parsedLine
    switch (type) {
      case RipGrepParsedLineType.Begin:
        allSearchResults[data.path.text] = [
          {
            type: TextSearchResultType.File,
            start: 0,
            end: 0,
            lineNumber: 0,
            text: data.path.text,
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
      childProcess.kill()
    }
  }

  await pipeline(
    childProcess.stdout,
    new Writable({
      decodeStrings: false,
      construct(callback): void {
        callback()
      },
      write(chunk, encoding, callback): void {
        try {
          console.log(chunk.toString())
          handleData(chunk)
          callback()
        } catch (error) {
          callback(error)
        }
      },
    }),
  )
  return {
    stats,
    limitHit,
  }
}
