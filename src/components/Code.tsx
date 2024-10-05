import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { clientOnly } from '@solidjs/start'
import { createEffect, createSignal, on, Show } from 'solid-js'
import Fa from '~/components/Fa'
import Html from '~/components/Html'

type CodeProps = {
  class?: string
  lang: string
  readOnly?: boolean
  run?: boolean
  runImmediately?: boolean
  onCodeUpdate?: (newValue: string) => void
  value: string
}

const Editor = clientOnly(() => import('./PrismEditor'))
const Python = clientOnly(() => import('./Python'))

export default function Code(props: CodeProps) {
  const [value, setValue] = createSignal(props.value)
  const [codeToRun, setCodeToRun] = createSignal(props.runImmediately ? props.value : '')
  createEffect(() => {
    setValue(props.value)
    setCodeToRun(props.runImmediately ? props.value : '')
  })
  createEffect(
    on(value, () => {
      props.onCodeUpdate?.(value())
    }),
  )

  let textarea: HTMLTextAreaElement

  return (
    <div class={`m-8 ${props.class}`}>
      <div class="flex items-end relative z-20">
        <button
          class="block text-cyan-950 px-2 text-xl"
          onClick={() => {
            setCodeToRun('')
            setCodeToRun(textarea.value)
          }}
        >
          <Fa icon={faPlayCircle} />
        </button>
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
      <Show when={props.lang === 'python' && props.run}>
        <Python value={codeToRun()} />
      </Show>
      <Show when={props.lang === 'html' && props.run}>
        <Html value={codeToRun()} />
      </Show>
    </div>
  )
}
