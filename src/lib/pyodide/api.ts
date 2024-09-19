import { runCode, type Code, type Output } from '~/lib/pyodide/common'

const stack: { [uid: string]: (msg: Output) => void } = {}

export default function runPython(
  code: string,
  useWorker: boolean | undefined = undefined,
): Promise<Output> {
  if (code.includes('input(') && useWorker === undefined) {
    useWorker = false
  }
  return new Promise((resolve) => {
    const uid = Date.now().toString(36) + Math.random().toString(36)
    if (!code) {
      resolve({ output: '', uid, format: 'string', stdout: '' })
    }
    stack[uid] = resolve

    if (window.SharedWorker && useWorker) {
      const worker = new SharedWorker(new URL('./SharedWorker.ts', import.meta.url), {
        type: 'module',
      })

      worker.port.onmessage = (event: MessageEvent<Output>) => {
        const resolve = stack[event.data.uid]
        delete stack[event.data.uid]
        resolve(event.data)
      }
      worker.port.postMessage({ code, uid } as Code)
    } else if (window.Worker && useWorker) {
      const worker = new Worker(new URL('./Worker.ts', import.meta.url), {
        type: 'module',
      })

      worker.onmessage = (event: MessageEvent<Output>) => {
        const resolve = stack[event.data.uid]
        delete stack[event.data.uid]
        resolve(event.data)
      }
      worker.postMessage({ code, uid } as Code)
    } else {
      runCode(code).then(({ format, output, stdout }) => {
        resolve({ uid, format, output, stdout })
      })
    }
  })
}
