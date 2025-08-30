import Fa from './Fa'
import {
  faBackwardFast,
  faBackwardStep,
  faForwardFast,
  faForwardStep,
} from '@fortawesome/free-solid-svg-icons'
import { A } from '@solidjs/router'
import { For, type JSXElement } from 'solid-js'

type PaginationProps = {
  current: number
  class?: string
  classList: (i: number) => { [key: string]: boolean | undefined }
  max: number
  url: (i: number) => string
}

function getPagination(current: number, total: number, delta = 5): number[] {
  let start = Math.max(1, current - delta)
  let end = Math.min(total, current + delta)
  while (end - start < delta * 2 && (start > 1 || end < total)) {
    if (start > 1) start--
    else if (end < total) end++
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Pagination(props: PaginationProps) {
  const keys = () => getPagination(props.current, props.max)
  return (
    <nav class={props.class}>
      <ul class="inline-flex text-gray-400">
        <Link class="border-e-0 rounded-l-lg" href={props.url(1)}>
          <Fa icon={faBackwardFast} />
        </Link>
        <Link href={props.url((props.current - 1 + props.max) % props.max)}>
          <Fa icon={faBackwardStep} />
        </Link>
        <For each={keys()}>
          {(i) => (
            <Link
              class="text-gray-500"
              classList={{
                'font-bold border-2 text-black border-black': props.current === i,
                ...props.classList(i),
              }}
              href={props.url(i)}
            >
              {i}
            </Link>
          )}
        </For>
        <Link href={props.url((props.current + 1) % props.max)}>
          <Fa icon={faForwardStep} />
        </Link>
        <Link class="rounded-r-lg" href={props.url(props.max)}>
          <Fa icon={faForwardFast} />
        </Link>
      </ul>
    </nav>
  )
}

type LinkProps = {
  class?: string
  classList?: { [key: string]: boolean | undefined }
  children: JSXElement
  href: string
}

function Link(props: LinkProps) {
  return (
    <li class={`border border-gray-300 ${props.class}`} classList={props.classList}>
      <A class="px-2 py-1" href={props.href} noScroll>
        {props.children}
      </A>
    </li>
  )
}
