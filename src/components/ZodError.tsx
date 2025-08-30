import { For, Show } from 'solid-js'
import { z } from 'zod'

type ZodErrorProps = {
  error?: z.ZodError
}
export default function ZodError(props: ZodErrorProps) {
  const error = () => props.error?.flatten()
  return (
    <Show when={props.error}>
      <div class="my-4 bg-red-50 rounded-r-xl p-4 border-l-8 border-red-800">
        <h3 class="text-red-800 text-xl mb-4">Validation Error</h3>
        <For each={Object.entries(error()?.fieldErrors ?? {})}>
          {([name, error]) => (
            <li>
              <strong>{name}</strong>: {String(error)}
            </li>
          )}
        </For>
      </div>
    </Show>
  )
}
