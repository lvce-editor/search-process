import type { Rpc } from '@lvce-editor/rpc'
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
  charsAfter,
  charsBefore,
  id,
  maxSearchResults = 20_000,
  resultsFoundMethod,
  ripGrepArgs = [],
  searchDir = '',
  searchId,
  uid,
}: TextSearchPullOptions): Promise<IncremetalStdoutResult> => {
  // TODO
  const initialRpc = RpcState.get()
  if (initialRpc) {
    RpcState.setById(id, initialRpc)
  }
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd: searchDir,
  })
  const notifyResultsFound = (): void => {
    // @ts-ignore
    rpc.send({
      jsonrpc: '2.0',
      method: 'TextSearch.handlePullResultsFound',
      params: [uid, searchId],
    })
  }
  try {
    const pipeLinePromise = CollectTextSearchStdoutPull.collectStdoutPull(
      searchId,
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
    RpcState.removeById(searchId)
  }
}
