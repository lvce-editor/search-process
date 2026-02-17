import type { Readable } from 'node:stream'

export interface BaseChildProcess {
  readonly kill: () => void
  readonly off: (event: string, listener: any) => void
  readonly on: (event: string, listener: any) => void
  readonly once: (event: string, listener: any) => void
  readonly stderr: Readable
  readonly stdout: Readable
}
