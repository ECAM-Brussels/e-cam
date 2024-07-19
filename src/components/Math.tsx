import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'mathlive'
import type { MathfieldElement } from 'mathlive'
import { ComponentProps, Show, splitProps } from 'solid-js'

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
  editable?: boolean
  onInput?: (event: MathInputEvent) => void
  onBlur?: (event: MathInputEvent) => void
}

export default function Math(props: MathProps) {
  const html = () => katex.renderToString(props.value || '')
  const [listeners, others] = splitProps(props, ['onInput', 'onBlur'])
  return (
    <Show when={props.editable} fallback={<span innerHTML={html()} class={props.class} />}>
      <math-field
        className={props.class}
        {...others}
        oninput={listeners.onInput}
        onblur={listeners.onBlur}
      />
    </Show>
  )
}
