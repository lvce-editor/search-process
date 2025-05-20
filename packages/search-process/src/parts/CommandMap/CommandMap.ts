import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as SearchFile from '../SearchFile/SearchFile.ts'
import * as TextSearch from '../TextSearch/TextSearch.ts'
import * as TextSearchIncremental from '../TextSearchIncremental/TextSearchIncremental.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'SearchFile.searchFile': SearchFile.searchFile,
  'TextSearch.search': TextSearch.search,
  'TextSearch.searchIncremental': TextSearchIncremental.textSearchIncremental,
}
