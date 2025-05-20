import type { IncremetalStdoutResult } from '../IncrementalStdoutResult/IncrementalStdoutResult.ts'
import type { TextSearchIncrementalOptions } from '../TextSearchIncrementalOptions/TextSearchIncrementalOptions.ts'
import * as CollectTextSearchStdoutIncremental from '../CollectTextSearchStdoutIncremental/CollectTextSearchStdoutIncremental.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'
import * as RipGrep from '../RipGrep/RipGrep.ts'
import { RipGrepNotFoundError } from '../RipGrepNotFoundError/RipGrepNotFoundError.ts'
import { TextSearchError } from '../TextSearchError/TextSearchError.ts'
import * as WaitForProcessToExit from '../WaitForProcessToExit/WaitForProcessToExit.ts'

// TODO maybe split text search and file search into two processes,
// so that long file text search cannot block file search and
// text and file search would be more independent
// only the logic for ripgrep path and websocket / messageport handling
//  would need to be the same
export const textSearchIncremental = async ({
  searchDir = '',
  maxSearchResults = 20_000,
  ripGrepArgs = [],
  id,
}: TextSearchIncrementalOptions): Promise<IncremetalStdoutResult> => {
  // TODO options
  const charsBefore = 26
  const charsAfter = 50
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const pipeLinePromise = CollectTextSearchStdoutIncremental.collectStdoutIncremental(
    id,
    childProcess.stdout,
    childProcess.kill,
    maxSearchResults,
    charsBefore,
    charsAfter,
  )
  const closePromise = WaitForProcessToExit.waitForProcessToExit(childProcess)
  const [pipeLineResult, exitResult] = await Promise.all([pipeLinePromise, closePromise])
  if (exitResult.type === ProcessExitEventType.Error) {
    if (IsEnoentError.isEnoentError(exitResult.event)) {
      throw new RipGrepNotFoundError(exitResult.event)
    }
    throw new TextSearchError(exitResult.event)
  }
  return pipeLineResult
}
