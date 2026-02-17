import * as CollectTextSearchStdout from '../CollectTextSearchStdout/CollectTextSearchStdout.ts'
import { ensurePath } from '../EnsurePath/EnsurePath.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'
import * as RipGrep from '../RipGrep/RipGrep.ts'
import { RipGrepNotFoundError } from '../RipGrepNotFoundError/RipGrepNotFoundError.ts'
import { TextSearchError } from '../TextSearchError/TextSearchError.ts'
import * as WaitForProcessToExit from '../WaitForProcessToExit/WaitForProcessToExit.ts'

// TODO update vscode-ripgrep when https://github.com/mhinz/vim-grepper/issues/244, https://github.com/BurntSushi/ripgrep/issues/1892 is fixed

// need to use '.' as last argument for ripgrep
// issue 1 https://github.com/nvim-telescope/telescope.nvim/pull/908/files
// issue 2 https://github.com/BurntSushi/ripgrep/issues/1892
// remove workaround when ripgrep is fixed

// TODO stats flag might not be necessary
// TODO update client
// TODO not always run nice, maybe configure nice via flag/options

export const search = async ({
  maxSearchResults = 20_000,
  ripGrepArgs = [],
  searchDir = '',
}: {
  readonly searchDir?: string
  readonly maxSearchResults?: number
  readonly ripGrepArgs?: readonly string[]
} = {}): Promise<any> => {
  const charsBefore = 26
  const charsAfter = 50 // TODO pass these also in as parameters
  const cwd = ensurePath(searchDir)
  const childProcess = RipGrep.spawn(ripGrepArgs, {
    cwd,
  })
  const pipeLinePromise = CollectTextSearchStdout.collectStdout(
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
