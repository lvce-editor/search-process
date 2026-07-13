import type { Rpc } from '@lvce-editor/rpc'

interface State {
  rpc: Rpc | undefined
}

const state: State = {
  rpc: undefined,
}
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
