export const requiresSocket = (method: string): boolean => {
  return method === 'TextSearch.searchPull'
}
