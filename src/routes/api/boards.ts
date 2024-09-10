import type { APIEvent } from '@solidjs/start/server'
import crossws from 'crossws/adapters/node'

const websocket = crossws({
  hooks: {
    open(peer) {
      console.log('[ws] open', peer)
      peer.subscribe('boards')
    },

    message(peer, message) {
      peer.publish('boards', message.text())
      peer.send(message.text())
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

export function GET(event: APIEvent) {
  const request = event.nativeEvent.node.req
  websocket.handleUpgrade(request, request.socket, Buffer.from(''))
}
