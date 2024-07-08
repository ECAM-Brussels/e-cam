import katex from 'katex'
import 'katex/dist/katex.min.css'
import 'mathlive'
import type { MathfieldElement } from 'mathlive'
import { ComponentProps, Show } from 'solid-js'

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

type MathProps = ComponentProps<'math-field'> & {
  editable?: boolean
}

export default function Math(props: MathProps) {
  const html = () => katex.renderToString(props.value || '')
  return (
    <Show when={props.editable} fallback={<span innerHTML={html()} />}>
      <math-field className="w-full" {...props} />
    </Show>
  )
}
