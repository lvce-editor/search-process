import { afterEach, expect, jest, test } from '@jest/globals'
import { createHash } from 'node:crypto'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

afterEach(() => {
  jest.resetAllMocks()
})

const exec = jest.fn(() => {
  throw new Error('not implemented')
})

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.ts', () => {
  return {
    exec,
  }
})

jest.unstable_mockModule('../src/parts/ActualRipGrepPath/ActualRipGrepPath.ts', () => {
  return {
    ripGrepPath: '/test/rg',
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.ts', () => {
  return {
    error: jest.fn(() => {}),
    info: jest.fn(() => {}),
  }
})

const SearchFile = await import('../src/parts/SearchFile/SearchFile.ts')
const Logger = await import('../src/parts/Logger/Logger.ts')

class NodeError extends Error {
  code: any
  constructor(code: string, message = code) {
    super(code + ':' + message)
    this.code = code
  }
}

test('searchFile', async () => {
  // @ts-ignore
  exec.mockImplementation(() => {
    return {
      stdout: `fileA
fileB
nested/fileC`,
    }
  })
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(
    `fileA
fileB
nested/fileC`,
  )
})

test('searchFile returns no results when the conditional hash matches', async () => {
  exec.mockImplementation(() => ({ stdout: 'fileA\nfileB' }) as never)
  const options = {
    ifNonMatch: null,
    ripGrepArgs: ['--files', '--hidden'],
    searchPath: '/workspace',
  }
  const result = await SearchFile.searchFile(options)
  expect(result).toEqual({
    hash: createHash('sha256')
      .update('/workspace')
      .update('\0')
      .update(JSON.stringify(options.ripGrepArgs))
      .update('\0')
      .update('fileA\nfileB')
      .digest('hex'),
    matchesCache: false,
    results: 'fileA\nfileB',
  })
  if (typeof result === 'string') {
    throw new TypeError('Expected a conditional search result')
  }
  await expect(SearchFile.searchFile({ ...options, ifNonMatch: result.hash })).resolves.toEqual({
    hash: result.hash,
    matchesCache: true,
    results: '',
  })
})

test('searchFile returns changed results when the conditional hash differs', async () => {
  exec.mockImplementation(() => ({ stdout: 'fileA\nfileC' }) as never)
  await expect(SearchFile.searchFile({ ifNonMatch: '0'.repeat(64), searchPath: '/workspace' })).resolves.toMatchObject({
    matchesCache: false,
    results: 'fileA\nfileC',
  })
})

test('searchFile - error - ripgrep could not be found', async () => {
  exec.mockImplementation(() => {
    throw new NodeError(ErrorCodes.ENOENT)
  })
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(``)
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith('[search-process] ripgrep could not be found at "/test/rg"')
})

test('searchFile - error', async () => {
  // @ts-ignore
  exec.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const options = {
    searchPath: '/test',
  }
  expect(await SearchFile.searchFile(options)).toBe(``)
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new TypeError(`x is not a function`))
})
