import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'

export class TextSearchError extends Error {
  readonly code: string

  constructor(cause) {
    if (IsEnoentError.isEnoentError(cause)) {
      super(`ripgrep path not found: ${cause}`)
      this.code = ErrorCodes.E_RIP_GREP_NOT_FOUND
    } else {
      super(`ripgrep process error: ${cause}`)
      this.code = cause.code
    }
    this.name = 'TextSearchError'
  }
}
