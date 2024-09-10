import type { APIEvent } from '@solidjs/start/server'
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ noServer: true })
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      client.send(String(message))
    })
  })
})

export function GET(event: APIEvent) {
  const request = event.nativeEvent.node.req
  wss.handleUpgrade(request, request.socket, Buffer.from(''), (ws) => {
    wss.emit('connection', ws, request)
  })
}
