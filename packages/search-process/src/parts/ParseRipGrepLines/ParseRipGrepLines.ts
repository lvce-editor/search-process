import * as EncodingType from '../EncodingType/EncodingType.ts'

export const parseRipGrepLines = (parsedLineData: any): any => {
  if (parsedLineData.lines.text) {
    return parsedLineData.lines.text
  }
  if (parsedLineData.lines.bytes) {
    return Buffer.from(parsedLineData.lines.bytes, EncodingType.Base64).toString()
  }
  throw new Error(`unable to parse line data`)
}
