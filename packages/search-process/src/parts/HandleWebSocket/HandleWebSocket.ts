import { NodeWebSocketRpcClient } from '@lvce-editor/rpc'
import * as Assert from '../Assert/Assert.ts'

export const handleWebSocket = async (handle: any, request: any): Promise<void> => {
  Assert.object(handle)
  Assert.object(request)
  await NodeWebSocketRpcClient.create({
    commandMap: {},
    handle,
    request,
  })
}
