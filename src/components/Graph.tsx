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
              shape: 'round-rectangle',
              'background-color': '#3498db',
              label: 'data(label)',
              color: '#ffffff',
              'text-wrap': 'wrap',
              'text-max-width': '150px',
              padding: '10px',
              'text-valign': 'center',
              'text-halign': 'center',
              width: 'label',
              height: 'label',
            },
          },
          {
            selector: '.hovered',
            style: {
              'background-color': '#2ecc71',
              'text-outline-color': '#2ecc71',
            },
          },
          {
            selector: '$node > node',
            style: {
              'background-color': '#ecf0f1',
              'border-color': '#bdc3c7',
              'border-width': 2,
              label: 'data(label)',
              color: '#7f8c8d',
              'text-valign': 'top',
              'text-halign': 'center',
              padding: '20px',
            },
          },
          {
            selector: 'edge',
            style: {
              width: 2,
              'line-color': '#95a5a6',
              'target-arrow-color': '#95a5a6',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            },
          },
        ],
      }),
    )
    cy()!.on('tap', 'node', function (event) {
      if (event.target.data('id').startsWith('/')) {
        navigate(event.target.data('id'))
      }
    })
    cy()!.on('mouseover', 'node', function (event) {
      if (event.target.data('id').startsWith('/')) {
        cy()!.container()!.style.cursor = 'pointer'
        event.target.addClass('hovered')
      }
    })
    cy()!.on('mouseout', 'node', function (event) {
      event.target.removeClass('hovered')
      cy()!.container()!.style.cursor = 'default'
    })
  })

  createEffect(() => {
    if (cy() && elements()) {
      cy()!.json({ elements: elements() })
      cy()!
        .layout({
          name: 'dagre',
          rankDir: 'BT',
        } as { name: string })
        .run()
    }
  })

  onCleanup(() => {
    cy()?.destroy()
  })

  return <div class={props.class} ref={container} />
}
