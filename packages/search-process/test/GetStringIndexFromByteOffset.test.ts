import { expect, test } from '@jest/globals'
import * as GetStringIndexFromByteOffset from '../src/parts/GetStringIndexFromByteOffset/GetStringIndexFromByteOffset.ts'

test('getStringIndexFromByteOffset - ascii', () => {
  expect(GetStringIndexFromByteOffset.getStringIndexFromByteOffset('hello world', 6)).toBe(6)
})

test('getStringIndexFromByteOffset - unicode', () => {
  expect(GetStringIndexFromByteOffset.getStringIndexFromByteOffset('😀 hello', 5)).toBe(3)
})
