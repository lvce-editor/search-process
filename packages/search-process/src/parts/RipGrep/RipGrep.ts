import * as NodeChildProcess from 'node:child_process'
import type { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'
import * as RipGrepPath from '../ActualRipGrepPath/ActualRipGrepPath.ts'
import * as ExecRipGrep from '../ExecRipGrep/ExecRipGrep.ts'
import { VError } from '../VError/VError.ts'

export const spawn = (args: readonly any[], options: any): BaseChildProcess => {
  try {
    const childProcess: NodeChildProcess.ChildProcess = NodeChildProcess.spawn(RipGrepPath.ripGrepPath, args, options)
    return {
      childProcess,
      on(event, listener): void {
        this.childProcess.on(event, listener)
      },
      off(event, listener): void {
        this.childProcess.off(event, listener)
      },
      once(event, listener): void {
        this.childProcess.once(event, listener)
      },
      stdout: childProcess.stdout,
      stderr: childProcess.stderr,
      kill(): void {
        this.childProcess.kill()
      },
    }
  } catch (error) {
    throw new VError(error, `Failed to spawn ripgrep`)
  }
}

export const exec = ExecRipGrep.execRipGrep
