import dedent from 'dedent-js'
import { createResource, Suspense } from 'solid-js'
import Html, { type Props } from '~/components/Html'
import { transform } from '~/lib/repl/babel'
import Spinner from './Spinner'

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
    { initialValue: '' }
  )
  return (
    <Suspense fallback={<Spinner />}>
      <Html {...props} value={code()} />
    </Suspense>
  )
}
