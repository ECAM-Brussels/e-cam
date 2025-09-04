import Graph from './Graph'
import { type JSXElement, Show } from 'solid-js'

type ChapterInfoProps = {
  children: JSXElement
  title: string
  query?: Parameters<typeof Graph>[0]['query']
}

export default function ChapterInfo(props: ChapterInfoProps) {
  return (
    <div class="bg-white border rounded-xl px-4 mb-2 pb-4">
      <h3 class="px-4 font-bold text-xl">{props.title}</h3>
      <div class="md:flex md:flex-wrap gap-4 text-sm">{props.children}</div>
      <Show when={props.query}>
        <Graph class="mt-2 h-96 border rounded-xl" query={props.query} />
      </Show>
    </div>
  )
}
