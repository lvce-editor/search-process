import * as IpcChildModule from '../IpcChildModule/IpcChildModule.js'

export const listen = async ({ method, ...params }) => {
  const module = IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await module.create(params)
  return rpc
}
