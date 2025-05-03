import {
  faBroom,
  faEraser,
  faFloppyDisk,
  faHighlighter,
  faPen,
  faPlus,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons'
import { useLocation, useAction, useSubmissions, createAsyncStore } from '@solidjs/router'
import { cloneDeep } from 'lodash-es'
import { createEffect, createMemo, createSignal, For, on, onMount, Show } from 'solid-js'
import { createStore, SetStoreFunction, unwrap } from 'solid-js/store'
import Fa from '~/components/Fa'
import Spinner from '~/components/Spinner'
import { addStroke, clearBoard, loadBoard, removeStroke, type Stroke } from '~/lib/board'
import { round } from '~/lib/helpers'

type Mode = 'draw' | 'erase' | 'read'
type Status = 'unsaved' | 'saving' | 'saved'

type WhiteboardProps = {
  name: string
  class?: string
  readOnly?: boolean
  scale?: boolean
  toolbarPosition?: 'top' | 'bottom'
  onAdd?: () => void
  owner: string
} & (
  | {
      container: HTMLDivElement
      width?: never
      height?: never
    }
  | {
      container?: never
      width: number
      height: number
    }
)

export default function Whiteboard(props: WhiteboardProps) {
  const location = useLocation()
  let canvasRef!: HTMLCanvasElement
  let container!: HTMLDivElement
  const ctx = () => canvasRef?.getContext('2d')
  const [mode, setMode] = createSignal<Mode>('read')

  const [width, setWidth] = createSignal(props.width || 100)
  const [height, setHeight] = createSignal(props.height || 100)
  const resize = () => {
    if (props.container) {
      const rect = props.container.getBoundingClientRect()
      setWidth(rect.width)
      setHeight(rect.height)
    }
  }
  onMount(() => {
    if (props.container) {
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(props.container)
    }
  })

  const strokes = createAsyncStore(() => loadBoard(location.pathname, props.name), {
    initialValue: [],
  })
  const useAddStroke = useAction(addStroke.with(location.pathname, props.owner, props.name))
  const useClear = useAction(clearBoard.with(location.pathname, props.owner, props.name))
  const useRemoveStroke = useAction(removeStroke.with(location.pathname, props.owner, props.name))
  const [currentStroke, setCurrentStroke] = createStore<Stroke>({
    color: '#255994',
    lineWidth: 2,
    points: [],
  })
  const filter = ([url, owner, name]: [string, string, string]) =>
    url === location.pathname && name === props.name && owner === props.owner
  const adding = useSubmissions(addStroke, filter)
  const removing = useSubmissions(removeStroke, filter)
  const clearing = useSubmissions(clearBoard, filter)
  const allStrokes = createMemo(() => {
    if (clearing.pending) {
      return []
    }
    const beingAdded = Array.from(adding.entries()).map(([_, data]) => data.input[3])
    const beingRemoved = Array.from(removing.entries()).map(([_, data]) => data.input[3])
    const seen = new Set<string>()
    return [...strokes(), ...beingAdded].filter((s) => {
      const key = JSON.stringify(s.points)
      if (seen.has(key) || (s.id && beingRemoved.includes(s.id))) {
        return false
      }
      seen.add(key)
      return true
    })
  })
  const status = () => (adding.pending || removing.pending || clearing.pending ? 'saving' : 'saved')

  const handlePointerMove = async (x: number, y: number) => {
    if (mode() === 'draw') {
      x = round(x, 2)
      y = round(y, 2)
      const lastPoint = currentStroke.points.at(-1)
      if (!lastPoint || x !== lastPoint[0] || y !== lastPoint[1]) {
        setCurrentStroke('points', currentStroke.points.length, [x, y])
      }
    } else if (mode() === 'erase') {
      for (let i = 0; i < strokes().length; i++) {
        for (const p of strokes()[i].points) {
          const dist = (p[0] - x) ** 2 + (p[1] - y) ** 2
          const stroke = strokes()[i]
          if (dist <= 5 && stroke.id) {
            await useRemoveStroke(stroke.id)
            return
          }
        }
      }
    }
  }

  createEffect(() => {
    const context = ctx()
    if (context) {
      context.fillStyle = currentStroke.color
      context.strokeStyle = currentStroke.color
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.lineWidth = currentStroke.lineWidth
    }
  })

  createEffect(
    on(mode, () => {
      if (mode() === 'read' && currentStroke.points.length) {
        useAddStroke(cloneDeep(unwrap(currentStroke)))
        setCurrentStroke('points', [])
        ctx()?.closePath()
      } else if (mode() === 'draw') {
        ctx()?.beginPath()
      }
    }),
  )

  // Drawing strokes from scratch
  createEffect(
    on(
      () => [allStrokes().length, width(), height()],
      () => {
        const context = ctx()!
        context.clearRect(0, 0, width(), height())
        for (const stroke of allStrokes()) {
          context.beginPath()
          context.fillStyle = stroke.color
          context.strokeStyle = stroke.color
          context.lineWidth = stroke.lineWidth
          if (stroke.points.length > 3) {
            context.moveTo(...stroke.points[0])
            let i
            for (i = 1; i < stroke.points.length - 2; i++) {
              const x = (stroke.points[i][0] + stroke.points[i + 1][0]) / 2
              const y = (stroke.points[i][1] + stroke.points[i + 1][1]) / 2
              context.quadraticCurveTo(...stroke.points[i], x, y)
            }
            context.quadraticCurveTo(...stroke.points[i], ...stroke.points[i + 1])
          } else {
            for (const point of stroke.points) {
              context.lineTo(...point)
            }
          }
          context.stroke()
          context.closePath()
        }
        context.fillStyle = currentStroke.color
        context.strokeStyle = currentStroke.color
        context.lineWidth = currentStroke.lineWidth
      },
    ),
  )

  // Adding points
  createEffect(
    on(
      () => [currentStroke.points.length],
      () => {
        if (currentStroke.points.length < 4) {
          return
        }
        const context = ctx()!
        const lastPoint = (i: number) => currentStroke.points[currentStroke.points.length - i]
        const x = (lastPoint(2)[0] + lastPoint(1)[0]) / 2
        const y = (lastPoint(2)[1] + lastPoint(1)[1]) / 2
        context.moveTo(...lastPoint(3))
        context.quadraticCurveTo(...lastPoint(2), x, y)
        context.stroke()
      },
    ),
  )

  onMount(() => {
    canvasRef!.oncontextmenu = () => false
  })
  const [erasing, setErasing] = createSignal(false)

  return (
    <div class={props.class} style={{ width: `${width()}px`, height: `${height()}px` }}>
      <div
        ref={container!}
        class="relative"
        style={{ width: `${width()}px`, height: `${height()}px` }}
      >
        <Toolbar
          currentStroke={currentStroke}
          setter={setCurrentStroke}
          status={status()}
          erasing={erasing()}
          setErasing={setErasing}
          onDelete={useClear}
          onAdd={props.onAdd}
          position={props.toolbarPosition || 'top'}
        />
        <canvas
          class="z-10 touch-none select-none"
          classList={{ 'cursor-crosshair': !props.readOnly }}
          ref={canvasRef!}
          height={height()}
          width={width()}
          onPointerDown={(event) => {
            event.preventDefault()
            if (props.readOnly || event.pointerType === 'touch') {
              return
            }
            if (erasing()) {
              setMode('erase')
              return
            }
            const computer = /Win|Mac|Linux(?!.*Android)/i.test(navigator.userAgent)
            if (event.pointerType === 'mouse' || computer) {
              const leftClick = event.button === 0 || event.button === 1
              const rightClick = event.button === 2
              if (rightClick) {
                setMode('erase')
              } else if (leftClick) {
                setMode('draw')
              }
            } else if (event.pointerType === 'pen') {
              if (event.pressure) {
                setMode('draw')
              }
            } else {
              setMode('draw')
            }
          }}
          onPointerMove={(event) => {
            event.preventDefault()
            const boundingClientRect = canvasRef.getBoundingClientRect()
            const containerClient = container.getBoundingClientRect()
            let x = event.clientX - containerClient.left
            let y = event.clientY - containerClient.top
            if (props.scale) {
              const scaleX = canvasRef.offsetWidth / boundingClientRect.width
              const scaleY = canvasRef.offsetHeight / boundingClientRect.height
              x = x * scaleX
              y = y * scaleY
            }
            handlePointerMove(x, y)
          }}
          onPointerUp={(event) => {
            event.preventDefault()
            setMode('read')
          }}
        />
      </div>
    </div>
  )
}

type ToolbarProps = {
  currentStroke: Stroke
  onAdd?: () => void
  onDelete?: () => void
  setter: SetStoreFunction<Stroke>
  status: Status
  erasing: boolean
  setErasing: (nextVal: boolean) => void
  position: 'top' | 'bottom'
}

function Toolbar(props: ToolbarProps) {
  const pens = ['#255994', 'darkred', 'green', 'darkorange', 'gray', 'black']
  const highlighters = [
    'rgba(241, 231, 64, 0.4)',
    'rgba(93, 226, 60, 0.4)',
    'rgba(243, 149, 57, 0.4)',
    'rgba(233, 79, 88, 0.4)',
  ]
  return (
    <div
      class="absolute flex gap-1 p-2"
      classList={{ 'top-0': props.position === 'top', 'bottom-0': props.position === 'bottom' }}
    >
      <For each={pens}>
        {(color) => (
          <button
            class="rounded-lg px-2 py-1 text-2xl border z-20"
            classList={{ border: props.currentStroke.color === color && !props.erasing }}
            style={{ color, 'border-color': color }}
            onClick={() => {
              props.setter('color', color)
              props.setter('lineWidth', 2)
              props.setErasing(false)
            }}
          >
            <Fa icon={faPen} />
          </button>
        )}
      </For>
      <For each={highlighters}>
        {(color) => (
          <button
            class="rounded-lg px-2 py-1 text-2xl border z-20"
            classList={{ border: props.currentStroke.color === color && !props.erasing }}
            style={{ color, 'border-color': color }}
            onClick={() => {
              props.setter('color', color)
              props.setter('lineWidth', 30)
              props.setErasing(false)
            }}
          >
            <Fa icon={faHighlighter} />
          </button>
        )}
      </For>
      <button
        class="rounded-lg px-2 py-1 text-2xl z-20"
        classList={{ border: props.erasing }}
        onClick={() => {
          props.setErasing(true)
        }}
      >
        <Fa icon={faEraser} />
      </button>
      <button
        class="rounded-lg px-2 py-1 text-2xl z-20"
        onClick={() => {
          props.onDelete?.()
        }}
      >
        <Fa icon={faBroom} />
      </button>
      <Show when={props.onAdd}>
        <button
          class="rounded-lg px-2 py-1 text-2xl z-20"
          onClick={() => {
            props.onAdd?.()
          }}
        >
          <Fa icon={faPlus} />
        </button>
      </Show>
      <button
        class="rounded-lg px-2 py-1 text-2xl z-20"
        onClick={() => {
          if (!document.fullscreenElement) {
            document.body.requestFullscreen()
          } else {
            document.exitFullscreen()
          }
        }}
      >
        <Fa icon={faUpRightAndDownLeftFromCenter} />
      </button>
      <span class="px-2 py-1 text-2xl z-20">
        <Show when={props.status === 'unsaved'}>
          <Fa icon={faFloppyDisk} />
        </Show>
        <Show when={props.status === 'saving'}>
          <Spinner /> Saving...
        </Show>
      </span>
    </div>
  )
}
