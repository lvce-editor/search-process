import type { Options } from 'execa';
import { execa } from 'execa'
import * as Assert from '../Assert/Assert.ts'

export const exec = async (command: string, args: readonly string[], options: Options): Promise<any> => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await execa(command, args, options)
  return {
    stdout,
    stderr,
  }
}
