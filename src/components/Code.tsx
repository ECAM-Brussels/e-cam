import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'
import { clientOnly } from '@solidjs/start'
import { createEffect, createSignal, Show } from 'solid-js'
import 'solid-prism-editor/layout.css'
import 'solid-prism-editor/prism/languages/common'
import 'solid-prism-editor/search.css'
import 'solid-prism-editor/themes/github-light.css'
import Fa from '~/components/Fa'
import Html from '~/components/Html'

type CodeProps = {
  class?: string
  lang: string
  readOnly?: boolean
  run?: boolean
  onCodeUpdate?: (newValue: string) => void
  value: string
}

const Editor = clientOnly(async () => {
  const module = await import('solid-prism-editor')
  return { default: module.Editor }
})
const Python = clientOnly(() => import('./Python'))

export default function Code(props: CodeProps) {
  const [value, setValue] = createSignal(props.value)
  createEffect(() => {
    setValue(props.value)
  })

  createEffect(() => {
    props.onCodeUpdate?.(value())
  })

  let textarea: HTMLTextAreaElement

  return (
    <div class={`m-8 ${props.class}`}>
      <div class="flex items-end relative z-20">
        <button
          class="block text-cyan-950 px-2 text-xl"
          onClick={() => {
            setValue(textarea.value)
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
              textarea.addEventListener('keydown', (event) => {
                if (event.code === 'Enter' && (event.shiftKey || event.ctrlKey)) {
                  event.preventDefault()
                  setValue(textarea.value)
                }
              })
            }}
          />
        </div>
      </div>
      <Show when={props.lang === 'python' && props.run}>
        <Python value={value()} />
      </Show>
      <Show when={props.lang === 'html' && props.run}>
        <Html value={value()} />
      </Show>
    </div>
  )
}
