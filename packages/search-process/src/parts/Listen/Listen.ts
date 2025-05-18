import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as RpcChildModule from '../RpcChildModule/RpcChildModule.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  const method = IpcChildType.Auto(argv)
  const create = RpcChildModule.getModule(method)
  await create({
    commandMap: CommandMap.commandMap,
  })
}
