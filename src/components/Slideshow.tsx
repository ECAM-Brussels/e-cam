import { createAsync } from '@solidjs/router'
import 'reveal.js/dist/reveal.css'
import { children, For, onCleanup, onMount, type JSXElement } from 'solid-js'
import Whiteboard from '~/components/Whiteboard'
import { getUser } from '~/lib/auth/session'

type SlideshowProps = {
  children: JSXElement
  boardName?: string
}

export default function Slideshow(props: SlideshowProps) {
  const user = createAsync(() => getUser())
  const resolved = () => {
    const c = children(() => props.children)()
    return Array.isArray(c) ? c : [c]
  }

  let deck: InstanceType<typeof import('reveal.js')>
  onMount(async () => {
    const Reveal = (await import('reveal.js')).default
    deck = new Reveal({
      center: false,
      hash: true,
      height: 1080,
      transition: 'none',
      width: 1920,
    })
    deck.initialize()
  })
  onCleanup(async () => {
    if (deck) {
      deck.destroy()
    }
  })

  return (
    <div class="reveal">
      <div class="slides">
        <For each={resolved()}>
          {(child, i) => {
            return (
              <section>
                <section class="relative">
                  {child}
                  <Whiteboard
                    id={`slide-${props.boardName}-${i()}`}
                    class="absolute top-0 left-0"
                    width={1920}
                    height={1080}
                    readOnly={!user()?.admin}
                  />
                </section>
              </section>
            )
          }}
        </For>
      </div>
    </div>
  )
}
