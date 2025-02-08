import * as Env from '../Env/Env.ts'
import * as RgPath from '../RipGrepPath/RipGrepPath.ts'

export const ripGrepPath = Env.getRipGrepPath() || RgPath.rgPath
