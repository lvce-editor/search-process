import { expect, test } from '@jest/globals'
import { fork } from 'child_process'
import { mkdir, rm } from 'fs/promises'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import { createInterface } from 'readline'
import { NodeForkedProcessRpcClient } from '@lvce-editor/rpc'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')
const searchProcessPath = join(root, 'packages', 'search-process', 'src', 'searchProcessMain.ts')

test.skip('search file no results', async () => {
  const testDir = join(root, '.tmp', 'test-dir')
  await mkdir(testDir, { recursive: true })

  const child = fork(join(__dirname, '../search-process/src/parts/Main/Main.js'), [], {
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
  })

  const rl = createInterface({
    input: child.stdout!,
    output: process.stdout,
  })

  let response = ''
  rl.on('line', (line) => {
    response = line
  })

  child.send({
    method: 'SearchFile.searchFile',
    params: {
      searchPath: testDir,
      ripGrepArgs: ['--files'],
    },
  })

  await new Promise((resolve) => {
    child.on('message', resolve)
  })

  expect(response).toBe('')

  child.kill()
  await rm(testDir, { recursive: true, force: true })
})
