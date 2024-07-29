import Fa from './Fa'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { For, type JSXElement } from 'solid-js'

type PaginationProps = {
  current: number
  classes?: string[]
  max: number
  onChange?: (newValue: number) => void
}

export default function Pagination(props: PaginationProps) {
  const classes = (i: number) => {
    let className: string = ''
    if (props.classes && props.classes.length > i) {
      className = props.classes[i]
    }
    if (props.current === i) {
      className += ' font-bold border-2 border-e-2 border-blue-500 border-e-blue-500'
    }
    return className
  }
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
            <Button class={`border-e-0 ${classes(i)}`} onClick={() => props.onChange?.(i)}>
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
