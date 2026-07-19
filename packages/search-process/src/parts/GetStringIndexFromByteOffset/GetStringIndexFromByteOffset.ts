export const getStringIndexFromByteOffset = (text: string, byteOffset: number): number => {
  return Buffer.from(text).subarray(0, byteOffset).toString().length
}
