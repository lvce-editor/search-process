import * as Assert from '../Assert/Assert.ts'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const handleWebSocket = async (handle, request) => {
  Assert.object(handle)
  Assert.object(request)
  await IpcChild.listen({
    method: IpcChildType.WebSocket,
    request,
    handle,
  })
}
