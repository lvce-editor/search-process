import { execa } from 'execa'

export const getWsVersion = async (cwd) => {
  const { stdout } = await execa('npm', ['ls', 'ws', '--json'], {
    cwd,
  })
  const parsed = JSON.parse(stdout)
  const wsVersion =
    parsed.dependencies['@lvce-editor/rpc'].dependencies['@lvce-editor/ipc'].dependencies['@lvce-editor/web-socket-server']
      .dependencies['ws'].version
  return wsVersion
}
