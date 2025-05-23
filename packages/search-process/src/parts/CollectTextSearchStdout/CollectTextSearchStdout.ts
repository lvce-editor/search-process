import type { Readable } from 'node:stream'
import type { StdoutResult } from '../StdoutResult/StdoutResult.ts'
import type { TextSearchResult } from '../TextSearchResult/TextSearchResult.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as GetNewLineIndex from '../GetNewLineIndex/GetNewLineIndex.ts'
import { processData } from '../ProcessData/ProcessData.ts'
import * as RipGrepParsedLineType from '../RipGrepParsedLineType/RipGrepParsedLineType.ts'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.ts'
import * as ToTextSearchResult from '../ToTextSearchResult/ToTextSearchResult.ts'
// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

export const collectStdout = async (
  stdout: Readable,
  kill: () => void,
  maxSearchResults: number,
  charsBefore: number,
  charsAfter: number,
): Promise<StdoutResult> => {
  const allSearchResults: Record<string, TextSearchResult[]> = Object.create(null)
  let buffer = ''
  let stats = {}
  let limitHit = false
  let numberOfResults = 0

  stdout.setEncoding(EncodingType.Utf8)

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
      kill()
    }
  }
  await processData(stdout, handleData)
  const results = Object.values(allSearchResults).flat()
  return {
    results,
    stats,
    limitHit,
  }
}
