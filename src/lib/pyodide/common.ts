import dedent from 'dedent-js'
import { loadPyodide } from 'pyodide'
import type { PyodideInterface } from 'pyodide'
import type { PyProxy } from 'pyodide/ffi'

type Message = {
  format: 'string' | 'matplotlib' | 'latex' | 'error'
  uid: string
  stdout: string
}

export type Code = Message & { code: string }
export type Output = Message & { output: string }

let pyodide: PyodideInterface

async function load() {
  pyodide = await loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
  })
  pyodide.setStdin({ stdin: () => prompt() })
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
  }

  let output
  let stdout: string = ''
  try {
    pyodide.runPython(dedent`
      import sys
      import io
      sys.stdout = io.StringIO()
    `)
    output = await pyodide.runPythonAsync(code)
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
  stdout = pyodide.runPython('sys.stdout.getvalue()')
  return { output, format, stdout }
}

export async function handleMessage(event: MessageEvent<Code>): Promise<Output> {
  let code = event.data.code
  const uid = event.data.uid
  let { output, format, stdout } = await runCode(code)
  return { output, uid, format, stdout } satisfies Output
}
