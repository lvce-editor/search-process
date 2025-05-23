import { expect, test } from '@jest/globals'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.ts'

const TextSearch = await import('../src/parts/TextSearch/TextSearch.ts')

// TODO move this to integration tests
const getTmpDir = (): Promise<string> => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const fixPath = (path: string): string => {
  return path.replaceAll('/', sep)
}

const TIMEOUT_LONG = 20_000

test(
  'search',
  async () => {
    const tmpDir = await getTmpDir()
    await writeFile(
      join(tmpDir, 'index.html'),
      `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body></body>
</html>
`,
    )
    const options = {
      ripGrepArgs: [
        '--smart-case',
        '--stats',
        '--json',
        '--threads',
        '1',
        '--ignore-case',
        '--fixed-strings',
        '--',
        'Document',
        '.',
      ],
      searchDir: tmpDir,
    }
    // @ts-ignore
    expect(await TextSearch.search(options)).toEqual({
      results: [
        {
          type: TextSearchResultType.File,
          text: fixPath('./index.html'),
          lineNumber: 0,
          start: 0,
          end: 0,
        },
        {
          type: TextSearchResultType.Match,
          lineNumber: 6,
          start: 11,
          end: 19,
          text: '    <title>Document</title>\n',
        },
      ],
      stats: expect.any(Object),
      limitHit: false,
    })
  },
  TIMEOUT_LONG,
)
