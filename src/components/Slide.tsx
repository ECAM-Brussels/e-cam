import { type JSXElement } from 'solid-js'

type SlideProps = {
  children?: JSXElement
  classList?: { [cls: string]: boolean }
  class: string
  title: JSXElement
}

export default function Slide(props: SlideProps) {
  return (
    <div class="h-full">
      <div class="bg-slate-700 font-semibold mb-6 px-4 py-3 shadow-md text-slate-100 text-left text-4xl">
        {props.title}
      </div>
      <div
        class={props.class}
        classList={{
          'h-full': true,
          prose: true,
          'prose-2xl': true,
          'px-4': true,
          'text-left': true,
          'max-w-none': true,
          ...props.classList,
        }}
      >
        {props.children}
      </div>
    </div>
  )
}
