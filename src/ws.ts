import { eventHandler } from 'vinxi/http'

const peers = new Set()

export default eventHandler({
  handler() {},
  websocket: {
    async open(peer) {
      peers.add(peer)
    },
    async message(peer, msg) {
      for (const p of peers) {
        if (p !== peer) {
          ;(p as typeof peer).send(msg.text())
        }
      }
    },
    async close(peer) {
      peers.delete(peer)
    },
  },
})
