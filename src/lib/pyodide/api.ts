import { type Code, type Output } from '~/lib/pyodide/common'

const stack: { [uid: string]: (msg: Output) => void } = {}

export default function runPython(code: string): Promise<Output> {
  return new Promise((resolve) => {
    const uid = Date.now().toString(36) + Math.random().toString(36)
    if (!code) {
      resolve({ output: '', uid, format: 'string' })
    }
    stack[uid] = resolve

    if (window.SharedWorker) {
      const worker = new SharedWorker(new URL('./SharedWorker.ts', import.meta.url), {
        type: 'module',
      })

      worker.port.onmessage = (event: MessageEvent<Output>) => {
        const resolve = stack[event.data.uid]
        delete stack[event.data.uid]
        resolve(event.data)
      }
      worker.port.postMessage({ code, uid } as Code)
    } else if (window.Worker) {
      const worker = new Worker(new URL('./Worker.ts', import.meta.url), {
        type: 'module',
      })

      worker.onmessage = (event: MessageEvent<Output>) => {
        const resolve = stack[event.data.uid]
        delete stack[event.data.uid]
        resolve(event.data)
      }
      worker.postMessage({ code, uid } as Code)
    }
  })
}
