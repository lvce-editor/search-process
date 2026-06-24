import { Console } from 'node:console'
import { createWriteStream } from 'node:fs'
import { tmpdir } from 'node:os'

// TODO mock this module when used in unit tests

const createConsole = (): Console => {
  const logFile = `${tmpdir()}/log-shared-process.txt`
  const writeStream = createWriteStream(logFile)
  const logger = new Console(writeStream)
  return logger
}

interface State {
  console?: ReturnType<typeof createConsole>
}

const state: State = {}

const getOrCreateLogger = (): ReturnType<typeof createConsole> => {
  if (!state.console) {
    state.console = createConsole()
  }
  return state.console
}

export const info = (...args: readonly any[]): void => {
  const logger = getOrCreateLogger()
  logger.info(...args)
  console.info(...args)
}

export const error = (...args: readonly any[]): void => {
  const logger = getOrCreateLogger()
  logger.error(...args)
  console.error(...args)
}
