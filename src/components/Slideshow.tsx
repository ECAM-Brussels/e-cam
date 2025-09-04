import type { IconDefinition } from '@fortawesome/fontawesome-common-types'
import {
  faBlackboard,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { A, createAsync } from '@solidjs/router'
import { createSignal, onMount, Show, type JSXElement } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Breadcrumbs from '~/components/Breadcrumbs'
import Fa from '~/components/Fa'
import Whiteboard from '~/components/Whiteboard'
import { getBoardCount } from '~/lib/slideshow'

type SlideshowProps = {
  slides: (() => JSXElement)[]
  board: string
  hIndex: number
  vIndex: number
  url: string
  showBoard?: boolean
  onShowBoardChange?: (newVal: boolean) => void
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
        <Dynamic component={props.slides[props.hIndex]} />
        <Show when={props.showBoard}>
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
        </Show>
        <Remote {...props} />
      </div>
    </div>
  )
}

function Remote(props: SlideshowProps) {
  return (
    <div class="absolute bottom-4 right-4 text-4xl z-20 flex gap-4 items-center print:hidden">
      <Breadcrumbs class="text-sm mr-8" />
      <Arrow {...props} dir="left" />
      <div class="flex flex-col">
        <Arrow {...props} dir="up" />
        <button
          onClick={() => props.onShowBoardChange?.(!props.showBoard)}
          title={props.showBoard ? 'Hide board' : 'Show board'}
        >
          <Fa icon={props.showBoard ? faEyeSlash : faBlackboard} />
        </button>
        <Arrow {...props} dir="down" />
      </div>
      <Arrow {...props} dir="right" />
    </div>
  )
}

const arrows = {
  up: [faChevronUp, (i, j) => [i, j - 1], 'ArrowUp'],
  down: [faChevronDown, (i, j) => [i, j + 1], 'ArrowDown'],
  left: [faChevronLeft, (i, _j) => [i - 1, 1], 'ArrowLeft'],
  right: [faChevronRight, (i, _j) => [i + 1, 1], 'ArrowRight'],
} as const satisfies {
  [dir: string]: [IconDefinition, (i: number, j: number) => [number, number], string]
}

function Arrow(props: SlideshowProps & { dir: keyof typeof arrows }) {
  const boardCount = createAsync(() =>
    getBoardCount(props.url, 'ngy@ecam.be', props.board, props.hIndex),
  )
  const icon = () => arrows[props.dir][0]
  const link = () => {
    const [i, j] = arrows[props.dir][1](props.hIndex, props.vIndex)
    const pathname =
      i >= 1 &&
      j >= 1 &&
      i < props.slides.length &&
      boardCount() !== undefined &&
      j <= boardCount()! + 1
        ? `${props.url}/${i}/${j}`
        : null
    if (pathname === null) return null
    return `${pathname}${props.board ? `?boardName=${props.board}` : ''}`
  }

  const [arrow, setArrow] = createSignal<HTMLAnchorElement | undefined>(undefined)
  onMount(() => {
    window.addEventListener('keydown', (event) => {
      const arr = arrow()
      if (event.key === arrows[props.dir][2] && arr && link()) {
        arr.click()
      }
    })
  })

  return (
    <div>
      <Show when={link()} fallback={<Fa icon={icon()} class="text-gray-200" />}>
        {(link) => (
          <A href={link()} noScroll ref={setArrow}>
            <Fa icon={icon()} />
          </A>
        )}
      </Show>
    </div>
  )
}
