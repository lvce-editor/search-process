import { expect, test } from '@jest/globals'
import getPort from 'get-port'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { root, setup, startServer, waitForRequest } from '../src/setup.ts'

interface StdoutResponse {
  readonly stdout: string
}

const getResponse1 = (): StdoutResponse => {
  return {
    stdout: JSON.stringify({ type: 'begin', data: { path: { text: './index.ts' } } }) + '\n',
  }
}

const getResponse2 = (): StdoutResponse => {
  return {
    stdout:
      JSON.stringify({
        type: 'match',
        data: {
          path: { text: './index.ts' },
          lines: { text: 'let x = 1' },
          line_number: 0,
          absolute_offset: 4,
          submatches: [{ match: { text: 'x' }, start: 4, end: 5 }],
        },
      }) + '\n',
  }
}

const getResponse3 = (): StdoutResponse => {
  return {
    stdout:
      JSON.stringify({
        type: 'end',
        data: {
          path: { text: './index.ts' },
          binary_offset: null,
          stats: {
            elapsed: { secs: 0, nanos: 105604, human: '0.000106s' },
            searches: 1,
            searches_with_match: 1,
            bytes_searched: 7732,
            bytes_printed: 4386,
            matched_lines: 18,
            matches: 20,
          },
        },
      }) + '\n',
  }
}

const getResponseUnknown = (): StdoutResponse => {
  return {
    stdout: '',
  }
}

const getResponse = (url: string): StdoutResponse => {
  switch (url) {
    case '/1':
      return getResponse1()
    case '/2':
      return getResponse2()
    case '/3':
      return getResponse3()
    default:
      return getResponseUnknown()
  }
}

test('incremental text search', async () => {
  const fixturePath = join(root, 'packages', 'test-integration', 'fixtures', 'search-incremental', 'ripgrep-incremental.js')

  const port = await getPort()
  const { testDir, rpc, addDisposable } = await setup({
    env: {
      ...process.env,
      LVCE_SEARCH_PROCESS_PORT: port.toString(),
      RIP_GREP_PATH: fixturePath,
    },
  })

  const server = createServer()

  addDisposable({
    async dispose() {
      const { resolve, promise } = Promise.withResolvers()
      server.close(resolve)
      await promise
    },
  })

  await startServer(server, port)
  const request1Promise = waitForRequest(server)

  const id = '1'
  const resultPromise = rpc.invoke('TextSearch.searchIncremental', {
    id,
    searchPath: testDir,
    limit: 100,
    ripGrepArgs: [
      '--hidden',
      '--no-require-git',
      '--smart-case',
      '--stats',
      '--json',
      '--threads',
      '1',
      '--ignore-case',
      '--fixed-strings',
      '--',
      'aa',
      '.',
    ],
  })

  const item1 = await request1Promise

  const request2Promise = waitForRequest(server)

  item1.response.end(JSON.stringify(getResponse(item1.request.url || '')))

  const intermediateResult1 = await rpc.invoke('TextSearch.getIncrementalResults', id)

  expect(intermediateResult1).toEqual([])

  const item2 = await request2Promise

  const request3Promise = waitForRequest(server)

  item2.response.end(JSON.stringify(getResponse(item2.request.url || '')))

  const intermediateResult2 = await rpc.invoke('TextSearch.getIncrementalResults', id)

  expect(intermediateResult2).toEqual([
    {
      end: 0,
      lineNumber: 0,
      start: 0,
      text: './index.ts',
      type: 1,
    },
  ])

  const item3 = await request3Promise

  item3.response.end(JSON.stringify(getResponse(item3.request.url || '')))

  await resultPromise
}, 20_000)
