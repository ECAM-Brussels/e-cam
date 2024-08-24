import SpinnerSVG from '~/assets/spinner.svg'

type SpinnerProps = {
  class?: string
}

export default function Spinner(props: SpinnerProps) {
  return (
    <img class={props.class} src={SpinnerSVG} alt="Loading..." />
  )
}
