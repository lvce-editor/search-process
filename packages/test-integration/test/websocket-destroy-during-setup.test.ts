import { test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { createConnection } from 'node:net'
import { getHandleMessage, setup, startServer, waitForWebSocketRequest } from '../src/setup.ts'

test.skip('search process handles websocket connection and search commands', async () => {
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

  const externalSocket = createConnection(port, 'localhost', () => {})
  externalSocket.on('connect', () => {
    externalSocket.write(
      'GET / HTTP/1.1\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        'sec-websocket-version: 13\r\n' +
        'sec-websocket-key: sfEcmoVhieHhNuR3NJwAMA==\r\n\r\n',
    )
  })

  externalSocket.on('data', (x) => {})

  const { request, socket } = await requestPromise
  const handleMessage = getHandleMessage(request)

  setTimeout(() => {
    externalSocket.destroy()
  }, 1000)

  // TODO there might be a memory leak when sending a websocket
  // and then closing it and the server is waiting for the websocket
  // upgrade to be finished
  const promise = await rpc.invokeAndTransfer('HandleWebSocket.handleWebSocket', socket, handleMessage)
}, 12_000)
