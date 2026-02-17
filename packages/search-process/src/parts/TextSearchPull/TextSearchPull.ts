import type { IncremetalStdoutResult } from '../IncrementalStdoutResult/IncrementalStdoutResult.ts'
import type { TextSearchPullOptions } from '../TextSearchPullOptions/TextSearchPullOptions.ts'
import * as CollectTextSearchStdoutPull from '../CollectTextSearchStdoutPull/CollectTextSearchStdoutPull.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'
import * as RipGrep from '../RipGrep/RipGrep.ts'
import { RipGrepNotFoundError } from '../RipGrepNotFoundError/RipGrepNotFoundError.ts'
import * as RpcState from '../RpcState/RpcState.ts'
import { TextSearchError } from '../TextSearchError/TextSearchError.ts'
import * as WaitForProcessToExit from '../WaitForProcessToExit/WaitForProcessToExit.ts'

export const textSearchPull = async ({
  id,
  maxSearchResults = 20_000,
  resultsFoundMethod,
  ripGrepArgs = [],
  searchDir = '',
}: TextSearchPullOptions): Promise<IncremetalStdoutResult> => {
  const charsBefore = 26
  const charsAfter = 50
  const initialRpc = RpcState.get()
  if (initialRpc) {
    RpcState.setById(id, initialRpc)
  }
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const notifyResultsFound = (): void => {
    const rpc = RpcState.getById(id)
    if (!rpc) {
      return
    }
    rpc.send(resultsFoundMethod, id)
  }
  try {
    const pipeLinePromise = CollectTextSearchStdoutPull.collectStdoutPull(
      id,
      childProcess.stdout,
      childProcess.kill,
      maxSearchResults,
      charsBefore,
      charsAfter,
      notifyResultsFound,
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
  } finally {
    RpcState.removeById(id)
  }
}
