import type { Rpc } from '@lvce-editor/rpc'
import { beforeEach, expect, jest, test } from '@jest/globals'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const spawn = jest.fn((_args: readonly string[], _options: { readonly cwd: string }) => ({
  kill: jest.fn(),
  stdout: {},
}))

jest.unstable_mockModule('../src/parts/RipGrep/RipGrep.ts', () => ({ spawn }))
jest.unstable_mockModule('../src/parts/CollectTextSearchStdoutIncremental/CollectTextSearchStdoutIncremental.ts', () => ({
  collectStdoutIncremental: jest.fn(async () => ({ limitHit: false, stats: {} })),
}))
jest.unstable_mockModule('../src/parts/CollectTextSearchStdoutPull/CollectTextSearchStdoutPull.ts', () => ({
  collectStdoutPull: jest.fn(async () => ({ limitHit: false, stats: {} })),
}))
jest.unstable_mockModule('../src/parts/WaitForProcessToExit/WaitForProcessToExit.ts', () => ({
  waitForProcessToExit: jest.fn(async () => ({ event: undefined, type: 2 })),
}))

const { textSearchIncremental } = await import('../src/parts/TextSearchIncremental/TextSearchIncremental.ts')
const { textSearchPull } = await import('../src/parts/TextSearchPull/TextSearchPull.ts')

beforeEach(() => {
  jest.clearAllMocks()
})

test.each(['incremental', 'pull'])('%s search converts the workspace URI at the process boundary', async (mode) => {
  const workspacePath = join(tmpdir(), 'project files #100%')
  const searchDir = pathToFileURL(workspacePath).href
  const ripGrepArgs = ['--json', 'needle', '.']

  if (mode === 'incremental') {
    await textSearchIncremental({ id: 'search', ripGrepArgs, searchDir })
  } else {
    const rpc = { send: jest.fn() } as unknown as Rpc
    await textSearchPull(rpc, {
      charsAfter: 50,
      charsBefore: 26,
      id: 'search',
      ripGrepArgs,
      searchDir,
      searchId: 'search',
      uid: 1,
    })
  }

  expect(spawn).toHaveBeenCalledWith(ripGrepArgs, { cwd: workspacePath })
})
