import { NodeForkedProcessRpcParent } from '@lvce-editor/rpc'
import { mkdir } from 'fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')
const searchProcessPath = join(root, 'packages', 'search-process', 'src', 'searchProcessMain.ts')

export const setup = async () => {
  const testDir = join(root, '.tmp', 'test-dir')
  await mkdir(testDir, { recursive: true })

  const rpc = await NodeForkedProcessRpcParent.create({
    execArgv: ['--experimental-strip-types'],
    commandMap: {},
    path: searchProcessPath,
  })

  return {
    testDir,
    rpc,
    dispose() {
      // TODO
    },
  }
}
