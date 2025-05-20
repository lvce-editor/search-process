import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { HandleData } from '../HandleData/HandleData.ts'

export const processData = async (stdout: any, handleData: HandleData): Promise<void> => {
  await pipeline(
    stdout,
    new Writable({
      decodeStrings: false,
      construct(callback): void {
        callback()
      },
      write(chunk, encoding, callback): void {
        try {
          handleData(chunk)
          callback()
        } catch (error) {
          callback(error)
        }
      },
    }),
  )
}
