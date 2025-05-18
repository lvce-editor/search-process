import * as Assert from '../Assert/Assert.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'
import * as IpcChild from '../RpcChild/RpcChild.ts'

export const handleWebSocket = async (handle: any, request: any): Promise<void> => {
  Assert.object(handle)
  Assert.object(request)
  await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request,
    handle,
  })
}
