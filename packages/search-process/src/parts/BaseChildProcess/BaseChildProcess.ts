import type { Readable } from 'node:stream'

export interface BaseChildProcess {
  readonly on: (event: string, listener: any) => void
  readonly off: (event: string, listener: any) => void
  readonly once: (event: string, listener: any) => void
  readonly stdout: Readable
  readonly stderr: Readable
  readonly kill: () => void
}
