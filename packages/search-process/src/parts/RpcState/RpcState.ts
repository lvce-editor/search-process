interface Rpc {
  readonly dispose: () => Promise<void>
  readonly invoke: (method: string, ...params: readonly any[]) => Promise<any>
  readonly invokeAndTransfer: (method: string, ...params: readonly any[]) => Promise<any>
  readonly send: (method: string, ...params: readonly any[]) => void
}

interface State {
  rpc?: Rpc
}

const state: State = {}
const rpcMap = new Map<string, Rpc>()

export const get = (): Rpc | undefined => {
  return state.rpc
}

export const set = (value: Rpc): void => {
  state.rpc = value
}

export const getById = (id: string): Rpc | undefined => {
  return rpcMap.get(id)
}

export const setById = (id: string, value: Rpc): void => {
  rpcMap.set(id, value)
}

export const removeById = (id: string): void => {
  rpcMap.delete(id)
}
