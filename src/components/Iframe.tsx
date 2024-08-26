type IframeProps = {
  src: string
  class?: string
}
export default function Iframe(props: IframeProps) {
  return (
    <iframe
      src={props.src}
      class={props.class}
      classList={{
        relative: true,
        'z-20': true,
      }}
    />
  )
}