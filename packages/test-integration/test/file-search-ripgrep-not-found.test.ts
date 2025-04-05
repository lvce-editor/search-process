import { test } from '@jest/globals'
import { setup } from '../src/setup.ts'

test.skip('ripgrep not found', async () => {
  const { testDir, rpc } = await setup()

  // TODO
})
