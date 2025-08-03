import type { IconDefinition } from '@fortawesome/fontawesome-common-types'

interface FaProps {
  class?: string
  icon: IconDefinition
}

export default function Fa(props: FaProps) {
  const i = () => props.icon.icon
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${i()[0]} ${i()[1]}`}
      fill="currentColor"
      class={`inline ${props.class}`}
      height="1em"
    >
      <path d={i()[4] as string} />
    </svg>
  )
}
