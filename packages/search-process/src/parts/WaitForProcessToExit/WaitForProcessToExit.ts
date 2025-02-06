import { BaseChildProcess } from '../BaseChildProcess/BaseChildProcess.ts'
import * as GetFirstEvent from '../GetFirstEvent/GetFirstEvent.ts'
import * as ProcessExitEventType from '../ProcessExitEventType/ProcessExitEventType.ts'

export const waitForProcessToExit = (
  childProcess: BaseChildProcess,
): Promise<any> => {
  return GetFirstEvent.getFirstEvent(childProcess, {
    error: ProcessExitEventType.Error,
    close: ProcessExitEventType.Exit,
  })
}
