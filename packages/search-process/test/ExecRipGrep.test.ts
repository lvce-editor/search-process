import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Exec/Exec.ts', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ActualRipGrepPath/ActualRipGrepPath.ts', () => {
  return {
    ripGrepPath: '/test/rg',
  }
})

const ExecRipGrep = await import('../src/parts/ExecRipGrep/ExecRipGrep.ts')
const Exec = await import('../src/parts/Exec/Exec.ts')

test('execRipGrep - success', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    return {
      stderr: '',
      stdout: 'test output',
    }
  })
  const result = await ExecRipGrep.execRipGrep(['-i', 'test'], { cwd: '/test' })
  expect(result).toEqual({
    stderr: '',
    stdout: 'test output',
  })
  expect(Exec.exec).toHaveBeenCalledWith('/test/rg', ['-i', 'test'], { cwd: '/test' })
})

test('execRipGrep - error - ripgrep not found', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    const error = new Error('spawn /test/rg ENOENT')
    // @ts-ignore
    error.code = 'ENOENT'
    throw error
  })
  await expect(ExecRipGrep.execRipGrep(['-i', 'test'], { cwd: '/test' })).rejects.toThrow(new Error('spawn /test/rg ENOENT'))
})

test('execRipGrep - error - other error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    const error = new Error('other error')
    // @ts-ignore
    error.code = 'OTHER_ERROR'
    throw error
  })
  await expect(ExecRipGrep.execRipGrep(['-i', 'test'], { cwd: '/test' })).rejects.toThrow(new Error('other error'))
})
