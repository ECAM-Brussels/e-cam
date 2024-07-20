import Fa from './Fa'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { For, Show, type JSXElement } from 'solid-js'

type PaginationProps = {
  current: number
  classes?: string[]
  max: number
  onChange?: (newValue: number) => void
}

export default function Pagination(props: PaginationProps) {
  const classes = (i: number) => {
    if (props.classes && props.classes.length > i) {
      return props.classes[i]
    }
    return ''
  }
  return (
    <nav class="text-center mb-4">
      <ul class="inline-flex text-gray-500 text-sm">
        <Button
          class="border-e-0 rounded-l-lg"
          onClick={() => props.onChange?.((props.current - 1 + props.max) % props.max)}
        >
          <Fa icon={faChevronLeft} />
        </Button>
        <For each={Array.from(Array(props.max).keys())}>
          {(i) => (
            <Show
              when={props.current !== i}
              fallback={
                <Button
                  class="border-e-0 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                  onClick={() => props.onChange?.(i)}
                >
                  {i + 1}
                </Button>
              }
            >
              <Button class={`border-e-0 ${classes(i)}`} onClick={() => props.onChange?.(i)}>
                {i + 1}
              </Button>
            </Show>
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
  children: JSXElement
  onClick?: () => void
}

function Button(props: ButtonProps) {
  return (
    <li class={`border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${props.class}`}>
      <button class="px-3 py-1" onClick={props.onClick}>
        {props.children}
      </button>
    </li>
  )
}
