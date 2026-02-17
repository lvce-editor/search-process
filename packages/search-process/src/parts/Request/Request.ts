export interface Request {
  readonly headers: Readonly<Record<string, string>>
  readonly httpVersionMajor: number
  readonly httpVersionMinor: number
  readonly method: string
  readonly path: string
  readonly query: string
  readonly url: string
}
