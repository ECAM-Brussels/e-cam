import { type JSXElement } from 'solid-js'

type SlideProps = {
  children?: JSXElement
  class: string
  title: JSXElement
}

export default function Slide(props: SlideProps) {
  return (
    <section>
      <section>
        <div class="bg-slate-700 mb-6 px-4 py-3 text-slate-100 text-left text-3xl">
          {props.title}
        </div>
        <div class={`prose prose-2xl px-4 max-w-none text-left ${props.class}`}>
          {props.children}
        </div>
      </section>
    </section>
  )
}
