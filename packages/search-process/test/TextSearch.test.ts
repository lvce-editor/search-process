import { beforeEach, expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import * as ProcessExitEventType from '../src/parts/ProcessExitEventType/ProcessExitEventType.ts'
import { RipGrepNotFoundError } from '../src/parts/RipGrepNotFoundError/RipGrepNotFoundError.ts'
import { TextSearchError } from '../src/parts/TextSearchError/TextSearchError.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.ts', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
    spawn: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ToTextSearchResult/ToTextSearchResult.ts', () => {
  return {
    toTextSearchResult: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const TextSearch = await import('../src/parts/TextSearch/TextSearch.ts')
const RipGrep = await import('../src/parts/RipGrep/RipGrep.ts')
const ToTextSearchResult = await import('../src/parts/ToTextSearchResult/ToTextSearchResult.ts')

test('search - no results', async () => {
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read(): void {},
    })
    const childProcess = {
      kill(): void {},
      off(event: string, listener: any): void {
        emitter.off(event, listener)
      },
      on(event: string, listener: any): void {
        emitter.on(event, listener)
      },
      once(event: string, listener: any): void {
        emitter.once(event, listener)
      },
      stderr: {},
      stdout,
    }
    setTimeout(() => {
      stdout.emit('end')
      stdout.emit('close')
      emitter.emit('close')
    })
    return childProcess
  })
  // @ts-ignore
  expect(await TextSearch.search('/test', 'document')).toEqual({
    limitHit: false,
    results: [],
    stats: expect.any(Object),
  })
})

test('search - one result', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    return [
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ]
  }) // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read(): void {},
    })
    const childProcess = {
      kill(): void {},
      off(event: string, listener: any): void {
        emitter.off(event, listener)
      },
      on(event: string, listener: any): void {
        emitter.on(event, listener)
      },
      once(event: string, listener: any): void {
        emitter.once(event, listener)
      },
      stderr: {},
      stdout,
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`,
      )
      setTimeout(() => {
        stdout.emit('end')
        stdout.emit('close')
        emitter.emit('close')
      })
    })
    return childProcess
  })
  // @ts-ignore
  expect(await TextSearch.search('/test', 'document')).toEqual({
    limitHit: false,
    results: [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: 'index.html',
        type: 1,
      },
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ],
    stats: expect.any(Object),
  })
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledTimes(1)
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledWith(
    {
      data: {
        absolute_offset: 0,
        line_number: 1,
        lines: {
          text: '<!DOCTYPE html>\n',
        },
        path: {
          text: './index.html',
        },
        submatches: [
          {
            end: 5,
            match: {
              text: 'DOC',
            },
            start: 2,
          },
        ],
      },
      type: 'match',
    },
    20_000,
    26,
    50,
  )
})

test('search - one result split across multiple chunks', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    return [
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ]
  })
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read(): void {},
    })
    const childProcess = {
      kill(): void {},
      off(event: string, listener: any): void {
        emitter.off(event, listener)
      },
      on(event: string, listener: any): void {
        emitter.on(event, listener)
      },
      once(event: string, listener: any): void {
        emitter.once(event, listener)
      },
      stderr: {},
      stdout,
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"`,
      )
      stdout.push(
        `./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`,
      )
      stdout.emit('end')
      stdout.emit('close')
      emitter.emit('close')
    })
    return childProcess
  })
  // @ts-ignore
  expect(await TextSearch.search('/test', 'document')).toEqual({
    limitHit: false,
    results: [
      {
        end: 0,
        lineNumber: 0,
        start: 0,
        text: 'index.html',
        type: 1,
      },
      {
        end: 23,
        lineNumber: 151,
        start: 20,
        text: 'elect Destination Location" wizard page\n',
        type: 2,
      },
    ],
    stats: expect.any(Object),
  })
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledTimes(1)
  expect(ToTextSearchResult.toTextSearchResult).toHaveBeenCalledWith(
    {
      data: {
        absolute_offset: 0,
        line_number: 1,
        lines: {
          text: '<!DOCTYPE html>\n',
        },
        path: {
          text: './index.html',
        },
        submatches: [
          {
            end: 5,
            match: {
              text: 'DOC',
            },
            start: 2,
          },
        ],
      },
      type: 'match',
    },
    20_000,
    26,
    50,
  )
})

test('search - error with parsing line', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {
    throw new TypeError(`Cannot read properties of undefined (reading length)`)
  })
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read(): void {},
    })
    const childProcess = {
      kill(): void {},
      off(event: string, listener: any): void {
        emitter.off(event, listener)
      },
      on(event: string, listener: any): void {
        emitter.on(event, listener)
      },
      once(event: string, listener: any): void {
        emitter.once(event, listener)
      },
      stderr: {},
      stdout,
    }
    setTimeout(() => {
      stdout.push(
        `{"type":"begin","data":{"path":{"text":"./index.html"}}}
{"type":"match","data":{"path":{"text":"./index.html"},"lines":{"text":"<!DOCTYPE html>\\n"},"line_number":1,"absolute_offset":0,"submatches":[{"match":{"text":"DOC"},"start":2,"end":5}]}}
`,
      )
      emitter.emit('close')
    })
    return childProcess
  })
  // @ts-ignore
  await expect(TextSearch.search('/test', 'document')).rejects.toThrow(
    new TypeError('Cannot read properties of undefined (reading length)'),
  )
})

test('search - error ripgrep not found', async () => {
  // @ts-ignore
  ToTextSearchResult.toTextSearchResult.mockImplementation(() => {})
  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => {
    const emitter = new EventEmitter()
    const stdout = new Readable({
      read(): void {},
    })
    const childProcess = {
      kill(): void {},
      off(event: string, listener: any): void {
        emitter.off(event, listener)
      },
      on(event: string, listener: any): void {
        emitter.on(event, listener)
      },
      once(event: string, listener: any): void {
        emitter.once(event, listener)
      },
      stderr: {},
      stdout,
    }
    setTimeout(() => {
      const error = new Error(`spawn /test/bin/rg ENOENT`)
      // @ts-ignore
      error.code = 'ENOENT'
      emitter.emit('error', error)
      stdout.emit('end')
      stdout.emit('close')
    })
    return childProcess
  })
  // @ts-ignore
  await expect(TextSearch.search('/test', 'document')).rejects.toThrow(
    new TypeError('ripgrep path not found: Error: spawn /test/bin/rg ENOENT'),
  )
})

test.todo('successful search')

test.todo('ripgrep not found error')

test.todo('text search error')

test('returns pipeline result on success', async () => {
  const mockChildProcess = { pid: 123 }
  const mockSearchResult = { results: ['test1', 'test2'] }
  const mockExitResult = { event: { code: 0 }, type: ProcessExitEventType.Exit }

  // @ts-ignore
  RipGrep.spawn.mockImplementation(() => mockChildProcess)
  // @ts-ignore
  CollectTextSearchStdout.collectStdout.mockImplementation(async () => mockSearchResult)
  // @ts-ignore
  WaitForProcessToExit.waitForProcessToExit.mockImplementation(async () => mockExitResult)

  const result = await TextSearch.search({
    maxSearchResults: 100,
    ripGrepArgs: ['-i', 'test'],
    searchDir: '/test',
  })

  expect(result).toBe(mockSearchResult)
})
