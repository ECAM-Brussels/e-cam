import 'reveal.js/dist/reveal.css'
import { onCleanup, onMount, type JSXElement } from 'solid-js'

type SlideshowProps = {
  children: JSXElement
}

export default function Slideshow(props: SlideshowProps) {
  let deck: InstanceType<typeof import('reveal.js')>
  onMount(async () => {
    const Reveal = (await import('reveal.js')).default
    deck = new Reveal({
      center: false,
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
      <div class="slides">{props.children}</div>
    </div>
  )
}
