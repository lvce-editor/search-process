import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'quickpick.handle-click-at'

export const test: Test = async ({ Locator, expect, QuickPick, Command }) => {
  // arrange
  await QuickPick.open()
  await QuickPick.setValue('> About')

  // act
  await QuickPick.handleClickAt(0, 80)

  // assert
  const dialogContent = Locator('.DialogContent')
  await expect(dialogContent).toBeVisible()
  const infoIcon = dialogContent.locator('.DialogInfoIcon')
  await expect(infoIcon).toBeVisible()
}
