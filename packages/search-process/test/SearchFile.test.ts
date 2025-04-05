import { afterEach, expect, jest, test } from '@jest/globals'
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
    info: jest.fn(() => {}),
    error: jest.fn(() => {}),
  }
})

const SearchFile = await import('../src/parts/SearchFile/SearchFile.ts')
const RipGrep = await import('../src/parts/RipGrep/RipGrep.ts')
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
