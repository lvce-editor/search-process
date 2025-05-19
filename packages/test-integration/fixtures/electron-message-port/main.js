import { ElectronMessagePortRpcClient, ElectronUtilityProcessRpcParent } from '@lvce-editor/rpc'
import { app } from 'electron'
import { MessageChannelMain } from 'electron/main'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import minimist from 'minimist'
import assert from 'node:assert'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..', '..')
const searchProcessPath = join(root, 'packages', 'search-process', 'dist', 'index.js')
const argv = minimist(process.argv.slice(2))

const createRpc = async () => {
  const rpc = await ElectronUtilityProcessRpcParent.create({
    commandMap: {},
    name: 'Search Process',
    path: searchProcessPath,
  })
  const { port1, port2 } = new MessageChannelMain()
  await rpc.invokeAndTransfer('HandleElectronMessagePort.handleElectronMessagePort', port1)
  const messagePortRpc = await ElectronMessagePortRpcClient.create({
    commandMap: {},
    messagePort: port2,
  })
  return {
    rpc,
    messagePortRpc,
  }
}

const main = async () => {
  await app.whenReady()
  const { rpc, messagePortRpc } = await createRpc()
  const testDir = argv['test-dir']
  const result = await messagePortRpc.invoke('SearchFile.searchFile', {
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: ['--files', '--sort-files'],
  })
  assert.equal(result, 'index.ts')
  messagePortRpc.dispose()
  rpc.dispose()
  // TODO disposing ipc should close app automatically
  process.exit(0)
}

main()
