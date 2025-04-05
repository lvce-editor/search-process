import { test, expect } from '@jest/globals'
import { limitString } from '../src/parts/LimitString/LimitString.ts'

test('empty string', () => {
  expect(limitString('', 1)).toBe('')
})

test('single line', () => {
  expect(limitString('hello', 1)).toBe('hello')
})

test('multiple lines within limit', () => {
  expect(limitString('hello\nworld', 2)).toBe('hello\nworld')
})

test('multiple lines exceeding limit', () => {
  expect(limitString('hello\nworld\nfoo', 2)).toBe('hello\nworld')
})

test('multiple lines with empty lines', () => {
  expect(limitString('hello\n\nworld', 2)).toBe('hello\n')
})

test('limit 0', () => {
  expect(limitString('hello\nworld', 0)).toBe('')
})

test('limit negative', () => {
  expect(limitString('hello\nworld', -1)).toBe('')
})
