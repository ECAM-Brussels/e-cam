import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { createAsync } from '@solidjs/router'
import { clientOnly } from '@solidjs/start'
import { createEffect, createSignal, on, Show } from 'solid-js'
import Fa from '~/components/Fa'
import Html from '~/components/Html'
import Javascript from '~/components/Javascript'
import { getUser } from '~/lib/auth/session'

type CodeProps = {
  class?: string
  framework?: 'react'
  tailwind?: boolean
  lang: string
  readOnly?: boolean
  run?: boolean
  runImmediately?: boolean
  onCodeUpdate?: (newValue: string) => void
  value: string
  hideUntil?: Date | string
}

const Editor = clientOnly(() => import('./PrismEditor'))
const Python = clientOnly(() => import('./Python'))

export default function Code(props: CodeProps) {
  const [value, setValue] = createSignal('')
  const [index, setIndex] = createSignal(0)
  const fragments = () => props.value.split(/^.*---\s*fragment$/m).map((p) => p.trim())

  const [codeToRun, setCodeToRun] = createSignal(props.runImmediately ? props.value : '')
  createEffect(() => {
    const value = fragments()[index() % fragments().length]
    setValue(value)
    setCodeToRun(props.runImmediately ? value : '')
  })
  createEffect(
    on(value, () => {
      props.onCodeUpdate?.(value())
    }),
  )

  const user = createAsync(() => getUser())

  let textarea: HTMLTextAreaElement

  return (
    <div class={`m-8 ${props.class}`}>
      <div class="flex items-end relative z-20">
        <Show when={props.run}>
          <button
            class="block text-cyan-950 px-2 text-xl"
            onClick={() => {
              setCodeToRun('')
              setCodeToRun(textarea.value)
            }}
          >
            <Fa icon={faPlayCircle} />
          </button>
        </Show>
        <div class="border rounded-xl shadow w-full">
          <Editor
            language={props.lang}
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
      <Show
        when={
          fragments().length > 1 &&
          (user()?.admin || !props.hideUntil || new Date() >= new Date(props.hideUntil))
        }
      >
        <button
          class="relative z-20 text-sm"
          onClick={() => {
            setIndex((index() + 1) % fragments().length)
          }}
        >
          {index() === 0 ? 'Solution' : 'Reset'}
        </button>
      </Show>
      <Show when={props.lang === 'python' && props.run}>
        <Python value={codeToRun()} />
      </Show>
      <Show when={props.lang === 'html' && props.run}>
        <Html value={codeToRun()} tailwind={props.tailwind} />
      </Show>
      <Show when={props.lang === 'tsx' && props.run}>
        <Javascript value={codeToRun()} framework={props.framework} tailwind={props.tailwind} />
      </Show>
    </div>
  )
}
