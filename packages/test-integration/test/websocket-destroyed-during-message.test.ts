import { test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { createWebSocket, getHandleMessage, setup, startServer, waitForRequest, waitForWebSocketToBeOpen } from '../src/setup.ts'

test('search process handles websocket connection and search commands', async () => {
  const { rpc, addDisposable, testDir, setFiles } = await setup()
  await setFiles({
    'index.ts': 'let x = 1',
  })
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
  const externalSocket = createWebSocket(port)
  const openPromise = waitForWebSocketToBeOpen(externalSocket)
  const { request, socket } = await requestPromise
  const handleMessage = getHandleMessage(request)
  await rpc.invokeAndTransfer('HandleWebSocket.handleWebSocket', socket, handleMessage)
  await openPromise
  addDisposable({
    async dispose() {
      externalSocket.close()
    },
  })
  externalSocket.send(
    JSON.stringify({
      jsonrpc: '2.0',
      id: 111,
      method: 'SearchFile.searchFile',
      params: [
        {
          searchPath: testDir,
          limit: 100,
          ripGrepArgs: ['--files', '--sort-files'],
        },
      ],
    }),
  )
  // @ts-ignore
  const s = externalSocket._socket
  s.destroy()
  await new Promise((r) => {
    setTimeout(r, 100)
  })
}, 20_000)
