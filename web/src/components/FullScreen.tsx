import { createEffect, createSignal, onMount, type JSXElement } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function FullScreen(props: {
  class?: string
  classList?: { [key: string]: boolean }
  children: JSXElement
  onChange?: (fullScreen: boolean) => void
}) {
  let container!: HTMLDivElement
  const [fullScreen, setFullScreen] = createSignal(false)
  createEffect(() => {
    props.onChange?.(fullScreen())
  })
  onMount(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && container) {
          container.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      },
      { threshold: 0.85 },
    )
    if (container) {
      observer.observe(container)
    }
    window.onscroll = () => {
      if (Math.abs(window.scrollY - container.offsetTop) < 5) {
        setFullScreen(true)
      } else {
        setFullScreen(false)
      }
    }
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        setFullScreen(true)
        setFullScreen(false)
      }
    })
  })
  return (
    <Portal>
      <div
        ref={container}
        class={props.class}
        classList={{
          'container mx-auto': !fullScreen(),
          ...props.classList,
        }}
      >
        {props.children}
      </div>
    </Portal>
  )
}
