import Button from './Button'
import Math from './Math'
import { type MathfieldElement } from 'mathlive'
import { createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'

type SetInputProps = {
  name?: string
}

const interval = z.tuple([
  z.literal('Interval'),
  z.string(),
  z.string(),
  z.boolean().default(false),
  z.boolean().default(false),
])

const set = z.tuple([z.literal('Union')]).rest(interval)

type Interval = z.infer<typeof interval>
type Set = z.infer<typeof set>

function latex(I: Interval, placeholder = false) {
  return String.raw`
    \left${I[3] ? ']' : '['}
      ${placeholder ? `\\placeholder[a]{` : ''}
      ${I[1]}
      ${placeholder ? `}` : ''};
      ${placeholder ? `\\placeholder[b]{` : ''}
      ${I[2]}
      ${placeholder ? `}` : ''}
    \right${I[4] ? '[' : ']'}
  `
}

const labels: { [key: string]: [string, boolean, boolean] } = {
  closed: ['Intervalle fermé', false, false],
  open: ['Intervalle ouvert', true, true],
  openclosed: ['Intervalle ouvert-fermé', true, false],
  closedopen: ['Intervalle fermé-ouvert', false, true],
}

export default function SetInput(props: SetInputProps) {
  const [showModal, setShowModal] = createSignal(false)
  const [input, setInput] = createStore<Set>(['Union'])
  const [interval, setInterval] = createStore<Interval>(['Interval', '', '', false, false])
  let mf!: MathfieldElement
  const addInterval = () => {
    setInput(input.length, [
      'Interval',
      mf.getPromptValue('a'),
      mf.getPromptValue('b'),
      interval[3],
      interval[4],
    ])
    mf.setPromptValue('a', '', {})
    mf.setPromptValue('b', '', {})
    setInterval(1, '')
    setInterval(2, '')
  }
  const tex = () => (input.slice(1) as Interval[]).map((i) => latex(i)).join('\\bigcup')
  return (
    <span onMouseEnter={() => setShowModal(true)} onMouseLeave={() => setShowModal(false)}>
      <Math class="border min-w-24 p-2" value={tex()} />
      <Show when={showModal()}>
        <span class="absolute flex bg-white p-4 rounded-xl">
          <label>
            Ajouter un{' '}
            <select
              value="closed"
              onChange={(e) => {
                const params = labels[e.target.value]
                setInterval([
                  'Interval',
                  mf.getPromptValue('a'),
                  mf.getPromptValue('b'),
                  params[1],
                  params[2],
                ])
              }}
            >
              <For
                each={Object.keys(labels).map(
                  (key) => [key, ...labels[key as keyof typeof labels]] as const,
                )}
              >
                {([value, label]) => <option value={value}>{label}</option>}
              </For>
            </select>
            : <Math ref={mf} editable readOnly value={latex(interval, true)} displayMode />
          </label>
          <Button color="green" onClick={addInterval}>
            +
          </Button>
          <Button type="button" onClick={() => setInput(['Union'])}>
            Reset
          </Button>
        </span>
      </Show>
      <input type="hidden" name={props.name} value={JSON.stringify(input)} />
    </span>
  )
}
