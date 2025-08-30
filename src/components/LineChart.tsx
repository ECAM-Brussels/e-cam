import { Chart, ChartConfiguration } from 'chart.js/auto'
import { onMount } from 'solid-js'

type LineChartProps = ChartConfiguration<'line', number[], string>['data'] & {
  class?: string
}

export default function LineChart(props: LineChartProps) {
  let ref!: HTMLCanvasElement
  onMount(() => {
    new Chart(ref, {
      type: 'line',
      data: props,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    })
  })
  return (
    <div class={props.class}>
      <canvas ref={ref!} />
    </div>
  )
}
