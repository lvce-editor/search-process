import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { HandleData } from '../HandleData/HandleData.ts'

export const processData = async (stdout: any, handleData: HandleData): Promise<void> => {
  await pipeline(
    stdout,
    new Writable({
      construct(callback): void {
        callback()
      },
      decodeStrings: false,
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
