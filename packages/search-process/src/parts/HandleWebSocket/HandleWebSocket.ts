import type { Socket } from 'node:net'
import { NodeWebSocketRpcClient } from '@lvce-editor/rpc'
import type { Request } from '../Request/Request.ts'
import * as Assert from '../Assert/Assert.ts'
import { requiresSocket } from '../RequiresSocket/RequiresSocket.ts'

export const handleWebSocket = async (handle: Socket, request: Request): Promise<void> => {
  if (!handle || !request) {
    // socket might have been closed during transfer
    return
  }
  Assert.object(handle)
  Assert.object(request)
  await NodeWebSocketRpcClient.create({
    commandMap: {},
    handle,
    request,
    requiresSocket,
  })
}
