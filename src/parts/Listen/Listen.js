import * as CommandMap from '../CommandMap/CommandMap.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const listen = async () => {
  await IpcChild.listen({
    method: IpcChildType.Auto(),
    commandMap: CommandMap.commandMap,
  })
}
