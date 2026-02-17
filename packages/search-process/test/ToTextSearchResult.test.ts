import { expect, test } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'
import * as ToTextSearchResult from '../src/parts/ToTextSearchResult/ToTextSearchResult.ts'

test('toTextSearchResult - match with bytes', () => {
  const parsedLine = {
    data: {
      absolute_offset: 11_384,
      line_number: 220,
      lines: {
        bytes:
          'QXBwbGljYXRpb25zRm91bmQ9QSBr9nZldGtlevUgYWxrYWxtYXrhc29rIG9seWFuIGbhamxva2F0IGhhc3pu4WxuYWssIGFtZWx5ZWtldCBhIFRlbGVw7XT1bmVrIGZyaXNz7XRlbmkga2VsbC4gQWrhbmxvdHQsIGhvZ3kgZW5nZWTpbHllenplIGEgVGVsZXDtdPVuZWsgZXplbiBhbGthbG1heuFzb2sgYXV0b21hdGlrdXMgYmV64XLhc+F0Lgo=',
      },
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      submatches: [
        {
          end: 8,
          match: {
            text: 'cat',
          },
          start: 5,
        },
      ],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 8,
      lineNumber: 220,
      start: 5,
      text: 'ApplicationsFound=A k�vetkez� alkalmaz�sok olyan f�jlokat ',
      type: 2,
    },
  ])
})

test.skip('toTextSearchResult - match with text', () => {
  const parsedLine = {
    data: {
      absolute_offset: 6785,
      line_number: 151,
      lines: {
        text: '; *** "Select Destination Location" wizard page\n',
      },
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      submatches: [
        {
          end: 31,
          match: {
            text: 'cat',
          },
          start: 28,
        },
      ],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 24,
      lineNumber: 151,
      start: 21,
      text: 'Select Destination Location" wizard page\n',
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - match without text or bytes', () => {
  const parsedLine = {
    data: {
      absolute_offset: 6785,
      line_number: 151,
      lines: {},
      path: {
        text: './build/win32/i18n/Default.hu.isl',
      },
      submatches: [
        {
          end: 31,
          match: {
            text: 'cat',
          },
          start: 28,
        },
      ],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 20
  const charsAfter = 50
  expect(() => ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toThrow(
    new Error('unable to parse line data'),
  )
})

test.skip('toTextSearchResult - match in the middle', () => {
  const parsedLine = {
    data: {
      absolute_offset: 0,
      line_number: 1,
      lines: {
        text: String.raw`# Program to display the Fibonacci sequence up to n-th term\n`,
      },
      path: { text: './languages/index.py' },
      submatches: [{ end: 33, match: { text: 'cc' }, start: 31 }],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 31,
      lineNumber: 1,
      start: 29,
      text: String.raw`Program to display the Fibonacci sequence up to n-th term\n`,
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - match at the end', () => {
  const parsedLine = {
    data: {
      absolute_offset: 0,
      line_number: 1,
      lines: {
        text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacc',
      },
      path: { text: './languages/a.txt' },
      submatches: [{ end: 313, match: { text: 'cc' }, start: 311 }],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 28,
      lineNumber: 1,
      start: 26,
      text: 'aaaaaaaaaaaaaaaaaaaaaaaaaacc',
      type: TextSearchResultType.Match,
    },
  ])
})

test('toTextSearchResult - short match', () => {
  const parsedLine = {
    data: {
      absolute_offset: 0,
      line_number: 1,
      lines: { text: 'abccc' },
      path: { text: './short.txt' },
      submatches: [{ end: 4, match: { text: 'cc' }, start: 2 }],
    },
    type: 'match',
  }
  const remaining = ''
  const charsBefore = 26
  const charsAfter = 50
  expect(ToTextSearchResult.toTextSearchResult(parsedLine, remaining, charsBefore, charsAfter)).toEqual([
    {
      end: 4,
      lineNumber: 1,
      start: 2,
      text: 'abccc',
      type: TextSearchResultType.Match,
    },
  ])
})
