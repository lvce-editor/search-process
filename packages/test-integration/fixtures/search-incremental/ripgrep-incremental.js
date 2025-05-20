#!/usr/bin/env node

import { env } from 'node:process'

const port = parseInt(env.LVCE_SEARCH_PROCESS_PORT || '')

/**
 *
 * @param {number} id
 * @returns {Promise<any>}
 */
const getResponse = async (id) => {
  const response = await fetch(`http://localhost:${port}/${id}`)
  const json = await response.json()
  return json
}

const main = async () => {
  console.error('before request 1')
  const result1 = await getResponse(1)
  console.error('after request 1')
  process.stdout.write(result1.stdout)
  const result2 = await getResponse(2)
  process.stdout.write(result2.stdout)
  const result3 = await getResponse(3)
  process.stdout.write(result3.stdout)
}

main()
