export class TextSearchError extends Error {
  readonly code: string

  constructor(cause: any) {
    super(`ripgrep process error: ${cause}`)
    this.code = cause.code
    this.name = 'TextSearchError'
  }
}
