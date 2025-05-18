import { afterEach } from '@jest/globals'
import { NodeForkedProcessRpcParent, Rpc } from '@lvce-editor/rpc'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { Server } from 'node:http'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import { WebSocket } from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')
const searchProcessPath = join(root, 'packages', 'search-process', 'src', 'searchProcessMain.ts')

interface Disposable {
  readonly dispose: () => Promise<void>
}

const disposables: Disposable[] = []

// TODO use symbol.asyncDispose once available
afterEach(async () => {
  for (const rpc of disposables) {
    await rpc.dispose()
  }
  disposables.length = 0
})

export const setup = async () => {
  const id = randomUUID()
  const testDir = join(root, '.tmp', 'test-dir', `test-${id}`)
  await mkdir(testDir, { recursive: true })

  const rpc = await NodeForkedProcessRpcParent.create({
    execArgv: ['--experimental-strip-types'],
    commandMap: {},
    path: searchProcessPath,
  })

  disposables.push(rpc)

  return {
    testDir,
    rpc,
    async setFiles(fileMap: Record<string, string>) {
      for (const [key, value] of Object.entries(fileMap)) {
        const absolutePath = join(testDir, key)
        await writeFile(absolutePath, value)
      }
    },
    dispose() {},
    addDisposable(dispoable: Disposable) {
      disposables.push(dispoable)
    },
  }
}

export const waitForRequest = (server: Server): Promise<any> => {
  const { resolve, promise } = Promise.withResolvers<any>()
  server.on('upgrade', (request, socket) => {
    resolve({
      request,
      socket,
    })
  })
  return promise
}

export const startServer = (server: Server, port: number) => {
  const { resolve, promise } = Promise.withResolvers<void>()
  server.listen(port, () => {
    resolve()
  })
  return promise
}

export const createWebSocket = async (port: number): Promise<WebSocket> => {
  const externalWebSocket = new WebSocket(`ws://localhost:${port}`)
  const { resolve, promise } = Promise.withResolvers()
  externalWebSocket.on('open', resolve)
  await promise
  return externalWebSocket
}

export const getHandleMessage = (request: any): any => {
  return {
    headers: request.headers,
    method: request.method,
    path: request.path,
    url: request.url,
    httpVersionMajor: request.httpVersionMajor,
    httpVersionMinor: request.httpVersionMinor,
    query: request.query,
  }
}

export const waitForResponse = async (socket: WebSocket) => {
  const { resolve, promise } = Promise.withResolvers()
  socket.onmessage = resolve
  await promise
}
