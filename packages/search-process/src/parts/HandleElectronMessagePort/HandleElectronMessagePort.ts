import * as Assert from '../Assert/Assert.ts'
import * as RpcChild from '../RpcChild/RpcChild.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleElectronMessagePort = async (messagePort: any, ...params: readonly any[]): Promise<void> => {
  Assert.object(messagePort)
  await RpcChild.listen({
    method: IpcChildType.ElectronMessagePort,
    messagePort,
  })
}
