import { app, utilityProcess } from 'electron'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
console.log(__dirname)
const root = join(__dirname, '..', '..', '..', '..')

// const searchProcessPath = join(root, '.tmp', 'dist', 'dist', 'index.js')
const searchProcessPath = join(root, 'packages', 'search-process', 'dist', 'index.js')

const launchUtilityProcess = (path, argv) => {
  const childProcess = utilityProcess.fork(path, argv, {
    stdio: 'pipe',
  })
  childProcess.stdout?.pipe(process.stdout)
  childProcess.stderr?.pipe(process.stderr)
  return childProcess
}

const main = async () => {
  await app.whenReady()
  console.log({ searchProcessPath })
  console.log('before launch')

  const searchProcess = launchUtilityProcess(searchProcessPath, ['--ipc-type=electron-utility-process'])
  searchProcess.on('exit', (code) => {
    console.log('search process exited', code)
  })
  console.log('after launch')

  // searchProcess.on('message', (message) => {
  //   win.webContents.send('search-process-message', message)
  // })

  // win.webContents.on('ipc-message', (event, channel, ...args) => {
  //   if (channel === 'search-process-command') {
  //     searchProcess.postMessage(args[0])
  //   }
  // })
}

main()
