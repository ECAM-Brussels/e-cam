import Button from './Button'
import Math from './Math'
import { type MathfieldElement } from 'mathlive'
import { createSignal, For, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { z } from 'zod'

type SetInputProps = {
  name?: string
}

const intervalType = z.union([
  z.literal('closed'),
  z.literal('open'),
  z.literal('openclosed'),
  z.literal('closedopen'),
])

const interval = z.tuple([intervalType, z.string(), z.string()])

type IntervalType = z.infer<typeof intervalType>
type Interval = z.infer<typeof interval>

function latex(t: IntervalType, a?: string, b?: string, placeholder = false) {
  const del = {
    closed: ['[', ']'],
    open: [']', '['],
    openclosed: [']', ']'],
    closedopen: ['[', '['],
  } as const
  return String.raw`
    \left${del[t][0]}
      ${placeholder ? `\\placeholder[a]{` : ''}
      ${a}
      ${placeholder ? `}` : ''};
      ${placeholder ? `\\placeholder[b]{` : ''}
      ${b}
      ${placeholder ? `}` : ''}
    \right${del[t][1]}
  `
}

const labels = {
  closed: 'Intervalle fermé',
  open: 'Intervalle ouvert',
  openclosed: 'Intervalle ouvert-fermé',
  closedopen: 'Intervalle fermé-ouvert',
} as const

export default function SetInput(props: SetInputProps) {
  const [showModal, setShowModal] = createSignal(false)
  const [input, setInput] = createStore<Interval[]>([])
  const [interval, setInterval] = createStore<Interval>(['closed', '', ''])
  let mf!: MathfieldElement
  const addInterval = () => {
    setInput(input.length, [interval[0], mf.getPromptValue('a'), mf.getPromptValue('b')])
    mf.setPromptValue('a', '', {})
    mf.setPromptValue('b', '', {})
    setInterval(['closed', '', ''])
  }
  const tex = () => input.map((i) => latex(...i)).join('\\bigcup')
  return (
    <span onMouseEnter={() => setShowModal(true)} onMouseLeave={() => setShowModal(false)}>
      <Math class="border min-w-24 p-2" value={tex()} />
      <Show when={showModal()}>
        <span class="absolute flex bg-white p-4 rounded-xl">
          <label>
            Ajouter un{' '}
            <select
              value={interval[0]}
              onChange={(e) =>
                setInterval([
                  e.target.value as IntervalType,
                  mf.getPromptValue('a'),
                  mf.getPromptValue('b'),
                ])
              }
            >
              <For each={Object.keys(labels).map((key) => [key, labels[key as IntervalType]])}>
                {([value, label]) => <option value={value}>{label}</option>}
              </For>
            </select>
            : <Math ref={mf} editable readOnly value={latex(...interval, true)} displayMode />
          </label>
          <Button color="green" onClick={addInterval}>
            +
          </Button>
          <Button type="button" onClick={() => setInput([])}>
            Reset
          </Button>
        </span>
      </Show>
      <input type="hidden" name={props.name} value={JSON.stringify(input)} />
    </span>
  )
}
