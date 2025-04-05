import { test, expect } from '@jest/globals'
import * as IsEnoentError from '../src/parts/IsEnoentError/IsEnoentError.ts'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'

test('isEnoentError - returns false for null', () => {
  expect(IsEnoentError.isEnoentError(null)).toBe(false)
})

test('isEnoentError - returns false for undefined', () => {
  expect(IsEnoentError.isEnoentError(undefined)).toBe(false)
})

test('isEnoentError - returns true for Linux ENOENT error', () => {
  const error = { code: ErrorCodes.ENOENT }
  expect(IsEnoentError.isEnoentError(error)).toBe(true)
})

test('isEnoentError - returns false for non-ENOENT error', () => {
  const error = { code: 'OTHER_ERROR' }
  expect(IsEnoentError.isEnoentError(error)).toBe(undefined)
})

test('isEnoentError - returns false for error without code', () => {
  const error = { message: 'Some error' }
  expect(IsEnoentError.isEnoentError(error)).toBe(false)
})
