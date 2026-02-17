import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.ts', () => {
  return {
    spawn: jest.fn(() => {
      return {
        kill: jest.fn(),
        stdout: {
          setEncoding: jest.fn(),
        },
      }
    }),
  }
})

jest.unstable_mockModule('../src/parts/CollectTextSearchStdoutPull/CollectTextSearchStdoutPull.ts', () => {
  return {
    collectStdoutPull: jest.fn(
      async (
        _id: string,
        _stdout: any,
        _kill: any,
        _maxSearchResults: number,
        _charsBefore: number,
        _charsAfter: number,
        notifyResultsFound: () => void,
      ) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 0)
        })
        notifyResultsFound()
        return {
          limitHit: false,
          stats: {},
        }
      },
    ),
  }
})

jest.unstable_mockModule('../src/parts/WaitForProcessToExit/WaitForProcessToExit.ts', () => {
  return {
    waitForProcessToExit: jest.fn(async () => {
      return {
        event: undefined,
        type: 2,
      }
    }),
  }
})

const TextSearchPull = await import('../src/parts/TextSearchPull/TextSearchPull.ts')
const RpcState = await import('../src/parts/RpcState/RpcState.ts')

test('textSearchPull - stores rpc by id for concurrent searches', async () => {
  const rpc1 = {
    send: jest.fn(),
  }
  const rpc2 = {
    send: jest.fn(),
  }

  // @ts-ignore
  RpcState.set(rpc1)
  const search1Promise = TextSearchPull.textSearchPull({
    searchId: 'search-1',
    resultsFoundMethod: 'SearchProcess.handleResultsFound',
  })

  // @ts-ignore
  RpcState.set(rpc2)
  const search2Promise = TextSearchPull.textSearchPull({
    searchId: 'search-2',
    resultsFoundMethod: 'SearchProcess.handleResultsFound',
  })

  await Promise.all([search1Promise, search2Promise])

  expect(rpc1.send).toHaveBeenCalledTimes(1)
  expect(rpc1.send).toHaveBeenCalledWith('SearchProcess.handleResultsFound', 'search-1')
  expect(rpc2.send).toHaveBeenCalledTimes(1)
  expect(rpc2.send).toHaveBeenCalledWith('SearchProcess.handleResultsFound', 'search-2')
  expect(RpcState.getById('search-1')).toBeUndefined()
  expect(RpcState.getById('search-2')).toBeUndefined()
})
