import { test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { createWebSocket, getHandleMessage, setup, startServer, waitForRequest, waitForResponse } from '../src/setup.ts'

test('search process handles websocket connection and search commands', async () => {
  const { rpc, addDisposable } = await setup()
  const server = createServer()

  addDisposable({
    async dispose() {
      const { resolve, promise } = Promise.withResolvers()
      server.close(resolve)
      await promise
    },
  })

  const port = await getPort()
  const requestPromise = waitForRequest(server)
  await startServer(server, port)
  const externalSocketPromise = createWebSocket(port)
  const { request, socket } = await requestPromise
  const handleMessage = getHandleMessage(request)
  await rpc.invokeAndTransfer('HandleWebSocket.handleWebSocket', socket, handleMessage)
  const externalSocket = await externalSocketPromise
  addDisposable({
    async dispose() {
      externalSocket.close()
    },
  })

  const responsePromise = waitForResponse(externalSocket)

  externalSocket.send(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 111,
      method: 'SearchFile.searchFile',
      params: {
        searchPath: join(process.cwd(), 'test'),
        limit: 100,
        ripGrepArgs: ['--files'],
      },
    }),
  )

  const response = await responsePromise
}, 20_000)
