import { Chart, ChartConfiguration } from 'chart.js/auto'
import { createEffect, onCleanup, onMount } from 'solid-js'

type LineChartProps = ChartConfiguration<'line', number[], string>['data'] & {
  class?: string
}

export default function LineChart(props: LineChartProps) {
  let ref!: HTMLCanvasElement
  let chart: Chart | undefined = undefined
  onMount(() => {
    chart = new Chart(ref, {
      type: 'line',
      data: props,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  })
  createEffect(() => {
    if (chart) {
      chart.data = props
      chart.update()
    }
  })
  onCleanup(() => {
    chart?.destroy()
  })
  return (
    <div class={props.class}>
      <canvas ref={ref!} />
    </div>
  )
}
