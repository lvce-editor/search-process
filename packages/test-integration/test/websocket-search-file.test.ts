import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import {
  createWebSocket,
  getHandleMessage,
  setup,
  startServer,
  waitForWebSocketRequest,
  waitForResponse,
  waitForWebSocketToBeOpen,
} from '../src/setup.ts'

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
  const requestPromise = waitForWebSocketRequest(server)
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

  const responsePromise = waitForResponse(externalSocket)

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

  const response = await responsePromise
  expect(response).toEqual({ jsonrpc: '2.0', id: 111, result: 'index.ts' })
}, 20_000)
