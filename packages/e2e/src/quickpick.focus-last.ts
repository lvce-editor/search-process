import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'quickpick.focus-next'

export const test: Test = async ({ Locator, expect, QuickPick, Command }) => {
  // arrange
  await QuickPick.open()
  await QuickPick.setValue('> Layout')
  await QuickPick.focusIndex(1)

  // act
  await QuickPick.focusLast()

  // assert
  const activeItem = Locator('.QuickPickItemActive')
  await expect(activeItem).toHaveText('Layout: Show E2E Tests')
}
