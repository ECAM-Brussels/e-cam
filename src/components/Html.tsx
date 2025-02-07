import dedent from 'dedent-js'

export type Props = {
  class?: string
  value: string
  tailwind?: boolean
}

export default function Html(props: Props) {
  const code = () => dedent`
    <!DOCTYPE html>
    <html>
    <style>
      html, body {
        margin: 0;
        padding: 0;
      }
      body {
        border: 1px solid white;
      }
    </style>
    ${props.tailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
    <body>
    ${props.value}
    </body>
    <script type="text/javascript">
      var ro = new ResizeObserver(entries => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          window.frameElement.style.height = cr.height + 2 + "px";
        }
      });
      ro.observe(document.body);
    </script>
    </html>
  `
  return (
    <iframe
      class={props.class}
      classList={{ 'z-20': true, relative: true, 'w-full': true }}
      srcdoc={code()}
    />
  )
}
