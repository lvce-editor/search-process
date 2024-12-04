import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method, ...params }) => {
  const module = await IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await module.listen(params)
  return rpc
}
