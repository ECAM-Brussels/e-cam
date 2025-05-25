import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { A, createAsync } from '@solidjs/router'
import { createSignal, onMount, Show, type JSXElement } from 'solid-js'
import Fa from '~/components/Fa'
import Whiteboard from '~/components/Whiteboard'
import { getBoardCount } from '~/lib/slideshow'

type SlideshowProps = {
  slides: JSXElement[]
  board: string
  hIndex: number
  vIndex: number
  url: string
}

export default function Slideshow(props: SlideshowProps) {
  let container!: HTMLDivElement

  const [scale, setScale] = createSignal(1)
  const [translation, setTranslation] = createSignal('0, 0')
  onMount(() => {
    const observer = new ResizeObserver((_entries) => {
      const scaleX = container.clientWidth / 1920
      const scaleY = container.clientHeight / 1080
      const scale = Math.min(scaleX, scaleY)
      setScale(scale)
      const x = (container.clientWidth - 1920 * scale) / 2
      const y = (container.clientHeight - 1080 * scale) / 2
      setTranslation(`${x}px, ${y}px`)
    })
    observer.observe(container)
  })

  return (
    <div class="w-screen h-screen" ref={container!}>
      <div
        class="bg-white w-[1920px] h-[1080px] relative origin-top-left overflow-hidden"
        style={{ transform: `scale(${scale()}) translate(${translation()})` }}
      >
        {props.slides[props.hIndex]}
        <Whiteboard
          class="absolute top-0 z-10"
          width={1920}
          height={1080}
          toolbarPosition="bottom"
          owner="ngy@ecam.be"
          url={props.url}
          name={`${props.board}-${props.hIndex}-${props.vIndex}`}
          scale
        />
        <Remote {...props} />
      </div>
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
  const icon = () => arrows[props.dir][0]
  const link = () => {
    const [i, j] = arrows[props.dir][1](props.hIndex, props.vIndex)
    return i >= 1 &&
      j >= 1 &&
      i < props.slides.length &&
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
