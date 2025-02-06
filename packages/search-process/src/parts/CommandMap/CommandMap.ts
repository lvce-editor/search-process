import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as SearchFile from '../SearchFile/SearchFile.ts'
import * as TextSearch from '../TextSearch/TextSearch.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'SearchFile.searchFile': SearchFile.searchFile,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'TextSearch.search': TextSearch.search,
}
