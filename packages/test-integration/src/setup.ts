import { afterEach } from '@jest/globals'
import { NodeForkedProcessRpcParent, Rpc } from '@lvce-editor/rpc'
import { mkdir } from 'fs/promises'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { IncomingMessage, Server, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'
import { WebSocket } from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const root = join(__dirname, '..', '..', '..')

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

export const setup = async (options: { env?: Record<string, string> } = {}) => {
  const id = randomUUID()
  const testDir = join(root, '.tmp', 'test-dir', `test-${id}`)
  await mkdir(testDir, { recursive: true })

  const rpc = await NodeForkedProcessRpcParent.create({
    execArgv: ['--experimental-strip-types'],
    commandMap: {},
    path: searchProcessPath,
    stdio: 'inherit',
    env: options.env,
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
    root,
  }
}

interface WebSocketRequestResponse {
  readonly request: IncomingMessage
  readonly socket: Socket
}

export const waitForWebSocketRequest = (server: Server): Promise<WebSocketRequestResponse> => {
  const { resolve, promise } = Promise.withResolvers<any>()
  server.on('upgrade', (request, socket) => {
    resolve({
      request,
      socket,
    })
  })
  return promise
}

interface RequestResponse {
  readonly request: IncomingMessage
  readonly response: ServerResponse
}

export const waitForRequest = (server: Server): Promise<RequestResponse> => {
  const { resolve, promise } = Promise.withResolvers<RequestResponse>()
  server.once('request', (request, response) => {
    resolve({
      request,
      response,
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

export const createWebSocket = (port: number): WebSocket => {
  const externalWebSocket = new WebSocket(`ws://localhost:${port}`)
  return externalWebSocket
}

export const waitForWebSocketToBeOpen = async (webSocket: WebSocket): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers()
  webSocket.on('open', resolve)
  await promise
}

export const waitForSocketToBeClosed = async (socket: Socket): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers()
  socket.on('close', resolve)
  await promise
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
  const { resolve, promise } = Promise.withResolvers<any>()
  socket.onmessage = resolve
  const event = await promise
  const data = event.data
  const parsed = JSON.parse(data)
  return parsed
}
