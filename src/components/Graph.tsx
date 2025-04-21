import { createAsync, useNavigate } from '@solidjs/router'
import { type Core } from 'cytoscape'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { getAssignmentGraph } from '~/lib/exercises/assignment'

export default function Graph(props: {
  class?: string
  query?: Parameters<typeof getAssignmentGraph>[0]
}) {
  let container!: HTMLDivElement
  const [cy, setCy] = createSignal<Core | null>(null)
  const navigate = useNavigate()
  const elements = createAsync(() => getAssignmentGraph(props.query))

  onMount(async () => {
    cytoscape.use(dagre)
    setCy(
      cytoscape({
        container,
        elements: [],
        style: [
          {
            selector: 'node',
            style: {
              label: 'data(label)',
              'text-valign': 'top',
            },
          },
          {
            selector: 'edge',
            style: {
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            },
          },
        ],
      }),
    )
    cy()!.on('tap', 'node', function (event) {
      navigate(event.target.data('id'))
    })
    cy()!.on('mouseover', 'node', function (event) {
      if (event.target.data('id').startsWith('/')) {
        cy()!.container()!.style.cursor = 'pointer'
      }
    })
    cy()!.on('mouseout', 'node', function () {
      cy()!.container()!.style.cursor = 'default'
    })
  })

  createEffect(() => {
    if (cy() && elements()) {
      cy()!.json({ elements: elements() })
      cy()!
        .layout({ name: 'dagre', rankDir: 'BT' } as { name: string })
        .run()
    }
  })

  onCleanup(() => {
    cy()?.destroy()
  })

  return <div class={props.class} ref={container} />
}
