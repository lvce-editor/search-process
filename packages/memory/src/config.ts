import { join } from 'node:path'
import { root } from './root.ts'

export const instantiations = 4500

export const instantiationsPath = join(root, 'packages', 'search-process')
