import dedent from 'dedent-js'
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.mjs'
import type { PyodideInterface } from 'pyodide'
import type { PyProxy } from 'pyodide/ffi'

type Message = {
  format: 'string' | 'matplotlib' | 'latex' | 'error'
  uid: string
}

export type Code = Message & { code: string }
export type Output = Message & { output: string }

let pyodide: PyodideInterface

async function load() {
  pyodide = await loadPyodide()
}
const loadPromise = load()

export async function runCode(code: string) {
  let format: Message['format'] = 'string'
  await loadPromise
  await pyodide.loadPackagesFromImports(code)

  if (code.includes('import matplotlib')) {
    await pyodide.runPythonAsync(`import os\nos.environ["MPLBACKEND"] = "AGG"`)
    code = dedent`
        import base64
        import io
        import matplotlib.pyplot as plt
        ${code}
        image_data = io.BytesIO()
        plt.savefig(image_data, format='png')
        plt.close()
        image_data.seek(0)
        base64_data = base64.b64encode(image_data.getvalue()).decode()
        f'data:image/png;base64,{base64_data}'
      `
    format = 'matplotlib'
  }

  const lines = code.split('\n')
  const lastLine = lines[lines.length - 1]
  const assignment = /^(\b\w+\b)\s*=[^=]/
  const match = lastLine.match(assignment)
  if (match) {
    code += `\n${match[1]}`
  } else if (code.includes('print') && !code.includes('def main')) {
    code += dedent`\n
      stdout = sys.stdout.getvalue()
      stdout
    `
  }

  let output
  try {
    await pyodide.runPythonAsync(dedent`
      import sys
      import io
      import js
      sys.stdout = io.StringIO()
      def input(p):
          return js.prompt(p)
    `)
    output = await pyodide.runPython(code)
    if (output && output._repr_latex_ !== undefined) {
      output = output._repr_latex_()
      output = output.substr(1, output.length - 2)
      format = 'latex'
    } else if (output && output.type === 'list' && output.toJs()[0]?._repr_latex_) {
      const list = output.toJs()
      output = list
        .map((element: PyProxy) => {
          const latex = element._repr_latex_()
          return latex.substring(1, latex.length - 1)
        })
        .join(',')
      output = `\\left[${output}\\right]`
      format = 'latex'
    } else {
      output = output ? String(output) : ''
    }
  } catch (error) {
    output = error
    format = 'error'
  }
  pyodide.runPythonAsync('sys.stdout = io.StringIO()')
  return { output, format }
}

export async function handleMessage(event: MessageEvent<Code>): Promise<Output> {
  let code = event.data.code
  const uid = event.data.uid
  let { output, format } = await runCode(code)
  return { output, uid, format } satisfies Output
}
