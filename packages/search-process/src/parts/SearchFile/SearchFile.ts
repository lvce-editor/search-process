import { createHash } from 'node:crypto'
import * as RipGrepPath from '../ActualRipGrepPath/ActualRipGrepPath.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import { ensurePath } from '../EnsurePath/EnsurePath.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as LimitString from '../LimitString/LimitString.ts'
import * as Logger from '../Logger/Logger.ts'
import * as RipGrep from '../RipGrep/RipGrep.ts'

// TODO don't necessarily need ripgrep to list all the files,
// maybe also a faster c program can do it
// another option would be to cache the results in renderer-worker and
// do a delta comparison, so the first time it would send 100kB
// but the second time only a few hundred bytes of changes

export const searchFile = async ({
  ifNonMatch,
  limit = 100,
  ripGrepArgs = [],
  searchPath = '',
}: {
  readonly searchPath?: string
  readonly limit?: number
  readonly ripGrepArgs?: readonly string[]
  readonly ifNonMatch?: string | null
}): Promise<string | { readonly hash: string; readonly matchesCache: boolean; readonly results: string }> => {
  try {
    Assert.string(searchPath)
    Assert.array(ripGrepArgs)
    Assert.number(limit)
    const cwd = ensurePath(searchPath)
    const { stdout } = await RipGrep.exec(ripGrepArgs, {
      cwd,
    })
    const results = LimitString.limitString(stdout, limit)
    if (ifNonMatch === undefined) {
      return results
    }
    const hash = createHash('sha256')
      .update(searchPath)
      .update('\0')
      .update(JSON.stringify(ripGrepArgs))
      .update('\0')
      .update(results)
      .digest('hex')
    return {
      hash,
      matchesCache: hash === ifNonMatch,
      results: hash === ifNonMatch ? '' : results,
    }
  } catch (error) {
    if (IsEnoentError.isEnoentError(error)) {
      Logger.info(`[search-process] ripgrep could not be found at "${RipGrepPath.ripGrepPath}"`)
      return Character.EmptyString
    }
    // @ts-ignore
    if (error && error.stderr === Character.EmptyString) {
      return Character.EmptyString
    }
    Logger.error(error)
    return Character.EmptyString
  }
}
