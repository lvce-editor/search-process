import { expect, test } from '@jest/globals'
import * as ToTextSearchContext from '../src/parts/ToTextSearchContext/ToTextSearchContext.ts'

test('toTextSearchContext - converts a ripgrep context record', () => {
  expect(
    ToTextSearchContext.toTextSearchContext({
      data: {
        line_number: 4,
        lines: {
          text: 'context before primary match\n',
        },
        path: {
          text: 'README.md',
        },
        submatches: [],
      },
      type: 'context',
    }),
  ).toEqual({
    end: 0,
    lineNumber: 4,
    start: 0,
    text: 'context before primary match\n',
    type: 3,
  })
})
