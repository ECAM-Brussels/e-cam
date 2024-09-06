import { createResource, Show } from 'solid-js'
import Math from '~/components/Math'
import runPython from '~/lib/pyodide/api'

type PythonProps = {
  value: string
}

export default function Python(props: PythonProps) {
  const [result] = createResource(() => props.value, async (code) => {
    return await runPython(code)
  })
  return (
    <p>
      <Show when={result.state === 'ready' && result()}>
        {(output) => (
          <>
            <Show when={output().format === 'latex'}>
              <Math value={output().output} displayMode />
            </Show>
            <Show when={output().format === 'matplotlib'}>
              <img src={output().output} alt="Matplotlib plot" />
            </Show>
            <Show when={output().format === 'error'}>{output().output}</Show>
            <Show when={output().format === 'string'}>
              <pre>{output().output}</pre>
            </Show>
          </>
        )}
      </Show>
    </p>
  )
}
