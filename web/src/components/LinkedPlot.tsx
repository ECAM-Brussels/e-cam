import Plot from './Plot'
import functionPlot, { type FunctionPlotOptions } from 'function-plot'
import { For } from 'solid-js'

type LinkedPlotProps = {
  plots: Omit<FunctionPlotOptions, 'target'>[]
}

export default function LinkedPlot(props: LinkedPlotProps) {
  let original: ReturnType<typeof functionPlot>
  return (
    <For each={props.plots}>
      {(plot, i) => (
        <div>
          <Plot
            {...plot}
            onRender={(renderedPlot) => {
              if (i() === 0) {
                original = renderedPlot
              } else {
                // @ts-ignore
                original.addLink(renderedPlot)
                // @ts-ignore
                renderedPlot.addLink(original)
              }
            }}
          />
        </div>
      )}
    </For>
  )
}
