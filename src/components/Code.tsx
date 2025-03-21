import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { createAsync } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { formatDistance } from 'date-fns'
import { createEffect, createSignal, on, onCleanup, Show } from 'solid-js'
import Fa from '~/components/Fa'
import Html from '~/components/Html'
import { getUser } from '~/lib/auth/session'

type CodeProps = {
  class?: string
  hideEditor?: boolean
  framework?: 'react' | 'svelte'
  tailwind?: boolean
  lang: string
  name?: string
  readOnly?: boolean
  run?: boolean
  runImmediately?: boolean
  onCodeUpdate?: (newValue: string) => void
  value: string
  hideUntil?: Date | string
}

const Editor = clientOnly(() => import('./PrismEditor'))
const Dot = clientOnly(() => import('./Dot'))
const Javascript = clientOnly(() => import('./Javascript'))
const Python = clientOnly(() => import('./Python'))

export default function Code(props: CodeProps) {
  const lang = () => {
    if (props.framework === 'svelte') {
      return 'html'
    }
    return props.lang
  }
  const [value, setValue] = createSignal('')
  const [index, setIndex] = createSignal(0)
  const parts = () => props.value.split(/^.*---\s*start$/m).map((p) => p.trim())
  const before = () => (parts().length === 1 ? '' : parts()[0] + '\n')
  const main = () => (parts().length <= 1 ? props.value : parts()[1])
  const fragments = () =>
    main()
      .split(/^.*---\s*fragment$/m)
      .map((p) => p.trim())

  const [codeToRun, setCodeToRun] = createSignal(props.runImmediately ? props.value : '')
  createEffect(() => {
    const value = fragments()[index() % fragments().length]
    setValue(value)
    setCodeToRun(props.runImmediately ? before() + value : '')
  })
  createEffect(
    on(value, () => {
      props.onCodeUpdate?.(value())
    }),
  )

  const [now, setNow] = createSignal(new Date())
  const clock = setInterval(() => {
    setNow(new Date())
  }, 1000)
  onCleanup(() => {
    clearInterval(clock)
  })

  const user = createAsync(() => getUser())

  let textarea: HTMLTextAreaElement

  return (
    <div class={`m-8 ${props.class}`}>
      <Show when={!props.hideEditor}>
        <div class="flex items-end relative z-20">
          <Show when={props.run}>
            <button
              class="block text-cyan-950 px-2 text-xl"
              onClick={() => {
                setCodeToRun('')
                setCodeToRun(before() + textarea.value)
              }}
            >
              <Fa icon={faPlayCircle} />
            </button>
          </Show>
          <div class="border rounded-xl shadow w-full">
            <Editor
              name={props.name}
              language={lang()}
              value={value()}
              readOnly={props.readOnly}
              onMount={(editor) => {
                textarea = editor.textarea
                textarea.addEventListener('blur', (event) => {
                  setValue(textarea.value)
                })
                textarea.addEventListener('keydown', (event) => {
                  if (event.code === 'Enter') {
                    event.stopPropagation()
                  }
                  if (event.code === 'Enter' && (event.shiftKey || event.ctrlKey)) {
                    event.preventDefault()
                    setCodeToRun('')
                    setCodeToRun(textarea.value)
                  }
                })
              }}
            />
          </div>
        </div>
      </Show>
      <Show when={fragments().length > 1}>
        <Show
          when={user()?.admin || !props.hideUntil || now() >= new Date(props.hideUntil)}
          fallback={
            <p class="text-sm">
              Solution available in {formatDistance(now(), new Date(props.hideUntil!))}
            </p>
          }
        >
          <button
            class="relative z-20 text-sm"
            onClick={() => {
              setIndex((index() + 1) % fragments().length)
            }}
          >
            {index() === 0 ? 'Solution ' : 'Reset'}
            <Show when={props.hideUntil && now() < new Date(props.hideUntil) && index() === 0}>
              (available to students in {formatDistance(now(), new Date(props.hideUntil!))})
            </Show>
          </button>
        </Show>
      </Show>
      <Show when={props.lang === 'python' && props.run}>
        <Python value={codeToRun()} />
      </Show>
      <Show when={props.lang === 'html' && props.run}>
        <Html value={codeToRun()} tailwind={props.tailwind} />
      </Show>
      <Show
        when={['tsx', 'js', 'ts', 'javascript', 'typescript'].includes(props.lang) && props.run}
      >
        <Javascript value={codeToRun()} framework={props.framework} tailwind={props.tailwind} />
      </Show>
      <Show when={props.lang === 'dot' && props.run}>
        <Dot value={codeToRun()} />
      </Show>
    </div>
  )
}
