import * as CommandMap from '../CommandMap/CommandMap.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as IpcChild from '../RpcChild/RpcChild.ts'

export const listen = async (argv: readonly string[]): Promise<void> => {
  await IpcChild.listen({
    method: IpcChildType.Auto(argv),
    commandMap: CommandMap.commandMap,
  })
}
