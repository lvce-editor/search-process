import * as Character from '../Character/Character.ts'

export const getNewLineIndex = (string: string, startIndex: number = 0): number => {
  return string.indexOf(Character.NewLine, startIndex)
}
