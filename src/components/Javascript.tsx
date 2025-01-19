import dedent from 'dedent-js'
import { createResource } from 'solid-js'
import Html, { type Props } from '~/components/Html'
import { transform } from '~/lib/repl/babel'

type JavascriptProps = Props & {
  framework?: 'react' | 'solid' | 'svelte'
}

export default function Javascript(props: JavascriptProps) {
  const [code] = createResource(
    () => props.value,
    async (value: string): Promise<string> =>
      dedent`
        <script type="module">
        ${await transform(value, props.framework)}
        </script>
      `,
  )
  return <Html {...props} value={code() || ''} />
}
