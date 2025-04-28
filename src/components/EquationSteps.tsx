import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { For, type JSXElement, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { Dynamic } from 'solid-js/web'
import Fa from '~/components/Fa'

type Side = (props: { value: string; i?: number }) => JSXElement

type EquationStepsProps = {
  lhs: Side
  rhs: Side
  values: [string, string][]
}

export default function EquationSteps(props: EquationStepsProps) {
  const [lines, setLines] = createStore(props.values || ['', ''])
  return (
    <For each={lines}>
      {(line, i) => (
        <div class="grid grid-cols-2 justify-center items-center gap-2 my-1">
          <Dynamic component={props.lhs} value={line[0]} i={i()} />
          <div class="flex gap-2">
            <Dynamic component={props.rhs} value={line[1]} i={i()} />
            <button type="button" onClick={() => setLines(lines.length, lines[i()])}>
              <Fa icon={faPlus} />
            </button>
            <Show when={i() > 0}>
              <button
                type="button"
                onClick={() => setLines(lines.filter((_, index) => index !== i()))}
              >
                <Fa icon={faTrash} />
              </button>
            </Show>
          </div>
        </div>
      )}
    </For>
  )
}
