import Fa from './Fa'
import { faSlideshare } from '@fortawesome/free-brands-svg-icons'
import { faCalculator, faHammer, faPrint } from '@fortawesome/free-solid-svg-icons'
import { type JSXElement } from 'solid-js'

type ResourceProps = {
  children: JSXElement
  href: string
  type: 'theory' | 'exercise' | 'tool' | 'handout'
}

const icons = {
  theory: faSlideshare,
  exercise: faCalculator,
  handout: faPrint,
  tool: faHammer,
} as const

export default function Resource(props: ResourceProps) {
  return (
    <a href={props.href} class="border rounded-xl p-4 hover:bg-sky-50 no-underline">
      <Fa icon={icons[props.type]} class="text-lg mr-2" /> {props.children}
    </a>
  )
}
