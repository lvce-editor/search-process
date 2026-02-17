import { ElectronMessagePortRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'
import { requiresSocket } from '../RequiresSocket/RequiresSocket.ts'

export const handleElectronMessagePort = async (messagePort: any): Promise<void> => {
  Assert.object(messagePort)
  await ElectronMessagePortRpcClient.create({
    commandMap: {},
    messagePort,
    requiresSocket,
  })
}
