import * as GetIncrementalResults from '../GetIncrementalResults/GetIncrementalResults.ts'
import * as GetPullProgress from '../GetPullProgress/GetPullProgress.ts'
import * as GetPullResults from '../GetPullResults/GetPullResults.ts'
import * as HandleElectronMessagePort from '../HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleWebSocket from '../HandleWebSocket/HandleWebSocket.ts'
import * as SearchFile from '../SearchFile/SearchFile.ts'
import * as TextSearch from '../TextSearch/TextSearch.ts'
import * as TextSearchIncremental from '../TextSearchIncremental/TextSearchIncremental.ts'
import * as TextSearchPull from '../TextSearchPull/TextSearchPull.ts'

export const commandMap = {
  'HandleElectronMessagePort.handleElectronMessagePort': HandleElectronMessagePort.handleElectronMessagePort,
  'HandleWebSocket.handleWebSocket': HandleWebSocket.handleWebSocket,
  'SearchFile.searchFile': SearchFile.searchFile,
  'TextSearch.getIncrementalResults': GetIncrementalResults.getIncrementalResults,
  'TextSearch.getPullProgress': GetPullProgress.getPullProgress,
  'TextSearch.getPullResults': GetPullResults.getPullResults,
  'TextSearch.search': TextSearch.search,
  'TextSearch.searchIncremental': TextSearchIncremental.textSearchIncremental,
  'TextSearch.searchPull': TextSearchPull.textSearchPull,
}
