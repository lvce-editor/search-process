import * as Assert from '../Assert/Assert.ts'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleElectronMessagePort = async (messagePort, ...params) => {
  Assert.object(messagePort)
  await IpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
}
