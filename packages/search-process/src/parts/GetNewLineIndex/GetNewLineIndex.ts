import * as Character from '../Character/Character.ts'

export const getNewLineIndex = (string: string, startIndex: number | undefined = undefined): number => {
  return string.indexOf(Character.NewLine, startIndex)
}
