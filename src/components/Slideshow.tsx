import { useNavigate } from '@solidjs/router'
import { onMount, type JSXElement } from 'solid-js'
import Whiteboard from '~/components/Whiteboard'

type SlideshowProps = {
  children: JSXElement
  board?: string
  hIndex: number
  vIndex: number
  url: string
}

export default function Slideshow(props: SlideshowProps) {
  const navigate = useNavigate()

  const slide = () => {
    const children = props.children
    return Array.isArray(children) ? children[props.hIndex - 1] : children
  }

  onMount(() => {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        navigate(`${props.url}/${props.hIndex + 1}`)
      } else if (event.key === 'ArrowLeft' && props.hIndex > 1) {
        navigate(`${props.url}/${props.hIndex - 1}`)
      } else if (event.key === 'ArrowUp' && props.vIndex > 1) {
        navigate(`${props.url}/${props.hIndex}/${props.vIndex - 1}`)
      } else if (event.key === 'ArrowDown') {
        navigate(`${props.url}/${props.hIndex}/${props.vIndex + 1}`)
      }
    })
  })

  return (
    <div class="bg-white w-[1920px] h-[1080px] mx-auto relative">
      {slide()}
      <Whiteboard
        class="absolute top-0 z-10"
        width={1920}
        height={1080}
        toolbarPosition="bottom"
        owner="ngy@ecam.be"
        url={props.url}
        name={`${props.board}-${props.hIndex}-${props.vIndex}`}
      />
    </div>
  )
}
