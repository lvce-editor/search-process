#!/usr/bin/env node

import { env } from 'node:process'

const port = parseInt(env.LVCE_SEARCH_PROCESS_PORT || '')

const getResponse = async () => {
  const response = await fetch(`http://localhost:${port}`)
  const json = await response.json()
  return json
}

const main = async () => {
  const result1 = await getResponse()

  // const response=await fetch(`http://localhost:${port}`)
}

main()
