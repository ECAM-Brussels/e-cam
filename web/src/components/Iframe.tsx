type IframeProps = {
  src: string
  class?: string
  loading?: 'lazy' | 'eager'
}
export default function Iframe(props: IframeProps) {
  return (
    <iframe
      loading={props.loading || 'lazy'}
      src={props.src}
      class={props.class}
      classList={{
        relative: true,
        'z-20': true,
      }}
    />
  )
}
