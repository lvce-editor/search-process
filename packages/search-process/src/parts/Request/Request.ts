export interface Request {
  readonly headers: Record<string, string>
  readonly method: string
  readonly path: string
  readonly url: string
  readonly httpVersionMajor: number
  readonly httpVersionMinor: number
  readonly query: string
}
