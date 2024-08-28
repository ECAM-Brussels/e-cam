import { MetaProvider } from '@solidjs/meta'
import { cache, createAsync, revalidate, useLocation } from '@solidjs/router'
import 'reveal.js/dist/reveal.css'
import { createEffect, For, onCleanup, onMount, type JSXElement } from 'solid-js'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

type SlideshowProps = {
  children: JSXElement
  boardName?: string
}

export const getBoardCount = cache(async (url: string, boardName: string) => {
  'use server'
  const boards = await prisma.board.findMany({
    where: { url, id: { startsWith: `slide-${boardName}-` } },
    select: { id: true },
  })
  const result: { [key: string]: number } = {}
  for (const board of boards) {
    const id = board.id.split('-').at(-2) as string
    result[id] = id in result ? result[id] + 1 : 1
  }
  return result
}, 'getBoards')

async function addBoard(url: string, boardName: string, i: number, j: number) {
  'use server'
  const board = await prisma.board.create({
    data: { url, id: `slide-${boardName}-${i}-${j}`, body: '[]' },
  })
}

function getSlides(props: SlideshowProps) {
  const results = []
  const { children } = props
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      results[i] = (j: number) => (j === 0 ? children[i] : (props.children as HTMLElement[])[i])
    }
  } else {
    results[0] = (j: number) => (j === 0 ? children : props.children)
  }
  return results
}

export default function Slideshow(props: SlideshowProps) {
  const location = useLocation()
  const user = createAsync(() => getUser())
  const slides = getSlides(props)

  let deck: InstanceType<typeof import('reveal.js')>
  const socket = new WebSocket('/api/boards')

  const count = createAsync(() => getBoardCount(location.pathname, props.boardName || ''))
  createEffect(() => {
    if (count() && deck) {
      deck.sync()
    }
  })

  onMount(async () => {
    const Reveal = (await import('reveal.js')).default
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (
        data.url === location.pathname &&
        data.boardName === props.boardName &&
        data.action === 'addBoard'
      ) {
        revalidate(getBoardCount.keyFor(location.pathname, props.boardName || ''))
      }
    })
    deck = new Reveal({
      center: false,
      hash: true,
      height: 1080,
      transition: 'none',
      width: 1920,
    })
    deck.initialize()
    deck.addKeyBinding('40', async () => {
      const { h, v } = deck.getIndices()
      if (v === (count()?.[String(h)] || 1) - 1) {
        await addBoard(location.pathname, props.boardName || '', h, v + 1)
        socket.send(
          JSON.stringify({
            url: location.pathname,
            boardName: props.boardName,
            action: 'addBoard',
          }),
        )
      } else {
        deck.down()
      }
    })
  })

  onCleanup(async () => {
    if (deck) {
      deck.destroy()
    }
  })

  return (
    <MetaProvider>
      <div class="reveal">
        <div class="slides">
          <For each={slides}>
            {(child, i) => (
              <section>
                <For each={[...Array((count() || {})[String(i())] || 1).keys()]}>
                  {(j) => (
                    <section class="relative h-full">
                      {child(j)}
                      <Whiteboard
                        id={`slide-${props.boardName || ''}-${i()}-${j}`}
                        class="absolute top-0 left-0"
                        width={1920}
                        height={1080}
                        readOnly={!user()?.admin}
                        socket={socket}
                      />
                    </section>
                  )}
                </For>
              </section>
            )}
          </For>
        </div>
      </div>
    </MetaProvider>
  )
}
