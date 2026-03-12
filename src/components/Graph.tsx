import { faMagnifyingGlassMinus, faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import { createAsync, useNavigate, usePreloadRoute } from '@solidjs/router'
import { type Core } from 'cytoscape'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import { createEffect, createSignal, onCleanup, onMount, Show, Suspense } from 'solid-js'
import Fa from '~/components/Fa'
import Spinner from '~/components/Spinner'
import { getAssignmentGraph } from '~/lib/exercises/assignment'

export default function Graph(props: {
  class?: string
  query?: Parameters<typeof getAssignmentGraph>[0] | string
  groups?: string[]
  rankDir?: string
  currentNode?: string
  userEmail?: string
}) {
  let container!: HTMLDivElement
  const [cy, setCy] = createSignal<Core | null>(null)
  const navigate = useNavigate()
  const preload = usePreloadRoute()
  const query = () => (typeof props.query === 'string' ? JSON.parse(props.query) : props.query)
  const elements = createAsync(() => getAssignmentGraph(query(), props.groups, props.userEmail), {
    initialValue: [],
  })
  const [ready, setReady] = createSignal(false)
  const redraw = () => {
    setReady(false)
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
  const url = (base: string) => {
    const params: { [key: string]: string } = {}
    if (props.userEmail) params.userEmail = props.userEmail
    const query = new URLSearchParams(params).toString()
    return base + (query ? `?${query}` : '')
  }

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
              'border-style': 'solid',
              'border-width': (el) => (el.data('zpd') ? '2px' : '0'),
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
        navigate(url(event.target.data('id')))
      }
    })
    cy()!.on('mouseover', 'node', function (event) {
      if (event.target.data('id').startsWith('/')) {
        preload(url(event.target.data('id')), { preloadData: true })
        cy()!.container()!.style.cursor = 'pointer'
        event.target.addClass('hovered')
      }
    })
    cy()!.on('mouseout', 'node', function (event) {
      event.target.removeClass('hovered')
      cy()!.container()!.style.cursor = 'default'
    })
    cy()!.on('layoutstop', () => {
      setReady(true)
    })
    ro = new ResizeObserver(redraw)
    ro.observe(container)
  })

  createEffect(redraw)

  onCleanup(() => {
    cy()?.destroy()
    ro?.disconnect()
  })

  const zoom = (inc: number) => {
    cy()?.zoom({
      level: cy()!.zoom() + inc,
      renderedPosition: { x: cy()!.width() / 2, y: cy()!.height() / 2 },
    })
  }

  return (
    <div class="relative z-30">
      <Show when={!ready()}>
        <div class="absolute z-50 flex gap-4 items-center justify-center w-full">
          <Spinner /> <p>Chargement...</p>
        </div>
      </Show>
      <div class={props.class} ref={container}></div>
      <div class="absolute right-4 bottom-2 flex gap-2 z-50">
        <button
          class="opacity-30 hover:opacity-100"
          onclick={(e) => {
            e.stopPropagation()
            zoom(0.2)
          }}
        >
          <Fa icon={faMagnifyingGlassPlus} />
        </button>
        <button
          class="opacity-30 hover:opacity-100"
          onclick={(e) => {
            e.stopPropagation()
            zoom(-0.2)
          }}
        >
          <Fa icon={faMagnifyingGlassMinus} />
        </button>
      </div>
    </div>
  )
}
