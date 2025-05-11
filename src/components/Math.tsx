import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'mathlive'
import type { MathfieldElement } from 'mathlive'
import { ComponentProps, createEffect, createSignal, on, Show, splitProps } from 'solid-js'

declare module 'solid-js' {
  namespace JSX {
    type ElementProps<T> = {
      [K in keyof T]: Props<T[K]> & HTMLAttributes<T[K]>
    }
    type Props<T> = {
      [K in keyof T as `prop:${string & K}`]?: T[K]
    }
    interface IntrinsicElements {
      'math-field': Partial<ElementProps<MathfieldElement>>
    }
  }
}

type MathInputEvent = InputEvent & {
  target: MathfieldElement
}

type MathProps = ComponentProps<'math-field'> & {
  class?: string
  displayMode?: boolean
  editable?: boolean
  onInput?: (event: MathInputEvent) => void
  onBlur?: (event: MathInputEvent) => void
}

export default function Math(props: MathProps) {
  const [value, setValue] = createSignal(props.value)
  createEffect(() => setValue(props.value))

  const [disabled, setDisabled] = createSignal(props.disabled)
  createEffect(() => setDisabled(props.disabled))
  let field!: HTMLInputElement
  createEffect(
    on(
      () => [props.value, props.name],
      () => {
        if (props.name && field) {
          const fieldset = field.closest('fieldset')
          if (fieldset) {
            setDisabled(fieldset.disabled)
          } else {
            setDisabled(false)
          }
        }
      },
    ),
  )

  const html = () =>
    katex.renderToString(value() || '', {
      displayMode: props.displayMode,
      strict: false,
      macros: {
        '\\placeholder': '',
        '\\dd': '\\mathrm{d}',
        '\\exponentialE': 'e',
        '\\imaginaryI': 'i',
      },
    })
  const [extra, others] = splitProps(props, ['onInput', 'onBlur', 'name'])
  return (
    <Show
      when={props.editable && !disabled()}
      fallback={<span innerHTML={html()} class={props.class} />}
    >
      <math-field
        className={props.class}
        {...others}
        oninput={(event: MathInputEvent) => {
          extra.onInput?.(event)
          setValue(event.target.value)
        }}
        onblur={extra.onBlur}
        onkeydown={(event: KeyboardEvent) => {
          if (props.name && event.key === 'Enter') {
            field.closest('form')?.requestSubmit()
          }
        }}
      />
      <Show when={props.name}>
        <input type="hidden" name={props.name} value={value() || ''} ref={field} />
      </Show>
    </Show>
  )
}
