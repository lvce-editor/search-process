import { watch } from 'rollup'
import { options } from './bundleJs.js'

const watcher = watch(options)

watcher.on('event', (event) => {
  if (event.code === 'ERROR') {
    process.stderr.write(`${event.error.stack || event.error.message}\n`)
  } else if (event.code === 'END') {
    process.stdout.write('[watch] build finished, watching for changes...\n')
  }
})
