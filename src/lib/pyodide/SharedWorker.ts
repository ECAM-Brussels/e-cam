//// <reference path="../../../node_modules/@types/sharedworker/index.d.ts" />

import { handleMessage } from "./common"

onconnect = (e: MessageEvent) => {
  const port = e.ports[0]

  port.onmessage = async (event: MessageEvent) => {
    const output = await handleMessage(event)
    port.postMessage(output)
  }
}
