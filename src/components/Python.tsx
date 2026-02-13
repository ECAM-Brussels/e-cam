import { createAsync } from '@solidjs/router'
import { Show } from 'solid-js'
import Math from '~/components/Math'
import Spinner from '~/components/Spinner'
import runPython from '~/lib/pyodide/api'

type PythonProps = {
  value: string
}

function filter_error(error_str: string) {
  if (error_str.startsWith("Traceback")) {
    const lines = error_str.split(/\r?\n/);
    const res = [];
    res.push(lines[0])
    lines.splice(0, 1)
    let keep = false
    for (const line of lines) {
      if(line.trim().startsWith('File "<exec>"')) {
        keep = true
      }
      if (keep) {
        res.push(line)
      }
    }
    return res.join("\n")
  }
  else {
    return error_str
  }
}

export default function Python(props: PythonProps) {
  const result = createAsync(() => runPython(props.value))
  return (
    <p>
      <Show when={result()} fallback={<Spinner class="block m-auto" />}>
        {(output) => (
          <>
            <Show when={output().format === 'latex'}>
              <Math value={output().output} displayMode />
            </Show>
            <Show when={output().format === 'matplotlib'}>
              <img src={output().output} alt="Matplotlib plot" />
            </Show>
            <Show when={output().format === 'error' && output().output}>
              <pre class="text-red-800">{filter_error(output().output.message)}</pre>
            </Show>
            <Show when={output().format === 'string' && output().output}>
              <pre>{output().output}</pre>
            </Show>
          </>
        )}
      </Show>
    </p>
  )
}
