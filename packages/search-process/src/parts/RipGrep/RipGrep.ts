import * as NodeChildProcess from 'node:child_process'
import type { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'
import * as RipGrepPath from '../ActualRipGrepPath/ActualRipGrepPath.ts'
import * as ExecRipGrep from '../ExecRipGrep/ExecRipGrep.ts'
import { VError } from '../VError/VError.ts'

export const spawn = (args: readonly string[], options: any): BaseChildProcess => {
  try {
    const childProcess: NodeChildProcess.ChildProcess = NodeChildProcess.spawn(RipGrepPath.ripGrepPath, args, options)
    if (!childProcess.stdout || !childProcess.stderr) {
      throw new Error('stdout missing')
    }
    return {
      kill(): void {
        childProcess.kill()
      },
      off(event, listener): void {
        childProcess.off(event, listener)
      },
      on(event, listener): void {
        childProcess.on(event, listener)
      },
      once(event, listener): void {
        childProcess.once(event, listener)
      },
      stderr: childProcess.stderr,
      stdout: childProcess.stdout,
    }
  } catch (error) {
    throw new VError(error, `Failed to spawn ripgrep`)
  }
}

export const exec = ExecRipGrep.execRipGrep
