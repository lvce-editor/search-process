import * as RipGrepPath from '../ActualRipGrepPath/ActualRipGrepPath.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
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
  searchPath = '',
  limit = 100,
  ripGrepArgs = [],
}: {
  readonly searchPath?: string
  readonly limit?: number
  readonly ripGrepArgs?: readonly string[]
}): Promise<string> => {
  try {
    Assert.string(searchPath)
    Assert.array(ripGrepArgs)
    Assert.number(limit)
    const { stdout, stderr } = await RipGrep.exec(ripGrepArgs, {
      cwd: searchPath,
    })
    return LimitString.limitString(stdout, limit)
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
