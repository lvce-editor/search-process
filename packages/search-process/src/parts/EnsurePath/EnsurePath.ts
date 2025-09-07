import { fileURLToPath } from 'node:url'

export const ensurePath = (searchDir: string): string => {
  if (searchDir.startsWith('file://')) {
    return fileURLToPath(searchDir)
  }
  return searchDir
}
