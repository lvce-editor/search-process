import { expect, test } from '@jest/globals'
import * as RipGrepPath from '../src/parts/RipGrepPath/RipGrepPath.ts'

test('rgPath', () => {
  expect(RipGrepPath.rgPath).toEqual(expect.any(String))
})
