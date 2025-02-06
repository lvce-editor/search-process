import { execa } from 'execa'
import * as Assert from '../Assert/Assert.ts'

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  const { stdout, stderr } = await execa(command, args, options)
  return {
    stdout,
    stderr,
  }
}
