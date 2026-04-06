import ErrorBoundary from './ErrorBoundary'
import Suspense from './Suspense'
import {
  faAngleLeft,
  faAngleRight,
  faBlackboard,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import { createAsync, revalidate } from '@solidjs/router'
import {
  createEffect,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  Show,
  type JSXElement,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import Breadcrumbs from '~/components/Breadcrumbs'
import Fa from '~/components/Fa'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
import { loadBoard } from '~/lib/board'
import { getBoardCount, getBoardCounts } from '~/lib/slideshow'

type SlideshowProps = {
  slides: (() => JSXElement)[]
  board: string
  hIndex: number
  vIndex: number
  url: string
  showBoard?: boolean
  onShowBoardChange?: (newVal: boolean) => void
  print?: boolean
}

export default function Slideshow(props: SlideshowProps) {
  let container!: HTMLDivElement
  const boardCounts = createAsync(() => getBoardCounts(props.url, 'ngy@ecam.be', props.board))

  const user = createAsync(() => getUser())
  const [currentBoard, setCurrentBoard] = createSignal<[number, number]>([1, 1])
  const boardName = () => `${props.board}-${props.hIndex}-${props.vIndex}`
  type Message = { url: string; board: string }
  let ws: WebSocket | null = null
  onMount(() => {
    ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`)
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data) as Message
      if (data.url === props.url && data.board === boardName()) {
        revalidate(loadBoard.keyFor({ ...data, ownerEmail: 'ngy@ecam.be' }))
        revalidate(getBoardCounts.keyFor(props.url, 'ngy@ecam.be', props.board))
        revalidate(getBoardCount.keyFor(props.url, 'ngy@ecam.be', props.board, props.hIndex))
      }
    })
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            history.replaceState(null, '', `#${entry.target.id}`)
            setCurrentBoard(entry.target.id.split('/').map(Number) as [number, number])
          }
        })
      },
      { threshold: 0.2 },
    )
    Array.from(container.children[0]?.children ?? []).forEach((slide) => observer.observe(slide))
  })
  onCleanup(() => {
    ws?.close()
    ws = null
  })
  createEffect(
    on(currentBoard, (_, oldVal) => {
      if (ws && ws.readyState === WebSocket.OPEN && oldVal && user()?.email === 'ngy@ecam.be') {
        const board = `${props.board}-${oldVal.join('-')}`
        ws.send(JSON.stringify({ url: props.url, board }))
      }
    }),
  )

  return (
    <div ref={container!}>
      <div
        class="bg-white w-[1920px] h-[1080px] origin-top-left xl:snap-y xl:snap-mandatory overflow-scroll"
        classList={{ 'select-none': props.showBoard }}
      >
        <For
          each={[
            ...Array(props.slides.length)
              .keys()
              .map((i) => i + 1),
          ]}
        >
          {(i) => (
            <For
              each={[
                ...Array(boardCounts()?.[i] ?? 1)
                  .keys()
                  .map((i) => i + 1),
              ]}
            >
              {(j) => (
                <div class="bg-white relative h-[1080px] xl:snap-start" id={`${i}/${j}`}>
                  <Suspense>
                    <ErrorBoundary>
                      <Dynamic component={props.slides[i - 1]} />
                    </ErrorBoundary>
                    <Show when={props.showBoard}>
                      <Whiteboard
                        class="absolute top-0 z-10"
                        width={1920}
                        height={1080}
                        toolbarPosition="bottom"
                        owner="ngy@ecam.be"
                        url={props.url}
                        name={`${props.board}-${i}-${j}`}
                        scale
                      />
                    </Show>
                    <div class="absolute bottom-4 right-4 text-4xl flex gap-4 items-center print:hidden">
                      <Breadcrumbs class="bg-white border rounded-lg text-sm mr-8 z-50 p-2 px-4" />
                      <div class="flex flex-row z-50 gap-4">
                        <Show when={i > 1}>
                          <a href={`#${i - 1}/1`}>
                            <Fa icon={faAngleLeft} />
                          </a>
                        </Show>
                        <button onClick={() => props.onShowBoardChange?.(!props.showBoard)}>
                          <Fa icon={props.showBoard ? faEyeSlash : faBlackboard} />
                        </button>
                        <Show when={i <= props.slides.length - 1}>
                          <a href={`#${i + 1}/1`}>
                            <Fa icon={faAngleRight} />
                          </a>
                        </Show>
                      </div>
                    </div>
                  </Suspense>
                </div>
              )}
            </For>
          )}
        </For>
      </div>
    </div>
  )
}
