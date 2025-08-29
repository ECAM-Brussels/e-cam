import { createAsync, useNavigate, usePreloadRoute } from '@solidjs/router'
import { type Core } from 'cytoscape'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { getAssignmentGraph } from '~/lib/exercises/assignment'

export default function Graph(props: {
  class?: string
  query?: Parameters<typeof getAssignmentGraph>[0] | string
  groups?: string[]
  rankDir?: string
  currentNode?: string
}) {
  let container!: HTMLDivElement
  const [cy, setCy] = createSignal<Core | null>(null)
  const navigate = useNavigate()
  const preload = usePreloadRoute()
  const query = () => (typeof props.query === 'string' ? JSON.parse(props.query) : props.query)
  const elements = createAsync(() => getAssignmentGraph(query(), props.groups))
  const redraw = () => {
    if (cy() && elements()) {
      cy()?.resize()
      cy()!.json({
        elements: elements()?.map((el) => {
          if (props.currentNode && el.data.id === props.currentNode) {
            return { ...el, classes: 'current' }
          }
          return el
        }),
      })
      cy()!
        .layout({
          name: 'dagre',
          rankDir: props.rankDir || 'LR',
        } as { name: string })
        .run()
    }
  }
  let ro: ResizeObserver | undefined = undefined

  onMount(async () => {
    cytoscape.use(dagre)
    setCy(
      cytoscape({
        container,
        elements: [],
        userZoomingEnabled: false,
        style: [
          {
            selector: 'node',
            style: {
              shape: 'round-rectangle',
              'background-color': '#bae6fd',
              'font-family': 'Fira Sans',
              'font-weight': 'lighter',
              label: 'data(label)',
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
            selector: 'node[?color]',
            style: {
              'background-color': 'data(color)',
            },
          },
          {
            selector: '.hovered',
            style: {
              'background-color': '#38bdf8',
            },
          },
          {
            selector: '.current',
            style: {
              'border-width': '2px',
            },
          },
          {
            selector: '$node > node',
            style: {
              'background-color': '#f0f9ff',
              'border-width': 0,
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
        preload(event.target.data('id'), { preloadData: true })
        cy()!.container()!.style.cursor = 'pointer'
        event.target.addClass('hovered')
      }
    })
    cy()!.on('mouseout', 'node', function (event) {
      event.target.removeClass('hovered')
      cy()!.container()!.style.cursor = 'default'
    })
    ro = new ResizeObserver(redraw)
    ro.observe(container)
  })

  createEffect(redraw)

  onCleanup(() => {
    cy()?.destroy()
    ro?.disconnect()
  })

  return <div class={props.class} ref={container} />
}
