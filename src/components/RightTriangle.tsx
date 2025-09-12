import Math from './Math'
import { Show } from 'solid-js'

type Props = {
  a?: string
  b?: string
  c?: string
  class?: string
  width: number
  height: number
  A?: string
  B?: string
  C?: string
}

export default function RightTriangle(props: Props) {
  const margin = 50
  const A = () => [margin, props.height - margin]
  const B = () => [props.width - margin, props.height - margin]
  const C = () => [props.width - margin, margin]
  return (
    <div class={props.class} classList={{ relative: true }}>
      <svg
        width={props.width}
        height={props.height}
        viewBox={`0 0 ${props.width} ${props.height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon
          points={`${A().join(',')} ${B().join(',')} ${C().join(',')}`}
          stroke="black"
          fill="none"
          stroke-width="1"
        />
      </svg>
      <Label y={props.height - margin} x={props.width / 2} tex={props.a} />
      <Label y={props.height / 2} x={props.width - margin} tex={props.b} />
      <Label
        class="-translate-x-full -translate-y-full"
        y={props.height / 2}
        x={props.width / 2}
        tex={props.c}
      />
      <Label
        class="-translate-x-full translate-y-1/2"
        y={margin}
        x={props.width - margin}
        tex={props.A}
      />
      <Label
        class="-translate-y-full translate-x-1/2"
        y={props.height - margin}
        x={margin}
        tex={props.B}
      />
      <Label
        class="-translate-x-full -translate-y-full"
        y={props.height - margin}
        x={props.width - margin}
        tex={props.C}
      />
    </div>
  )
}

function Label(props: { class?: string; x: number; y: number; tex?: string }) {
  return (
    <Show when={props.tex}>
      <div
        class={`absolute p-2 ${props.class}`}
        style={{
          top: `${props.y}px`,
          left: `${props.x}px`,
        }}
      >
        <Math value={props.tex} />
      </div>
    </Show>
  )
}
