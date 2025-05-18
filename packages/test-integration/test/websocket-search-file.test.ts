import { test, expect } from '@jest/globals'
import { createServer, Server } from 'node:http'
import { WebSocketServer, WebSocket } from 'ws'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { NodeForkedProcessRpcParent, NodeWebSocketRpcClient } from '@lvce-editor/rpc'
import getPort from 'get-port'
import { pathToFileURL } from 'node:url'
import { setup } from '../src/setup.ts'

const __dirname = pathToFileURL(import.meta.url).toString()
const root = join(__dirname, '..', '..', '..')
const searchProcessPath = join()

const waitForRequest = (server: Server): Promise<any> => {
  const { resolve, promise } = Promise.withResolvers<any>()
  server.on('upgrade', (request, socket) => {
    resolve({
      request,
      socket,
    })
  })
  return promise
}

const startServer = (server: Server, port: number) => {
  const { resolve, promise } = Promise.withResolvers<void>()
  server.listen(port, () => {
    resolve()
  })
  return promise
}

const createWebSocket = async (port: number): Promise<WebSocket> => {
  const externalWebSocket = new WebSocket(`ws://localhost:${port}`)
  const { resolve, promise } = Promise.withResolvers()
  externalWebSocket.on('open', resolve)
  await promise
  return externalWebSocket
}

const getHandleMessage = (request: any): any => {
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

test.skip('search process handles websocket connection and search commands', async () => {
  const { rpc } = await setup()
  const server = createServer()
  const wss = new WebSocketServer({ server })
  const port = await getPort()
  const requestPromise = waitForRequest(server)

  await startServer(server, port)

  const externalSocket = await createWebSocket(port)

  const { request, socket } = await requestPromise

  const handleMessage = getHandleMessage(request)
  await rpc.invokeAndTransfer(socket, handleMessage)

  // Send search command
  externalSocket.send(
    JSON.stringify({
      method: 'SearchFile.searchFile',
      params: {
        searchPath: join(process.cwd(), 'test'),
        limit: 100,
        ripGrepArgs: ['--files'],
      },
    }),
  )

  //  {
  //     jsonrpc: '2.0',
  //     method,
  //     params: [getHandleMessage(request), ...params],
  //   },
  //   socket,
  //   {
  //     keepOpen: false,
  //   },
  // rpc.invokeAndTransfer('HandleWebSocket.handleWebSocket', ws._so)

  console.log({ request, socket })

  // const result = await new Promise((resolve) => {
  //   ws.on('message', (data: string) => {
  //     resolve(JSON.parse(data))
  //   })
  // })

  // expect(result).toBeDefined()

  // Cleanup
  wss.close()
  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve()
    })
  })
}, 30000)
