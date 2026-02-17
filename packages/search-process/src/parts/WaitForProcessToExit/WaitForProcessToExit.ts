import type { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'
import type { ExitEvent } from '../ExitEvent/ExitEvent.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'

export const waitForProcessToExit = (childProcess: BaseChildProcess): Promise<ExitEvent> => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    close: ProcessExitEventType.Exit,
    error: ProcessExitEventType.Error,
  })
}
