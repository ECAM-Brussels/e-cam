import dedent from 'dedent-js'

type Props = {
  class?: string
  value: string
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
  return <iframe class={props.class} classList={{ 'z-20': true, relative: true }} srcdoc={code()} />
}
