import { expect, test } from '@jest/globals'
import * as IpcChildType from '../src/parts/IpcChildType/IpcChildType.ts'

test('node-worker', () => {
  const argv = ['--ipc-type=node-worker']
  expect(IpcChildType.Auto(argv)).toBe(1)
})

test('node-forked-process', () => {
  const argv = ['--ipc-type=node-forked-process']
  expect(IpcChildType.Auto(argv)).toBe(2)
})

test('electron-utility-process', () => {
  const argv = ['--ipc-type=electron-utility-process']
  expect(IpcChildType.Auto(argv)).toBe(3)
})

test('unknown', () => {
  const argv = ['--ipc-type=other']
  expect(() => IpcChildType.Auto(argv)).toThrow(new Error(`[search-process] unknown ipc type`))
})
