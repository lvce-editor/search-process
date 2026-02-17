import type { ExecResult } from '../ExecRipGrepResult/ExecRipGrepResult.ts'
import * as RipGrepPath from '../ActualRipGrepPath/ActualRipGrepPath.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Exec from '../Exec/Exec.ts'

export const execRipGrep = async (args: readonly any[], options: any): Promise<ExecResult> => {
  Assert.array(args)
  Assert.object(options)
  const { stderr, stdout } = await Exec.exec(RipGrepPath.ripGrepPath, args, options)
  return { stderr, stdout }
}
