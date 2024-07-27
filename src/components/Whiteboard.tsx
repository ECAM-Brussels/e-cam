import { createEffect, createSignal } from 'solid-js'
import { type SetStoreFunction } from 'solid-js/store'

type Mode = 'draw' | 'erase' | 'read'

type Stroke = {
  color: string
  lineWidth: number
  points: [number, number]
}

type WhiteboardProps = {
  height: number
  readOnly: boolean
  setter: SetStoreFunction<Stroke[]>
  strokes: Stroke[]
  width: number
}

export default function Whiteboard(props: WhiteboardProps) {
  const [mode, setMode] = createSignal<Mode>('draw')
  const index = () => props.strokes.length - 1
  const lastStroke = () => props.strokes[index()]

  const handlePointerMotion = (x: number, y: number) => {
    if (mode() === 'draw') {
      props.setter(index(), 'points', [...lastStroke().points, [x, y]])
    }
  }

  createEffect(() => {
    // Redraw strokes
  })

  return (
    <canvas
      height={props.height}
      width={props.width}
      onClick={(event) => {
        if (props.readOnly) {
          return
        }
        const leftClick = event.button === 0 || event.button === 1
        const rightClick = event.button === 2
        if (rightClick) {
          setMode('erase')
        } else {
          setMode('draw')
        }
      }}
      onMouseMove={(event) => {
        handlePointerMotion(event.clientX, event.clientY)
      }}
      onMouseUp={(event) => {
        setMode('read')
      }}
    />
  )
}
