import type { Socket } from 'node:net'
import { NodeWebSocketRpcClient } from '@lvce-editor/rpc'
import type { Request } from '../Request/Request.ts'
import * as Assert from '../Assert/Assert.ts'

export const handleWebSocket = async (handle: Socket, request: Request): Promise<void> => {
  Assert.object(handle)
  Assert.object(request)
  await NodeWebSocketRpcClient.create({
    commandMap: {},
    handle,
    request,
  })
}
