import Fa from './Fa'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { For, type JSXElement } from 'solid-js'

type PaginationProps = {
  current: number
  classList: (i: number) => { [key: string]: boolean | undefined }
  max: number
  onChange?: (newValue: number) => void
}

export default function Pagination(props: PaginationProps) {
  return (
    <nav class="text-center mb-4">
      <ul class="inline-flex text-gray-500">
        <Button
          class="border-e-0 rounded-l-lg"
          onClick={() => props.onChange?.((props.current - 1 + props.max) % props.max)}
        >
          <Fa icon={faChevronLeft} />
        </Button>
        <For each={Array.from(Array(props.max).keys())}>
          {(i) => (
            <Button
              classList={{
                'font-bold border-2 text-black border-black': props.current === i,
                ...props.classList(i),
              }}
              onClick={() => props.onChange?.(i)}
            >
              {i + 1}
            </Button>
          )}
        </For>
        <Button
          class="rounded-r-lg"
          onClick={() => props.onChange?.((props.current + 1) % props.max)}
        >
          <Fa icon={faChevronRight} />
        </Button>
      </ul>
    </nav>
  )
}

type ButtonProps = {
  class?: string
  classList?: { [key: string]: boolean | undefined }
  children: JSXElement
  onClick?: () => void
}

function Button(props: ButtonProps) {
  return (
    <li class={`border border-gray-300 ${props.class}`} classList={props.classList}>
      <button class="px-3 py-1" onClick={props.onClick}>
        {props.children}
      </button>
    </li>
  )
}
