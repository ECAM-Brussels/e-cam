import functionPlot, { type FunctionPlotOptions } from 'function-plot'
import { createEffect, mergeProps } from 'solid-js'

type PlotProps = Omit<FunctionPlotOptions, 'target'> & {
  class?: string
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
    functionPlot({
      target,
      ...props,
    })
  })
  return <div class={props.class} classList={{ 'z-20': true, relative: true }} ref={target!} />
}
