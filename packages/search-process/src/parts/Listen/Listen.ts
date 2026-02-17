import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as RpcChildModule from '../RpcChildModule/RpcChildModule.ts'
import * as RpcState from '../RpcState/RpcState.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  const method = IpcChildType.Auto(argv)
  const create = RpcChildModule.getModule(method)
  const rpc = await create({
    commandMap: CommandMap.commandMap,
  })
  RpcState.set(rpc)
}
