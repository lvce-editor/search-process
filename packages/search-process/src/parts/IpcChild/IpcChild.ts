import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'

export const listen = async ({ method, ...params }): Promise<any> => {
  const module = IpcChildModule.getModule(method)
  // @ts-ignore
  const rpc = await module.create(params)
  return rpc
}
