import { expect, test } from '@jest/globals'
import { TextSearchError } from '../src/parts/TextSearchError/TextSearchError.ts'

test('creates error with cause', () => {
  const cause = { code: 'ENOENT', message: 'File not found' }
  const error = new TextSearchError(cause)

  expect(error).toBeInstanceOf(Error)
  expect(error).toBeInstanceOf(TextSearchError)
  expect(error.name).toBe('TextSearchError')
  expect(error.message).toBe('ripgrep process error: [object Object]')
  expect(error.code).toBe('ENOENT')
})

test('creates error with string cause', () => {
  const cause = 'Process failed'
  const error = new TextSearchError(cause)

  expect(error.message).toBe('ripgrep process error: Process failed')
  expect(error.code).toBeUndefined()
})
