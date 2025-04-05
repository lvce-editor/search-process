import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'quickpick.handle-wheel'

export const test: Test = async ({ Locator, expect, QuickPick, Command }) => {
  // arrange
  await QuickPick.open()
  await QuickPick.setValue('> ')
  const first = Locator('.QuickPickItem').nth(0)
  await expect(first).toHaveText('Layout: Toggle Side Bar')

  // act
  await Command.execute('QuickPick.handleWheel', 0, 125)

  // assert
  await expect(first).toHaveText('Focus: Output')
}
