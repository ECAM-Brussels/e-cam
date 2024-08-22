import { faHighlighter, faPen } from '@fortawesome/free-solid-svg-icons'
import { cache, createAsync, revalidate, useLocation } from '@solidjs/router'
import { cloneDeep, throttle } from 'lodash-es'
import { createEffect, createSignal, For, on, onMount } from 'solid-js'
import { createStore, SetStoreFunction, unwrap } from 'solid-js/store'
import Fa from '~/components/Fa'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

type Mode = 'draw' | 'erase' | 'read'

type Stroke = {
  color: string
  lineWidth: number
  points: [number, number][]
}

export const loadBoard = cache(async (url: string, id: string) => {
  'use server'
  const record = await prisma.board.findUnique({ where: { url_id: { url, id } } })
  return record ? (JSON.parse(String(record.body)) as Stroke[]) : null
}, 'loadBoards')

const upsertBoard = throttle(
  async (url: string, id: string, data: Stroke[]) => {
    'use server'
    const user = await getUser()
    if (!user || !user.admin) {
      throw new Error('Error when upserting board: user is not an admin')
    }
    const body = JSON.stringify(data)
    await prisma.board.upsert({
      where: { url_id: { url, id } },
      update: { body, lastModified: new Date() },
      create: { url, id, body },
    })
    revalidate(loadBoard.keyFor(url, id))
  },
  5000,
  { trailing: true },
)

type WhiteboardProps = {
  id?: string
  class?: string
  height: number
  readOnly?: boolean
  width: number
}

export default function Whiteboard(props: WhiteboardProps) {
  const location = useLocation()
  let canvasRef: HTMLCanvasElement
  let container: HTMLDivElement
  const ctx = () => canvasRef?.getContext('2d')
  const [mode, setMode] = createSignal<Mode>('read')

  const [strokes, setStrokes] = createStore<Stroke[]>([])
  const savedStrokes = createAsync(() => loadBoard(location.pathname, props.id || ''))
  createEffect(() => {
    const saved = savedStrokes()
    if (saved) {
      setStrokes(saved)
    } else if (saved === null) {
      setStrokes([])
    }
  })

  const [currentStroke, setCurrentStroke] = createStore<Stroke>({
    color: '#255994',
    lineWidth: 2,
    points: [],
  })

  const handlePointerMove = (x: number, y: number) => {
    if (mode() === 'draw') {
      const lastPoint = currentStroke.points[currentStroke.points.length - 1]
      if (!lastPoint || lastPoint[0] !== x || lastPoint[1] !== y) {
        setCurrentStroke('points', currentStroke.points.length, [x, y])
      }
    } else if (mode() === 'erase') {
      for (let i = 0; i < strokes.length; i++) {
        for (const p of strokes[i].points) {
          const dist = (p[0] - x) ** 2 + (p[1] - y) ** 2
          if (dist <= 5) {
            setStrokes(strokes.filter((s, j) => j !== i))
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
        setStrokes(strokes.length, cloneDeep(unwrap(currentStroke)))
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
      () => strokes.length,
      () => {
        const context = ctx()!
        context.clearRect(0, 0, props.width, props.height)
        for (const stroke of strokes) {
          context.beginPath()
          context.fillStyle = stroke.color
          context.strokeStyle = stroke.color
          context.lineWidth = stroke.lineWidth
          for (const point of stroke.points) {
            context.lineTo(...point)
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

  // Saving
  createEffect(
    on(
      () => strokes.length,
      () => {
        upsertBoard(location.pathname, props.id || '', strokes)
      },
      { defer: true },
    ),
  )

  // Adding points
  createEffect(
    on(
      () => currentStroke.points.length,
      () => {
        if (currentStroke.points.length < 2) {
          return
        }
        const context = ctx()!
        const lastPoint = (i: number) => currentStroke.points[currentStroke.points.length - i]
        context.moveTo(...lastPoint(2))
        context.lineTo(...lastPoint(1))
        context.stroke()
      },
    ),
  )

  onMount(() => {
    canvasRef!.oncontextmenu = () => false
  })

  return (
    <div class={props.class}>
      <div
        ref={container!}
        class="relative"
        style={{ width: `${props.width}px`, height: `${props.height}px` }}
      >
        <Toolbar currentStroke={currentStroke} setter={setCurrentStroke} />
        <canvas
          class="z-10 absolute top-0 left-0"
          classList={{ 'cursor-crosshair': !props.readOnly }}
          ref={canvasRef!}
          height={props.height}
          width={props.width}
          onMouseDown={(event) => {
            if (props.readOnly) {
              return
            }
            const leftClick = event.button === 0 || event.button === 1
            const rightClick = event.button === 2
            if (rightClick) {
              setMode('erase')
            } else if (leftClick) {
              setMode('draw')
            }
          }}
          onMouseMove={(event) => {
            const boundingClientRect = canvasRef.getBoundingClientRect()
            const scaleX = canvasRef.offsetWidth / boundingClientRect.width
            const scaleY = canvasRef.offsetHeight / boundingClientRect.height
            const containerClient = container.getBoundingClientRect()
            const x = Math.round((event.clientX - containerClient.left) * scaleX)
            const y = Math.round((event.clientY - containerClient.top) * scaleY)
            handlePointerMove(x, y)
          }}
          onMouseUp={() => {
            setMode('read')
          }}
        />
      </div>
    </div>
  )
}

type ToolbarProps = {
  currentStroke: Stroke
  setter: SetStoreFunction<Stroke>
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
    <div class="absolute bottom-0 flex gap-1 p-2">
      <For each={pens}>
        {(color) => (
          <button
            class="rounded-lg px-2 py-1 text-2xl border z-20"
            classList={{ border: props.currentStroke.color === color }}
            style={{ color, 'border-color': color }}
            onClick={() => {
              props.setter('color', color)
              props.setter('lineWidth', 2)
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
            classList={{ border: props.currentStroke.color === color }}
            style={{ color, 'border-color': color }}
            onClick={() => {
              props.setter('color', color)
              props.setter('lineWidth', 30)
            }}
          >
            <Fa icon={faHighlighter} />
          </button>
        )}
      </For>
    </div>
  )
}
