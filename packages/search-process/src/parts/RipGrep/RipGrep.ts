import * as NodeChildProcess from 'node:child_process'
import * as Assert from '../Assert/Assert.ts'
import * as Env from '../Env/Env.ts'
import * as Exec from '../Exec/Exec.ts'
import * as RgPath from '../RipGrepPath/RipGrepPath.ts'
import { VError } from '../VError/VError.ts'
import { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'

export const ripGrepPath = Env.getRipGrepPath() || RgPath.rgPath

export const spawn = (args, options): BaseChildProcess => {
  try {
    const childProcess: NodeChildProcess.ChildProcess = NodeChildProcess.spawn(
      RgPath.rgPath,
      args,
      options,
    )
    return {
      childProcess,
      on(event, listener) {
        this.childProcess.on(event, listener)
      },
      off(event, listener) {
        this.childProcess.off(event, listener)
      },
      once(event, listener) {
        this.childProcess.once(event, listener)
      },
      stdout: childProcess.stdout,
      stderr: childProcess.stderr,
      kill() {
        this.childProcess.kill()
      },
    }
  } catch (error) {
    throw new VError(error, `Failed to spawn ripgrep`)
  }
}

export const exec = async (args, options) => {
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await Exec.exec(ripGrepPath, args, options)
  return { stdout, stderr }
}
