import { handleMessage } from './common'

self.onmessage = async (event: MessageEvent) => {
  const output = handleMessage(event)
  self.postMessage(output)
}
