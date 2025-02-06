import * as NodeChildProcess from 'node:child_process'

export interface BaseChildProcess {
  readonly childProcess: NodeChildProcess.ChildProcess
  readonly on: (event: string, listener: any) => void
  readonly off: (event: string, listener: any) => void
  readonly once: (event: string, listener: any) => void
  readonly stdout: any
  readonly stderr: any
  readonly kill: () => void
}
