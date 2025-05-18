import { test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { createWebSocket, getHandleMessage, setup, startServer, waitForRequest } from '../src/setup.ts'

test.skip('search process handles websocket connection and search commands', async () => {
  const { rpc } = await setup()
  const server = createServer()
  const port = await getPort()
  const requestPromise = waitForRequest(server)

  await startServer(server, port)

  console.log('before socket')
  const externalSocketPromise = createWebSocket(port)

  console.log('before request')

  const { request, socket } = await requestPromise

  const handleMessage = getHandleMessage(request)
  await rpc.invokeAndTransfer(socket, handleMessage)

  const externalSocket = await externalSocketPromise
  // Send search command
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

  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve()
    })
  })
}, 5000)
