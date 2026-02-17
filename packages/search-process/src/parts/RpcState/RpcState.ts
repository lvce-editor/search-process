import type { Rpc } from '@lvce-editor/rpc'

let rpc: Rpc | undefined = undefined
const rpcMap = new Map<string, Rpc>()

export const get = (): Rpc | undefined => {
  return rpc
}

export const set = (value: Rpc): void => {
  rpc = value
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
