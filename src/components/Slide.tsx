import { format } from 'date-fns'
import { createSignal, Show, type JSXElement } from 'solid-js'

type SlideProps = {
  children?: JSXElement
  classList?: { [cls: string]: boolean }
  class: string
  title: JSXElement
}

export default function Slide(props: SlideProps) {
  const [time, setTime] = createSignal(format(new Date(), 'HH:mm'))
  setInterval(() => {
    setTime(format(new Date(), 'HH:mm'))
  }, 1000)

  return (
    <div class="h-full">
      <div class="bg-slate-700 font-semibold mb-6 px-4 py-3 shadow-md text-slate-100 text-left text-4xl flex justify-between">
        <div class="flex gap-4 items-end">
          {props.title}
          <Show when={import.meta.env.DEV}>
            <p class="text-lg text-green-200 ml-2">(dev)</p>
          </Show>
        </div>
        <div>{time()}</div>
      </div>
      <div
        class={props.class}
        classList={{
          'h-[58rem]': true,
          'overflow-y-auto': true,
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
