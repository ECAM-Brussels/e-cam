import {
  faBroom,
  faEraser,
  faFloppyDisk,
  faHighlighter,
  faPen,
  faPlus,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons'
import { useAction, useSubmissions, createAsyncStore } from '@solidjs/router'
import { cloneDeep } from 'lodash-es'
import { getStroke } from 'perfect-freehand'
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
  url: string
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

function drawStroke(context: CanvasRenderingContext2D, stroke: Stroke) {
  const points = getStroke(stroke.points, { size: stroke.lineWidth })
  context.fillStyle = stroke.color
  context.beginPath()
  if (!points.length) {
    return
  }
  context.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i][0], points[i][1])
  }
  context.closePath()
  context.fill()
}

export default function Whiteboard(props: WhiteboardProps) {
  let canvasRef!: HTMLCanvasElement
  let currentStrokeCanvas!: HTMLCanvasElement
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

  const strokes = createAsyncStore(() => loadBoard(props.url, props.name), {
    initialValue: [],
  })
  const useAddStroke = () => useAction(addStroke.with(props.url, props.owner, props.name))
  const useClear = useAction(clearBoard)
  const useRemoveStroke = useAction(removeStroke)
  const [currentStroke, setCurrentStroke] = createStore<Stroke>({
    color: '#255994',
    lineWidth: 2,
    points: [],
  })
  const filter =
    () =>
    ([url, owner, name]: [string, string, string]) =>
      url === props.url && name === props.name && owner === props.owner
  const adding = useSubmissions(addStroke, filter())
  const removing = useSubmissions(removeStroke, filter())
  const clearing = useSubmissions(clearBoard, filter())
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
            await useRemoveStroke(props.url, props.owner, props.name, stroke.id)
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
        useAddStroke()(cloneDeep(unwrap(currentStroke)))
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
          drawStroke(context, stroke)
        }
      },
    ),
  )

  // Adding points
  createEffect(
    on(
      () => [currentStroke.points.length, width(), height()],
      () => {
        const context = currentStrokeCanvas.getContext('2d')!
        context.clearRect(0, 0, width(), height())
        drawStroke(context, currentStroke)
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
          onDelete={() => useClear(props.url, props.owner, props.name)}
          onAdd={props.onAdd}
          position={props.toolbarPosition || 'top'}
        />
        <canvas
          class="absolute z-20 touch-none select-none"
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
        <canvas
          ref={currentStrokeCanvas}
          height={height()}
          width={width()}
          class="absolute top-0 left-0 z-10 border"
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
      class="absolute flex gap-1 p-2 z-30"
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
      <span class="px-2 py-1 text-2xl z-20 flex flex-row items-center">
        <Show when={props.status === 'unsaved'}>
          <Fa icon={faFloppyDisk} />
        </Show>
        <Show when={props.status === 'saving'}>
          <Spinner /> <span class="text-sm pl-2">Saving...</span>
        </Show>
      </span>
    </div>
  )
}
