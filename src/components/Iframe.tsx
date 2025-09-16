type IframeProps = {
  src: string
  class?: string
  loading?: 'lazy' | 'eager'
}
export default function Iframe(props: IframeProps) {
  const src = () => {
    const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const pdf = /\.pdf($|[?#])/i.test(props.src)
    if (safari && pdf) {
      const [base, hash] = props.src.split('#')
      return `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(base)}${hash ? `#${hash}` : ''}`
    }
    return props.src
  }
  return (
    <iframe
      loading={props.loading || 'lazy'}
      src={src()}
      class={props.class}
      classList={{
        relative: true,
        'z-20': true,
      }}
    />
  )
}
