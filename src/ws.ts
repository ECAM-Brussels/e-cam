import { eventHandler } from 'vinxi/http'

const peers = new Set()

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      peers.add(peer)
    },
    async message(peer, msg) {
      console.log('Message received: ', msg.text())
      for (const p of peers) {
        ;(p as typeof peer).send(msg.text())
      }
    },
    async close(peer) {
      peers.delete(peer)
    },
  },
})
