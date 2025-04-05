import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'

export class RipGrepNotFoundError extends Error {
  readonly code: string

  constructor(cause: any) {
    super(`ripgrep path not found: ${cause}`)
    this.code = ErrorCodes.E_RIP_GREP_NOT_FOUND
    this.name = 'RipGrepNotFoundError'
  }
}
