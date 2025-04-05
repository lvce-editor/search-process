import { beforeEach, expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import { Readable } from 'node:stream'
import { VError } from '../src/parts/VError/VError.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('node:child_process', () => {
  return {
    spawn: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/ActualRipGrepPath/ActualRipGrepPath.ts', () => {
  return {
    ripGrepPath: '/test/bin/rg',
  }
})

jest.unstable_mockModule('../src/parts/ExecRipGrep/ExecRipGrep.ts', () => {
  return {
    execRipGrep: jest.fn(),
  }
})

const NodeChildProcess = await import('node:child_process')
const RipGrep = await import('../src/parts/RipGrep/RipGrep.ts')
const ExecRipGrep = await import('../src/parts/ExecRipGrep/ExecRipGrep.ts')

test('spawn - success', () => {
  const mockChildProcess = {
    stdout: new Readable({ read() {} }),
    stderr: new Readable({ read() {} }),
    on: jest.fn(),
    off: jest.fn(),
    once: jest.fn(),
    kill: jest.fn(),
  }
  // @ts-ignore
  NodeChildProcess.spawn.mockReturnValue(mockChildProcess)

  const result = RipGrep.spawn(['-i', 'test'], { cwd: '/test' })

  expect(NodeChildProcess.spawn).toHaveBeenCalledWith('/test/bin/rg', ['-i', 'test'], { cwd: '/test' })
  expect(result.stdout).toBe(mockChildProcess.stdout)
  expect(result.stderr).toBe(mockChildProcess.stderr)
  expect(result.kill).toBeDefined()
  expect(result.on).toBeDefined()
  expect(result.off).toBeDefined()
  expect(result.once).toBeDefined()
})

test('spawn - error', () => {
  const error = new Error('spawn error')
  // @ts-ignore
  NodeChildProcess.spawn.mockImplementation(() => {
    throw error
  })

  expect(() => RipGrep.spawn(['-i', 'test'], { cwd: '/test' })).toThrow(new VError(error, 'Failed to spawn ripgrep'))
})

test('exec', async () => {
  const mockResult = { stdout: 'test output', stderr: '' }
  // @ts-ignore
  ExecRipGrep.execRipGrep.mockResolvedValue(mockResult)

  const result = await RipGrep.exec(['-i', 'test'], { cwd: '/test' })

  expect(ExecRipGrep.execRipGrep).toHaveBeenCalledWith(['-i', 'test'], { cwd: '/test' })
  expect(result).toBe(mockResult)
})
