import functionPlot, { type FunctionPlotOptions } from 'function-plot'
import { createEffect, mergeProps } from 'solid-js'

type PlotProps = Omit<FunctionPlotOptions, 'target'> & {
  class?: string
  onRender?: (plot: ReturnType<typeof functionPlot>) => void
}

export default function Plot(props: PlotProps) {
  props = mergeProps(
    {
      grid: true,
    } satisfies PlotProps,
    props,
  )
  let target: HTMLDivElement
  createEffect(() => {
    const plot = functionPlot({
      target,
      ...props,
    })
    props.onRender?.(plot)
  })
  return (
    <div
      class={props.class}
      classList={{ 'inline-block': true, 'z-20': true, relative: true }}
      ref={target!}
    />
  )
}
