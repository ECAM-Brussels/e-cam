import Fa from './Fa'
import { faSlideshare } from '@fortawesome/free-brands-svg-icons'
import { faCalculator } from '@fortawesome/free-solid-svg-icons'
import { type JSXElement } from 'solid-js'

type ResourceProps = {
  children: JSXElement
  href: string
  type: 'theory' | 'exercise'
}

export default function Resource(props: ResourceProps) {
  return (
    <a href={props.href} class="border rounded-xl p-4 hover:bg-sky-50 no-underline">
      <Fa icon={props.type === 'theory' ? faSlideshare : faCalculator} class="text-lg mr-2" />{' '}
      {props.children}
    </a>
  )
}
