import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { Socket } from 'node:net'
import { setup, startServer } from '../src/setup.ts'

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
  await startServer(server, port)
  const handleMessage = {
    headers: {
      'sec-websocket-version': '13',
      'sec-websocket-key': 'sfEcmoVhieHhNuR3NJwAMA==',
      connection: 'Upgrade',
      upgrade: 'websocket',
      'sec-websocket-extensions': 'permessage-deflate; client_max_window_bits',
      host: 'localhost:33297',
    },
    method: 'GET',
    path: undefined,
    url: '/',
    httpVersionMajor: 1,
    httpVersionMinor: 1,
    query: undefined,
  }

  const s = new Socket()
  s.connect(server.address() as string)
  s.destroy()

  await rpc.invokeAndTransfer('HandleWebSocket.handleWebSocket', s, handleMessage)
}, 20_000)
