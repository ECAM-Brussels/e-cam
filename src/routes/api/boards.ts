import type { APIEvent } from '@solidjs/start/server'
import crossws from 'crossws/adapters/node'
import type { IncomingMessage } from 'node:http'

const websocket = crossws({
  hooks: {
    open(peer) {
      console.log('[ws] open', peer)
      peer.subscribe('boards')
    },

    message(peer, message) {
      peer.publish('boards', message.text())
    },

    close(peer, event) {
      console.log('[ws] close', peer, event)
    },

    error(peer, error) {
      console.log('[ws] error', peer, error)
    },

    upgrade(req) {
      console.log(`[ws] upgrading ${req.url}...`)
      return {
        headers: {},
      }
    },
  },
})

const emptyBuffer = Buffer.from('')
const handleUpgrade = (request: IncomingMessage) =>
  websocket.handleUpgrade(request, request.socket, emptyBuffer)

const isWsConnect = ({ headers }: IncomingMessage) =>
  headers['connection']?.toLowerCase().includes('upgrade') &&
  headers['upgrade'] === 'websocket' &&
  headers['sec-websocket-version'] === '13' &&
  typeof headers['sec-websocket-key'] === 'string'

export function GET(event: APIEvent) {
  const request = event.nativeEvent.node.req
  if (!isWsConnect(request))
    return new Response(undefined, { status: 400, statusText: 'Bad Request' })

  handleUpgrade(request)

  return undefined
}
