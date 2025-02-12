import { query, createAsync, revalidate, useLocation } from '@solidjs/router'
import 'reveal.js/dist/reveal.css'
import { createEffect, For, onCleanup, onMount, type JSXElement } from 'solid-js'
import Breadcrumbs from '~/components/Breadcrumbs'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'
import { prisma } from '~/lib/db'

type SlideshowProps = {
  children: JSXElement
  boardName?: string
}

export const getBoardCount = query(async (url: string, boardName: string) => {
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

  const count = createAsync(() => getBoardCount(location.pathname, props.boardName || ''))
  createEffect(() => {
    if (count() && deck) {
      deck.sync()
    }
  })

  onMount(async () => {
    const Reveal = (await import('reveal.js')).default
    deck = new Reveal({
      center: false,
      hash: true,
      height: 1080,
      slideNumber: true,
      touch: false,
      transition: 'none',
      width: 1920,
    })
    deck.initialize()
    deck.addKeyBinding('40', async () => {
      const { h, v } = deck.getIndices()
      if (v === (count()?.[String(h)] || 1) - 1 && user()?.admin) {
        await addBoard(location.pathname, props.boardName || '', h, v + 1)
        revalidate(getBoardCount.keyFor(location.pathname, props.boardName || ''))
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
    <div class="reveal bg-white">
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
                      onAdd={async () => {
                        const { h, v } = deck.getIndices()
                        if (v === (count()?.[String(h)] || 1) - 1 && user()?.admin) {
                          await addBoard(location.pathname, props.boardName || '', h, v + 1)
                          revalidate(getBoardCount.keyFor(location.pathname, props.boardName || ''))
                        }
                      }}
                      width={1920}
                      height={1080}
                      readOnly={!user()?.admin}
                      scale
                      toolbarPosition="bottom"
                    />
                    <Breadcrumbs class="absolute bottom-0 w-full" />
                  </section>
                )}
              </For>
            </section>
          )}
        </For>
      </div>
    </div>
  )
}
