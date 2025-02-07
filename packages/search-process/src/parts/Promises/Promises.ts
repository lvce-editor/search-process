export const withResolvers = <T>() => {
  /**
   * @type {any}
   */
  let _resolve: any
  /**
   * @type {any}
   */
  let _reject: any
  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  return {
    resolve: _resolve,
    reject: _reject,
    promise,
  }
}
