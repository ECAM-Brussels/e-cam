import Fa from './Fa'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { For, type JSXElement } from 'solid-js'

type PaginationProps = {
  current: number
  classList: (i: number) => { [key: string]: boolean | undefined }
  max: number
  url: (i: number) => string
}

export default function Pagination(props: PaginationProps) {
  return (
    <nav class="text-center mb-4">
      <ul class="inline-flex text-gray-500">
        <Link
          class="border-e-0 rounded-l-lg"
          href={props.url((props.current - 1 + props.max) % props.max)}
        >
          <Fa icon={faChevronLeft} />
        </Link>
        <For each={[...Array(props.max).keys()].map((i) => i + 1)}>
          {(i) => (
            <Link
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
        <Link class="rounded-r-lg" href={props.url((props.current + 1) % props.max)}>
          <Fa icon={faChevronRight} />
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
      <a class="px-3 py-1" href={props.href}>
        {props.children}
      </a>
    </li>
  )
}
