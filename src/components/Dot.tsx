import { instance } from '@viz-js/viz'
import { createEffect, createSignal, onMount } from 'solid-js'

type DotProps = {
  value: string
}

type Viz = Awaited<ReturnType<typeof instance>>

export default function Dot(props: DotProps) {
  let container: HTMLDivElement
  const [viz, setViz] = createSignal<Viz | null>(null)

  onMount(async () => {
    setViz(await instance())
  })

  createEffect(() => {
    try {
      if (viz()) {
        const svg = viz()?.renderSVGElement(props.value)
        if (svg) {
          container!.appendChild(svg)
        }
      }
    } catch {}
  })

  return <div ref={container!} />
}
