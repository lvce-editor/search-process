import type { Rpc } from '@lvce-editor/rpc'
import * as RpcChildModule from '../RpcChildModule/RpcChildModule.ts'

export const listen = async ({ method, ...params }: { readonly method: number; readonly [key: string]: any }): Promise<Rpc> => {
  const create = RpcChildModule.getModule(method)
  const rpc = await create(params)
  return rpc
}
