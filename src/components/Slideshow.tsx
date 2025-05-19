import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { A, createAsync } from '@solidjs/router'
import { Show, type JSXElement } from 'solid-js'
import Fa from '~/components/Fa'
import Whiteboard from '~/components/Whiteboard'
import { getBoardCount } from '~/lib/slideshow'

type SlideshowProps = {
  children: JSXElement
  board: string
  hIndex: number
  vIndex: number
  url: string
}

export default function Slideshow(props: SlideshowProps) {
  const slide = () => {
    const children = props.children
    return Array.isArray(children) ? children[props.hIndex - 1] : children
  }

  return (
    <div class="bg-white w-[1920px] h-[1080px] mx-auto relative">
      {slide()}
      <Whiteboard
        class="absolute top-0 z-10"
        width={1920}
        height={1080}
        toolbarPosition="bottom"
        owner="ngy@ecam.be"
        url={props.url}
        name={`${props.board}-${props.hIndex}-${props.vIndex}`}
      />
      <Remote {...props} />
    </div>
  )
}

function Remote(props: SlideshowProps) {
  return (
    <div class="absolute bottom-4 right-4 text-4xl z-20 flex gap-4 items-center">
      <Arrow {...props} dir="left" />
      <div class="flex flex-col">
        <Arrow {...props} dir="up" />
        <Arrow {...props} dir="down" />
      </div>
      <Arrow {...props} dir="right" />
    </div>
  )
}

const arrows = {
  up: [faChevronUp, (i, j) => [i, j - 1]],
  down: [faChevronDown, (i, j) => [i, j + 1]],
  left: [faChevronLeft, (i, _j) => [i - 1, 1]],
  right: [faChevronRight, (i, _j) => [i + 1, 1]],
} as const satisfies {
  [dir: string]: [IconDefinition, (i: number, j: number) => [number, number]]
}

function Arrow(props: SlideshowProps & { dir: keyof typeof arrows }) {
  const boardCount = createAsync(() =>
    getBoardCount(props.url, 'ngy@ecam.be', props.board, props.hIndex),
  )
  const slideCount = () => (Array.isArray(props.children) ? props.children.length : 1)
  const icon = () => arrows[props.dir][0]
  const link = () => {
    const [i, j] = arrows[props.dir][1](props.hIndex, props.vIndex)
    return i >= 1 &&
      j >= 1 &&
      i <= slideCount() &&
      boardCount() !== undefined &&
      j <= boardCount()! + 1
      ? `${props.url}/${i}/${j}`
      : null
  }
  return (
    <div>
      <Show when={link()} fallback={<Fa icon={icon()} class="text-gray-200" />}>
        {(link) => (
          <A href={link()} noScroll>
            <Fa icon={icon()} />
          </A>
        )}
      </Show>
    </div>
  )
}
